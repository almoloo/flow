import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { getFile, uploadFile } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { generateImageUrl } from "@/lib/utils";
import { withAuth } from "@/lib/authMiddleware";

interface GatewayCollection {
  logoUrl: string;
  walletAddress: string;
  gatewayId: string;
}

async function handleGET(_req: NextRequest, { params }: { params: { walletAddress: string; gatewayId: string } }) {
  const { walletAddress, gatewayId } = params;

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  if (!gatewayId) {
    return NextResponse.json({ error: "Gateway ID is required" }, { status: 400 });
  }

  let logoFileName = "";

  const gateways = await getCollection<GatewayCollection>("gateways");
  const gateway = await gateways.findOne({ gatewayId });

  if (gateway && gateway.logoUrl) {
    logoFileName = gateway.logoUrl;
  }

  const logo = await getFile(logoFileName);

  if (!logo) {
    return NextResponse.json({ error: "Logo not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(logo as Buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${logoFileName}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

async function handlePOST(_req: NextRequest, { params }: { params: { walletAddress: string; gatewayId: string } }) {
  const { walletAddress, gatewayId } = params;

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  if (!gatewayId) {
    return NextResponse.json({ error: "Gateway ID is required" }, { status: 400 });
  }

  const formData = await _req.formData();
  const logo = formData.get("logo") as File | null;

  if (!logo) {
    return NextResponse.json({ error: "Logo is required" }, { status: 400 });
  }

  // Upload the logo
  const logoFileName = `${walletAddress}-${gatewayId}-${Date.now()}.${logo.type.split("/")[1]}`;
  const logoBuffer = Buffer.from(await logo.arrayBuffer());
  const url = await uploadFile(logoFileName, logoBuffer);
  if (!url) {
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
  }

  // Update the gateway's logo URL in the database
  const gateways = await getCollection<GatewayCollection>("gateways");
  await gateways.updateOne({ gatewayId, walletAddress }, { $set: { logoUrl: url } }, { upsert: true });

  // Invalidate logo cache
  revalidatePath(generateImageUrl(walletAddress, "gateway"));

  return NextResponse.json({ logoUrl: url }, { status: 200 });
}

export const GET = withAuth(handleGET, { requireOwnWallet: false });
export const POST = withAuth(handlePOST, { requireOwnWallet: true });
