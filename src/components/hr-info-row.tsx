import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

interface HrInfoRowProps {
  label: string;
  value: string;
  fullValue?: string;
  copyable?: boolean;
}

export default function HrInfoRow({ label, value, fullValue, copyable }: HrInfoRowProps) {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
      <div className="md:w-1/4 text-slate-500 print:text-sm">{label}</div>
      <div className="md:w-3/4">
        {copyable ? (
          <Button
            variant="link"
            className="p-0 h-auto text-base"
            onClick={() => navigator.clipboard.writeText(fullValue || value)}
          >
            {fullValue ? (
              <>
                <span className="print:inline hidden">{fullValue}</span>
                <span className="print:hidden">{value}</span>
              </>
            ) : (
              value
            )}
            <CopyIcon className="size-4 print:hidden" />
          </Button>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
