import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { InvoiceStatus } from "@/types";

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

async function handlePUT(_req: NextRequest, _ctx: any, _authPayload: any) {
  const { invoiceId } = _ctx.params;
  const body = await _req.json();
  const collection = await getCollection("invoices");

  const updateData = {
    status: InvoiceStatus.COMPLETED,
    paymentDate: new Date().toISOString(),
    paymentId: body.paymentId,
    transactionId: body.transactionId,
    customer: {
      address: body.customerAddress,
    },
  };

  const result = await collection.findOneAndUpdate(
    { id: invoiceId },
    { $set: updateData },
    { returnDocument: "after" },
  );

  return NextResponse.json(result);
}

export const PUT = handlePUT;

export const GET = handleGET;
