"use client";

import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Gateway } from "@/types";
import { getGateway } from "@/view-functions/GetGateway";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLinkIcon, LoaderIcon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingGatewayForm from "@/components/views/gateway/loading-form";
import { editGateway } from "@/entry-functions/editGateway";

interface EditGatewayPageProps {
  params: {
    gatewayId: string;
  };
}

const formSchema = z.object({
  title: z.string().min(10).max(100),
  url: z.url(),
  callbackUrl: z.url(),
  active: z.boolean(),
  sandbox: z.boolean(),
  logo: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Please pick a logo.",
    })
    .optional(),
});

export default function EditGatewayPage({ params }: EditGatewayPageProps) {
  const { account } = useWallet();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [gatewayInfo, setGatewayInfo] = useState<Gateway | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGatewayInfo = async () => {
    setIsLoading(true);
    const gw = await getGateway(account?.address.toString()!, params.gatewayId);

    if (!gw) {
      notFound();
    }

    setGatewayInfo(gw);
  };

  useEffect(() => {
    fetchGatewayInfo();
  }, []);

  useEffect(() => {
    if (gatewayInfo) {
      form.reset(gatewayInfo);
      setIsLoading(false);
    }
  }, [gatewayInfo]);

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <FormField
              control={form.control}
              name="title"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. “Donations”" />
                  </FormControl>
                  <FormDescription>
                    The public name of your gateway. Customers will see this on your payment page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. https://..." />
                  </FormControl>
                  <FormDescription>Your business or store website. Helps customers verify your brand.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a square image or logo (PNG, JPG, or SVG). This will appear on your payment page and in your
                    dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="callbackUrl"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Callback URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormDescription>
                    We’ll redirect the user to this URL with payment info embedded as query strings. Use your server
                    endpoint that handles payment confirmations.
                  </FormDescription>
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
                  <FormDescription>
                    Set to Active to accept payments. Inactive gateways will not process new transactions.
                    {/* TODO: CREATE HELP PAGE */}
                    <div>
                      <Link href="/" passHref>
                        <Button variant="link" size="sm" className="px-0 text-xs">
                          Learn about the parameters
                          <ExternalLinkIcon className="size-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sandbox"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-start rounded-lg border gap-2 px-3 py-2 font-mono">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={field.disabled} />
                    </FormControl>
                    <div className="p-0">
                      <FormLabel>Sandbox Mode</FormLabel>
                      <FormDescription className="text-xs leading-relaxed mt-1">
                        Enable this to process payments on the Aptos Devnet instead of Mainnet. Use this mode to test
                        your integration without real funds. Payments made in Sandbox do not affect your live balance.
                      </FormDescription>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="btn" disabled={submitting}>
                {submitting ? (
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                ) : (
                  <SaveIcon className="size-5 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
