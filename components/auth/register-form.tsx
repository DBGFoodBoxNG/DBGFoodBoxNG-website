"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "@/components/icons";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone.trim() || undefined,
          password,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(
          payload.message ?? "We couldn't create your account. Please try again.",
        );
        setSubmitting(false);
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="register-name" className="field-label">
          Full name
        </label>
        <div className="relative">
          <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/40" />
          <input
            id="register-name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field pl-11"
            placeholder="Your full name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="register-email" className="field-label">
          Email address
        </label>
        <div className="relative">
          <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/40" />
          <input
            id="register-email"
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
        <label htmlFor="register-phone" className="field-label">
          Phone number{" "}
          <span className="font-normal text-cocoa/50">(optional)</span>
        </label>
        <input
          id="register-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="field"
          placeholder="0801 234 5678"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="field-label">
          Password
        </label>
        <div className="relative">
          <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/40" />
          <input
            id="register-password"
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
        <p className="mt-1.5 text-[10.5px] text-cocoa/50">
          Use 8+ characters. Passwords are hashed with scrypt before they are
          stored.
        </p>
      </div>

      <div>
        <label htmlFor="register-confirm" className="field-label">
          Confirm password
        </label>
        <input
          id="register-confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="field"
          placeholder="Repeat your password"
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
            Creating your account…
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-[10.5px] leading-relaxed text-cocoa/50">
        By creating an account you agree to us storing your name, email and
        order history so we can deliver your bread.{" "}
        <Link href="/contact" className="font-semibold text-choco underline-offset-4 hover:underline">
          Questions?
        </Link>
      </p>
    </form>
  );
}
