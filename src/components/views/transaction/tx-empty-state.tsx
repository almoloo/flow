import { TableCell, TableRow } from "@/components/ui/table";

export default function TxEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center w-full p-5">
        <p className="text-gray-500">No transactions found</p>
      </TableCell>
    </TableRow>
  );
}
