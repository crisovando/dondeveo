import { useLocation } from "preact-iso";
import { ImgTmdb } from "@/components/ImgTmdb";
import { MediaGrid } from "@/components/MediaGrid";
import { navigateToDetail } from "@/helpers/navigation";
import type { AudioVisualDto } from "@/shared/types";
import styles from "./GridRow.module.css";

interface GridRowProps {
  title: string;
  subtitle?: string;
  movies: AudioVisualDto[];
}

export function GridRow({ title, subtitle, movies }: GridRowProps) {
  const { route } = useLocation();

  if (movies.length === 0) return null;

  const handleClickItem = (movie: AudioVisualDto) => {
    navigateToDetail(movie, route);
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </header>

      <MediaGrid>
        {movies.map((movie) => (
          <a
            key={movie.id}
            className={styles.card}
            href={`/detail/${movie.mediaType}/${movie.id}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              handleClickItem(movie);
            }}
          >
            <ImgTmdb
              type="poster"
              layout="poster-grid"
              size="w342"
              src={movie.poster}
              className={styles.poster}
              alt={`Póster de ${movie.title}`}
              withSkeleton
            />
            <h3 className={styles.title}>{movie.title}</h3>
          </a>
        ))}
      </MediaGrid>
    </section>
  );
}
