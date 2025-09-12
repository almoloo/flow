import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { authenticatedPost } from "./authenticatedFetch";

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

    // const uploadAvatar = await fetch(`/api/image/vendor/${address}`, {
    //   method: "POST",
    //   body: formData,
    // });

    const uploadAvatar = await authenticatedPost(`/api/image/vendor/${address}`, formData);

    if (uploadAvatar.ok) {
      const { avatarUrl } = await uploadAvatar.json();
      resolve(avatarUrl);
    } else {
      reject(new Error("Failed to upload avatar"));
    }
  });
}
