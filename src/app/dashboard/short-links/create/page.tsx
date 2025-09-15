"use client";

import PageTitle from "@/components/page-title";
import { useToast } from "@/components/ui/use-toast";
import ShortLinkForm, { shortLinkFormSchema } from "@/components/views/short-links/short-link-form";
import TipBox from "@/components/views/short-links/tip";
import { authenticatedPost } from "@/lib/authenticatedFetch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

export default function CreateShortLinkPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data: z.infer<typeof shortLinkFormSchema>) {
    console.log("Form submitted:", data);
    setSubmitting(true);
    try {
      const response = await authenticatedPost("/api/short-link", data);

      if (!response.ok) {
        throw new Error("Failed to create short link");
      }

      router.push("/dashboard/short-links");
    } catch (error) {
      console.error("Error creating short link:", error);
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
      <PageTitle title="Short Links" segment="Create Short Link" />
      <TipBox />
      <p className="my-10">
        Fill in the details below to generate your Short Link. This link will point customers to a payment page with the
        gateway, and amount you set here.
      </p>
      <ShortLinkForm onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
