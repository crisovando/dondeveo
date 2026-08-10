import { SearchData, ProviderWithType } from "../../src/shared/types";
import { fetchTMDB } from "./tmdbFetch";
import { getWatchProvidersBatched } from "./providers";
import { SearchMultiResponse } from "../types/tmdb-search";
import { mapToAudioVisualDto } from "../utils/mappers";

const BASE_PATH = "/search/multi";

// TMDB's multi-search returns up to this many results per page.
const TMDB_PAGE_SIZE = 20;

// Max titles enriched with provider availability per page; covers a full
// result page while keeping the extra TMDb calls bounded.
const MAX_PROVIDER_ENRICH = TMDB_PAGE_SIZE;

function providerKey(type: string, id: number): string {
  return `${type}:${id}`;
}

export async function search(query: string, page: number): Promise<SearchData> {
  const path = `${BASE_PATH}?query=${query}&page=${page}`;

  // TMDb failures propagate up: an outage must surface as a real API error,
  // not as an empty result set that looks like "no matches".
  const { results = [], total_results = 0 } = await fetchTMDB<SearchMultiResponse>(path);

  const audiovisuals = results
    .filter((result) => result.media_type === "movie" || result.media_type === "tv")
    .map(mapToAudioVisualDto);

  // total_results includes people. Estimate the movie/tv-only total from the
  // mix on this page so the header count and hasMore only reflect real items.
  const mixRatio = results.length > 0 ? audiovisuals.length / results.length : 0;
  const totalResults = Math.round(total_results * mixRatio);
  const totalPages = Math.max(1, Math.ceil(totalResults / TMDB_PAGE_SIZE));

  // Enrich availability through the same batched path /api/providers/batch
  // serves. Enrichment is best-effort: never fail the whole search on it.
  const providersMap: Record<string, ProviderWithType[]> = {};
  try {
    const batched = await getWatchProvidersBatched(
      audiovisuals.slice(0, MAX_PROVIDER_ENRICH).map((item) => ({
        type: item.mediaType,
        id: item.id,
      })),
    );
    Object.assign(providersMap, batched);
  } catch (error) {
    console.error(`Provider enrichment failed for search "${query}":`, error);
  }

  return {
    audiovisuals: audiovisuals.map((item) => ({
      ...item,
      providers: providersMap[providerKey(item.mediaType, item.id)] ?? undefined,
    })),
    page,
    totalPages,
    totalResults,
  };
}
