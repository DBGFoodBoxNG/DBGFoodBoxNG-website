"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductPhoto } from "@/components/product-photo";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LockIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/money";
import type { DeliveryZone } from "@/lib/store";

type Props = {
  zones: DeliveryZone[];
  user: { name: string; email: string; phone: string | null } | null;
  paystackReady: boolean;
  deliveryNote: string;
};

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "address" | "zone", string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function CheckoutForm({
  zones,
  user,
  paystackReady,
  deliveryNote,
}: Props) {
  const router = useRouter();
  const { lines, ready, count, subtotal } = useCart();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("");
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "delivery">(
    paystackReady ? "paystack" : "delivery",
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const zone = zones.find((item) => item.id === zoneId);
  const deliveryFee = zone?.fee ?? 0;
  const total = subtotal + deliveryFee;

  const itemPayload = useMemo(
    () =>
      lines.map((line) => ({
        productId: line.productId,
        size: line.size,
        qty: line.qty,
      })),
    [lines],
  );

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Enter the name for this delivery.";
    if (!EMAIL_PATTERN.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 7)
      next.phone = "Enter a valid phone number.";
    if (address.trim().length < 8)
      next.address = "Add a full street address, including area.";
    if (!zone) next.zone = "Choose a delivery area.";
    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemPayload,
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            zoneId,
            notes: notes.trim() || undefined,
          },
          paymentMethod,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        authorizationUrl?: string;
        redirect?: string;
        configurationIssue?: boolean;
      };

      if (!response.ok || !payload.ok) {
        setFormError(
          payload.message ??
            "We couldn't place your order. Please check your details and try again.",
        );
        setSubmitting(false);
        return;
      }

      if (payload.authorizationUrl) {
        window.location.href = payload.authorizationUrl;
        return;
      }

      if (payload.redirect) {
        router.push(payload.redirect);
        return;
      }

      setFormError("Something went wrong. Please try again.");
      setSubmitting(false);
    } catch {
      setFormError(
        "We couldn't reach the server. Check your connection and try again.",
      );
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="h-96 animate-pulse rounded-[1.5rem] border border-cocoa/10 bg-white/50" />
        <div className="h-72 animate-pulse rounded-[1.5rem] border border-cocoa/10 bg-white/50" />
        <span className="sr-only">Loading checkout</span>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-[2rem] border border-cocoa/10 bg-milk px-6 py-12 text-center sm:px-10">
        <h2 className="font-display text-[1.8rem] leading-tight text-cocoa">
          There&apos;s nothing to check out yet.
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-cocoa/70">
          Add a loaf to your cart and come back to complete your order.
        </p>
        <Link href="/menu" className="btn-primary mt-6">
          Shop banana bread
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[1.5fr_0.9fr]"
    >
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-[1.4rem] leading-none text-cocoa">
              Contact details
            </h2>
            {!user ? (
              <Link
                href="/login?next=/checkout"
                className="text-[11.5px] font-bold text-choco underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="checkout-name" className="field-label">
                Full name
              </label>
              <input
                id="checkout-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="field"
                placeholder="Your full name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "error-name" : undefined}
              />
              {errors.name ? (
                <p id="error-name" className="mt-1.5 text-[11.5px] font-medium text-velvet">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="checkout-email" className="field-label">
                Email address
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "error-email" : undefined}
              />
              {errors.email ? (
                <p id="error-email" className="mt-1.5 text-[11.5px] font-medium text-velvet">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="checkout-phone" className="field-label">
                Phone number
              </label>
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="field"
                placeholder="0801 234 5678"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "error-phone" : undefined}
              />
              {errors.phone ? (
                <p id="error-phone" className="mt-1.5 text-[11.5px] font-medium text-velvet">
                  {errors.phone}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)] sm:p-7">
          <h2 className="font-display text-[1.4rem] leading-none text-cocoa">
            Delivery
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-cocoa/60">
            {deliveryNote}
          </p>

          <div className="mt-5">
            <label htmlFor="checkout-address" className="field-label">
              Delivery address
            </label>
            <textarea
              id="checkout-address"
              name="address"
              autoComplete="street-address"
              rows={3}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="field resize-none"
              placeholder="House number, street, estate and area"
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "error-address" : undefined}
            />
            {errors.address ? (
              <p id="error-address" className="mt-1.5 text-[11.5px] font-medium text-velvet">
                {errors.address}
              </p>
            ) : null}
          </div>

          <fieldset className="mt-5">
            <legend className="field-label">Delivery area</legend>
            <div className="mt-1 grid gap-2.5">
              {zones.map((item) => {
                const active = item.id === zoneId;
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-3.5 transition ${
                      active
                        ? "border-choco bg-choco text-cream shadow-[0_1px_2px_rgba(43,26,18,0.14)]"
                        : "border-cocoa/15 bg-white/60 text-cocoa hover:border-choco/40 hover:bg-white"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="zone"
                        value={item.id}
                        checked={active}
                        onChange={() => setZoneId(item.id)}
                        className="mt-1 h-4 w-4 accent-[#633D29]"
                      />
                      <span>
                        <span className="block text-[12.5px] font-bold">
                          {item.label}
                        </span>
                        <span
                          className={`mt-0.5 block text-[10.5px] ${
                            active ? "text-cream/70" : "text-cocoa/60"
                          }`}
                        >
                          {item.eta}
                        </span>
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-[12px] font-bold ${
                        active ? "text-caramel-200" : "text-choco"
                      }`}
                    >
                      {formatNaira(item.fee)}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.zone ? (
              <p className="mt-1.5 text-[11.5px] font-medium text-velvet">
                {errors.zone}
              </p>
            ) : null}
          </fieldset>

          <div className="mt-5">
            <label htmlFor="checkout-notes" className="field-label">
              Delivery notes <span className="font-normal text-cocoa/50">(optional)</span>
            </label>
            <input
              id="checkout-notes"
              name="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="field"
              placeholder="Gate code, landmark or preferred delivery time"
            />
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)] sm:p-7">
          <h2 className="font-display text-[1.4rem] leading-none text-cocoa">
            Payment
          </h2>

          <div className="mt-5 grid gap-2.5">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
                paymentMethod === "paystack"
                  ? "border-choco bg-choco text-cream shadow-[0_1px_2px_rgba(43,26,18,0.14)]"
                  : "border-cocoa/15 bg-white/60 text-cocoa hover:border-choco/40 hover:bg-white"
              } ${!paystackReady ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                value="paystack"
                checked={paymentMethod === "paystack"}
                disabled={!paystackReady}
                onChange={() => setPaymentMethod("paystack")}
                className="mt-1 h-4 w-4 accent-[#633D29]"
              />
              <span>
                <span className="block text-[12.5px] font-bold">
                  Pay online with Paystack
                </span>
                <span
                  className={`mt-0.5 block text-[10.5px] leading-relaxed ${
                    paymentMethod === "paystack" ? "text-cream/70" : "text-cocoa/60"
                  }`}
                >
                  Card, bank transfer and USSD · secured by Paystack
                </span>
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
                paymentMethod === "delivery"
                  ? "border-choco bg-choco text-cream shadow-[0_1px_2px_rgba(43,26,18,0.14)]"
                  : "border-cocoa/15 bg-white/60 text-cocoa hover:border-choco/40 hover:bg-white"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="delivery"
                checked={paymentMethod === "delivery"}
                onChange={() => setPaymentMethod("delivery")}
                className="mt-1 h-4 w-4 accent-[#633D29]"
              />
              <span>
                <span className="block text-[12.5px] font-bold">
                  Pay on delivery
                </span>
                <span
                  className={`mt-0.5 block text-[10.5px] leading-relaxed ${
                    paymentMethod === "delivery" ? "text-cream/70" : "text-cocoa/60"
                  }`}
                >
                  Pay the rider in cash or by transfer when your bread arrives
                </span>
              </span>
            </label>
          </div>

          {!paystackReady ? (
            <div className="mt-4 rounded-2xl border border-caramel/40 bg-caramel-200/50 p-4">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-choco">
                Card payments are not configured yet
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-cocoa/75">
                The site is ready to take live card payments through Paystack,
                but the server is missing a{" "}
                <code className="rounded bg-white/70 px-1 py-0.5 text-[11px] font-semibold">
                  PAYSTACK_SECRET_KEY
                </code>
                . Add it to the environment to switch card payments on. Pay on
                delivery works today.
              </p>
            </div>
          ) : null}
        </section>
      </div>

      <aside className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-card lg:sticky lg:top-32">
        <h2 className="font-display text-[1.4rem] leading-none text-cocoa">
          Your order
        </h2>

        <ul className="mt-5 space-y-3.5 border-b border-cocoa/10 pb-5">
          {lines.map((line) => (
            <li
              key={`${line.productId}-${line.size}`}
              className="flex items-center gap-3"
            >
              <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                <ProductPhoto
                  productId={line.productId}
                  sizes="64px"
                  className="h-full w-full"
                />
                <span className="absolute -right-0 -top-0 grid h-5 min-w-[1.25rem] place-items-center rounded-bl-lg bg-choco px-1 text-[9.5px] font-bold text-cream">
                  {line.qty}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-bold text-cocoa">
                  {line.product.name}
                </span>
                <span className="mt-0.5 block text-[10.5px] font-medium uppercase tracking-[0.1em] text-cocoa/55">
                  {line.sizeName}
                </span>
              </span>
              <span className="shrink-0 text-[12px] font-semibold text-choco">
                {formatNaira(line.lineTotal)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2.5 text-[12.5px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-cocoa/65">
              Subtotal ({count} {count === 1 ? "loaf" : "loaves"})
            </dt>
            <dd className="font-semibold text-cocoa">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-cocoa/65">Delivery · {zone?.label ?? "—"}</dt>
            <dd className="font-semibold text-cocoa">
              {formatNaira(deliveryFee)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-cocoa/10 pt-3">
            <dt className="text-[14px] font-bold text-cocoa">Total</dt>
            <dd className="font-display text-[1.5rem] leading-none text-choco">
              {formatNaira(total)}
            </dd>
          </div>
        </dl>

        {formError ? (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-velvet/30 bg-velvet/10 px-4 py-3 text-[12px] font-medium leading-relaxed text-velvet"
          >
            {formError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-5 w-full"
        >
          {submitting ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
              />
              Placing your order…
            </>
          ) : paymentMethod === "paystack" ? (
            <>
              <LockIcon className="h-4 w-4" />
              Pay {formatNaira(total)} securely
            </>
          ) : (
            <>
              Place order · {formatNaira(total)}
              <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-3 flex items-start gap-2 text-[10.5px] leading-relaxed text-cocoa/60">
          <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caramel-600" />
          {paymentMethod === "paystack"
            ? "You'll be redirected to Paystack to complete payment, then brought back here."
            : "Your order is confirmed immediately. Please have payment ready for the rider."}
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-cream-100 px-3.5 py-3 text-[10.5px] leading-relaxed text-cocoa/70">
          <TruckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caramel-600" />
          {zone?.eta ?? "Delivery timing confirmed after checkout."}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-cocoa/55">
          <CheckCircleIcon className="h-3.5 w-3.5 text-caramel-600" />
          Every loaf is baked fresh for your order.
        </p>
      </aside>
    </form>
  );
}
