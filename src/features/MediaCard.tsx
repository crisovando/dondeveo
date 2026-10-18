import type { AudioVisualDto, ProviderWithType } from "@/shared/types";
import { Dices, Star } from "lucide-preact";
import clsx from "clsx";
import styles from "./MediaCard.module.css";
import { ImgTmdb } from "@/components/ImgTmdb";
import { CardProviders } from "@/features/CardProviders";
import { isStreamProvider } from "@/hooks/useProvidersMap";
import {
  MAX_ROULETTE_ENTRIES,
  isInRoulette,
  isRouletteFull,
  toggleRoulette,
} from "@/signals/roulette";

interface MediaCardProps {
  item: AudioVisualDto;
  onItemClick?: (item: AudioVisualDto) => void;
}

const MEDIA_TYPE_LABEL: Record<string, string> = {
  movie: "Película",
  tv: "Serie",
};

function Availability({ providers }: { providers?: ProviderWithType[] }) {
  const stream = (providers ?? []).filter(isStreamProvider);

  if (stream.length > 0) {
    return <CardProviders providers={stream} />;
  }

  return (
    <div class={styles.availability}>
      {providers && providers.length > 0 ? "Solo en alquiler o compra" : "Aún no disponible en AR"}
    </div>
  );
}

export function MediaCard({ item, onItemClick }: MediaCardProps) {
  const inRoulette = isInRoulette(item.id);
  const full = isRouletteFull();

  return (
    <div class={styles.cardWrapper}>
      <a
        class={styles.cardResult}
        href={`/detail/${item.mediaType}/${item.id}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          if (item.mediaType !== "people") onItemClick?.(item);
        }}
      >
        <ImgTmdb
          type="poster"
          layout="poster-grid"
          src={item.poster}
          class={styles.poster}
          alt={`Póster de ${item.title}`}
          withSkeleton
          style={{ viewTransitionName: `media-${item.id}` }}
        />
        <h3 class={styles.title}>{item.title}</h3>
        <div class={styles.meta}>
          <span class={styles.metaType}>{MEDIA_TYPE_LABEL[item.mediaType]}</span>
          {typeof item.rating === "number" && item.rating > 0 && (
            <span class={styles.metaRating}>
              <Star size={12} strokeWidth={2} aria-hidden="true" />
              {item.rating.toFixed(1)}
            </span>
          )}
          {item.releaseDate && <span>{item.releaseDate.slice(0, 4)}</span>}
        </div>
        <Availability providers={item.providers} />
      </a>
      <button
        type="button"
        class={clsx(styles.rouletteButton, inRoulette && styles.active)}
        onClick={() =>
          toggleRoulette({
            id: item.id,
            title: item.title,
            poster: item.poster ?? null,
            mediaType: item.mediaType,
          })
        }
        aria-pressed={inRoulette}
        disabled={!inRoulette && full}
        aria-label={
          inRoulette ? `Quitar ${item.title} de la ruleta` : `Agregar ${item.title} a la ruleta`
        }
        title={
          !inRoulette && full ? `La ruleta ya tiene ${MAX_ROULETTE_ENTRIES} opciones` : undefined
        }
      >
        <Dices size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
