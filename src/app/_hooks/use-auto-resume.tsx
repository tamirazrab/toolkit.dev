"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import type { UIMessage } from "ai";
import type { UseChatHelpers } from "@ai-sdk/react";

type DataPart =
  | { type: "append-message"; message: string }
  | { type: "error"; message: string };

export interface UseAutoResumeParams {
  autoResume: boolean;
  initialMessages: UIMessage[];
  experimental_resume: UseChatHelpers["experimental_resume"];
  data: UseChatHelpers["data"];
  setMessages: UseChatHelpers["setMessages"];
  onStreamError?: () => void;
}

export function useAutoResume({
  autoResume,
  initialMessages,
  experimental_resume,
  data,
  setMessages,
  onStreamError,
}: UseAutoResumeParams) {
  useEffect(() => {
    if (!autoResume) return;

    const mostRecentMessage = initialMessages.at(-1);

    if (mostRecentMessage?.role === "user") {
      experimental_resume();
    }

    // we intentionally run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) return;
    if (data.length === 0) return;

    const dataPart = data[0] as DataPart;

    if (dataPart.type === "append-message") {
      const message = JSON.parse(dataPart.message) as UIMessage;
      setMessages([...initialMessages, message]);
    } else if (dataPart.type === "error") {
      toast.error(dataPart.message);
      onStreamError?.();
    }
  }, [data, initialMessages, setMessages, onStreamError]);
}
