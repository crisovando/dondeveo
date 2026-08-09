import {
  TopRatedMovieResponse,
  TopRatedTVResponse,
  TrendingResponse,
} from "../types/tmdb-trending";
import { fetchTMDB } from "./tmdbFetch";
import { mapToAudioVisualDto } from "../utils/mappers";

const LIMIT_TREND = 10;

// Keyword IDs for adult/fanservice anime content excluded from the discover
// query. Resolved against the TMDB /search/keyword endpoint and verified to
// match the exact keyword name.
const ANIME_EXCLUDED_KEYWORDS = [
  "195669", // ecchi
  "9194", // harem
  "325693", // erotica
  "256466", // erotic
  "281741", // nudity
  "329280", // sexual content
  "281749", // pantsu
  "198385", // hentai
];

const animeDiscoverParams = new URLSearchParams({
  with_genres: "16",
  include_adult: "false",
  with_origin_country: "JP",
  sort_by: "popularity.desc",
  without_keywords: ANIME_EXCLUDED_KEYWORDS.join(","),
});

export async function buildHome() {
  const [trending, topRatedMovies, topRatedTv, topAnime] = await Promise.all([
    fetchTMDB<TrendingResponse>("/trending/all/day"),
    fetchTMDB<TopRatedMovieResponse>("/movie/top_rated"),
    fetchTMDB<TopRatedTVResponse>("/tv/top_rated"),
    fetchTMDB<TopRatedMovieResponse>("/discover/tv", animeDiscoverParams),
  ]);

  return {
    trending: trending.results.slice(0, LIMIT_TREND).map(mapToAudioVisualDto),
    topRatedMovies: topRatedMovies.results
      .slice(0, LIMIT_TREND)
      .map(mapToAudioVisualDto),
    topRatedTv: topRatedTv.results
      .slice(0, LIMIT_TREND)
      .map(mapToAudioVisualDto),
    topAnime: topAnime.results.slice(0, 50).map(mapToAudioVisualDto),
  };
}
