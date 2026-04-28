import { ComponentChildren, CSSProperties, Ref } from "preact";
import { forwardRef } from "preact/compat";
import clsx from "clsx";
import styles from "./Hero.module.css";
import { Img, ImgTmdbProps } from "./Img";
import { Carousel as BaseCarousel } from "./Carousel";

interface BaseProps {
  children: ComponentChildren;
  class?: string;
  style?: CSSProperties;
}

function HeroRoot({ children, class: className, style }: BaseProps) {
  return (
    <section class={clsx(styles.hero, className)} style={style as any}>
      {children}
    </section>
  );
}

interface CarouselProps {
  children: ComponentChildren;
  full?: boolean;
}
function HeroCarousel({ children, full = true }: CarouselProps) {
  return <BaseCarousel full={full}>{children}</BaseCarousel>;
}

interface SlideProps extends BaseProps {
  [key: string]: unknown;
}
const HeroSlide = forwardRef<HTMLDivElement, SlideProps>(
  ({ children, class: className, ...rest }, ref) => (
    <div ref={ref as Ref<HTMLDivElement>} class={clsx(styles.slide, className)} {...rest}>
      {children}
    </div>
  ),
);

interface MediaProps extends ImgTmdbProps {
  backdrop?: string | null;
  style?: CSSProperties;
}
function HeroMedia({ backdrop, class: className, style, ...props }: MediaProps) {
  return (
    <picture class={clsx(styles.media, className)} style={style as any}>
      {backdrop && (
        <source
          media="(min-width: 768px)"
          srcSet={`https://image.tmdb.org/t/p/w780${backdrop} 780w, https://image.tmdb.org/t/p/w1280${backdrop} 1280w`}
          sizes="100vw"
        />
      )}
      <Img type="backdrop" class={clsx(styles.media, className)} size="w342" {...props} />
    </picture>
  );
}

interface OverlayProps extends BaseProps {
  position?: "left" | "bottom" | "center";
}
function HeroOverlay({ children, position = "bottom", class: className, style }: OverlayProps) {
  const positionClass = position === "center" ? styles.overlayCenter : "";

  return (
    <div class={clsx(styles.overlay, positionClass, className)} style={style as any}>
      <div class={styles.overlayContent}>{children}</div>
    </div>
  );
}

function HeroTitle({ children, class: className, style }: BaseProps) {
  return (
    <h1 class={clsx(styles.title, className)} style={style as any}>
      {children}
    </h1>
  );
}

function HeroDescription({ children, class: className }: BaseProps) {
  return <p class={clsx(styles.description, className)}>{children}</p>;
}

function HeroActions({ children, class: className }: BaseProps) {
  return <div class={clsx(styles.actions, className)}>{children}</div>;
}

function HeroAttributes({ children, class: className }: BaseProps) {
  return <div class={clsx(styles.attributes, className)}>{children}</div>;
}

export const Hero = Object.assign(HeroRoot, {
  Carousel: HeroCarousel,
  Slide: HeroSlide,
  Media: HeroMedia,
  Overlay: HeroOverlay,
  Title: HeroTitle,
  Description: HeroDescription,
  Actions: HeroActions,
  Attributes: HeroAttributes,
});
