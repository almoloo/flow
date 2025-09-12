import { Gateway } from "@/types";
import { getGateway } from "@/view-functions/getGateway";
import { useEffect, useState } from "react";

interface GatewayInfo {
  gateway: Gateway | null;
  loading: boolean;
  error: string | null;
  done: boolean;
}

export function useGatewayInfo(walletAddress: string, gatewayId: string) {
  const [info, setInfo] = useState<GatewayInfo>({
    gateway: null,
    loading: true,
    error: null,
    done: false,
  });

  useEffect(() => {
    const fetchGatewayInfo = async () => {
      try {
        const info = await getGateway(walletAddress, gatewayId);
        if (!info) {
          throw new Error("Gateway not found");
        }
        setInfo({ gateway: info, loading: false, error: null, done: true });
      } catch (error: any) {
        setInfo({ gateway: null, loading: false, error: error.message, done: false });
      }
    };

    fetchGatewayInfo();
  }, [walletAddress, gatewayId]);

  return info;
}
