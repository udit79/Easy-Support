import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const brand = {
  bg: "#0d1017",
  card: "#151a24",
  border: "#262d3d",
  text: "#f2f4f8",
  muted: "#9aa3b5",
  cyan: "#5ce1ff",
  blue: "#4f9bff",
  orange: "#ff7a59",
};

const font =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

type LayoutProps = {
  preview: string;
  children: React.ReactNode;
  /** Absolute URL of the hosted banner image (PNG/JPG, ~1120px wide). Optional. */
  bannerUrl?: string;
  appUrl?: string;
};

export function EmailLayout({
  preview,
  children,
  bannerUrl="https://raw.githubusercontent.com/udit79/Easy-Support/refs/heads/main/public/logo.png",
  appUrl = "https://github.com/udit79/Easy-Support",
}: LayoutProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="dark light" />
        <meta name="supported-color-schemes" content="dark light" />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: brand.bg,
          margin: 0,
          padding: "32px 12px",
          fontFamily: font,
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            backgroundColor: brand.card,
            border: `1px solid ${brand.border}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {/* Full-width banner at the very top. Falls back to a text wordmark. */}
          {bannerUrl ? (
            <Section style={{ padding: 0, lineHeight: 0, fontSize: 0 }}>
              <img
                src={bannerUrl}
                alt="Easy Support: AI-powered collaborative support"
                width="560"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "100%",
                  height: "auto",
                  border: 0,
                }}
              />
            </Section>
          ) : (
            <Section style={{ padding: "28px 32px 0" }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: brand.text,
                }}
              >
                Easy Support
              </Text>
            </Section>
          )}

          <Section style={{ padding: "28px 32px 32px" }}>{children}</Section>

          <Hr style={{ borderColor: brand.border, margin: 0 }} />
          <Section style={{ padding: "20px 32px 28px" }}>
            <Text
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: "18px",
                color: brand.muted,
              }}
            >
              You're getting this because you contacted Easy Support. Reply to
              this email to add to your ticket.{" "}
              <Link href={appUrl} style={{ color: brand.cyan }}>
                Easy Support
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <Text
            key={i}
            style={{
              margin: "0 0 14px",
              fontSize: 15,
              lineHeight: "24px",
              color: brand.text,
              whiteSpace: "pre-line",
            }}
          >
            {p}
          </Text>
        ))}
    </>
  );
}

export function TicketMeta({
  ticketId,
  subject,
}: {
  ticketId: string;
  subject: string;
}) {
  return (
    <Section
      style={{
        margin: "0 0 20px",
        padding: "12px 14px",
        backgroundColor: brand.bg,
        border: `1px solid ${brand.border}`,
        borderRadius: 10,
      }}
    >
      <Text style={{ margin: 0, fontSize: 12, color: brand.muted }}>
        Ticket #{ticketId}
      </Text>
      <Text
        style={{
          margin: "2px 0 0",
          fontSize: 14,
          fontWeight: 600,
          color: brand.text,
        }}
      >
        {subject}
      </Text>
    </Section>
  );
}

export const buttonStyle = {
  backgroundColor: brand.orange,
  color: "#1a0f0b",
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: 8,
  display: "inline-block",
} as const;
