import { MarkedHeader } from "@/components/MarkedHeader";
import styles from "./MustSee.module.css";
import { MediaGrid } from "@/components/MediaGrid";
import { getFavorites, removeFromFavorites } from "@/signals/favorites";
import { ImgTmdb } from "@/components/ImgTmdb";
import { Eye, X } from "lucide-preact";

export function MustSee() {
  const favorites = getFavorites();

  return (
    <section class={styles.container}>
      <MarkedHeader title="No te la puedes perder" subtitle="Las películas que tienes que ver" />

      <MediaGrid>
        {favorites.map((f) => (
          <div key={f.id} class={styles.group}>
            <div class={styles.buttonContainer}>
              <button class={styles.button} onClick={() => removeFromFavorites(f.id)}>
                <X size={48} strokeWidth={2.5} />
              </button>
            </div>
            <ImgTmdb src={f.poster || ""} alt={f.title} type="poster" size="w342" />
            <div class={styles.gradient}></div>
            <div class={styles.footer}>
              <span class={styles.genre}>{f.genres?.map((g) => g.name).join(", ")}</span>
              <h3 class={styles.title}>{f.title}</h3>
              <button class={styles.buttonVerDetalles} type="button">
                <Eye /> Ver
              </button>
            </div>
          </div>
        ))}
      </MediaGrid>
    </section>
  );
}
