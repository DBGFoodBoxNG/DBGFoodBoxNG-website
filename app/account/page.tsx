import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductPhoto } from "@/components/product-photo";
import { LogoutButton } from "@/components/logout-button";
import { ReorderButton } from "@/components/reorder-button";
import {
  ArrowRightIcon,
  BoxIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  StarIcon,
  TruckIcon,
  UserIcon,
} from "@/components/icons";
import { getSessionUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/orders";
import { formatNaira } from "@/lib/money";
import {
  formatOrderDate,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/order-status";

export const metadata: Metadata = {
  title: "My account",
  description: "Your DBGfoodboxng profile and banana bread order history.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getSessionUser();

  return (
    <div className="relative bg-cream">
      <SiteHeader />
      <main id="main" className="pb-20 pt-10 sm:pt-14">
        <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-[11.5px] font-semibold text-cocoa/55">
            <Link href="/" className="transition hover:text-choco">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page" className="text-choco">
              My account
            </span>
          </nav>

          {!user ? <SignedOut /> : <SignedIn user={user} />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SignedOut() {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-[2rem] border border-cocoa/10 bg-milk px-6 py-12 text-center shadow-card sm:px-10">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-caramel-200 text-choco">
        <UserIcon className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-display text-[2rem] leading-tight text-cocoa">
        Sign in to see your orders.
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-cocoa/70">
        Your account keeps your delivery details, order history and reorders in
        one place.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/login?next=/account" className="btn-primary">
          Sign in
        </Link>
        <Link href="/register" className="btn-secondary">
          Create an account
        </Link>
      </div>
      <p className="mt-5 text-[11px] text-cocoa/50">
        You can also check out as a guest — no account needed.
      </p>
    </div>
  );
}

type SignedInProps = {
  user: { id: string; name: string; email: string; phone: string | null };
};

function SignedIn({ user }: SignedInProps) {
  const orders = listOrdersForUser(user.id);
  const totalSpent = orders
    .filter((order) => order.paymentStatus !== "failed")
    .reduce((sum, order) => sum + order.total, 0);
  const confirmedOrders = orders.filter(
    (order) =>
      order.status === "confirmed" || order.paymentStatus === "due_on_delivery",
  ).length;

  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
            My account
          </p>
          <h1 className="mt-2 font-display text-[2.3rem] leading-[1.02] tracking-[-0.025em] text-cocoa sm:text-[2.9rem]">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-[13px] text-cocoa/65">
            Here&apos;s everything you&apos;ve ordered from the bakery.
          </p>
        </div>
        <Link href="/menu" className="btn-primary group self-start">
          Order again
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-8 grid items-start gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="space-y-4">
          <section className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)]">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-choco text-[15px] font-bold text-cream">
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold text-cocoa">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate text-[11.5px] text-cocoa/60">
                  {user.email}
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-3 border-t border-cocoa/10 pt-4 text-[12px]">
              <div className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 shrink-0 text-caramel-600" />
                <dt className="sr-only">Email</dt>
                <dd className="truncate text-cocoa/75">{user.email}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPinIcon className="h-4 w-4 shrink-0 text-caramel-600" />
                <dt className="sr-only">Phone</dt>
                <dd className="text-cocoa/75">
                  {user.phone ?? "No phone number saved"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-full border border-choco/20 bg-white/60 px-4 py-2.5 text-[11.5px] font-bold text-choco transition hover:border-choco/40 hover:bg-white"
              >
                Go to checkout
              </Link>
              <LogoutButton />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)]">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-cocoa/55">
              At a glance
            </h2>
            <dl className="mt-4 space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-[12px] text-cocoa/65">
                  <BoxIcon className="h-4 w-4 text-caramel-600" /> Orders placed
                </dt>
                <dd className="text-[13px] font-bold text-choco">{orders.length}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-[12px] text-cocoa/65">
                  <TruckIcon className="h-4 w-4 text-caramel-600" /> Confirmed
                </dt>
                <dd className="text-[13px] font-bold text-choco">
                  {confirmedOrders}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-[12px] text-cocoa/65">
                  <StarIcon className="h-4 w-4 text-caramel-600" /> Total value
                </dt>
                <dd className="text-[13px] font-bold text-choco">
                  {formatNaira(totalSpent)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[1.75rem] border border-caramel/40 bg-caramel-200/40 p-5">
            <h2 className="font-display text-[1.2rem] leading-tight text-cocoa">
              Need a hand?
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-cocoa/70">
              Questions about an order, a custom bake or a delivery? We&apos;re a
              message away.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-choco underline-offset-4 hover:underline"
            >
              Contact the bakery
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </section>
        </aside>

        <section className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-[1.5rem] leading-none text-cocoa">
              Order history
            </h2>
            <span className="rounded-full bg-cream-100 px-3 py-1 text-[10.5px] font-bold text-cocoa/60">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-cocoa/10 bg-cream-50 px-5 py-10 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-caramel-200 text-choco">
                <BoxIcon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-[1.4rem] leading-tight text-cocoa">
                No orders yet.
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] leading-relaxed text-cocoa/65">
                Your first loaf is one click away. Once you order, it&apos;ll
                appear here with its status.
              </p>
              <Link href="/menu" className="btn-primary mt-5">
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {orders.map((order) => {
                const failed = order.paymentStatus === "failed";
                const pendingPayment =
                  order.paymentMethod === "paystack" &&
                  order.paymentStatus === "pending";
                return (
                  <li
                    key={order.id}
                    className="overflow-hidden rounded-[1.5rem] border border-cocoa/10 bg-white/55"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cocoa/10 px-4 py-3.5 sm:px-5">
                      <div>
                        <p className="text-[11.5px] font-bold text-cocoa">
                          {order.reference}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-cocoa/55">
                          <ClockIcon className="h-3 w-3" />
                          {formatOrderDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] ${
                            failed
                              ? "bg-velvet/12 text-velvet"
                              : order.status === "confirmed"
                                ? "bg-choco text-cream"
                                : "bg-caramel-200 text-choco"
                          }`}
                        >
                          {orderStatusLabel(order.status)}
                        </span>
                        <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-cocoa/60">
                          {paymentStatusLabel(order.paymentStatus)}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 py-4 sm:px-5">
                      <ul className="space-y-2.5">
                        {order.items.map((item) => (
                          <li
                            key={`${item.productId}-${item.size}`}
                            className="flex items-center gap-3"
                          >
                            <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                              <ProductPhoto
                                productId={item.productId}
                                sizes="56px"
                                className="h-full w-full"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[11.5px] font-semibold text-cocoa">
                                {item.name}
                              </span>
                              <span className="block text-[10px] uppercase tracking-[0.08em] text-cocoa/50">
                                {item.sizeName} · Qty {item.qty}
                              </span>
                            </span>
                            <span className="shrink-0 text-[11.5px] font-semibold text-choco">
                              {formatNaira(item.lineTotal)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-3.5 flex flex-wrap items-end justify-between gap-3 border-t border-cocoa/10 pt-3.5">
                        <div className="text-[10.5px] leading-relaxed text-cocoa/55">
                          <p>{paymentMethodLabel(order.paymentMethod)}</p>
                          <p className="mt-0.5">{order.zoneLabel}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-cocoa/45">
                              Total
                            </p>
                            <p className="font-display text-[1.15rem] leading-none text-choco">
                              {formatNaira(order.total)}
                            </p>
                          </div>
                          <ReorderButton items={order.items} />
                        </div>
                      </div>

                      {pendingPayment ? (
                        <p className="mt-3 rounded-xl bg-caramel-200/50 px-3 py-2 text-[10.5px] leading-relaxed text-cocoa/70">
                          Payment for this order hasn&apos;t been confirmed.
                          Reorder to try again, or contact us with the reference
                          if you were charged.
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
