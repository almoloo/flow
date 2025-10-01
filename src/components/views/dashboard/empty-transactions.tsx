import { BanknoteArrowDown } from "lucide-react";

export default function EmptyTransactions() {
  return (
    <div className="border border-dashed rounded-xl p-10 flex justify-center items-center gap-4">
      <div className="p-5 bg-slate-100 rounded-lg">
        <BanknoteArrowDown className="size-6 text-slate-600" />
      </div>
      <div className="space-y-1">
        <span className="text-lg font-medium">No transactions</span>
        <p className="text-sm text-slate-500">Transactions will appear here when they start coming in.</p>
      </div>
    </div>
  );
}
