export interface VendorInfo {
  address: string;
  name: string | null;
  email: string | null;
  balance: number | null;
}

type GetVendorInfoParams = {
  walletAddress: string;
};

// TODO: Implement actual data fetching logic
export function getVendorInfo(params: GetVendorInfoParams): VendorInfo {
  return {
    address: params.walletAddress,
    email: null,
    name: null,
    balance: null,
  };

  return {
    address: params.walletAddress,
    email: "ali@example.com",
    name: "Ali Mousavi",
    balance: 100,
  };
}
