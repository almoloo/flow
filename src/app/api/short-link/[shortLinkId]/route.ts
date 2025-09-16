import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { ShortLink } from "@/types";

async function handleGET(_req: NextRequest, { params }: { params: { shortLinkId: string } }) {
  const shortLinkId = params.shortLinkId.indexOf("#SL") === -1 ? `${params.shortLinkId}#SL` : params.shortLinkId;
  const collection = await getCollection("shorts");
  const shortLink = await collection.findOne({ id: shortLinkId });
  console.log("😍", shortLinkId, shortLink);

  if (!shortLink) {
    return NextResponse.json({ error: "Short link not found" }, { status: 404 });
  }

  return NextResponse.json(shortLink);
}

async function handleDELETE(_req: NextRequest, { params }: { params: { shortLinkId: string } }, authPayload: any) {
  const shortLinkId = `${params.shortLinkId}#SL`;
  const collection = await getCollection("shorts");
  const deleteResult = await collection.deleteOne({ id: shortLinkId, walletAddress: authPayload.walletAddress });

  if (deleteResult.deletedCount === 0) {
    return NextResponse.json({ error: "Short link not found or not authorized" }, { status: 404 });
  }

  return NextResponse.json({ message: "Short link deleted successfully" });
}

async function handlePOST(_req: NextRequest, { params }: { params: { shortLinkId: string } }, authPayload: any) {
  const shortLinkId = `${params.shortLinkId}#SL`;

  const body = (await _req.json()) as Omit<ShortLink, "walletAddress" | "id">;
  if (!body.gatewayId || !body.amount) {
    return NextResponse.json({ error: "gatewayId and amount are required" }, { status: 400 });
  }

  const collection = await getCollection("shorts");
  const updatedShortLink = await collection.findOneAndUpdate(
    { id: shortLinkId, walletAddress: authPayload.walletAddress },
    { $set: { ...body } },
    { returnDocument: "after" },
  );

  if (!updatedShortLink) {
    return NextResponse.json({ error: "Short link not found or not authorized" }, { status: 404 });
  }

  console.log(updatedShortLink);

  return NextResponse.json({
    id: updatedShortLink.id,
    walletAddress: updatedShortLink.walletAddress,
    gatewayId: updatedShortLink.gatewayId,
    amount: updatedShortLink.amount,
    active: updatedShortLink.active,
  });
}

export const GET = handleGET;
export const DELETE = withAuth(handleDELETE, { requireOwnWallet: true });
export const POST = withAuth(handlePOST, { requireOwnWallet: true });
