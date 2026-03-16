import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("tee_store");
        const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Saving Product Payload:", body);
        const client = await clientPromise;
        const db = client.db("tee_store");

        // Basic validation
        if (!body.name || body.supplierPrice === undefined) {
            console.error("Validation Failed: Missing name or supplierPrice");
            return NextResponse.json({ error: "Missing required fields: name and supplierPrice are required." }, { status: 400 });
        }

        const newProduct = {
            ...body,
            title: body.name, // Support schema that uses 'title'
            slug: body.slug || slugify(body.name), // Ensure 'slug' is always present
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // If a product with the same slug already exists, add a random suffix to avoid unique index collision
        const existing = await db.collection("products").findOne({ slug: newProduct.slug });
        if (existing) {
            newProduct.slug = `${newProduct.slug}-${Math.floor(Math.random() * 1000)}`;
        }

        const result = await db.collection("products").insertOne(newProduct);
        return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    } catch (err: any) {
        console.error("POST Error:", err);
        return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({ error: "Missing Product ID" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("tee_store");

        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(_id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("PUT Error:", err);
        return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("tee_store");

        const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("DELETE Error:", err);
        return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
    }
}
