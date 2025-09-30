"use client";

import PageTitle from "@/components/page-title";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import TxEmptyState from "@/components/views/transaction/tx-empty-state";
import TxRow from "@/components/views/transaction/tx-row";
import TxRowLoading from "@/components/views/transaction/tx-row-loading";
import { authenticatedGet } from "@/lib/authenticatedFetch";
import { Transaction } from "@/types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const { account } = useWallet();
  const { toast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account && account.address && isLoading) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const txs = await authenticatedGet(`/api/transaction`);
          const jsonTxs = (await txs.json()) as Transaction[];
          setTransactions(jsonTxs);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          toast({
            title: "Error",
            description: "There was an error fetching your transactions.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
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
            <TableHead>Gateway</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TxRowLoading />}
          {!isLoading && transactions.length === 0 && <TxEmptyState />}
          {transactions.map((tx) => (
            <TxRow key={tx.paymentId} {...tx} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
