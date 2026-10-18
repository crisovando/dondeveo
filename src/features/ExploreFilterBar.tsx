import { useEffect, useState } from "preact/hooks";
import { SlidersHorizontal, X } from "lucide-preact";
import clsx from "clsx";
import styles from "./ExploreFilterBar.module.css";
import type { ExploreFilters, ExploreProvider, Genres } from "@/shared/types";
import {
  EXPLORE_ORDER_OPTIONS,
  EXPLORE_RATING_OPTIONS,
  EXPLORE_YEAR_MAX,
  EXPLORE_YEAR_MIN,
  countActiveExploreFilters,
  hasActiveExploreFilters,
} from "@/signals/explore";

interface ExploreFilterBarProps {
  filters: ExploreFilters;
  onChange: (next: ExploreFilters) => void;
  onClear: () => void;
  genres: Genres[];
  providers: ExploreProvider[];
}

const toInput = (year: number | null) => (year === null ? "" : String(year));

const parseYear = (raw: string): number | null => {
  const value = Number(raw.trim());
  if (!Number.isInteger(value)) return null;
  if (value < EXPLORE_YEAR_MIN || value > EXPLORE_YEAR_MAX) return null;
  return value;
};

// Free typing must not fire a request per keystroke, so the two year inputs hold
// their own text and commit on blur or Enter.
function YearRange({
  fromYear,
  toYear,
  onCommit,
}: {
  fromYear: number | null;
  toYear: number | null;
  onCommit: (patch: { fromYear: number | null; toYear: number | null }) => void;
}) {
  const [from, setFrom] = useState(toInput(fromYear));
  const [to, setTo] = useState(toInput(toYear));

  useEffect(() => {
    setFrom(toInput(fromYear));
    setTo(toInput(toYear));
  }, [fromYear, toYear]);

  const commit = () => onCommit({ fromYear: parseYear(from), toYear: parseYear(to) });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    commit();
  };

  return (
    <div class={styles.yearInputs}>
      <input
        class={styles.yearInput}
        type="number"
        inputmode="numeric"
        min={EXPLORE_YEAR_MIN}
        max={EXPLORE_YEAR_MAX}
        placeholder="Desde"
        aria-label="Año desde"
        value={from}
        onInput={(event) => setFrom(event.currentTarget.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
      <span class={styles.yearDash} aria-hidden="true">
        –
      </span>
      <input
        class={styles.yearInput}
        type="number"
        inputmode="numeric"
        min={EXPLORE_YEAR_MIN}
        max={EXPLORE_YEAR_MAX}
        placeholder="Hasta"
        aria-label="Año hasta"
        value={to}
        onInput={(event) => setTo(event.currentTarget.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export function ExploreFilterBar({
  filters,
  onChange,
  onClear,
  genres,
  providers,
}: ExploreFilterBarProps) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveExploreFilters(filters);
  const active = hasActiveExploreFilters(filters);

  const update = (patch: Partial<ExploreFilters>) => onChange({ ...filters, ...patch });

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

  for (const id of filters.genres) {
    const name = genres.find((genre) => genre.id === id)?.name;
    if (name) removable.push({ key: `genre-${id}`, label: name, onRemove: () => toggleGenre(id) });
  }

  if (filters.fromYear !== null || filters.toYear !== null) {
    const label =
      filters.fromYear !== null && filters.toYear !== null
        ? `${filters.fromYear}–${filters.toYear}`
        : filters.fromYear !== null
          ? `Desde ${filters.fromYear}`
          : `Hasta ${filters.toYear}`;
    removable.push({
      key: "years",
      label,
      onRemove: () => update({ fromYear: null, toYear: null }),
    });
  }

  if (filters.minRating !== null) {
    removable.push({
      key: "minRating",
      label: `${filters.minRating}+`,
      onRemove: () => update({ minRating: null }),
    });
  }

  if (filters.providerId !== null) {
    const name = providers.find((provider) => provider.providerId === filters.providerId);
    removable.push({
      key: "provider",
      label: name?.providerName ?? "Plataforma",
      onRemove: () => update({ providerId: null }),
    });
  }

  if (filters.streamOnly) {
    removable.push({
      key: "streamOnly",
      label: "Solo en streaming",
      onRemove: () => update({ streamOnly: false }),
    });
  }

  if (filters.order !== "popular") {
    const label = EXPLORE_ORDER_OPTIONS.find((option) => option.value === filters.order)?.label;
    if (label) {
      removable.push({
        key: "order",
        label,
        onRemove: () => update({ order: "popular" }),
      });
    }
  }

  return (
    <div class={styles.filters}>
      <div class={styles.bar}>
        <button
          type="button"
          class={clsx(styles.toggle, open && styles.toggleOpen)}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
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
          <button type="button" class={styles.clear} onClick={onClear} aria-label="Limpiar filtros">
            Limpiar
          </button>
        )}
      </div>

      {open && (
        <div class={styles.panel}>
          {genres.length > 0 && (
            <div class={styles.row} role="group" aria-label="Género">
              <span class={styles.rowLabel}>Género</span>
              <div class={styles.track}>
                {genres.map((genre) => {
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

          <div class={styles.row} role="group" aria-label="Año">
            <span class={styles.rowLabel}>Año</span>
            <YearRange
              fromYear={filters.fromYear}
              toYear={filters.toYear}
              onCommit={(patch) => update(patch)}
            />
          </div>

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
              {EXPLORE_RATING_OPTIONS.map((value) => {
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

          {providers.length > 0 && (
            <div class={styles.row} role="group" aria-label="Plataforma">
              <span class={styles.rowLabel}>Plataforma</span>
              <div class={styles.track}>
                <button
                  type="button"
                  class={chipClass(filters.providerId === null ? "neutral" : "default")}
                  aria-pressed={filters.providerId === null}
                  onClick={() => update({ providerId: null })}
                >
                  Todas
                </button>
                {providers.map((provider) => {
                  const selected = filters.providerId === provider.providerId;
                  return (
                    <button
                      key={provider.providerId}
                      type="button"
                      class={chipClass(selected ? "accent" : "default")}
                      aria-pressed={selected}
                      onClick={() => update({ providerId: provider.providerId })}
                    >
                      {provider.providerName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div class={styles.row} role="group" aria-label="Orden">
            <span class={styles.rowLabel}>Orden</span>
            <div class={styles.track}>
              {EXPLORE_ORDER_OPTIONS.map((option) => {
                const selected = filters.order === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    class={chipClass(selected ? "accent" : "default")}
                    aria-pressed={selected}
                    onClick={() => update({ order: option.value })}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div class={styles.row} role="group" aria-label="Streaming">
            <span class={styles.rowLabel}>Streaming</span>
            <div class={styles.track}>
              <button
                type="button"
                class={chipClass(filters.streamOnly ? "accent" : "default")}
                aria-pressed={filters.streamOnly}
                onClick={() => update({ streamOnly: !filters.streamOnly })}
              >
                Solo en streaming en Argentina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
