import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDb, nowIso } from "@/lib/db";
import { site } from "@/lib/site";

export const SESSION_COOKIE = "dbg_session";
const PASSWORD_KEYLEN = 64;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  created_at: string;
};

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, PASSWORD_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const candidate = scryptSync(password, salt, PASSWORD_KEYLEN);
  return (
    expected.length === candidate.length && timingSafeEqual(candidate, expected)
  );
}

export function findUserByEmail(email: string): UserRow | undefined {
  return getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(normaliseEmail(email)) as UserRow | undefined;
}

export function findUserById(id: string): UserRow | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | UserRow
    | undefined;
}

export function createUser(input: {
  name: string;
  email: string;
  phone: string | null;
  password: string;
}): SessionUser {
  const id = crypto.randomUUID();
  getDb()
    .prepare(
      "INSERT INTO users (id, name, email, phone, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(
      id,
      input.name.trim(),
      normaliseEmail(input.email),
      input.phone?.trim() || null,
      hashPassword(input.password),
      nowIso(),
    );
  return {
    id,
    name: input.name.trim(),
    email: normaliseEmail(input.email),
    phone: input.phone?.trim() || null,
  };
}

export function updatePassword(userId: string, password: string): void {
  getDb()
    .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .run(hashPassword(password), userId);
}

export async function startSession(
  userId: string,
  remember: boolean,
): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
  getDb()
    .prepare(
      "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    )
    .run(token, userId, Date.now() + maxAge * 1000, nowIso());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    secure: site.siteUrl.startsWith("https://"),
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email, u.phone
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .get(token, Date.now()) as SessionUser | undefined;

  return row ?? null;
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    getDb().prepare("DELETE FROM sessions WHERE id = ?").run(token);
  }
  jar.delete(SESSION_COOKIE);
}

export function issueResetToken(email: string): string | null {
  const user = findUserByEmail(email);
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  getDb()
    .prepare("DELETE FROM password_resets WHERE user_id = ?")
    .run(user.id);
  getDb()
    .prepare(
      "INSERT INTO password_resets (token, user_id, expires_at, used, created_at) VALUES (?, ?, ?, 0, ?)",
    )
    .run(token, user.id, Date.now() + 60 * 60 * 1000, nowIso());
  return token;
}

export function resetPassword(token: string, password: string): boolean {
  const row = getDb()
    .prepare(
      "SELECT user_id FROM password_resets WHERE token = ? AND used = 0 AND expires_at > ?",
    )
    .get(token, Date.now()) as { user_id: string } | undefined;
  if (!row) return false;

  updatePassword(row.user_id, password);
  getDb()
    .prepare("UPDATE password_resets SET used = 1 WHERE token = ?")
    .run(token);
  // Any existing sessions are invalidated after a password reset.
  getDb().prepare("DELETE FROM sessions WHERE user_id = ?").run(row.user_id);
  return true;
}

export function clearExpiredSessions(): void {
  getDb().prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
}
