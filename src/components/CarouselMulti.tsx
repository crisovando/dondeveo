import { useRef } from "preact/hooks";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { Img } from "./Img";
import styles from "./CarouselMulti.module.css";
import type { AudioVisualDto } from "@/shared/types";
import { useProvidersMap } from "@/hooks/useProvidersMap";
import { CardProviders } from "@/features/CardProviders";

interface CarouselMultiProps {
  title: string;
  subtitle: string;
  movies: AudioVisualDto[];
  logo?: { src: string; alt: string };
  onClick?: (movie: AudioVisualDto) => void;
  onSeeAll?: () => void;
  showProviders?: boolean;
}

const LOGO_SRC = "https://image.tmdb.org/t/p/w92";

export function CarouselMulti({
  title,
  subtitle,
  movies = [],
  logo,
  onClick,
  onSeeAll,
  showProviders = true,
}: CarouselMultiProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const providersMap = useProvidersMap(movies, showProviders);

  if (movies.length === 0) return null;

  const scrollByTrack = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "next" ? Math.round(el.clientWidth * 0.8) : -Math.round(el.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          {logo?.src && (
            <span className={styles.logoWrap}>
              <img
                src={`${LOGO_SRC}${logo.src}`}
                alt={logo.alt}
                className={styles.logo}
                width="110"
                height="32"
                loading="lazy"
                decoding="async"
              />
            </span>
          )}
          <div>
            <h2>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        {onSeeAll && (
          <button className={styles.viewAllBtn} onClick={() => onSeeAll?.()}>
            Ver todo
          </button>
        )}
      </header>

      <div className={styles.rail}>
        <button
          type="button"
          className={`${styles.nav} ${styles.navPrev}`}
          onClick={() => scrollByTrack("prev")}
          aria-label={`Ver anteriores de ${title}`}
        >
          <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div className={styles.carousel} ref={trackRef}>
          {movies.map((movie) => (
            <a
              key={movie.id}
              className={styles.card}
              href={`/detail/${movie.mediaType}/${movie.id}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                onClick?.(movie);
              }}
            >
              <figure className={styles.posterWrapper}>
                {movie.poster ? (
                  <Img
                    type="poster"
                    size="w342"
                    src={movie.poster}
                    alt={`Póster de ${movie.title}`}
                    className={styles.image}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 120px, 150px"
                  />
                ) : null}
              </figure>

              <h3 className={styles.movieTitle}>{movie.title}</h3>

              <div className={styles.meta}>
                <span className={styles.genreList}>
                  {movie.genres?.map((g) => g?.name).join(", ")}
                </span>
                <span className={styles.dot}></span>
                <span>{movie.releaseDate?.split("-")[0]}</span>
              </div>
              {showProviders && (
                <CardProviders
                  providers={providersMap[`${movie.mediaType}:${movie.id}`] ?? []}
                />
              )}
            </a>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.nav} ${styles.navNext}`}
          onClick={() => scrollByTrack("next")}
          aria-label={`Ver siguientes de ${title}`}
        >
          <ChevronRight size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}