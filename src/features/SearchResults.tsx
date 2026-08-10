import { useEffect, useRef, useState } from "preact/hooks";
import { AudioVisualDto, ProviderWithType } from "@/shared/types";
import styles from "./SearchResults.module.css";
import { ImgTmdb } from "@/components/ImgTmdb";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { MediaGrid } from "@/components/MediaGrid";
import { Star } from "lucide-preact";
import { CardProviders } from "@/features/CardProviders";
import { isStreamProvider } from "@/hooks/useProvidersMap";
import { Spinner } from "@/components/Spinner";
import { getHistory } from "@/signals/history";

interface SearchResultsProps {
  items?: AudioVisualDto[];
  total: number;
  page?: number;
  totalPages?: number;
  loading: boolean;
  error: boolean;
  loadMoreError: boolean;
  fetchMore: () => Promise<void>;
  retry: () => void;
  retryLoadMore: () => void;
  onItemClick?: (item: AudioVisualDto) => void;
  onRecentSearch?: (title: string) => void;
}

const MEDIA_TYPE_LABEL: Record<string, string> = {
  movie: "Película",
  tv: "Serie",
};

const RECENT_LIMIT = 6;

function resultCountLabel(total: number): string {
  return total === 1 ? "1 resultado encontrado" : `${total} resultados encontrados`;
}

function Availability({ providers }: { providers?: ProviderWithType[] }) {
  const stream = (providers ?? []).filter(isStreamProvider);

  if (stream.length > 0) {
    return <CardProviders providers={stream} />;
  }

  return (
    <div class={styles.availability}>
      {providers && providers.length > 0 ? "Solo en alquiler o compra" : "Aún no disponible en AR"}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div class={styles.skeletonCard} aria-hidden="true">
      <div class={styles.skeletonPoster} />
      <div class={styles.skeletonLine} />
    </div>
  );
}

export function SearchResults({
  items,
  total,
  page = 1,
  totalPages,
  loading,
  error,
  loadMoreError,
  fetchMore,
  retry,
  retryLoadMore,
  onItemClick,
  onRecentSearch,
}: SearchResultsProps) {
  const hasMore = !!(
    items &&
    items.length < total &&
    page < (totalPages ?? Number.MAX_SAFE_INTEGER)
  );
  const { loadMoreRef } = useInfiniteScroll(fetchMore, hasMore);

  const [announce, setAnnounce] = useState("");
  const lastCountRef = useRef(0);

  useEffect(() => {
    if (items === undefined) {
      lastCountRef.current = 0;
      return;
    }
    if (items.length > lastCountRef.current && !loading) {
      const appended = lastCountRef.current > 0;
      lastCountRef.current = items.length;
      setAnnounce(appended ? "Se cargaron más resultados." : resultCountLabel(total));
    }
  }, [items, loading, total]);

  const handleClickItem = (item: AudioVisualDto) => {
    if (item.mediaType !== "people" && onItemClick) {
      onItemClick(item);
    }
  };

  const visibleItems = items?.filter((item) => item.mediaType !== "people");

  const isInitial = items === undefined && !loading && !error;
  const isError = error && items === undefined;
  const isEmpty = items !== undefined && visibleItems?.length === 0;

  const recent = getHistory().slice(0, RECENT_LIMIT);

  let body;

  if (isInitial) {
    body = (
      <>
        <p class={styles.hint}>Escribí arriba para buscar películas y series.</p>
        {recent.length > 0 && (
          <div class={styles.recent} aria-label="Búsquedas recientes">
            <h2 class={styles.recentHeading}>Recientes</h2>
            <div class={styles.recentGrid}>
              {recent.map((item) => (
                <button
                  type="button"
                  class={styles.recentChip}
                  onClick={() => onRecentSearch?.(item.title)}
                  key={item.id}
                >
                  {item.poster ? (
                    <ImgTmdb
                      type="poster"
                      layout="poster-grid"
                      src={item.poster}
                      class={styles.recentPoster}
                      alt=""
                    />
                  ) : null}
                  <span class={styles.recentTitle}>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  } else if (isError) {
    body = (
      <div class={styles.stateBox} role="alert">
        <h2>No pudimos completar la búsqueda</h2>
        <p>Revisá tu conexión y volvé a intentarlo.</p>
        <button type="button" class={styles.retryButton} onClick={retry}>
          Reintentar
        </button>
      </div>
    );
  } else if (loading && items === undefined) {
    body = (
      <MediaGrid>
        {Array.from({ length: 10 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </MediaGrid>
    );
  } else if (isEmpty) {
    body = (
      <div class={styles.stateBox} role="status">
        <h2>Sin resultados</h2>
        <p>Probá con otro título o palabra clave.</p>
      </div>
    );
  } else {
    body = (
      <>
        <div class={styles.header}>
          <h2>Resultados de búsqueda</h2>
          <span>{resultCountLabel(total)}</span>
        </div>

        <MediaGrid>
          {visibleItems?.map((item) => (
            <a
              class={styles.cardResult}
              href={`/detail/${item.mediaType}/${item.id}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                handleClickItem(item);
              }}
              key={item.id}
            >
              <ImgTmdb
                type="poster"
                layout="poster-grid"
                src={item.poster}
                class={styles.poster}
                alt={`Póster de ${item.title}`}
                withSkeleton
                style={{ viewTransitionName: `media-${item.id}` }}
              />
              <h3 class={styles.title}>{item.title}</h3>
              <div class={styles.meta}>
                <span class={styles.metaType}>{MEDIA_TYPE_LABEL[item.mediaType]}</span>
                {typeof item.rating === "number" && item.rating > 0 && (
                  <span class={styles.metaRating}>
                    <Star size={12} strokeWidth={2} aria-hidden="true" />
                    {item.rating.toFixed(1)}
                  </span>
                )}
                {item.releaseDate && <span>{item.releaseDate.slice(0, 4)}</span>}
              </div>
              <Availability providers={item.providers} />
            </a>
          ))}
          {hasMore && (
            <div class={styles.sentinel} ref={loadMoreRef}>
              {loading && <Spinner inline />}
            </div>
          )}
        </MediaGrid>

        {loadMoreError && !loading && (
          <div class={styles.loadMoreError} role="status">
            <p>No pudimos cargar más resultados.</p>
            <button type="button" class={styles.retryButton} onClick={retryLoadMore}>
              Reintentar
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <section class={styles.searchResultsContainer} aria-busy={loading || undefined}>
      <span class="sr-only" role="status">
        {announce}
      </span>
      {body}
    </section>
  );
}
