// lib/products-db.ts
// Server-side product reads from Supabase. Maps DB rows (snake_case) into the
// shape the UI components already expect (with legacy aliases like `imageUrl`,
// `title`, `_id` so existing components keep working).
import { createClient } from "./supabase/server";

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
    aboutItems: d.about_items ?? [],
    technicalDetails: d.technical_details ?? [],
    freeDelivery: d.free_delivery ?? true,
    replacementPolicy: d.replacement_policy ?? "3 days replacement",
  };
}

export async function getProducts(opts: { category?: string } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (opts.category) {
    query = query.ilike("category", opts.category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }
  return (data ?? []).map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
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

  return {
    ...product,
    customersSay: (reviews ?? []).map((r) => ({
      text: r.text,
      reviewer: r.reviewer,
      image: r.image,
      rating: r.rating,
      createdAt: r.created_at,
    })),
    relatedProducts: [] as any[],
  };
}
