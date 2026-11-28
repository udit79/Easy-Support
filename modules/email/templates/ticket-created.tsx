import { Button, Section, Text } from "@react-email/components";
import {
  EmailLayout,
  Paragraphs,
  TicketMeta,
  brand,
  buttonStyle,
} from "./layout";

export interface TicketCreatedEmailProps {
  customerName?: string;
  ticketId: string;
  subject: string;
  description: string;
  priority: string;
  createdByAgent: string;
  ticketUrl: string;
  bannerUrl?: string;
}

export default function TicketCreatedEmail({
  customerName,
  ticketId,
  subject,
  description,
  priority,
  createdByAgent,
  ticketUrl,
}: TicketCreatedEmailProps) {
  return (
    <EmailLayout
      preview={`Support ticket created: ${subject}`}
      appUrl={ticketUrl}
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
        Your support ticket was created
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: brand.muted }}>
        {customerName ? `Hi ${customerName}, ` : ""}
        We&apos;ve sent your request to our support team.
      </Text>

      <TicketMeta ticketId={ticketId} subject={subject} />

      <Section
        style={{
          margin: "0 0 20px",
          padding: "12px 14px",
          backgroundColor: brand.bg,
          borderRadius: 8,
        }}
      >
        <Text style={{ margin: "0 0 8px", fontSize: 13, color: brand.text }}>
          <strong>Created by:</strong> {createdByAgent}
        </Text>
        <Text style={{ margin: "0 0 8px", fontSize: 13, color: brand.text }}>
          <strong>Priority:</strong> {priority}
        </Text>
        <Paragraphs text={description} />
      </Section>

      <Button href={ticketUrl} style={buttonStyle}>
        View support conversation
      </Button>

      <Text style={{ margin: "20px 0 0", fontSize: 13, color: brand.muted }}>
        A support agent will follow up on this ticket.
      </Text>
    </EmailLayout>
  );
}

TicketCreatedEmail.PreviewProps = {
  customerName: "Aarav",
  ticketId: "ES-1042",
  subject: "Can't reset my password",
  description: "The reset link never arrives in my inbox.",
  priority: "HIGH",
  createdByAgent: "Easy Support Technical Agent",
  ticketUrl: "https://example.com",
} satisfies TicketCreatedEmailProps;