import { ProviderWithType } from "@/shared/types";
import { useEffect, useState } from "preact/hooks";

export type SeasonProviderMap = Record<number, ProviderWithType[] | null>;

interface CacheEntry {
  data: SeasonProviderMap;
  expiresAt: number;
}

const TTL_MS = 60 * 60 * 1000;

const cache = new Map<string, CacheEntry>();

export const useSeasonProviders = (id: number | null | undefined, seasonNumbers: number[]) => {
  const list = seasonNumbers.join(",");
  const request = id && list ? `${id}:${list}` : "";

  const [sheet, setSheet] = useState<{ request: string; data: SeasonProviderMap } | null>(null);

  useEffect(() => {
    if (!request || !id) return;

    const cached = cache.get(request);
    if (cached && Date.now() < cached.expiresAt) {
      setSheet({ request, data: cached.data });
      return;
    }

    let cancelled = false;

    // Season availability is a separate question from the title's answer: it
    // never blocks the detail render, and a failure leaves the rail as it is.
    fetch(`/api/seasons/${id}/providers?seasons=${encodeURIComponent(list)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{
          seasons: { seasonNumber: number; providers: ProviderWithType[] | null }[];
        }>;
      })
      .then((json) => {
        if (cancelled) return;

        const data: SeasonProviderMap = {};
        for (const entry of json.seasons ?? []) {
          data[entry.seasonNumber] = entry.providers;
        }

        cache.set(request, { data, expiresAt: Date.now() + TTL_MS });
        setSheet({ request, data });
      })
      .catch(() => {
        if (cancelled) return;
        setSheet({ request, data: {} });
      });

    return () => {
      cancelled = true;
    };
  }, [request, id, list]);

  // A pending or failed request must not hand the previous series' sheet to the
  // rail: the key has to match the title on screen.
  return sheet && sheet.request === request ? sheet.data : null;
};
