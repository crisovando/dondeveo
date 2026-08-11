import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { locationStub } from "preact-iso/prerender";

import rawTemplate from "../../dist/index.html?raw";
import type { AudioVisualDto, Genres, HomeData, PlatformRow } from "@/shared/types";
import { homeDataSignal } from "@/hooks/useHomeData";
import { AppSsr } from "./App";

export interface SsrHomeParams {
  path: string;
  data: HomeData;
  genres: Genres[];
}

const APP_MARKER = `<div id="app">`;
const APP_CLOSE = `</div>`;

function mapGenres(genreIds: number[] | undefined, genres: Genres[]): Genres[] {
  return (genreIds ?? [])
    .map((id) => genres.find((genre) => genre.id === id))
    .filter((genre): genre is Genres => Boolean(genre));
}

// Mirrors the client-side mapping in src/hooks/useHomeData.ts so the genres
// embedded in __HOME_DATA__ (and rendered into the SSR markup) are identical to
// what the JS-only client fetch path produces.
function mapDtos(dtos: AudioVisualDto[], genres: Genres[]): AudioVisualDto[] {
  return dtos.map((dto) => ({ ...dto, genres: mapGenres(dto.genreIds, genres) }));
}

function mapPlatformRows(rows: PlatformRow[], genres: Genres[]): PlatformRow[] {
  return rows.map((row) => ({ ...row, movies: mapDtos(row.movies, genres), tv: mapDtos(row.tv, genres) }));
}

function mapHomeData(data: HomeData, genres: Genres[]): HomeData {
  return {
    ...data,
    trending: mapDtos(data.trending, genres),
    topRatedMovies: mapDtos(data.topRatedMovies, genres),
    topRatedTv: mapDtos(data.topRatedTv, genres),
    topAnime: mapDtos(data.topAnime, genres),
    newReleases: mapDtos(data.newReleases, genres),
    mostPopularAR: mapDtos(data.mostPopularAR, genres),
    platforms: mapPlatformRows(data.platforms, genres),
  };
}

// Same mechanism as preact-iso's locationStub(): give the Router a static
// `location` global during SSR so it resolves the requested path deterministically.
function stubLocationForSsr(path: string) {
  const url = new URL(path, "http://dondeveo.local");
  const stub = {
    origin: url.origin,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    href: url.href,
  };
  try {
    locationStub(path);
  } catch {
    try {
      (globalThis as unknown as { location: unknown }).location = stub;
    } catch {
      Object.defineProperty(globalThis, "location", {
        value: stub,
        configurable: true,
        writable: true,
      });
    }
  }
}

function injectSsrMarkup(appHtml: string, homeDataScript: string): string {
  const openIdx = rawTemplate.indexOf(APP_MARKER);
  const bodyIdx = rawTemplate.indexOf("</body>");
  if (openIdx === -1 || bodyIdx === -1) return rawTemplate;

  const contentStart = openIdx + APP_MARKER.length;
  const closeIdx = rawTemplate.lastIndexOf(APP_CLOSE, bodyIdx);
  if (closeIdx < contentStart) return rawTemplate;

  const head = rawTemplate.slice(0, contentStart);
  const tail = rawTemplate.slice(closeIdx);

  return (
    head +
    appHtml +
    tail +
    `<script>window.__HOME_DATA__=${homeDataScript}</script>` +
    `<script type="isodata"></script>\n`
  );
}

export function renderHomeHtml({ path, data, genres }: SsrHomeParams): string {
  const mapped = mapHomeData(data, genres);
  homeDataSignal.value = mapped;
  stubLocationForSsr(path);

  const appHtml = renderToString(h(AppSsr, {}));
  const serialized = JSON.stringify(mapped).replace(/</g, "\\u003c");

  return injectSsrMarkup(appHtml, serialized);
}

// Full empty shell (the app boots client-side) — used as the degraded fallback
// when TMDb/edge upstreams fail, so the SPA error path can still render.
export function renderShellHtml(): string {
  return rawTemplate;
}