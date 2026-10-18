import { fetchTMDB } from "./tmdbFetch";
import { WatchProvidersResponse } from "../types/tmdb-discover";
import { ExploreProvider } from "../../src/shared/types";

// Streaming services available in Argentina. Matched case-insensitively against
// TMDB provider names from /watch/providers/movie?watch_region=AR.
export const PLATFORM_ALLOWLIST = ["Netflix", "Amazon Prime Video", "Disney Plus", "Max", "Flow"];

const providerListParams = new URLSearchParams({ watch_region: "AR" });

export const isStreamingPlatform = (name: string): boolean =>
  PLATFORM_ALLOWLIST.some((allowed) => allowed.toLowerCase() === name.toLowerCase());

export async function resolveArStreamingProviders(): Promise<ExploreProvider[]> {
  const response = await fetchTMDB<WatchProvidersResponse>(
    "/watch/providers/movie",
    providerListParams,
  );

  return (response.results ?? [])
    .filter((provider) => isStreamingPlatform(provider.provider_name))
    .sort((a, b) => a.display_priority - b.display_priority)
    .map((provider) => ({
      providerId: provider.provider_id,
      providerName: provider.provider_name,
      logoPath: provider.logo_path ?? "",
    }));
}
