"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Gateway, ShortLink } from "@/types";
import { getGateways } from "@/view-functions/getGateways";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import z from "zod";

interface ShortLinkFormProps {
  onSubmit: (data: any) => Promise<void>;
  data?: Partial<ShortLink>;
  submitting: boolean;
}

export const shortLinkFormSchema = z.object({
  amount: z
    .string()
    .min(1, "You must specify an amount")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Amount must be a positive number" }),
  gatewayId: z.string().min(1, "Gateway is required"),
  active: z.boolean(),
});

export default function ShortLinkForm({ onSubmit, data, submitting }: ShortLinkFormProps) {
  const { account } = useWallet();
  const form = useForm<z.infer<typeof shortLinkFormSchema>>({
    defaultValues: {
      amount: "1.0",
      gatewayId: "",
      active: true,
    },
    resolver: zodResolver(shortLinkFormSchema),
  });

  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [isLoadingGateways, setIsLoadingGateways] = useState(true);

  useEffect(() => {
    const fetchGateways = async () => {
      setIsLoadingGateways(true);
      const response = await getGateways(account!.address.toString());
      setGateways(response);
      setIsLoadingGateways(false);
    };

    fetchGateways();
  }, [account]);

  useEffect(() => {
    if (data && gateways.length > 0) {
      form.reset({
        amount: data.amount ?? "1.0",
        gatewayId: data.gatewayId ?? "",
        active: data.active ?? true,
      });
    }
  }, [data, gateways]);

  return (
    <>
      {/* TODO: SHOW ERROR IF NO GATEWAYS */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <FormField
            control={form.control}
            name="amount"
            disabled={submitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (USDT)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Amount in USDT" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gatewayId"
            disabled={submitting || isLoadingGateways || gateways.length === 0}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gateway</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={submitting || isLoadingGateways || gateways.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isLoadingGateways ? "Loading gateways..." : "Select a gateway"} />
                    </SelectTrigger>
                    <SelectContent>
                      {gateways.map((gateway) => (
                        <SelectItem key={gateway.gatewayId} value={gateway.gatewayId}>
                          {gateway.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            disabled={submitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ? "true" : "false"}
                  disabled={field.disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="btn" disabled={submitting}>
              {submitting ? <LoaderIcon className="animate-spin size-5 mr-2" /> : <SaveIcon className="size-5 mr-2" />}
              {data ? "Save Changes" : "Create Short Link"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
