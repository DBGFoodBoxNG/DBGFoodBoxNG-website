"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon, MailIcon } from "@/components/icons";

type Result = {
  message: string;
  resetUrl: string | null;
};

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        resetUrl?: string | null;
      };

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "Please check the email address and try again.");
        setSubmitting(false);
        return;
      }

      setResult({
        message: payload.message ?? "Check your inbox for the reset link.",
        resetUrl: payload.resetUrl ?? null,
      });
      setSubmitting(false);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div>
        <div className="rounded-2xl border border-caramel/40 bg-caramel-200/50 px-4 py-4">
          <p className="text-[12.5px] font-semibold text-cocoa">
            Reset request received
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-cocoa/75">
            {result.message}
          </p>
        </div>

        {result.resetUrl ? (
          <div className="mt-4 rounded-2xl border border-choco/20 bg-white/70 px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-caramel-600">
              Development shortcut
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-cocoa/70">
              Email delivery isn&apos;t configured, so the reset link is shown
              here because <code className="rounded bg-cream px-1">SHOW_RESET_LINK=1</code> is
              set on this server.
            </p>
            <Link href={result.resetUrl} className="btn-primary mt-3 w-full">
              Continue to reset password
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-2.5">
          <Link href="/login" className="btn-secondary w-full">
            Back to sign in
          </Link>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setError(null);
            }}
            className="text-[11.5px] font-semibold text-choco underline-offset-4 transition hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="forgot-email" className="field-label">
          Email address
        </label>
        <div className="relative">
          <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/40" />
          <input
            id="forgot-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field pl-11"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-2xl border border-velvet/30 bg-velvet/10 px-4 py-3 text-[12px] font-medium leading-relaxed text-velvet"
        >
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
            />
            Creating reset link…
          </>
        ) : (
          "Send reset link"
        )}
      </button>

      <p className="text-center text-[11px] text-cocoa/55">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-choco underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
