import { Movie, TV } from "./tmdb-common";

export interface DiscoverMovieResponse {
  page: number;
  results: Movie[];
  total_pages?: number;
  total_results?: number;
}

export interface DiscoverTVResponse {
  page: number;
  results: TV[];
  total_pages?: number;
  total_results?: number;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

export interface WatchProvidersResponse {
  results: WatchProvider[];
}
