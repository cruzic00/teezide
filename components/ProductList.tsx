"use client";

import React, { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // Handle API inconsistency: sometimes returns array, sometimes { products: [] }
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          // If we got an object but no products array, assume empty or error
          console.warn("Unexpected API response format:", data);
          setProducts([]);
        }
      })
      .catch((e) => setErr(String(e)));
  }, []);

  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;
  if (!products) return <div className="p-4">Loading…</div>;
  if (products.length === 0) return <div className="p-4">No products found.</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {products.map((p) => (
        <article key={p.id} className="border rounded p-3 shadow-sm">
          <div className="h-40 w-full mb-2 bg-gray-100 flex items-center justify-center">
            {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="h-full object-cover" /> : <span>No image</span>}
          </div>
          <h3 className="font-medium">{p.title}</h3>
          <p className="text-sm text-gray-600">{p.description}</p>
          <div className="mt-2 font-semibold">₹{p.price ?? "-"}</div>
        </article>
      ))}
    </div>
  );
}
