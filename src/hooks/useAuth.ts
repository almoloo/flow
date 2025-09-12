"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useCallback, useEffect } from "react";
import { createAuthMessage, createAuthToken, type AuthPayload } from "@/lib/auth";

export interface UseAuthReturn {
  isAuthenticated: boolean;
  authToken: string | null;
  authenticate: () => Promise<boolean>;
  clearAuth: () => void;
  loading: boolean;
}

/**
 * Hook for wallet-based authentication
 * Provides methods to authenticate user by signing a message
 */
export function useAuth(): UseAuthReturn {
  const { account, signMessage, connected } = useWallet();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!connected || !account || !signMessage) {
      return false;
    }

    setLoading(true);

    try {
      const timestamp = Date.now();
      const walletAddress = account.address.toString();
      const message = createAuthMessage(walletAddress, timestamp);

      const response = await signMessage({
        message,
        nonce: timestamp.toString(),
      });

      if (!response.signature) {
        return false;
      }

      const authPayload: AuthPayload = {
        message: message,
        signature: response.signature.toString(),
        publicKey: account.publicKey.toString(),
        walletAddress: walletAddress,
        timestamp,
      };

      const token = createAuthToken(authPayload);
      setAuthToken(token);
      localStorage.setItem("auth_token", token);

      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, [connected, account, signMessage]);

  const clearAuth = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem("auth_token");
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  return {
    isAuthenticated: !!authToken && connected,
    authToken,
    authenticate,
    clearAuth,
    loading,
  };
}
