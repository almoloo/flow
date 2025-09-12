"use client";

import PageTitle from "@/components/page-title";
import { Gateway } from "@/types";
import { getGateway } from "@/view-functions/getGateway";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingGatewayForm from "@/components/views/gateway/loading-form";
// import { editGateway } from "@/entry-functions/editGateway";
import GatewayForm, { formSchema } from "@/components/views/gateway/gateway-form";
import z from "zod";
import { FLOW_ABI } from "@/utils/flow_abi";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { aptosClient } from "@/utils/aptosClient";
import { uploadGatewayLogo } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface EditGatewayPageProps {
  params: {
    gatewayId: string;
  };
}

export default function EditGatewayPage({ params }: EditGatewayPageProps) {
  const { gatewayId } = params;
  const { account } = useWallet();
  const { client } = useWalletClient();
  const { toast } = useToast();

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
      const metadata = JSON.stringify({
        url: data.url,
        callbackUrl: data.callbackUrl,
        active: data.active,
        sandbox: data.sandbox,
      });

      const commitedTx = await client?.useABI(FLOW_ABI).update_gateway({
        arguments: [gatewayId, data.title, metadata, data.active],
        type_arguments: [],
      });

      await aptosClient().waitForTransaction({
        transactionHash: commitedTx!.hash,
      });

      if (data.logo) {
        await uploadGatewayLogo(data.logo!, account?.address.toString()!, gatewayId);
      }
      fetchGatewayInfo();
      toast({
        title: "Success",
        description: "Gateway updated successfully.",
      });
    } catch (error) {
      console.error("Error saving gateway:", error);
      toast({
        title: "Error",
        description: "There was an error saving the gateway. Please try again.",
        variant: "destructive",
      });
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
