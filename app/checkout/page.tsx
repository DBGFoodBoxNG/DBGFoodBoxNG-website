import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutForm } from "@/components/checkout-form";
import { getSessionUser } from "@/lib/auth";
import { paystackConfigured } from "@/lib/paystack";
import { deliveryNote, deliveryZones } from "@/lib/store";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your banana bread order for delivery across Lagos.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getSessionUser();

  return (
    <div className="relative bg-cream">
      <SiteHeader />
      <main id="main" className="pb-20 pt-10 sm:pt-14">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-[11.5px] font-semibold text-cocoa/55">
            <Link href="/" className="transition hover:text-choco">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link href="/cart" className="transition hover:text-choco">
              Cart
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page" className="text-choco">
              Checkout
            </span>
          </nav>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                One last step
              </p>
              <h1 className="mt-2 font-display text-[2.4rem] leading-[1.02] tracking-[-0.025em] text-cocoa sm:text-[3rem]">
                Checkout
              </h1>
            </div>
            <p className="max-w-xs text-[12px] leading-relaxed text-cocoa/60">
              Bakes are made to order. We&apos;ll confirm delivery timing once
              your order is in.
            </p>
          </div>

          <div className="mt-8">
            <CheckoutForm
              zones={deliveryZones}
              user={
                user
                  ? { name: user.name, email: user.email, phone: user.phone }
                  : null
              }
              paystackReady={paystackConfigured()}
              deliveryNote={deliveryNote}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
