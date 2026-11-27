import { Resend } from "resend";
import ReplyEmail, { type ReplyEmailProps } from "./templates/ticket-reply";
import ResolvedEmail, { type ResolvedEmailProps } from "./templates/ticket-resolved";

// Server-only: never import this file from a "use client" component.
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "Easy Support <support@udit.codes>";
const REPLY_TO = process.env.EMAIL_REPLY_TO; // optional


type Base = { to: string };

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
