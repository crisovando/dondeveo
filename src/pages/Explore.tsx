import { useEffect, useMemo } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ChevronLeft } from "lucide-preact";
import type { AudioVisualDto } from "@/shared/types";
import { ExploreCollections } from "@/features/ExploreCollections";
import { ExploreResults } from "@/features/ExploreResults";
import { useExploreData } from "@/hooks/useExploreData";
import { navigateToDetail } from "@/helpers/navigation";
import { movieGenresSignal, tvGenresSignal } from "@/signals/genres";
import {
  buildExploreQuery,
  exploreCatalogError,
  exploreCatalogLoading,
  exploreCollections,
  exploreFilters,
  exploreProviders,
  exploreSession,
  loadExploreCatalog,
  resetExploreFilters,
} from "@/signals/explore";
import styles from "./Explore.module.css";

export function Explore() {
  const { route, query } = useLocation();

  const requested = query.collection;
  const collectionId = typeof requested === "string" ? requested : null;
  const collection = exploreCollections.value.find((item) => item.id === collectionId) ?? null;

  const queryString = useMemo(
    () =>
      collectionId && collection ? buildExploreQuery(collectionId, exploreFilters.value) : null,
    [collectionId, collection, exploreFilters.value],
  );

  const {
    data,
    loading,
    error,
    loadMoreError,
    fetchPage,
    loadMore,
    retry,
    retryLoadMore,
    reset,
    restore,
  } = useExploreData(queryString);

  useEffect(() => {
    loadExploreCatalog();
  }, []);

  // An id that is not in the catalogue would otherwise be a dead end.
  useEffect(() => {
    if (collectionId && exploreCollections.value.length > 0 && !collection) {
      route("/explore", true);
    }
  }, [collectionId, collection]);

  useEffect(() => {
    if (!queryString) {
      reset();
      return;
    }

    // A stored snapshot for this exact query is cheaper than a refetch and it
    // keeps the scroll position the user left.
    const session = exploreSession.value;
    if (session.query === queryString && session.data && !data) {
      restore(queryString, session.data);
      requestAnimationFrame(() => window.scrollTo(0, session.scrollY));
      return;
    }

    fetchPage(queryString, 1);
  }, [queryString]);

  const handleItemClick = (item: AudioVisualDto) => {
    exploreSession.value = { query: queryString, data, scrollY: window.scrollY };
    navigateToDetail(item, route);
  };

  // Filters belong to the shelf they were set on; opening another one starts
  // clean, which is why this is not a side effect of the fetch above.
  const handleSelectCollection = () => resetExploreFilters();

  const handleBack = () => {
    resetExploreFilters();
    route("/explore");
  };

  if (!collection) {
    return (
      <div class={styles.explore}>
        <div class={styles.landing}>
          <ExploreCollections
            collections={exploreCollections.value}
            loading={exploreCatalogLoading.value}
            error={exploreCatalogError.value}
            onRetry={() => loadExploreCatalog(true)}
            onSelect={handleSelectCollection}
          />
        </div>
      </div>
    );
  }

  const genres = collection.mediaType === "tv" ? tvGenresSignal.value : movieGenresSignal.value;

  return (
    <div class={styles.explore}>
      <header class={styles.collectionHeader}>
        <button type="button" class={styles.back} onClick={handleBack}>
          <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          Colecciones
        </button>
        <h1>{collection.title}</h1>
        <p>{collection.subtitle}</p>
      </header>

      <ExploreResults
        items={data?.audiovisuals}
        total={data?.totalResults ?? 0}
        page={data?.page}
        totalPages={data?.totalPages}
        loading={loading}
        error={error}
        loadMoreError={loadMoreError}
        filters={exploreFilters.value}
        genres={genres}
        providers={exploreProviders.value}
        onItemClick={handleItemClick}
        onFiltersChange={(next) => {
          exploreFilters.value = next;
        }}
        onClearFilters={resetExploreFilters}
        fetchMore={loadMore}
        retry={retry}
        retryLoadMore={retryLoadMore}
      />
    </div>
  );
}
