// app/page.tsx
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import { products as localProducts } from "../lib/products";

// ----- HERO SLIDES (unchanged) -----
const slides = [
  {
    type: "video" as const,
    src: "/media/hero.mp4",
    title: "New Drop Is Live",
    subtitle: "Watch the lookbook",
  },
  {
    src: "https://images.unsplash.com/photo-1589902860314-e910697dea18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687&auto=format&fit=crop",
    alt: "Classic black tee",
    title: "Oversized",
    subtitle: "premium cotton starts at ₹499",
  },
  {
    src: "https://images.unsplash.com/photo-1654878942537-798ae579ba9d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600&auto=format&fit=crop",
    alt: "Crisp white tee",
    title: "Crisp White Tee",
    subtitle: "Clean lines. Everyday wear.",
  },
  {
    src: "https://images.unsplash.com/photo-1589902860314-e910697dea18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687&auto=format&fit=crop",
    alt: "Classic black tee",
    title: "Oversized",
    subtitle: "premium cotton starts at ₹499",
  },
];

// ----- SERVER-SIDE FETCH FROM MONGODB API -----
async function getProducts() {
  // Use NEXT_PUBLIC_BASE_URL in production if provided, otherwise fetch the API relatively.
  // Relative fetch ensures it works regardless of the dev port (3000, 3001, etc).
  const url = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")}/api/products`
    : "/api/products";

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    // Include body text in console to help debugging (server logs).
    const text = await res.text().catch(() => "<no response body>");
    console.error("GET /api/products failed:", res.status, res.statusText, text);
    throw new Error(`Failed to fetch products (${res.status})`);
  }

  return res.json();
}

// ----- PAGE COMPONENT -----
export default async function Home() {
  const products = await getProducts();

  return (
    <main className="space-y-10">
      {/* BANNER AT TOP */}
      <Banner slides={slides} />

      {/* MARQUEE STRIP */}
      <div className="relative overflow-hidden bg-accent py-3">
        <div className="whitespace-nowrap animate-marquee flex gap-8">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-black font-black uppercase tracking-widest text-sm md:text-base">
              New Drop Available • Limited Stock • Free Shipping on Orders Over ₹999 •
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-10">

        {/* TRENDING PRODUCTS */}
        {/* TRENDING PRODUCTS HEADLINE */}
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-primary">
            Trending Now
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
          <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
            Curated top picks for you
          </p>
        </div>

        {/* Combine API products with local mock products for demo purposes */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...products, ...localProducts].length === 0 ? (
            <p className="col-span-full text-center text-neutral-400">No products found.</p>
          ) : (
            [...products, ...localProducts].map((p: any, i) => {
              const normalized = {
                id: p._id ?? p.id ?? p.slug ?? `mock-${i}`, // ensure unique ID
                _id: p._id ?? p.id ?? p.slug,
                slug: p.slug ?? p._id ?? p.id,
                image: p.image ?? p.imageUrl ?? "/placeholder.png",
                imageUrl: p.imageUrl ?? p.image ?? "/placeholder.png",
                name: p.name ?? p.title ?? "Product",
                title: p.title ?? p.name ?? "Product",
                price:
                  typeof p.price === "number"
                    ? p.price < 1000
                      ? p.price * 100
                      : p.price
                    : p.price ?? 0,
                sizes: p.sizes ?? ["S", "M", "L", "XL"],
                raw: p,
              };

              return <ProductCard key={normalized.id} product={normalized} />;
            })
          )}
        </div>
      </div>
    </main >
  );
}

// Optional named export if you still need it
export function ProductsSection() {
  return (
    <section className="grid gap-2">
      {/* reusable section if needed */}
    </section>
  );
}
