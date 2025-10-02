import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { Transaction } from "@/types";
import { getGateways } from "@/view-functions/getGateways";
import { NextRequest, NextResponse } from "next/server";

// ADD NEW TRANSACTION
async function handlePOST(_req: NextRequest, _ctx: any, _authPayload: any) {
  const collection = await getCollection("transactions");
  const data = await _req.json();
  const transaction: Partial<Transaction> = data.body;
  transaction.createdAt = new Date().toISOString();
  // transaction.vendorAddress = authPayload.walletAddress.toLowerCase();
  const result = await collection.insertOne(transaction);
  return NextResponse.json({ ...transaction, _id: result.insertedId }, { status: 201 });
}

// GET TRANSACTIONS FOR A VENDOR
async function handleGET(_req: NextRequest, _ctx: any, authPayload: any) {
  // get query string "count" if exists
  const { searchParams } = new URL(_req.url);
  const countParam = searchParams.get("count");
  const count = countParam ? parseInt(countParam, 10) : null;

  const collection = await getCollection("transactions");

  let transactions;

  if (count) {
    transactions = await collection
      .find({ vendorAddress: authPayload.walletAddress.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(count)
      .toArray();
  } else {
    transactions = await collection
      .find({ vendorAddress: authPayload.walletAddress.toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray();
  }

  const gateways = await getGateways(authPayload.walletAddress);

  transactions.forEach((tx) => {
    const gateway = gateways.find((g) => g.gatewayId === tx.gateway.gatewayId);
    if (gateway) {
      tx.gateway = gateway;
    }
    tx.createdAt = new Date(tx.createdAt).toLocaleString("en-US", { timeZone: "UTC" });
  });

  return NextResponse.json(transactions);
}

export const POST = handlePOST;
export const GET = withAuth(handleGET, { requireOwnWallet: true });
