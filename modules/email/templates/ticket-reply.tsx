import { Button, Section, Text } from "@react-email/components";
import {
  EmailLayout,
  Paragraphs,
  TicketMeta,
  brand,
  buttonStyle,
} from "./layout";

export interface ReplyEmailProps {
  customerName?: string;
  ticketId: string;
  subject: string;
  /** Name of the human agent, or "Easy Support AI" for bot replies. */
  agentName: string;
  /** Plain-text reply. Blank lines become paragraphs. */
  message: string;
  /** Link to the ticket conversation in the app. */
  ticketUrl: string;
  /** Optional: the customer's last message, shown as quoted context. */
  customerMessage?: string;
  bannerUrl?: string;
}

export default function ReplyEmail({
  customerName,
  ticketId,
  subject,
  agentName,
  message,
  ticketUrl,
  customerMessage,
}: ReplyEmailProps) {
  return (
    <EmailLayout
      preview={`${agentName} replied to your ticket: ${subject}`}
    >
      <Text
        style={{
          margin: "0 0 4px",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: brand.text,
        }}
      >
        {agentName} replied to your ticket
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: brand.muted }}>
        {        customerName ? `Hi ${customerName}, ` : ""}here&apos;s the latest on your
        request.
      </Text>

      <TicketMeta ticketId={ticketId} subject={subject} />

      <Section
        style={{
          margin: "0 0 20px",
          padding: "4px 0 4px 16px",
          borderLeft: `3px solid ${brand.cyan}`,
        }}
      >
        <Paragraphs text={message} />
      </Section>

      {customerMessage ? (
        <Section
          style={{
            margin: "0 0 20px",
            padding: "10px 14px",
            backgroundColor: brand.bg,
            borderRadius: 8,
          }}
        >
          <Text style={{ margin: "0 0 4px", fontSize: 12, color: brand.muted }}>
            Your message
          </Text>
          <Text
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: "20px",
              color: brand.muted,
              whiteSpace: "pre-line",
            }}
          >
            {customerMessage}
          </Text>
        </Section>
      ) : null}

      <Button href={ticketUrl} style={buttonStyle}>
        View conversation
      </Button>

      <Text style={{ margin: "20px 0 0", fontSize: 13, color: brand.muted }}>
        Need to add something? Open the support conversation and reply there.
        Include ticket #{ticketId} if you contact support another way.
      </Text>
    </EmailLayout>
  );
}

ReplyEmail.PreviewProps = {
  customerName: "Aarav",
  ticketId: "ES-1042",
  subject: "Can't reset my password",
  agentName: "triage",
  message:
    "Thanks for reaching out. I've re-sent the reset link to your email. It expires in 30 minutes.\n\nIf it doesn't arrive, check your spam folder and let me know.",
  customerMessage: "The reset link never arrives in my inbox.",
  ticketUrl: "https://example.com/tickets/ES-1042",
} satisfies ReplyEmailProps;
