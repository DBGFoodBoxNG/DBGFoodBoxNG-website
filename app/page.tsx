import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  BestsellerSpotlight,
  Collection,
  CtaBanner,
  Hero,
  HowItWorks,
  Reviews,
  SizeGuide,
  WhyUs,
} from "@/components/home/sections";
import { products } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "DBGfoodboxng — Banana bread, baked to order in Lagos",
  },
  description: site.description,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: site.name,
  description: site.description,
  url: site.siteUrl,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ikeja",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
  servesCuisine: "Bakery",
  priceRange: "₦₦",
  hasMenu: `${site.siteUrl}/menu`,
  makesOffer: products.map((product) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Product",
      name: product.name,
      description: product.description,
    },
  })),
};

export default function HomePage() {
  return (
    <div className="relative bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-choco focus:px-4 focus:py-2 focus:text-[12px] focus:font-bold focus:text-cream"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Collection />
        <BestsellerSpotlight />
        <SizeGuide />
        <WhyUs />
        <HowItWorks />
        <Reviews />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}
