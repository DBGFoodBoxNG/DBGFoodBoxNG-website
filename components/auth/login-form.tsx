"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AppleIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
} from "@/components/icons";

type Props = {
  next?: string;
};

export function LoginForm({ next }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const destination = next && next.startsWith("/") ? next : "/account";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "We couldn't sign you in. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push(destination);
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  async function onSocial(provider: "google" | "apple") {
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/auth/oauth/${provider}`);
      const payload = (await response.json()) as { message?: string };
      setNotice(
        payload.message ??
          `${provider === "google" ? "Google" : "Apple"} sign-in isn't configured on this server yet.`,
      );
    } catch {
      setNotice(
        `${provider === "google" ? "Google" : "Apple"} sign-in isn't configured on this server yet.`,
      );
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="field-label">
            Email address
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/40" />
            <input
              id="login-email"
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

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="login-password" className="field-label">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="mb-1.5 text-[11px] font-semibold text-choco underline-offset-4 transition hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/40" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field px-11"
              placeholder="Your password"
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

        <label className="flex cursor-pointer items-center gap-2.5 text-[12px] font-medium text-cocoa/70">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded border-cocoa/30 accent-[#633D29]"
          />
          Keep me signed in for 30 days
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-2xl border border-velvet/30 bg-velvet/10 px-4 py-3 text-[12px] font-medium leading-relaxed text-velvet"
          >
            {error}
          </p>
        ) : null}

        {notice ? (
          <p
            role="status"
            className="rounded-2xl border border-caramel/40 bg-caramel-200/50 px-4 py-3 text-[11.5px] font-medium leading-relaxed text-cocoa/80"
          >
            {notice}
          </p>
        ) : null}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
              />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-cocoa/12" />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-cocoa/45">
          or continue with
        </span>
        <span className="h-px flex-1 bg-cocoa/12" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onSocial("google")}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-cocoa/15 bg-white/70 py-3 text-[12px] font-semibold text-cocoa transition hover:border-choco/35 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/30"
        >
          <GoogleIcon className="h-4 w-4" />
          Google
        </button>
        <button
          type="button"
          onClick={() => onSocial("apple")}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-cocoa/15 bg-white/70 py-3 text-[12px] font-semibold text-cocoa transition hover:border-choco/35 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/30"
        >
          <AppleIcon className="h-4 w-4" />
          Apple
        </button>
      </div>
      <p className="mt-2 text-center text-[10px] leading-relaxed text-cocoa/45">
        Social sign-in is shown only when provider credentials are configured.
      </p>
    </div>
  );
}
