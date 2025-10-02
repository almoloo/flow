import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Invoice } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface InvoiceFormProps {
  onSubmit: (data: any) => Promise<void>;
  data?: Invoice;
  submitting: boolean;
}

export const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, "Amount must be a number and at least 1"),
  email: z.string().email("Invalid email address").optional(),
});

export default function InvoiceForm({ onSubmit, data, submitting }: InvoiceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "1",
      email: "",
    },
  });

  useEffect(() => {
    if (data && data.amount) {
      let newData: { amount: string; email?: string } = {
        amount: data.amount,
      };

      if (data.customerEmail) {
        newData = { ...newData, email: data.customerEmail };
      }

      form.reset(newData);
    }
  }, [data]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="decimal" {...field} className="border p-2" />
                </FormControl>
                <FormDescription>The amount to be paid.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="border p-2" />
                </FormControl>
                <FormDescription>The email address of the payer (optional).</FormDescription>
                <FormMessage />
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
