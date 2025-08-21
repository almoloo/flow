import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getVendorInfo } from "@/view-functions/getVendorInfo";
import { generateAvatarUrl } from "@/lib/utils";
import { Vendor } from "@/types";

interface VendorInfo {
  vendor: Vendor | null;
  loading: boolean;
  error: string | null;
}

/**
 * React hook to fetch and manage vendor information based on the connected wallet account.
 *
 * This hook retrieves vendor details such as balance, name, address, email, and avatar
 * for the currently connected wallet. It provides loading and error states, and exposes
 * a `refresh` method to manually re-fetch the vendor information.
 *
 * @returns An object containing:
 * - `balance`: The vendor's balance as a string or `null`.
 * - `name`: The vendor's name or `null`.
 * - `address`: The wallet address as a string or `null`.
 * - `email`: The vendor's email or `null`.
 * - `avatar`: The generated avatar URL or `null`.
 * - `loading`: Boolean indicating if the data is being loaded.
 * - `error`: Error message if fetching fails, otherwise `null`.
 * - `refresh`: Function to manually refresh the vendor info.
 * - `isConnected`: Boolean indicating if the wallet is connected.
 *
 * @example
 * const { name, balance, loading, error, refresh, isConnected } = useVendorInfo();
 */
export function useVendorInfo() {
  const { account, connected } = useWallet();
  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    vendor: null,
    loading: false,
    error: null,
  });

  const fetchVendorInfo = useCallback(async () => {
    if (!account?.address || !connected) {
      setVendorInfo({
        vendor: null,
        loading: false,
        error: null,
      });
      return;
    }

    setVendorInfo((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const vendorInfo = await getVendorInfo({ walletAddress: account.address.toString() });

      if (!vendorInfo) {
        throw new Error("Vendor name not found");
      }

      setVendorInfo({
        vendor: {
          balance: vendorInfo.balance ? vendorInfo.balance.toString() : "0",
          name: vendorInfo.name,
          address: account.address.toString(),
          email: vendorInfo.email,
          avatar: generateAvatarUrl(account.address.toString(), "vendor"),
        },
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Failed to fetch vendor info:", error);
      setVendorInfo({
        vendor: null,
        loading: false,
        error: error.message || "Failed to fetch vendor info",
      });
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
