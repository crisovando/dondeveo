import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { BackButton } from "@/features/BackButton";
import { ImgTmdb } from "@/components/ImgTmdb";
import { MediaGrid } from "@/components/MediaGrid";
import { MovieSkeleton } from "@/components/Skeletons";
import { navigateToDetail } from "@/helpers/navigation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePlatformData } from "@/hooks/usePlatformData";
import { Star } from "lucide-preact";
import type { AudioVisualDto } from "@/shared/types";
import styles from "./Platform.module.css";

interface PlatformProps {
  providerId: string;
}

type Tab = "movie" | "tv";

const LOGO_SRC = "https://image.tmdb.org/t/p/w92";

const TABS: { key: Tab; label: string }[] = [
  { key: "movie", label: "Películas" },
  { key: "tv", label: "Series" },
];

export function Platform({ providerId }: PlatformProps) {
  const { route } = useLocation();
  const [tab, setTab] = useState<Tab>("movie");
  const { data, loading, error, loadMore, retry } = usePlatformData(providerId);

  const items = tab === "movie" ? (data?.movies ?? []) : (data?.tv ?? []);
  const hasMore = !!data && data.page < data.totalPages;
  const { loadMoreRef } = useInfiniteScroll(loadMore, hasMore);

  const handleItemClick = (item: AudioVisualDto) => {
    navigateToDetail(item, route);
  };

  const isLoading = loading && !data;
  const isError = error && !data;
  const isEmpty = !isLoading && !isError && items.length === 0;

  return (
    <div class={`page ${styles.page}`}>
      <BackButton />

      <header class={styles.header}>
        {data?.logoPath && (
          <img
            src={`${LOGO_SRC}${data.logoPath}`}
            alt={`Logo de ${data.providerName}`}
            class={styles.logo}
            loading="lazy"
            decoding="async"
          />
        )}
        <h1 class={styles.title}>
          {data ? `Todo en ${data.providerName}` : "Cargando plataforma"}
        </h1>

        <div class={styles.pills} role="group" aria-label="Tipo de contenido">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              class={`${styles.pill} ${tab === item.key ? styles.pillActive : ""}`}
              aria-pressed={tab === item.key}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {isError && (
        <section class={styles.stateBox} role="alert">
          <h2>No pudimos cargar la plataforma</h2>
          <p>Revisá tu conexión y volvé a intentarlo.</p>
          <button type="button" class={styles.retry} onClick={retry}>
            Reintentar
          </button>
        </section>
      )}

      {isLoading && (
        <div aria-busy="true" aria-label="Cargando el catálogo">
          <MovieSkeleton />
          <MovieSkeleton />
        </div>
      )}

      {!isLoading && !isError && isEmpty && (
        <section class={styles.stateBox}>
          <h2>Sin contenido</h2>
          <p>
            Al momento no hay {tab === "movie" ? "películas" : "series"} disponibles en esta
            plataforma.
          </p>
        </section>
      )}

      {!isLoading && !isError && !isEmpty && (
        <MediaGrid>
          {items.map((item) => (
            <a
              key={item.id}
              class={styles.card}
              href={`/detail/${item.mediaType}/${item.id}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                handleItemClick(item);
              }}
            >
              <ImgTmdb
                type="poster"
                layout="poster-grid"
                size="w342"
                src={item.poster}
                class={styles.poster}
                alt={`Póster de ${item.title}`}
                withSkeleton
              />
              <h3 class={styles.cardTitle}>{item.title}</h3>
              <div class={styles.cardMeta}>
                {typeof item.rating === "number" && item.rating > 0 && (
                  <span class={styles.cardRating}>
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
      )}
    </div>
  );
}
