import { useRef } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { CardProviders } from "@/features/CardProviders";
import { navigateToDetail } from "@/helpers/navigation";
import { useProvidersMap } from "@/hooks/useProvidersMap";
import type { AudioVisualDto } from "@/shared/types";
import { Img } from "@/components/Img";
import styles from "./TopTenRow.module.css";

interface TopTenRowProps {
  movies: AudioVisualDto[];
  title?: string;
  subtitle?: string;
}

const MAX_ITEMS = 10;

export function TopTenRow({ movies = [], title = "Top 10", subtitle }: TopTenRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { route } = useLocation();
  const providersMap = useProvidersMap(movies, true);

  if (movies.length === 0) return null;

  const scrollByTrack = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "next" ? Math.round(el.clientWidth * 0.8) : -Math.round(el.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  const handleClickItem = (movie: AudioVisualDto) => {
    navigateToDetail(movie, route);
  };

  const visible = movies.slice(0, MAX_ITEMS);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div>
            <h2>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
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
          {visible.map((movie, index) => {
            const backdrop = movie.backdrop ?? undefined;
            const label = `Póster de ${movie.title}`;

            return (
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
                {backdrop ? (
                  <Img
                    type="backdrop"
                    size="w780"
                    src={backdrop}
                    alt={label}
                    class={styles.media}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 60vw, 480px"
                  />
                ) : null}
                <span className={styles.scrim} aria-hidden="true" />
                <span className={styles.numeral} aria-hidden="true">
                  {index + 1}
                </span>
                <div className={styles.content}>
                  <h3 className={styles.title}>{movie.title}</h3>
                  <CardProviders providers={providersMap[`${movie.mediaType}:${movie.id}`] ?? []} />
                </div>
              </a>
            );
          })}
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
