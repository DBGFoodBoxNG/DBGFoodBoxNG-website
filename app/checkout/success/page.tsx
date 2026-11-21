import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductPhoto } from "@/components/product-photo";
import { ClearCart } from "@/components/clear-cart";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon,
} from "@/components/icons";
import {
  getOrderByReference,
  markOrderPaid,
  type OrderRecord,
} from "@/lib/orders";
import {
  paystackConfigured,
  verifyPaystackTransaction,
} from "@/lib/paystack";
import { formatNaira } from "@/lib/money";
import {
  formatOrderDate,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/order-status";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type SearchParams = { reference?: string; clear?: string };

async function resolveOrder(reference: string): Promise<{
  order: OrderRecord | null;
  verificationError: string | null;
}> {
  let order = getOrderByReference(reference);
  if (!order) return { order: null, verificationError: null };

  const needsVerification =
    order.paymentMethod === "paystack" && order.paymentStatus !== "paid";

  if (needsVerification && paystackConfigured()) {
    const result = await verifyPaystackTransaction(order.reference);
    if (result.ok && result.paid && result.amountKobo >= order.total * 100) {
      markOrderPaid(order.reference, result.providerReference);
      order = getOrderByReference(reference) ?? order;
      return { order, verificationError: null };
    }
    if (!result.ok) {
      return { order, verificationError: result.message };
    }
  }

  return { order, verificationError: null };
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const reference = params.reference?.trim() ?? "";

  if (!reference) {
    return (
      <Shell>
        <EmptyState
          title="No order to show yet."
          copy="This page displays an order confirmation. Once you place an order you'll be brought straight here."
        />
      </Shell>
    );
  }

  const { order, verificationError } = await resolveOrder(reference);

  if (!order) {
    return (
      <Shell>
        <EmptyState
          title="We couldn't find that order."
          copy={`No order matches the reference ${reference}. Check the link, or contact us and we'll trace it for you.`}
        />
      </Shell>
    );
  }

  const paid = order.paymentStatus === "paid";
  const dueOnDelivery = order.paymentStatus === "due_on_delivery";
  const confirmed = paid || dueOnDelivery;
  const failed = order.paymentStatus === "failed";

  return (
    <Shell>
      {confirmed && params.clear === "1" ? <ClearCart /> : null}

      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-[11.5px] font-semibold text-cocoa/55">
          <Link href="/" className="transition hover:text-choco">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span aria-current="page" className="text-choco">
            Order confirmation
          </span>
        </nav>

        <div
          className={`mt-8 overflow-hidden rounded-[2rem] border p-6 sm:p-10 ${
            confirmed
              ? "border-caramel/50 bg-gradient-to-br from-milk via-cream-50 to-caramel-200/40"
              : "border-velvet/25 bg-velvet/5"
          }`}
        >
          <span
            className={`grid h-14 w-14 place-items-center rounded-full ${
              confirmed ? "bg-choco text-cream" : "bg-velvet/15 text-velvet"
            }`}
          >
            {confirmed ? (
              <CheckCircleIcon className="h-7 w-7" />
            ) : (
              <ClockIcon className="h-7 w-7" />
            )}
          </span>

          <p className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-caramel-600">
            Order {order.reference}
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-[2.2rem] leading-[1.03] tracking-[-0.025em] text-cocoa sm:text-[3rem]">
            {paid
              ? "Payment received. Your bread is on the way."
              : dueOnDelivery
                ? "Order confirmed. We're baking it fresh."
                : failed
                  ? "That payment didn't go through."
                  : "We're waiting for your payment."}
          </h1>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-cocoa/75">
            {paid
              ? `Thank you, ${order.name.split(" ")[0]}. We've got your payment and your loaf is queued for the oven.`
              : dueOnDelivery
                ? `Thank you, ${order.name.split(" ")[0]}. Your order is confirmed — please have ${formatNaira(
                    order.total,
                  )} ready for the rider.`
                : "Your order is saved, but we haven't received payment yet. Your cart is still in this browser so you can try again."}
          </p>

          {verificationError ? (
            <p className="mt-4 rounded-2xl border border-caramel/40 bg-caramel-200/50 px-4 py-3 text-[12px] font-medium leading-relaxed text-cocoa/80">
              We couldn&apos;t reach Paystack to confirm this payment just now
              ({verificationError}). If you were charged, keep your reference
              and contact us — we&apos;ll reconcile it manually.
            </p>
          ) : null}

          <dl className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-cocoa/10 bg-white/60 p-4">
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/55">
                <ClockIcon className="h-3.5 w-3.5" /> Placed
              </dt>
              <dd className="mt-1.5 text-[12px] font-semibold text-cocoa">
                {formatOrderDate(order.createdAt)}
              </dd>
            </div>
            <div className="rounded-2xl border border-cocoa/10 bg-white/60 p-4">
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/55">
                <TruckIcon className="h-3.5 w-3.5" /> Delivery
              </dt>
              <dd className="mt-1.5 text-[12px] font-semibold text-cocoa">
                {order.zoneLabel}
              </dd>
            </div>
            <div className="rounded-2xl border border-cocoa/10 bg-white/60 p-4">
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/55">
                <CheckCircleIcon className="h-3.5 w-3.5" /> Status
              </dt>
              <dd className="mt-1.5 text-[12px] font-semibold text-cocoa">
                {orderStatusLabel(order.status)} ·{" "}
                {paymentStatusLabel(order.paymentStatus)}
              </dd>
            </div>
          </dl>

          {!confirmed ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/checkout" className="btn-primary">
                Try payment again
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact us about this order
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.45fr_0.85fr]">
          <section className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)] sm:p-7">
            <h2 className="font-display text-[1.4rem] leading-none text-cocoa">
              What we&apos;re baking
            </h2>
            <ul className="mt-5 divide-y divide-cocoa/10">
              {order.items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                    <ProductPhoto productId={item.productId} sizes="80px" className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="block truncate text-[13px] font-bold text-cocoa transition hover:text-choco"
                    >
                      {item.name}
                    </Link>
                    <span className="mt-0.5 block text-[10.5px] font-medium uppercase tracking-[0.1em] text-cocoa/55">
                      {item.sizeName} · Qty {item.qty}
                    </span>
                  </span>
                  <span className="shrink-0 text-[12.5px] font-semibold text-choco">
                    {formatNaira(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-cocoa/10 pt-5 text-[12.5px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-cocoa/65">Subtotal</dt>
                <dd className="font-semibold text-cocoa">
                  {formatNaira(order.subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-cocoa/65">Delivery</dt>
                <dd className="font-semibold text-cocoa">
                  {formatNaira(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-cocoa/10 pt-3">
                <dt className="text-[14px] font-bold text-cocoa">Total</dt>
                <dd className="font-display text-[1.5rem] leading-none text-choco">
                  {formatNaira(order.total)}
                </dd>
              </div>
            </dl>
          </section>

          <aside className="space-y-4">
            <section className="rounded-[1.75rem] border border-cocoa/10 bg-milk p-5 shadow-[0_1px_2px_rgba(43,26,18,0.03)]">
              <h2 className="font-display text-[1.2rem] leading-none text-cocoa">
                Delivery details
              </h2>
              <dl className="mt-4 space-y-3 text-[12px]">
                <div>
                  <dt className="font-semibold uppercase tracking-[0.1em] text-cocoa/50 text-[9.5px]">
                    Name
                  </dt>
                  <dd className="mt-0.5 font-semibold text-cocoa">{order.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-[0.1em] text-cocoa/50 text-[9.5px]">
                    Address
                  </dt>
                  <dd className="mt-0.5 flex items-start gap-1.5 leading-relaxed text-cocoa/80">
                    <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caramel-600" />
                    {order.address}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-[0.1em] text-cocoa/50 text-[9.5px]">
                    Phone
                  </dt>
                  <dd className="mt-0.5 text-cocoa/80">{order.phone}</dd>
                </div>
                {order.notes ? (
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.1em] text-cocoa/50 text-[9.5px]">
                      Notes
                    </dt>
                    <dd className="mt-0.5 text-cocoa/80">{order.notes}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-semibold uppercase tracking-[0.1em] text-cocoa/50 text-[9.5px]">
                    Payment
                  </dt>
                  <dd className="mt-0.5 text-cocoa/80">
                    {paymentMethodLabel(order.paymentMethod)} ·{" "}
                    {paymentStatusLabel(order.paymentStatus)}
                  </dd>
                </div>
              </dl>
            </section>

            <div className="rounded-[1.75rem] border border-cocoa/10 bg-cream-100 p-5">
              <p className="text-[11.5px] font-semibold leading-relaxed text-cocoa/70">
                Keep your order reference{" "}
                <span className="font-bold text-choco">{order.reference}</span>{" "}
                handy if you need to contact us about this bake.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/account" className="btn-secondary w-full">
                  View my orders
                </Link>
                <Link href="/menu" className="btn-primary w-full">
                  Order another loaf
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-cream">
      <SiteHeader />
      <main id="main" className="pb-20 pt-10 sm:pt-14">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-lg px-5 text-center sm:px-8">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-caramel-200 text-choco">
        <ClockIcon className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-display text-[2rem] leading-tight text-cocoa">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-cocoa/70">
        {copy}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/menu" className="btn-primary">
          Shop banana bread
        </Link>
        <Link href="/contact" className="btn-secondary">
          Contact us
        </Link>
      </div>
    </div>
  );
}
