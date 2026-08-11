import { useEffect, useMemo, useState } from "preact/hooks";
import { AudioVisualDto, ProviderWithType } from "@/shared/types";

const STREAM_TYPES = new Set(["flatrate", "free", "ads"]);

export const isStreamProvider = (provider: ProviderWithType): boolean =>
  STREAM_TYPES.has(provider.type);

const TTL_MS = 60 * 60 * 1000;

const BATCH_MAX_ITEMS = 50;

interface CacheEntry {
  data: Record<string, ProviderWithType[]>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function providerKey(movie: AudioVisualDto): string {
  return `${movie.mediaType}:${movie.id}`;
}

export const useProvidersMap = (movies: AudioVisualDto[], enabled = true) => {
  // Providers embedded by the server (search + home payloads). An item with an
  // empty array is a legitimate "no providers" answer and stays in the map so
  // we do not refetch it.
  const embeddedMap = useMemo(() => {
    const map: Record<string, ProviderWithType[]> = {};
    for (const movie of movies) {
      if (Array.isArray(movie.providers)) {
        map[providerKey(movie)] = movie.providers;
      }
    }
    return map;
  }, [movies]);

  const missingKeys = useMemo(() => {
    if (!enabled) return [];
    return movies.filter((movie) => !Array.isArray(movie.providers)).map(providerKey);
  }, [enabled, movies]);

  const batchKey = useMemo(
    () => missingKeys.slice(0, BATCH_MAX_ITEMS).sort().join(","),
    [missingKeys],
  );

  // Single state seeded from the embedded map; fetched results are merged on
  // top. Kept in sync so a props change is reflected immediately.
  const [map, setMap] = useState<Record<string, ProviderWithType[]>>(embeddedMap);

  useEffect(() => {
    setMap(embeddedMap);
  }, [embeddedMap]);

  useEffect(() => {
    // Nothing to fetch: every relevant item already carries embedded providers.
    if (!enabled || movies.length === 0 || missingKeys.length === 0) return;

    const cached = cache.get(batchKey);
    if (cached && Date.now() < cached.expiresAt) {
      setMap((prev) => ({ ...prev, ...cached.data }));
      return;
    }

    let cancelled = false;

    fetch(`/api/providers/batch?items=${encodeURIComponent(batchKey)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ providers: Record<string, ProviderWithType[]> }>;
      })
      .then((json) => {
        if (cancelled) return;
        cache.set(batchKey, { data: json.providers, expiresAt: Date.now() + TTL_MS });
        setMap((prev) => ({ ...prev, ...json.providers }));
      })
      .catch(() => {
        if (cancelled) return;
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, movies.length, missingKeys, batchKey]);

  if (!enabled || movies.length === 0) return {};
  if (missingKeys.length === 0) return embeddedMap;

  return map;
};
