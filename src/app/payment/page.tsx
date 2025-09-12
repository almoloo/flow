import { notFound } from "next/navigation";

interface PaymentPageProps {
  // query parameters
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export const dynamic = "force-dynamic";
export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const vendorAddress = (await searchParams).va;
  const gatewayId = (await searchParams).gid;
  const amount = (await searchParams).amount; // IN USDT

  if (!vendorAddress || !gatewayId || !amount) {
    notFound();
  }

  return (
    <div>
      Payment Page for vendor: {vendorAddress}, gateway: {gatewayId}, amount: {amount} USDT
    </div>
  );
}
