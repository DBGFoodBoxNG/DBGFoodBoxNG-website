import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to DBGfoodboxng to reorder your favourite banana bread and track deliveries.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getSessionUser();

  if (user) {
    redirect(next && next.startsWith("/") ? next : "/account");
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Good to see you again."
      description="Sign in to pick up where you left off — your favourite flavours are still here."
      footer={
        <p className="text-center text-[12px] text-cocoa/65">
          New to DBGfoodboxng?{" "}
          <Link
            href="/register"
            className="font-bold text-choco underline-offset-4 transition hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
