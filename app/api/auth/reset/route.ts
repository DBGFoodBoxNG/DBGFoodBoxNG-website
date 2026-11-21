import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth";

export const runtime = "nodejs";

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

  const { token, password } = body as {
    token?: string;
    password?: string;
  };

  if (!token) {
    return NextResponse.json(
      { ok: false, message: "This reset link is missing its token." },
      { status: 400 },
    );
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { ok: false, message: "Use a password with at least 8 characters." },
      { status: 400 },
    );
  }

  const updated = resetPassword(token, password);
  if (!updated) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "That reset link is invalid or has expired. Request a new one to continue.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
