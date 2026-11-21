import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  ShieldIcon,
  SparkIcon,
  TruckIcon,
} from "@/components/icons";
import { deliveryNote, deliveryZones } from "@/lib/store";
import { formatNaira } from "@/lib/money";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery information",
  description:
    "Lagos delivery areas, fees and timing for DBGfoodboxng banana bread, plus packaging and collection details.",
};

const steps = [
  {
    title: "We bake to order",
    copy: "Your loaf goes into the oven after you check out, so it reaches you fresh rather than from a shelf.",
    Icon: SparkIcon,
  },
  {
    title: "We box it warm",
    copy: "Each loaf is wrapped, sealed and boxed to protect it on the road.",
    Icon: ShieldIcon,
  },
  {
    title: "We deliver across Lagos",
    copy: "Our riders cover the areas below. You'll get a call or message before arrival.",
    Icon: TruckIcon,
  },
];

export default function DeliveryPage() {
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
              Delivery
            </span>
          </nav>

          <div className="mt-7 max-w-2xl">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
              From our oven to your door
            </p>
            <h1 className="mt-3 font-display text-[2.7rem] leading-[1.02] tracking-[-0.03em] text-cocoa sm:text-[3.4rem]">
              Delivery across <span className="italic text-choco">Lagos.</span>
            </h1>
            <p className="mt-4 text-[13.5px] leading-relaxed text-cocoa/70">
              {deliveryNote}
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {deliveryZones.map((zone) => (
              <article
                key={zone.id}
                className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-6 shadow-[0_1px_2px_rgba(43,26,18,0.03)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-caramel-200 text-choco">
                  <MapPinIcon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-[14px] font-bold leading-snug text-cocoa">
                  {zone.label}
                </h2>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-cocoa/60">
                  <ClockIcon className="h-3.5 w-3.5 text-caramel-600" />
                  {zone.eta}
                </p>
                <p className="mt-4 border-t border-cocoa/10 pt-3 font-display text-[1.5rem] leading-none text-choco">
                  {formatNaira(zone.fee)}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cocoa/45">
                  Delivery fee
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-[1.25rem] border border-caramel/40 bg-caramel-200/40 px-5 py-4">
            <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-choco" />
            <p className="text-[12px] leading-relaxed text-cocoa/75">
              <span className="font-bold text-cocoa">Outside these areas?</span>{" "}
              Message us with your address. We&apos;ll confirm whether we can
              deliver and what it would cost before you order.
            </p>
          </div>

          <section className="mt-14">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                How it works
              </p>
              <h2 className="mt-3 font-display text-[2.1rem] leading-[1.05] tracking-[-0.02em] text-cocoa sm:text-[2.6rem]">
                Three steps from oven to table.
              </h2>
            </div>

            <ol className="mt-9 grid gap-4 md:grid-cols-3">
              {steps.map(({ title, copy, Icon }, index) => (
                <li
                  key={title}
                  className="relative overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white/70 p-6"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -top-3 font-display text-[4.5rem] leading-none text-choco/[0.06]"
                  >
                    0{index + 1}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-caramel-200 text-choco">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[14.5px] font-bold text-cocoa">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-cocoa/70">
                    {copy}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-6 sm:p-7">
              <h2 className="font-display text-[1.6rem] leading-none text-cocoa">
                Good to know
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  "Delivery fees are calculated by area and shown at checkout before payment.",
                  "Bakes are made to order; same-day delivery depends on your area and order time.",
                  "Please give a full address with a landmark so the rider finds you quickly.",
                  "Someone should be available to receive the bread, or tell us where to leave it.",
                  "If a delivery is delayed, message us with your DBG- order reference.",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-cocoa/75"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-caramel-200 text-choco">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between rounded-[1.75rem] bg-choco-800 p-6 text-cream sm:p-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-caramel">
                  Prefer to collect?
                </p>
                <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] sm:text-[2.1rem]">
                  Collection from our GRA, Ikeja kitchen.
                </h2>
                <p className="mt-3 text-[12.5px] leading-relaxed text-cream/75">
                  Message us to arrange a pickup time. We&apos;ll have your loaf
                  boxed and ready. Collection is free.
                </p>
                <p className="mt-4 text-[11.5px] font-medium text-cream/65">
                  {site.location}
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link href="/contact" className="btn-caramel">
                  Arrange collection
                </Link>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-cream/25 px-6 py-3.5 text-[13px] font-semibold text-cream transition hover:border-cream/50 hover:bg-cream/10"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </section>

          <div className="mt-10 flex flex-col items-center justify-center gap-2 text-center">
            <Link href="/menu" className="btn-primary group">
              Order your loaf
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="mt-1 text-[11px] text-cocoa/55">
              Questions?{" "}
              <Link href="/faqs" className="font-semibold text-choco underline-offset-4 hover:underline">
                Read the FAQs
              </Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
