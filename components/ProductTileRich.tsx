"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../lib/cart"; // adjust if you use path aliases
import { useAuth } from "../app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

type CardProduct = {
  image: string;
  name: string;
  price: number;   // in paisa
  slug: string;
  id?: string;
  sizes?: string[];
  badge?: string;  // Add this line
  bestPriceNote?: string; // Add this line

};

export default function ProductCard({ product }: { product: CardProduct }) {
  const { addItem } = useCart(); // ✅ correct destructuring
  const [open, setOpen] = useState(false);

  // fallback sizes
  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
  const [selSize, setSelSize] = useState<string>(sizes[0]);

  // add to cart
  // add to cart
  const { user, loading } = useAuth(); // Import this
  const router = useRouter();
  const pathname = usePathname();

  const addToCart = () => {
    if (loading) return;

    // Add auth check
    if (!user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    addItem({
      id: product.id ?? product.slug,
      name: product.name,
      price: product.price,      // keep in paisa
      image: product.image,
      size: selSize,
    });
    setOpen(false);
  };

  return (
    <div className="">
      {/* badge */}
      {product.badge && (
        <span className="absolute z-10 m-3 inline-block rounded-md bg-yellow-500 px-2 py-1 text-xs font-semibold text-white">
          {product.badge}
        </span>
      )}


      <div className="grid gap-3">
        {/* ✅ Clickable card: image + title + price */}
        <Link href={`/products/${product.slug}`} className="group block">
          <div className="aspect-square bg-[#623903] rounded-xl overflow-hidden ring-1 ring-transparent group-hover:ring-yellow-500 transition">
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"

            />
          </div>


          <div className="mt-2">
            <div className="font-extrabold text-yellow-500 bg-transparent hover:text-[#623903]  rounded-md text-[#623903] font-semibold ">
              {product.name}
            </div>
            <div className="text-neutral-400 text-sm">
              ₹{(product.price / 100).toFixed(2)}
              {/* best price line */}
              {product.bestPriceNote && (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                  {product.bestPriceNote}
                </div>
              )}

            </div>
          </div>
        </Link>


        {/* ✅ Only this opens the modal */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[#623903] bg-white hover:bg-yellow-500 px-6 py-3 rounded-md text-[#623903] font-semibold shadow btn"
        >
          ADD TO CART
        </button>

        {/* ✅ Modal */}
        {open && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
            <div className="w-[92vw] max-w-4xl bg-white text-[#623903] rounded-2xl p-5 relative">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-3 text-2xl leading-none hover:scale-125 transition"
                aria-label="close"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: image */}
                <div className="rounded-xl overflow-hidden ring-1 ring-[#7a4a05]/50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={900}
                    height={900}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right: details */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-extrabold text-transparent" style={{
                    textShadow: `
      2px 2px 0 #ffaa00ff,
      4px 4px 0 #444,
      6px 6px 0 #666
    `
                  }}>{product.name}</h2>
                  <p className="text-lg font-semibold">
                    ₹{(product.price / 100).toFixed(2)}
                  </p>

                  <p className="mb-1 font-bold">Choose size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelSize(s)}
                        className={`px-4 py-2 rounded-lg border transition 
                        ${selSize === s
                            ? "bg-yellow-500 text-white border-yellow-500 text-extrabold"
                            : "text-[#623903] bg-white hover:bg-yellow-500 px-6 py-3 rounded-md text-[#623903] font-extrabold shadow btn"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addToCart}
                    className="text-[#623903] bg-[#623903] hover:bg-yellow-500 px-6 py-3 rounded-md text-white font-bold shadow btn"
                  >
                    Add to cart
                  </button>

                  {/* Optional deep link */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[#623903] bg-[#623903] hover:bg-yellow-500 px-6 py-3 rounded-md text-white font-bold shadow btn"
                  >
                    View full details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

