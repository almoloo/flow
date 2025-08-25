export interface Vendor {
  address: string;
  name: string;
  email: string;
  avatar?: string;
  balance: string;
}

export interface Gateway {
  gatewayId: string;
  title: string;
  url: string;
  callbackUrl: string;
  active: boolean;
  sandbox: boolean;
}

export enum TransactionType {
  GATEWAY = "gateway",
  INVOICE = "invoice",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Transaction {
  transactionId: string;
  amount: string;
  currency: string;
  targetCurrency: string;
  targetAmount: string;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: string;
  customer: Customer;
  vendorAddress: string;
  gateway: Gateway;
  fee: string;
}

export interface Customer {
  address: string;
  email?: string;
}

export interface CustomerInfo extends Customer {
  transactions: Transaction[];
  totalSpent: string;
}

export interface Withdrawal {}

export interface AgentInfo {}

export interface Invoice {}

export interface ShortLink {}

export interface Notification {}
