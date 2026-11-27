import { NextResponse } from "next/server";
import { sendReplyEmail, sendResolvedEmail } from "@/modules/email/service";
import ReplyEmail from "@/modules/email/templates/ticket-reply";
import ResolvedEmail from "@/modules/email/templates/ticket-resolved";

// Dev-only test endpoint. Delete this file before deploying.
// Try: http://localhost:3000/api/email/test?template=reply
//      http://localhost:3000/api/email/test?template=resolved&to=you@gmail.com
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") ?? "reply";
  const to = searchParams.get("to") ?? process.env.EMAIL_TO;

  if (!to) {
    return NextResponse.json(
      { error: "Set EMAIL_TO in .env.local or pass ?to=you@example.com" },
      { status: 400 },
    );
  }

  try {
    const data =
      template === "resolved"
        ? await sendResolvedEmail({ to, ...ResolvedEmail.PreviewProps })
        : await sendReplyEmail({ to, ...ReplyEmail.PreviewProps });

    return NextResponse.json({ ok: true, template, to, id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
