import { AudioVisualDto } from "@/shared/types";
import styles from "./SearchResults.module.css";
import { ImgTmdb } from "@/components/ImgTmdb";
import { useLocation } from "preact-iso";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { navigateToDetail } from "@/helpers/navigation";
import { MediaGrid } from "@/components/MediaGrid";

interface SearchResults {
  items?: AudioVisualDto[];
  total: number;
  fethMore: () => Promise<void>;
}

export function SearchResults({ items, total, fethMore }: SearchResults) {
  const { route } = useLocation();
  const hasMore = !!(items && items.length < total);
  const { loadMoreRef } = useInfiniteScroll(fethMore, hasMore);

  const handleClickItem = (item: AudioVisualDto) => {
    if (item.mediaType !== "people") {
      navigateToDetail(item, route);
    }
  };

  if (items === undefined) {
    return (
      <section class={styles.searchResultsContainer}>
        <div class={styles.header}>
          <h3></h3>
        </div>
      </section>
    );
  }

  return (
    <section class={styles.searchResultsContainer}>
      <div class={styles.header}>
        <h2>Resultados de búsqueda</h2>
        <span>{`${total} resultados encontrados`}</span>
      </div>

      <MediaGrid>
        {items?.map((item) => (
          <article class={styles.cardResult} onClick={() => handleClickItem(item)} key={item.id}>
            <ImgTmdb
              type="poster"
              layout="poster-grid"
              src={item.poster}
              class={styles.poster}
              alt={item.title}
              withSkeleton
              style={{ viewTransitionName: `media-${item.id}` }}
            />
            <h3 class={styles.title}>{item.title}</h3>
          </article>
        ))}
        {hasMore && <div ref={loadMoreRef} style={{ height: "1px", marginTop: "100px" }} />}
      </MediaGrid>
    </section>
  );
}
