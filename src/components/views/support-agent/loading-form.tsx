import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingAgentForm() {
  return (
    <div>
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-20 w-full mb-4" />
      <Skeleton className="h-24 w-full mb-4" />
      <Skeleton className="h-8 w-32 mb-4" />
      <div className="flex justify-end">
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
}
