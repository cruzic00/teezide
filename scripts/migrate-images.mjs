// One-time: move base64 product images from the DB into Supabase Storage,
// replacing them with small public URLs (makes pages much faster).
// Usage: node scripts/migrate-images.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || key.includes("PUT_YOUR")) {
  console.error("Missing Supabase URL / service_role key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

function ext(mime) {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("svg")) return "svg";
  return "jpg";
}

async function upload(dataUrl, id, idx) {
  const m = dataUrl.match(/^data:(.+?);base64,(.*)$/s);
  if (!m) return dataUrl;
  const mime = m[1];
  const buf = Buffer.from(m[2], "base64");
  const path = `products/${id}-${idx}-${Date.now()}.${ext(mime)}`;
  const { error } = await supabase.storage.from("media").upload(path, buf, {
    contentType: mime,
    upsert: true,
  });
  if (error) {
    console.error("  upload failed:", error.message);
    return dataUrl;
  }
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, image_url, images");
  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  let migrated = 0;
  for (const p of products ?? []) {
    let changed = false;
    let image_url = p.image_url;
    if (typeof image_url === "string" && image_url.startsWith("data:")) {
      image_url = await upload(image_url, p.id, "main");
      changed = true;
    }
    const images = Array.isArray(p.images) ? p.images : [];
    const newImages = [];
    for (let i = 0; i < images.length; i++) {
      if (typeof images[i] === "string" && images[i].startsWith("data:")) {
        newImages.push(await upload(images[i], p.id, i));
        changed = true;
      } else {
        newImages.push(images[i]);
      }
    }
    if (changed) {
      await supabase.from("products").update({ image_url, images: newImages }).eq("id", p.id);
      migrated++;
      console.log("✓ migrated", p.id);
    }
  }
  console.log(`\nDone. Migrated ${migrated} product(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
