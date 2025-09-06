"use client";

import PageTitle from "@/components/page-title";
import { useToast } from "@/components/ui/use-toast";
import GatewayForm, { formSchema } from "@/components/views/gateway/gateway-form";
import { aptosClient } from "@/utils/aptosClient";
import { FLOW_ABI } from "@/utils/flow_abi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

function uploadLogo(logo: File, address: string, id: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append("logo", logo);

    const uploadLogo = await fetch(`/api/image/gateway/${address}/${id}`, {
      method: "POST",
      body: formData,
    });

    if (uploadLogo.ok) {
      const { logoUrl } = await uploadLogo.json();
      resolve(logoUrl);
    } else {
      reject(new Error("Failed to upload logo"));
    }
  });
}

export default function CreateGatewayPage() {
  const { account } = useWallet();
  const { client } = useWalletClient();
  const { toast } = useToast();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const metadata = JSON.stringify({
        url: data.url,
        callbackUrl: data.callbackUrl,
        active: data.active,
        sandbox: data.sandbox,
      });

      const commitedTx = await client?.useABI(FLOW_ABI).add_gateway({
        arguments: [data.title, metadata],
        type_arguments: [],
      });

      await aptosClient().waitForTransaction({
        transactionHash: commitedTx!.hash,
      });

      // TODO: GET THE NEW GATEWAY ID
      const newGatewayId = "some-id";

      if (data.logo) {
        await uploadLogo(data.logo!, account?.address.toString()!, newGatewayId);
      }

      router.push("/dashboard/gateways");
    } catch (error) {
      console.error("Error creating gateway:", error);
      toast({
        title: "Error",
        description: "There was an error creating the gateway. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageTitle title="Gateways" segment="Create Gateway" />
      <GatewayForm onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
