// app/api/products/route.ts
import clientPromise from "../../../lib/mongodb"; // adjust path if your lib is elsewhere

type ApiResponse = {
  ok: boolean;
  status?: number;
  message?: string;
  debug?: any;
};

// Small helper to create JSON Responses
function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

export async function GET() {
  const debug: any = { time: new Date().toISOString() };

  try {
    console.log("[api/products] GET invoked", debug.time);

    // quick env check
    const uriSet = !!process.env.MONGODB_URI;
    debug.MONGODB_URI = uriSet ? "present" : "missing";
    console.log("[api/products] NODE_ENV=", process.env.NODE_ENV, "MONGODB_URI present:", uriSet);

    if (!uriSet) {
      const body: ApiResponse = { ok: false, status: 500, message: "Server misconfigured: MONGODB_URI missing", debug };
      return jsonResponse(body, 500);
    }

    // get client
    const client = await clientPromise;
    if (!client) {
      const body: ApiResponse = { ok: false, status: 500, message: "Failed to get MongoClient", debug };
      console.error("[api/products] clientPromise returned falsy");
      return jsonResponse(body, 500);
    }

    const db = client.db(); // database name comes from connection string
    debug.dbName = (db && (db as any).databaseName) || "<unknown>";

    // validate access by listing collections
    let cols: string[] = [];
    try {
      cols = (await db.listCollections().toArray()).map((c: any) => c.name);
      debug.collections = cols;
      console.log("[api/products] collections:", cols);
    } catch (err) {
      console.error("[api/products] listCollections error:", err);
      const body: ApiResponse = {
        ok: false,
        status: 500,
        message: "DB error while listing collections (likely auth / whitelist). See debug.",
        debug,
      };
      return jsonResponse(body, 500);
    }

    const collName = "products";
    if (!cols.includes(collName)) {
      console.warn(`[api/products] collection "${collName}" not found. Returning empty list.`);
      const body = { ok: true, status: 200, message: `Collection "${collName}" not found`, debug, products: [] };
      return jsonResponse(body, 200);
    }

    // fetch raw docs
    const rawProducts = await db.collection(collName).find({}).toArray();
    debug.found = rawProducts.length;
    console.log(`[api/products] found ${rawProducts.length} documents`);

    // map/clean documents for client
    const products = rawProducts.map((d: any) => ({
      id: d._id ? String(d._id) : undefined,
      name: d.name ?? d.title ?? null,
      title: d.title ?? d.name ?? null,
      slug: d.slug ?? null,
      description: d.description ?? null,
      price: typeof d.price === "number" ? d.price : d.price ? Number(d.price) : null,
      imageUrl: d.imageUrl ?? d.image ?? null,
      sizes: Array.isArray(d.sizes) ? d.sizes : [],
      colors: Array.isArray(d.colors) ? d.colors : [],
      category: d.category ?? null,
      inStock: !!d.inStock,
      createdAt: d.createdAt ?? null,
      updatedAt: d.updatedAt ?? null,
      // keep any other small useful fields if desired:
      // metadata: d.metadata ?? null
    }));

    // return the cleaned list (clients expect an array)
    return jsonResponse(products, 200);
  } catch (err) {
    console.error("[api/products] unexpected error:", err);
    const message = err instanceof Error ? err.message : String(err);
    const body: ApiResponse = { ok: false, status: 500, message: "Unexpected server error", debug: { message } };
    return jsonResponse(body, 500);
  }
}
