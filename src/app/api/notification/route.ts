import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Notification } from "@/types";

async function handleGET(_req: NextRequest, _ctx: any, authPayload: any) {
  const collection = await getCollection("notifications");
  const notifications = await collection.find({ walletAddress: authPayload.walletAddress }).toArray();
  return NextResponse.json(notifications);
}

async function handlePOST(_req: NextRequest, _ctx: any, _authPayload: any) {
  const collection = await getCollection("notifications");
  const body = await _req.json();
  const notification: Notification = {
    id: crypto.randomUUID(),
    walletAddress: body.walletAddress,
    title: body.title,
    message: body.message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  await collection.insertOne(notification);
  return NextResponse.json(notification);
}

async function handlePUT(_req: NextRequest, _ctx: any, authPayload: any) {
  const collection = await getCollection("notifications");
  const result = await collection.updateMany(
    { walletAddress: authPayload.walletAddress, read: false },
    { $set: { read: true } },
  );

  return NextResponse.json({ modifiedCount: result.modifiedCount });
}

export const POST = handlePOST;
export const GET = withAuth(handleGET, { requireOwnWallet: true });
export const PUT = withAuth(handlePUT, { requireOwnWallet: true });
