"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductSlider({ products }: { products: any[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (!products || products.length === 0) {
    return <p className="text-center text-neutral-400">No products yet.</p>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        aria-label="Previous"
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-100 items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white transition"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 px-1"
      >
        {products.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-[68vw] sm:w-60 lg:w-72">
            <ProductCard product={p as any} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        aria-label="Next"
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-100 items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
