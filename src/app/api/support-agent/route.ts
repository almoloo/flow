import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";

async function handleGET(_req: NextRequest, _context: any, authPayload: any) {
  // Access authenticated user's wallet address via authPayload.walletAddress
  return NextResponse.json({
    message: "Support Agent API is operational",
    authenticatedWallet: authPayload.walletAddress,
  });
}

async function handlePOST(_req: NextRequest, _context: any, authPayload: any) {
  // Handle authenticated POST requests
  const body = await _req.json();

  return NextResponse.json({
    message: "Support Agent POST endpoint",
    authenticatedWallet: authPayload.walletAddress,
    received: body,
  });
}

export const GET = withAuth(handleGET, { requireOwnWallet: false });
export const POST = withAuth(handlePOST, { requireOwnWallet: true });
