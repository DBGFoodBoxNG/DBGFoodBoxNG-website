export const site = {
  name: "DBGfoodboxng",
  wordmark: "DBG",
  wordmarkTail: "foodboxng",
  tagline: "Goodness in every slice.",
  description:
    "A premium banana bread bakery in Lagos, baking small batches daily and delivering across the city.",
  email: "hello@dbgfoodboxng.com",
  location: "GRA, Ikeja, Lagos, Nigeria",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/dbgfoodboxng",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/?text=Hello%20DBGfoodboxng",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export function absoluteUrl(path: string): string {
  return `${site.siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
