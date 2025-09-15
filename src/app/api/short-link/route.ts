import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { ShortLink } from "@/types";

async function handleGET(_req: NextRequest, _ctx: any, authPayload: any) {
  const collection = await getCollection("shorts");
  const shortLinks = await collection.find({ walletAddress: authPayload.walletAddress }).toArray();

  return NextResponse.json(shortLinks);
}

async function handlePOST(_req: NextRequest, _ctx: any, authPayload: any) {
  const body = (await _req.json()) as Omit<ShortLink, "walletAddress" | "id">;

  if (!body.gatewayId || !body.amount) {
    return NextResponse.json({ error: "gatewayId and amount are required" }, { status: 400 });
  }

  const collection = await getCollection("shorts");
  const shortId = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
  const newShortLink: ShortLink = {
    id: `${shortId}#SL`,
    walletAddress: authPayload.walletAddress,
    gatewayId: body.gatewayId,
    amount: body.amount,
    active: body.active,
  };

  await collection.insertOne(newShortLink);

  return NextResponse.json(newShortLink, { status: 201 });
}

export const POST = withAuth(handlePOST, { requireOwnWallet: true });
export const GET = withAuth(handleGET, { requireOwnWallet: true });
