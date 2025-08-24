import { Skeleton } from "@/components/ui/skeleton";

function FieldBlock() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export default function LoadingGatewayForm() {
  return (
    <div className="flex flex-col space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <FieldBlock key={i} />
      ))}
      <Skeleton className="h-20 w-full" />
      <div className="flex justify-end">
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
}
