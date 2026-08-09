import { fetchTMDB } from "./tmdbFetch";
import { ProvidersResponse } from "../types/tmdb-item-detail";
import { ProviderWithType } from "../../src/shared/types";
import { mapWatchProviders } from "../utils/mappers";

const SUPPORTED_TYPES = new Set(["movie", "tv"]);

const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_CONCURRENCY = 4;

interface CacheEntry {
  providers: ProviderWithType[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export interface MediaRef {
  type: string;
  id: number;
}

function cacheKey(type: string, id: number): string {
  return `${type}:${id}`;
}

function readCache(type: string, id: number): CacheEntry | null {
  const entry = cache.get(cacheKey(type, id));
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(cacheKey(type, id));
    return null;
  }
  return entry;
}

async function fetchOne(type: string, id: number): Promise<CacheEntry> {
  const cached = readCache(type, id);
  if (cached) return cached;

  const providers = await fetchTMDB<ProvidersResponse>(
    `/${type}/${id}/watch/providers`,
  );
  const entry = {
    providers: mapWatchProviders(providers),
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  cache.set(cacheKey(type, id), entry);
  return entry;
}

async function runPooled(
  items: MediaRef[],
  workers: Array<Promise<void>>,
): Promise<void> {
  await Promise.all(workers);
}

export async function getWatchProviders(
  type: string,
  id: number,
): Promise<ProviderWithType[]> {
  if (!SUPPORTED_TYPES.has(type)) return [];
  const entry = await fetchOne(type, id);
  return entry.providers;
}

export async function getWatchProvidersBatched(
  items: MediaRef[],
): Promise<Record<string, ProviderWithType[]>> {
  const deduped = new Map<string, MediaRef>();
  for (const item of items) {
    if (!SUPPORTED_TYPES.has(item.type)) continue;
    deduped.set(cacheKey(item.type, item.id), item);
  }

  const todo = [...deduped.values()];
  const result: Record<string, ProviderWithType[]> = {};

  for (let i = 0; i < todo.length; i += MAX_CONCURRENCY) {
    let chunk = todo.slice(i, i + MAX_CONCURRENCY);
    const workerChunks: Promise<void>[] = chunk.map(async (item) => {
      try {
        const entry = await fetchOne(item.type, item.id);
        result[cacheKey(item.type, item.id)] = entry.providers;
      } catch {
        result[cacheKey(item.type, item.id)] = [];
      }
    });
    await runPooled(chunk, workerChunks);
  }

  return result;
}