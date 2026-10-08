import { BackButton } from "@/features/BackButton";
import { GridRow } from "@/features/GridRow";
import { ImgTmdb } from "@/components/ImgTmdb";
import { MovieSkeleton } from "@/components/Skeletons";
import { usePersonData } from "@/hooks/usePersonData";
import type { AudioVisualDto, PersonCredit, PersonDetail } from "@/shared/types";
import styles from "./Person.module.css";

interface PersonProps {
  id: string;
  initialPhoto?: string;
}

type DatedCredit = PersonCredit & { date: string };

// A prolific filmography carries 150+ credits; an uncapped grid buries the rails.
const RAIL_LIMIT = 20;

const DEPARTMENTS: Record<string, string> = {
  Acting: "Actuación",
  Directing: "Dirección",
  Writing: "Guion",
  Production: "Producción",
  Camera: "Fotografía",
  Editing: "Montaje",
  Art: "Arte",
  Sound: "Sonido",
  "Costume & Make-Up": "Vestuario y maquillaje",
  "Visual Effects": "Efectos visuales",
  Lighting: "Iluminación",
  Crew: "Equipo",
};

function translatedDepartment(knownFor: string): string {
  return DEPARTMENTS[knownFor] ?? knownFor;
}

// Compare against the local calendar day: a UTC date rolls over mid-evening in
// Argentina and would push a title that just premiered back into Upcoming.
function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function toAudioVisual(credit: PersonCredit): AudioVisualDto {
  return {
    id: credit.id,
    title: credit.title,
    poster: credit.poster ?? "",
    backdrop: null,
    overview: null,
    mediaType: credit.mediaType,
    releaseDate: credit.date ?? undefined,
  };
}

function lifeRange(birthday: string | null, deathday: string | null): string | null {
  const birthYear = birthday?.slice(0, 4);
  if (!birthYear) return null;

  const deathYear = deathday?.slice(0, 4);
  return deathYear ? `${birthYear} – ${deathYear}` : birthYear;
}

function creditRails(credits: PersonCredit[]) {
  const today = todayIso();
  const dated = credits.filter((credit): credit is DatedCredit => credit.date !== null);

  const popular = [...credits].sort((a, b) => b.popularity - a.popularity).slice(0, RAIL_LIMIT);

  const latest = dated
    .filter((credit) => credit.date <= today)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, RAIL_LIMIT);

  const upcoming = dated
    .filter((credit) => credit.date > today)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .slice(0, RAIL_LIMIT);

  return { popular, latest, upcoming };
}

function metaFor(person: PersonDetail): string[] {
  return [
    translatedDepartment(person.knownFor),
    lifeRange(person.birthday, person.deathday),
    person.placeOfBirth,
  ].filter((part): part is string => !!part);
}

interface PersonHeaderProps {
  name?: string;
  photo?: string;
  meta: string[];
}

function PersonHeader({ name, photo, meta }: PersonHeaderProps) {
  return (
    <header class={styles.header}>
      <div class={styles.avatar}>
        <ImgTmdb
          type="profile"
          size="w342"
          sizes="10rem"
          src={photo}
          alt={name ? `Foto de ${name}` : "Foto de la persona"}
        />
      </div>
      <div class={styles.identity}>
        <h1 class={styles.name}>{name ?? "Cargando persona"}</h1>
        {meta.length > 0 && <p class={styles.meta}>{meta.join(" · ")}</p>}
      </div>
    </header>
  );
}

export function Person({ id, initialPhoto }: PersonProps) {
  const { data, loading, error, retry } = usePersonData(id);

  const isLoading = loading && !data;
  const isError = error && !data;

  const photo = data?.profilePath || initialPhoto;
  const biography = data?.biography?.trim() ?? "";
  const rails = data ? creditRails(data.credits ?? []) : null;

  return (
    <div class={`page ${styles.page}`}>
      <BackButton />

      <PersonHeader
        name={data?.name ?? (isError ? "Persona" : undefined)}
        photo={photo}
        meta={data ? metaFor(data) : []}
      />

      {isLoading && (
        <div aria-busy="true" aria-label="Cargando la persona">
          <MovieSkeleton />
          <MovieSkeleton />
        </div>
      )}

      {isError && (
        <section class={styles.stateBox} role="alert">
          <h2>No pudimos cargar la persona</h2>
          <p>Revisá tu conexión y volvé a intentarlo.</p>
          <button type="button" class={styles.retry} onClick={retry}>
            Reintentar
          </button>
        </section>
      )}

      {data && (
        <article class={styles.body}>
          {biography && (
            <section class={styles.biography}>
              <h2>Biografía</h2>
              <p>{biography}</p>
            </section>
          )}

          {rails && (
            <>
              <GridRow
                title="Populares"
                subtitle="Lo más visto de su carrera"
                movies={rails.popular.map(toAudioVisual)}
              />
              <GridRow
                title="Estrenos recientes"
                subtitle="Lo último que hizo"
                movies={rails.latest.map(toAudioVisual)}
              />
              <GridRow
                title="Próximamente"
                subtitle="Lo que todavía no se estrenó"
                movies={rails.upcoming.map(toAudioVisual)}
              />
            </>
          )}
        </article>
      )}
    </div>
  );
}
