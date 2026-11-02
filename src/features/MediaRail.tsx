import { ImgTmdb } from "@/components/ImgTmdb";
import type { AudioVisualDto } from "@/shared/types";
import { Rail } from "./Rail";
import styles from "./MediaRail.module.css";

interface MediaRailProps {
  title: string;
  subtitle: string;
  items: AudioVisualDto[];
  onSelect: (item: AudioVisualDto) => void;
}

export function MediaRail({ title, subtitle, items, onSelect }: MediaRailProps) {
  if (items.length === 0) return null;

  return (
    <Rail title={title} subtitle={subtitle}>
      {items.map((item) => (
        <a
          key={`${item.mediaType}:${item.id}`}
          class={styles.card}
          href={`/detail/${item.mediaType}/${item.id}`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            // The router's window-level handler ignores defaultPrevented and would
            // push a second history entry for the same click.
            e.stopPropagation();
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
    </Rail>
  );
}
