import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the banana bread in your cart before checking out.",
  robots: { index: false },
};

export default function CartPage() {
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
            <span aria-current="page" className="text-choco">
              Cart
            </span>
          </nav>

          <div className="mt-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
              Almost there
            </p>
            <h1 className="mt-2 font-display text-[2.4rem] leading-[1.02] tracking-[-0.025em] text-cocoa sm:text-[3rem]">
              Your cart
            </h1>
          </div>

          <div className="mt-8">
            <CartView />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
