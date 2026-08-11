// Emits dist-ssr/render.d.ts so TypeScript treats the generated edge SSR module
// as typed JS (avoids checkJs noise on the bundler output). Runs after the SSR
// vite build, which empties dist-ssr.
import { writeFileSync } from "node:fs";

const declaration = `import type { Genres, HomeData } from "../src/shared/types";

export interface SsrHomeParams {
  path: string;
  data: HomeData;
  genres: Genres[];
}

export function renderHomeHtml(params: SsrHomeParams): string;
export function renderShellHtml(): string;
`;

writeFileSync("dist-ssr/render.d.ts", declaration, "utf8");
console.log("Wrote dist-ssr/render.d.ts");