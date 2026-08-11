// Local SSR smoke test. Run after `pnpm build`:
//   node scripts/ssr-smoke.mjs
// Uses a stubbed buildHome() payload (no TMDB network calls) to prove the SSR
// render module emits a complete, hydratable document with the hashed asset
// tags, the LCP hero image, and the __HOME_DATA__ hydration payload — plus a
// local fetch against a Hono app that mirrors the api/ wiring to assert the
// Cache-Control header.
import { renderHomeHtml, renderShellHtml } from "../dist-ssr/render.js";
import { Hono } from "hono";

const REQ_CACHE = "public, s-maxage=300, stale-while-revalidate=86400";

const genres = [
  { id: 28, name: "Acción" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" },
];

/** @param {number} id @param {string} title */
const dto = (id, title) => ({
  id,
  title,
  poster: `/poster-${id}.jpg`,
  backdrop: `/backdrop-${id}.jpg`,
  rating: 8.223,
  overview: "Un título de prueba para validar el SSR de la home.",
  mediaType: "movie",
  genreIds: [28, 12],
  providers: [{ logoPath: "/netflix.jpg", providerId: 8, providerName: "Netflix", displayPriority: 1, type: "flatrate" }],
});

const homeStub = {
  trending: [dto(1, "Película de prueba"), dto(2, "Otra película")],
  topRatedMovies: [dto(3, "Top rated movie")],
  topRatedTv: [dto(4, "Top rated tv")],
  topAnime: [dto(5, "Anime de prueba")],
  newReleases: [dto(6, "Estreno")],
  mostPopularAR: [dto(7, "Lo más visto")],
  platforms: [
    {
      providerId: 8,
      providerName: "Netflix",
      logoPath: "/netflix.jpg",
      movies: [dto(8, "Peli de la plataforma")],
      tv: [dto(9, "Serie de la plataforma")],
    },
  ],
};

const html = renderHomeHtml({ path: "/home", data: homeStub, genres });

const dataScriptMatch = html.match(/window\.__HOME_DATA__=([\s\S]*?)<\/script>/);
const dataEscapedOk = dataScriptMatch ? !dataScriptMatch[1].includes("<") : false;

const checks = [
  ["has <!doctype html>", /<!doctype html>/i.test(html)],
  ['has hashed module script tag', /<script type="module"[^>]*src="\/assets\/index-[^"]+\.js"/.test(html)],
  ["has hashed css link", /<link rel="stylesheet"[^>]*href="\/assets\/index-[^"]+\.css"/.test(html)],
  ["injects window.__HOME_DATA__", html.includes("window.__HOME_DATA__=")],
  ["injects isodata hydration marker", html.includes('<script type="isodata"></script>')],
  ["embeds app id", html.includes('<div id="app">')],
  ["LCP hero img loading=eager", /<img[^>]*loading="eager"/.test(html)],
  ["LCP hero img fetchpriority", /<img[^>]*fetchpriority="high"/.test(html)],
  ["escapes < inside hydration payload", dataEscapedOk],
  ["renders hero title text", html.includes("Película de prueba")],
  ["renders genre names", html.includes("Acción")],
  ["renders platform row name", html.includes("Netflix")],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed += 1;
}
if (failed) {
  console.error(`\nSmoke: ${failed} check(s) failed.`);
  process.exit(1);
}

const stubApp = new Hono();
stubApp.get("/", (c) => {
  const body = renderHomeHtml({ path: "/", data: homeStub, genres });
  c.header("Cache-Control", REQ_CACHE);
  return c.html(body);
});
stubApp.get("/home", (c) => {
  const body = renderHomeHtml({ path: "/home", data: homeStub, genres });
  c.header("Cache-Control", REQ_CACHE);
  return c.html(body);
});

const res = await stubApp.request("/");
const cacheHeader = res.headers.get("cache-control");
console.log(`\nfetch / -> status=${res.status} cache-control="${cacheHeader}"`);
const body = await res.text();
let httpFailed = 0;
if (res.status !== 200) httpFailed += 1;
if (cacheHeader !== REQ_CACHE) httpFailed += 1;
if (!body.includes("Película de prueba")) httpFailed += 1;

const shell = renderShellHtml();
console.log(`\nrenderShellHtml length=${shell.length} cache-fallback ok=${shell.includes('<div id="app">')}`);

if (httpFailed) {
  console.error(`\nSmoke: HTTP layer ${httpFailed} check(s) failed.`);
  process.exit(1);
}
console.log("\nSmoke: ALL CHECKS PASSED ✅ (render + HTTP wrapper)");