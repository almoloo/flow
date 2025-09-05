import { Gateway } from "@/types";
import { FLOW_ABI } from "@/utils/flow_abi";
import { surfClient } from "@/utils/surfClient";

interface GatewayInfo {
  id: number;
  label: string;
  metadata: string;
  is_active: boolean;
}

export const getGateways = async (walletAddress: string): Promise<Array<Gateway>> => {
  const gateways = (
    await surfClient()
      .useABI(FLOW_ABI)
      .view.get_all_gateways({
        functionArguments: [walletAddress as `0x${string}`],
        typeArguments: [],
      })
      .catch((error) => {
        console.error("Failed to fetch gateways:", error);
        return [];
      })
  )[0] as GatewayInfo[];

  const modifiedGateways: Gateway[] = gateways.map((gateway: any) => ({
    gatewayId: gateway.id.toString(),
    title: gateway.label,
    url: JSON.parse(gateway.metadata).url,
    callbackUrl: JSON.parse(gateway.metadata).callbackUrl,
    active: JSON.parse(gateway.metadata).active,
    sandbox: JSON.parse(gateway.metadata).sandbox,
  }));

  return modifiedGateways;
};
