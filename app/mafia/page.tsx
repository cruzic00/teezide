import ProductGrid from "../../components/ProductGrid";

export default function MafiaPage() {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <ProductGrid
        category="mafia"
        title="The Syndicate"
        subtitle={'"It\'s not personal. It\'s strictly fashion."'}
        titleClassName="text-4xl font-extrabold text-black uppercase tracking-widest text-center"
        titleStyle={{ textShadow: "4px 4px 0 #991b1b", fontFamily: "'Courier New', Courier, monospace" }}
      />
    </div>
  );
}
