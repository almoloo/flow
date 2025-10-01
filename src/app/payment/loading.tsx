import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
      <LoaderIcon className="size-8 animate-spin" />
    </div>
  );
}
