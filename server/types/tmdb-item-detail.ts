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

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface EpisodeToAir {
  id: number;
  name: string;
  overview: string;
  air_date: string | null;
  episode_number: number;
  season_number: number;
  runtime: number | null;
  still_path: string | null;
  vote_average: number;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideosResponse {
  results: Video[];
}

export interface Recommendation {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

export interface RecommendationsResponse {
  page: number;
  results: Recommendation[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: Collection | null;
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
  production_countries: ProductionCountry[];

  release_date: string;

  revenue: number;
  runtime: number | null;

  spoken_languages: SpokenLanguage[];
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
  recommendations?: RecommendationsResponse;
  videos?: VideosResponse;
}

export interface Season {
  air_date: string | null;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface TvDetail {
  backdrop_path: string | null;
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  id: number;
  imdb_id: string | null;
  in_production: boolean;
  last_episode_to_air: EpisodeToAir | null;
  name: string;
  networks: Network[];
  next_episode_to_air: EpisodeToAir | null;
  number_of_episodes: number;
  number_of_seasons: number;

  vote_average: number;
  vote_count: number;

  original_language: string;
  original_name: string;
  origin_country: string[];
  overview: string | null;

  popularity: number;
  poster_path: string | null;

  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];

  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;

  seasons: Season[];

  created_by: Person[];

  reviews?: ReviewsResponse;
  "watch/providers"?: ProvidersResponse;
  credits?: CreditsResponse;
  content_ratings?: ContentRatingsResponse;
  recommendations?: RecommendationsResponse;
  videos?: VideosResponse;
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
