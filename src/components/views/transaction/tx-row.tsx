import { Transaction } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

export default function TxRow(tx: Transaction) {
  let statusColor = "text-gray-500";
  if (tx.status === "completed") {
    statusColor = "text-emerald-500";
  } else if (tx.status === "failed") {
    statusColor = "text-rose-500";
  }

  return (
    <TableRow>
      <TableCell>
        {tx.targetAmount} {tx.targetCurrency}
      </TableCell>
      <TableCell>{tx.currency}</TableCell>
      <TableCell>{tx.createdAt}</TableCell>
      <TableCell>{tx.gateway.title}</TableCell>
      <TableCell className={statusColor}>{tx.status}</TableCell>
      <TableCell className="py-0" align="right">
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/dashboard/transactions/${tx.transactionId}`}>
            <ChevronRightIcon className="size-5" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
