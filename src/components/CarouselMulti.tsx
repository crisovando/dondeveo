import styles from "./CarouselMulti.module.css";
import type { AudioVisualDto } from "@/shared/types";

interface CarouselMultiProps {
  title: string;
  subtitle: string;
  movies: AudioVisualDto[];
  onClick?: (movie: AudioVisualDto) => void;
  onSeeAll?: () => void;
}

export function CarouselMulti({
  title,
  subtitle,
  movies = [],
  onClick,
  onSeeAll,
}: CarouselMultiProps) {
  if (movies.length === 0) return null;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h3>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {onSeeAll && (
          <button className={styles.viewAllBtn} onClick={() => onSeeAll?.()}>
            Ver todo
          </button>
        )}
      </header>

      <div className={styles.carousel}>
        {movies.map((movie) => (
          <article key={movie.id} className={styles.card} onClick={() => onClick?.(movie)}>
            <figure className={styles.posterWrapper}>
              <img
                src={
                  movie.poster
                    ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                    : "/placeholder-poster.png"
                }
                alt={movie.title}
                className={styles.image}
                loading="lazy"
              />
            </figure>

            <h4 className={styles.movieTitle}>{movie.title}</h4>

            <div className={styles.meta}>
              <span className={styles.genreList}>
                {movie.genres.map((g) => g?.name).join(", ")}
              </span>
              <span className={styles.dot}></span>
              <span>{movie.releaseDate?.split("-")[0]}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
