import { fetchTMDB } from "./tmdbFetch";
import { SearchData } from "../../src/shared/types";
import { SearchMultiResponse } from "../types/tmdb-search";
import { mapToAudioVisualDto } from "../utils/mappers";

const BASE_PATH = "/search/multi";

export async function search(query: string, page: number): Promise<SearchData> {
  const path = `${BASE_PATH}?query=${query}&page=${page}`;
  const empty: SearchData = {
    audiovisuals: [],
    page,
    totalPages: 0,
    totalResults: 0,
  };

  try {
    const { results = [], total_pages = 0, total_results = 0 } =
      await fetchTMDB<SearchMultiResponse>(path);

    return {
      audiovisuals: results.map(mapToAudioVisualDto),
      page,
      totalPages: total_pages,
      totalResults: total_results,
    };
  } catch (error) {
    console.error(`TMDb search failed for "${query}":`, error);
    return empty;
  }
}
