import { NextResponse } from "next/server";
import { getDb, nowIso } from "@/lib/db";

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

  const { name, email, message } = body as {
    name?: string;
    email?: string;
    message?: string;
  };

  const cleanName = name?.trim() ?? "";
  const cleanEmail = email?.trim().toLowerCase() ?? "";
  const cleanMessage = message?.trim() ?? "";

  if (cleanName.length < 2) {
    return NextResponse.json(
      { ok: false, message: "Please tell us your name." },
      { status: 400 },
    );
  }
  if (!EMAIL_PATTERN.test(cleanEmail)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (cleanMessage.length < 10) {
    return NextResponse.json(
      { ok: false, message: "Please add a little more detail to your message." },
      { status: 400 },
    );
  }

  try {
    getDb()
      .prepare(
        "INSERT INTO messages (id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .run(
        crypto.randomUUID(),
        cleanName,
        cleanEmail,
        cleanMessage,
        nowIso(),
      );
  } catch (error) {
    console.error("Contact message failed", error);
    return NextResponse.json(
      { ok: false, message: "We couldn't save your message. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you — your message has been saved and we'll reply by email.",
  });
}
