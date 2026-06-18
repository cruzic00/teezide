// components/ProductGrid.tsx
// Server component: fetches products (optionally by category) and renders a grid.
import ProductCard from "./ProductCard";
import { getProducts } from "../lib/products-db";

type Props = {
  title: string;
  subtitle?: string;
  category?: string;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  emptyText?: string;
};

export default async function ProductGrid({
  title,
  subtitle,
  category,
  titleClassName = "text-2xl font-extrabold text-primary",
  titleStyle,
  emptyText = "No products here yet. Check back soon.",
}: Props) {
  const products = await getProducts(category ? { category } : {});

  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="max-w-[1600px] mx-auto px-5 lg:px-10 py-10 grid gap-6">
        <h2 className={titleClassName} style={titleStyle}>
          {title}
        </h2>

        {subtitle && (
          <p className="text-center text-neutral-500 -mt-2">{subtitle}</p>
        )}

        {products.length === 0 ? (
          <p className="text-neutral-400 text-center py-16">{emptyText}</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
