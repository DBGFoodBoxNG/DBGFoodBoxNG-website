"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark, Wordmark } from "@/components/brand";
import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SparkIcon,
  UserIcon,
} from "@/components/icons";
import { useCart } from "@/lib/cart-context";

const links = [
  { label: "Home", href: "/" },
  { label: "Our Menu", href: "/menu" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, ready } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-choco-900 text-cream">
        <p className="mx-auto flex h-9 max-w-[1200px] items-center justify-center gap-2 px-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em]">
          <SparkIcon className="h-3.5 w-3.5 text-caramel" aria-hidden="true" />
          Baked in GRA Ikeja · Delivered across Lagos
        </p>
      </div>

      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "border-cocoa/10 bg-cream/90 shadow-[0_10px_30px_-24px_rgba(43,26,18,0.55)] backdrop-blur-xl"
            : "border-transparent bg-cream/70 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-[4.75rem] w-full max-w-[1200px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 sm:gap-3"
            onClick={() => setOpen(false)}
          >
            <BrandMark
              className="hidden h-9 w-9 min-[360px]:block sm:h-11 sm:w-11"
              decorative
            />
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-semibold text-cocoa/75 transition hover:text-choco"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-[12.5px] font-semibold text-cocoa/75 transition hover:bg-white/70 hover:text-choco focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40 sm:px-3.5"
            >
              <UserIcon className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">My Account</span>
              <span className="sr-only sm:hidden">My Account</span>
            </Link>

            <Link
              href="/cart"
              aria-label={
                ready && count > 0 ? `Cart, ${count} items` : "Cart, empty"
              }
              className="relative grid h-10 w-10 place-items-center rounded-full text-cocoa/80 transition hover:bg-white/70 hover:text-choco focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40"
            >
              <CartIcon className="h-[21px] w-[21px]" />
              {ready && count > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-caramel px-1 text-[10px] font-extrabold leading-none text-choco-900 ring-2 ring-cream"
                >
                  {count}
                </span>
              ) : null}
            </Link>

            <Link
              href="/menu"
              className="ml-1 hidden items-center gap-2 rounded-full bg-choco py-2.5 pl-4 pr-5 text-[12px] font-bold text-cream transition hover:bg-choco-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40 sm:inline-flex"
            >
              Order now
            </Link>

            <button
              type="button"
              onClick={() => setOpen((isOpen) => !isOpen)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="ml-0.5 grid h-10 w-10 place-items-center rounded-full border border-cocoa/12 bg-white/60 text-cocoa transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-caramel/40 lg:hidden"
            >
              {open ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="lg:hidden">
          <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto border-b border-cocoa/10 bg-cream px-5 pb-6 pt-3 shadow-soft sm:px-8">
            <nav className="flex flex-col" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-3 py-3.5 text-[14px] font-semibold text-cocoa/85 transition hover:bg-white/70"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-cocoa/10 pt-4">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cocoa/15 bg-white/60 py-3 text-[12.5px] font-semibold text-choco transition hover:bg-white"
              >
                <UserIcon className="h-4 w-4" />
                My Account
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cocoa/15 bg-white/60 py-3 text-[12.5px] font-semibold text-choco transition hover:bg-white"
              >
                <CartIcon className="h-4 w-4" />
                Cart{ready && count > 0 ? ` (${count})` : ""}
              </Link>
            </div>
            <Link
              href="/menu"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Shop banana bread
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
