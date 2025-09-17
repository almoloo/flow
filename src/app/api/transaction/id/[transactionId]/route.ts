import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { getGateway } from "@/view-functions/getGateway";
import { NextRequest, NextResponse } from "next/server";

// GET TRANSACTION BY ID
async function handleGET(_req: NextRequest, { params }: { params: { transactionId: string } }, authPayload: any) {
  const { transactionId } = params;

  if (!transactionId) {
    return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
  }
  const collection = await getCollection("transactions");
  const transaction = await collection.findOne({
    transactionId,
    vendorAddress: authPayload.walletAddress.toLowerCase(),
  });

  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  transaction.createdAt = new Date(transaction.createdAt).toLocaleString("en-US", { timeZone: "UTC" });

  const gateway = await getGateway(authPayload.walletAddress, transaction.gateway.gatewayId);
  if (gateway) {
    transaction.gateway = gateway;
  }

  return NextResponse.json(transaction);
}

export const GET = withAuth(handleGET, { requireOwnWallet: true });
