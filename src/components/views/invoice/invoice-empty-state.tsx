import { TableCell, TableRow } from "@/components/ui/table";

export default function InvoiceEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center w-full p-5">
        <p className="text-gray-500">No invoices found</p>
      </TableCell>
    </TableRow>
  );
}
