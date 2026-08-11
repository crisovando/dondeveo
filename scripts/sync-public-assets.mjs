// Syncs build assets into public/ so `vercel dev` serves them as real static
// files with the correct MIME types. `vercel dev` uses the Vite dev middleware,
// which does NOT serve dist/assets/ as static files: /assets/*.js and
// /assets/*.css requests fall through to the SPA fallback (text/html), so the
// browser refuses the module script and the SSR'd home breaks.
// In production the built assets are served from dist/ as the static output,
// so this script only affects local development. Run after `pnpm build`.
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const distAssets = join(root, "dist", "assets");
const publicDir = join(root, "public");
const publicAssets = join(publicDir, "assets");

if (!existsSync(distAssets)) {
  console.error("sync-public-assets: dist/assets not found. Run `pnpm build` first.");
  process.exit(1);
}

await rm(publicAssets, { recursive: true, force: true });
await mkdir(publicAssets, { recursive: true });
await cp(distAssets, publicAssets, { recursive: true });

// The PWA manifest is referenced as /manifest.webmanifest from the built HTML.
const distManifest = join(root, "dist", "manifest.webmanifest");
if (existsSync(distManifest)) {
  await cp(distManifest, join(publicDir, "manifest.webmanifest"));
}

console.log(`sync-public-assets: copied dist/assets -> public/assets`);
