import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance";

interface VendorInfo {
  balance: string | null;
  name: string | null;
  address: string | null;
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
        avatar: null,
        loading: false,
        error: null,
      });
      return;
    }

    setVendorInfo((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch balance using existing view function
      const balance = await getAccountAPTBalance({ accountAddress: account.address.toString() });

      // TODO: Implement name fetching from database or contract
      // const name = await fetchVendorName(account.address.toString());
      const name = null; // Placeholder

      setVendorInfo({
        balance: balance.toString(),
        name,
        address: account.address.toString(),
        avatar: null,
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
