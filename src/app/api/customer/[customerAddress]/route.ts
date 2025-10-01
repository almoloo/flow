import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { CustomerInfo, Gateway } from "@/types";
import { getGateways } from "@/view-functions/getGateways";

// GET A CUSTOMER FOR A VENDOR
async function handleGET(_req: NextRequest, { params }: { params: { customerAddress: string } }, authPayload: any) {
  const vendorAddress = authPayload.walletAddress.toLowerCase();
  const { customerAddress } = params;
  const customersCollection = await getCollection("customers");
  const customer = await customersCollection.findOne({ vendorAddress, address: customerAddress });

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const transactionsCollection = await getCollection("transactions");
  const transactionsRaw = await transactionsCollection
    .find({ vendorAddress, "customer.address": customer.address })
    .sort({ createdAt: -1 })
    .toArray();

  const gateways = await getGateways(vendorAddress);

  const transactions = transactionsRaw.map((tx: any) => ({
    transactionId: tx.transactionId,
    amount: tx.amount,
    currency: tx.currency,
    targetCurrency: tx.targetCurrency,
    targetAmount: tx.targetAmount,
    status: tx.status,
    type: tx.type,
    createdAt: new Date(tx.createdAt).toLocaleString("en-US", { timeZone: "UTC" }),
    customer: tx.customer,
    vendorAddress: tx.vendorAddress,
    gateway:
      gateways.find((g) => g.gatewayId === tx.gateway.gatewayId) ||
      ({ gatewayId: tx.gateway.gatewayId as string, title: tx.gateway.gatewayId as string } as Gateway),
    fee: tx.fee,
    paymentId: tx.paymentId,
  }));

  const totalSpent = transactions.reduce((sum, tx) => sum + parseFloat(tx.targetAmount), 0).toFixed(2);

  const customerInfo: CustomerInfo = {
    ...customer,
    transactions,
    totalSpent,
    vendorAddress: customer.vendorAddress,
    address: customer.address,
  };

  Object.assign(customer, customerInfo);

  return NextResponse.json(customer);
}

export const GET = withAuth(handleGET, { requireOwnWallet: true });
