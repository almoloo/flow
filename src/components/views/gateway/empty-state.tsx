import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GatewaysEmptyState() {
  return (
    <div className="bg-slate-50 p-10 rounded-3xl flex flex-col space-y-7">
      <div className="flex flex-col space-y-2">
        <strong className="text-xl lg:text-2xl font-medium">Your first gateway is just a click away</strong>
        <p className="text-sm text-slate-500">
          Set up a gateway to receive crypto payments instantly. We’ll handle the swaps to USDT for you to get stable,
          ready-to-withdraw balances.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/gateways/create">Set Up My First Gateway</Link>
      </Button>
    </div>
  );
}
