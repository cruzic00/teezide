"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function OfficePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/office")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch office products", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Professional Gear...</div>;

    return (
        <section className="p-6 grid gap-6">
            <h2
                className="text-4xl font-extrabold text-neutral-800 uppercase tracking-tight text-center border-b-4 border-neutral-300 inline-block mx-auto pb-2"
                style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif"
                }}
            >
                Office Collection
            </h2>

            <p className="text-center text-neutral-500 mb-6">Dress for the job you want.</p>

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
