"use client";

import { useState } from "react";
import { CheckCircleIcon, MailIcon } from "@/components/icons";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (sent) {
    return (
      <div className="rounded-[1.5rem] border border-caramel/40 bg-caramel-200/50 p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-choco text-cream">
          <CheckCircleIcon className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-[1.5rem] leading-tight text-cocoa">
          Message received.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-cocoa/70">
          Thank you for reaching out. Your message is saved with the bakery and
          we&apos;ll reply by email.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
          className="mt-5 text-[11.5px] font-bold text-choco underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "We couldn't send that message. Please try again.");
        setSubmitting(false);
        return;
      }

      setSent(true);
      setSubmitting(false);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Your name
          </label>
          <input
            id="contact-name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field"
            placeholder="Full name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            Email address
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="field resize-none"
          placeholder="Tell us about your order, custom bake or question…"
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

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
            />
            Sending…
          </>
        ) : (
          <>
            <MailIcon className="h-4 w-4" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
