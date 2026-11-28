import { Resend } from "resend";
import type { ReactNode } from "react";
import TicketCreatedEmail, {
  type TicketCreatedEmailProps,
} from "./templates/ticket-created";
import ReplyEmail, { type ReplyEmailProps } from "./templates/ticket-reply";
import ResolvedEmail, { type ResolvedEmailProps } from "./templates/ticket-resolved";

// Server-only: never import this file from a "use client" component.
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "Easy Support <support@udit.codes>";
const REPLY_TO = process.env.EMAIL_REPLY_TO; // optional


type Base = { to: string };

export function getSupportUrl() {
  const appUrl = process.env.BETTER_AUTH_URL;
  if (!appUrl) {
    throw new Error("BETTER_AUTH_URL must be configured to send ticket emails.");
  }

  return new URL("/", appUrl).toString();
}

export async function sendEmail({
  to,
  subject,
  react,
}: Base & { subject: string; react: ReactNode }) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject,
    react,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
  return data;
}

export async function sendTicketCreatedEmail({
  to,
  ...props
}: Base & Omit<TicketCreatedEmailProps, "bannerUrl">) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Ticket created: ${props.subject} [#${props.ticketId}]`,
    react: TicketCreatedEmail({ ...props }),
  });
  if (error) throw new Error(`Resend (ticket created): ${error.message}`);
  return data;
}

export async function sendReplyEmail({
  to,
  ...props
}: Base & Omit<ReplyEmailProps, "bannerUrl">) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Re: ${props.subject} [#${props.ticketId}]`,
    react: ReplyEmail({ ...props}),
  });
  if (error) throw new Error(`Resend (reply): ${error.message}`);
  return data;
}

export async function sendResolvedEmail({
  to,
  ...props
}: Base & Omit<ResolvedEmailProps, "bannerUrl">) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Resolved: ${props.subject} [#${props.ticketId}]`,
    react: ResolvedEmail({ ...props }),
  });
  if (error) throw new Error(`Resend (resolved): ${error.message}`);
  return data;
}
