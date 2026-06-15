// app/products/page.tsx — server component, reads from Supabase.
import ProductGrid from "../../components/ProductGrid";

export default function ProductsPage() {
  return (
    <ProductGrid
      title="NEW ARRIVALS"
      titleClassName="text-2xl font-extrabold text-yellow-500"
      titleStyle={{ textShadow: "2px 2px 0 #000, 4px 4px 0 #4e4d4f, 6px 6px 0 #c5c5c5" }}
    />
  );
}
