"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { SizeId } from "@/lib/catalog";
import { ArrowRightIcon } from "@/components/icons";

type Props = {
  items: { productId: string; size: string; qty: number }[];
};

export function ReorderButton({ items }: Props) {
  const router = useRouter();
  const { add } = useCart();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        for (const item of items) {
          add(item.productId, item.size as SizeId, item.qty);
        }
        router.push("/cart");
      }}
      className="inline-flex items-center gap-2 rounded-full border border-choco/20 bg-white/70 px-4 py-2.5 text-[11.5px] font-bold text-choco transition hover:border-choco/40 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/30 disabled:opacity-60"
    >
      {busy ? "Adding…" : "Reorder"}
      <ArrowRightIcon className="h-3.5 w-3.5" />
    </button>
  );
}
