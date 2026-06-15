// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getProducts, getProductBySlug } from "../../../lib/products-db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const category = searchParams.get("category") ?? undefined;

  try {
    if (slug) {
      const product = await getProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const products = await getProducts(category ? { category } : {});
    return NextResponse.json(products);
  } catch (err) {
    console.error("[api/products] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
