"use server";

import prisma from "@/lib/db";
import type { TicketPriority } from "@/lib/generated/prisma/client";
import { getSupportUrl, sendTicketCreatedEmail } from "@/modules/email/service";
import { requireAuth } from "@/modules/auth/actions";

type CreateEscalationTicketInput = {
  userId: string;
  conversationId: string;
  title: string;
  description: string;
  priority: TicketPriority;
  createdByAgent: string;
};

/**
 * Returns an active ticket for this conversation, if one exists.
 * Active = OPEN or IN_PROGRESS (conversation is AI-locked).
 */
export async function getOpenTicketForConversation(
  conversationId: string,
  userId: string,
) {
  return prisma.ticket.findFirst({
    where: {
      conversationId,
      userId,
      status: { in: ["OPEN", "IN_PROGRESS"] },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Client-friendly helper: uses the signed-in user automatically. */
export async function getOpenTicketForCurrentConversation(
  conversationId: string,
) {
  const user = await requireAuth();
  return getOpenTicketForConversation(conversationId, user.id);
}

/**
 * Creates a human escalation ticket.
 * If the conversation already has an active ticket, returns that one instead.
 */
export async function createEscalationTicket({
  userId,
  conversationId,
  title,
  description,
  priority,
  createdByAgent,
}: CreateEscalationTicketInput) {
  const existing = await getOpenTicketForConversation(conversationId, userId);

  if (existing) {
    return {
      ticket: existing,
      created: false,
      message: `A human support ticket already exists for this conversation. Reference: ${existing.id}`,
    };
  }

  const ticket = await prisma.ticket.create({
    data: {
      userId,
      conversationId,
      title,
      description,
      priority,
      status: "OPEN",
    },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  let emailSent = false;
  try {
    await sendTicketCreatedEmail({
      to: ticket.user.email,
      customerName: ticket.user.name,
      ticketId: ticket.id,
      subject: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      createdByAgent,
      ticketUrl: getSupportUrl(),
    });
    emailSent = true;
  } catch (error) {
    console.error(
      `Failed to send ticket-created notification for ticket ${ticket.id}:`,
      error,
    );
  }

  return {
    ticket,
    created: true,
    emailSent,
    message: emailSent
      ? `Human escalation ticket created. Reference: ${ticket.id}. Priority: ${ticket.priority}. A confirmation email was sent.`
      : `Human escalation ticket created. Reference: ${ticket.id}. Priority: ${ticket.priority}. The confirmation email could not be sent.`,
  };
}

export async function getTicketByIdForUser(ticketId: string, userId: string) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
      userId,
    },
  });
}

export async function getTicketsForUser(userId: string) {
  return prisma.ticket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
