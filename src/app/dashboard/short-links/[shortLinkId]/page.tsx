"use client";

import PageTitle from "@/components/page-title";
import { useToast } from "@/components/ui/use-toast";
import LoadingShortLinkForm from "@/components/views/short-links/loading-form";
import ShortLinkForm, { shortLinkFormSchema } from "@/components/views/short-links/short-link-form";
import { authenticatedGet, authenticatedPost } from "@/lib/authenticatedFetch";
import { ShortLink } from "@/types";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authenticatedDelete } from "@/lib/authenticatedFetch";
import z from "zod";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

interface EditShortLinkPageProps {
  params: {
    shortLinkId: string;
  };
}

export default function EditShortLinkPage({ params }: EditShortLinkPageProps) {
  const { shortLinkId } = params;
  const { toast } = useToast();
  const router = useRouter();

  const [shortLink, setShortLink] = useState<ShortLink | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const fetchData = async () => {
        const res = await authenticatedGet(`/api/short-link/${shortLinkId}`);
        const data = (await res.json()) as ShortLink;
        if (!data) {
          notFound();
        }
        setShortLink(data);
        setIsLoading(false);
      };
      fetchData();
    }
  }, []);

  async function onSubmit(data: z.infer<typeof shortLinkFormSchema>) {
    setSubmitting(true);
    try {
      const response = await authenticatedPost(`/api/short-link/${shortLinkId}`, data);

      if (!response.ok) {
        throw new Error("Failed to update short link");
      }

      setShortLink(await response.json());

      toast({
        title: "Success",
        description: "Short Link updated successfully.",
      });
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

  async function deleteShortLink() {
    if (!shortLink) return;

    setIsLoadingDelete(true);
    try {
      const response = await authenticatedDelete(`/api/short-link/${shortLink.id}`);

      if (!response.ok) {
        throw new Error("Failed to delete short link");
      }

      router.push("/dashboard/short-links");
    } catch (error) {
      console.error("Error deleting short link:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the short link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDelete(false);
    }
  }

  return (
    <div>
      <PageTitle title="Short Links" segment={`${shortLinkId}#SL`} />
      <div className="border border-x-emerald-200 bg-emerald-50 rounded-2xl p-7 flex flex-col gap-2">
        <p>Share this id in your social posts or with your customers:</p>
        <code className="font-mono text-sm">
          <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(`${shortLinkId}#SL`)}>
            <CopyIcon className="size-3" />
          </Button>
          {shortLinkId}#SL
        </code>
      </div>
      <p className="my-10">
        Edit the details below to modify your Short Link. This link will point customers to a payment page with the
        gateway, and amount you set here.
      </p>
      {isLoading ? (
        <LoadingShortLinkForm />
      ) : (
        <ShortLinkForm
          onSubmit={onSubmit}
          submitting={submitting}
          data={shortLink!}
          deleting={isLoadingDelete}
          onDelete={deleteShortLink}
        />
      )}
    </div>
  );
}
