"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import PaymentFooter from "@/components/views/payment/footer";
import PaymentHeader from "@/components/views/payment/header";
import { ShortLink } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon, ScanSearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  id: z.string().length(9),
});

export default function FindPaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  // TODO: ADD INSTAGRAM POST FETCHING
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/short-link/${values.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch Short Link");
      }

      const json = (await response.json()) as ShortLink;

      if (json.active === "false") {
        throw new Error("This Short Link is disabled.");
      }

      toast({
        title: "Success",
        description: "Redirecting to the payment gateway.",
      });

      router.push(`/payment?va=${json.walletAddress}&gid=${json.gatewayId}&amount=${json.amount}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error
          ? error.message
          : "There was an error finding the Short Link or it doesn't exist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between payment-bg">
      <PaymentHeader />
      <section className="bg-white mx-10 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-10 flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-lg">Find Your Payment</h2>
            <p className="text-slate-600">
              Easily locate a payment link by pasting the short link ID provided by the vendor.
            </p>
          </div>
        </div>
        <div className="px-10 mb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Input placeholder="Paste the short link ID (e.g., 5642#SL)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <LoaderIcon className="size-5 mr-2 animate-spin" />
                ) : (
                  <ScanSearchIcon className="size-5 mr-2" />
                )}
                Find Payment
              </Button>
            </form>
          </Form>
        </div>
      </section>
      <PaymentFooter />
    </div>
  );
}
