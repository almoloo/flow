import { NextRequest, NextResponse } from "next/server";
import { CustomerInfo, Gateway, Transaction } from "@/types";
import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getGateways } from "@/view-functions/getGateways";

// GET ALL CUSTOMERS FOR A VENDOR
async function handleGET(_req: NextRequest, _ctx: any, authPayload: any) {
  const vendorAddress = authPayload.walletAddress.toLowerCase();
  const customersCollection = await getCollection("customers");
  const customers = await customersCollection.find({ vendorAddress }).toArray();
  const gateways = await getGateways(vendorAddress);
  const transactionsCollection = await getCollection("transactions");

  for (let customer of customers) {
    const transactionsRaw = await transactionsCollection
      .find({ vendorAddress, "customer.address": customer.address })
      .sort({ createdAt: -1 })
      .toArray();

    const transactions: Transaction[] = transactionsRaw.map((tx: any) => ({
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
  }
  return NextResponse.json(customers);
}

async function handlePOST(_req: NextRequest, _ctx: any, _authPayload: any) {
  const body = await _req.json();
  const vendorAddress = body.vendorAddress;
  const customerAddress = body.address;
  const customersCollection = await getCollection("customers");
  const existingCustomer = await customersCollection.findOne({ vendorAddress, address: customerAddress });

  if (body.email && existingCustomer && existingCustomer.email !== body.email) {
    await customersCollection.updateOne(
      { vendorAddress: vendorAddress.toLowerCase(), address: customerAddress.toLowerCase() },
      { $set: { email: body.email } },
    );
    revalidatePath(`/api/customer/${vendorAddress}/${customerAddress}`);
    return NextResponse.json({ message: "Customer email updated" }, { status: 200 });
  }

  if (existingCustomer) {
    return NextResponse.json({ message: "Customer already exists" }, { status: 200 });
  }

  const newCustomer = await customersCollection.insertOne({
    vendorAddress: vendorAddress.toLowerCase(),
    address: customerAddress.toLowerCase(),
    email: body.email || "",
  });

  return NextResponse.json(newCustomer);
}

export const GET = withAuth(handleGET, { requireOwnWallet: true });
export const POST = handlePOST;
