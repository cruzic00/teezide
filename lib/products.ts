// lib/products.ts
// Canonical Product type used across the UI. Data now comes from Supabase
// (see lib/products-db.ts); this file only holds the shared type.
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // current price in paisa
  mrp?: number; // original price in paisa
  image: string;
  images?: string[];
  sizes: string[];
  rating?: number; // 0..5
  reviews?: number; // count
  reviewsCount?: number;
  badge?: string;
  bestPriceNote?: string;
  aboutItems?: string[];
  customersSay?: { text: string; reviewer: string; image: string; rating?: number; createdAt?: string }[];
  replacementPolicy?: string;
  freeDelivery?: boolean;
  technicalDetails?: { label: string; value: string }[];
  inStock?: boolean;
  trending?: boolean;
  colors?: string[];
  category?: string;
  subCategory?: string;
  productType?: string;
  fabric?: string;
  fit?: string;
  closure?: string;
  imageUrl?: string;
  relatedProducts?: any[];
};
