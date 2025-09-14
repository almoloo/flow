import { Button } from "@/components/ui/button";
import { BotMessageSquareIcon, LoaderIcon } from "lucide-react";
import React from "react";

export default function ChatInitialState({
  isInitializing,
  initialize,
}: {
  isInitializing: boolean;
  initialize: () => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-center text-slate-500">
        Need help with your payment? Our Support Agent is here to answer your questions in real time, powered by AI and
        tailored with information from this vendor.
      </p>
      <Button variant="outline" className="w-full" disabled={isInitializing} onClick={initialize}>
        {isInitializing ? (
          <LoaderIcon className="size-4 mr-2 animate-spin" />
        ) : (
          <BotMessageSquareIcon className="size-4 mr-2" />
        )}
        Chat with Support Agent
      </Button>
    </div>
  );
}
