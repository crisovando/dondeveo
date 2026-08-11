import { useLocation } from "preact-iso";
import { navigateToDetail } from "@/helpers/navigation";
import { ImgTmdb } from "@/components/ImgTmdb";
import type { HistoryItem } from "@/signals/history";
import { formatDate } from "@/helpers/utils";
import styles from "./HistoryCard.module.css";

export function HistoryCard({ item }: { item: HistoryItem }) {
  const { route } = useLocation();

  const handleClickMovie = (movie: HistoryItem) => {
    navigateToDetail(movie, route);
  };

  return (
    <article class={styles.card} onClick={() => handleClickMovie(item)}>
      <div class={styles.posterWrapper}>
        <ImgTmdb src={item.poster || ""} alt={item.title} type="poster" layout="poster-grid" />
      </div>
      <div class={styles.info}>
        <div class={styles.textWrapper}>
          <div class={styles.genres}>{item.genres?.map((g) => g.name).join(", ")}</div>
          <h3 class={styles.title}>{item.title}</h3>
        </div>
        <span class={styles.lastSeen}>
          Última visualización: {item.timestamp ? formatDate(item.timestamp) : ""}
        </span>
      </div>
    </article>
  );
}
