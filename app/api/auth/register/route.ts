import { NextResponse } from "next/server";
import {
  createUser,
  findUserByEmail,
  startSession,
} from "@/lib/auth";

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

  const payload = body as {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim().toLowerCase() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const password = payload.password ?? "";

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, message: "Please enter your full name." },
      { status: 400 },
    );
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, message: "Use a password with at least 8 characters." },
      { status: 400 },
    );
  }
  if (findUserByEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "An account with that email already exists. Try signing in instead.",
      },
      { status: 409 },
    );
  }

  try {
    const user = createUser({
      name,
      email,
      phone: phone || null,
      password,
    });
    await startSession(user.id, true);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Registration failed", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "We couldn't create your account right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
