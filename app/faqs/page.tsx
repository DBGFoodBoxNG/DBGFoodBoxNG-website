import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";
import { deliveryNote, deliveryZones } from "@/lib/store";
import { formatNaira } from "@/lib/money";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers about ordering, delivery, ingredients, allergens, storage and payment for DBGfoodboxng banana bread.",
};

const groups = [
  {
    title: "Ordering",
    faqs: [
      {
        q: "How do I place an order?",
        a: "Pick a flavour on the menu, choose Mini, Midi or Regular, then add it to your cart. Checkout takes your delivery details and lets you pay online or on delivery. You can also message us for larger or custom orders.",
      },
      {
        q: "How far ahead should I order?",
        a: "Bakes are made to order. Same-day delivery is available in some areas if you order before 9am; otherwise orders are delivered the next day. If you need a loaf for a specific time, message us and we'll confirm.",
      },
      {
        q: "Can I order a custom flavour or a larger batch?",
        a: "Yes. Send us a message with the flavour, size and quantity you have in mind and we'll plan it with you.",
      },
      {
        q: "Do I need an account to order?",
        a: "No — you can check out as a guest. An account saves your details for faster checkout and keeps your order history and reorders in one place.",
      },
    ],
  },
  {
    title: "Delivery",
    faqs: [
      {
        q: "Where do you deliver?",
        a: `We deliver across Lagos. Current areas and fees: ${deliveryZones
          .map((zone) => `${zone.label} (${formatNaira(zone.fee)})`)
          .join("; ")}.`,
      },
      {
        q: "How much is delivery?",
        a: "Delivery is calculated by area and shown at checkout before you pay. It ranges from ₦2,000 to ₦3,000 in the areas we currently serve.",
      },
      {
        q: "When will my bread arrive?",
        a: deliveryNote,
      },
      {
        q: "Can I collect instead?",
        a: `Collection from our GRA, Ikeja kitchen can be arranged by message. Email ${site.email} or use the contact form and we'll agree a time.`,
      },
    ],
  },
  {
    title: "Ingredients, allergens & storage",
    faqs: [
      {
        q: "What ingredients do you use?",
        a: "Ripe bananas, wheat flour, butter, free-range eggs and real flavourings — dark chocolate, Oreo, hazelnut spread, nuts, coconut or Baileys depending on the loaf. Full ingredients are listed on each product page.",
      },
      {
        q: "Do you cater for allergies?",
        a: "Each product page lists its allergens. Our kitchen handles gluten, dairy, eggs, nuts and soy, so we can't guarantee an allergen-free bake. If you have a serious allergy, contact us before ordering.",
      },
      {
        q: "Does the Baileys loaf contain alcohol?",
        a: "Yes — Baileys Irish Cream is a listed ingredient, so that loaf is marked 18+ and not suitable for children or anyone avoiding alcohol.",
      },
      {
        q: "How should I store my banana bread?",
        a: "Keep it wrapped at room temperature and enjoy within 4 days. Slices freeze well for up to 3 months — warm them for about 20 seconds before serving.",
      },
    ],
  },
  {
    title: "Payment & reviews",
    faqs: [
      {
        q: "How can I pay?",
        a: "You can pay securely online by card, bank transfer or USSD through Paystack, or choose pay on delivery and settle with the rider. The payment options available to you are shown at checkout.",
      },
      {
        q: "Is my payment secure?",
        a: "Online payments are processed by Paystack. Card details are entered on Paystack's secure page and are never stored on our servers. We only keep the order reference and payment status.",
      },
      {
        q: "Why don't I see customer reviews yet?",
        a: "We only publish reviews from genuine, verified orders — we won't invent testimonials. As customers order and share feedback, real reviews will appear on the site.",
      },
      {
        q: "How do I get help with an order?",
        a: `Email ${site.email} with your order reference (it starts with DBG-) and we'll look into it.`,
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <div className="relative bg-cream">
      <SiteHeader />
      <main id="main" className="pb-20 pt-12 sm:pt-16">
        <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-[11.5px] font-semibold text-cocoa/55">
            <Link href="/" className="transition hover:text-choco">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page" className="text-choco">
              FAQs
            </span>
          </nav>

          <div className="mt-7 max-w-2xl">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
              Good to know
            </p>
            <h1 className="mt-3 font-display text-[2.7rem] leading-[1.02] tracking-[-0.03em] text-cocoa sm:text-[3.3rem]">
              Frequently asked <span className="italic text-choco">questions.</span>
            </h1>
            <p className="mt-4 text-[13.5px] leading-relaxed text-cocoa/70">
              Everything about ordering, delivery, ingredients and payment. If
              your question isn&apos;t here, we&apos;re one message away.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.62fr_1.38fr]">
            <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-[1.75rem] bg-choco-800 p-6 text-cream">
                <h2 className="font-display text-[1.5rem] leading-tight">
                  Still curious?
                </h2>
                <p className="mt-2 text-[12.5px] leading-relaxed text-cream/75">
                  Ask us anything about a bake, an order or delivery.
                </p>
                <Link href="/contact" className="btn-caramel mt-4 w-full">
                  Contact us
                </Link>
              </div>
              <div className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cocoa/50">
                  Delivery areas
                </p>
                <ul className="mt-3 space-y-2 text-[12px] text-cocoa/70">
                  {deliveryZones.map((zone) => (
                    <li key={zone.id} className="flex items-start justify-between gap-3">
                      <span>{zone.label}</span>
                      <span className="shrink-0 font-semibold text-choco">
                        {formatNaira(zone.fee)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/delivery"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-choco underline-offset-4 hover:underline"
                >
                  Delivery information
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>

            <div className="space-y-8">
              {groups.map((group) => (
                <section key={group.title}>
                  <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-caramel-600">
                    {group.title}
                  </h2>
                  <div className="mt-3 space-y-2.5">
                    {group.faqs.map((faq) => (
                      <details
                        key={faq.q}
                        className="group rounded-[1.25rem] border border-cocoa/10 bg-milk px-5 py-4 shadow-[0_1px_2px_rgba(43,26,18,0.03)] transition open:border-caramel/50 open:shadow-card"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-bold text-cocoa [&::-webkit-details-marker]:hidden">
                          {faq.q}
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream-100 text-choco transition group-open:rotate-45 group-open:bg-caramel-200">
                            <PlusIcon className="h-3.5 w-3.5" />
                          </span>
                        </summary>
                        <p className="mt-3 max-w-2xl text-[12.5px] leading-relaxed text-cocoa/75">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
