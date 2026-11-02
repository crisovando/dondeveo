import { useCallback, useState } from "preact/hooks";
import { VNode } from "preact";
import { Dices, Minus, Play, Plus, Star } from "lucide-preact";
import { ButtonHero } from "@/components/ButtonHero";
import { Hero } from "@/components/Hero";
import { AudioVisualDto, DetailItem } from "@/shared/types";
import { isFavorite, removeFromFavorites } from "@/signals/favorites";
import { isInRoulette, isRouletteFull, toggleRoulette } from "@/signals/roulette";
import { AddFavoriteModal } from "@/components/AddFavoriteModal";
import { formatRuntime, formatSeasonCount, mediaTypeLabel } from "@/helpers/utils";
import { HeroProviders } from "./HeroProviders";
import { TrailerModal } from "./TrailerModal";
import styles from "./HeroDetail.module.css";

interface HeroDetailProps {
  movie: Partial<DetailItem>;
}

export function HeroDetail({ movie }: HeroDetailProps) {
  const [showModal, setShowModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  // movie is Partial<DetailItem>; the id is only present when the page has
  // enough data to render (guarded by hasData in Detail.tsx), so keep the
  // undefined case out of the favorite handlers and button state.
  const id = movie.id;

  const handleFavoriteClick = () => {
    if (id === undefined) return;
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      setShowModal(true);
    }
  };

  const handleRouletteClick = () => {
    if (id === undefined) return;
    toggleRoulette({
      id,
      title: movie.title ?? "",
      poster: movie.poster ?? null,
      mediaType: movie.mediaType ?? "movie",
    });
  };

  const closeTrailer = useCallback(() => setShowTrailer(false), []);

  const facts: Array<string | VNode> = [];
  if (movie.mediaType) facts.push(mediaTypeLabel(movie.mediaType));
  const year = movie.releaseDate?.slice(0, 4);
  if (year) facts.push(year);
  if (movie.rating) {
    facts.push(
      <span class={styles.rating}>
        <Star size={12} strokeWidth={2} aria-hidden="true" />
        {movie.rating.toFixed(1)}
      </span>,
    );
  }
  if (movie.mediaType === "tv") {
    if (movie.seasonsCount) facts.push(formatSeasonCount(movie.seasonsCount));
  } else if (movie.duration) {
    facts.push(formatRuntime(movie.duration));
  }
  if (movie.contentRating) facts.push(movie.contentRating);
  const genres = movie.genres?.map((genre) => genre.name).join(" / ");
  if (genres) facts.push(genres);

  const hasStreamingProviders = (movie.providers?.length ?? 0) > 0;

  return (
    <>
      <Hero style={{ viewTransitionName: `hero-item` }} class={styles.hero}>
        <Hero.Media
          src={movie.poster || ""}
          alt={movie.title}
          backdrop={movie.backdrop}
          fetchPriority="high"
          loading="eager"
          style={{ viewTransitionName: `media-${movie.id}` }}
        />
        <Hero.Overlay position="left">
          <Hero.Attributes class={styles.attributes}>
            {facts.map((fact, index) => (
              <>
                {index > 0 && (
                  <span class={styles.separator} aria-hidden="true">
                    ·
                  </span>
                )}
                <span class={styles.fact}>{fact}</span>
              </>
            ))}
          </Hero.Attributes>
          <Hero.Title style={{ viewTransitionName: `title-${movie.id}` }}>{movie.title}</Hero.Title>
          {movie.tagline && <p class={styles.tagline}>{movie.tagline}</p>}
          {hasStreamingProviders && <HeroProviders providers={movie.providers} />}
          <Hero.Actions>
            <ButtonHero
              variant="secondary"
              style={{ viewTransitionName: `button-${movie.id}` }}
              onClick={handleFavoriteClick}
            >
              {id !== undefined && isFavorite(id) ? <Minus /> : <Plus />}
              Favoritos
            </ButtonHero>
            <ButtonHero
              variant={id !== undefined && isInRoulette(id) ? "primary" : "secondary"}
              icon={<Dices />}
              onClick={handleRouletteClick}
              aria-pressed={id !== undefined && isInRoulette(id)}
              disabled={id !== undefined && !isInRoulette(id) && isRouletteFull()}
            >
              Ruleta
            </ButtonHero>
            {movie.trailer && (
              <ButtonHero variant="secondary" icon={<Play />} onClick={() => setShowTrailer(true)}>
                Tráiler
              </ButtonHero>
            )}
          </Hero.Actions>
        </Hero.Overlay>
      </Hero>

      {showTrailer && movie.trailer && (
        <TrailerModal
          videoKey={movie.trailer.key}
          title={movie.title ?? ""}
          onClose={closeTrailer}
        />
      )}

      {showModal && (
        <AddFavoriteModal movie={movie as AudioVisualDto} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
