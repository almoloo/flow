"use client";

import PageTitle from "@/components/page-title";
import { Gateway } from "@/types";
import { getGateway } from "@/view-functions/GetGateway";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingGatewayForm from "@/components/views/gateway/loading-form";
import { editGateway } from "@/entry-functions/editGateway";
import GatewayForm, { formSchema } from "@/components/views/gateway/gateway-form";
import z from "zod";

interface EditGatewayPageProps {
  params: {
    gatewayId: string;
  };
}

export default function EditGatewayPage({ params }: EditGatewayPageProps) {
  const { account } = useWallet();

  const [gatewayInfo, setGatewayInfo] = useState<Gateway | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchGatewayInfo = async () => {
    setIsLoading(true);
    try {
      const gw = await getGateway(account?.address.toString()!, params.gatewayId);

      if (!gw) {
        notFound();
      }

      setGatewayInfo(gw);
    } catch (error) {
      console.error("Error fetching gateway info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGatewayInfo();
  }, []);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form submitted:", data);

    setSubmitting(true);

    try {
      await editGateway(account?.address.toString()!, params.gatewayId, data);
      fetchGatewayInfo();
      // TODO: SHOW SUCCESS TOAST
    } catch (error) {
      console.error("Error saving gateway:", error);
      // TODO: SHOW ERROR TOAST
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageTitle title="Gateways" segment={params.gatewayId} />
      {isLoading ? (
        <LoadingGatewayForm />
      ) : (
        <GatewayForm onSubmit={onSubmit} data={gatewayInfo!} submitting={submitting} />
      )}
    </div>
  );
}
