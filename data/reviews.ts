export type Review = {
  id: string;
  name: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  productName: string;
  /** Only reviews tied to a verified order should be published. */
  verified: true;
  date: string;
};

/**
 * Genuine customer reviews only. This intentionally starts empty — the reviews
 * section renders an honest empty state until real, verified reviews exist.
 * Add entries here once customers submit them (or wire this array to your DB).
 */
export const reviews: Review[] = [];
