"use client";

import PageTitle from "@/components/page-title";
import PrintButton from "@/components/print-button";
import TxInfoLoading from "@/components/views/transaction/tx-info-loading";
import TxInfoRow from "@/components/views/transaction/tx-info-row";
import { formatAddress } from "@/lib/utils";
import type { Transaction } from "@/types";
import { getTransaction } from "@/view-functions/getTransaction";
import { useEffect, useState } from "react";

interface TransactionPageProps {
  params: {
    transactionId: string;
    vendorId: string;
  };
}

export default function TransactionPage({ params }: TransactionPageProps) {
  const { transactionId, vendorId } = params;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true);
      try {
        const response = await getTransaction(vendorId, transactionId);
        setTransaction(response);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  return (
    <div>
      <PageTitle title="Transactions" segment={params.transactionId} />
      <div className="flex flex-col space-y-5">
        {isLoading ? (
          <TxInfoLoading />
        ) : transaction ? (
          <>
            <TxInfoRow label="TXID" value={formatAddress(transaction.transactionId)} copyable />
            <TxInfoRow label="Type" value={`${transaction.type} payment`} />
            <TxInfoRow label="Gateway" value={transaction.gateway.title} />
            <TxInfoRow label="Date" value={transaction.createdAt} />
            <TxInfoRow label="Wallet" value={formatAddress(transaction.vendorAddress)} copyable />
            {transaction.customer.email && (
              <TxInfoRow label="Customer Email" value={transaction.customer.email} copyable />
            )}
            <TxInfoRow label="Paid Amount" value={`${transaction.amount} ${transaction.currency}`} />
            <TxInfoRow label="Received Amount" value={`${transaction.targetAmount} ${transaction.targetCurrency}`} />
            <TxInfoRow label="Payer Fee" value={`${transaction.fee} APT`} />

            <div className="pt-10">
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
