"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
} from "@/components/icons";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <div>
        <p className="rounded-2xl border border-velvet/25 bg-velvet/5 px-4 py-3 text-[12px] leading-relaxed text-cocoa/75">
          This page needs a reset token. Request a new link and open it from
          your email.
        </p>
        <Link href="/forgot-password" className="btn-primary mt-4 w-full">
          Request a reset link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-caramel-200 text-choco">
          <CheckCircleIcon className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-[1.5rem] leading-tight text-cocoa">
          Password updated.
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-cocoa/70">
          Every other session was signed out for safety. Sign in with your new
          password to continue.
        </p>
        <Link href="/login" className="btn-primary mt-5 w-full">
          Go to sign in
        </Link>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Those passwords don't match yet.");
      return;
    }
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "We couldn't reset your password.");
        setSubmitting(false);
        return;
      }

      setDone(true);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="reset-password" className="field-label">
          New password
        </label>
        <div className="relative">
          <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/40" />
          <input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="field px-11"
            placeholder="At least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-cocoa/50 transition hover:bg-cream hover:text-choco focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="reset-confirm" className="field-label">
          Confirm new password
        </label>
        <input
          id="reset-confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="field"
          placeholder="Repeat your new password"
        />
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
            Updating password…
          </>
        ) : (
          "Update password"
        )}
      </button>

      <p className="text-center text-[11px] text-cocoa/55">
        Link expired?{" "}
        <Link href="/forgot-password" className="font-semibold text-choco underline-offset-4 hover:underline">
          Request a new one
        </Link>
      </p>
    </form>
  );
}
