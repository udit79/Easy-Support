"use server";

import prisma from "@/lib/db";
import { requireAuth } from "@/modules/auth/actions";
import {
  getSupportUrl,
  sendReplyEmail,
  sendResolvedEmail,
} from "@/modules/email/service";

async function requireAdmin() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { role: true, name: true },
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Admin access required.");
  }

  return user;
}

async function sendTicketNotification(
  kind: "reply" | "resolved",
  ticketId: string,
  send: () => Promise<unknown>,
) {
  try {
    await send();
    return true;
  } catch (error) {
    console.error(`Failed to send ${kind} notification for ticket ${ticketId}:`, error);
    return false;
  }
}

export async function getAdminTickets() {
  await requireAdmin();

  return prisma.ticket.findMany({
    where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    include: {
      user: { select: { name: true, email: true } },
      conversation: { select: { title: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function sendHumanReply(ticketId: string, content: string) {
  const admin = await requireAdmin();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: { select: { name: true, email: true } },
    },
  });
  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  const reply = content.trim();
  if (!reply) {
    throw new Error("Reply cannot be empty.");
  }

  await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId: ticket.conversationId,
        content: reply,
        role: "ASSISTANT",
        agentName: "Human Support",
      },
    }),
    prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "IN_PROGRESS" },
    }),
  ]);

  const emailSent = await sendTicketNotification("reply", ticket.id, () =>
    sendReplyEmail({
      to: ticket.user.email,
      customerName: ticket.user.name,
      ticketId: ticket.id,
      subject: ticket.title,
      agentName: admin.name || "Human Support",
      message: reply,
      ticketUrl: getSupportUrl(),
    }),
  );

  return { emailSent };
}

export async function resolveTicket(ticketId: string) {
  const admin = await requireAdmin();
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }
  const updated = await prisma.ticket.updateMany({
    where: {
      id: ticket.id,
      status: { in: ["OPEN", "IN_PROGRESS"] },
    },
    data: { status: "RESOLVED" },
  });
  if (updated.count === 0) {
    throw new Error("Ticket is already resolved.");
  }

  const emailSent = await sendTicketNotification("resolved", ticket.id, () =>
    sendResolvedEmail({
      to: ticket.user.email,
      customerName: ticket.user.name,
      ticketId: ticket.id,
      subject: ticket.title,
      resolvedBy: admin.name || "Human Support",
      ticketUrl: getSupportUrl(),
    }),
  );

  return { emailSent };
}
