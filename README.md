# DBGfoodboxng

A premium banana bread bakery storefront — landing page, menu, product pages, cart, checkout, accounts and order history — built with the Next.js App Router, React and Tailwind CSS.

The brand promise: **Goodness in every slice.** Small-batch banana bread, baked to order in GRA, Ikeja and delivered across Lagos.

---

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS 3 |
| Language | TypeScript |
| Fonts | Fraunces (display) + Plus Jakarta Sans (body), via `next/font` |
| Database | SQLite through the built-in `node:sqlite` module (no ORM, no extra service) |
| Auth | Email + password, scrypt hashing, httpOnly session cookies |
| Payments | Paystack (real integration) and pay-on-delivery |

Node **22.5 or newer** is required, because the app uses the built-in `node:sqlite` module.

---

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run typecheck   # TypeScript, no emit
npm run build       # production build
npm start           # serve the production build
```

Copy `.env.example` to `.env.local` and fill in what you need (see [Environment variables](#environment-variables)).

---

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, 9-flavour collection, Red Velvet spotlight, size guide, why-us, ordering steps, reviews, CTA |
| `/menu` | Full catalogue with add-to-cart |
| `/product/[slug]` | Product detail: size selection, price, ingredients, allergens, storage, related loaves |
| `/cart` | Cart with quantity controls and order summary |
| `/checkout` | Contact + delivery details, delivery zone/fee, payment method |
| `/checkout/success` | Order confirmation; verifies Paystack payments when applicable |
| `/login` | Sign in (email/password, show-hide, remember me, social buttons) |
| `/register` | Create account |
| `/forgot-password` | Request a reset link |
| `/reset-password` | Choose a new password from a reset token |
| `/account` | Profile, order stats, order history and reorder |
| `/about` | Brand story and values |
| `/contact` | Contact details and message form |
| `/faqs` | Ordering, delivery, ingredients, payment answers |
| `/delivery` | Delivery zones, fees, timing and collection |
| `/sitemap.xml`, `/robots.txt` | Generated SEO files |

API routes (all server-side only):

```
POST /api/auth/register        POST /api/auth/login
POST /api/auth/logout          GET  /api/auth/me
POST /api/auth/forgot          POST /api/auth/reset
GET  /api/auth/oauth/[provider]
POST /api/checkout
POST /api/payments/paystack/webhook
POST /api/contact
```

---

## Editing the catalogue and prices

**`data/products.json` is the single source of truth.** Prices are data, never hardcoded in components — the landing page, menu, product pages, cart display and checkout all read from it, and checkout recomputes every line total on the server.

- `products[]` — one entry per flavour (`id`, `slug`, `name`, `tagline`, `description`, `prices`, `ingredients`, `allergens`, `badges`, `image`, `available`).
- `sizes[]` — Mini / Midi / Regular, including weight and serving count.
- `prices` — amounts in **naira**, keyed by size id (`mini`, `midi`, `regular`).
- `pricesArePlaceholders` — currently `true`. The launch prices are unconfirmed placeholders; set this to `false` once the owner approves final pricing.
- `image` — path to the flavour photo under `public/images/`, e.g. `/images/products/classic.webp`. Set it to `null` to fall back to the inline SVG loaf art in `components/product-art.tsx`.

To change a price, edit the number in `data/products.json` and rebuild. To add a flavour, copy an existing object, give it a unique `id` and `slug`, and it appears everywhere automatically (including the sitemap and static product pages).

**Delivery** lives in `data/store.json`: zones, fees (NGN) and ETAs, plus the `deliveryNote` shown on checkout and the delivery page. Fees are re-read server-side on every order.

**Reviews** live in `data/reviews.ts`, intentionally empty. Only genuine, verified reviews should be added there — there are no invented testimonials, and the landing page shows an honest empty state until real reviews exist.

### Product photography

Every flavour has its own photo in `public/images/products/`, rendered through
`components/product-photo.tsx` on the landing hero, collection cards, product
pages, bestseller spotlight, size guide, cart and checkout thumbnails, order
history, account pages, about page and 404.

> **The current images are AI-generated launch placeholders, not photographs of
> DBGfoodboxng loaves.** See [`CREDITS.md`](./CREDITS.md) for provenance, the
> prompt recipe, known limitations and how to swap in real photography.

To replace them, drop 4:3 photos (1600 × 1200 px or larger, WebP/JPEG) into
`public/images/products/` using the product id as the filename, then rebuild. If
a filename changes, update `image` in `data/products.json`. `next/image` handles
responsive sizing, and `ProductPhoto` falls back to the SVG art when `image` is
`null`.

To regenerate AI placeholders:

```bash
$env:HF_TOKEN = "hf_..."   # free read token → FLUX.1-schnell
npm run photos
```

Without a token, `npm run photos -- --provider pollinations` uses a keyless,
lower-detail model.

---

## Accounts and data

Users, sessions, password resets, orders and contact messages are stored in SQLite at **`.data/dbgfoodboxng.db`**. The folder is created on first write and ignored by git.

- Passwords are hashed with **scrypt**; plain-text passwords are never stored.
- Sessions use an httpOnly `dbg_session` cookie. "Remember me" sets a 30-day session; otherwise it is 7 days.
- Password-reset tokens are valid for **1 hour**, are single-use, and invalidate existing sessions.
- Order references look like `DBG-<base36 time>-<random hex>`. Totals are always recomputed from `data/products.json`, never trusted from the client.
- To reset everything locally, stop the server and delete `.data/dbgfoodboxng.db`.

---

## Payments

### Paystack (card, bank transfer, USSD)

The integration is real, not simulated:

1. `POST /api/checkout` validates the cart and customer, saves the order, then calls Paystack's `/transaction/initialize`.
2. The customer is redirected to Paystack, then returned to `/checkout/success?reference=…`.
3. The success page calls `/transaction/verify/:reference` and marks the order paid only when Paystack confirms success **and** the amount matches the server-side total.
4. The webhook at `POST /api/payments/paystack/webhook` independently marks `charge.success` orders paid, after validating the `x-paystack-signature` HMAC-SHA512 against `PAYSTACK_SECRET_KEY`.

Configure the webhook in your Paystack dashboard as:

```
https://<your-domain>/api/payments/paystack/webhook
```

Set `PAYSTACK_SECRET_KEY` (and `NEXT_PUBLIC_SITE_URL`) on the server. **Without the secret key, card payments are disabled** — checkout says so plainly and disables the option rather than pretending to charge.

### Pay on delivery

A genuine second method: the order is confirmed immediately and payment is collected by the rider. No card details are involved.

### What payment data is stored

Only the order, its reference, totals and payment status/provider reference. Card details are entered on Paystack's secure page and never touch this server.

---

## Authentication

- Registration requires a name, valid email and an 8+ character password.
- Login supports "keep me signed in for 30 days".
- `POST /api/auth/forgot` always returns the same message whether or not the account exists, to avoid email enumeration.
- Password reset invalidates other sessions.
- Google/Apple buttons are present but **not faked**: `/api/auth/oauth/[provider]` returns HTTP 501 and states which credentials and callback work are required.

### Email is not wired up yet

There is no transactional email provider. Password-reset links and contact-form replies are not emailed:

- Reset links are written to the server log (`[password-reset] …`).
- For local testing only, `SHOW_RESET_LINK=1` also returns the link to the page. **Never enable this in production.**
- Contact messages are stored in the `messages` table for the owner to read.

To finish this, connect an email provider (for example Resend, Postmark or SES) inside `app/api/auth/forgot/route.ts` and `app/api/contact/route.ts`.

---

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public URL used in metadata, sitemap/robots and Paystack callback URLs |
| `PAYSTACK_SECRET_KEY` | For card payments | Server-side Paystack key; enables initialize, verify and webhook signature checks |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Optional | Instagram link (falls back to a placeholder in `lib/site.ts`) |
| `NEXT_PUBLIC_WHATSAPP_URL` | Optional | WhatsApp link (falls back to a placeholder) |
| `SHOW_RESET_LINK` | Development only | `1` returns password-reset links in the page because email is not configured |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Not implemented | Required before Google sign-in can work |
| `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` | Not implemented | Required before Apple sign-in can work |

`.env*` files and `.data/` are git-ignored.

---

## Before launch — honest checklist

These are real gaps, not cosmetic ones:

1. **Replace placeholder prices** in `data/products.json` and set `pricesArePlaceholders` to `false`.
2. **Replace placeholder contact/social details** in `lib/site.ts` (`hello@dbgfoodboxng.com`, the Instagram handle, the WhatsApp link) or set the env vars.
3. **Add `PAYSTACK_SECRET_KEY`** and register the webhook URL to enable card payments.
4. **Connect transactional email** for password resets and contact replies.
5. **Implement Google/Apple OAuth** (provider apps + callback routes) if social sign-in is wanted; until then the buttons are honest about being unconfigured.
6. **Replace the AI-generated placeholder photos** in `public/images/products/` with real Mini/Midi/Regular loaves (`CREDITS.md` explains how).
7. **Add rate limiting / bot protection** to the auth, contact and checkout endpoints for public traffic.
8. **Review legal copy** (privacy, terms, delivery policy) before accepting live orders.
9. **Set the production domain** in `NEXT_PUBLIC_SITE_URL` and pay attention to cookie/HTTPS settings at the host.

---

## Project structure

```
app/                    routes, API handlers, metadata, sitemap/robots
  api/                  auth, checkout, Paystack webhook, contact
  product/[slug]/       static product detail pages
components/             shared UI (header, footer, cards, forms, cart, checkout)
  auth/                 login, register, forgot/reset forms
data/                   products.json, store.json, reviews.ts
lib/                    catalog, cart context, auth, db, orders, paystack, money, site
public/images/products/  one photo per flavour (see CREDITS.md)
scripts/                generate-product-photos.mjs (FLUX / Pollinations)
```

Design tokens (`cream`, `cocoa`, `choco`, `caramel`, `velvet`, `milk`) and shared classes (`field`, `btn-primary`, `btn-secondary`, `btn-caramel`) live in `tailwind.config.ts` and `app/globals.css`. All iconography is an inline SVG set in `components/icons.tsx` — no icon library and no external image requests.
