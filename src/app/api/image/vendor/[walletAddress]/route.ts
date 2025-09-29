import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { getFile, uploadFile } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { generateImageUrl } from "@/lib/utils";
import { withAuth } from "@/lib/authMiddleware";

interface VendorAvatar {
  avatarUrl: string;
}

async function handleGET(_req: NextRequest, { params }: { params: { walletAddress: string } }) {
  const { walletAddress } = params;

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  let avatarFileName = "default.png";

  const vendors = await getCollection<VendorAvatar>("vendors");
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

async function handlePOST(_req: NextRequest, { params }: { params: { walletAddress: string } }) {
  const { walletAddress } = params;

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  const formData = await _req.formData();
  const avatar = formData.get("avatar") as File | null;

  if (!avatar) {
    return NextResponse.json({ error: "Avatar is required" }, { status: 400 });
  }

  // Upload the avatar
  const avatarFileName = `${walletAddress}-${Date.now()}.${avatar.type.split("/")[1]}`;
  const avatarBuffer = Buffer.from(await avatar.arrayBuffer());
  const url = await uploadFile(avatarFileName, avatarBuffer);
  if (!url) {
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }

  // Update the vendor's avatar URL in the database
  const vendors = await getCollection<VendorAvatar>("vendors");
  await vendors.updateOne({ address: walletAddress }, { $set: { avatarUrl: url } }, { upsert: true });

  // Invalidate avatar cache
  revalidatePath(generateImageUrl(walletAddress, "vendor"));

  return NextResponse.json({ avatarUrl: url }, { status: 200 });
}

export const GET = handleGET;
export const POST = withAuth(handlePOST, { requireOwnWallet: true });
