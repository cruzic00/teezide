import ProductGrid from "../../components/ProductGrid";

export default function AnimePage() {
  return (
    <ProductGrid
      category="anime"
      title="Anime Collection"
      titleClassName="text-4xl font-extrabold text-pink-500 uppercase tracking-tighter"
      titleStyle={{ textShadow: "3px 3px 0 #000" }}
    />
  );
}
