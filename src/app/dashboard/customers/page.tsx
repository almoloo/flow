"use client";

import PageTitle from "@/components/page-title";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import CustomerEmptyState from "@/components/views/customers/customer-empty-state";
import CustomerRow from "@/components/views/customers/customer-row";
import CustomerRowLoading from "@/components/views/customers/customer-row-loading";
import { authenticatedGet, authenticatedPost } from "@/lib/authenticatedFetch";
import { Customer, CustomerInfo } from "@/types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CloudDownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const { account } = useWallet();
  const { toast } = useToast();

  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account && account.address && isLoading) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await authenticatedGet(`/api/customer`);
          const jsonCustomers = (await res.json()) as CustomerInfo[];
          setCustomers(jsonCustomers);
        } catch (error) {
          console.error("Error fetching customers:", error);
          toast({
            title: "Error",
            description: "There was an error fetching your customers.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <div>
      <PageTitle
        title="Customers"
        actionLabel="Export to CSV"
        actionIcon={<CloudDownloadIcon />}
        actionOnClick={async () => {
          if (account && account.address) {
            const res = await authenticatedGet(`/api/customer/export`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `customers_${account.address}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
        }}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Email</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <CustomerRowLoading />}
          {!isLoading && customers.length === 0 && <CustomerEmptyState />}
          {customers.map((customer) => (
            <CustomerRow key={customer.address} {...customer} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
