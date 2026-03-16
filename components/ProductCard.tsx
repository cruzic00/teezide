// components/ProductCard.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../lib/cart";
import { useAuth } from "../app/context/AuthContext";

// This shape matches your MongoDB documents
type CardProduct = {
  _id: string;
  title: string;
  slug: string;
  price: number;          // in rupees, e.g. 499
  imageUrl: string;
  sizes?: string[];
  category?: string;
};

export default function ProductCard({ product }: { product: CardProduct }) {
  const { addItem } = useCart();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
  const [selSize, setSelSize] = useState<string>(sizes[0]);

  // Handle Add to Cart Click
  const handleAddToCartClick = () => {
    // If we're still loading the user session, don't redirect yet
    // Just ignore the click or show a spinner (ProductCard doesn't have local loading state for auth check)
    // But importantly, do NOT redirect to login if loading is true.
    if (loading) return;

    if (!user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    setOpen(true);
  };

  // Local cart only (MongoDB backend; no Supabase)
  const addToCartLocal = () => {
    addItem({
      id: product._id ?? product.slug,
      name: product.title,
      price: product.price,         // already in rupees
      image: product.imageUrl,
      size: selSize,
    });
    setOpen(false);
  };

  return (
    <motion.div
      className="group relative block overflow-hidden bg-white rounded-xl transition-shadow hover:shadow-2xl"
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      {/* Image Container */}
      <div className="block relative aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => router.push(`/products/${product.slug || product._id}`)}>
        <div
          className="h-full w-full"
        >
          <Image
            src={product.imageUrl}
            alt={product.title || (product as any).name || "Product"}
            width={800}
            height={1000}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Floating Quick Add Button */}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCartClick();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-white/90 py-3 text-sm font-bold uppercase tracking-wider text-black backdrop-blur-md shadow-lg hover:bg-black hover:text-white transition-all"
          >
            Add to Bag
          </motion.button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-4 flex justify-between items-start px-1">
        <div>
          <h3 className="text-base font-medium text-primary leading-tight group-hover:text-accent transition-colors">
            <Link href={`/products/${product.slug || product._id}`}>
              {product.title || (product as any).name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">{product.category || "T-shirt"}</p>
        </div>
        <p className="text-base font-bold text-primary">
          ₹{(product.price / 100).toFixed(0)}
        </p>
      </div>

      {/* Modal is unchanged, just kept conditionally rendered at the end */}
      {
        open && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
            <div className="w-[92vw] max-w-4xl bg-white text-black rounded-2xl p-5 relative overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.title || (product as any).name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{product.title || (product as any).name}</h2>
                    <p className="mt-2 text-2xl font-medium text-gray-900">
                      ₹{(product.price / 100).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">Select Size</span>
                      {/* <span className="text-sm text-gray-500 underline">Size Guide</span> */}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelSize(s)}
                          className={`flex items-center justify-center rounded-md border py-3 text-sm font-medium transition-all ${selSize === s
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-900 hover:border-gray-900"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      type="button"
                      onClick={addToCartLocal}
                      className="w-full rounded-full bg-black py-4 text-sm font-bold text-white shadow-md hover:bg-gray-800 transition-colors"
                    >
                      Add to Cart - ₹{(product.price / 100).toFixed(2)}
                    </button>

                    <Link
                      href={`/products/${product.slug || product._id}`}
                      className="w-full text-center rounded-full border border-gray-300 py-4 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </motion.div>
  );
}
