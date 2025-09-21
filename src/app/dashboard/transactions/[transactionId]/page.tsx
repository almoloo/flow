"use client";

import HrInfoLoading from "@/components/hr-info-loading";
import HrInfoRow from "@/components/hr-info-row";
import PageTitle from "@/components/page-title";
import PrintButton from "@/components/print-button";
import { useToast } from "@/components/ui/use-toast";
import { authenticatedGet } from "@/lib/authenticatedFetch";
import { formatAddress, getTokenInfo } from "@/lib/utils";
import type { Transaction } from "@/types";
import { useEffect, useState } from "react";

interface TransactionPageProps {
  params: {
    transactionId: string;
    vendorId: string;
  };
}

export default function TransactionPage({ params }: TransactionPageProps) {
  const { transactionId } = params;
  const { toast } = useToast();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true);
      try {
        const response = await authenticatedGet(`/api/transaction/id/${transactionId}`);
        const jsonResponse = (await response.json()) as Transaction;
        setTransaction(jsonResponse);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast({
          title: "Error",
          description: "There was an error fetching the transaction details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  return (
    <div>
      <PageTitle title="Transactions" segment={formatAddress(params.transactionId)} />
      <div className="flex flex-col space-y-5">
        {isLoading ? (
          <HrInfoLoading />
        ) : transaction ? (
          <>
            <HrInfoRow
              label="TXID"
              value={formatAddress(transaction.transactionId)}
              copyable
              fullValue={transaction.transactionId}
            />
            <HrInfoRow label="Type" value={`${transaction.type} payment`} />
            <HrInfoRow label="Gateway" value={transaction.gateway.title} />
            <HrInfoRow label="Date" value={`${transaction.createdAt} UTC`} />
            <HrInfoRow
              label="Wallet"
              value={formatAddress(transaction.vendorAddress)}
              copyable
              fullValue={transaction.vendorAddress}
            />
            {transaction.customer?.email && (
              <HrInfoRow label="Customer Email" value={transaction.customer?.email!} copyable />
            )}
            <HrInfoRow
              label="Paid Amount"
              value={`${transaction.amount} ${getTokenInfo(transaction.currency)?.symbol || transaction.currency}`}
            />
            <HrInfoRow
              label="Received Amount"
              value={`${transaction.targetAmount} ${getTokenInfo(transaction.targetCurrency)?.symbol || transaction.targetCurrency}`}
            />
            <HrInfoRow label="Payer Fee" value={`${transaction.fee} APT`} />

            <div className="pt-10 print:hidden">
              <PrintButton label="Print Receipt" />
            </div>
          </>
        ) : (
          <div>No transaction found.</div>
        )}
      </div>
    </div>
  );
}
