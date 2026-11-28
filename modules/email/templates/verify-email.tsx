import { Button, Text } from "@react-email/components";
import { EmailLayout, brand, buttonStyle } from "./layout";

export default function VerifyEmail({ name, url }: { name: string; url: string }) {
  return (
    <EmailLayout preview="Confirm your email">
      <Text
        style={{
          margin: "0 0 4px",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: brand.text,
        }}
      >
        Verify your email
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: brand.muted }}>
        Hi {name}, confirm your email to start using Easy Support.
      </Text>
      <Button href={url} style={buttonStyle}>
        Verify email
      </Button>
    </EmailLayout>
  );
}
VerifyEmail.PreviewProps={name:"Arav",url:"https://example.com/verify"}