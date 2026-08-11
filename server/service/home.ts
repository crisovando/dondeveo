import {
  TopRatedMovieResponse,
  TopRatedTVResponse,
  TrendingResponse,
} from "../types/tmdb-trending";
import {
  DiscoverMovieResponse,
  DiscoverTVResponse,
  WatchProvidersResponse,
} from "../types/tmdb-discover";
import { fetchTMDB } from "./tmdbFetch";
import { getWatchProvidersBatched } from "./providers";
import { mapToAudioVisualDto } from "../utils/mappers";
import { PlatformRow, ProviderWithType } from "../../src/shared/types";

const LIMIT_TREND = 10;
const MAX_PLATFORMS = 4;
const RELEASES_WINDOW_DAYS = 45;

// Streaming services available in Argentina. Matched case-insensitively against
// TMDB provider names from /watch/providers/movie?watch_region=AR.
const PLATFORM_ALLOWLIST = ["Netflix", "Amazon Prime Video", "Disney Plus", "Max", "Flow"];

// Keyword IDs for adult/fanservice anime content excluded from the discover
// query. Resolved against the TMDB /search/keyword endpoint and verified to
// match the exact keyword name.
const ANIME_EXCLUDED_KEYWORDS = [
  "195669", // ecchi
  "9194", // harem
  "325693", // erotica
  "256466", // erotic
  "281741", // nudity
  "329280", // sexual content
  "281749", // pantsu
  "198385", // hentai
];

const animeDiscoverParams = new URLSearchParams({
  with_genres: "16",
  include_adult: "false",
  with_origin_country: "JP",
  sort_by: "popularity.desc",
  without_keywords: ANIME_EXCLUDED_KEYWORDS.join(","),
});

const popularParams = (providerId?: number) => {
  const params = new URLSearchParams({
    watch_region: "AR",
    with_watch_monetization_types: "flatrate",
    sort_by: "popularity.desc",
  });
  if (providerId) params.set("with_watch_providers", String(providerId));
  return params;
};

const newReleasesParams = (providerIds: string) => {
  const params = new URLSearchParams({
    watch_region: "AR",
    with_watch_providers: providerIds,
    with_watch_monetization_types: "flatrate",
    sort_by: "primary_release_date.desc",
  });
  const cutoff = new Date(Date.now() - RELEASES_WINDOW_DAYS * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  params.set("primary_release_date.gte", cutoff);
  return params;
};

const providerListParams = new URLSearchParams({
  watch_region: "AR",
});

const dedupeById = <T extends { id: number }>(items: T[]): T[] => {
  return [...new Map(items.map((item) => [item.id, item])).values()];
};

async function resolvePlatforms(): Promise<PlatformRow[]> {
  try {
    const response = await fetchTMDB<WatchProvidersResponse>(
      "/watch/providers/movie",
      providerListParams,
    );

    const selected = (response.results ?? [])
      .filter((provider) =>
        PLATFORM_ALLOWLIST.some(
          (name) => name.toLowerCase() === provider.provider_name.toLowerCase(),
        ),
      )
      .sort((a, b) => a.display_priority - b.display_priority)
      .slice(0, MAX_PLATFORMS);

    if (selected.length === 0) return [];

    const rows = await Promise.allSettled(
      selected.map(async (provider) => {
        const [moviesResult, tvResult] = await Promise.allSettled([
          fetchTMDB<DiscoverMovieResponse>("/discover/movie", popularParams(provider.provider_id)),
          fetchTMDB<DiscoverTVResponse>("/discover/tv", popularParams(provider.provider_id)),
        ]);

        return {
          providerId: provider.provider_id,
          providerName: provider.provider_name,
          logoPath: provider.logo_path ?? "",
          movies:
            moviesResult.status === "fulfilled"
              ? moviesResult.value.results.slice(0, LIMIT_TREND).map(mapToAudioVisualDto)
              : [],
          tv:
            tvResult.status === "fulfilled"
              ? tvResult.value.results.slice(0, LIMIT_TREND).map(mapToAudioVisualDto)
              : [],
        };
      }),
    );

    return rows
      .filter((row): row is PromiseFulfilledResult<PlatformRow> => row.status === "fulfilled")
      .map((row) => row.value);
  } catch (error) {
    console.error("Failed to resolve AR watch providers", error);
    return [];
  }
}

export async function buildHome() {
  const platforms = await resolvePlatforms();
  const providerIds = platforms.map((p) => p.providerId).join(",");

  const settled = await Promise.allSettled([
    fetchTMDB<TrendingResponse>("/trending/all/day"),
    fetchTMDB<TopRatedMovieResponse>("/movie/top_rated"),
    fetchTMDB<TopRatedTVResponse>("/tv/top_rated"),
    fetchTMDB<TopRatedMovieResponse>("/discover/tv", animeDiscoverParams),
    providerIds
      ? fetchTMDB<DiscoverMovieResponse>("/discover/movie", newReleasesParams(providerIds))
      : Promise.reject(new Error("No AR providers resolved")),
    fetchTMDB<DiscoverMovieResponse>("/discover/movie", popularParams()),
    fetchTMDB<DiscoverTVResponse>("/discover/tv", popularParams()),
  ]);

  if (settled.every((result) => result.status === "rejected")) {
    throw new Error("TMDb home failed");
  }

  const fulfilled = (index: number) => {
    const result = settled[index];
    return result.status === "fulfilled" ? result.value : undefined;
  };

  const trending = fulfilled(0);
  const topRatedMovies = fulfilled(1);
  const topRatedTv = fulfilled(2);
  const topAnime = fulfilled(3);
  const newReleases = fulfilled(4);
  const popularMovies = fulfilled(5);
  const popularTv = fulfilled(6);

  const mostPopularAR = dedupeById(
    [...(popularMovies?.results ?? []), ...(popularTv?.results ?? [])].map(mapToAudioVisualDto),
  ).slice(0, LIMIT_TREND);

  const rawTrending = trending?.results?.slice(0, LIMIT_TREND).map(mapToAudioVisualDto) ?? [];
  const rawNewReleases = newReleases?.results?.slice(0, LIMIT_TREND).map(mapToAudioVisualDto) ?? [];
  const rawTopRatedMovies =
    topRatedMovies?.results?.slice(0, LIMIT_TREND).map(mapToAudioVisualDto) ?? [];
  const rawTopRatedTv = topRatedTv?.results?.slice(0, LIMIT_TREND).map(mapToAudioVisualDto) ?? [];
  const rawTopAnime = topAnime?.results?.slice(0, 50).map(mapToAudioVisualDto) ?? [];

  // Deduplicate titles globally across home rails, giving precedence to the
  // rail where a title ranks higher: a title already shown in an earlier rail
  // is filtered out of every later one. Due to this, later rails can end up
  // with fewer than (or zero) items; the client already hides empty rails, so
  // no padding is required here.
  const seenIds = new Set<number>();

  const filterSeen = <T extends { id: number }>(items: T[]): T[] => {
    const kept: T[] = [];
    for (const item of items) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);
      kept.push(item);
    }
    return kept;
  };

  const filteredTrending = filterSeen(rawTrending);
  const filteredNewReleases = filterSeen(rawNewReleases);
  const filteredMostPopularAR = filterSeen(mostPopularAR);
  const filteredPlatforms = platforms.map((platform) => ({
    ...platform,
    movies: filterSeen(platform.movies),
    tv: filterSeen(platform.tv),
  }));
  const filteredTopRatedMovies = filterSeen(rawTopRatedMovies);
  const filteredTopRatedTv = filterSeen(rawTopRatedTv);
  const filteredTopAnime = filterSeen(rawTopAnime);

  // Enrich provider availability through the same batched path
  // /api/providers/batch serves. Enrichment is best-effort: never fail the
  // whole home payload on it. Only rails that actually render provider chips
  // are enriched; platform rails pass showProviders={false} and skip it.
  const providerRefs = [
    ...filteredTrending,
    ...filteredNewReleases,
    ...filteredMostPopularAR,
    ...filteredTopRatedMovies,
    ...filteredTopRatedTv,
    ...filteredTopAnime,
  ].map((item) => ({ type: item.mediaType, id: item.id }));

  const providersMap: Record<string, ProviderWithType[]> = {};
  try {
    const batched = await getWatchProvidersBatched(providerRefs);
    Object.assign(providersMap, batched);
  } catch (error) {
    console.error("Provider enrichment failed for home:", error);
  }

  const enrichWithProviders = <T extends { id: number; mediaType: string }>(
    items: T[],
  ): (T & { providers?: ProviderWithType[] })[] =>
    items.map((item) => ({
      ...item,
      providers: providersMap[`${item.mediaType}:${item.id}`] ?? undefined,
    }));

  return {
    trending: enrichWithProviders(filteredTrending),
    topRatedMovies: enrichWithProviders(filteredTopRatedMovies),
    topRatedTv: enrichWithProviders(filteredTopRatedTv),
    topAnime: enrichWithProviders(filteredTopAnime),
    newReleases: enrichWithProviders(filteredNewReleases),
    mostPopularAR: enrichWithProviders(filteredMostPopularAR),
    platforms: filteredPlatforms,
  };
}
