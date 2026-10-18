import type { ExploreCollection } from "@/shared/types";
import styles from "./ExploreCollections.module.css";
import { Spinner } from "@/components/Spinner";

interface ExploreCollectionsProps {
  collections: ExploreCollection[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

const MEDIA_TYPE_LABEL: Record<string, string> = {
  movie: "Películas",
  tv: "Series",
};

export function ExploreCollections({
  collections,
  loading,
  error,
  onRetry,
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

  return (
    <section class={styles.collections} aria-label="Colecciones para explorar">
      <header class={styles.header}>
        <h1>Explorá qué ver</h1>
        <p>Elegí un punto de partida y filtrá desde ahí.</p>
      </header>

      <div class={styles.grid}>
        {collections.map((collection) => (
          <a key={collection.id} class={styles.tile} href={`/explore?collection=${collection.id}`}>
            <span class={styles.tileType}>{MEDIA_TYPE_LABEL[collection.mediaType]}</span>
            <h2 class={styles.tileTitle}>{collection.title}</h2>
            <p class={styles.tileSubtitle}>{collection.subtitle}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
