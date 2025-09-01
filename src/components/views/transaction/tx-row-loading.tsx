import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export default function TxRowLoading() {
  return (
    <>
      {[...Array(3)].map((_, idx) => (
        <TableRow key={idx}>
          {[...Array(6)].map((_, idx) => (
            <TableCell key={idx}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
