import { NextResponse } from "next/server";

export async function GET() {
    const officeProducts = [
        {
            _id: "office-1",
            title: "The CEO Polo",
            slug: "ceo-polo",
            description: "Comfort meets command. Perfect for casual Fridays.",
            price: 189900,
            imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
            sizes: ["S", "M", "L", "XL", "XXL"],
        },
        {
            _id: "office-2",
            title: "Deadline Oxford",
            slug: "deadline-oxford",
            description: "Crisp, clean, and ready for the presentation.",
            price: 219900,
            imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
            sizes: ["S", "M", "L", "XL"],
        },
        {
            _id: "office-3",
            title: "Startup Henley",
            slug: "startup-henley",
            description: "For the disruption innovators.",
            price: 139900,
            imageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d8c92306?auto=format&fit=crop&q=80&w=800",
            sizes: ["S", "M", "L", "XL"],
        },
        {
            _id: "office-4",
            title: "Work-Life Balance Tee",
            slug: "work-life-balance-tee",
            description: "Soft cotton reminding you to log off at 5 PM.",
            price: 99900,
            imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800",
            sizes: ["S", "M", "L", "XL", "XXL"],
        },
    ];

    return NextResponse.json(officeProducts);
}
