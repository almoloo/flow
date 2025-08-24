import { Gateway } from "@/types";

// TODO: Implement actual data fetching logic
export const getGateway = async (walletAddress: string, gatewayId: string): Promise<Gateway | null> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  //   return null

  return {
    title: "Sample Gateway",
    url: "https://example.com",
    callbackUrl: "https://example.com/callback",
    active: true,
    sandbox: false,
    gatewayId: "sample-gateway-id",
  };
};
