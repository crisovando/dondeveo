import { useEffect, useRef, useState } from "preact/hooks";
import type { AudioVisualDto } from "@/shared/types";
import styles from "./ExploreResults.module.css";
import { MediaCard } from "@/features/MediaCard";
import { MediaGrid } from "@/components/MediaGrid";
import { Spinner } from "@/components/Spinner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface ExploreResultsProps {
  items?: AudioVisualDto[];
  total: number;
  page?: number;
  totalPages?: number;
  loading: boolean;
  error: boolean;
  loadMoreError: boolean;
  onItemClick: (item: AudioVisualDto) => void;
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
  onItemClick,
  fetchMore,
  retry,
  retryLoadMore,
}: ExploreResultsProps) {
  const [announce, setAnnounce] = useState("");
  const lastCountRef = useRef(0);

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
      <div class={styles.stateBox} role="status">
        <h2>Esta colección está vacía</h2>
        <p>Volvé a intentarlo en un rato.</p>
        <button type="button" class={styles.retryButton} onClick={retry}>
          Reintentar
        </button>
      </div>
    );
  } else {
    body = (
      <>
        <div class={styles.header}>
          <h2>Para explorar</h2>
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
