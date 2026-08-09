import { useLocation } from "preact-iso";
import { Play, Plus, Minus, Star } from "lucide-preact";
import { AudioVisualDto } from "@/shared/types";
import { Hero } from "@/components/Hero";
import { ButtonHero } from "@/components/ButtonHero";
import { navigateToDetail } from "@/helpers/navigation";
import { useState, useEffect, useRef } from "preact/hooks";
import { isFavorite, removeFromFavorites } from "@/signals/favorites";
import { AddFavoriteModal } from "@/components/AddFavoriteModal";
import styles from "./HeroHome.module.css";

interface HeroHomeProps {
  movies: AudioVisualDto[];
}

function mediaTypeLabel(mediaType: string) {
  if (mediaType === "movie") return "Película";
  if (mediaType === "tv") return "Serie";
  return mediaType;
}

export function HeroHome({ movies }: HeroHomeProps) {
  const [activeId, setActiveId] = useState<number | null>(movies[0]?.id ?? null);
  const [modalMovie, setModalMovie] = useState<AudioVisualDto | null>(null);
  const { route } = useLocation();
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (movies.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-slide-id"));
            if (id) setActiveId(id);
          }
        }
      },
      { threshold: 0.6 },
    );

    slideRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [movies]);

  const handleFavoriteClick = (item: AudioVisualDto) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      setModalMovie(item);
    }
  };

  const activeMovie = movies.find((m) => m.id === activeId) ?? null;

  return (
    <>
      <Hero style={{ viewTransitionName: `hero-item` }}>
        <Hero.Carousel>
          {movies.map((movie, index) => (
            <Hero.Slide
              key={movie.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) slideRefs.current.set(movie.id, el);
                else slideRefs.current.delete(movie.id);
              }}
              data-slide-id={movie.id}
              inert={activeId !== movie.id ? true : undefined}
            >
              <Hero.Media
                src={movie.poster}
                backdrop={movie.backdrop}
                alt={movie.title}
                fetchPriority={index === 0 ? "high" : "low"}
                style={{
                  viewTransitionName: activeId === movie.id ? `media-${movie.id}` : "none",
                }}
              />
              <Hero.Overlay position="left">
                <Hero.Attributes>
                  {movie.mediaType && <span>{mediaTypeLabel(movie.mediaType)}</span>}
                  {movie.releaseDate && <span>{movie.releaseDate.split("-")[0]}</span>}
                  {movie.rating != null && (
                    <span class={styles.rating}>
                      <Star size={14} strokeWidth={2} aria-hidden="true" />
                      {movie.rating.toFixed(1)}
                    </span>
                  )}
                </Hero.Attributes>
                <Hero.Title
                  level={activeId === movie.id ? "h1" : "h2"}
                  id={`hero-title-${movie.id}`}
                  style={{
                    viewTransitionName: activeId === movie.id ? `title-${movie.id}` : "none",
                  }}
                >
                  {movie.title}
                </Hero.Title>
                <Hero.Description>{movie.overview}</Hero.Description>
                <Hero.Actions>
                  <ButtonHero
                    variant="primary"
                    onClick={() => navigateToDetail(movie, route)}
                    aria-label={`Ir al detalle de ${movie.title}`}
                  >
                    <Play size={16} strokeWidth={2.5} aria-hidden="true" />
                    Ver más
                  </ButtonHero>
                  <ButtonHero
                    variant="secondary"
                    style={{
                      viewTransitionName: activeId === movie.id ? `button-${movie.id}` : "none",
                    }}
                    onClick={() => handleFavoriteClick(movie)}
                    aria-label={
                      isFavorite(movie.id)
                        ? `Quitar ${movie.title} de favoritos`
                        : `Agregar ${movie.title} a favoritos`
                    }
                  >
                    {isFavorite(movie.id) ? <Minus /> : <Plus />}
                    Favoritos
                  </ButtonHero>
                </Hero.Actions>
              </Hero.Overlay>
            </Hero.Slide>
          ))}
        </Hero.Carousel>
      </Hero>
      <p class="sr-only" aria-live="polite">
        {activeMovie ? `Ahora en portada: ${activeMovie.title}` : ""}
      </p>

      {modalMovie && <AddFavoriteModal movie={modalMovie} onClose={() => setModalMovie(null)} />}
    </>
  );
}