import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your DBGfoodboxng account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Let's get you back in."
      description="Enter the email on your account and we'll create a reset link for you."
      footer={
        <p className="text-center text-[12px] text-cocoa/65">
          <Link
            href="/login"
            className="font-bold text-choco underline-offset-4 transition hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
