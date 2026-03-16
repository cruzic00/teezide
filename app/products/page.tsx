// app/products/page.tsx
import React from "react";
import { products } from "../../lib/products";
import ProductCard from "../../components/ProductCard";

export default function ProductsPage() {
  return (
    <section className="p-6 grid gap-6">
      <h2
        className="text-2xl font-extrabold text-yellow-500"
        style={{
          // use a simple string here to avoid template/backtick parsing issues
          textShadow: "2px 2px 0 #000, 4px 4px 0 #4e4d4fff, 6px 6px 0 #c5c5c5ff",
        }}
      >
        NEW ARRIVALS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-11">
        {products.map((p: any) => {
          const normalized = {
            id: p._id ?? p.id ?? p.slug,
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
        })}
      </div>
    </section>
  );
}
