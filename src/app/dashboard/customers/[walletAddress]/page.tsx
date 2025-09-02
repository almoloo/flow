"use client";

import PageTitle from "@/components/page-title";
import { formatAddress } from "@/lib/utils";
import { CustomerInfo } from "@/types";
import { useEffect, useState } from "react";
import { getCustomer } from "@/view-functions/getCustomer";
import { notFound } from "next/navigation";

interface CustomerInfoPageProps {
  params: {
    walletAddress: string;
  };
}

export default function CustomerInfoPage({ params: { walletAddress } }: CustomerInfoPageProps) {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCustomer();

      if (!data) {
        notFound();
      }
      setCustomer(data);
      setIsLoading(false);
    };
    fetchData();
  }, [walletAddress]);

  return (
    <div>
      <PageTitle title="Customer Information" segment={formatAddress(walletAddress)} />
      <p>Wallet Address: {walletAddress}</p>
    </div>
  );
}
