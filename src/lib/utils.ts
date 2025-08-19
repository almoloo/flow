import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, length = 6): string {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-4)}`;
}
