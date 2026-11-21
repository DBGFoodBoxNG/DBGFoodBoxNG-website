import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductPhoto } from "@/components/product-photo";
import {
  ArrowRightIcon,
  CheckIcon,
  LeafIcon,
  SparkIcon,
  TruckIcon,
} from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "DBGfoodboxng is a Lagos banana bread bakery baking small batches to order with real bananas and proper ingredients.",
};

const values = [
  {
    title: "Real ingredients",
    copy: "Ripe bananas, butter, free-range eggs and proper chocolate. If it doesn't belong in a loaf, it doesn't go in.",
    Icon: LeafIcon,
  },
  {
    title: "Baked to order",
    copy: "We bake in small batches so your bread reaches you fresh — never sitting on a shelf waiting.",
    Icon: SparkIcon,
  },
  {
    title: "Delivered with care",
    copy: "Boxed, sealed and handled carefully on the way to your door anywhere in Lagos.",
    Icon: TruckIcon,
  },
];

export default function AboutPage() {
  return (
    <div className="relative bg-cream">
      <SiteHeader />
      <main id="main">
        <section className="relative overflow-hidden pb-16 pt-12 sm:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-caramel/25 blur-[130px]"
          />
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <nav aria-label="Breadcrumb" className="text-[11.5px] font-semibold text-cocoa/55">
              <Link href="/" className="transition hover:text-choco">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span aria-current="page" className="text-choco">
                About us
              </span>
            </nav>

            <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                  Our story
                </p>
                <h1 className="mt-3 font-display text-[2.8rem] leading-[1.02] tracking-[-0.03em] text-cocoa sm:text-[3.6rem]">
                  One loaf.
                  <br />
                  <span className="italic text-choco">An obsession with banana bread.</span>
                </h1>
                <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-cocoa/75">
                  DBGfoodboxng started the way most good bakes do — in a home
                  kitchen, with bananas that had gone perfectly sweet and a
                  stubborn belief that banana bread should taste like bananas,
                  not sugar and shortcuts.
                </p>
                <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-cocoa/75">
                  Today we bake small batches to order in GRA, Ikeja, box them
                  warm, and deliver them across Lagos. Nine flavours, three
                  sizes, the same care in every loaf.
                </p>

                <ul className="mt-7 space-y-2.5">
                  {[
                    "Small-batch baking, every single morning",
                    "Real bananas and proper ingredients",
                    "Boxed and delivered across Lagos",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-[12.5px] font-medium text-cocoa/75"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-caramel-200 text-choco">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/menu" className="btn-primary group">
                    Explore the menu
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link href="/contact" className="btn-secondary">
                    Talk to us
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[440px]">
                <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white/80 shadow-lift">
                  <div className="aspect-[5/4]">
                    <ProductPhoto
                      productId="classic"
                      sizes="(min-width: 1024px) 440px, 90vw"
                      className="h-full w-full"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-5 left-4 rounded-2xl bg-milk px-4 py-3 shadow-card">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-caramel-600">
                    Baked in
                  </p>
                  <p className="mt-1 font-display text-[1.1rem] leading-none text-cocoa">
                    GRA, Ikeja
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-cocoa/10 bg-cream-100/70 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                What we stand for
              </p>
              <h2 className="mt-3 font-display text-[2.1rem] leading-[1.05] tracking-[-0.02em] text-cocoa sm:text-[2.6rem]">
                Three things we won&apos;t compromise on.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {values.map(({ title, copy, Icon }) => (
                <article
                  key={title}
                  className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-6 shadow-[0_1px_2px_rgba(43,26,18,0.03)]"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-caramel-200 text-choco">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold text-cocoa">{title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-cocoa/70">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="grid gap-8 rounded-[2rem] bg-choco-800 px-6 py-10 text-cream sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-caramel">
                  Visit &amp; orders
                </p>
                <h2 className="mt-3 max-w-lg font-display text-[2rem] leading-[1.05] sm:text-[2.5rem]">
                  {site.location}. Baked fresh, delivered warm.
                </h2>
                <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-cream/75">
                  Custom bakes, gifting and larger orders are always welcome —
                  send us a note and we&apos;ll plan it with you.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Link href="/menu" className="btn-caramel">
                  Order banana bread
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-cream/25 px-6 py-3.5 text-[13px] font-semibold text-cream transition hover:border-cream/50 hover:bg-cream/10"
                >
                  Contact the bakery
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
