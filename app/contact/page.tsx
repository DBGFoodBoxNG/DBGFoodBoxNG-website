import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import {
  ArrowRightIcon,
  ClockIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact DBGfoodboxng about banana bread orders, custom bakes, gifting and Lagos delivery.",
};

export default function ContactPage() {
  return (
    <div className="relative bg-cream">
      <SiteHeader />
      <main id="main" className="pb-20 pt-12 sm:pt-16">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-[11.5px] font-semibold text-cocoa/55">
            <Link href="/" className="transition hover:text-choco">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page" className="text-choco">
              Contact
            </span>
          </nav>

          <div className="mt-7 max-w-2xl">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
              Say hello
            </p>
            <h1 className="mt-3 font-display text-[2.7rem] leading-[1.02] tracking-[-0.03em] text-cocoa sm:text-[3.4rem]">
              Let&apos;s talk <span className="italic text-choco">banana bread.</span>
            </h1>
            <p className="mt-4 text-[13.5px] leading-relaxed text-cocoa/70">
              Orders, custom bakes, gifting or a question about delivery — send
              a message and we&apos;ll get back to you.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-3.5">
              <a
                href={`mailto:${site.email}`}
                className="group flex items-start gap-4 rounded-[1.5rem] border border-cocoa/10 bg-milk p-5 transition hover:border-caramel/60 hover:shadow-card"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-caramel-200 text-choco">
                  <MailIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/50">
                    Email
                  </span>
                  <span className="mt-1 block text-[13px] font-semibold text-cocoa">
                    {site.email}
                  </span>
                  <span className="mt-1 block text-[11px] text-cocoa/60">
                    Best for custom orders and order queries
                  </span>
                </span>
                <ArrowRightIcon className="ml-auto mt-1 h-4 w-4 shrink-0 text-cocoa/30 transition group-hover:translate-x-0.5 group-hover:text-choco" />
              </a>

              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 rounded-[1.5rem] border border-cocoa/10 bg-milk p-5 transition hover:border-caramel/60 hover:shadow-card"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-caramel-200 text-choco">
                  <WhatsAppIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/50">
                    WhatsApp
                  </span>
                  <span className="mt-1 block text-[13px] font-semibold text-cocoa">
                    Chat with the bakery
                  </span>
                  <span className="mt-1 block text-[11px] text-cocoa/60">
                    Quick questions and delivery updates
                  </span>
                </span>
                <ArrowRightIcon className="ml-auto mt-1 h-4 w-4 shrink-0 text-cocoa/30 transition group-hover:translate-x-0.5 group-hover:text-choco" />
              </a>

              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 rounded-[1.5rem] border border-cocoa/10 bg-milk p-5 transition hover:border-caramel/60 hover:shadow-card"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-caramel-200 text-choco">
                  <InstagramIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/50">
                    Instagram
                  </span>
                  <span className="mt-1 block text-[13px] font-semibold text-cocoa">
                    @dbgfoodboxng
                  </span>
                  <span className="mt-1 block text-[11px] text-cocoa/60">
                    This week&apos;s bakes and fresh drops
                  </span>
                </span>
                <ArrowRightIcon className="ml-auto mt-1 h-4 w-4 shrink-0 text-cocoa/30 transition group-hover:translate-x-0.5 group-hover:text-choco" />
              </a>

              <div className="rounded-[1.5rem] border border-cocoa/10 bg-cream-100 p-5">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/70 text-choco">
                    <MapPinIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/50">
                      Kitchen
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-cocoa">
                      {site.location}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-cocoa/60">
                      <ClockIcon className="h-3.5 w-3.5" />
                      Bakes are made to order, not from a shop counter
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-[2rem] border border-cocoa/10 bg-milk p-5 shadow-card sm:p-8">
              <h2 className="font-display text-[1.6rem] leading-none text-cocoa">
                Send a message
              </h2>
              <p className="mt-2 text-[12px] leading-relaxed text-cocoa/60">
                Include your order reference if your message is about an
                existing order.
              </p>
              <div className="mt-5">
                <ContactForm />
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-3 rounded-[1.5rem] border border-cocoa/10 bg-white/50 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-[12px] font-medium text-cocoa/70">
              Looking for delivery areas, lead times and fees?
            </p>
            <Link
              href="/delivery"
              className="group inline-flex items-center gap-1.5 text-[12px] font-bold text-choco transition hover:text-choco-700"
            >
              See delivery information
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
