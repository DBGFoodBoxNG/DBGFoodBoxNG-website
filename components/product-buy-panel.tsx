"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/money";
import {
  getSize,
  priceFor,
  sizes,
  type Product,
  type SizeId,
} from "@/lib/catalog";
import { AddToCartButton } from "@/components/add-to-cart";
import { CheckIcon, MinusIcon, PlusIcon, ShieldIcon, TruckIcon } from "@/components/icons";

export function ProductBuyPanel({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const initialSize: SizeId =
    priceFor(product, "midi") !== null ? "midi" : sizes[0].id;
  const [size, setSize] = useState<SizeId>(initialSize);
  const [qty, setQty] = useState(1);
  const price = priceFor(product, size);
  const selectedSize = getSize(size);

  return (
    <div>
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-cocoa/60">
          Choose your size
        </h2>
        <div
          className="mt-3 grid gap-2 sm:grid-cols-3"
          role="group"
          aria-label="Choose a size"
        >
          {sizes.map((option) => {
            const optionPrice = priceFor(product, option.id);
            const active = option.id === size;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                disabled={optionPrice === null}
                onClick={() => setSize(option.id)}
                className={`rounded-2xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40 disabled:cursor-not-allowed disabled:opacity-45 ${
                  active
                    ? "border-choco bg-choco text-cream shadow-[0_1px_2px_rgba(43,26,18,0.14)]"
                    : "border-cocoa/15 bg-white/70 text-cocoa hover:border-choco/40 hover:bg-white"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-bold">{option.name}</span>
                  <span
                    className={`text-[10.5px] font-semibold ${
                      active ? "text-cream/75" : "text-cocoa/60"
                    }`}
                  >
                    {option.weight}
                  </span>
                </span>
                <span
                  className={`mt-1 block text-[10.5px] ${
                    active ? "text-cream/70" : "text-cocoa/60"
                  }`}
                >
                  {option.serves}
                </span>
                <span
                  className={`mt-2 block text-[12.5px] font-bold ${
                    active ? "text-caramel-200" : "text-choco"
                  }`}
                >
                  {optionPrice === null ? "Price on request" : formatNaira(optionPrice)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-cocoa/60">
            Quantity
          </h2>
          <div className="mt-2 inline-flex items-center rounded-full border border-cocoa/15 bg-white/70">
            <button
              type="button"
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="grid h-11 w-11 place-items-center rounded-full text-choco transition hover:bg-cream disabled:opacity-40"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span
              aria-live="polite"
              className="w-9 text-center text-[14px] font-bold text-cocoa"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((value) => Math.min(20, value + 1))}
              disabled={qty >= 20}
              aria-label="Increase quantity"
              className="grid h-11 w-11 place-items-center rounded-full text-choco transition hover:bg-cream disabled:opacity-40"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="sm:ml-auto sm:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa/60">
            {selectedSize?.name} · {selectedSize?.serves}
          </p>
          <p className="mt-1 font-display text-[1.9rem] leading-none text-cocoa">
            {price === null ? "Price on request" : formatNaira(price * qty)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <AddToCartButton
          productId={product.id}
          size={size}
          qty={qty}
          productName={product.name}
          className="btn-primary flex-1"
        />
        <button
          type="button"
          onClick={() => {
            add(product.id, size, qty);
            router.push("/checkout");
          }}
          className="btn-caramel flex-1"
        >
          Buy now
        </button>
      </div>

      <ul className="mt-6 grid gap-2.5 text-[11.5px] font-medium text-cocoa/70">
        <li className="flex items-center gap-2">
          <TruckIcon className="h-4 w-4 text-caramel-600" />
          Delivered across Lagos · calculated at checkout
        </li>
        <li className="flex items-center gap-2">
          <CheckIcon className="h-4 w-4 text-caramel-600" />
          Baked to order — allow same-day or next-day delivery
        </li>
        <li className="flex items-center gap-2">
          <ShieldIcon className="h-4 w-4 text-caramel-600" />
          Secure Paystack checkout or pay on delivery
        </li>
      </ul>
    </div>
  );
}
