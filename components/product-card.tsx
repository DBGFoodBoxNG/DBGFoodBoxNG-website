"use client";

import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart";
import { ProductPhoto } from "@/components/product-photo";
import { formatNaira } from "@/lib/money";
import {
  getSize,
  priceFor,
  sizes,
  type Product,
  type SizeId,
} from "@/lib/catalog";
import { defaultSize } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const [size, setSize] = useState<SizeId>(
    product.prices[defaultSize] ? defaultSize : sizes[0].id,
  );
  const price = priceFor(product, size);
  const badge = product.badges[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-milk shadow-[0_1px_2px_rgba(43,26,18,0.04)] transition duration-300 hover:-translate-y-1 hover:border-caramel/60 hover:shadow-card">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-cream-100"
        tabIndex={-1}
        aria-label={`View ${product.name}`}
      >
        <ProductPhoto
          productId={product.id}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-choco px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-cream shadow-sm">
            {badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.2rem] leading-tight text-cocoa">
          <Link
            href={`/product/${product.slug}`}
            className="transition hover:text-choco focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-cocoa/70">
          {product.description}
        </p>

        <div
          className="mt-4 flex flex-wrap gap-1.5"
          role="group"
          aria-label={`Choose a size for ${product.name}`}
        >
          {sizes.map((option) => {
            const active = option.id === size;
            const optionPrice = priceFor(product, option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                disabled={optionPrice === null}
                onClick={() => setSize(option.id)}
                className={`rounded-full border px-3 py-1.5 text-[10.5px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40 disabled:cursor-not-allowed disabled:opacity-50 ${
                  active
                    ? "border-choco bg-choco text-cream"
                    : "border-cocoa/15 bg-white/60 text-cocoa/75 hover:border-choco/40 hover:text-cocoa"
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-cocoa/10 pt-4">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-cocoa/60">
              {getSize(size)?.serves}
            </p>
            <p className="mt-1 font-display text-[1.25rem] leading-none text-cocoa">
              {price === null ? "Price on request" : formatNaira(price)}
            </p>
          </div>
          <AddToCartButton
            productId={product.id}
            size={size}
            productName={product.name}
            compact
            className="btn-primary"
          />
        </div>
      </div>
    </article>
  );
}
