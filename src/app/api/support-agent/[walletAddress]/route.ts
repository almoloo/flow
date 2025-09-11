import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { AgentInfo } from "@/types";

async function handleGET(_req: NextRequest, { params }: { params: { walletAddress: string } }) {
  const { walletAddress } = params;

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  const agents = await getCollection("agents");
  const agent = await agents.findOne<AgentInfo>({ walletAddress });

  if (!agent) {
    // return NextResponse.json({ error: "Support agent not found" }, { status: 404 });
    return NextResponse.json({
      email: "",
      summary: "",
      questions: [{ question: "", answer: "" }],
    } as AgentInfo);
  }

  return NextResponse.json(agent);
}

async function handlePOST(_req: NextRequest, { params }: { params: { walletAddress: string } }, authPayload: any) {
  const { walletAddress } = params;
  const body = (await _req.json()) as AgentInfo;

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  const agents = await getCollection("agents");
  const upsertedAgent = await agents.updateOne(
    { walletAddress: authPayload.walletAddress },
    { $set: { ...body, walletAddress: authPayload.walletAddress } },
    { upsert: true },
  );

  return NextResponse.json(upsertedAgent);
}

export const GET = withAuth(handleGET, { requireOwnWallet: false });
export const POST = withAuth(handlePOST, { requireOwnWallet: true });
