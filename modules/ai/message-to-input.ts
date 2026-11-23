import { assistant, user, type AgentInputItem } from "@openai/agents";
import type { Message } from "@/lib/generated/prisma/client";

export function messageToInput(messages: Message[]): AgentInputItem[] {
    return messages.map((message) =>
        message.role === "ASSISTANT"
            ? assistant(message.content)
            : user(message.content)
    );
}