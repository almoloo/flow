"use client";

import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useVendorInfo } from "@/hooks/useVendorInfo";
import { LoaderIcon, SaveIcon } from "lucide-react";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { FLOW_ABI } from "@/utils/flow_abi";
import { aptosClient } from "@/utils/aptosClient";
import { useToast } from "@/components/ui/use-toast";
import { uploadVendorAvatar } from "@/lib/utils";
import { authenticatedPost } from "@/lib/authenticatedFetch";

const profileSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required." })
    .min(2, { message: "Name must be at least 2 characters." })
    .max(25, { message: "Name must be at most 25 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .nonempty({ message: "Email is required." }),
  avatar: z.custom<File>((file) => file instanceof File && file.size > 0, {
    message: "Please pick an avatar.",
  }),
});

function updateInfo(avatar: File, address: string, name: string, email: string) {
  function upsertInfo(address: string, name: string, email: string) {
    return new Promise(async (resolve, reject) => {
      const response = await authenticatedPost(`/api/vendor/${address}`, {
        address,
        name,
        email,
      });

      if (response.ok) {
        resolve(true);
      } else {
        reject(new Error("Failed to update vendor info"));
      }
    });
  }
  return new Promise(async (resolve, reject) => {
    try {
      const uploadedAvatar = await uploadVendorAvatar(avatar, address);
      console.log("Uploaded Avatar URL:", uploadedAvatar);
      const upsertedInfo = await upsertInfo(address, name, email);
      console.log("Upserted Info:", upsertedInfo);
      if (uploadedAvatar && upsertedInfo) {
        resolve(true);
      } else {
        reject(new Error("Failed to update vendor info"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

export default function ProfilePage() {
  const { account } = useWallet();
  const { client } = useWalletClient();
  const { vendor, refresh } = useVendorInfo();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: vendor?.name ?? "",
      email: vendor?.email ?? "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vendor?.name) {
      form.setValue("name", vendor.name);
    }
    if (vendor?.email) {
      form.setValue("email", vendor.email);
    }
  }, [vendor, form]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setSubmitting(true);

    try {
      if (!vendor) {
        const commitedTx = await client?.useABI(FLOW_ABI).init_vendor({
          arguments: [data.name],
          type_arguments: [],
        });

        await aptosClient().waitForTransaction({
          transactionHash: commitedTx!.hash,
        });
      } else {
        const commitedTx = await client?.useABI(FLOW_ABI).update_vendor_name({
          arguments: [data.name],
          type_arguments: [],
        });

        await aptosClient().waitForTransaction({
          transactionHash: commitedTx!.hash,
        });
      }
      await updateInfo(data.avatar, account?.address.toString()!, data.name, data.email);
      refresh();
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle title="Edit Profile" />
      <p>
        Please complete your profile to initialize your vendor account if you haven't done so already. This step is
        essential to unlock all features and start using the dashboard. Let's get started!
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <FormField
            control={form.control}
            name="name"
            disabled={submitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name" />
                </FormControl>
                <FormDescription>Your name will be displayed publicly on your gateways.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={submitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email" inputMode="email" />
                </FormControl>
                <FormDescription>Your email will be used by us for emergencies or inquiries.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            disabled={submitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
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
                <FormDescription>Your avatar will be displayed publicly on your gateways.</FormDescription>
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
    </div>
  );
}
