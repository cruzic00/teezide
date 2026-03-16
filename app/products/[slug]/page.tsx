import { products } from "../../../lib/products"; // Mock data
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCart from "./parts/AddToCart";
import ProductGallery from "../../../components/ProductGallery";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import ProductCard from "../../../components/ProductCard";

type Props = {
  params: {
    slug: string;
  };
};

async function getProduct(slugOrId: string) {
  // 1. Try to find in MongoDB FIRST
  const client = await clientPromise;
  const db = client.db("tee_store");

  let query = {};
  if (ObjectId.isValid(slugOrId)) {
    query = { _id: new ObjectId(slugOrId) };
  } else {
    query = { slug: slugOrId };
  }

  let product: any = await db.collection("products").findOne(query);

  // 2. If not in DB, fallback to local mock
  if (!product) {
    product = products.find((p) => p.slug === slugOrId || p.id === slugOrId);
    // Helper to match mongo shape if needed, but the loop below handles transformation
  }

  if (!product) return null;

  // Fetch related products if any
  let relatedProducts: any[] = [];
  if (product.recommendation && product.recommendation.length > 0) {
    try {
      // Filter out empty strings and invalid IDs just in case
      const recIds = product.recommendation.filter((id: string) => id && ObjectId.isValid(id)).map((id: string) => new ObjectId(id));
      if (recIds.length > 0) {
        const relatedDocs = await db.collection("products").find({ _id: { $in: recIds } }).toArray();
        relatedProducts = relatedDocs.map(p => ({
          id: p._id.toString(),
          name: p.name,
          slug: p.slug || p._id.toString(),
          price: p.price || p.appPrice || 0,
          image: p.imageUrl || "/placeholder.jpg",
          description: p.description || "",
          mrp: p.mrp || 0,
          sizes: p.subCategory === "Shoes" ? ["7", "8", "9", "10"] : ["S", "M", "L", "XL", "XXL"],
          colors: ["Black", "White"], // Default
          rating: p.rating || 0,
          reviews: p.reviewsCount || 0
        }));
      }
    } catch (e) {
      console.error("Error fetching related products", e);
    }
  }

  // Transform to component-friendly format
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug || product._id.toString(),
    description: product.description || `High quality ${product.name}`,
    price: product.price || product.appPrice || 0, // Handle price variations
    image: product.imageUrl || "/placeholder.jpg",
    images: product.images || (product.imageUrl ? [product.imageUrl] : ["/placeholder.jpg"]),
    sizes: product.subCategory === "Shoes" ? ["7", "8", "9", "10"] : ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White"],
    inStock: product.status === "Active",
    aboutItems: product.aboutItems || [],
    reviewsCount: product.reviewsCount || 0,
    rating: product.rating || 0,
    customersSay: product.customersSay,
    replacementPolicy: product.replacementPolicy || "3 days replacement",
    freeDelivery: product.freeDelivery !== false,
    technicalDetails: product.technicalDetails || [],
    recommendation: product.recommendation,
    relatedProducts: relatedProducts
  };
}



import Link from "next/link";
import ReviewForm from "./parts/ReviewForm";

export default async function ProductDetail({ params }: Props) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="grid gap-6 md:grid-cols-2 max-w-7xl mx-auto px-8 py-12">
        {/* IMAGE GALLERY */}
        <div>
          <ProductGallery
            images={product.images && product.images.length > 0 ? product.images : [product.image]}
            productName={product.name}
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {"★".repeat(Math.round(product.rating || 4.5))}{"☆".repeat(5 - Math.round(product.rating || 4.5))}
              </div>
              <span className="text-sm text-neutral-500">{product.reviewsCount || 128} reviews</span>
            </div>

            <div className="text-3xl font-bold text-neutral-900 mb-4">
              ₹{(product.price / 100).toFixed(2)}
            </div>

            <p className="font-medium text-neutral-600 mb-6">{product.description}</p>
          </div>

          {/* CLIENT COMPONENT */}
          <AddToCart product={product as any} />

          {/* BADGES */}
          <div className="flex flex-wrap gap-4 py-4 border-y border-neutral-100">
            {product.freeDelivery && (
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <span className="p-2 bg-neutral-100 rounded-full">🚚</span> Free Delivery
              </div>
            )}
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <span className="p-2 bg-neutral-100 rounded-full">🔄</span> {product.replacementPolicy}
            </div>
          </div>

          {/* ABOUT ITEMS */}
          {product.aboutItems && product.aboutItems.length > 0 && (
            <div>
              <h3 className="font-bold text-neutral-900 mb-2">About this item</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-600">
                {product.aboutItems.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TECHNICAL DETAILS */}
          {product.technicalDetails && product.technicalDetails.length > 0 && (
            <div>
              <h3 className="font-bold text-neutral-900 mb-2">Technical Details</h3>
              <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                {product.technicalDetails.map((detail: any, i: number) => (
                  <div key={i} className="flex justify-between py-1 border-b border-neutral-200 last:border-0">
                    <span className="text-neutral-500">{detail.label}</span>
                    <span className="font-medium text-neutral-900">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 pb-12">
        {/* REVIEWS SECTION */}
        <div className="pt-16 border-t border-neutral-100">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <span className="text-6xl font-black text-neutral-900 tracking-tighter">{(product.rating || 4.5).toFixed(1)}</span>
                <div className="flex flex-col gap-1">
                  <div className="flex text-yellow-400 text-xl tracking-wide">
                    {"★".repeat(Math.round(product.rating || 4.5))}{"☆".repeat(5 - Math.round(product.rating || 4.5))}
                  </div>
                  <span className="text-neutral-500 font-medium">{product.reviewsCount || 1245} verified reviews</span>
                </div>
              </div>
            </div>

            <ReviewForm productId={product.id} />
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.customersSay && product.customersSay.length > 0 ? (
              product.customersSay.map((review: any, i: number) => (
                <div key={i} className="bg-neutral-50 p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-neutral-100 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      {review.image ? (
                        <img src={review.image} alt="User" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-neutral-900 shadow-sm border border-neutral-100">
                          {review.reviewer?.[0] || 'A'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{review.reviewer || "Anonymous"}</p>
                        <div className="text-xs text-neutral-400">Verified Buyer</div>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 text-xs gap-0.5">
                      {"★".repeat(review.rating || 5)}{"☆".repeat(5 - (review.rating || 5))}
                    </div>
                  </div>

                  <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                    "{review.text}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-200/50 pt-4">
                    <span>{new Date(review.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <button className="hover:text-neutral-900 transition-colors opacity-0 group-hover:opacity-100">Helpful?</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                <div className="text-4xl mb-4 opacity-20">💬</div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">No reviews yet</h3>
                <p className="text-neutral-500 max-w-md mx-auto">Be the first to share your thoughts on this product. Your feedback helps others make better choices.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS (Recommendations) */}
      {
        product.relatedProducts && product.relatedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-8 py-12 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight">You Might Also Like</h3>
              <Link href="/products" className="hidden md:block text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-widest border-b border-transparent hover:border-neutral-900 pb-0.5">View All</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {product.relatedProducts.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )
      }
    </>
  );
}
