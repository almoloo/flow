"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConnectWalletDialog from "../homepage/connect-wallet-dialog";
import { WalletIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Token } from "@/types";
import { aptosClient } from "@/utils/aptosClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { availableTokens, NETWORK } from "@/constants";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface AvailableToken extends Token {
  amount: string; // formatted amount
  enabled: boolean;
}

interface PayButtonProps {
  amount?: number; // IN USDT
  sourceAmount?: number | null;
  sourceToken?: Token | null;
  fee?: number | null; // IN APT
  updateToken?: (token: Token) => void;
  handlePayment: () => Promise<void>;
  customerEmail?: string;
  setCustomerEmail?: (email: string) => void;
  loadingPrices?: boolean;
}

function LoadingButton() {
  return (
    <div>
      <Skeleton className="w-full h-10" />
    </div>
  );
}

export default function PayButton({
  amount,
  sourceAmount,
  sourceToken,
  fee,
  updateToken,
  handlePayment,
  customerEmail,
  setCustomerEmail,
  loadingPrices,
}: PayButtonProps) {
  const { connected, isLoading, account } = useWallet();

  const [tokens, setTokens] = useState<AvailableToken[] | null>(null);
  const [buttonText, setButtonText] = useState("Pick Your Preferred Token");

  useEffect(() => {
    if (sourceToken && sourceAmount) {
      setButtonText(`Pay ${sourceAmount} ${sourceToken.symbol}`);
      if (fee) {
        setButtonText((prev) => `${prev} + ${fee} APT Fee`);
      }
    }
  }, [sourceToken, sourceAmount, fee]);

  useEffect(() => {
    async function fetchTokens() {
      if (connected && account && !tokens) {
        const client = aptosClient();
        const tokens = await client.getAccountCoinsData({ accountAddress: account.address.toString() });
        const formattedTokens: AvailableToken[] = tokens.map((token) => {
          const decimals = token.metadata?.decimals || 0;
          const amount = BigInt(token.amount);
          const divisor = BigInt(10 ** decimals);

          // Get integer and fractional parts
          const integerPart = amount / divisor;
          const fractionalPart = amount % divisor;

          // Format the result
          let formattedAmount = integerPart.toString();
          if (fractionalPart > 0n) {
            const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
            // Remove trailing zeros
            const trimmedFractional = fractionalStr.replace(/0+$/, "");
            if (trimmedFractional) {
              formattedAmount += "." + trimmedFractional;
            }
          }

          // Check if the token is in the availableTokens list
          const isAvailable = availableTokens[NETWORK].some((t) => t.address === token.metadata?.asset_type);

          return {
            name: token.metadata?.name || "Unknown",
            symbol: token.metadata?.symbol || "UNKNOWN",
            address: token.metadata?.asset_type || "0x1::coin::Coin",
            amount: formattedAmount,
            logoURI: token.metadata?.icon_uri || "",
            enabled: isAvailable,
          };
        });
        formattedTokens.sort((a, b) => {
          // Enabled tokens first
          if (a.enabled && !b.enabled) return -1;
          if (!a.enabled && b.enabled) return 1;
          // Then by name
          return a.name.localeCompare(b.name);
        });

        setTokens(formattedTokens);
        console.log("coins", formattedTokens);
      }
    }
    fetchTokens();
  }, [connected, tokens, account]);

  if (isLoading) {
    return <LoadingButton />;
  }

  if (!connected) {
    return (
      <div>
        <p className="text-center text-sm text-slate-500 mb-5">Connect your wallet to proceed with payment.</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <WalletIcon className="size-4 mr-2" />
              Connect Wallet
            </Button>
          </DialogTrigger>
          <ConnectWalletDialog />
        </Dialog>
      </div>
    );
  }

  if (!tokens) {
    return <LoadingButton />;
  }

  if (connected) {
    return (
      <div className="space-y-2 w-full">
        <Select
          onValueChange={(value) => {
            const token = tokens.find((t) => t.address === value);
            if (token && updateToken) {
              console.log("selected token", token);
              updateToken(token);
            }
          }}
          disabled={loadingPrices}
        >
          <SelectTrigger className="w-full h-auto">
            <div className="flex flex-col items-start w-full gap-1">
              <span className="text-xs font-medium text-slate-500">Selected Token</span>
              <SelectValue placeholder="Select Token to Pay" className="bg-blue-300" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {tokens.map((token) => (
              <SelectItem value={token.address} key={token.address} disabled={!token.enabled}>
                <div className="flex flex-col items-start gap-1">
                  <span>{token.name}</span>
                  <span className="text-xs text-slate-600">
                    {token.amount} {token.symbol}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Email (optional)"
          value={customerEmail}
          onChange={(e) => setCustomerEmail?.(e.target.value)}
          type="email"
        />
        <Button className="w-full" disabled={!sourceToken || !amount || loadingPrices} onClick={handlePayment}>
          {buttonText}
        </Button>
      </div>
    );
  }
}
