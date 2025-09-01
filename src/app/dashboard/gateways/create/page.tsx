"use client";

import PageTitle from "@/components/page-title";
import GatewayForm, { formSchema } from "@/components/views/gateway/gateway-form";
import { createGateway } from "@/entry-functions/createGateway";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import z from "zod";

export default function CreateGatewayPage() {
  const { account } = useWallet();

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form submitted:", data);

    setSubmitting(true);

    try {
      await createGateway(account?.address.toString()!, data);
      // TODO: SHOW SUCCESS TOAST
    } catch (error) {
      console.error("Error creating gateway:", error);
      // TODO: SHOW ERROR TOAST
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
