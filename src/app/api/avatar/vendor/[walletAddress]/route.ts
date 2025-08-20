import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { getFile } from "@/lib/s3";

export async function GET(_req: NextRequest, { params }: { params: { walletAddress: string } }) {
  const { walletAddress } = params;

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  interface Vendor {
    avatarUrl: string;
  }

  let avatarFileName = "default.png";

  const vendors = await getCollection<Vendor>("vendors");
  const vendor = await vendors.findOne({ address: walletAddress });

  if (vendor && vendor.avatarUrl) {
    avatarFileName = vendor.avatarUrl;
  }

  const avatar = await getFile(avatarFileName);

  if (!avatar) {
    return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(avatar as Buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${avatarFileName}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
