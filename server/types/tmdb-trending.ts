import { Movie, TV, Person } from "./tmdb-common";

export type TrendingResult = Movie | TV | Person;

export interface TrendingResponse {
  page: number;
  results: TrendingResult[];
  total_pages?: number;
  total_results?: number;
}

export interface TopRatedMovieResponse {
  page: number;
  results: Movie[];
  total_pages?: number;
  total_results?: number;
}

export interface TopRatedTVResponse {
  page: number;
  results: TV[];
  total_pages?: number;
  total_results?: number;
}
