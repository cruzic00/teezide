// app/api/seed/route.ts
import clientPromise from "../../../lib/mongodb";

const SAMPLE_PRODUCTS = [
  { slug: "tee-1", title: "Tee 1", price: 499, description: "Basic tee" },
  { slug: "tee-2", title: "Tee 2", price: 699, description: "Premium tee" },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const coll = db.collection("products");

    // Insert only if empty
    const count = await coll.countDocuments();
    if (count === 0) {
      await coll.insertMany(SAMPLE_PRODUCTS.map(p => ({ ...p, createdAt: new Date() })));
      return new Response(JSON.stringify({ ok: true, inserted: SAMPLE_PRODUCTS.length }), { status: 201, headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ ok: false, message: "Already seeded", count }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    console.error("GET /api/seed error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", message: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
