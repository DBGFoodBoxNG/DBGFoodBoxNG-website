import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductPhoto } from "@/components/product-photo";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="relative bg-cream">
      <SiteHeader />
      <main className="relative overflow-hidden pb-20 pt-12 sm:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-caramel/25 blur-[110px]"
        />
        <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-choco/15 bg-white/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-choco">
                <ClockIcon className="h-3.5 w-3.5" />
                Page not found
              </p>
              <p className="mt-6 font-display text-[5rem] leading-none text-choco/10">
                404
              </p>
              <h1 className="mt-2 font-display text-[2.4rem] leading-[1.03] tracking-[-0.025em] text-cocoa sm:text-[3.1rem]">
                This page is still in the kitchen.
              </h1>
              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-cocoa/70">
                We couldn&apos;t find the page you were looking for — but there
                are nine flavours waiting on the menu.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/menu" className="btn-primary group">
                  Shop banana bread
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="/" className="btn-secondary">
                  Back to home
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[420px]">
              <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white/80 shadow-lift">
                <div className="aspect-[5/4]">
                  <ProductPhoto productId="oreo" sizes="420px" className="h-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
