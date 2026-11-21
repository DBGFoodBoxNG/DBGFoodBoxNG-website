import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a DBGfoodboxng account for faster checkout, saved details and order history.",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/account");

  return (
    <AuthShell
      eyebrow="Create your account"
      title="A faster way to your next loaf."
      description="Save your delivery details, keep your order history in one place and reorder in a tap."
      footer={
        <p className="text-center text-[12px] text-cocoa/65">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-choco underline-offset-4 transition hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
