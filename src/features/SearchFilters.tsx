import { useId, useState } from "preact/hooks";
import { SlidersHorizontal, X } from "lucide-preact";
import clsx from "clsx";
import styles from "./SearchFilters.module.css";
import { SearchFilters as SearchFiltersState } from "@/shared/types";
import { countActiveFilters, hasActiveFilters } from "@/signals/search";

interface SearchFiltersProps {
  filters: SearchFiltersState;
  onChange: (next: SearchFiltersState) => void;
  onClear: () => void;
  availableGenres: { id: number; name: string }[];
  showMediaType: boolean;
  showRating: boolean;
  showStream: boolean;
}

const MEDIA_TYPE_OPTIONS = [
  { value: "all", label: "Todo" },
  { value: "movie", label: "Películas" },
  { value: "tv", label: "Series" },
] as const;

const RATING_OPTIONS = [6, 7, 8, 9];

export function SearchFilters({
  filters,
  onChange,
  onClear,
  availableGenres,
  showMediaType,
  showRating,
  showStream,
}: SearchFiltersProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const activeCount = countActiveFilters(filters);
  const active = hasActiveFilters(filters);

  const update = (patch: Partial<SearchFiltersState>) => onChange({ ...filters, ...patch });

  const chipClass = (state: "neutral" | "accent" | "default") =>
    clsx(
      styles.chip,
      state === "neutral" && styles.chipNeutral,
      state === "accent" && styles.chipAccent,
    );

  const toggleGenre = (id: number) =>
    update({
      genres: filters.genres.includes(id)
        ? filters.genres.filter((genreId) => genreId !== id)
        : [...filters.genres, id],
    });

  const removable: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.mediaType !== "all") {
    removable.push({
      key: "mediaType",
      label: filters.mediaType === "movie" ? "Películas" : "Series",
      onRemove: () => update({ mediaType: "all" }),
    });
  }

  for (const id of filters.genres) {
    const name = availableGenres.find((genre) => genre.id === id)?.name;
    if (name) {
      removable.push({ key: `genre-${id}`, label: name, onRemove: () => toggleGenre(id) });
    }
  }

  if (filters.minRating !== null) {
    removable.push({
      key: "minRating",
      label: `${filters.minRating}+`,
      onRemove: () => update({ minRating: null }),
    });
  }

  if (filters.streamOnly) {
    removable.push({
      key: "streamOnly",
      label: "Solo en streaming",
      onRemove: () => update({ streamOnly: false }),
    });
  }

  return (
    <div class={styles.filters}>
      <div class={styles.bar}>
        <button
          type="button"
          class={clsx(styles.toggle, open && styles.toggleOpen)}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
        >
          <SlidersHorizontal size={16} strokeWidth={2} aria-hidden="true" />
          {activeCount === 0 ? "Filtros" : `Filtros · ${activeCount}`}
        </button>

        {removable.length > 0 && (
          <div class={styles.chips}>
            {removable.map((chip) => (
              <button
                key={chip.key}
                type="button"
                class={clsx(styles.chip, styles.chipAccent)}
                onClick={chip.onRemove}
                aria-label={`Quitar filtro ${chip.label}`}
              >
                {chip.label}
                <X size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {active && (
          <button type="button" class={styles.clear} onClick={onClear}>
            Limpiar
          </button>
        )}
      </div>

      {open && (
        <div class={styles.panel} id={panelId}>
          {showMediaType && (
            <div class={styles.row} role="group" aria-label="Tipo">
              <span class={styles.rowLabel}>Tipo</span>
              <div class={styles.track}>
                {MEDIA_TYPE_OPTIONS.map((option) => {
                  const selected = filters.mediaType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      class={chipClass(
                        selected ? (option.value === "all" ? "neutral" : "accent") : "default",
                      )}
                      aria-pressed={selected}
                      onClick={() => update({ mediaType: option.value })}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {showRating && (
            <div class={styles.row} role="group" aria-label="Rating">
              <span class={styles.rowLabel}>Rating</span>
              <div class={styles.track}>
                <button
                  type="button"
                  class={chipClass(filters.minRating === null ? "neutral" : "default")}
                  aria-pressed={filters.minRating === null}
                  onClick={() => update({ minRating: null })}
                >
                  Cualquiera
                </button>
                {RATING_OPTIONS.map((value) => {
                  const selected = filters.minRating === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      class={chipClass(selected ? "accent" : "default")}
                      aria-pressed={selected}
                      onClick={() => update({ minRating: value })}
                    >
                      {value}+
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {availableGenres.length > 0 && (
            <div class={styles.row} role="group" aria-label="Género">
              <span class={styles.rowLabel}>Género</span>
              <div class={styles.track}>
                {availableGenres.map((genre) => {
                  const selected = filters.genres.includes(genre.id);
                  return (
                    <button
                      key={genre.id}
                      type="button"
                      class={chipClass(selected ? "accent" : "default")}
                      aria-pressed={selected}
                      onClick={() => toggleGenre(genre.id)}
                    >
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {showStream && (
            <div class={styles.row} role="group" aria-label="Streaming">
              <span class={styles.rowLabel}>Streaming</span>
              <div class={styles.track}>
                <button
                  type="button"
                  class={chipClass(filters.streamOnly ? "accent" : "default")}
                  aria-pressed={filters.streamOnly}
                  onClick={() => update({ streamOnly: !filters.streamOnly })}
                >
                  Solo en streaming
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
