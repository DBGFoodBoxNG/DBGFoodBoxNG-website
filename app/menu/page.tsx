import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Collection,
  CtaBanner,
  SizeGuide,
} from "@/components/home/sections";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Our menu",
  description:
    "Nine signature banana bread flavours — Classic, Red Velvet, Oreo, Chocolate Chunk, Chocolate Chip, Nutella, Mixed Nuts, Coconut and Baileys. Baked to order in Lagos.",
};

export default function MenuPage() {
  return (
    <div className="relative bg-cream">
      <SiteHeader />
      <main id="main">
        <section className="relative overflow-hidden pb-4 pt-12 sm:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-caramel/25 blur-[110px]"
          />
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <nav aria-label="Breadcrumb" className="text-[11.5px] font-semibold text-cocoa/60">
              <Link href="/" className="transition hover:text-choco">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span aria-current="page" className="text-choco">
                Our menu
              </span>
            </nav>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                  The full menu
                </p>
                <h1 className="mt-3 max-w-2xl font-display text-[2.6rem] leading-[1.02] tracking-[-0.025em] text-cocoa sm:text-[3.4rem]">
                  Pick your flavour.{" "}
                  <span className="italic text-choco">We&apos;ll bake it fresh.</span>
                </h1>
              </div>
              <p className="max-w-sm text-[13.5px] leading-relaxed text-cocoa/70">
                Every loaf is baked to order in our GRA, Ikeja kitchen. Choose
                Mini, Midi or Regular on each card — the price updates as you go.
              </p>
            </div>
          </div>
        </section>

        <Collection />
        <SizeGuide />
        <CtaBanner />

        <section className="pb-20">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] border border-cocoa/10 bg-white/50 px-6 py-5 sm:flex-row sm:items-center">
              <p className="text-[13px] font-medium text-cocoa/70">
                Looking for a larger order, gifting or a custom flavour?
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 text-[12.5px] font-bold text-choco transition hover:text-choco-700"
              >
                Talk to us
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
