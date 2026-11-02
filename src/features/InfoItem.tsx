import { CardWidget } from "@/components/CardWidget";
import { DetailItem } from "@/shared/types";
import { formatRuntime, formatSeasonCount } from "@/helpers/utils";
import styles from "./InfoItem.module.css";

interface InfoItemProps {
  item: Partial<DetailItem>;
}

interface InfoRow {
  label: string;
  value: string;
}

const STATUS_LABELS: Record<string, string> = {
  Released: "Estrenada",
  "Returning Series": "En emisión",
  Ended: "Finalizada",
  Canceled: "Cancelada",
  "In Production": "En producción",
  "Post Production": "Postproducción",
  Planned: "Planeada",
  Rumored: "Rumoreada",
  Pilot: "Piloto",
};

function createDisplayNames(type: "region" | "language"): Intl.DisplayNames | null {
  try {
    return new Intl.DisplayNames("es-AR", { type });
  } catch {
    return null;
  }
}

const regionNames = createDisplayNames("region");
const languageNames = createDisplayNames("language");

function regionName(code: string): string {
  return regionNames?.of(code) ?? code;
}

function languageName(code: string): string {
  const name = languageNames?.of(code) ?? code;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

function formatVotes(count: number): string {
  return `${new Intl.NumberFormat("es-AR").format(count)} votos`;
}

function joinNames(names?: Array<string | undefined>): string {
  return (names ?? []).filter(Boolean).join(", ");
}

function fichaRows(item: Partial<DetailItem>): InfoRow[] {
  const rows: InfoRow[] = [];

  if (item.releaseDate) rows.push({ label: "Estreno", value: formatDate(item.releaseDate) });

  if (item.mediaType === "tv") {
    const seasons = item.seasonsCount ? formatSeasonCount(item.seasonsCount) : "";
    const episodes = item.episodesCount ? `${item.episodesCount} episodios` : "";
    const value = [seasons, episodes].filter(Boolean).join(" · ");
    if (value) rows.push({ label: "Temporadas", value });
  } else if (item.duration) {
    rows.push({ label: "Duración", value: formatRuntime(item.duration) });
  }

  if (item.contentRating) rows.push({ label: "Clasificación", value: item.contentRating });

  if (item.status) {
    rows.push({ label: "Estado", value: STATUS_LABELS[item.status] ?? item.status });
  }

  if (item.rating) {
    const votes = item.voteCount ? ` · ${formatVotes(item.voteCount)}` : "";
    rows.push({ label: "Puntaje", value: `${item.rating.toFixed(1)}${votes}` });
  }

  const countries = joinNames(item.countryCodes?.map(regionName));
  if (countries) rows.push({ label: "País", value: countries });

  const languages = joinNames(item.languageCodes?.map(languageName));
  if (languages) rows.push({ label: "Idioma", value: languages });

  if (item.nextEpisode) {
    const { seasonNumber, episodeNumber, airDate } = item.nextEpisode;
    const date = airDate ? ` · ${formatDate(airDate)}` : "";
    rows.push({
      label: "Próximo episodio",
      value: `T${seasonNumber} E${episodeNumber}${date}`,
    });
  }

  const networks = joinNames(item.networks?.map((network) => network.name));
  if (networks) rows.push({ label: "Cadena", value: networks });

  const studios = joinNames(item.productionCompanies?.map((company) => company.name));
  if (studios) rows.push({ label: "Estudios", value: studios });

  return rows;
}

function teamRows(item: Partial<DetailItem>): InfoRow[] {
  const rows: InfoRow[] = [];

  const createdBy = joinNames(item.createdBy?.map((creator) => creator.name));
  if (createdBy) rows.push({ label: "Creado por", value: createdBy });

  const directors = joinNames(item.keyCrew?.directors);
  if (directors) rows.push({ label: "Dirección", value: directors });

  const writers = joinNames(item.keyCrew?.writers);
  if (writers) rows.push({ label: "Guion", value: writers });

  const music = joinNames(item.keyCrew?.music);
  if (music) rows.push({ label: "Música", value: music });

  const photography = joinNames(item.keyCrew?.photography);
  if (photography) rows.push({ label: "Fotografía", value: photography });

  return rows;
}

function SpecCard({ title, rows }: { title: string; rows: InfoRow[] }) {
  if (rows.length === 0) return null;

  return (
    <CardWidget>
      <h3 class={styles.title}>{title}</h3>
      <dl class={styles.rows}>
        {rows.map((row) => (
          <div class={styles.row} key={row.label}>
            <dt class={styles.label}>{row.label}</dt>
            <dd class={styles.value}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </CardWidget>
  );
}

export function InfoItem({ item }: InfoItemProps) {
  return (
    <>
      <SpecCard title="Ficha" rows={fichaRows(item)} />
      <SpecCard title="Equipo" rows={teamRows(item)} />
    </>
  );
}
