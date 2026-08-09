import { useState } from "preact/hooks";
import { Minus, Plus } from "lucide-preact";
import { ButtonHero } from "@/components/ButtonHero";
import { Hero } from "@/components/Hero";
import { AudioVisualDto, DetailItem } from "@/shared/types";
import { isFavorite, removeFromFavorites } from "@/signals/favorites";
import { AddFavoriteModal } from "@/components/AddFavoriteModal";
import styles from "./HeroDetail.module.css";

interface HeroDetailProps {
  movie: Partial<DetailItem>;
}

export function HeroDetail({ movie }: HeroDetailProps) {
  const [showModal, setShowModal] = useState(false);

  const handleFavoriteClick = () => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id!);
    } else {
      setShowModal(true);
    }
  };

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
          <Hero.Title style={{ viewTransitionName: `title-${movie.id}` }}>{movie.title}</Hero.Title>
          <Hero.Attributes>
            <span>{movie.genres?.map((g) => g.name).join(" / ")}</span>
          </Hero.Attributes>
          <Hero.Actions>
            <ButtonHero
              variant="secondary"
              style={{ viewTransitionName: `button-${movie.id}` }}
              onClick={handleFavoriteClick}
            >
              {isFavorite(movie.id) ? <Minus /> : <Plus />}
              Favoritos
            </ButtonHero>
          </Hero.Actions>
        </Hero.Overlay>
      </Hero>

      {showModal && (
        <AddFavoriteModal movie={movie as AudioVisualDto} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
