import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/brand";
import { ProductPhoto } from "@/components/product-photo";
import {
  ArrowLeftIcon,
  CheckIcon,
  ShieldIcon,
} from "@/components/icons";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden overflow-hidden bg-choco-900 px-10 py-12 text-cream lg:flex lg:flex-col lg:justify-between xl:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_65%_at_0%_0%,rgba(217,173,117,0.24),transparent_60%),radial-gradient(60%_60%_at_100%_100%,rgba(217,173,117,0.14),transparent_60%)]"
        />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandMark className="h-11 w-11" decorative />
            <Wordmark tone="light" />
          </Link>
        </div>

        <div className="relative mt-10">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel">
            Goodness in every slice
          </p>
          <h2 className="mt-4 max-w-sm font-display text-[2.6rem] leading-[1.04] tracking-[-0.02em] xl:text-[3rem]">
            Your next favourite slice is waiting.
          </h2>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-cream/75">
            Sign in to reorder the loaves you love, keep track of deliveries
            and check out faster.
          </p>

          <div className="relative mt-8 max-w-[22rem]">
            <div className="relative overflow-hidden rounded-[1.5rem] border-4 border-cream/15 shadow-lift">
              <div className="aspect-[5/4]">
                <ProductPhoto
                  productId="red-velvet"
                  sizes="352px"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {[
              "Baked to order in small batches",
              "Save your details for faster checkout",
              "Track every order in one place",
            ].map((point) => (
              <li
                key={point}
                className="flex items-center gap-2.5 text-[12px] text-cream/80"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-caramel/20 text-caramel-200 ring-1 ring-inset ring-caramel/25">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-10 flex items-center gap-2 text-[10.5px] font-medium text-cream/55">
          <ShieldIcon className="h-4 w-4 text-caramel" />
          Secure accounts · Passwords are hashed, never stored in plain text
        </div>
      </aside>

      <main className="relative flex min-h-screen flex-col overflow-x-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-[26rem] w-[26rem] rounded-full bg-caramel/20 blur-[120px]"
        />

        <header className="relative flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5 lg:hidden">
            <BrandMark className="h-9 w-9" decorative />
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-cocoa/65 transition hover:text-choco"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to bakery
          </Link>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-5 pb-10 pt-4 sm:px-8">
          <div className="w-full max-w-[27rem]">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
              {eyebrow}
            </p>
            <h1 className="mt-2.5 font-display text-[2.2rem] leading-[1.05] tracking-[-0.025em] text-cocoa sm:text-[2.5rem]">
              {title}
            </h1>
            <p className="mt-3 text-[13px] leading-relaxed text-cocoa/70">
              {description}
            </p>

            <div className="mt-7 rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-card sm:p-6">
              {children}
            </div>

            {footer ? <div className="mt-5">{footer}</div> : null}
          </div>
        </div>

        <footer className="relative px-5 pb-6 text-center text-[10.5px] text-cocoa/50 sm:px-8">
          © {new Date().getFullYear()} DBGfoodboxng · Baked in GRA, Ikeja
        </footer>
      </main>
    </div>
  );
}
