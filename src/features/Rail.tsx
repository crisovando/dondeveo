import { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import styles from "./Rail.module.css";

interface RailProps {
  title: string;
  subtitle: string;
  children: ComponentChildren;
}

export function Rail({ title, subtitle, children }: RailProps) {
  const trackRef = useRef<HTMLDivElement>(null);

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
          {children}
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
