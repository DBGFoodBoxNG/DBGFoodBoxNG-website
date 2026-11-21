import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/lib/cart-context";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DBGfoodboxng — Banana bread, baked to order in Lagos",
    template: "%s · DBGfoodboxng",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "banana bread Lagos",
    "banana bread Nigeria",
    "red velvet banana bread",
    "bakery Lagos",
    "DBGfoodboxng",
  ],
  openGraph: {
    title: "DBGfoodboxng — Goodness in every slice",
    description: site.description,
    type: "website",
    locale: "en_NG",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#633D29",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
