import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a given address string by truncating it and adding ellipsis in the middle.
 *
 * @param address - The address string to format.
 * @param length - The number of characters to keep at the start of the address. Defaults to 6.
 * @returns The formatted address with the specified number of leading characters, ellipsis, and the last 4 characters.
 */
export function formatAddress(address: string, length = 6): string {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-4)}`;
}

/**
 * Generates a URL for retrieving an avatar image based on the provided address and type.
 *
 * @param address - The unique address (e.g., user or entity identifier) for which to generate the avatar URL.
 * @param type - The type of entity, either "vendor" or "gateway", to specify the avatar category.
 * @returns The URL string pointing to the avatar image for the specified address and type.
 */
export function generateImageUrl(address: string, type: "vendor" | "gateway", gatewayId?: string): string {
  return `/api/image/${type}/${address}${gatewayId ? `/${gatewayId}` : ""}`;
}
