"use client";

import PageTitle from "@/components/page-title";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TxEmptyState from "@/components/views/transaction/tx-empty-state";
import TxRow from "@/components/views/transaction/tx-row";
import TxRowLoading from "@/components/views/transaction/tx-row-loading";
import { Transaction } from "@/types";
import { getTransactions } from "@/view-functions/GetTransactions";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const { account } = useWallet();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account && account.address && isLoading) {
      const fetchData = async () => {
        const txs = await getTransactions(account.address.toString()!, "vendor");
        setTransactions(txs);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [account]);

  return (
    <div>
      <PageTitle title="Transactions" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Source Token</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TxRowLoading />}
          {!isLoading && transactions.length === 0 && <TxEmptyState />}
          {transactions.map((tx) => (
            <TxRow key={tx.transactionId} {...tx} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
