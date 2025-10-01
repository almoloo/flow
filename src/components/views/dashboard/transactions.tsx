"use client";

import { authenticatedGet } from "@/lib/authenticatedFetch";
import { Transaction } from "@/types";
import { useEffect, useState } from "react";
import EmptyTransactions from "./empty-transactions";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TxRow from "../transaction/tx-row";
import { useToast } from "@/components/ui/use-toast";
import TxRowLoading from "../transaction/tx-row-loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

export default function TransactionsBox() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const txData = await authenticatedGet("/api/transaction?count=5").then((res) => res.json());
      setTransactions(txData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transactions.length === 0 && !isLoading) {
      fetchTransactions();
    }
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Latest Transactions</h3>
      {transactions.length === 0 && !isLoading ? (
        <EmptyTransactions />
      ) : (
        <>
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
              {/* {!isLoading && transactions.length === 0 && <TxEmptyState />} */}
              {transactions.map((tx) => (
                <TxRow key={tx.paymentId} {...tx} />
              ))}
            </TableBody>
          </Table>
          {transactions.length > 0 && !isLoading && (
            <div className="flex justify-end">
              <Button variant="link" className="" asChild>
                <Link href="/dashboard/transactions">
                  View All Transactions
                  <ArrowUpRightIcon className="size-4 inline-block ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
