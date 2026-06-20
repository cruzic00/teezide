// components/ProductGrid.tsx
// Server component: fetches products (optionally by category) and renders a grid.
import ProductCard from "./ProductCard";
import { getProducts } from "../lib/products-db";

type Props = {
  title: string;
  subtitle?: string;
  category?: string;
  emptyText?: string;
};

export default async function ProductGrid({
  title,
  subtitle,
  category,
  emptyText = "No products here yet. Check back soon.",
}: Props) {
  const products = await getProducts(category ? { category } : {});

  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="max-w-[1600px] mx-auto px-5 lg:px-10 pt-3 pb-10 grid gap-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#623903]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-500 mt-3">{subtitle}</p>
          )}
        </div>

        {products.length === 0 ? (
          <p className="text-neutral-400 text-center py-16">{emptyText}</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
