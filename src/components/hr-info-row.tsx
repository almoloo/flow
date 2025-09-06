import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

interface HrInfoRowProps {
  label: string;
  value: string;
  copyable?: boolean;
}

export default function HrInfoRow({ label, value, copyable }: HrInfoRowProps) {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
      <div className="md:w-1/4 text-slate-500">{label}</div>
      <div className="md:w-3/4">
        {copyable ? (
          <Button variant="link" className="p-0 h-auto text-base">
            {value}
            <CopyIcon className="size-4" />
          </Button>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
