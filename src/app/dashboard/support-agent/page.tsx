"use client";

import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import LoadingAgentForm from "@/components/views/support-agent/loading-form";
import QAEntry from "@/components/views/support-agent/qa-entry";
import TipBox from "@/components/views/support-agent/tip";
import { authenticatedGet, authenticatedPost } from "@/lib/authenticatedFetch";
import { AgentInfo } from "@/types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { LoaderIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const agentInfoSchema = z.object({
  email: z.email("Invalid email address"),
  summary: z
    .string()
    .min(100, "Summary must be at least 100 characters")
    .max(300, "Summary must be at most 300 characters"),
  questions: z.array(
    z.object({
      question: z
        .string()
        .min(10, "Question must be at least 10 characters")
        .max(100, "Question must be at most 100 characters"),
      answer: z
        .string()
        .min(10, "Answer must be at least 10 characters")
        .max(300, "Answer must be at most 300 characters"),
    }),
  ),
});

export default function SupportAgentPage() {
  const { account } = useWallet();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof agentInfoSchema>>({
    defaultValues: {
      email: "",
      summary: "",
      questions: [{ question: "", answer: "" }],
    },
    resolver: zodResolver(agentInfoSchema),
  });

  const [fetchingData, setFetchingData] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function fetchAgentData(address: string) {
    if (fetchingData) return;
    setFetchingData(true);

    try {
      setLoading(true);
      const data = await authenticatedGet(`/api/support-agent/${address}`);
      const agentData = (await data.json()) as AgentInfo;

      if (data.ok && agentData) {
        form.reset({
          email: agentData.email || "",
          summary: agentData.summary || "",
          questions:
            agentData.questions && agentData.questions.length > 0
              ? agentData.questions
              : [{ question: "", answer: "" }],
        });
        setInitialDataLoaded(true);
      } else if (agentData.error && agentData.error === "Support agent not found") {
        // No existing agent data, proceed with defaults
        console.log("No existing agent data found. Proceeding with defaults.");
        setInitialDataLoaded(true);
      }
    } catch (error) {
      console.log("sfasdgas");
      console.error("Failed to fetch agent data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch agent data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setFetchingData(false);
    }
  }

  useEffect(() => {
    if (account?.address && !initialDataLoaded && !fetchingData) {
      fetchAgentData(account.address.toString());
    }
  }, [account?.address]);

  const onSubmit = async (data: z.infer<typeof agentInfoSchema>) => {
    if (submitting) return;
    setSubmitting(true);

    console.log("Submitting data:", data);

    try {
      await agentInfoSchema.parseAsync(data);

      const response = await authenticatedPost(`/api/support-agent/${account?.address}`, data);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Support agent information saved successfully.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save support agent information.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle title="Support Agent" />
      <TipBox />
      <p className="my-10">
        Provide details that the Support Agent can use to answer customer questions during the payment process.
      </p>
      {loading ? (
        <LoadingAgentForm />
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                disabled={submitting}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. support@vendor.com" inputMode="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                disabled={submitting}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Provide a brief summary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="space-y-1">
                  <h4 className="font-medium">FAQ Entries</h4>
                  <p className="text-slate-500">
                    Add questions and answers that your customers frequently ask during checkout.
                  </p>
                </div>

                {form.watch("questions").map((_, index) => (
                  <QAEntry key={index} form={form} submitting={submitting} index={index} />
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  type="button"
                  onClick={() => {
                    const currentPairs = form.getValues("questions");
                    form.setValue("questions", [...currentPairs, { question: "", answer: "" }]);
                  }}
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Question
                </Button>
              </div>
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
        </>
      )}
    </div>
  );
}
