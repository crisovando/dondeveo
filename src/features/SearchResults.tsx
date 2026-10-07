import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  AudioVisualDto,
  ProviderWithType,
  SearchFilters as SearchFiltersState,
} from "@/shared/types";
import styles from "./SearchResults.module.css";
import { ImgTmdb } from "@/components/ImgTmdb";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { MediaGrid } from "@/components/MediaGrid";
import { Dices, Star } from "lucide-preact";
import clsx from "clsx";
import { CardProviders } from "@/features/CardProviders";
import { isStreamProvider } from "@/hooks/useProvidersMap";
import { Spinner } from "@/components/Spinner";
import { getHistory } from "@/signals/history";
import { getGenreNames } from "@/signals/genres";
import { DEFAULT_SEARCH_FILTERS, hasActiveFilters } from "@/signals/search";
import { SearchFilters } from "@/features/SearchFilters";
import {
  MAX_ROULETTE_ENTRIES,
  isInRoulette,
  isRouletteFull,
  toggleRoulette,
} from "@/signals/roulette";

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
  filters: SearchFiltersState;
  onFiltersChange: (next: SearchFiltersState) => void;
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
  filters,
  onFiltersChange,
}: SearchResultsProps) {
  const hasMore = !!(
    items &&
    items.length < total &&
    page < (totalPages ?? Number.MAX_SAFE_INTEGER)
  );

  const [announce, setAnnounce] = useState("");
  const lastCountRef = useRef(0);
  const filteredAnnounceRef = useRef("");

  const loadedItems = items?.filter((item) => item.mediaType !== "people");
  const filtersActive = hasActiveFilters(filters);

  const filteredItems = useMemo(() => {
    if (!loadedItems) return undefined;
    return loadedItems.filter((item) => {
      if (filters.mediaType !== "all" && item.mediaType !== filters.mediaType) return false;
      if (filters.genres.length > 0) {
        const ids = item.genreIds ?? [];
        if (!ids.some((id) => filters.genres.includes(id))) return false;
      }
      if (filters.minRating !== null) {
        if (typeof item.rating !== "number" || item.rating < filters.minRating) return false;
      }
      if (filters.streamOnly) {
        if (!(item.providers ?? []).some(isStreamProvider)) return false;
      }
      return true;
    });
  }, [loadedItems, filters]);

  const availableGenres = useMemo(() => {
    const counts = new Map<number, number>();
    for (const item of loadedItems ?? []) {
      for (const id of item.genreIds ?? []) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    for (const id of filters.genres) if (!counts.has(id)) counts.set(id, 0);
    return getGenreNames([...counts.keys()])
      .map((genre) => ({ id: genre.id, name: genre.name, count: counts.get(genre.id) ?? 0 }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"));
  }, [loadedItems, filters.genres]);

  const showMediaType =
    !!loadedItems?.some((item) => item.mediaType === "movie") &&
    !!loadedItems?.some((item) => item.mediaType === "tv");
  const showRating = !!loadedItems?.some(
    (item) => typeof item.rating === "number" && item.rating > 0,
  );
  const showStream = !!loadedItems?.some((item) => (item.providers ?? []).some(isStreamProvider));

  const suppressAutoLoad = filtersActive && (filteredItems?.length ?? 0) === 0;
  const { loadMoreRef } = useInfiniteScroll(fetchMore, hasMore && !suppressAutoLoad);

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

  useEffect(() => {
    if (!filtersActive) {
      filteredAnnounceRef.current = "";
      return;
    }
    const message = `${filteredItems?.length ?? 0} de ${loadedItems?.length ?? 0} resultados cargados`;
    if (filteredAnnounceRef.current === message) return;
    filteredAnnounceRef.current = message;
    setAnnounce(message);
  }, [filtersActive, filteredItems?.length, loadedItems?.length]);

  const handleClickItem = (item: AudioVisualDto) => {
    if (item.mediaType !== "people" && onItemClick) {
      onItemClick(item);
    }
  };

  const isInitial = items === undefined && !loading && !error;
  const isError = error && items === undefined;
  const isEmpty = items !== undefined && loadedItems?.length === 0;
  const isFilteredEmpty =
    items !== undefined &&
    (loadedItems?.length ?? 0) > 0 &&
    (filteredItems?.length ?? 0) === 0 &&
    filtersActive;

  const filtersBar = (
    <SearchFilters
      filters={filters}
      onChange={onFiltersChange}
      onClear={() => onFiltersChange(DEFAULT_SEARCH_FILTERS)}
      availableGenres={availableGenres}
      showMediaType={showMediaType}
      showRating={showRating}
      showStream={showStream}
    />
  );

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
  } else if (isFilteredEmpty) {
    body = (
      <>
        {filtersBar}
        <div class={styles.stateBox} role="status">
          <h2>Ningún resultado cargado coincide</h2>
          <p>Probá quitar algún filtro o cargá más resultados.</p>
          <div class={styles.stateActions}>
            <button
              type="button"
              class={styles.retryButton}
              onClick={() => onFiltersChange(DEFAULT_SEARCH_FILTERS)}
            >
              Limpiar filtros
            </button>
            {hasMore && (
              <button type="button" class={styles.secondaryButton} onClick={fetchMore}>
                Cargar más resultados
              </button>
            )}
          </div>
        </div>
      </>
    );
  } else {
    body = (
      <>
        {filtersBar}
        <div class={styles.header}>
          <h2>{filtersActive ? "Resultados filtrados" : "Resultados de búsqueda"}</h2>
          <span>
            {filtersActive
              ? `${filteredItems?.length ?? 0} de ${loadedItems?.length ?? 0} cargados`
              : resultCountLabel(total)}
          </span>
        </div>

        <MediaGrid>
          {filteredItems?.map((item) => {
            const inRoulette = isInRoulette(item.id);
            const full = isRouletteFull();

            return (
              <div class={styles.cardWrapper} key={item.id}>
                <a
                  class={styles.cardResult}
                  href={`/detail/${item.mediaType}/${item.id}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    handleClickItem(item);
                  }}
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
                <button
                  type="button"
                  class={clsx(styles.rouletteButton, inRoulette && styles.active)}
                  onClick={() =>
                    toggleRoulette({
                      id: item.id,
                      title: item.title,
                      poster: item.poster ?? null,
                      mediaType: item.mediaType,
                    })
                  }
                  aria-pressed={inRoulette}
                  disabled={!inRoulette && full}
                  aria-label={
                    inRoulette
                      ? `Quitar ${item.title} de la ruleta`
                      : `Agregar ${item.title} a la ruleta`
                  }
                  title={
                    !inRoulette && full
                      ? `La ruleta ya tiene ${MAX_ROULETTE_ENTRIES} opciones`
                      : undefined
                  }
                >
                  <Dices size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            );
          })}
          {hasMore && !(filtersActive && (filteredItems?.length ?? 0) === 0) && (
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
