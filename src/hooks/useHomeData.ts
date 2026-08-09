import { HomeData } from "@/shared/types";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { getGenreNames } from "@/signals/genres";

const URL_API = "/api/home";

const homeDataSignal = signal<HomeData | null>(null);
const homeErrorSignal = signal<string | null>(null);

const mapGenres = (genreIds?: number[]) => {
  return getGenreNames(genreIds ?? []).filter(Boolean);
};

const loadHomeData = () => {
  homeDataSignal.value = null;
  homeErrorSignal.value = null;

  fetch(URL_API)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<HomeData>;
    })
    .then((json: HomeData) => {
      homeDataSignal.value = {
        ...json,
        trending: json.trending.map((movie) => ({
          ...movie,
          genres: mapGenres(movie.genreIds),
        })),
        topRatedMovies: json.topRatedMovies.map((movie) => ({
          ...movie,
          genres: mapGenres(movie.genreIds),
        })),
        topRatedTv: json.topRatedTv.map((tv) => ({
          ...tv,
          genres: mapGenres(tv.genreIds),
        })),
        topAnime: json.topAnime.map((anime) => ({
          ...anime,
          genres: mapGenres(anime.genreIds),
        })),
      };
    })
    .catch(() => {
      homeErrorSignal.value = "No pudimos cargar el inicio. Revisá tu conexión e intentá de nuevo.";
    });
};

export const retryHomeData = () => {
  loadHomeData();
};

export const useHomeData = () => {
  useEffect(() => {
    if (homeDataSignal.value || homeErrorSignal.value) return;
    loadHomeData();
  }, []);

  return { data: homeDataSignal.value, error: homeErrorSignal.value };
};