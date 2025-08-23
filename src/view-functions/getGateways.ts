import { Gateway } from "@/types";

type GetGatewaysInfoParams = {
  walletAddress: string;
};

// TODO: Implement actual data fetching logic
export const getGateways = async (params: GetGatewaysInfoParams): Promise<Array<Gateway>> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // return [];

  return [
    {
      title: "Sample Gateway",
      url: "https://example.com",
      callbackUrl: "https://example.com/callback",
      active: true,
      sandbox: false,
      gatewayId: "asdfad",
    },
    {
      title: "CryptoPay",
      url: "https://cryptopay.com",
      callbackUrl: "https://cryptopay.com/callback",
      active: false,
      sandbox: true,
      gatewayId: "fdhdfgnre",
    },
    {
      title: "FastGateway",
      url: "https://fastgateway.io",
      callbackUrl: "https://fastgateway.io/callback",
      active: true,
      sandbox: false,
      gatewayId: "asdgrehrtes",
    },
    {
      title: "SecurePayments",
      url: "https://securepayments.net",
      callbackUrl: "https://securepayments.net/callback",
      active: true,
      sandbox: true,
      gatewayId: "asdf34tehtr",
    },
  ];
};
