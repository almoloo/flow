import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";

async function handleGET(_req: NextRequest, _ctx: any, _authPayload: any) {
  const { invoiceId } = _ctx.params;
  const collection = await getCollection("invoices");
  const invoice = await collection.findOne({ id: invoiceId });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  invoice.createDate = new Date(invoice.createDate).toLocaleString("en-US", { timeZone: "UTC" });

  if (invoice.paymentDate) {
    invoice.paymentDate = new Date(invoice.paymentDate).toLocaleString("en-US", { timeZone: "UTC" });
  }

  return NextResponse.json(invoice);
}

export const GET = handleGET;
