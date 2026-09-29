import { useLocation } from "preact-iso";
import clsx from "clsx";
import { Dices, Trash2 } from "lucide-preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { EmptyRow } from "@/components/EmptyRow";
import { ImgTmdb } from "@/components/ImgTmdb";
import { buildTmdbSrc } from "@/helpers/utils";
import {
  MAX_ROULETTE_ENTRIES,
  clearRoulette,
  pickRandomRouletteIndex,
  removeFromRoulette,
  rouletteSignal,
} from "@/signals/roulette";
import "@/styles/pages.css";
import styles from "./Roulette.module.css";

const VIEW_CENTER = 100;
const VIEW_RADIUS = 96;
const LABEL_RADIUS = 62;
const SPIN_MS = 4200;
const EXTRA_TURNS = 5;
const MAX_SECTORS_WITH_POSTERS = 10;
const POSTER_WIDTH = 46;
const POSTER_HEIGHT = 69;
const POSTER_OUTER_RADIUS = 94;
const POSTER_OPACITY = 0.58;

const SECTOR_FILLS = [
  "var(--color-primary)",
  "var(--color-surface-elevated)",
  "var(--color-accent)",
];

const SECTOR_LABEL_FILLS = ["var(--color-white)", "var(--color-text-bright)", "var(--color-bg)"];
const POSTER_LABEL_FILL = "var(--color-white)";

function pointOnWheel(angleDeg: number, radius = VIEW_RADIUS): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [VIEW_CENTER + radius * Math.sin(rad), VIEW_CENTER - radius * Math.cos(rad)];
}

// Odd counts wrap the 3-colour cycle back onto sector 0 when n ≡ 1 (mod 3), so the last sector shifts.
function sectorFillIndex(index: number, total: number) {
  if (total % 2 === 0) return index % 2;

  const wrapsOntoFirst = index === total - 1 && (total - 1) % SECTOR_FILLS.length === 0;
  return wrapsOntoFirst ? 1 : index % SECTOR_FILLS.length;
}

function sectorPath(startDeg: number, endDeg: number) {
  const [x0, y0] = pointOnWheel(startDeg);
  const [x1, y1] = pointOnWheel(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return `M ${VIEW_CENTER} ${VIEW_CENTER} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${VIEW_RADIUS} ${VIEW_RADIUS} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

function mediaTypeLabel(mediaType: string) {
  if (mediaType === "movie") return "Película";
  if (mediaType === "tv") return "Serie";
  return mediaType;
}

export function Roulette() {
  const { route } = useLocation();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const stored = rouletteSignal.value;
  const entries = stored ?? [];
  const count = entries.length;
  const seg = count > 0 ? 360 / count : 0;
  const winner = winnerIndex === null ? null : (entries[winnerIndex] ?? null);
  const showPosters = count >= 2 && count <= MAX_SECTORS_WITH_POSTERS;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSpin = () => {
    if (spinning || count < 2) return;

    const index = pickRandomRouletteIndex();
    if (index < 0) return;

    const center = index * seg + seg / 2 + (Math.random() - 0.5) * seg * 0.6;
    const targetMod = (((360 - center) % 360) + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((((targetMod - currentMod) % 360) + 360) % 360) + 360 * EXTRA_TURNS;

    setWinnerIndex(null);
    setRotation(rotation + delta);
    setSpinning(true);

    timeoutRef.current = window.setTimeout(() => {
      setWinnerIndex(index);
      setSpinning(false);
      timeoutRef.current = null;
    }, SPIN_MS);
  };

  const handleRemove = (id: number) => {
    removeFromRoulette(id);
    setWinnerIndex(null);
  };

  const handleClear = () => {
    clearRoulette();
    setWinnerIndex(null);
  };

  return (
    <div class={`page ${styles.page}`}>
      <header class={styles.header}>
        <div>
          <h1 class={styles.title}>Ruleta</h1>
          <p class={styles.subtitle}>Dejá que el azar elija tu próxima película o serie</p>
        </div>
        {stored !== null && (
          <span class={styles.counter}>
            {count} / {MAX_ROULETTE_ENTRIES}
          </span>
        )}
      </header>

      {stored === null ? null : count === 0 ? (
        <EmptyRow
          title="Tu ruleta"
          subtitle="Elegí al azar"
          icon={<Dices size={28} strokeWidth={1.75} />}
          heading="Todavía no hay opciones"
          description="Sumá hasta 10 películas o series y dejá que la ruleta decida qué ver hoy."
          action="Buscar títulos"
          onAction={() => route("/search")}
        />
      ) : (
        <div class={styles.layout}>
          <div class={styles.wheelBox}>
            <svg
              class={styles.wheelSvg}
              viewBox="0 0 200 200"
              role="img"
              aria-label="Ruleta de opciones"
            >
              {showPosters && (
                <defs>
                  {Array.from({ length: count }, (_, index) => (
                    <clipPath key={entries[index].id} id={`roulette-sector-${index}`}>
                      <path d={sectorPath(-seg / 2, seg / 2)} />
                    </clipPath>
                  ))}
                </defs>
              )}

              <g class={styles.rotor} style={{ transform: `rotate(${rotation}deg)` }}>
                {count === 1 && (
                  <circle
                    cx={VIEW_CENTER}
                    cy={VIEW_CENTER}
                    r={VIEW_RADIUS}
                    style={{ fill: SECTOR_FILLS[0] }}
                  />
                )}

                {Array.from({ length: count }, (_, index) => {
                  const start = index * seg;
                  const mid = start + seg / 2;
                  const fillIndex = sectorFillIndex(index, count);
                  const [labelX, labelY] = pointOnWheel(mid, LABEL_RADIUS);

                  return (
                    <g key={entries[index].id}>
                      {count > 1 && (
                        <path
                          d={sectorPath(start, start + seg)}
                          style={{
                            fill: SECTOR_FILLS[fillIndex],
                            stroke: "var(--color-bg)",
                          }}
                          stroke-width="1"
                        />
                      )}
                      {showPosters && entries[index].poster && (
                        <g transform={`rotate(${mid} 100 100)`}>
                          <image
                            href={buildTmdbSrc(entries[index].poster, "w185")}
                            x={VIEW_CENTER - POSTER_WIDTH / 2}
                            y={VIEW_CENTER - POSTER_OUTER_RADIUS}
                            width={POSTER_WIDTH}
                            height={POSTER_HEIGHT}
                            preserveAspectRatio="xMidYMid slice"
                            opacity={POSTER_OPACITY}
                            clip-path={`url(#roulette-sector-${index})`}
                          />
                        </g>
                      )}
                      <text
                        class={clsx(styles.sectorLabel, showPosters && styles.sectorLabelHalo)}
                        x={labelX.toFixed(2)}
                        y={labelY.toFixed(2)}
                        text-anchor="middle"
                        dominant-baseline="central"
                        style={{ fill: showPosters ? POSTER_LABEL_FILL : SECTOR_LABEL_FILLS[fillIndex] }}
                      >
                        {index + 1}
                      </text>
                    </g>
                  );
                })}
              </g>

              <path class={styles.pointer} d="M 100 34 L 86 6 L 114 6 Z" />
            </svg>

            <button
              type="button"
              class={styles.spin}
              onClick={handleSpin}
              disabled={spinning || count < 2}
            >
              {spinning ? "Girando..." : "Girar la ruleta"}
            </button>

            {count < 2 && <p class={styles.hint}>Agregá al menos dos opciones para poder girar.</p>}
          </div>

          <div class={styles.side}>
            {winner ? (
              <section class={styles.winner} aria-live="polite">
                <p class={styles.winnerKicker}>La ruleta eligió</p>
                <div class={styles.winnerBody}>
                  <div class={styles.winnerPosterBox}>
                    <ImgTmdb
                      type="poster"
                      size="w342"
                      src={winner.poster}
                      alt={`Póster de ${winner.title}`}
                    />
                  </div>
                  <div class={styles.winnerInfo}>
                    <h2 class={styles.winnerTitle}>{winner.title}</h2>
                    <p class={styles.winnerType}>{mediaTypeLabel(winner.mediaType)}</p>
                    <a class={styles.winnerLink} href={`/detail/${winner.mediaType}/${winner.id}`}>
                      Ver dónde verla
                    </a>
                  </div>
                </div>
              </section>
            ) : (
              <p class={styles.hint}>
                {spinning
                  ? "Girando la ruleta..."
                  : 'Tocá "Girar la ruleta" para descubrir qué te toca.'}
              </p>
            )}

            <section class={styles.options}>
              <div class={styles.optionsHeader}>
                <h2 class={styles.optionsTitle}>Opciones</h2>
                <button
                  type="button"
                  class={styles.clear}
                  onClick={handleClear}
                  disabled={spinning}
                >
                  Vaciar
                </button>
              </div>

              <ul class={styles.list}>
                {entries.map((entry, index) => (
                  <li key={entry.id} class={styles.item}>
                    <span class={styles.itemIndex}>{index + 1}</span>
                    <div class={styles.thumbBox}>
                      <ImgTmdb
                        type="poster"
                        size="w185"
                        src={entry.poster}
                        alt={`Póster de ${entry.title}`}
                      />
                    </div>
                    <div class={styles.itemInfo}>
                      <h3 class={styles.itemTitle}>{entry.title}</h3>
                      <span class={styles.itemType}>{mediaTypeLabel(entry.mediaType)}</span>
                    </div>
                    <a class={styles.itemLink} href={`/detail/${entry.mediaType}/${entry.id}`}>
                      Ver detalle
                    </a>
                    <button
                      type="button"
                      class={styles.remove}
                      onClick={() => handleRemove(entry.id)}
                      disabled={spinning}
                      aria-label={`Quitar ${entry.title} de la ruleta`}
                    >
                      <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
