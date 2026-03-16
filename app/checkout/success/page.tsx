"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "../../../lib/cart";

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { items, clear, total } = useCart();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Prevent double-execution in strict mode or re-renders
        let mounted = true;

        async function saveOrder() {
            // If we have items in cart, save them as an order
            // Note: In a real production app with Stripe, we would rely on the webhook.
            // But for this request ("save on backend"), we do it here client-side for immediate feedback
            // assuming the user was redirected here after a successful payment.

            if (items.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items,
                        totalAmount: total / 100, // Convert paisa to rupees if stored as rupees
                        paymentId: sessionId || "stripe-session",
                    }),
                });

                if (!res.ok) throw new Error("Failed to save order");

                clear(); // Clear local cart
            } catch (err) {
                console.error(err);
                // Don't show error to user if it's just a duplicate or network glitch, 
                // but ideally we handle this better.
                setError("Your payment was successful, but we had trouble saving the order details. Please contact support.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        if (items.length > 0) {
            saveOrder();
        } else {
            setLoading(false);
        }

        return () => { mounted = false; };
    }, [sessionId]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-yellow-500" size={48} />
                    <p className="text-xl font-bold">Processing your order...</p>
                </div>
            ) : (
                <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center animate-in zoom-in duration-300">
                    <CheckCircle className="text-green-500 w-20 h-20 mb-6" />

                    <h1 className="text-3xl font-black mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8">
                        Thank you for your purchase. We have received your order and it will be processed shortly.
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 w-full">
                        <Link
                            href="/orders"
                            className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-neutral-800 transition shadow-lg"
                        >
                            View My Orders
                        </Link>
                        <Link
                            href="/"
                            className="w-full py-3 bg-gray-100 text-black font-bold rounded-lg hover:bg-gray-200 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
