import { fetchTMDB } from "./tmdbFetch";
import { SearchData } from "../../src/shared/types";
import { SearchMultiResponse } from "../types/tmdb-search";
import { mapToAudioVisualDto } from "../utils/mappers";

const BASE_PATH = "/search/multi";

export async function search(query: string, page: number): Promise<SearchData> {
  const path = `${BASE_PATH}?query=${query}&page=${page}`;
  const { results, total_pages, total_results } = await fetchTMDB<SearchMultiResponse>(path);

  return {
    audiovisuals: results.map(mapToAudioVisualDto),
    page,
    totalPages: total_pages,
    totalResults: total_results,
  };
}
