import { InvoiceStatus } from "@/types";
import { BadgeCheckIcon, ClockIcon } from "lucide-react";
import React from "react";

interface InvoiceStatusBoxProps {
  status: InvoiceStatus;
}

export default function InvoiceStatusBox({ status }: InvoiceStatusBoxProps) {
  let boxClass = "bg-emerald-400 border border-emerald-500 text-white";
  let icon = <BadgeCheckIcon className="h-20 w-20 text-emerald-50 stroke-1" />;
  let title = "Invoice Paid";
  let description =
    "This invoice has been fully paid by the customer. The payment has been successfully processed on the Aptos network and the funds are reflected in your account balance.";

  if (status === InvoiceStatus.PENDING) {
    boxClass = "bg-orange-50 border border-orange-300 text-orange-600 print:text-black print:border-black";
    icon = <ClockIcon className="h-12 w-12 text-orange-600 print:hidden" />;
    title = "Invoice Pending Payment";
    description =
      "This invoice has not been paid yet. You can share the payment link with your customer to complete the transaction.";
  }

  return (
    <div className={`p-10 print:p-5 rounded-xl flex items-center gap-5 ${boxClass}`}>
      {icon}
      <div className="space-y-1">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
