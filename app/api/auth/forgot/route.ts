import { NextResponse } from "next/server";
import { issueResetToken } from "@/lib/auth";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "We couldn't read that request." },
      { status: 400 },
    );
  }

  const email = (body as { email?: string }).email?.trim().toLowerCase() ?? "";
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const token = issueResetToken(email);
  const resetUrl = token
    ? `${site.siteUrl.replace(/\/$/, "")}/reset-password?token=${token}`
    : null;

  // No email provider is wired up yet. Log the link so the owner can retrieve it,
  // and only expose it in the response when explicitly enabled for local testing.
  if (resetUrl) {
    console.info(`[password-reset] ${email}: ${resetUrl}`);
  }

  const showLink = process.env.SHOW_RESET_LINK === "1";

  return NextResponse.json({
    ok: true,
    // The same message is returned whether or not the account exists.
    message:
      "If an account exists for that email, a password reset link has been created. Outbound email isn't configured on this server yet, so the link is also written to the server log.",
    resetUrl: showLink ? resetUrl : null,
    emailDeliveryConfigured: false,
  });
}
