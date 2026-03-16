"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function MafiaPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/mafia")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch mafia products", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center">Loading The Family Collection...</div>;

    return (
        <section className="p-6 grid gap-6 bg-neutral-100 min-h-screen">
            <h2
                className="text-4xl font-extrabold text-black uppercase tracking-widest text-center"
                style={{
                    textShadow: "4px 4px 0 #991b1b", // Black text with deep red shadow
                    fontFamily: "'Courier New', Courier, monospace" // Typewriter style for that 'file' look
                }}
            >
                The Syndicate
            </h2>

            <p className="text-center text-neutral-600 mb-6 italic">"It's not personal. It's strictly fashion."</p>

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
