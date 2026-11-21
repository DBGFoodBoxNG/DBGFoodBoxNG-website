"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

/**
 * Clears the local cart once an order has been confirmed. Rendering this only
 * on the success page keeps abandoned Paystack attempts from losing the cart.
 */
export function ClearCart() {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready) clear();
  }, [clear, ready]);

  return null;
}
