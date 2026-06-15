// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";

// Matches the mapped product shape (supports both new and legacy field names).
type CardProduct = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  slug: string;
  price: number; // in paisa
  imageUrl?: string;
  image?: string;
  category?: string;
};

export default function ProductCard({ product }: { product: CardProduct }) {
  const href = `/products/${product.slug || product._id || product.id}`;
  const img = product.imageUrl || product.image || "/placeholder.png";
  const name = product.title || product.name || "Product";

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden bg-white rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={img}
          alt={name}
          width={800}
          height={1000}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="mt-4 flex justify-between items-start px-1 pb-2">
        <div>
          <h3 className="text-base font-medium text-primary leading-tight group-hover:text-accent transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
            {product.category || "T-shirt"}
          </p>
        </div>
        <p className="text-base font-bold text-primary whitespace-nowrap">
          ₹{(product.price / 100).toFixed(0)}
        </p>
      </div>
    </Link>
  );
}
