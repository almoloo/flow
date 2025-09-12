import { Transaction, TransactionStatus, TransactionType } from "@/types";

// TODO: Implement actual data fetching logic
export const getTransactions = async (
  _walletAddress: string,
  _type: "vendor" | "customer",
): Promise<Array<Transaction>> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // return [];

  return [
    {
      transactionId: "tx123",
      amount: "100.00",
      currency: "USDC",
      targetCurrency: "USDT",
      targetAmount: "100.00",
      status: TransactionStatus.COMPLETED,
      type: TransactionType.GATEWAY,
      createdAt: new Date().toISOString(),
      customer: {
        address: "0xCustomerAddress1",
        email: "asd@aas.co",
      },
      vendorAddress: "0xVendorAddress1",
      gateway: {
        gatewayId: "gateway123",
        title: "Gateway 123",
        url: "https://gateway123.com",
        callbackUrl: "https://gateway123.com/callback",
        active: true,
        sandbox: false,
      },
      fee: "1.00",
    },
    {
      transactionId: "tx124",
      amount: "50.00",
      currency: "USDC",
      targetCurrency: "USDT",
      targetAmount: "50.00",
      status: TransactionStatus.FAILED,
      type: TransactionType.GATEWAY,
      createdAt: new Date().toISOString(),
      customer: {
        address: "0xCustomerAddress2",
        email: "efe@ddd.co",
      },
      vendorAddress: "0xVendorAddress2",
      gateway: {
        gatewayId: "gateway124",
        title: "Gateway 124",
        url: "https://gateway124.com",
        callbackUrl: "https://gateway124.com/callback",
        active: true,
        sandbox: false,
      },
      fee: "0.50",
    },
    {
      transactionId: "tx125",
      amount: "75.00",
      currency: "USDC",
      targetCurrency: "USDT",
      targetAmount: "75.00",
      status: TransactionStatus.PENDING,
      type: TransactionType.GATEWAY,
      createdAt: new Date().toISOString(),
      customer: {
        address: "0xCustomerAddress3",
        email: "ewf@df.co",
      },
      vendorAddress: "0xVendorAddress3",
      gateway: {
        gatewayId: "gateway125",
        title: "Gateway 125",
        url: "https://gateway125.com",
        callbackUrl: "https://gateway125.com/callback",
        active: true,
        sandbox: false,
      },
      fee: "0.75",
    },
  ];
};
