"use client";

import PayButton from "@/components/views/payment/pay-button";
import PaymentInfo from "@/components/views/payment/payment-info";
import { Token, Transaction, TransactionStatus, TransactionType } from "@/types";
import { LoaderIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FLOW_ABI } from "@/utils/flow_abi";
import { useEffect, useState } from "react";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { availableTokens, NETWORK } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { addNewCustomer, addNewTransaction, createCallbackUrl } from "@/lib/utils";
import { useGatewayInfo } from "@/hooks/useGatewayInfo";
import StatusButton from "@/components/views/payment/status-button";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connected, account } = useWallet();
  const { client } = useWalletClient();

  const vendorAddress = searchParams.get("va");
  const gatewayId = Number(searchParams.get("gid"));
  const amount = parseFloat(searchParams.get("amount") || "0"); // IN USDT

  useEffect(() => {
    if (!vendorAddress || !gatewayId || !amount) {
      router.replace("/404");
    }
  }, [vendorAddress, gatewayId, amount, router]);

  if (!vendorAddress || !gatewayId || !amount) {
    return null;
  }

  const [status, setStatus] = useState<"initial" | "success" | "failed">("initial");
  const { gateway, loading: gatewayInfoLoading } = useGatewayInfo(vendorAddress, gatewayId.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [sourceAmount, setSourceAmount] = useState<number | null>(null);
  const [sourceToken, setSourceToken] = useState<Token | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  const [paymentId] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const [customerEmail, setCustomerEmail] = useState("");
  const [txid, setTxid] = useState<string | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

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
      // const swapRate = await sdk.Swap.calculateRates({
      //   fromToken: token.address,
      //   toToken: tetherInfo!.address,
      //   amount: convertValueToDecimal(amount, tetherInfo!.decimals),
      //   curveType: "uncorrelated",
      //   interactiveToken: "from",
      // });
      // console.log("Swap rate:", swapRate);
      const swapRate = await fetchSwapRate(token.symbol, amount);
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

    // const client = aptosClient();
    // const tx = await client.createTransaction({
    //   kind: "pay",
    //   from: account.address.toString(),
    //   to: sourceToken.address,
    //   amount: BigInt(amount || "0"),
    //   fee: BigInt(fee || "0"),
    // });

    // console.log("Transaction created:", tx);

    // const reg = await client?.useABI(FLOW_ABI).register_vendor({ type_arguments: [], arguments: [] });
    // console.log("Register vendor tx:", reg);

    const aptosAddress = availableTokens[NETWORK].find((t) => t.symbol === "APT")?.address;
    const tetherInfo = availableTokens[NETWORK].find((t) => t.symbol === "USDT");

    let transaction: Partial<Transaction> = {
      paymentId,
      amount:
        sourceToken.address === tetherInfo?.address ? sourceAmount.toString() : (sourceAmount * 0.000001).toString(),
      currency: sourceToken.symbol,
      targetAmount: amount.toString(),
      targetCurrency: "USDT",
      vendorAddress: vendorAddress?.toLowerCase(),
      customer: {
        address: account.address.toString(),
      },
      gateway: {
        gatewayId: gatewayId.toString(),
      },
      fee: (fee || 0).toString(),
      type: TransactionType.GATEWAY,
    };

    try {
      setIsLoading(true);
      let tx;

      if (sourceToken.address === aptosAddress) {
        // PAY WITH APT
        tx = await client?.useABI(FLOW_ABI).pay_to_vendor_apt({
          type_arguments: [],
          arguments: [vendorAddress as `0x${string}`, BigInt(gatewayId), BigInt(paymentId), BigInt(sourceAmount * 100)],
        });
        console.log("Pay APT tx:", tx);
      } else if (sourceToken.address === tetherInfo?.address) {
        // PAY WITH USDT
        tx = await client?.useABI(FLOW_ABI).pay_to_vendor({
          type_arguments: [],
          arguments: [vendorAddress as `0x${string}`, BigInt(gatewayId), BigInt(paymentId), BigInt(sourceAmount)],
        });
        console.log("PAY USDT", tx);
      } else {
        // PAY WITH TOKEN
        tx = await client?.useABI(FLOW_ABI).pay_to_vendor_token({
          type_arguments: [],
          arguments: [
            vendorAddress as `0x${string}`,
            BigInt(gatewayId),
            BigInt(paymentId),
            sourceToken.symbol,
            Math.floor(sourceAmount * Math.pow(10, sourceToken.decimals || 8)),
          ],
        });
        console.log("PAY TOKEN", tx);
      }

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
    }
  }

  return (
    <div className="relative flex flex-col grow gap-10 mx-10 lg:mx-20">
      {(isLoading || gatewayInfoLoading) && (
        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
          <LoaderIcon className="size-8 animate-spin" />
        </div>
      )}
      <PaymentInfo
        amount={amount}
        status={status}
        sourceAmount={sourceAmount || undefined}
        sourceToken={sourceToken || undefined}
        fee={fee || undefined}
        txid={txid || undefined}
        // reward={3.5}
      />
      {status === "initial" ? (
        <PayButton
          amount={amount}
          updateToken={updateToken}
          fee={fee}
          sourceAmount={sourceAmount}
          sourceToken={sourceToken}
          handlePayment={onPay}
          customerEmail={customerEmail}
          setCustomerEmail={setCustomerEmail}
          loadingPrices={isLoadingPrices}
        />
      ) : (
        <StatusButton
          status={status}
          callbackUrl={createCallbackUrl(gateway?.callbackUrl!, {
            paymentId,
            txid: txid!,
            amount,
          })}
        />
      )}
    </div>
  );
}
