import { getOrderByReference, markOrderPaid } from "@/lib/orders";
import {
  paystackConfigured,
  verifyPaystackSignature,
} from "@/lib/paystack";

export const runtime = "nodejs";

type PaystackEvent = {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    id?: number | string;
  };
};

/**
 * Paystack webhook. Only signed payloads are trusted, and the amount is
 * checked against the server-side order total before an order is marked paid.
 */
export async function POST(request: Request) {
  if (!paystackConfigured()) {
    return new Response("Paystack is not configured", { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(rawBody) as PaystackEvent;
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  if (
    event.event === "charge.success" &&
    typeof event.data?.reference === "string"
  ) {
    const order = getOrderByReference(event.data.reference);
    if (order) {
      const paidKobo = Number(event.data.amount ?? 0);
      if (paidKobo >= order.total * 100) {
        markOrderPaid(
          order.reference,
          event.data.id ? String(event.data.id) : null,
        );
      }
    }
  }

  return Response.json({ received: true });
}
