import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { getCurrentUser } from "../../../lib/auth";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const { productId, rating, comment, image, reviewer } = await request.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // productId may be a uuid or a slug.
    const lookup = UUID_RE.test(productId)
      ? admin.from("products").select("id").eq("id", productId)
      : admin.from("products").select("id").eq("slug", productId);

    const { data: product } = await lookup.single();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const user = await getCurrentUser();

    const { error: insertError } = await admin.from("reviews").insert({
      product_id: product.id,
      user_id: user?.id ?? null,
      reviewer: reviewer || user?.name || "Anonymous",
      text: comment,
      rating: Number(rating),
      image: image || "",
    });

    if (insertError) {
      console.error("review insert error:", insertError.message);
      return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
    }

    // Recompute aggregate rating + count.
    const { data: all } = await admin
      .from("reviews")
      .select("rating")
      .eq("product_id", product.id);

    const count = all?.length ?? 0;
    const avg = count
      ? all!.reduce((s, r) => s + (r.rating || 0), 0) / count
      : 0;

    await admin
      .from("products")
      .update({ rating: Math.round(avg * 10) / 10, reviews_count: count })
      .eq("id", product.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
