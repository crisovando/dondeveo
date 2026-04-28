import { ApiGenreListResponse } from "../types/tmdb-genres";
import { fetchTMDB } from "./tmdbFetch";

export async function getGenres() {
  const [movieGenres, tvGenres] = await Promise.all([
    fetchTMDB<ApiGenreListResponse>("/genre/movie/list"),
    fetchTMDB<ApiGenreListResponse>("/genre/tv/list"),
  ]);

  return {
    genres: [...movieGenres.genres, ...tvGenres.genres],
  };
}
