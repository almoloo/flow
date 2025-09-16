import { ShortLink } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

export default function SlRow(sl: ShortLink) {
  return (
    <TableRow>
      <TableCell>{sl.id}</TableCell>
      <TableCell>{sl.amount} USDT</TableCell>
      <TableCell>{sl.gatewayId}</TableCell>
      <TableCell>
        {sl.active === "true" ? (
          <span className="text-emerald-500">Active</span>
        ) : (
          <span className="text-rose-500">Inactive</span>
        )}
      </TableCell>
      <TableCell className="py-0" align="right">
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/dashboard/short-links/${sl.id.replace("#SL", "")}/`}>
            <ChevronRightIcon className="size-5" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
