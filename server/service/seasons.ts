import { fetchTMDB } from "./tmdbFetch";
import { ProvidersResponse } from "../types/tmdb-item-detail";
import { SeasonProviders } from "../../src/shared/types";
import { mapWatchProviders } from "../utils/mappers";

const REGION = "AR";

const MAX_CONCURRENCY = 8;

async function fetchSeasonProviders(id: number, seasonNumber: number): Promise<SeasonProviders> {
  const params = new URLSearchParams({ watch_region: REGION });

  try {
    const response = await fetchTMDB<ProvidersResponse>(
      `/tv/${id}/season/${seasonNumber}/watch/providers`,
      params,
    );

    // A season without an AR entry is "TMDB does not know", not "not available".
    // It stays null so the UI claims nothing for that season; an entry with no
    // platform list comes back as an empty array and means the opposite.
    if (!response.results?.[REGION]) return { seasonNumber, providers: null };

    return { seasonNumber, providers: mapWatchProviders(response, REGION) };
  } catch {
    return { seasonNumber, providers: null };
  }
}

export async function getSeasonProviders(
  id: number,
  seasonNumbers: number[],
): Promise<SeasonProviders[]> {
  const unique = [...new Set(seasonNumbers)].sort((a, b) => a - b);
  const seasons: SeasonProviders[] = [];

  // TMDB offers no bulk season endpoint: one call per season, batched so a long
  // series cannot fan out into dozens of simultaneous requests.
  for (let index = 0; index < unique.length; index += MAX_CONCURRENCY) {
    const batch = unique.slice(index, index + MAX_CONCURRENCY);
    seasons.push(...(await Promise.all(batch.map((number) => fetchSeasonProviders(id, number)))));
  }

  return seasons;
}
