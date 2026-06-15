import ProductGrid from "../../components/ProductGrid";

export default function CollegePage() {
  return (
    <ProductGrid
      category="college"
      title="College Collection"
      titleClassName="text-4xl font-extrabold text-blue-900 uppercase tracking-tighter"
      titleStyle={{ textShadow: "2px 2px 0 #fbbf24" }}
    />
  );
}
