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

export interface Transaction {}

export interface Withdrawal {}

export interface Customer {}

export interface AgentInfo {}

export interface Invoice {}

export interface ShortLink {}

export interface Notification {}
