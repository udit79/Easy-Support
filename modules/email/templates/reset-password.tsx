import { Button, Text } from "@react-email/components";
import { EmailLayout, brand, buttonStyle } from "./layout";

export default function ResetPassword({ name, url }: { name: string; url: string }) {
  return (
    <EmailLayout preview="Reset your password">
      <Text
        style={{
          margin: "0 0 4px",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: brand.text,
        }}
      >
        Reset your password
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 14, color: brand.muted }}>
        Hi {name}, use the button below to choose a new password. If you
        didn&apos;t ask for this, ignore this email.
      </Text>
      <Button href={url} style={buttonStyle}>
        Reset password
      </Button>
    </EmailLayout>
  );
}
ResetPassword.PreviewProps={name:"Arav",url:"https://example.com/resetlink"}