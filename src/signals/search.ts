import { signal } from "@preact/signals";
import type { SearchData, SearchFilters } from "@/shared/types";

export interface SearchSession {
  query: string;
  data: SearchData | null;
  scrollY: number;
}

export const searchSession = signal<SearchSession>({
  query: "",
  data: null,
  scrollY: 0,
});

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  mediaType: "all",
  genres: [],
  minRating: null,
  streamOnly: false,
};

export const searchFilters = signal<SearchFilters>({ ...DEFAULT_SEARCH_FILTERS });

export const hasActiveFilters = (f: SearchFilters): boolean =>
  f.mediaType !== "all" || f.genres.length > 0 || f.minRating !== null || f.streamOnly;

export const countActiveFilters = (f: SearchFilters): number =>
  (f.mediaType !== "all" ? 1 : 0) +
  f.genres.length +
  (f.minRating !== null ? 1 : 0) +
  (f.streamOnly ? 1 : 0);

export const resetSearchFilters = () => {
  searchFilters.value = { ...DEFAULT_SEARCH_FILTERS };
};
