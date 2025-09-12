import { Gateway } from "@/types";
import { surfClient } from "@/utils/surfClient";
import { FLOW_ABI } from "@/utils/flow_abi";
import { GatewayInfo } from "@/types";
import { modifyGatewayInfo } from "@/lib/utils";

export const getGateway = async (walletAddress: string, gatewayId: string): Promise<Gateway | null> => {
  try {
    const gateway = (
      await surfClient()
        .useABI(FLOW_ABI)
        .view.get_gateway_by_id({
          functionArguments: [walletAddress as `0x${string}`, Number(gatewayId)],
          typeArguments: [],
        })
        .catch(() => {
          return [null];
        })
    )[0] as GatewayInfo;
    if (gateway) {
      return modifyGatewayInfo(gateway);
    } else {
      throw new Error("Gateway not found");
    }
  } catch (error) {
    console.error("Failed to fetch gateway:", error);
    return null;
  }
};
