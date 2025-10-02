import { withAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { Invoice, InvoiceStatus } from "@/types";

async function handleGET(_req: NextRequest, _ctx: any, authPayload: any) {
  const collection = await getCollection("invoices");
  const invoices = await collection.find({ vendorAddress: authPayload.walletAddress }).toArray();

  invoices.map((invoice) => {
    invoice.createDate = new Date(invoice.createDate).toLocaleString("en-US", { timeZone: "UTC" });

    if (invoice.paymentDate) {
      invoice.paymentDate = new Date(invoice.paymentDate).toLocaleString("en-US", { timeZone: "UTC" });
    }
  });
  return NextResponse.json(invoices);
}

async function handlePOST(_req: NextRequest, _ctx: any, authPayload: any) {
  const collection = await getCollection("invoices");
  const body = await _req.json();
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    vendorAddress: authPayload.walletAddress,
    amount: body.amount,
    customerEmail: body.email,
    createDate: new Date().toISOString(),
    status: InvoiceStatus.PENDING,
  };
  await collection.insertOne(invoice);
  return NextResponse.json(invoice);
}

export const GET = withAuth(handleGET, { requireOwnWallet: true });
export const POST = withAuth(handlePOST, { requireOwnWallet: true });
