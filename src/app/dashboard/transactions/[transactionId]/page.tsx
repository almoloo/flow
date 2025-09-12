"use client";

import HrInfoLoading from "@/components/hr-info-loading";
import HrInfoRow from "@/components/hr-info-row";
import PageTitle from "@/components/page-title";
import PrintButton from "@/components/print-button";
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
          <HrInfoLoading />
        ) : transaction ? (
          <>
            <HrInfoRow label="TXID" value={formatAddress(transaction.transactionId)} copyable />
            <HrInfoRow label="Type" value={`${transaction.type} payment`} />
            <HrInfoRow label="Gateway" value={transaction.gateway.title} />
            <HrInfoRow label="Date" value={transaction.createdAt} />
            <HrInfoRow label="Wallet" value={formatAddress(transaction.vendorAddress)} copyable />
            {transaction.customer.email && (
              <HrInfoRow label="Customer Email" value={transaction.customer.email} copyable />
            )}
            <HrInfoRow label="Paid Amount" value={`${transaction.amount} ${transaction.currency}`} />
            <HrInfoRow label="Received Amount" value={`${transaction.targetAmount} ${transaction.targetCurrency}`} />
            <HrInfoRow label="Payer Fee" value={`${transaction.fee} APT`} />

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
