import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingGatewaysList() {
  return Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />);
}
