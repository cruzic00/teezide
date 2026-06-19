import ProductGrid from "../../components/ProductGrid";

export default function OfficePage() {
  return (
    <ProductGrid
      category="office"
      title="Office Collection"
      subtitle="Dress for the job you want."
      titleClassName="text-4xl font-extrabold text-[#7a4a05] uppercase tracking-tight text-center mx-auto pb-2"
      titleStyle={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    />
  );
}
