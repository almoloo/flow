"use client";

import { notFound, useSearchParams } from "next/navigation";
import { useGatewayInfo } from "@/hooks/useGatewayInfo";
import { useEffect, useRef, useState } from "react";
import GatewayCard from "./gateway-card";
import { ChatMessage } from "@/types";
import ChatInitialState from "./chat-initial-state";
import ChatInitializedState from "./chat-initialized";

export default function ChatBox() {
  const searchParams = useSearchParams();
  const va = searchParams.get("va");
  const gid = searchParams.get("gid");
  const { gateway, loading, error, done } =
    va && gid ? useGatewayInfo(va!, gid!) : { gateway: null, loading: false, error: null, done: false };

  const [cardMode] = useState<"horizontal" | "vertical">("vertical");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const chatBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      notFound();
    }
  }, [loading, error, done]);

  useEffect(() => {
    function scrollToBottom() {
      if (chatBox.current) {
        chatBox.current.scrollTop = chatBox.current.scrollHeight;
      }
    }
    scrollToBottom();
  }, [messages, isLoading, isInitialized]);
  async function sendMessage(init?: boolean) {
    if ((!input.trim() || isLoading) && !init) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    if (!init) {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    }

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(`/api/support-agent/${va}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: init ? "Return a greeting message for initialization" : userMessage,
          conversationHistory: messages.slice(-10),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let assistantResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.content) {
                // Add artificial delay for typing effect
                await new Promise((resolve) => setTimeout(resolve, 100));
                assistantResponse += data.content;

                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant") {
                    newMessages[newMessages.length - 1].content = assistantResponse;
                  }
                  return newMessages;
                });
              }

              if (data.done) {
                console.log("Stream completed");
              }

              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Error:", error);
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant") {
            newMessages[newMessages.length - 1].content = "Sorry, I encountered an error. Please try again.";
          }
          return newMessages;
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }

  async function initializeChat() {
    setIsInitializing(true);
    try {
      await sendMessage(true);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setIsInitializing(false);
    }
  }

  return (
    <div className="flex flex-col h-full gap-5 overflow-y-auto p-10" ref={chatBox}>
      <div>{gateway && <GatewayCard gateway={gateway} address={va!} mode={cardMode} />}</div>
      <div className="grow flex flex-col justify-end">
        {isInitialized ? (
          <ChatInitializedState
            messages={messages}
            loading={isLoading}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        ) : (
          <ChatInitialState isInitializing={isInitializing} initialize={initializeChat} />
        )}
      </div>
    </div>
  );
}
