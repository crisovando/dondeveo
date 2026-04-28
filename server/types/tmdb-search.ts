import { Movie, TV, Person } from "./tmdb-common";

export type SearchResultType = Movie | TV | Person;

export interface SearchMultiResponse {
  page: number;
  results: SearchResultType[];
  total_pages: number;
  total_results: number;
}
