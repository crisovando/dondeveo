import {
  TopRatedMovieResponse,
  TopRatedTVResponse,
  TrendingResponse,
} from "../types/tmdb-trending";
import { fetchTMDB } from "./tmdbFetch";
import { mapToAudioVisualDto } from "../utils/mappers";

const LIMIT_TREND = 10;

export async function buildHome() {
  const [trending, topRatedMovies, topRatedTv] = await Promise.all([
    fetchTMDB<TrendingResponse>("/trending/all/day"),
    fetchTMDB<TopRatedMovieResponse>("/movie/top_rated"),
    fetchTMDB<TopRatedTVResponse>("/tv/top_rated"),
  ]);

  return {
    trending: trending.results.slice(0, LIMIT_TREND).map(mapToAudioVisualDto),
    topRatedMovies: topRatedMovies.results.slice(0, LIMIT_TREND).map(mapToAudioVisualDto),
    topRatedTv: topRatedTv.results.slice(0, LIMIT_TREND).map(mapToAudioVisualDto),
  };
}
