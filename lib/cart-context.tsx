"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getProductById,
  getSize,
  priceFor,
  type Product,
  type SizeId,
} from "@/lib/catalog";

export type CartLine = { productId: string; size: SizeId; qty: number };

export type DetailedCartLine = CartLine & {
  product: Product;
  sizeName: string;
  unitPrice: number;
  lineTotal: number;
};

type CartContextValue = {
  lines: DetailedCartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (productId: string, size: SizeId, qty?: number) => void;
  setQty: (productId: string, size: SizeId, qty: number) => void;
  remove: (productId: string, size: SizeId) => void;
  clear: () => void;
};

const STORAGE_KEY = "dbg-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const { productId, size, qty } = entry as Record<string, unknown>;
      if (typeof productId !== "string" || typeof size !== "string") return [];
      const product = getProductById(productId);
      if (!product || !getSize(size as SizeId)) return [];
      const quantity = Number(qty);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return [];
      return [{ productId, size: size as SizeId, qty: quantity }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRawLines(readStoredCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rawLines));
    } catch {
      // Storage can be unavailable in private mode — the cart still works in memory.
    }
  }, [rawLines, ready]);

  const add = useCallback((productId: string, size: SizeId, qty = 1) => {
    setRawLines((current) => {
      const index = current.findIndex(
        (line) => line.productId === productId && line.size === size,
      );
      if (index === -1) {
        return [...current, { productId, size, qty: Math.min(20, qty) }];
      }
      const next = [...current];
      next[index] = {
        ...next[index],
        qty: Math.min(20, next[index].qty + qty),
      };
      return next;
    });
  }, []);

  const setQty = useCallback(
    (productId: string, size: SizeId, qty: number) => {
      setRawLines((current) =>
        current.flatMap((line) => {
          if (line.productId !== productId || line.size !== size) return [line];
          if (qty < 1) return [];
          return [{ ...line, qty: Math.min(20, Math.floor(qty)) }];
        }),
      );
    },
    [],
  );

  const remove = useCallback((productId: string, size: SizeId) => {
    setRawLines((current) =>
      current.filter(
        (line) => !(line.productId === productId && line.size === size),
      ),
    );
  }, []);

  const clear = useCallback(() => setRawLines([]), []);

  const lines = useMemo<DetailedCartLine[]>(() => {
    return rawLines.flatMap((line) => {
      const product = getProductById(line.productId);
      const unitPrice = product ? priceFor(product, line.size) : null;
      if (!product || unitPrice === null) return [];
      return [
        {
          ...line,
          product,
          sizeName: getSize(line.size)?.name ?? line.size,
          unitPrice,
          lineTotal: unitPrice * line.qty,
        },
      ];
    });
  }, [rawLines]);

  const value = useMemo<CartContextValue>(() => {
    return {
      lines,
      ready,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      add,
      setQty,
      remove,
      clear,
    };
  }, [add, clear, lines, ready, remove, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return context;
}
