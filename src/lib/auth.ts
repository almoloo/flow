import { Ed25519PublicKey, Ed25519Signature, AuthenticationKey } from "@aptos-labs/ts-sdk";
import { NextRequest } from "next/server";

export interface AuthPayload {
  message: string;
  signature: string;
  publicKey: string;
  walletAddress: string;
  timestamp: number;
}

export function createAuthMessage(walletAddress: string, timestamp: number): string {
  return `Authenticate wallet: ${walletAddress} at ${timestamp}`;
}

export function createAuthToken(payload: AuthPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function parseAuthToken(token: string): AuthPayload | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    return JSON.parse(decoded) as AuthPayload;
  } catch (error) {
    return null;
  }
}

export function extractAuthFromRequest(request: NextRequest): AuthPayload | null {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  return parseAuthToken(token);
}

export function verifyAuthSignature(payload: AuthPayload): { isValid: boolean; walletAddress?: string } {
  try {
    const now = Date.now();
    const timeDiff = now - payload.timestamp;
    if (timeDiff > 30 * 24 * 60 * 60 * 1000) {
      return { isValid: false };
    }

    const expectedMessage = createAuthMessage(payload.walletAddress, payload.timestamp);
    if (payload.message !== expectedMessage) {
      return { isValid: false };
    }

    const cleanPublicKey = payload.publicKey.startsWith("0x") ? payload.publicKey.slice(2) : payload.publicKey;
    const publicKeyBytes = new Uint8Array(Buffer.from(cleanPublicKey, "hex"));

    if (publicKeyBytes.length !== 32) {
      return { isValid: false };
    }

    const cleanSignature = payload.signature.startsWith("0x") ? payload.signature.slice(2) : payload.signature;
    const signatureBytes = new Uint8Array(Buffer.from(cleanSignature, "hex"));

    if (signatureBytes.length !== 64) {
      return { isValid: false };
    }

    const publicKey = new Ed25519PublicKey(publicKeyBytes);
    const signature = new Ed25519Signature(signatureBytes);

    const messageFormats = [
      { data: new TextEncoder().encode(payload.message) },
      { data: Buffer.from(payload.message, "utf8") },
      { data: Buffer.from(payload.message, "ascii") },
      { data: Buffer.from(payload.message, "latin1") },
      { data: new Uint8Array(Buffer.from(payload.message)) },
      { data: new Uint8Array(Buffer.from(Buffer.from(payload.message).toString("hex"), "hex")) },
      { data: new TextEncoder().encode(`\x19Ethereum Signed Message:\n${payload.message.length}${payload.message}`) },
      {
        data: new TextEncoder().encode(
          `APTOS\naddress: ${payload.walletAddress}\napplication: bounty-app\nnonce: ${payload.timestamp}\nmessage: ${payload.message}`,
        ),
      },
      { data: new TextEncoder().encode(`APTOS\nmessage: ${payload.message}\nnonce: ${payload.timestamp}`) },
      { data: new TextEncoder().encode(payload.message.replace("0x", "")) },
      { data: new TextEncoder().encode(payload.message.toLowerCase()) },
      { data: new Uint8Array([...payload.message].map((c) => c.charCodeAt(0))) },
    ];

    for (const format of messageFormats) {
      try {
        const isValid = publicKey.verifySignature({ message: format.data, signature });
        if (isValid) {
          const authKey = AuthenticationKey.fromPublicKey({ publicKey });
          const derivedAddress = authKey.derivedAddress().toString();

          if (derivedAddress !== payload.walletAddress) {
            return { isValid: false };
          }

          return {
            isValid: true,
            walletAddress: payload.walletAddress,
          };
        }
      } catch (error) {
        continue;
      }
    }

    return { isValid: false };
  } catch (error) {
    return { isValid: false };
  }
}
