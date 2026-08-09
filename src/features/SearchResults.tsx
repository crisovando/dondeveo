import { AudioVisualDto } from "@/shared/types";
import styles from "./SearchResults.module.css";
import { ImgTmdb } from "@/components/ImgTmdb";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { MediaGrid } from "@/components/MediaGrid";
import { Star } from "lucide-preact";

interface SearchResultsProps {
  items?: AudioVisualDto[];
  total: number;
  loading: boolean;
  error: boolean;
  fethMore: () => Promise<void>;
  onItemClick?: (item: AudioVisualDto) => void;
}

const MEDIA_TYPE_LABEL: Record<string, string> = {
  movie: "Película",
  tv: "Serie",
};

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
  loading,
  error,
  fethMore,
  onItemClick,
}: SearchResultsProps) {
  const hasMore = !!(items && items.length < total);
  const { loadMoreRef } = useInfiniteScroll(fethMore, hasMore);

  const handleClickItem = (item: AudioVisualDto) => {
    if (item.mediaType !== "people" && onItemClick) {
      onItemClick(item);
    }
  };

  const visibleItems = items?.filter((item) => item.mediaType !== "people");

  const isInitial = items === undefined && !loading && !error;
  const isError = error && items === undefined;
  const isEmpty = items !== undefined && visibleItems?.length === 0;

  if (isInitial) {
    return (
      <section class={styles.searchResultsContainer} aria-live="polite">
        <p class={styles.hint}>Escribí arriba para buscar películas y series.</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section class={styles.searchResultsContainer} aria-live="polite">
        <div class={styles.stateBox} role="alert">
          <h2>No pudimos completar la búsqueda</h2>
          <p>Revisá tu conexión y volvé a intentarlo.</p>
        </div>
      </section>
    );
  }

  if (loading && items === undefined) {
    return (
      <section class={styles.searchResultsContainer} aria-live="polite">
        <MediaGrid>
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </MediaGrid>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section class={styles.searchResultsContainer} aria-live="polite">
        <div class={styles.stateBox}>
          <h2>Sin resultados</h2>
          <p>Probá con otro título, actor o palabra clave.</p>
        </div>
      </section>
    );
  }

  return (
    <section class={styles.searchResultsContainer} aria-live="polite">
      <div class={styles.header}>
        <h2>Resultados de búsqueda</h2>
        <span>{`${total} resultados encontrados`}</span>
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
          </a>
        ))}
        {hasMore && <div ref={loadMoreRef} style={{ height: "1px", marginTop: "100px" }} />}
      </MediaGrid>
    </section>
  );
}
