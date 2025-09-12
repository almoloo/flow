import { TableCell, TableRow } from "@/components/ui/table";

export default function CustomerEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center w-full p-5">
        <p className="text-gray-500">No customers found</p>
      </TableCell>
    </TableRow>
  );
}
