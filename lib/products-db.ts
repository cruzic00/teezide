// lib/products-db.ts
// Server-side product reads from Supabase. Maps DB rows (snake_case) into the
// shape the UI components already expect (with legacy aliases like `imageUrl`,
// `title`, `_id` so existing components keep working).
import { unstable_cache } from "next/cache";
import { createPublicClient } from "./supabase/public";

const PLACEHOLDER = "/placeholder.png";

export function mapProduct(d: any) {
  const image = d.image_url || (Array.isArray(d.images) && d.images[0]) || PLACEHOLDER;
  // Gallery = primary image first, then any extra images, de-duplicated.
  const gallery = [image, ...(Array.isArray(d.images) ? d.images : [])].filter(
    (v, i, a) => v && a.indexOf(v) === i
  );
  return {
    id: d.id,
    _id: d.id,
    slug: d.slug,
    name: d.title,
    title: d.title,
    description: d.description ?? "",
    price: d.price ?? 0, // paisa
    mrp: d.mrp ?? undefined,
    image,
    imageUrl: image,
    images: gallery.length ? gallery : [image],
    sizes: Array.isArray(d.sizes) && d.sizes.length ? d.sizes : ["S", "M", "L", "XL"],
    colors: d.colors ?? [],
    rating: d.rating ?? 0,
    reviews: d.reviews_count ?? 0,
    reviewsCount: d.reviews_count ?? 0,
    badge: d.badge ?? undefined,
    bestPriceNote: d.best_price_note ?? undefined,
    inStock: d.in_stock ?? true,
    trending: d.meta?.trending ?? false,
    category: d.category ?? "tshirt",
    subCategory: d.sub_category ?? undefined,
    productType: d.meta?.productType ?? "",
    fabric: d.meta?.fabric ?? "",
    fit: d.meta?.fit ?? "",
    closure: d.meta?.closure ?? "",
    aboutItems: d.about_items ?? [],
    technicalDetails: d.technical_details ?? [],
    freeDelivery: d.free_delivery ?? true,
    replacementPolicy: d.replacement_policy ?? "3 days replacement",
  };
}

const fetchProducts = unstable_cache(
  async (category?: string) => {
    try {
      const supabase = createPublicClient();
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (category) {
        query = query.ilike("category", category);
      }

      const { data, error } = await query;
      if (error) {
        console.error("getProducts error:", error.message);
        return [];
      }
      return (data ?? []).map(mapProduct);
    } catch (e) {
      console.error("getProducts failed:", e);
      return [];
    }
  },
  ["products-list"],
  { revalidate: 60, tags: ["products"] }
);

export async function getProducts(opts: { category?: string } = {}) {
  return fetchProducts(opts.category);
}

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!data) return null;

    const product = mapProduct(data);

    const { data: reviews } = await supabase
      .from("reviews")
      .select("reviewer, text, rating, image, created_at")
      .eq("product_id", data.id)
      .order("created_at", { ascending: false });

    // Similar products from the same category (fall back to any others).
    let { data: related } = await supabase
      .from("products")
      .select("*")
      .ilike("category", data.category ?? "")
      .neq("id", data.id)
      .limit(8);

    if (!related || related.length === 0) {
      const res = await supabase
        .from("products")
        .select("*")
        .neq("id", data.id)
        .limit(8);
      related = res.data;
    }

    return {
      ...product,
      customersSay: (reviews ?? []).map((r) => ({
        text: r.text,
        reviewer: r.reviewer,
        image: r.image,
        rating: r.rating,
        createdAt: r.created_at,
      })),
      relatedProducts: (related ?? []).map(mapProduct),
    };
  } catch (e) {
    console.error("getProductBySlug failed:", e);
    return null;
  }
  },
  ["product-by-slug"],
  { revalidate: 60, tags: ["products"] }
);
