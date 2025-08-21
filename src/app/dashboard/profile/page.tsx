"use client";

import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { uploadFile } from "@/lib/s3";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { useVendorInfo } from "@/hooks/useVendorInfo";
import { initVendor } from "@/entry-functions/initVendor";

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

function uploadAvatar(avatar: File, address: string) {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const uploadAvatar = await fetch(`/api/avatar/vendor/${address}`, {
      method: "POST",
      body: formData,
    });

    if (uploadAvatar.ok) {
      const { url } = await uploadAvatar.json();
      resolve(url);
    } else {
      reject(new Error("Failed to upload avatar"));
    }
  });
}

export default function ProfilePage() {
  const { account } = useWallet();
  const { name, refresh } = useVendorInfo();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    console.log("Form submitted:", data);
    setSubmitting(true);

    try {
      if (!name) {
        // TODO: SUBMIT DATA TO CONTRACT
        await initVendor(account?.address.toString()!);
      }
      const avatarUrl = await uploadAvatar(data.avatar, account?.address.toString()!);
      refresh();
      // TODO: SHOW SUCCESS TOAST
    } catch (error) {
      console.error("Error uploading avatar:", error);
      // TODO: SHOW ERROR TOAST
    } finally {
      setSubmitting(false);
    }
  };
  const onError = (errors: any) => {
    console.error("Form errors:", errors);
  };

  return (
    <div>
      <PageTitle title="Edit Profile" />
      <p>
        Please complete your profile to initialize your vendor account if you haven't done so already. This step is
        essential to unlock all features and start using the dashboard. Let's get started!
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="mt-5 space-y-4">
          <FormField
            control={form.control}
            name="name"
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
                  />
                </FormControl>
                <FormDescription>Your avatar will be displayed publicly on your gateways.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="btn">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
