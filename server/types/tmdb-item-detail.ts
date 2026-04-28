import { Person } from "./tmdb-common";

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  budget: number;

  genres: Genre[];

  homepage: string | null;
  id: number;
  imdb_id: string | null;

  original_language: string;
  original_title: string;
  overview: string | null;

  popularity: number;
  poster_path: string | null;

  production_companies: ProductionCompany[];

  release_date: string;

  revenue: number;
  runtime: number | null;

  status: string;
  tagline: string | null;
  title: string;

  video: boolean;
  vote_average: number;
  vote_count: number;

  reviews?: ReviewsResponse;
  "watch/providers"?: ProvidersResponse;
  credits?: CreditsResponse;
  release_dates?: ReleaseDatesResponse;
}

export interface Season {
  air_date: string;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface TvDetail {
  backdrop_path: string | null;
  genres: Genre[];
  id: number;
  imdb_id: string | null;
  name: string;

  vote_average: number;
  vote_count: number;

  original_language: string;
  origin_country: string[];
  original_title: string;
  overview: string | null;

  popularity: number;
  poster_path: string | null;

  production_companies: ProductionCompany[];

  status: string;
  tagline: string | null;

  seasons: Season[];

  created_by: Person[];

  reviews?: ReviewsResponse;
  "watch/providers"?: ProvidersResponse;
  credits?: CreditsResponse;
  content_ratings?: ContentRatingsResponse;
}

export interface ContentRatingResult {
  iso_3166_1: string;
  rating: string;
}

export interface ContentRatingsResponse {
  results: ContentRatingResult[];
}

export interface ReleaseDateInfo {
  certification: string;
  type: number;
}

export interface ReleaseDateResult {
  iso_3166_1: string;
  release_dates: ReleaseDateInfo[];
}

export interface ReleaseDatesResponse {
  results: ReleaseDateResult[];
}

export interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface CountryProviders {
  link: string;
  flatrate?: Provider[];
  free?: Provider[];
  ads?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}

export interface ProvidersResponse {
  results: Record<string, CountryProviders>;
}

export interface Review {
  id: number;
  author: string;
  author_details: {
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface ReviewsResponse {
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

export interface Cast extends Person {
  character: string;
  known_for_department: string;
  order: number;
}

export interface Crew extends Person {
  credit_id: string;
  department: string;
  job: string;
  known_for_department: string;
}

export interface CreditsResponse {
  cast: Cast[];
  crew: Crew[];
}
