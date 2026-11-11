import { useEffect, useRef, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { CalendarHeart, X } from "lucide-preact";
import { EmptyRow } from "@/components/EmptyRow";
import { MarkedHeader } from "@/components/MarkedHeader";
import styles from "./MustSee.module.css";
import { MediaGrid } from "@/components/MediaGrid";
import { navigateToDetail } from "@/helpers/navigation";
import { addToFavorites, getFavorites, removeFromFavorites } from "@/signals/favorites";
import type { FavoriteEntry } from "@/shared/types";
import { ImgTmdb } from "@/components/ImgTmdb";

const UNDO_WINDOW_MS = 6000;

export function MustSee() {
  const { route } = useLocation();
  const favorites = getFavorites();
  const [removed, setRemoved] = useState<FavoriteEntry | null>(null);
  const dismissTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(dismissTimer.current), []);

  const handleRemove = (favorite: FavoriteEntry) => {
    removeFromFavorites(favorite.id);
    setRemoved(favorite);
    window.clearTimeout(dismissTimer.current);
    dismissTimer.current = window.setTimeout(() => setRemoved(null), UNDO_WINDOW_MS);
  };

  const handleUndo = () => {
    if (!removed) return;
    addToFavorites(removed);
    setRemoved(null);
    window.clearTimeout(dismissTimer.current);
  };

  return (
    <section class={styles.container}>
      {favorites.length === 0 ? (
        <EmptyRow
          title="No te la puedes perder"
          subtitle="Las películas que tienes que ver"
          icon={<CalendarHeart size={28} strokeWidth={1.75} />}
          heading="Todavía no guardaste ninguna"
          description="Guardá una peli o serie desde cualquier detalle y va a aparecer acá. Si querés, podés agendarla con fecha y un comentario."
          action="Descubrí películas y series"
          onAction={() => route("/")}
        />
      ) : (
        <>
          <MarkedHeader
            title="No te la puedes perder"
            subtitle="Las películas que tienes que ver"
          />

          <MediaGrid>
            {favorites.map((f) => (
              <div key={f.id} class={styles.item}>
                <a
                  class={styles.group}
                  href={`/detail/${f.mediaType}/${f.id}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    navigateToDetail(f, route);
                  }}
                >
                  <ImgTmdb
                    src={f.poster || ""}
                    alt={f.title}
                    type="poster"
                    size="w342"
                    layout="poster-grid"
                    style={{ viewTransitionName: `media-${f.id}` }}
                  />
                  <div class={styles.gradient}></div>
                  <div class={styles.footer}>
                    <span class={styles.genre}>{f.genres?.map((g) => g.name).join(", ")}</span>
                    <h3 class={styles.title}>{f.title}</h3>
                  </div>
                </a>
                <button
                  class={styles.removeButton}
                  type="button"
                  aria-label={`Quitar ${f.title} de favoritos`}
                  onClick={() => handleRemove(f)}
                >
                  <X size={18} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            ))}
          </MediaGrid>
        </>
      )}

      <div class={styles.statusRegion} role="status" aria-live="polite">
        {removed && (
          <div class={styles.undo}>
            <span>Quitado de favoritos</span>
            <button class={styles.undoButton} type="button" onClick={handleUndo}>
              Deshacer
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
