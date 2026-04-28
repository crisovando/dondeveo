import { HomeData } from "@/shared/types";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { getGenreNames } from "@/signals/genres";

const URL_API = "/api/home";

const homeDataSignal = signal<HomeData | null>(null);

const mapGenres = (genreIds: number[]) => {
  return getGenreNames(genreIds).filter(Boolean);
};

export const useHomeData = () => {
  useEffect(() => {
    if (homeDataSignal.value) return;
    fetch(URL_API)
      .then((res) => res.json())
      .then((json) => {
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
        };
      });
  }, []);

  return { data: homeDataSignal.value };
};
