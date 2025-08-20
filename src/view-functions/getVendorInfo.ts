export interface VendorInfo {
  address: string;
  name: string;
  email: string;
  balance: number;
}

type GetVendorInfoParams = {
  walletAddress: string;
};

export function getVendorInfo(params: GetVendorInfoParams): VendorInfo {
  return {
    address: params.walletAddress,
    email: "ali@example.com",
    name: "Ali Mousavi",
    balance: 100,
  };
}
