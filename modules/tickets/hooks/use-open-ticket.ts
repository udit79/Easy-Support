"use client";

import { useQuery } from "@tanstack/react-query";

export function useOpenTicket(conversationId: string) {
  return useQuery({
    queryKey: ["open-ticket", conversationId],
    queryFn: async (): Promise<{ id: string; priority: string } | null> => null,
    enabled: !!conversationId,
  });
}
