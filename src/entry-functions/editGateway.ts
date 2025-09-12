import { Gateway } from "@/types";

// TODO: Implement actual data setting logic
export const editGateway = async (_walletAddress: string, gatewayId: string, data: Partial<Gateway>) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    ...data,
    gatewayId,
  };
};
