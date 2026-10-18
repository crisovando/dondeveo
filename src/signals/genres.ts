import { signal } from "@preact/signals";
import { Genres, GenresResponse } from "../shared/types";

const LOCAL_STORAGE_KEY = "dv_genres";

export const genresSignal = signal<Genres[]>([]);
export const movieGenresSignal = signal<Genres[]>([]);
export const tvGenresSignal = signal<Genres[]>([]);

const CACHE_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;

export const loadGenres = async () => {
  if (typeof window === "undefined") return;
  const now = Date.now();

  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const { data, movieGenres, tvGenres, timestamp } = JSON.parse(saved);

      if (timestamp && now - timestamp < CACHE_EXPIRATION_TIME) {
        genresSignal.value = data;
        movieGenresSignal.value = movieGenres ?? [];
        tvGenresSignal.value = tvGenres ?? [];
      }
    } catch (e) {
      console.error("Error parsing genres from localStorage", e);
    }
  }

  // A genre id only resolves inside its own vocabulary, so caches written before
  // the split existed are refetched.
  const hasSplit = movieGenresSignal.value.length > 0 && tvGenresSignal.value.length > 0;

  if (genresSignal.value.length === 0 || !hasSplit) {
    try {
      const response = await fetch("/api/genres");
      const data: GenresResponse = await response.json();

      if (data.genres) {
        genresSignal.value = data.genres;
        movieGenresSignal.value = data.movieGenres ?? [];
        tvGenresSignal.value = data.tvGenres ?? [];
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            data: data.genres,
            movieGenres: data.movieGenres,
            tvGenres: data.tvGenres,
            timestamp: now,
          }),
        );
      }
    } catch (e) {
      console.error("Error fetching genres", e);
    }
  }
};

export const getGenreNames = (ids: number[]): Genres[] => {
  return ids
    .map((id) => genresSignal.value.find((g) => g.id === id))
    .filter((genre): genre is Genres => Boolean(genre));
};
