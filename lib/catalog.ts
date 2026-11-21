import catalogJson from "@/data/products.json";

export type SizeId = "mini" | "midi" | "regular";

export type Size = {
  id: SizeId;
  name: string;
  serves: string;
  weight: string;
  note: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  prices: Record<SizeId, number>;
  ingredients: string;
  allergens: string;
  badges: string[];
  /** Optional photography. Drop a file in /public/images/products and set this path. */
  image: string | null;
  available: boolean;
};

type Catalog = {
  currency: string;
  pricesArePlaceholders: boolean;
  sizes: Size[];
  products: Product[];
};

const catalog = catalogJson as unknown as Catalog;

export const currency = catalog.currency;
export const pricesArePlaceholders = catalog.pricesArePlaceholders;
export const sizes = catalog.sizes;
export const products = catalog.products;
export const defaultSize: SizeId = "midi";

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getSize(id: SizeId): Size | undefined {
  return sizes.find((size) => size.id === id);
}

export function isSizeId(value: string): value is SizeId {
  return sizes.some((size) => size.id === value);
}

export function priceFor(product: Product, size: SizeId): number | null {
  const price = product.prices[size];
  return typeof price === "number" && price > 0 ? price : null;
}

export function fromPrice(product: Product): number | null {
  const values = sizes
    .map((size) => priceFor(product, size.id))
    .filter((price): price is number => price !== null);
  return values.length ? Math.min(...values) : null;
}

export function bestseller(): Product {
  return (
    products.find((product) => product.badges.includes("Bestseller")) ??
    products[1] ??
    products[0]
  );
}
