import { Gateway } from "@/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ExternalLinkIcon, LoaderIcon, SaveIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";

interface GatewayFormProps {
  onSubmit: (data: any) => Promise<void>;
  data?: Gateway;
  submitting: boolean;
}

export const formSchema = z.object({
  title: z
    .string({ message: "Title is required." })
    .min(10, { message: "Title must be at least 10 characters." })
    .max(100, { message: "Title must be at most 100 characters." }),
  url: z.url({ message: "Please enter a valid URL." }),
  callbackUrl: z.url({ message: "Please enter a valid callback URL." }),
  active: z.boolean(),
  sandbox: z.boolean(),
  logo: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Please pick a logo.",
    })
    .optional(),
});

export default function GatewayForm({ onSubmit, data, submitting }: GatewayFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      callbackUrl: "",
      active: true,
      sandbox: false,
      logo: undefined,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  return (
    <>
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
                  <br />
                  {/* TODO: CREATE HELP PAGE */}
                  <Button variant="link" size="sm" className="px-0 text-xs" asChild>
                    <Link href="/">
                      Learn about the parameters
                      <ExternalLinkIcon className="size-4 ml-1" />
                    </Link>
                  </Button>
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
                      Enable this to process payments on the Aptos Devnet instead of Mainnet. Use this mode to test your
                      integration without real funds. Payments made in Sandbox do not affect your live balance.
                    </FormDescription>
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="btn" disabled={submitting}>
              {submitting ? <LoaderIcon className="animate-spin size-5 mr-2" /> : <SaveIcon className="size-5 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
