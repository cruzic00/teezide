"use client";

import Link from "next/link";
import { useCart } from "../../lib/cart";
import CheckoutButton from "../../components/CheckoutButton";
import RecentlyViewed from "../../components/RecentlyViewed";

export default function CartPage() {
  const { items, total, removeItem, updateQty, clear } = useCart();
  const hasItems = items.length > 0;

  return (
    <section className="grid gap-6">
      <h2 className="text-4xl font-bold">Your Cart</h2>

      {!hasItems && (
        <div className="text-center grid gap-4">
          <p className="text-neutral-400">Your cart is empty</p>
          <Link href="/" className="underline">
            Go shopping
          </Link>
        </div>
      )}

      {hasItems && (
        <>
          <ul className="grid gap-3">
            {items.map((it) => (
              <li key={`${it.id}-${it.size}`} className="flex gap-4">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-16 h-16 rounded object-cover"
                />

                <div>
                  <div className="font-bold">{it.name}</div>
                  <div>Size: {it.size}</div>
                  <div>₹{(it.price / 100).toFixed(2)}</div>
                </div>

                <div className="ml-auto flex gap-2 items-center">
                  <button onClick={() => updateQty(it.id, it.size, it.qty - 1)}>
                    -
                  </button>
                  <span>{it.qty}</span>
                  <button onClick={() => updateQty(it.id, it.size, it.qty + 1)}>
                    +
                  </button>

                  <button onClick={() => removeItem(it.id, it.size)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center">
            <div className="font-bold">
              Total: ₹{(total / 100).toFixed(2)}
            </div>

            <CheckoutButton />
          </div>

          <button
            onClick={clear}
            className="text-sm underline text-right"
          >
            Clear cart
          </button>
        </>
      )}

      <RecentlyViewed />
    </section>
  );
}
