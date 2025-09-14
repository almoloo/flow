import { EllipsisIcon, LoaderIcon, SendHorizonalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types";

export default function ChatInitializedState({
  messages,
  loading,
  input,
  setInput,
  sendMessage,
}: {
  messages?: ChatMessage[];
  loading: boolean;
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col mt-auto gap-4">
        {messages?.map(
          (msg, index) =>
            msg.content.trim() && (
              <div key={index} className={`chat-message self-end ${msg.role}`}>
                {msg.content}
              </div>
            ),
        )}
        {loading && messages![messages?.length! - 1]?.content.length === 0 && (
          <div className="chat-loading">
            <EllipsisIcon className="size-8 animate-pulse" />
          </div>
        )}
      </div>
      <form
        className=" pt-4 sticky bottom-0"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <div className="flex shadow-lg focus-within:ring-4 focus-within:ring-indigo-200 rounded-md transition-shadow">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button variant="default" type="submit" disabled={loading} className="rounded-l-none">
            {loading ? <LoaderIcon className="size-4 animate-spin" /> : <SendHorizonalIcon className="size-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
