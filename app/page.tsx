// app/page.tsx — server component. Content is driven by /admin/customization.
import Link from "next/link";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/products-db";
import { getHomeSettings, type SectionBlock, type BannerBlock } from "../lib/settings";

function productsForSource(all: any[], source: string) {
  if (source === "trending") return all.filter((p) => p.trending);
  return all.filter((p) => (p.category || "").toLowerCase() === source.toLowerCase());
}

function ProductSection({ block, products }: { block: SectionBlock; products: any[] }) {
  return (
    <div className="p-6 space-y-10 pt-14">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-primary">
          {block.title}
        </h2>
        <div className="w-24 h-1 bg-accent mx-auto" />
        {block.subtitle && (
          <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">{block.subtitle}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-neutral-400">No products yet.</p>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p as any} />)
        )}
      </div>
    </div>
  );
}

function BannerBlockView({ block }: { block: BannerBlock }) {
  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[30vh] min-h-[220px] overflow-hidden bg-black">
      {block.mediaType === "video" ? (
        <video src={block.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.mediaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">{block.title}</h2>
        {block.subtitle && (
          <p className="mt-3 text-xs md:text-sm text-white/80 tracking-[0.3em] uppercase">{block.subtitle}</p>
        )}
        <Link
          href="/products"
          className="mt-6 px-8 py-3 bg-white text-black text-sm font-black uppercase tracking-widest hover:bg-accent transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}

export default async function Home() {
  const [all, settings] = await Promise.all([getProducts(), getHomeSettings()]);

  const heroSlide = {
    type: settings.hero.mediaType,
    src: settings.hero.mediaUrl,
    title: settings.hero.title,
    subtitle: settings.hero.subtitle,
  };

  return (
    <main className="space-y-10">
      <Banner slides={[heroSlide]} />

      {settings.blocks.map((block) =>
        block.kind === "banner" ? (
          <BannerBlockView key={block.id} block={block} />
        ) : (
          <ProductSection
            key={block.id}
            block={block}
            products={productsForSource(all, block.source)}
          />
        )
      )}
    </main>
  );
}
