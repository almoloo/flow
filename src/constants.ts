import type { Network } from "@aptos-labs/wallet-adapter-react";
import { Token } from "./types";

export const NETWORK: Network = (process.env.NEXT_PUBLIC_APP_NETWORK as Network) ?? "testnet";
export const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS;
export const APTOS_API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY;

// MongoDB configuration
export const MONGODB_URI = process.env.MONGODB_URI;
export const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

// MinIO configuration
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const MINIO_USE_SSL = process.env.MINIO_USE_SSL === "true";
export const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME;
export const MINIO_REGION = process.env.MINIO_REGION;

// TOKEN LIST
export const availableTokens: Record<Network, Token[]> = {
  testnet: [
    {
      name: "Aptos",
      symbol: "APT",
      address: "0x1::aptos_coin::AptosCoin",
      logoURI: "https://raw.githubusercontent.com/pontem-network/coins-registry/main/src/coins-logos/apt.svg",
      decimals: 8,
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT",
      logoURI: "https://raw.githubusercontent.com/pontem-network/coins-registry/main/src/coins-logos/usdt.svg",
      decimals: 6,
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::BTC",
      logoURI: "https://raw.githubusercontent.com/pontem-network/coins-registry/main/src/coins-logos/btc.svg",
      decimals: 8,
    },
  ],
  mainnet: [],
  devnet: [],
  local: [],
  custom: [],
};
