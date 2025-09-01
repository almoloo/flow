import { Gateway } from "@/types";

// TODO: Implement actual data setting logic
export const createGateway = async (walletAddress: string, data: Partial<Gateway>) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const gatewayId = "new-gateway-id";

  return {
    ...data,
    gatewayId,
  };
};
