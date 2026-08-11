import { Context } from "hono";
import { buildHome } from "../service/home";
import { getGenres } from "../service/genres";
import { renderHomeHtml, renderShellHtml } from "../../dist-ssr/render.js";

// Home content is trending-driven: 5 min shared cache with SWR for CDN misses.
const SSR_CACHE = "public, s-maxage=300, stale-while-revalidate=86400";
const FALLBACK_CACHE = "public, s-maxage=60, stale-while-revalidate=86400";

export async function getHomeSsr(c: Context) {
  try {
    const [home, genres] = await Promise.all([buildHome(), getGenres()]);
    const path = new URL(c.req.url).pathname;
    const html = renderHomeHtml({ path, data: home, genres: genres.genres });
    c.header("Cache-Control", SSR_CACHE);
    return c.html(html);
  } catch (error) {
    console.error("SSR home failed, falling back to SPA shell:", error);
    c.header("Cache-Control", FALLBACK_CACHE);
    return c.html(renderShellHtml());
  }
}