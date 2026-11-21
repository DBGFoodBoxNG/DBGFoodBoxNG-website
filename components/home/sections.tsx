import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CartIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  LeafIcon,
  ShieldIcon,
  SparkIcon,
  StarIcon,
  TruckIcon,
} from "@/components/icons";
import { ProductPhoto } from "@/components/product-photo";
import { ProductCard } from "@/components/product-card";
import { bestseller, fromPrice, products, sizes } from "@/lib/catalog";
import { formatNaira } from "@/lib/money";
import { reviews } from "@/data/reviews";

const sizePrices = sizes.map((size) => {
  const values = products
    .map((product) => product.prices[size.id])
    .filter((price): price is number => typeof price === "number" && price > 0);
  return { ...size, from: values.length ? Math.min(...values) : null };
});

const reasons = [
  {
    title: "Freshly baked goodness",
    copy: "Every loaf is baked to order in small batches — never pulled from a shelf.",
    Icon: SparkIcon,
  },
  {
    title: "Quality ingredients",
    copy: "Real ripe bananas, butter, free-range eggs and proper chocolate. No shortcuts.",
    Icon: LeafIcon,
  },
  {
    title: "Nine flavour varieties",
    copy: "From the classic loaf to Red Velvet, Chocolate Chip, Oreo, Nutella and Baileys.",
    Icon: CheckCircleIcon,
  },
  {
    title: "Convenient ordering",
    copy: "Order online in under a minute. Pay securely or on delivery.",
    Icon: ClockIcon,
  },
  {
    title: "Lagos delivery",
    copy: "Boxed, sealed and delivered across Lagos — or collect from our GRA, Ikeja kitchen.",
    Icon: TruckIcon,
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your flavour",
    copy: "Browse all nine bakes and pick the one that fits your table.",
    Icon: SparkIcon,
  },
  {
    number: "02",
    title: "Select a size and order",
    copy: "Mini, Midi or Regular — then check out in a couple of taps.",
    Icon: CartIcon,
  },
  {
    number: "03",
    title: "Receive your bake",
    copy: "We bake it fresh, box it warm and deliver it to your door.",
    Icon: TruckIcon,
  },
];

export function Hero() {
  const featured = bestseller();

  return (
    <section className="relative overflow-x-clip pb-16 pt-10 sm:pt-14 lg:pb-24 lg:pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-caramel/25 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-40 h-[26rem] w-[26rem] rounded-full bg-cream-300/60 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 xl:gap-16">
          <div className="animate-fade-up">
            <h1 className="font-display text-[3rem] leading-[1.02] tracking-[-0.03em] text-cocoa sm:text-[3.9rem] lg:text-[clamp(3.1rem,4.5vw,3.9rem)]">
              Goodness in
              <br />
              <span className="relative inline-block italic text-choco">
                every slice.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 240 14"
                  className="absolute -bottom-1 left-0 h-3 w-full text-caramel"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9c42-6 84-7 126-4 36 2 72 1 108-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-[32rem] text-[15px] leading-relaxed text-cocoa/75">
              Freshly baked banana bread, crafted to make every bite memorable.
              Real bananas, generous fillings and a warm crumb — delivered
              across Lagos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/menu" className="btn-primary group">
                Shop our banana bread
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#collection" className="btn-secondary">
                Explore our collection
              </a>
            </div>

            <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11.5px] font-semibold text-cocoa/70">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-3.5 w-3.5 text-caramel-600" />
                Baked to order
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-3.5 w-3.5 text-caramel-600" />
                Real bananas only
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-3.5 w-3.5 text-caramel-600" />
                Lagos-wide delivery
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[460px] animate-fade-up lg:mx-0 lg:ml-auto">
            <div className="group relative overflow-hidden rounded-[2rem] border-[6px] border-white/80 bg-cream-100 shadow-lift">
              <div className="aspect-[5/4] w-full">
                <ProductPhoto
                  productId={featured.id}
                  priority
                  sizes="(min-width: 1024px) 460px, 90vw"
                  className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-cocoa/10 bg-milk/95 p-4 shadow-card backdrop-blur sm:inset-x-4 sm:bottom-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                      Bestseller
                    </p>
                    <p className="mt-1 font-display text-[1.15rem] leading-tight text-cocoa">
                      {featured.name}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-cocoa/65">
                      From {formatNaira(fromPrice(featured))}
                    </p>
                  </div>
                  <Link
                    href={`/product/${featured.slug}`}
                    aria-label={`Order ${featured.name}`}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-choco text-cream transition hover:bg-choco-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40"
                  >
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-20 grid gap-6 rounded-[1.75rem] border border-cocoa/10 bg-white/55 px-6 py-7 sm:grid-cols-3 sm:gap-4 sm:px-9 lg:mt-24">
          {[
            { value: "8", label: "Signature flavours" },
            { value: "Mini · Midi · Regular", label: "Three sizes for every table" },
            { value: "Lagos", label: "Baked and delivered locally" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col-reverse gap-1 sm:border-l sm:border-cocoa/10 sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cocoa/65">
                {item.label}
              </dt>
              <dd className="font-display text-[1.5rem] leading-none text-choco">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Collection() {
  return (
    <section id="collection" className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
              Our banana bread collection
            </p>
            <h2 className="mt-3 max-w-xl font-display text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-cocoa sm:text-[2.8rem]">
              Nine ways to fall in love with banana bread.
            </h2>
          </div>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-cocoa/70">
            Baked in small batches every morning. Choose a flavour, pick your
            size and we&apos;ll take care of the rest.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 text-[12.5px] font-bold text-choco transition hover:text-choco-700"
          >
            Browse the full menu
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="text-[11px] text-cocoa/60">
            All prices in NGN · Mini, Midi and Regular sizes
          </p>
        </div>
      </div>
    </section>
  );
}

export function BestsellerSpotlight() {
  const featured = bestseller();

  return (
    <section className="relative py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-choco-800 px-6 py-10 text-cream sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_90%_at_0%_0%,rgba(217,173,117,0.22),transparent_58%),radial-gradient(55%_70%_at_100%_100%,rgba(217,173,117,0.12),transparent_60%)]"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-caramel px-3.5 py-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-choco-900">
                <StarIcon className="h-3 w-3" />
                Bestseller
              </span>
              <h2 className="mt-5 max-w-lg font-display text-[2.3rem] leading-[1.03] tracking-[-0.02em] text-cream sm:text-[3rem]">
                Red Velvet Banana Bread
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-cream/80">
                {featured.description}
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Velvety cocoa crumb with a cream-cheese ripple",
                  "Baked to order and boxed warm",
                  "Mini, Midi and Regular — from " + formatNaira(fromPrice(featured)),
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-[12.5px] text-cream/85"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-caramel/20 text-caramel-200 ring-1 ring-inset ring-caramel/25">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/product/${featured.slug}`}
                  className="btn-caramel group"
                >
                  Order now
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center rounded-full border border-cream/25 px-6 py-3.5 text-[13px] font-semibold text-cream transition hover:border-cream/50 hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cream/20"
                >
                  See all flavours
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[430px]">
              <div className="relative overflow-hidden rounded-[1.75rem] border-4 border-cream/15 shadow-lift">
                <div className="aspect-[5/4]">
                  <ProductPhoto
                    productId={featured.id}
                    sizes="(min-width: 1024px) 430px, 90vw"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SizeGuide() {
  return (
    <section id="sizes" className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
            Choose your size
          </p>
          <h2 className="mt-3 font-display text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-cocoa sm:text-[2.8rem]">
            A loaf for every table.
          </h2>
          <p className="mt-4 text-[13.5px] leading-relaxed text-cocoa/70">
            Whether it&apos;s a quiet breakfast for one or a full family
            gathering, there&apos;s a size that fits.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {sizePrices.map((size, index) => (
            <article
              key={size.id}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-milk p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-caramel/60 hover:shadow-card"
            >
              <div className="mx-auto flex h-40 w-full items-end justify-center overflow-hidden rounded-2xl bg-cream-50">
                <div
                  className={`mb-[-6%] transition-transform duration-500 group-hover:scale-[1.04] ${
                    index === 0
                      ? "w-[46%]"
                      : index === 1
                        ? "w-[62%]"
                        : "w-[80%]"
                  }`}
                >
                  <ProductPhoto
                    productId="classic"
                    sizes="(min-width: 768px) 260px, 60vw"
                    className="aspect-[4/3] w-full rounded-xl"
                  />
                </div>
              </div>
              <h3 className="mt-5 font-display text-[1.5rem] leading-none text-cocoa">
                {size.name}
              </h3>
              <p className="mt-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-caramel-600">
                {size.serves} · {size.weight}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-cocoa/70">
                {size.note}
              </p>
              <p className="mt-auto pt-5 font-display text-[1.3rem] text-choco">
                From {formatNaira(size.from)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className="border-y border-cocoa/10 bg-cream-100/70 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
              Why DBGfoodboxng
            </p>
            <h2 className="mt-3 max-w-md font-display text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-cocoa sm:text-[2.8rem]">
              Baked like it&apos;s for family.
            </h2>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-cocoa/70">
              We started with one loaf and a stubborn belief: banana bread
              should taste like bananas, not sugar and shortcuts. That
              hasn&apos;t changed.
            </p>
            <Link href="/about" className="btn-secondary mt-6">
              Our story
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {reasons.map(({ title, copy, Icon }, index) => (
              <li
                key={title}
                className={`rounded-[1.5rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)] ${
                  index === reasons.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-caramel-200 text-choco">
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
          </ul>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
            How it works
          </p>
          <h2 className="mt-3 font-display text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-cocoa sm:text-[2.8rem]">
            From our oven to your table.
          </h2>
        </div>

        <ol className="relative mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(({ number, title, copy, Icon }) => (
            <li
              key={number}
              className="relative overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white/70 p-7 text-center"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-4 font-display text-[5rem] leading-none text-choco/[0.06]"
              >
                {number}
              </span>
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-caramel-200 text-choco">
                <Icon className="h-[22px] w-[22px]" />
              </span>
              <h3 className="mt-5 text-[15px] font-bold text-cocoa">{title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-cocoa/70">
                {copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="border-y border-cocoa/10 bg-milk/60 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
            Customer reviews
          </p>
          <h2 className="mt-3 font-display text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-cocoa sm:text-[2.8rem]">
            Kind words, only when earned.
          </h2>
          <p className="mt-4 text-[13.5px] leading-relaxed text-cocoa/70">
            We publish reviews from verified orders only — no scripts, no
            invented quotes.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-cocoa/10 bg-cream-50 px-6 py-10 text-center sm:px-10">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-caramel-200 text-choco">
              <StarIcon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-[1.5rem] leading-tight text-cocoa">
              No reviews published yet.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-cocoa/70">
              As orders are delivered, verified customers can share their
              thoughts — and they&apos;ll appear right here. Your first loaf
              could be the first review.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/menu" className="btn-primary">
                Order a loaf
              </Link>
              <Link href="/faqs" className="btn-secondary">
                How reviews work
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col rounded-[1.75rem] border border-cocoa/10 bg-cream-50 p-6"
              >
                <div
                  className="flex gap-0.5 text-caramel-500"
                  role="img"
                  aria-label={`Rated ${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`h-3.5 w-3.5 ${
                        index < review.rating ? "" : "opacity-25"
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[13.5px] leading-relaxed text-cocoa/80">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-cocoa/10 pt-4">
                  <p className="text-[12px] font-bold text-cocoa">
                    {review.name}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-cocoa/65">
                    {review.location} · {review.productName}
                  </p>
                  <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-caramel-600">
                    Verified order
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-choco via-choco-800 to-choco-900 px-6 py-14 text-center text-cream sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-caramel/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-caramel/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-caramel-200 ring-1 ring-inset ring-cream/15">
              <SparkIcon className="h-3.5 w-3.5" />
              Baked fresh, delivered to you
            </span>
            <h2 className="mt-5 font-display text-[2.4rem] leading-[1.03] tracking-[-0.02em] sm:text-[3.3rem]">
              Your next favourite slice is just an order away.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-cream/80">
              Pick a flavour, choose your size and we&apos;ll bake it fresh for
              your door.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/menu" className="btn-caramel group">
                Order now
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/delivery"
                className="inline-flex items-center justify-center rounded-full border border-cream/25 px-6 py-3.5 text-[13px] font-semibold text-cream transition hover:border-cream/50 hover:bg-cream/10"
              >
                Delivery information
              </Link>
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 text-[10.5px] font-medium tracking-wide text-cream/65">
              <ShieldIcon className="h-3.5 w-3.5" />
              Secure checkout · Pay online or on delivery
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
