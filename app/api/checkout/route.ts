import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  CheckoutError,
  createOrder,
  markOrderFailed,
} from "@/lib/orders";
import {
  initializePaystackTransaction,
  paystackConfigured,
} from "@/lib/paystack";

export const runtime = "nodejs";

function siteOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "We couldn't read that request. Please try again." },
      { status: 400 },
    );
  }

  const payload = body as {
    items?: unknown;
    customer?: unknown;
    paymentMethod?: unknown;
  };

  const paymentMethod =
    payload.paymentMethod === "paystack"
      ? "paystack"
      : payload.paymentMethod === "delivery"
        ? "delivery"
        : null;

  if (!paymentMethod) {
    return NextResponse.json(
      { ok: false, message: "Choose a payment method to continue." },
      { status: 400 },
    );
  }

  if (paymentMethod === "paystack" && !paystackConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configurationIssue: true,
        message:
          "Card payments aren't live on this server yet: PAYSTACK_SECRET_KEY is missing. Choose “Pay on delivery”, or ask the site owner to add the Paystack secret key.",
      },
      { status: 503 },
    );
  }

  const user = await getSessionUser();

  try {
    const order = createOrder({
      items: (payload.items ?? []) as Parameters<typeof createOrder>[0]["items"],
      customer: (payload.customer ?? {}) as Parameters<
        typeof createOrder
      >[0]["customer"],
      paymentMethod,
      userId: user?.id ?? null,
    });

    if (paymentMethod === "delivery") {
      return NextResponse.json({
        ok: true,
        redirect: `/checkout/success?reference=${encodeURIComponent(order.reference)}&clear=1`,
      });
    }

    const callbackUrl = `${siteOrigin(request)}/checkout/success?reference=${encodeURIComponent(
      order.reference,
    )}&clear=1`;

    const result = await initializePaystackTransaction({
      email: order.email,
      amountNgn: order.total,
      reference: order.reference,
      callbackUrl,
      metadata: {
        orderId: order.id,
        orderReference: order.reference,
        customerName: order.name,
      },
    });

    if (!result.ok) {
      markOrderFailed(order.reference);
      return NextResponse.json(
        {
          ok: false,
          message: `Your order ${order.reference} was saved, but the payment page could not start (${result.message}). Please try again or choose pay on delivery.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      authorizationUrl: result.authorizationUrl,
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: error.status },
      );
    }
    console.error("Checkout failed", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Something went wrong while placing your order. Please try again.",
      },
      { status: 500 },
    );
  }
}
