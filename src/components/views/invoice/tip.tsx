import { ReceiptIcon } from "lucide-react";

function ListItem({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-l-4 border-slate-300 pl-3 flex flex-col space-y-1">
      <h4 className="font-medium">{title}</h4>
      {description && <p className="text-sm text-slate-600">{description}</p>}
    </div>
  );
}

export default function TipBox() {
  return (
    <div className="border border-x-blue-200 bg-blue-50 rounded-2xl p-7 space-y-7">
      <div className="space-y-3">
        <h2 className="flex items-center gap-3 text-xl font-semibold">
          <ReceiptIcon className="size-7 text-blue-500" />
          <span>Simple Payment Requests</span>
        </h2>
        <p>
          Create standalone, one-time invoices that don’t require setting up a gateway or callback URL. Just enter the
          amount and customer email — we’ll handle sending a secure payment link directly to your customer.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Why use one-time invoices?</h3>
        <ListItem title="No gateway setup needed — perfect for quick or manual orders." />
        <ListItem title="Each invoice is unique and can only be paid once." />
        <ListItem title="Customers receive an email with payment instructions and a link." />
        <ListItem title="Easy to track and manage all your invoices in one place." />
      </div>
    </div>
  );
}
