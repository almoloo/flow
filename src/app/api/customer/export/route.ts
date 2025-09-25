import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "@/types";
import { withAuth } from "@/lib/authMiddleware";
import { getCollection } from "@/lib/db";

// EXPORT CUSTOMER DATA FOR A VENDOR AS CSV
async function handleGET(_req: NextRequest, _ctx: any, authPayload: any) {
  const vendorAddress = authPayload.walletAddress.toLowerCase();
  const customersCollection = await getCollection("customers");
  const customers = await customersCollection.find({ vendorAddress }).toArray();
  const transactionsCollection = await getCollection("transactions");

  let csvContent =
    "Customer Address,Customer Email,Total Spent,Transaction ID,Amount,Currency,Target Amount,Target Currency,Status,Type,Created At,Gateway ID,Gateway Title\n";

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
      gateway: tx.gateway,
      fee: tx.fee,
    }));

    const totalSpent = transactions.reduce((sum, tx) => sum + parseFloat(tx.targetAmount), 0).toFixed(2);

    // Add customer info row
    csvContent += `${customer.address},${customer.email || ""},${totalSpent},,,,,,,,,,\n`;

    // Add transaction rows
    for (let tx of transactions) {
      csvContent += `,,,"${tx.transactionId}",${tx.amount},${tx.currency},${tx.targetAmount},${tx.targetCurrency},${tx.status},${tx.type},"${tx.createdAt}",${tx.gateway.gatewayId},${tx.gateway.title}\n`;
    }
  }

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="customers_${vendorAddress}.csv"`,
    },
  });
}

export const GET = withAuth(handleGET, { requireOwnWallet: true });
