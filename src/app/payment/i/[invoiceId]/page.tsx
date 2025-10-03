"use client";

import PayButton from "@/components/views/payment/pay-button";
import PaymentInfo from "@/components/views/payment/payment-info";
import { Invoice, Token, Transaction, TransactionStatus, TransactionType } from "@/types";
import { LoaderIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { FLOW_ABI } from "@/utils/flow_abi";
import { useEffect, useState } from "react";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { availableTokens, NETWORK } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { addNewCustomer, addNewTransaction, sendNotification, setInvoicePaid } from "@/lib/utils";

interface InvoicePaymentPageProps {
  params: {
    invoiceId: string;
  };
}

export default function InvoicePaymentPage({ params }: InvoicePaymentPageProps) {
  const { connected, account } = useWallet();
  const { client } = useWalletClient();

  const { invoiceId } = params;

  const [invoice, setInvoice] = useState<Partial<Invoice> | null>(null);
  const [status, setStatus] = useState<"initial" | "success" | "failed">("initial");
  const [isLoading, setIsLoading] = useState(true);
  const [sourceAmount, setSourceAmount] = useState<number | null>(null);
  const [sourceToken, setSourceToken] = useState<Token | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  const [paymentId] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const [customerEmail, setCustomerEmail] = useState("");
  const [txid, setTxid] = useState<string | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [vendorAddress, setVendorAddress] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/invoice/${invoiceId}`);
        if (res.status === 404) {
          notFound();
          return;
        }
        const jsonInvoice = await res.json();
        setInvoice(jsonInvoice as Partial<Invoice>);
      } catch (error) {
        console.error("Error fetching invoice info:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvoice();
  }, []);

  useEffect(() => {
    console.log("INVOICE", invoice);
    if (invoice && invoice.amount && invoice.vendorAddress) {
      setAmount(Number(invoice.amount));
      setVendorAddress(invoice.vendorAddress);
    }
  }, [invoice]);

  async function fetchSwapRate(to: string, amount: number) {
    setIsLoadingPrices(true);
    try {
      const response = await fetch(`/api/calculate?to=${to}&amount=${amount}`);
      const data = await response.json();
      if (response.ok) {
        return data.rate;
      } else {
        console.error("Error fetching swap rate:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Network error fetching swap rate:", error);
      return null;
    } finally {
      setIsLoadingPrices(false);
    }
  }

  async function updateToken(token: Token) {
    const tetherInfo = availableTokens[NETWORK].find((t) => t.symbol === "USDT");
    setSourceToken(token);

    if (token.address === tetherInfo?.address) {
      setSourceAmount(amount);
      setFee(0);
      return;
    } else {
      const swapRate = await fetchSwapRate(token.symbol, amount!);
      if (!swapRate) {
        setSourceAmount(null);
        setFee(null);
        return;
      }

      setSourceAmount(swapRate);
      // TODO: set fee
    }
  }

  async function onPay() {
    if (!connected || !account || !sourceToken || !sourceAmount || isLoading) return;

    const tetherInfo = availableTokens[NETWORK].find((t) => t.symbol === "USDT");

    let transaction: Partial<Transaction> = {
      paymentId,
      amount:
        sourceToken.address === tetherInfo?.address ? sourceAmount.toString() : (sourceAmount * 0.000001).toString(),
      currency: sourceToken.symbol,
      targetAmount: amount?.toString(),
      targetCurrency: "USDT",
      vendorAddress: vendorAddress?.toLowerCase(),
      customer: {
        address: account.address.toString(),
      },
      fee: (fee || 0).toString(),
      type: TransactionType.INVOICE,
    };

    try {
      setIsLoading(true);
      const tx = await client?.useABI(FLOW_ABI).pay_to_invoice({
        type_arguments: [],
        arguments: [
          vendorAddress as `0x${string}`,
          BigInt(paymentId),
          sourceToken.symbol,
          sourceToken.address === tetherInfo?.address
            ? sourceAmount
            : Math.floor(sourceAmount * Math.pow(10, sourceToken.decimals || 8)),
        ],
      });
      console.log("PAY TOKEN", tx);

      await aptosClient().waitForTransaction({
        transactionHash: tx!.hash,
      });

      await addNewCustomer(vendorAddress!, account.address.toString(), customerEmail);

      transaction.transactionId = tx?.hash;
      transaction.status = TransactionStatus.COMPLETED;
      setTxid(tx?.hash || null);
      setStatus("success");
    } catch (e) {
      console.error("Payment error:", e);
      transaction.status = TransactionStatus.FAILED;
      setStatus("failed");
    } finally {
      setIsLoading(false);
      await addNewTransaction(transaction);
      await setInvoicePaid(invoiceId, paymentId, transaction.transactionId || "");
      await sendNotification(
        "New Invoice Payment",
        `You have received a new payment for invoice ${invoice?.id || ""}.`,
        vendorAddress!.toLowerCase(),
      );
    }
  }

  return (
    <div className="relative flex flex-col grow gap-10 mx-10 lg:mx-20">
      {isLoading ? (
        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
          <LoaderIcon className="size-8 animate-spin" />
        </div>
      ) : (
        <>
          <PaymentInfo
            amount={amount!}
            status={status}
            sourceAmount={sourceAmount || undefined}
            sourceToken={sourceToken || undefined}
            fee={fee || undefined}
            txid={txid || undefined}
          />

          {status === "initial" && (
            <PayButton
              amount={amount!}
              updateToken={updateToken}
              fee={fee}
              sourceAmount={sourceAmount}
              sourceToken={sourceToken}
              handlePayment={onPay}
              customerEmail={customerEmail}
              setCustomerEmail={setCustomerEmail}
              loadingPrices={isLoadingPrices}
            />
          )}
        </>
      )}
    </div>
  );
}
