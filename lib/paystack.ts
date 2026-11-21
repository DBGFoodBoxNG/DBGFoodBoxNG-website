import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { nairaToKobo } from "@/lib/money";

const PAYSTACK_BASE = "https://api.paystack.co";

export function paystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

type InitializeResult =
  | { ok: true; authorizationUrl: string; accessCode: string }
  | { ok: false; message: string };

export async function initializePaystackTransaction(input: {
  email: string;
  amountNgn: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitializeResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: false, message: "Paystack is not configured." };
  }

  try {
    const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: nairaToKobo(input.amountNgn),
        reference: input.reference,
        callback_url: input.callbackUrl,
        currency: "NGN",
        metadata: input.metadata ?? {},
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; access_code?: string };
    };

    if (!response.ok || !payload.status || !payload.data?.authorization_url) {
      return {
        ok: false,
        message:
          payload.message ??
          "Paystack could not start this payment. Please try again.",
      };
    }

    return {
      ok: true,
      authorizationUrl: payload.data.authorization_url,
      accessCode: payload.data.access_code ?? "",
    };
  } catch {
    return {
      ok: false,
      message:
        "We couldn't reach the payment provider. Check your connection and try again.",
    };
  }
}

type VerifyResult =
  | { ok: true; paid: boolean; amountKobo: number; providerReference: string | null }
  | { ok: false; message: string };

export async function verifyPaystackTransaction(
  reference: string,
): Promise<VerifyResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: false, message: "Paystack is not configured." };
  }

  try {
    const response = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        cache: "no-store",
      },
    );
    const payload = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: {
        status?: string;
        amount?: number;
        id?: number;
        reference?: string;
      };
    };

    if (!response.ok || !payload.status || !payload.data) {
      return {
        ok: false,
        message: payload.message ?? "Payment could not be verified.",
      };
    }

    return {
      ok: true,
      paid: payload.data.status === "success",
      amountKobo: payload.data.amount ?? 0,
      providerReference:
        payload.data.reference ??
        (payload.data.id ? String(payload.data.id) : null),
    };
  } catch {
    return {
      ok: false,
      message: "We couldn't reach the payment provider to verify this order.",
    };
  }
}

export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret || !signature) return false;

  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const received = signature.trim().toLowerCase();
  if (expected.length !== received.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}
