import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { products } from '../../../lib/products';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Received review submission:", body);
        const { productId, rating, comment, image, reviewer } = body;

        if (!productId || !rating || !comment) {
            console.log("Missing fields:", { productId, rating, comment });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("tee_store");

        // Create the new review object
        const newReview = {
            text: comment,
            reviewer: reviewer || "Anonymous",
            image: image || "",
            rating: Number(rating),
            createdAt: new Date()
        };

        // Review query logic
        let query = {};
        if (ObjectId.isValid(productId)) {
            query = { _id: new ObjectId(productId) };
        } else {
            query = { slug: productId };
        }

        // Try to update existing product
        const result = await db.collection("products").updateOne(
            query,
            { $push: { customersSay: newReview } as any }
        );

        // If product not found in DB, check mock data and seed it
        if (result.matchedCount === 0) {
            console.log("Product not found in DB, checking mock data...");
            const mockProduct = products.find(p => p.id === productId || p.slug === productId);

            if (mockProduct) {
                console.log("Found in mock data, migrating to DB...");
                // Create new product entry from mock data
                const newProductEntry = {
                    ...mockProduct,
                    customersSay: [newReview],
                    rating: Number(rating),
                    reviewsCount: 1,
                    // Ensure _id is handled if needed, or let Mongo generate one
                    // We keep usage of existing ID structure if possible, but Mongo needs ObjectId usually
                    // If mock ID is string, we store it as 'slug' or separate field, but _id will be new ObjectId
                };

                // Remove the string 'id' to avoid conflict if we want mongo to gen _id, or rename it
                // But for consistency we can keep 'id' as 'slug' or custom field

                await db.collection("products").insertOne(newProductEntry);
                return NextResponse.json({ success: true, review: newReview, migrated: true });
            }

            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Recalculate average rating if it was an update
        const product = await db.collection("products").findOne(query);

        if (product && product.customersSay) {
            const totalReviews = product.customersSay.length;
            const totalRating = product.customersSay.reduce((acc: number, cur: any) => acc + (cur.rating || 0), 0);
            const averageRating = totalRating / totalReviews;

            await db.collection("products").updateOne(
                query,
                {
                    $set: {
                        rating: averageRating,
                        reviewsCount: totalReviews
                    }
                }
            );
        }

        return NextResponse.json({ success: true, review: newReview });

    } catch (error) {
        console.error("Error submitting review:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
