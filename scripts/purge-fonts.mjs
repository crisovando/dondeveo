import { readFileSync, writeFileSync, readdirSync, unlinkSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = join(root, "dist", "index.html");

// Google Fonts css2 serves every subset (latin, latin-ext, vietnamese, cyrillic,
// greek...) as separate @font-face blocks. This site only renders latin text, so
// we strip the other faces and their now-orphaned files to cut font weight and
// the style/layout work of evaluating unused @font-face rules.
const html = readFileSync(htmlPath, "utf8");
const faces = html.match(/@font-face\s*\{[\s\S]*?\}/g) ?? [];

const latin = faces.filter((face) => /unicode-range:\s*U\+0000-00FF/.test(face));
if (latin.length === 0) {
  throw new Error("purge-fonts: no latin @font-face found; aborting to avoid a broken CSS");
}

const purged = html.replace(/@font-face\s*\{[\s\S]*?\}(?=\s*@font-face|\s*<\/style>|\s*$)/g, (match) =>
  latin.includes(match) ? match : "",
);

const usedFiles = new Set([...purged.matchAll(/url\([^)]*?\/([^/)]+\.woff2)\)/g)].map((m) => m[1]));
const assetsDir = join(root, "dist", "assets");
let removedBytes = 0;
let removedCount = 0;
for (const file of readdirSync(assetsDir)) {
  if (!file.endsWith(".woff2") || usedFiles.has(file)) continue;
  removedBytes += statSync(join(assetsDir, file)).size;
  unlinkSync(join(assetsDir, file));
  removedCount++;
}

writeFileSync(htmlPath, purged);
console.log(
  `purge-fonts: ${faces.length} -> ${latin.length} faces, removed ${removedCount} files (${(removedBytes / 1024).toFixed(0)} KiB)`,
);
