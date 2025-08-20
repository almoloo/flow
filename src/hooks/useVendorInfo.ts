import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getVendorInfo } from "@/view-functions/getVendorInfo";

interface VendorInfo {
  balance: string | null;
  name: string | null;
  address: string | null;
  email: string | null;
  avatar: string | null;
  loading: boolean;
  error: string | null;
}

export function useVendorInfo() {
  const { account, connected } = useWallet();
  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    balance: null,
    name: null,
    address: null,
    email: null,
    avatar: null,
    loading: false,
    error: null,
  });

  const fetchVendorInfo = useCallback(async () => {
    if (!account?.address || !connected) {
      setVendorInfo({
        balance: null,
        name: null,
        address: null,
        email: null,
        avatar: null,
        loading: false,
        error: null,
      });
      return;
    }

    setVendorInfo((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const vendorInfo = getVendorInfo({ walletAddress: account.address.toString() });

      // TODO: Implement name fetching from database or contract
      // const name = await fetchVendorName(account.address.toString());

      setVendorInfo({
        balance: vendorInfo.balance.toString(),
        name: vendorInfo.name,
        address: vendorInfo.address,
        email: vendorInfo.email,
        avatar: `/api/avatar/vendor/${vendorInfo.address}`,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Failed to fetch vendor info:", error);
      setVendorInfo((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch vendor info",
      }));
    }
  }, [account?.address, connected]);

  useEffect(() => {
    fetchVendorInfo();
  }, [fetchVendorInfo]);

  const refresh = useCallback(() => {
    fetchVendorInfo();
  }, [fetchVendorInfo]);

  return {
    ...vendorInfo,
    refresh,
    isConnected: connected,
  };
}

// FIXME: IF DATABASE
// async function fetchVendorName(address: string): Promise<string | null> {
//   try {
//     // Fetch from your MongoDB database or smart contract
//     // Example: const response = await fetch(`/api/vendor/${address}`);
//     // const data = await response.json();
//     // return data.name;
//     return null;
//   } catch (error) {
//     console.error("Failed to fetch vendor name:", error);
//     return null;
//   }
// }
