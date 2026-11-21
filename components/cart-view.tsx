"use client";

import Link from "next/link";
import { ProductPhoto } from "@/components/product-photo";
import { QuantityStepper, RemoveButton } from "@/components/quantity-stepper";
import { ArrowRightIcon, CartIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/money";

export function CartView() {
  const { lines, ready, count, subtotal, setQty, remove } = useCart();

  if (!ready) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.55fr_0.85fr]">
        <div className="space-y-4">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="h-[8.5rem] animate-pulse rounded-[1.5rem] border border-cocoa/10 bg-white/50"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-[1.5rem] border border-cocoa/10 bg-white/50" />
        <span className="sr-only">Loading your cart</span>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-[2rem] border border-cocoa/10 bg-milk px-6 py-12 text-center sm:px-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-caramel-200 text-choco">
          <CartIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-[1.8rem] leading-tight text-cocoa">
          Your cart is empty.
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-cocoa/70">
          Pick a flavour from the collection and it will show up here, ready for
          checkout.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/menu" className="btn-primary group">
            Shop banana bread
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.55fr_0.85fr]">
      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={`${line.productId}-${line.size}`}
            className="flex flex-col gap-4 rounded-[1.5rem] border border-cocoa/10 bg-milk p-4 shadow-[0_1px_2px_rgba(43,26,18,0.03)] sm:flex-row sm:items-center sm:p-5"
          >
            <Link
              href={`/product/${line.product.slug}`}
              className="relative block h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-cream-100 sm:h-24 sm:w-28"
              aria-label={`View ${line.product.name}`}
            >
              <ProductPhoto
                productId={line.productId}
                sizes="112px"
                className="h-full w-full transition-transform duration-500 hover:scale-105"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[1.15rem] leading-tight text-cocoa">
                    <Link
                      href={`/product/${line.product.slug}`}
                      className="transition hover:text-choco"
                    >
                      {line.product.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cocoa/55">
                    {line.sizeName} · {formatNaira(line.unitPrice)} each
                  </p>
                </div>
                <p className="shrink-0 font-display text-[1.1rem] leading-none text-choco">
                  {formatNaira(line.lineTotal)}
                </p>
              </div>

              <div className="mt-3.5 flex items-center justify-between gap-3">
                <QuantityStepper
                  value={line.qty}
                  onChange={(value) => setQty(line.productId, line.size, value)}
                  label={`${line.product.name} (${line.sizeName})`}
                />
                <RemoveButton
                  label={`${line.product.name} (${line.sizeName})`}
                  onClick={() => remove(line.productId, line.size)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-card lg:sticky lg:top-32">
        <h2 className="font-display text-[1.4rem] leading-none text-cocoa">
          Order summary
        </h2>
        <dl className="mt-5 space-y-3 text-[13px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-cocoa/65">
              Subtotal ({count} {count === 1 ? "loaf" : "loaves"})
            </dt>
            <dd className="font-semibold text-cocoa">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-cocoa/65">Delivery</dt>
            <dd className="text-right text-[12px] font-medium text-cocoa/70">
              Calculated by area at checkout
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-cocoa/10 pt-3">
            <dt className="text-[14px] font-bold text-cocoa">Total</dt>
            <dd className="font-display text-[1.4rem] leading-none text-choco">
              {formatNaira(subtotal)}
            </dd>
          </div>
        </dl>

        <Link href="/checkout" className="btn-primary mt-5 w-full group">
          Proceed to checkout
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/menu"
          className="mt-2.5 block text-center text-[12px] font-semibold text-choco underline-offset-4 transition hover:underline"
        >
          Continue shopping
        </Link>

        <ul className="mt-6 space-y-2.5 border-t border-cocoa/10 pt-4 text-[11.5px] font-medium text-cocoa/70">
          <li className="flex items-start gap-2">
            <TruckIcon className="mt-0.5 h-4 w-4 shrink-0 text-caramel-600" />
            Baked to order and delivered across Lagos.
          </li>
          <li className="flex items-start gap-2">
            <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-caramel-600" />
            Pay securely online or on delivery.
          </li>
        </ul>
      </aside>
    </div>
  );
}
