import { TransactionStatus, TransactionType, type Transaction } from "@/types";

// TODO: Implement actual data fetching logic
export const getTransaction = async (VendorId: string, transactionId: string): Promise<Transaction | null> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // return null;

  return {
    transactionId: "0xacc6ce801926e0397aecbc311e24786ccafdc7007289b81c9172e00d3434d2b1",
    amount: "100.00",
    currency: "USDC",
    targetCurrency: "USDT",
    targetAmount: "100.00",
    status: TransactionStatus.COMPLETED,
    type: TransactionType.GATEWAY,
    createdAt: new Date().toISOString(),
    customer: {
      address: "0x52f18f244dafcad99366398427860ba56d0d74b2f52db4069844c859805e48a6",
      email: "amousavig@icloud.com",
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
  };
};
