import { NextRequest, NextResponse } from "next/server";
import { extractAuthFromRequest, verifyAuthSignature } from "@/lib/auth";

/**
 * Middleware to authenticate API requests
 * @param request - NextRequest object
 * @param requiredWalletAddress - Optional: specific wallet address that must be authenticated
 * @returns NextResponse if unauthorized, null if authorized
 */
export function authenticateRequest(request: NextRequest, requiredWalletAddress?: string): NextResponse | null {
  // Extract auth payload from request
  const authPayload = extractAuthFromRequest(request);

  if (!authPayload) {
    return NextResponse.json(
      { error: "Authentication required. Please provide valid authorization header." },
      { status: 401 },
    );
  }

  // Verify the signature
  const verificationResult = verifyAuthSignature(authPayload);
  if (!verificationResult.isValid) {
    return NextResponse.json({ error: "Invalid authentication signature." }, { status: 401 });
  }

  // Check if specific wallet address is required
  if (requiredWalletAddress && authPayload.walletAddress !== requiredWalletAddress) {
    return NextResponse.json({ error: "Access denied. You can only access your own resources." }, { status: 403 });
  }

  // Authentication successful
  return null;
}

/**
 * Wrapper function for API route handlers that require authentication
 * @param handler - The actual API route handler
 * @param options - Authentication options
 */
export function withAuth(
  handler: (request: NextRequest, context: any, authPayload: any) => Promise<NextResponse>,
  options: {
    requireOwnWallet?: boolean; // If true, user can only access their own wallet data
  } = {},
) {
  return async (request: NextRequest, context: any) => {
    // Extract wallet address from params if available
    const walletAddress = context.params?.walletAddress;

    // Check authentication
    const authError = authenticateRequest(request, options.requireOwnWallet ? walletAddress : undefined);

    if (authError) {
      return authError;
    }

    // Get auth payload for the handler
    const authPayload = extractAuthFromRequest(request);

    // Call the original handler
    return handler(request, context, authPayload);
  };
}
