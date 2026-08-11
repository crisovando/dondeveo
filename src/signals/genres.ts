import { signal } from "@preact/signals";
import { Genres } from "../shared/types";

const LOCAL_STORAGE_KEY = "dv_genres";

export const genresSignal = signal<Genres[]>([]);

const CACHE_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;

export const loadGenres = async () => {
  if (typeof window === "undefined") return;
  const now = Date.now();

  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const { data, timestamp } = JSON.parse(saved);

      if (timestamp && now - timestamp < CACHE_EXPIRATION_TIME) {
        genresSignal.value = data;
      }
    } catch (e) {
      console.error("Error parsing genres from localStorage", e);
    }
  }

  if (genresSignal.value.length === 0) {
    try {
      const response = await fetch("/api/genres");
      const data = await response.json();

      if (data.genres) {
        genresSignal.value = data.genres;
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ data: data.genres, timestamp: now }),
        );
      }
    } catch (e) {
      console.error("Error fetching genres", e);
    }
  }
};

export const getGenreNames = (ids: number[]): Genres[] => {
  return ids.map((id) => genresSignal.value.find((g) => g.id === id));
};
