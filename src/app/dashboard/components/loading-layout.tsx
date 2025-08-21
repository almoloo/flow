import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingLayout() {
  return (
    <>
      <div className="lg:col-span-3 flex flex-col space-y-1">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="lg:col-span-9 flex flex-col space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full">
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
