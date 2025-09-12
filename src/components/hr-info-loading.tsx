import { Skeleton } from "@/components/ui/skeleton";

export default function HrInfoLoading() {
  return (
    <div className="flex flex-col space-y-5">
      {Array.from({ length: 9 }).map((_, idx) => (
        <div key={idx} className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <div className="md:w-1/4 text-slate-500">
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="md:w-3/4">
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
