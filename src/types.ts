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

export interface GatewayInfo {
  id: number;
  label: string;
  metadata: string;
  is_active: boolean;
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
  paymentId: number;
  transactionId: string;
  amount: string;
  currency: string;
  targetCurrency: string;
  targetAmount: string;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: string;
  customer?: Partial<Customer>;
  vendorAddress: string;
  gateway: Partial<Gateway>;
  fee: string;
}

export interface Customer {
  vendorAddress: string;
  address: string;
  email?: string;
}

export interface CustomerInfo extends Customer {
  transactions: Transaction[];
  totalSpent: string;
}

// export interface Withdrawal {}

export interface Question {
  questionId: string;
  question: string;
  answer: string;
}

export interface AgentInfo {
  error?: string;
  email?: string;
  summary?: string;
  questions?: Question[];
}

export interface SupportKnowledgeBase {
  vendorInfo?: AgentInfo;
  paymentInfo?: {
    acceptedTokens?: string[];
    processingTime?: string;
    fees?: string;
  };
  additionalContext?: Record<string, any>;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export enum InvoiceStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface Invoice {
  id: string;
  vendorAddress: string;
  amount: string;
  customerEmail?: string;
  createDate: string;
  paymentDate?: string;
  customer?: Partial<Customer>;
  paymentId?: number;
  transactionId?: string;
  status: InvoiceStatus;
  transaction?: Partial<Transaction>;
}

export interface ShortLink {
  id: string;
  walletAddress: string;
  gatewayId: string;
  amount: string;
  active: "true" | "false";
}

enum NotificationTitle {
  INVOICE_PAID = "Invoice Paid",
  PAYMENT_RECEIVED = "Payment Received",
}

export interface Notification {
  id: string;
  walletAddress: string;
  title: NotificationTitle;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Token {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  decimals?: number;
}
