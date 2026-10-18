import { signal } from "@preact/signals";
import type {
  ExploreCollection,
  ExploreFilters,
  ExploreOrder,
  ExploreProvider,
  SearchData,
} from "@/shared/types";

export const DEFAULT_EXPLORE_FILTERS: Readonly<ExploreFilters> = Object.freeze({
  genres: [],
  minRating: null,
  fromYear: null,
  toYear: null,
  providerId: null,
  streamOnly: false,
  order: "popular",
});

export const exploreFilters = signal<ExploreFilters>({ ...DEFAULT_EXPLORE_FILTERS });

export const exploreCollections = signal<ExploreCollection[]>([]);
export const exploreProviders = signal<ExploreProvider[]>([]);
export const exploreCatalogLoading = signal(false);
export const exploreCatalogError = signal(false);

export interface ExploreSession {
  query: string | null;
  data: SearchData | null;
  scrollY: number;
}

export const exploreSession = signal<ExploreSession>({
  query: null,
  data: null,
  scrollY: 0,
});

export const EXPLORE_ORDER_OPTIONS: { value: ExploreOrder; label: string }[] = [
  { value: "popular", label: "Populares" },
  { value: "rated", label: "Mejor valoradas" },
  { value: "recent", label: "Más nuevas" },
];

export const EXPLORE_RATING_OPTIONS = [6, 7, 8, 9];

export const EXPLORE_YEAR_MIN = 1900;
export const EXPLORE_YEAR_MAX = 2100;

export const hasActiveExploreFilters = (filters: ExploreFilters): boolean =>
  filters.genres.length > 0 ||
  filters.minRating !== null ||
  filters.fromYear !== null ||
  filters.toYear !== null ||
  filters.providerId !== null ||
  filters.streamOnly ||
  filters.order !== "popular";

export const countActiveExploreFilters = (filters: ExploreFilters): number =>
  filters.genres.length +
  (filters.minRating !== null ? 1 : 0) +
  (filters.fromYear !== null || filters.toYear !== null ? 1 : 0) +
  (filters.providerId !== null ? 1 : 0) +
  (filters.streamOnly ? 1 : 0) +
  (filters.order !== "popular" ? 1 : 0);

export const resetExploreFilters = () => {
  exploreFilters.value = { ...DEFAULT_EXPLORE_FILTERS };
};

// The query string is the whole state of a result set. It is also its identity:
// a different string is a different set, which is what tells the hook to drop
// the pages it already holds.
export const buildExploreQuery = (collectionId: string, filters: ExploreFilters): string => {
  const params = new URLSearchParams({ collection: collectionId, order: filters.order });

  if (filters.genres.length > 0) params.set("genres", filters.genres.join(","));
  if (filters.minRating !== null) params.set("minRating", String(filters.minRating));
  if (filters.fromYear !== null) params.set("fromYear", String(filters.fromYear));
  if (filters.toYear !== null) params.set("toYear", String(filters.toYear));
  if (filters.providerId !== null) params.set("providerId", String(filters.providerId));
  if (filters.streamOnly) params.set("streamOnly", "1");

  return params.toString();
};

export const loadExploreCatalog = async (force = false) => {
  if (typeof window === "undefined") return;
  if (!force && exploreCollections.value.length > 0) return;

  exploreCatalogLoading.value = true;
  exploreCatalogError.value = false;

  try {
    const [collectionsResponse, providersResponse] = await Promise.all([
      fetch("/api/explore/collections"),
      fetch("/api/explore/providers"),
    ]);

    if (!collectionsResponse.ok || !providersResponse.ok) {
      throw new Error(`HTTP ${collectionsResponse.status}/${providersResponse.status}`);
    }

    const collections = await collectionsResponse.json();
    const providers = await providersResponse.json();

    exploreCollections.value = collections.collections ?? [];
    exploreProviders.value = providers.providers ?? [];
  } catch (error) {
    console.error("Error fetching the explore catalogue", error);
    exploreCatalogError.value = true;
  } finally {
    exploreCatalogLoading.value = false;
  }
};
