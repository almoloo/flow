import { modifyGatewayInfo } from "@/lib/utils";
import { Gateway, GatewayInfo } from "@/types";
import { FLOW_ABI } from "@/utils/flow_abi";
import { surfClient } from "@/utils/surfClient";

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

  const modifiedGateways: Gateway[] = gateways.map((gateway: any) => modifyGatewayInfo(gateway));

  return modifiedGateways;
};
