"use client";

import PageTitle from "@/components/page-title";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CustomerEmptyState from "@/components/views/customers/customer-empty-state";
import CustomerRow from "@/components/views/customers/customer-row";
import CustomerRowLoading from "@/components/views/customers/customer-row-loading";
import { CustomerInfo } from "@/types";
import { getCustomers } from "@/view-functions/getCustomers";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      const fetchData = async () => {
        const cstmrs = await getCustomers();
        setCustomers(cstmrs);
        setIsLoading(false);
      };
      fetchData();
    }
  }, []);

  return (
    <div>
      <PageTitle title="Customers" />
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
