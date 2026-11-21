import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell
      eyebrow="Almost done"
      title="Choose a new password."
      description="Pick something you'll remember. All other sessions will be signed out once it's updated."
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
      <ResetPasswordForm token={token ?? ""} />
    </AuthShell>
  );
}
