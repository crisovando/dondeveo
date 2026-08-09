import { useLocation } from "preact-iso";
import { Minus, Plus } from "lucide-preact";
import { AudioVisualDto } from "@/shared/types";
import { Hero } from "@/components/Hero";
import { ButtonHero } from "@/components/ButtonHero";
import { navigateToDetail } from "@/helpers/navigation";
import { useState, useEffect, useRef } from "preact/hooks";
import { isFavorite, removeFromFavorites } from "@/signals/favorites";
import { AddFavoriteModal } from "@/components/AddFavoriteModal";

interface HeroHomeProps {
  movies: AudioVisualDto[];
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
                <Hero.Title
                  style={{
                    viewTransitionName: activeId === movie.id ? `title-${movie.id}` : "none",
                  }}
                >
                  {movie.title}
                </Hero.Title>
                <Hero.Description>{movie.overview}</Hero.Description>
                <Hero.Actions>
                  <ButtonHero variant="primary" onClick={() => navigateToDetail(movie, route)}>
                    ▶ Ver más
                  </ButtonHero>
                  <ButtonHero
                    variant="secondary"
                    style={{
                      viewTransitionName: activeId === movie.id ? `button-${movie.id}` : "none",
                    }}
                    onClick={() => handleFavoriteClick(movie)}
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

      {modalMovie && <AddFavoriteModal movie={modalMovie} onClose={() => setModalMovie(null)} />}
    </>
  );
}
