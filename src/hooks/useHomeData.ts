import { HomeData, AudioVisualDto, PlatformRow } from "@/shared/types";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { getGenreNames } from "@/signals/genres";

const URL_API = "/api/home";

const homeDataSignal = signal<HomeData | null>(null);
const homeErrorSignal = signal<string | null>(null);

const mapGenres = (genreIds?: number[]) => {
  return getGenreNames(genreIds ?? []).filter(Boolean);
};

const mapDtosWithGenres = (dtos: AudioVisualDto[]): AudioVisualDto[] => {
  return dtos.map((dto) => ({
    ...dto,
    genres: mapGenres(dto.genreIds),
  }));
};

const mapPlatformRows = (platforms: PlatformRow[]): PlatformRow[] => {
  return platforms.map((platform) => ({
    ...platform,
    movies: mapDtosWithGenres(platform.movies),
    tv: mapDtosWithGenres(platform.tv),
  }));
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
        trending: mapDtosWithGenres(json.trending),
        topRatedMovies: mapDtosWithGenres(json.topRatedMovies),
        topRatedTv: mapDtosWithGenres(json.topRatedTv),
        topAnime: mapDtosWithGenres(json.topAnime),
        newReleases: mapDtosWithGenres(json.newReleases),
        mostPopularAR: mapDtosWithGenres(json.mostPopularAR),
        platforms: mapPlatformRows(json.platforms),
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