import { getCollection } from "@/lib/db";
import { generateImageUrl } from "@/lib/utils";
import { Vendor } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { walletAddress: string } }) {
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

export async function POST(_req: NextRequest, { params }: { params: { walletAddress: string } }) {
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
