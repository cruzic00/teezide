// lib/settings.ts
// Home-page CMS settings (editable from /admin/customization).
// Home content = a top hero + an ordered list of blocks (sections or banners).
import { createClient } from "./supabase/server";

export type Media = {
  mediaType: "image" | "video";
  mediaUrl: string;
  title: string;
  subtitle: string;
};

export type SectionBlock = {
  id: string;
  kind: "section";
  title: string;
  subtitle: string;
  source: string; // "trending" or a category slug
};

export type BannerBlock = {
  id: string;
  kind: "banner";
  mediaType: "image" | "video";
  mediaUrl: string;
  title: string;
  subtitle: string;
};

export type Block = SectionBlock | BannerBlock;

export type HomeSettings = {
  hero: Media;
  blocks: Block[];
};

export const DEFAULT_HERO: Media = {
  mediaType: "video",
  mediaUrl: "/media/hero.mp4",
  title: "New Drop Is Live",
  subtitle: "Watch the lookbook",
};

export const DEFAULT_BLOCKS: Block[] = [
  { id: "trending", kind: "section", title: "Trending Now", subtitle: "Curated top picks for you", source: "trending" },
  { id: "vibe", kind: "banner", mediaType: "video", mediaUrl: "/media/hero.mp4", title: "Wear The Vibe", subtitle: "Premium drops · Limited stock" },
  { id: "tshirts", kind: "section", title: "T-Shirts", subtitle: "Everyday essentials", source: "tshirt" },
];

export const DEFAULT_SETTINGS: HomeSettings = { hero: DEFAULT_HERO, blocks: DEFAULT_BLOCKS };

// Builds the blocks list, migrating from the older {sections, vibe} shape if needed.
export function normalizeBlocks(d: any): Block[] {
  if (Array.isArray(d?.blocks) && d.blocks.length) return d.blocks;

  if (Array.isArray(d?.sections) && d.sections.length) {
    const sections: Block[] = d.sections.map((s: any) => ({ ...s, kind: "section" }));
    const vibe: Block = d.vibe
      ? { id: "vibe", kind: "banner", ...d.vibe }
      : (DEFAULT_BLOCKS[1] as Block);
    return [sections[0], vibe, ...sections.slice(1)].filter(Boolean);
  }

  return DEFAULT_BLOCKS;
}

export function normalizeSettings(d: any): HomeSettings {
  return {
    hero: { ...DEFAULT_HERO, ...(d?.hero ?? {}) },
    blocks: normalizeBlocks(d),
  };
}

export async function getHomeSettings(): Promise<HomeSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .single();
    return normalizeSettings(data?.data ?? {});
  } catch {
    return DEFAULT_SETTINGS;
  }
}
