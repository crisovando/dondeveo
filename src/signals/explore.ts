import { signal } from "@preact/signals";
import type { ExploreCollection, SearchData } from "@/shared/types";

export const exploreCollections = signal<ExploreCollection[]>([]);
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

// The query string is the whole state of a result set. It is also its identity:
// a different string is a different set, which is what tells the hook to drop
// the pages it already holds.
export const buildExploreQuery = (collectionId: string): string =>
  new URLSearchParams({ collection: collectionId }).toString();

export const loadExploreCatalog = async (force = false) => {
  if (typeof window === "undefined") return;
  if (!force && exploreCollections.value.length > 0) return;

  exploreCatalogLoading.value = true;
  exploreCatalogError.value = false;

  try {
    const response = await fetch("/api/explore/collections");

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const collections = await response.json();

    exploreCollections.value = collections.collections ?? [];
  } catch (error) {
    console.error("Error fetching the explore catalogue", error);
    exploreCatalogError.value = true;
  } finally {
    exploreCatalogLoading.value = false;
  }
};
