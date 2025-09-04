import { Vendor } from "@/types";
import { FLOW_ABI } from "@/utils/flow_abi";
import { surfClient } from "@/utils/surfClient";

export const getVendorInfo = async (walletAddress: string): Promise<Vendor | null> => {
  const vendor = await surfClient()
    .useABI(FLOW_ABI)
    .view.get_vendor_info({
      functionArguments: [walletAddress as `0x${string}`],
      typeArguments: [],
    })
    .catch((error) => {
      console.error("Failed to fetch vendor info:", error);
      return null;
    });

  if (vendor) {
    const dbVendorInfo = await fetch(`/api/vendor/${walletAddress}`);
    const dbVendor = await dbVendorInfo.json();

    return {
      address: walletAddress,
      name: vendor[1],
      balance: vendor[2],
      email: dbVendor.email ?? "",
      avatar: dbVendor.avatar ?? "",
    };
  } else {
    return null;
  }
};
