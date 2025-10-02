import { Invoice, InvoiceStatus } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatAddress } from "@/lib/utils";

export default function InvoiceRow(invoice: Invoice) {
  let statusColor = "text-gray-500";
  if (invoice.status === InvoiceStatus.COMPLETED) {
    statusColor = "text-emerald-500";
  } else if (invoice.status === InvoiceStatus.PENDING) {
    statusColor = "text-orange-500";
  }

  return (
    <TableRow>
      <TableCell>{formatAddress(invoice.id)}</TableCell>
      <TableCell>{invoice.amount} USDT</TableCell>
      <TableCell>
        <time dateTime={invoice.createDate}>{invoice.createDate} UTC</time>
      </TableCell>
      <TableCell className={statusColor}>{invoice.status}</TableCell>
      <TableCell className="py-0" align="right">
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/dashboard/invoices/${invoice.id}`}>
            <ChevronRightIcon className="size-5" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
