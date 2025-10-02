"use client";

import PageTitle from "@/components/page-title";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import InvoiceEmptyState from "@/components/views/invoice/invoice-empty-state";
import InvoiceRow from "@/components/views/invoice/invoice-row";
import InvoiceRowLoading from "@/components/views/invoice/invoice-row-loading";
import { authenticatedGet } from "@/lib/authenticatedFetch";
import { Invoice } from "@/types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function InvoicesPage() {
  const { account } = useWallet();
  const { toast } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account && account.address && isLoading) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const inv = await authenticatedGet(`/api/invoice`);
          const jsonInv = (await inv.json()) as Invoice[];
          setInvoices(jsonInv);
        } catch (error) {
          console.error("Error fetching invoices:", error);
          toast({
            title: "Error",
            description: "There was an error fetching your invoices.",
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
      <PageTitle
        title="Invoices"
        actionIcon={<PlusIcon />}
        actionLabel="Create Invoice"
        actionUrl="/dashboard/invoices/create"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Id</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Create Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <InvoiceRowLoading />}
          {!isLoading && invoices.length === 0 && <InvoiceEmptyState />}
          {invoices.map((invoice) => (
            <InvoiceRow key={invoice.id} {...invoice} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
