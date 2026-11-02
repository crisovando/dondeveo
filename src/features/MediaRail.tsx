import { useRef } from "preact/hooks";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { ImgTmdb } from "@/components/ImgTmdb";
import type { AudioVisualDto } from "@/shared/types";
import styles from "./MediaRail.module.css";

interface MediaRailProps {
  title: string;
  subtitle: string;
  items: AudioVisualDto[];
  onSelect: (item: AudioVisualDto) => void;
}

export function MediaRail({ title, subtitle, items, onSelect }: MediaRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scrollByTrack = (dir: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const step = Math.round(track.clientWidth * 0.8);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: dir === "next" ? step : -step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section class={styles.rail}>
      <header class={styles.railHeader}>
        <h2 class={styles.railTitle}>{title}</h2>
        <p class={styles.railSubtitle}>{subtitle}</p>
      </header>

      <div class={styles.railBody}>
        <button
          type="button"
          class={`${styles.railNav} ${styles.railNavPrev}`}
          onClick={() => scrollByTrack("prev")}
          aria-label={`Ver anteriores de ${title}`}
        >
          <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div class={styles.railTrack} ref={trackRef}>
          {items.map((item) => (
            <a
              key={`${item.mediaType}:${item.id}`}
              class={styles.card}
              href={`/detail/${item.mediaType}/${item.id}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                onSelect(item);
              }}
            >
              {/* The poster is decorative; the visible title is the link's only
                  accessible name, so the fallback text must not leak into it. */}
              <div class={styles.poster} aria-hidden="true">
                {item.poster ? (
                  <ImgTmdb
                    type="poster"
                    size="w342"
                    sizes="(max-width: 640px) 120px, 150px"
                    src={item.poster}
                    alt=""
                  />
                ) : (
                  <div class={styles.posterFallback} />
                )}
              </div>
              <h3 class={styles.cardTitle}>{item.title}</h3>
            </a>
          ))}
        </div>

        <button
          type="button"
          class={`${styles.railNav} ${styles.railNavNext}`}
          onClick={() => scrollByTrack("next")}
          aria-label={`Ver siguientes de ${title}`}
        >
          <ChevronRight size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
