import { ImgTmdb } from "@/components/ImgTmdb";
import type { SeasonSummary } from "@/shared/types";
import { Rail } from "./Rail";
import styles from "./SeasonsRail.module.css";

interface SeasonsRailProps {
  seasons: SeasonSummary[];
}

function seasonMeta(season: SeasonSummary): string {
  const parts: string[] = [];
  if (season.episodeCount > 0) {
    parts.push(season.episodeCount === 1 ? "1 episodio" : `${season.episodeCount} episodios`);
  }
  const year = season.airDate?.slice(0, 4);
  if (year) parts.push(year);
  return parts.join(" · ");
}

export function SeasonsRail({ seasons }: SeasonsRailProps) {
  if (seasons.length === 0) return null;

  return (
    <Rail title="Temporadas" subtitle="La serie, temporada por temporada">
      {seasons.map((season) => {
        const meta = seasonMeta(season);

        return (
          <article class={styles.card} key={season.number}>
            <div class={styles.poster} aria-hidden="true">
              {season.poster ? (
                <ImgTmdb
                  type="poster"
                  size="w342"
                  sizes="(max-width: 640px) 120px, 150px"
                  src={season.poster}
                  alt=""
                />
              ) : (
                <div class={styles.posterFallback}>{season.number}</div>
              )}
            </div>
            <h3 class={styles.cardTitle}>{season.name || `Temporada ${season.number}`}</h3>
            {meta && <p class={styles.meta}>{meta}</p>}
          </article>
        );
      })}
    </Rail>
  );
}
