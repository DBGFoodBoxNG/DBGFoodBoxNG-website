import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductPhoto } from "@/components/product-photo";
import { ProductBuyPanel } from "@/components/product-buy-panel";
import { ProductCard } from "@/components/product-card";
import { ArrowLeftIcon, LeafIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import {
  getProductBySlug,
  products,
  sizes,
} from "@/lib/catalog";
import { formatNaira } from "@/lib/money";
import { site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Banana bread not found" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} · ${site.name}`,
      description: product.description,
      type: "website",
    },
  };
}

const storageTips = [
  "Keep it wrapped at room temperature for up to 4 days.",
  "Slices freeze beautifully for up to 3 months.",
  "Warm a slice for 20 seconds before serving.",
];

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const lowest = Math.min(
    ...sizes
      .map((size) => product.prices[size.id])
      .filter((price) => typeof price === "number" && price > 0),
  );

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: site.name },
    offers: sizes
      .filter((size) => product.prices[size.id] > 0)
      .map((size) => ({
        "@type": "Offer",
        name: size.name,
        price: product.prices[size.id],
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
      })),
  };

  return (
    <div className="relative bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <SiteHeader />
      <main id="main">
        <section className="relative overflow-hidden pb-16 pt-8 sm:pt-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-0 h-[26rem] w-[26rem] rounded-full bg-caramel/20 blur-[120px]"
          />
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <nav aria-label="Breadcrumb" className="text-[11.5px] font-semibold text-cocoa/55">
              <Link href="/" className="transition hover:text-choco">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <Link href="/menu" className="transition hover:text-choco">
                Our menu
              </Link>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span aria-current="page" className="text-choco">
                {product.name}
              </span>
            </nav>

            <div className="mt-7 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
              <div>
                <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white/80 bg-cream-100 shadow-card">
                  <div className="aspect-[5/4] w-full">
                    <ProductPhoto
                      productId={product.id}
                      priority
                      sizes="(min-width: 1024px) 600px, 100vw"
                      className="h-full w-full"
                    />
                  </div>
                  {product.badges.length ? (
                    <span className="absolute left-5 top-5 rounded-full bg-choco px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-cream shadow-sm">
                      {product.badges[0]}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {[
                    { Icon: TruckIcon, label: "Lagos delivery" },
                    { Icon: LeafIcon, label: "Real bananas" },
                    { Icon: ShieldIcon, label: "Secure checkout" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1.5 rounded-2xl border border-cocoa/10 bg-white/60 px-2 py-3 text-center"
                    >
                      <Icon className="h-4 w-4 text-caramel-600" />
                      <span className="text-[10px] font-semibold text-cocoa/70">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                  {product.tagline}
                </p>
                <h1 className="mt-3 font-display text-[2.4rem] leading-[1.03] tracking-[-0.025em] text-cocoa sm:text-[3rem]">
                  {product.name}
                </h1>
                <p className="mt-4 text-[13.5px] leading-relaxed text-cocoa/75">
                  {product.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-cocoa/10 py-4">
                  <p className="font-display text-[1.6rem] leading-none text-choco">
                    From {formatNaira(lowest)}
                  </p>
                  <p className="text-[11.5px] font-medium text-cocoa/60">
                    Mini · Midi · Regular
                  </p>
                </div>

                <div className="mt-6">
                  <ProductBuyPanel product={product} />
                </div>

                <dl className="mt-8 space-y-4 rounded-[1.5rem] border border-cocoa/10 bg-white/55 p-5">
                  <div>
                    <dt className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-cocoa/60">
                      Ingredients
                    </dt>
                    <dd className="mt-1.5 text-[12.5px] leading-relaxed text-cocoa/80">
                      {product.ingredients}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-cocoa/60">
                      Allergens
                    </dt>
                    <dd className="mt-1.5 text-[12.5px] leading-relaxed text-cocoa/80">
                      {product.allergens}. Prepared in a kitchen that handles
                      gluten, dairy, eggs and nuts.
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-cocoa/60">
                      Storage
                    </dt>
                    <dd className="mt-1.5">
                      <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-cocoa/80">
                        {storageTips.map((tip) => (
                          <li key={tip} className="flex gap-2">
                            <span aria-hidden="true" className="text-caramel-600">
                              ·
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-cocoa/10 bg-cream-100/60 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                  You might also like
                </p>
                <h2 className="mt-2 font-display text-[1.9rem] leading-tight text-cocoa sm:text-[2.3rem]">
                  More slices to try.
                </h2>
              </div>
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 text-[12.5px] font-bold text-choco transition hover:text-choco-700"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to the full menu
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
