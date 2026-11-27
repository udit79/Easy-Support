import { Button, Link, Section, Text } from "@react-email/components";
import {
  EmailLayout,
  Paragraphs,
  TicketMeta,
  brand,
  buttonStyle,
} from "./layout";

export interface ResolvedEmailProps {
  customerName?: string;
  ticketId: string;
  subject: string;
  /** Who closed it: an agent's name or "Easy Support AI". */
  resolvedBy: string;
  /** Short plain-text summary of the fix. Blank lines become paragraphs. */
  resolutionSummary?: string;
  /** Link to the ticket in the app. */
  ticketUrl: string;
  /** Link that reopens the ticket (e.g. /tickets/:id/reopen?token=...). */
  reopenUrl: string;
  /** Optional rating/feedback link. */
  feedbackUrl?: string;
  bannerUrl?: string;
}

export default function ResolvedEmail({
  customerName,
  ticketId,
  subject,
  resolvedBy,
  resolutionSummary,
  ticketUrl,
  reopenUrl,
  feedbackUrl,
}: ResolvedEmailProps) {
  return (
    <EmailLayout
      preview={`Ticket #${ticketId} is resolved: ${subject}`}
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
        Your ticket is resolved
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: brand.muted }}>
        {customerName ? `Hi ${customerName}, ` : ""}
        {resolvedBy} marked this request as resolved.
      </Text>

      <TicketMeta ticketId={ticketId} subject={subject} />

      {resolutionSummary ? (
        <Section
          style={{
            margin: "0 0 20px",
            padding: "4px 0 4px 16px",
            borderLeft: `3px solid ${brand.orange}`,
          }}
        >
          <Text
            style={{ margin: "0 0 6px", fontSize: 12, color: brand.muted }}
          >
            What we did
          </Text>
          <Paragraphs text={resolutionSummary} />
        </Section>
      ) : null}

      <Button href={ticketUrl} style={buttonStyle}>
        View ticket
      </Button>

      <Text
        style={{
          margin: "24px 0 0",
          fontSize: 13,
          lineHeight: "20px",
          color: brand.muted,
        }}
      >
        Still having the problem?{" "}
        <Link href={reopenUrl} style={{ color: brand.cyan }}>
          Reopen this ticket
        </Link>
        {feedbackUrl ? (
          <>
            {" "}
            or{" "}
            <Link href={feedbackUrl} style={{ color: brand.cyan }}>
              tell us how we did
            </Link>
          </>
        ) : null}
        .
      </Text>
    </EmailLayout>
  );
}

ResolvedEmail.PreviewProps = {
  customerName: "Aarav",
  ticketId: "ES-1042",
  subject: "Can't reset my password",
  resolvedBy: "Udit",
  resolutionSummary:
    "We re-sent your reset link and confirmed the password change went through.",
  ticketUrl: "https://example.com/tickets/ES-1042",
  reopenUrl: "https://example.com/tickets/ES-1042/reopen",
  feedbackUrl: "https://example.com/tickets/ES-1042/feedback",
} satisfies ResolvedEmailProps;
