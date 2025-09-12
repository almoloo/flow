import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";

interface QAEntryProps {
  form: any;
  submitting: boolean;
  index: number;
}

export default function QAEntry({ form, submitting, index }: QAEntryProps) {
  return (
    <div className="mt-4 space-y-1 rounded-md border bg-slate-50 p-2 pl-5 relative">
      <FormField
        control={form.control}
        name={`questions.${index}.question`}
        disabled={submitting}
        render={({ field }) => (
          <FormItem className="flex items-center gap-4 space-y-0">
            <FormLabel className="w-[100px]">Question</FormLabel>
            <FormControl className="grow">
              <Input {...field} placeholder="e.g. What payment methods do you accept?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`questions.${index}.answer`}
        disabled={submitting}
        render={({ field }) => (
          <FormItem className="flex items-center gap-4">
            <FormLabel className="w-[100px]">Answer</FormLabel>
            <FormControl className="grow">
              <Input {...field} placeholder="e.g. We accept credit cards, PayPal, and more." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("questions").length > 1 && (
        <Button
          type="button"
          size="icon"
          variant="icon"
          className="w-6 h-6 p-0 absolute -top-3 -right-3 !mt-0 rounded-full"
          onClick={() => {
            const currentPairs = form.getValues("questions");
            form.setValue(
              "questions",
              currentPairs.filter((_: any, i: number) => i !== index),
            );
          }}
        >
          <XIcon className="size-3 text-rose-400" />
        </Button>
      )}
    </div>
  );
}
