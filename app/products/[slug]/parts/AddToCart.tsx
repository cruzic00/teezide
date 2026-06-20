"use client";

import { useState } from "react";
import { useCart } from "../../../../lib/cart";
import type { Product } from "../../../../lib/products";
import { useToast } from "../../../../components/ToastProvider";
import { useAuth } from "../../../../app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [size, setSize] = useState(product.sizes[0]);

  const { user, loading } = useAuth();
  const router = useRouter();
  // Since this is inside a product page, redirect back to current page
  // We can just use window.location.pathname or assume we are on product page

  const handleAddToCart = () => {
    if (loading) return;

    if (!user) {
      // Redirect to login with proper return url
      const returnUrl = window.location.pathname;
      router.push(`/login?redirect=${returnUrl}`);
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      size,
    });

    showToast("T-shirt added to cart");
  };

  return (
    <div className="grid gap-4">
      <div className="font-semibold">Choose size</div>

      <div className="flex gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`px-4 py-2 rounded-lg border font-bold transition
              ${s === size
                ? "bg-yellow-500 text-[#623903]"
                : "bg-white text-[#623903] hover:bg-yellow-100"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-[#623903] hover:bg-yellow-500 text-white hover:text-[#623903] px-6 py-3 rounded-md font-bold transition"
      >
        Add to cart
      </button>
    </div>
  );
}
