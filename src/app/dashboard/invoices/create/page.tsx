"use client";

import PageTitle from "@/components/page-title";
import { useToast } from "@/components/ui/use-toast";
import InvoiceForm, { formSchema } from "@/components/views/invoice/invoice-form";
import TipBox from "@/components/views/invoice/tip";
import { authenticatedPost } from "@/lib/authenticatedFetch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

export default function CreateInvoicePage() {
  const { toast } = useToast();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const response = await authenticatedPost("/api/invoice", data);
      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }
      const invoice = await response.json();
      router.push(`/dashboard/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "There was an error creating the invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageTitle title="Invoices" segment="Create Invoice" />
      <TipBox />
      <p className="my-10">
        Create a one-time invoice with an amount and customer email. We’ll email a secure payment link your customer can
        use to pay—no gateway setup needed.
      </p>
      <InvoiceForm submitting={submitting} onSubmit={onSubmit} />
    </div>
  );
}
