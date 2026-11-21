import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/brand";
import {
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { deliveryNote } from "@/lib/store";
import { site } from "@/lib/site";

const shopLinks = [
  { label: "Our menu", href: "/menu" },
  { label: "Banana bread flavours", href: "/menu#collection" },
  { label: "Choose your size", href: "/menu#sizes" },
  { label: "FAQs", href: "/faqs" },
];

const companyLinks = [
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Delivery information", href: "/delivery" },
  { label: "My account", href: "/account" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-choco-900 text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_0%_0%,rgba(217,173,117,0.16),transparent_60%),radial-gradient(55%_55%_at_100%_100%,rgba(217,173,117,0.1),transparent_60%)]"
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-6 pb-8 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.15fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandMark className="h-11 w-11" decorative />
              <Wordmark tone="light" />
            </Link>
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-cream/75">
              {site.description}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="DBGfoodboxng on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 bg-cream/5 text-cream/80 transition hover:border-caramel/60 hover:bg-caramel/15 hover:text-cream"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat with DBGfoodboxng on WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 bg-cream/5 text-cream/80 transition hover:border-caramel/60 hover:bg-caramel/15 hover:text-cream"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={`mailto:${site.email}`}
                aria-label={`Email ${site.name}`}
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 bg-cream/5 text-cream/80 transition hover:border-caramel/60 hover:bg-caramel/15 hover:text-cream"
              >
                <MailIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-caramel">
              Shop
            </h2>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-cream/75 transition hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-caramel">
              Company
            </h2>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-cream/75 transition hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-caramel">
              Visit &amp; contact
            </h2>
            <ul className="mt-5 space-y-3.5 text-[13px] text-cream/75">
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-caramel" />
                {site.location}
              </li>
              <li className="flex items-start gap-2.5">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-caramel" />
                <a
                  href={`mailto:${site.email}`}
                  className="transition hover:text-cream"
                >
                  {site.email}
                </a>
              </li>
              <li className="leading-relaxed text-cream/60">{deliveryNote}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/12 pt-6 text-[11.5px] text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DBGfoodboxng. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/login" className="transition hover:text-cream">
              Login
            </Link>
            <Link href="/register" className="transition hover:text-cream">
              Create account
            </Link>
            <Link href="/cart" className="transition hover:text-cream">
              Cart
            </Link>
            <span className="text-cream/40">Prices in NGN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
