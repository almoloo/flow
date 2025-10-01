import { Transaction } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { getTokenInfo } from "@/lib/utils";

export default function TxRow(tx: Transaction) {
  let statusColor = "text-gray-500";
  if (tx.status === "completed") {
    statusColor = "text-emerald-500";
  } else if (tx.status === "failed") {
    statusColor = "text-rose-500";
  }

  const sourceCurrency = getTokenInfo(tx.currency);
  const targetCurrency = getTokenInfo(tx.targetCurrency);

  return (
    <TableRow>
      <TableCell>
        {tx.targetAmount} {targetCurrency?.symbol || tx.targetCurrency}
      </TableCell>
      <TableCell>{sourceCurrency?.symbol || tx.currency}</TableCell>
      <TableCell>{tx.gateway.title}</TableCell>
      <TableCell>
        <time dateTime={tx.createdAt}>{tx.createdAt} UTC</time>
      </TableCell>
      <TableCell className={statusColor}>{tx.status}</TableCell>
      <TableCell className="py-0" align="right">
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/dashboard/transactions/${tx.paymentId}`}>
            <ChevronRightIcon className="size-5" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
