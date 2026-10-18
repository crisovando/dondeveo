import type { ExploreCollection } from "@/shared/types";
import styles from "./ExploreCollections.module.css";
import { Spinner } from "@/components/Spinner";

interface ExploreCollectionsProps {
  collections: ExploreCollection[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSelect: () => void;
}

const GROUP_LABEL: Record<string, string> = {
  movie: "Películas",
  tv: "Series",
};

export function ExploreCollections({
  collections,
  loading,
  error,
  onRetry,
  onSelect,
}: ExploreCollectionsProps) {
  if (loading && collections.length === 0) {
    return (
      <div class={styles.stateBox} role="status">
        <Spinner inline />
        <p>Cargando colecciones…</p>
      </div>
    );
  }

  if (error && collections.length === 0) {
    return (
      <div class={styles.stateBox} role="alert">
        <h2>No pudimos cargar las colecciones</h2>
        <p>Revisá tu conexión y volvé a intentarlo.</p>
        <button type="button" class={styles.retryButton} onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  const groups = (["movie", "tv"] as const)
    .map((mediaType) => ({
      mediaType,
      items: collections.filter((collection) => collection.mediaType === mediaType),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section class={styles.collections} aria-label="Colecciones para explorar">
      <header class={styles.header}>
        <h1>Explorá qué ver</h1>
        <p>Elegí un punto de partida y filtrá desde ahí.</p>
      </header>

      {groups.map((group) => (
        <section
          class={styles.group}
          key={group.mediaType}
          aria-labelledby={`explore-group-${group.mediaType}`}
        >
          <h2 class={styles.groupHeading} id={`explore-group-${group.mediaType}`}>
            {GROUP_LABEL[group.mediaType]}
          </h2>

          <div class={styles.grid}>
            {group.items.map((collection) => (
              <a
                key={collection.id}
                class={styles.tile}
                href={`/explore?collection=${collection.id}`}
                onClick={onSelect}
              >
                <h3 class={styles.tileTitle}>{collection.title}</h3>
                <p class={styles.tileSubtitle}>{collection.subtitle}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
