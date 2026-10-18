import { useEffect, useRef, useState } from "preact/hooks";
import type { AudioVisualDto, ExploreFilters, ExploreProvider, Genres } from "@/shared/types";
import styles from "./ExploreResults.module.css";
import { MediaCard } from "@/features/MediaCard";
import { MediaGrid } from "@/components/MediaGrid";
import { Spinner } from "@/components/Spinner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ExploreFilterBar } from "@/features/ExploreFilterBar";
import { hasActiveExploreFilters } from "@/signals/explore";

interface ExploreResultsProps {
  items?: AudioVisualDto[];
  total: number;
  page?: number;
  totalPages?: number;
  loading: boolean;
  error: boolean;
  loadMoreError: boolean;
  filters: ExploreFilters;
  genres: Genres[];
  providers: ExploreProvider[];
  onItemClick: (item: AudioVisualDto) => void;
  onFiltersChange: (next: ExploreFilters) => void;
  onClearFilters: () => void;
  fetchMore: () => Promise<void>;
  retry: () => void;
  retryLoadMore: () => void;
}

const countLabel = (total: number) =>
  total === 1 ? "1 título" : `${total.toLocaleString("es-AR")} títulos`;

function SkeletonCard() {
  return (
    <div class={styles.skeletonCard} aria-hidden="true">
      <div class={styles.skeletonPoster} />
      <div class={styles.skeletonLine} />
    </div>
  );
}

export function ExploreResults({
  items,
  total,
  page = 1,
  totalPages,
  loading,
  error,
  loadMoreError,
  filters,
  genres,
  providers,
  onItemClick,
  onFiltersChange,
  onClearFilters,
  fetchMore,
  retry,
  retryLoadMore,
}: ExploreResultsProps) {
  const [announce, setAnnounce] = useState("");
  const lastCountRef = useRef(0);

  const filtersActive = hasActiveExploreFilters(filters);
  const hasMore = !!(
    items &&
    items.length < total &&
    page < (totalPages ?? Number.MAX_SAFE_INTEGER)
  );
  const { loadMoreRef } = useInfiniteScroll(fetchMore, hasMore);

  useEffect(() => {
    if (items === undefined) {
      lastCountRef.current = 0;
      return;
    }
    if (items.length > lastCountRef.current && !loading) {
      const appended = lastCountRef.current > 0;
      lastCountRef.current = items.length;
      setAnnounce(appended ? "Se cargaron más títulos." : countLabel(total));
    }
  }, [items, loading, total]);

  const isError = error && items === undefined;
  const isLoading = loading && items === undefined;
  const isEmpty = items !== undefined && items.length === 0;

  const filtersBar = (
    <ExploreFilterBar
      filters={filters}
      onChange={onFiltersChange}
      onClear={onClearFilters}
      genres={genres}
      providers={providers}
    />
  );

  let body;

  if (isError) {
    body = (
      <div class={styles.stateBox} role="alert">
        <h2>No pudimos traer estos títulos</h2>
        <p>Revisá tu conexión y volvé a intentarlo.</p>
        <button type="button" class={styles.retryButton} onClick={retry}>
          Reintentar
        </button>
      </div>
    );
  } else if (isLoading) {
    body = (
      <div class={styles.gridPad}>
        <MediaGrid>
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </MediaGrid>
      </div>
    );
  } else if (isEmpty) {
    body = (
      <>
        {filtersBar}
        <div class={styles.stateBox} role="status">
          <h2>{filtersActive ? "Ningún título con estos filtros" : "Esta colección está vacía"}</h2>
          <p>
            {filtersActive
              ? "Probá quitar alguno o ampliar el año."
              : "Volvé a intentarlo en un rato."}
          </p>
          <button
            type="button"
            class={styles.retryButton}
            onClick={filtersActive ? onClearFilters : retry}
          >
            {filtersActive ? "Limpiar filtros" : "Reintentar"}
          </button>
        </div>
      </>
    );
  } else {
    body = (
      <>
        {filtersBar}
        <div class={styles.header}>
          <h2>{filtersActive ? "Resultados filtrados" : "Para explorar"}</h2>
          <span>{countLabel(total)}</span>
        </div>

        <div class={styles.gridPad}>
          <MediaGrid>
            {items?.map((item) => (
              <MediaCard key={item.id} item={item} onItemClick={onItemClick} />
            ))}
            {hasMore && (
              <div class={styles.sentinel} ref={loadMoreRef}>
                {loading && <Spinner inline />}
              </div>
            )}
          </MediaGrid>
        </div>

        {loadMoreError && !loading && (
          <div class={styles.loadMoreError} role="status">
            <p>No pudimos cargar más títulos.</p>
            <button type="button" class={styles.retryButton} onClick={retryLoadMore}>
              Reintentar
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <section class={styles.resultsContainer} aria-busy={loading || undefined}>
      <span class="sr-only" role="status">
        {announce}
      </span>
      {body}
    </section>
  );
}
