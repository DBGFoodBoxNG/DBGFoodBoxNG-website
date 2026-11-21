"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { CheckIcon, PlusIcon } from "@/components/icons";
import type { SizeId } from "@/lib/catalog";

type Props = {
  productId: string;
  size: SizeId;
  qty?: number;
  label?: string;
  className?: string;
  compact?: boolean;
  productName: string;
};

export function AddToCartButton({
  productId,
  size,
  qty = 1,
  label = "Add to cart",
  className = "btn-primary",
  compact = false,
  productName,
}: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={`Add ${productName} to cart`}
      onClick={() => {
        add(productId, size, qty);
        setAdded(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 1800);
      }}
      className={`${className} ${compact ? "px-4 py-2.5 text-[12px]" : ""}`}
    >
      {added ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <PlusIcon className="h-4 w-4" />
      )}
      <span aria-live="polite">{added ? "Added" : label}</span>
    </button>
  );
}
