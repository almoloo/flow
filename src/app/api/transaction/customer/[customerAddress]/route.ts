import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET TRANSACTIONS FOR A CUSTOMER
async function handleGET(_req: NextRequest, { params }: { params: { customerAddress: string } }, authPayload: any) {
  const { customerAddress } = params;

  if (!customerAddress) {
    return NextResponse.json({ error: "Customer address is required" }, { status: 400 });
  }
  const collection = await getCollection("transactions");
  const transactions = await collection
    .find({
      customer: { address: customerAddress.toLowerCase() },
      vendorAddress: authPayload.walletAddress.toLowerCase(),
    })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(transactions);
}

export const GET = withAuth(handleGET, { requireOwnWallet: true });
