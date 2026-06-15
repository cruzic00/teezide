import ProductGrid from "../../components/ProductGrid";

export default function GymPage() {
  return (
    <ProductGrid
      category="gym"
      title="Gym Essentials"
      titleClassName="text-4xl font-extrabold text-slate-800 uppercase tracking-tighter"
      titleStyle={{ textShadow: "3px 3px 0 #cbd5e1" }}
    />
  );
}
