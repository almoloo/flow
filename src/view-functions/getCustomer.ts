import { CustomerInfo, TransactionStatus, TransactionType } from "@/types";

export const getCustomer = async (VendorAddress: string, CustomerAddress: string): Promise<CustomerInfo | null> => {
  // return null;

  return {
    address: "0xCustomerAddress1",
    email: "customer1@example.com",
    totalSpent: "1000",
    transactions: [
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
    ],
  };
};
