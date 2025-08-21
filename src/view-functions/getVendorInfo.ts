import { Vendor } from "@/types";

type GetVendorInfoParams = {
  walletAddress: string;
};

// TODO: Implement actual data fetching logic
export const getVendorInfo = async (params: GetVendorInfoParams): Promise<Vendor | null> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // return null;

  return {
    address: params.walletAddress,
    email: "ali@example.com",
    name: "Ali Mousavi",
    balance: "100",
  };
};
