import { getCollection } from "@/lib/db";
import { generateImageUrl } from "@/lib/utils";
import { withAuth } from "@/lib/authMiddleware";
import { Vendor } from "@/types";
import { NextRequest, NextResponse } from "next/server";

async function handleGET(_req: NextRequest, { params }: { params: { walletAddress: string } }) {
  const { walletAddress } = params;

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  const vendors = await getCollection<Partial<Vendor>>("vendors");
  const vendor = await vendors.findOne({ address: walletAddress });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...vendor,
    avatar: generateImageUrl(walletAddress, "vendor"),
  });
}

async function handlePOST(_req: NextRequest, { params }: { params: { walletAddress: string } }) {
  const { walletAddress } = params;
  const vendorInfo = await _req.json();

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  const vendors = await getCollection<Partial<Vendor>>("vendors");
  const upsertedVendor = await vendors.updateOne(
    { address: walletAddress },
    { $set: { ...vendorInfo } },
    { upsert: true },
  );

  return NextResponse.json(upsertedVendor);
}

export const GET = withAuth(handleGET, { requireOwnWallet: false });
export const POST = withAuth(handlePOST, { requireOwnWallet: true });
