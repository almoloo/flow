import { Gateway } from "@/types";
import { getGateways } from "./getGateways";

export const getGateway = async (walletAddress: string, gatewayId: string): Promise<Gateway | null> => {
  // TODO: TEMP, WILL CHANGE LATER
  const gateways = await getGateways(walletAddress);
  const gateway = gateways.find((g) => g.gatewayId === gatewayId);
  if (gateway) {
    return gateway;
  } else {
    return null;
  }
};
