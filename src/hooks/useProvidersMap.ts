import { useEffect, useMemo, useState } from "preact/hooks";
import { AudioVisualDto, ProviderWithType } from "@/shared/types";

const STREAM_TYPES = new Set(["flatrate", "free", "ads"]);

export const isStreamProvider = (provider: ProviderWithType): boolean =>
  STREAM_TYPES.has(provider.type);

const TTL_MS = 60 * 60 * 1000;

interface CacheEntry {
  data: Record<string, ProviderWithType[]>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function keyFor(movies: AudioVisualDto[]): string {
  return movies
    .map((m) => `${m.mediaType}:${m.id}`)
    .sort()
    .join(",");
}

export const useProvidersMap = (movies: AudioVisualDto[]) => {
  const [map, setMap] = useState<Record<string, ProviderWithType[]>>(() => {
    const key = keyFor(movies);
    const entry = cache.get(key);
    if (entry && Date.now() < entry.expiresAt) return entry.data;
    return {};
  });

  const key = useMemo(() => keyFor(movies), [movies]);

  useEffect(() => {
    if (movies.length === 0) return;

    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      setMap(cached.data);
      return;
    }

    let cancelled = false;

    fetch(`/api/providers/batch?items=${encodeURIComponent(key)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ providers: Record<string, ProviderWithType[]> }>;
      })
      .then((json) => {
        if (cancelled) return;
        cache.set(key, { data: json.providers, expiresAt: Date.now() + TTL_MS });
        setMap(json.providers);
      })
      .catch(() => {
        if (cancelled) return;
        setMap({});
      });

    return () => {
      cancelled = true;
    };
  }, [key, movies.length]);

  return map;
};