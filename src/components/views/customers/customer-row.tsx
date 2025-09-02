import { CustomerInfo, Transaction } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatAddress } from "@/lib/utils";

export default function CustomerRow(customer: CustomerInfo) {
  return (
    <TableRow>
      <TableCell>{formatAddress(customer.address)}</TableCell>
      <TableCell>{customer.transactions.length}</TableCell>
      <TableCell>{customer.email ? "✅" : ""}</TableCell>
      <TableCell className="py-0" align="right">
        <Link href={`/dashboard/customers/${customer.address}`} passHref>
          <Button size="sm" variant="ghost">
            <ChevronRightIcon className="size-5" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
