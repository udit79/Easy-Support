"use client";

import { useState } from "react";
import { createMessage } from "../actions";

type SendMessageInput = {
  conversationId: string;
  content: string;
  onChunk?: () => void;
};

export function useChatStream(onComplete: () => Promise<unknown>) {
  const [isStreaming, setIsStreaming] = useState(false);

  async function sendMessage({
    conversationId,
    content,
  }: SendMessageInput) {
    setIsStreaming(true);
    try {
      await createMessage(conversationId, content);
      await onComplete();
    } finally {
      setIsStreaming(false);
    }
  }

  return {
    sendMessage,
    isStreaming,
    streamingContent: "",
    streamingAgentName: null,
    streamingTools: [] as string[],
    lockedNotice: null,
  };
}
