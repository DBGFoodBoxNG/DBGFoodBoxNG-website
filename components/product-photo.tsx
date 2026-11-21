import Image from "next/image";
import { ProductArt } from "@/components/product-art";
import { getProductById } from "@/lib/catalog";

/**
 * Renders a product photograph when the catalogue provides one, and falls back
 * to the illustrated `ProductArt` when it does not.
 *
 * Photography is chosen per product in `data/products.json` (`image`), so real
 * Mini/Midi/Regular loaves can be dropped into `/public/images/products` and
 * swapped in without touching a single component.
 */
export function ProductPhoto({
  productId,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  alt,
}: {
  productId: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  alt?: string;
}) {
  const product = getProductById(productId);
  const src = product?.image ?? null;

  if (!src) {
    return <ProductArt productId={productId} className={className} />;
  }

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt ?? `${product?.name ?? "Banana bread"} — a freshly baked loaf`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </span>
  );
}
