import { PrinterIcon } from "lucide-react";
import { Button } from "./ui/button";

interface PrintButtonProps {
  className?: string;
  label?: string;
}

export default function PrintButton({ label, className }: PrintButtonProps) {
  return (
    <div className={className}>
      <Button variant="default" onClick={() => window.print()}>
        <PrinterIcon className="size-5 mr-2" />
        {label || "Print"}
      </Button>
    </div>
  );
}
