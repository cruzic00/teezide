import ProductGrid from "../../../components/ProductGrid";

export default async function DynamicCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const pretty = decodeURIComponent(category);
  const title = pretty.charAt(0).toUpperCase() + pretty.slice(1);

  return (
    <ProductGrid
      category={pretty}
      title={`${title} Collection`}
      titleClassName="text-4xl font-extrabold text-primary uppercase tracking-tighter text-center"
    />
  );
}
