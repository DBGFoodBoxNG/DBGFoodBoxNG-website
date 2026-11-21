import "server-only";

import { randomBytes } from "node:crypto";
import {
  getProductById,
  isSizeId,
  priceFor,
  getSize,
  type SizeId,
} from "@/lib/catalog";
import { getDb, nowIso } from "@/lib/db";
import { getZone } from "@/lib/store";

export type PaymentMethod = "paystack" | "delivery";

export type CartInputItem = {
  productId: string;
  size: string;
  qty: number;
};

export type CustomerInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  zoneId: string;
  notes?: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  size: SizeId;
  sizeName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderRecord = {
  id: string;
  reference: string;
  userId: string | null;
  email: string;
  name: string;
  phone: string;
  address: string;
  zoneId: string;
  zoneLabel: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "due_on_delivery" | "failed";
  status: "pending" | "confirmed" | "cancelled";
  providerReference: string | null;
  createdAt: string;
};

type OrderRow = {
  id: string;
  reference: string;
  user_id: string | null;
  email: string;
  name: string;
  phone: string;
  address: string;
  zone_id: string;
  zone_label: string;
  notes: string | null;
  items: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: OrderRecord["paymentStatus"];
  status: OrderRecord["status"];
  provider_reference: string | null;
  created_at: string;
};

function toOrder(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    reference: row.reference,
    userId: row.user_id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    address: row.address,
    zoneId: row.zone_id,
    zoneLabel: row.zone_label,
    notes: row.notes,
    items: JSON.parse(row.items) as OrderItem[],
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.status,
    providerReference: row.provider_reference,
    createdAt: row.created_at,
  };
}

export class CheckoutError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "CheckoutError";
    this.status = status;
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function createOrder(input: {
  items: CartInputItem[];
  customer: CustomerInput;
  paymentMethod: PaymentMethod;
  userId?: string | null;
}): OrderRecord {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new CheckoutError("Your cart is empty.");
  }

  const customer = input.customer;
  const name = customer.name?.trim();
  const email = customer.email?.trim().toLowerCase();
  const phone = customer.phone?.trim();
  const address = customer.address?.trim();

  if (!name || name.length < 2) {
    throw new CheckoutError("Please enter the name for the delivery.");
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    throw new CheckoutError("Please enter a valid email address.");
  }
  if (!phone || phone.replace(/\D/g, "").length < 7) {
    throw new CheckoutError("Please enter a valid phone number.");
  }
  if (!address || address.length < 8) {
    throw new CheckoutError("Please enter a full delivery address.");
  }

  const zone = getZone(customer.zoneId);
  if (!zone) {
    throw new CheckoutError("Please choose a delivery area.");
  }

  // Merge duplicate lines, then validate every price against the catalogue.
  const merged = new Map<string, { size: SizeId; productId: string; qty: number }>();
  for (const item of input.items) {
    if (!item || typeof item.productId !== "string") {
      throw new CheckoutError("One of the items in your cart is invalid.");
    }
    if (!isSizeId(item.size)) {
      throw new CheckoutError("Please choose a valid size for every loaf.");
    }
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      throw new CheckoutError("Quantities must be between 1 and 20.");
    }
    const product = getProductById(item.productId);
    if (!product || !product.available) {
      throw new CheckoutError(
        `“${product?.name ?? "An item"}” is not available right now.`,
      );
    }
    if (priceFor(product, item.size) === null) {
      throw new CheckoutError(
        `“${product.name}” (${item.size}) has no active price. Please contact us.`,
      );
    }
    const key = `${product.id}:${item.size}`;
    const existing = merged.get(key);
    if (existing) {
      existing.qty = Math.min(20, existing.qty + qty);
    } else {
      merged.set(key, { productId: product.id, size: item.size, qty });
    }
  }

  const items: OrderItem[] = [...merged.values()].map((line) => {
    const product = getProductById(line.productId)!;
    const unitPrice = priceFor(product, line.size)!;
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: line.size,
      sizeName: getSize(line.size)?.name ?? line.size,
      qty: line.qty,
      unitPrice,
      lineTotal: unitPrice * line.qty,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = zone.fee;
  const total = subtotal + deliveryFee;
  const id = crypto.randomUUID();
  const reference = `DBG-${Date.now().toString(36).toUpperCase()}-${randomBytes(5)
    .toString("hex")
    .toUpperCase()}`;
  const createdAt = nowIso();

  const paymentStatus: OrderRecord["paymentStatus"] =
    input.paymentMethod === "paystack" ? "pending" : "due_on_delivery";
  const status: OrderRecord["status"] =
    input.paymentMethod === "paystack" ? "pending" : "confirmed";

  getDb()
    .prepare(
      `INSERT INTO orders
       (id, reference, user_id, email, name, phone, address, zone_id, zone_label, notes, items,
        subtotal, delivery_fee, total, payment_method, payment_status, status, provider_reference, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
    )
    .run(
      id,
      reference,
      input.userId ?? null,
      email,
      name,
      phone,
      address,
      zone.id,
      zone.label,
      customer.notes?.trim() || null,
      JSON.stringify(items),
      subtotal,
      deliveryFee,
      total,
      input.paymentMethod,
      paymentStatus,
      status,
      createdAt,
    );

  return {
    id,
    reference,
    userId: input.userId ?? null,
    email,
    name,
    phone,
    address,
    zoneId: zone.id,
    zoneLabel: zone.label,
    notes: customer.notes?.trim() || null,
    items,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus,
    status,
    providerReference: null,
    createdAt,
  };
}

export function getOrderByReference(reference: string): OrderRecord | null {
  const row = getDb()
    .prepare("SELECT * FROM orders WHERE reference = ?")
    .get(reference) as OrderRow | undefined;
  return row ? toOrder(row) : null;
}

export function listOrdersForUser(userId: string): OrderRecord[] {
  const rows = getDb()
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as unknown as OrderRow[];
  return rows.map(toOrder);
}

export function markOrderPaid(
  reference: string,
  providerReference: string | null,
): void {
  getDb()
    .prepare(
      "UPDATE orders SET payment_status = 'paid', status = 'confirmed', provider_reference = ? WHERE reference = ?",
    )
    .run(providerReference, reference);
}

export function markOrderFailed(reference: string): void {
  getDb()
    .prepare(
      "UPDATE orders SET payment_status = 'failed', status = 'pending' WHERE reference = ?",
    )
    .run(reference);
}
