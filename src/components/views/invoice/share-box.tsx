"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CopyIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface InvoiceShareBoxProps {
  invoiceId: string;
}

export default function InvoiceShareBox({ invoiceId }: InvoiceShareBoxProps) {
  const { toast } = useToast();

  const url = `${process.env.NEXT_PUBLIC_URL}/i/${invoiceId}`;

  function copyAddress() {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Success",
        description: "Invoice link copied to clipboard.",
        variant: "default",
      });
    });
  }
  return (
    <div className="flex items-center gap-5 bg-slate-100 p-5 rounded-xl border border-slate-200 print:border-black print:p-2 print:gap-2">
      <div className="bg-white p-2 aspect-square flex justify-center items-center rounded-lg">
        <QRCodeSVG value={url} size={100} title="Payment QR Code" />
      </div>
      <div className="flex flex-col gap-1 grow">
        <span className="font-medium">Payment URL</span>
        <span className="text-sm text-slate-500">Share this with your customer:</span>
        <div className="flex items-center gap-2 p-2 pl-4 bg-white/50 rounded border border-slate-200/75">
          <span className="text-ellipsis line-clamp-1 print:line-clamp-none">{url}</span>
          <Button className="ml-auto print:hidden" variant="ghost" size="icon" onClick={copyAddress}>
            <CopyIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
