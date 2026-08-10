import { fetchTMDB } from "./tmdbFetch";
import { mapToAudioVisualDto } from "../utils/mappers";
import { PlatformData } from "../../src/shared/types";
import {
  DiscoverMovieResponse,
  DiscoverTVResponse,
  WatchProvidersResponse,
} from "../types/tmdb-discover";

const PROVIDER_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

interface ProviderInfo {
  providerId: number;
  providerName: string;
  logoPath: string;
}

let providerInfoCache: { providers: Map<number, ProviderInfo>; expiresAt: number } | null = null;

const popularParams = (providerId: number, page: number) => {
  const params = new URLSearchParams({
    watch_region: "AR",
    with_watch_monetization_types: "flatrate",
    sort_by: "popularity.desc",
    page: String(page),
  });
  params.set("with_watch_providers", String(providerId));
  return params;
};

const providerListParams = new URLSearchParams({ watch_region: "AR" });

async function resolveProviderInfo(providerId: number): Promise<ProviderInfo> {
  const now = Date.now();
  if (!providerInfoCache || now > providerInfoCache.expiresAt) {
    const response = await fetchTMDB<WatchProvidersResponse>(
      "/watch/providers/movie",
      providerListParams,
    );
    const providers = new Map(
      (response.results ?? []).map((provider) => [
        provider.provider_id,
        {
          providerId: provider.provider_id,
          providerName: provider.provider_name,
          logoPath: provider.logo_path ?? "",
        },
      ]),
    );
    providerInfoCache = {
      providers,
      expiresAt: now + PROVIDER_CACHE_TTL_MS,
    };
  }

  return (
    providerInfoCache.providers.get(providerId) ?? {
      providerId,
      providerName: String(providerId),
      logoPath: "",
    }
  );
}

export async function getPlatformContent(providerId: number, page: number): Promise<PlatformData> {
  const info = await resolveProviderInfo(providerId);

  const [moviesResult, tvResult] = await Promise.allSettled([
    fetchTMDB<DiscoverMovieResponse>("/discover/movie", popularParams(providerId, page)),
    fetchTMDB<DiscoverTVResponse>("/discover/tv", popularParams(providerId, page)),
  ]);

  const movies =
    moviesResult.status === "fulfilled" ? moviesResult.value.results.map(mapToAudioVisualDto) : [];
  const tv = tvResult.status === "fulfilled" ? tvResult.value.results.map(mapToAudioVisualDto) : [];

  if (movies.length === 0 && tv.length === 0) {
    throw new Error(`No content for provider ${providerId}`);
  }

  const moviePages =
    moviesResult.status === "fulfilled" ? (moviesResult.value.total_pages ?? 1) : 1;
  const tvPages = tvResult.status === "fulfilled" ? (tvResult.value.total_pages ?? 1) : 1;
  const totalPages = Math.max(moviePages, tvPages, page);

  return {
    providerId: info.providerId,
    providerName: info.providerName,
    logoPath: info.logoPath,
    movies,
    tv,
    page,
    totalPages,
  };
}
