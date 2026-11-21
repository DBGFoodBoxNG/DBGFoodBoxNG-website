import { NextResponse } from "next/server";
import {
  findUserByEmail,
  startSession,
  verifyPassword,
} from "@/lib/auth";

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

  const payload = body as {
    email?: string;
    password?: string;
    remember?: boolean;
  };

  const email = payload.email?.trim().toLowerCase() ?? "";
  const password = payload.password ?? "";
  const remember = payload.remember === true;

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Enter your email and password to continue." },
      { status: 400 },
    );
  }

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { ok: false, message: "That email and password don't match our records." },
      { status: 401 },
    );
  }

  await startSession(user.id, remember);

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
}
