"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAddress } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function WalletStatus() {
  const { connected, isLoading, account, disconnect } = useWallet();

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-24 h-6" />
      </div>
    );
  }

  if (!connected) {
    return <div className="text-xs font-medium text-slate-500">Not Connected</div>;
  }

  if (connected && account) {
    return (
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs font-medium">{formatAddress(account?.address.toString())}</span>
        <Button variant="link" size="sm" className="p-0 h-auto text-xs text-indigo-500" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }
}
