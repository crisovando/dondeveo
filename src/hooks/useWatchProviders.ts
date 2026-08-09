import { useEffect, useState } from "preact/hooks";
import { ProviderWithType } from "@/shared/types";

interface ProvidersResult {
  providers: ProviderWithType[];
  name: string;
}

const TTL_MS = 60 * 60 * 1000;

interface CacheEntry {
  data: ProvidersResult;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function cacheKey(type?: string, id?: number): string {
  return `${type}/${id}`;
}

function readCache(type?: string, id?: number): ProvidersResult | null {
  if (!type || !id) return null;
  const entry = cache.get(cacheKey(type, id));
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(cacheKey(type, id));
    return null;
  }
  return entry.data;
}

export const useWatchProviders = (type?: string, id?: number, name?: string) => {
  const [data, setData] = useState<ProvidersResult | null>(() =>
    readCache(type, id),
  );
  const [loading, setLoading] = useState(() => readCache(type, id) === null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!type || !id) {
      setData(null);
      setLoading(false);
      setError(false);
      return;
    }

    const cached = readCache(type, id);
    if (cached) {
      setData(cached);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);
    setData(null);

    fetch(`/api/providers/${type}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ type: string; id: number; providers: ProviderWithType[] }>;
      })
      .then((json) => {
        if (cancelled) return;
        const result = { providers: json.providers, name: name ?? "" };
        cache.set(cacheKey(type, id), { data: result, expiresAt: Date.now() + TTL_MS });
        setData(result);
      })
      .catch(() => {
        if (cancelled) return;
        setData(null);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type, id, name]);

  return { data, loading, error };
};