"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function GymPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/gym")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch gym products", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Gym Essentials...</div>;

    return (
        <section className="p-6 grid gap-6">
            <h2
                className="text-4xl font-extrabold text-slate-800 uppercase tracking-tighter"
                style={{
                    textShadow: "3px 3px 0 #cbd5e1",
                }}
            >
                Gym Essentials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-11">
                {products.map((p: any) => {
                    // Normalize data to match ProductCard expectations
                    const normalized = {
                        id: p._id || p.id,
                        slug: p.slug,
                        image: p.imageUrl || p.image || "/placeholder.png",
                        name: p.title || p.name,
                        price: p.price,
                        sizes: p.sizes || ["S", "M", "L", "XL"],
                        ...p,
                    };

                    return <ProductCard key={normalized.id} product={normalized} />;
                })}
            </div>
        </section>
    );
}
