"use client";

import PageTitle from "@/components/page-title";
import { formatAddress } from "@/lib/utils";
import { CustomerInfo } from "@/types";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import HrInfoLoading from "@/components/hr-info-loading";
import HrInfoRow from "@/components/hr-info-row";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TxRowLoading from "@/components/views/transaction/tx-row-loading";
import TxEmptyState from "@/components/views/transaction/tx-empty-state";
import TxRow from "@/components/views/transaction/tx-row";
import { authenticatedGet } from "@/lib/authenticatedFetch";

interface CustomerInfoPageProps {
  params: {
    walletAddress: string;
  };
}

export default function CustomerInfoPage({ params }: CustomerInfoPageProps) {
  const { walletAddress } = params;
  const { account } = useWallet();
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account && account.address && walletAddress) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await authenticatedGet(`/api/customer/${walletAddress}`);
          if (res.status === 404) {
            notFound();
            return;
          }
          const jsonCustomer = (await res.json()) as CustomerInfo;
          setCustomer(jsonCustomer);
        } catch (error) {
          console.error("Error fetching customer info:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [walletAddress, account]);

  return (
    <div>
      <PageTitle title="Customer Information" segment={formatAddress(walletAddress)} />
      <div className="flex flex-col space-y-5">
        {isLoading ? (
          <HrInfoLoading />
        ) : customer ? (
          <>
            <HrInfoRow label="Wallet Address" value={formatAddress(customer.address, 10)} copyable />
            <HrInfoRow label="Transactions" value={customer.transactions.length.toString()} />
            <HrInfoRow label="Total Spent" value={`${customer.totalSpent} USDT`} />
            {customer.email && <HrInfoRow label="Email" value={customer.email} copyable />}
          </>
        ) : (
          <div>Customer not found</div>
        )}
      </div>
      <div className="flex flex-col space-y-5 mt-10">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Source Token</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TxRowLoading />}
            {!isLoading && customer?.transactions.length === 0 && <TxEmptyState />}
            {customer?.transactions.map((tx) => (
              <TxRow key={tx.transactionId} {...tx} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
