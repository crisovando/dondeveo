import { ComponentChildren } from "preact";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import styles from "./Carousel.module.css";
import { useRef } from "preact/hooks";

interface SlideProps {
  title: string;
  description: string;
  imgSrc: string;
}

const BASE_PATH_IMG = "https://image.tmdb.org/t/p/w500";

export function Slide({ title, description, imgSrc }: SlideProps) {
  return (
    <div class={styles.slide}>
      <img src={`${BASE_PATH_IMG}${imgSrc}`} class={styles.media} />

      <div class={styles.overlay}>
        <h2>{title}</h2>
        <p>{description}</p>
        <div class={styles.actions}>
          <button>Ver más</button>
          <button class={styles.secondary}>Agregar</button>
        </div>
      </div>
    </div>
  );
}

interface CarouselProps {
  children: ComponentChildren;
  full?: boolean;
}

export function Carousel({ children, full = false }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;

    el.scrollBy({
      left: dir === "next" ? el.clientWidth : -el.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className={clsx(styles.wrapper, full && styles.full)}>
      <button
        class={`${styles.nav} ${styles.prev}`}
        onClick={() => scroll("prev")}
        aria-label="Anterior"
      >
        <ChevronLeft size={20} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <div class={styles.carousel} ref={ref}>
        <div class={styles.track}>{children}</div>
      </div>

      <button
        class={`${styles.nav} ${styles.next}`}
        onClick={() => scroll("next")}
        aria-label="Siguiente"
      >
        <ChevronRight size={20} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
