"use client";

import PageTitle from "@/components/page-title";
import { Gateway } from "@/types";
import { getGateways } from "@/view-functions/getGateways";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingGatewaysList from "@/components/views/gateway/loading-list";
import GatewayItem from "@/components/views/gateway/gateway-item";
import GatewaysEmptyState from "@/components/views/gateway/empty-state";

export default function GatewaysPage() {
  const { account } = useWallet();

  const [gateways, setGateways] = useState<Array<Gateway>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account && account.address && isLoading) {
      const fetchData = async () => {
        const gatewayss = await getGateways({ walletAddress: account.address.toString() });
        setGateways(gatewayss);
        setIsLoading(false);
      };

      fetchData();
    }
  }, [account]);

  return (
    <div>
      <PageTitle
        title="Gateways"
        actionIcon={<PlusIcon />}
        actionLabel="Create Gateway"
        actionUrl="/dashboard/gateways/create"
      />
      <div className="flex flex-col space-y-2">
        {isLoading ? (
          <LoadingGatewaysList />
        ) : gateways.length > 0 ? (
          gateways.map((gateway) => (
            <GatewayItem key={gateway.gatewayId} gateway={gateway} walletAddress={account?.address.toString()!} />
          ))
        ) : (
          <GatewaysEmptyState />
        )}
      </div>
    </div>
  );
}
