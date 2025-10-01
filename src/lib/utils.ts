import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { authenticatedPost } from "./authenticatedFetch";
import { Gateway, GatewayInfo, Transaction } from "@/types";
import { availableTokens, NETWORK } from "@/constants";

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

/**
 * Uploads a logo image file to the server for a specific address and ID.
 *
 * @param logo - The image file to be uploaded.
 * @param address - The wallet address of the vendor.
 * @param id - The unique identifier for the gateway.
 * @returns A promise that resolves to the URL of the uploaded logo.
 * @throws Will reject the promise if the upload fails.
 */
export function uploadGatewayLogo(logo: File, address: string, id: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append("logo", logo);

    const uploadLogo = await authenticatedPost(`/api/image/gateway/${address}/${id}`, formData);

    if (uploadLogo.ok) {
      const { logoUrl } = await uploadLogo.json();
      resolve(logoUrl);
    } else {
      reject(new Error("Failed to upload logo"));
    }
  });
}

/**
 * Uploads a vendor's avatar image to the server and returns the URL of the uploaded avatar.
 *
 * @param avatar - The avatar image file to upload.
 * @param address - The vendor's address used to identify the upload endpoint.
 * @returns A promise that resolves with the URL of the uploaded avatar image.
 *
 * @throws {Error} If the upload fails or the server responds with an error.
 */
export function uploadVendorAvatar(avatar: File, address: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const uploadAvatar = await authenticatedPost(`/api/image/vendor/${address}`, formData);

    if (uploadAvatar.ok) {
      const { avatarUrl } = await uploadAvatar.json();
      resolve(avatarUrl);
    } else {
      reject(new Error("Failed to upload avatar"));
    }
  });
}

export function modifyGatewayInfo(gateway: GatewayInfo): Gateway {
  const metadata = JSON.parse(gateway.metadata);
  return {
    gatewayId: gateway.id.toString(),
    title: gateway.label,
    url: metadata.url,
    callbackUrl: metadata.callbackUrl,
    active: metadata.active,
    sandbox: metadata.sandbox,
  };
}

export function getTokenInfo(tokenAddress: string) {
  const tokenList = availableTokens[NETWORK] || [];
  return tokenList.find((token) => token.address === tokenAddress);
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Adds a new customer by sending their information to the server.
 *
 * @param vendorAddress - The address of the vendor associated with the customer.
 * @param customerAddress - The address of the customer to be added.
 * @param email - (Optional) The email address of the customer. If provided and valid, it will be included in the customer information.
 * @returns A promise that resolves when the customer has been added.
 */
export async function addNewCustomer(vendorAddress: string, customerAddress: string, email?: string) {
  const customerInfo = {
    vendorAddress,
    address: customerAddress,
  };

  if (email && email.trim() !== "" && isValidEmail(email)) {
    Object.assign(customerInfo, { email });
  }

  await fetch(`/api/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerInfo),
  });
}

export async function addNewTransaction(transaction: Partial<Transaction>) {
  await fetch(`/api/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body: transaction }),
  });
}

export function fixedNumber(num: number, decimals: number) {
  // Convert to string with fixed decimals without extra 0s in the end
  const parts = num.toFixed(decimals).split(".");
  if (parts.length === 1) return parts[0]; // No decimal part
  parts[1] = parts[1].replace(/0+$/, ""); // Remove trailing zeros
  if (parts[1] === "") return parts[0]; // If no decimal part left, return integer part only
  return parts.join(".");
}

export function createCallbackUrl(baseUrl: string, params: Record<string, string | number | boolean>) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
}
