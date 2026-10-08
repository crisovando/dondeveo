import { useRef } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { BackButton } from "@/features/BackButton";
import { ImgTmdb } from "@/components/ImgTmdb";
import { MovieSkeleton } from "@/components/Skeletons";
import { CAST_AVATAR_TRANSITION_NAME, navigateToDetail } from "@/helpers/navigation";
import { castTransitionData } from "@/signals/transitionData";
import { usePersonData } from "@/hooks/usePersonData";
import type { AudioVisualDto, PersonCredit, PersonDetail } from "@/shared/types";
import styles from "./Person.module.css";

interface PersonProps {
  id: string;
  initialPhoto?: string;
}

type DatedCredit = PersonCredit & { date: string };

// A prolific filmography carries 150+ credits; an uncapped rail buries the page.
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
  const label = name ? `Foto de ${name}` : "Foto de la persona";

  return (
    <header class={styles.header}>
      <div class={styles.avatar} style={{ viewTransitionName: CAST_AVATAR_TRANSITION_NAME }}>
        {/* ImgTmdb consumes `alt` without forwarding it to the <img>, so the
            accessible name has to ride on aria-label. */}
        <ImgTmdb
          type="profile"
          size="w342"
          sizes="10rem"
          src={photo}
          alt={label}
          aria-label={label}
        />
      </div>
      <div class={styles.identity}>
        <h1 class={styles.name}>{name ?? "Cargando persona"}</h1>
        {meta.length > 0 && <p class={styles.meta}>{meta.join(" · ")}</p>}
      </div>
    </header>
  );
}

interface CreditRailProps {
  title: string;
  subtitle: string;
  items: AudioVisualDto[];
  onSelect: (item: AudioVisualDto) => void;
}

function CreditRail({ title, subtitle, items, onSelect }: CreditRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scrollByTrack = (dir: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const step = Math.round(track.clientWidth * 0.8);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: dir === "next" ? step : -step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section class={styles.rail}>
      <header class={styles.railHeader}>
        <h2 class={styles.railTitle}>{title}</h2>
        <p class={styles.railSubtitle}>{subtitle}</p>
      </header>

      <div class={styles.railBody}>
        <button
          type="button"
          class={`${styles.railNav} ${styles.railNavPrev}`}
          onClick={() => scrollByTrack("prev")}
          aria-label={`Ver anteriores de ${title}`}
        >
          <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div class={styles.railTrack} ref={trackRef}>
          {items.map((item) => (
            <a
              key={`${item.mediaType}:${item.id}`}
              class={styles.card}
              href={`/detail/${item.mediaType}/${item.id}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
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
        </div>

        <button
          type="button"
          class={`${styles.railNav} ${styles.railNavNext}`}
          onClick={() => scrollByTrack("next")}
          aria-label={`Ver siguientes de ${title}`}
        >
          <ChevronRight size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export function Person({ id, initialPhoto }: PersonProps) {
  const { route } = useLocation();
  const { data, loading, error, retry } = usePersonData(id);

  // The cast source tile and this avatar must carry the same name for the morph;
  // the id guard stops a stale signal from painting an unrelated person.
  const castTransition =
    castTransitionData.value && String(castTransitionData.value.personId) === id
      ? castTransitionData.value
      : null;

  const isLoading = loading && !data;
  const isError = error && !data;

  const photo = data?.profilePath || castTransition?.photo || initialPhoto;
  const biography = data?.biography?.trim() ?? "";
  const rails = data ? creditRails(data.credits ?? []) : null;

  return (
    <div class={styles.page}>
      <BackButton />

      <PersonHeader
        name={data?.name ?? castTransition?.name ?? (isError ? "Persona" : undefined)}
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
              <CreditRail
                title="Populares"
                subtitle="Lo más visto de su carrera"
                items={rails.popular.map(toAudioVisual)}
                onSelect={(item) => navigateToDetail(item, route)}
              />
              <CreditRail
                title="Estrenos recientes"
                subtitle="Lo último que hizo"
                items={rails.latest.map(toAudioVisual)}
                onSelect={(item) => navigateToDetail(item, route)}
              />
              <CreditRail
                title="Próximamente"
                subtitle="Lo que todavía no se estrenó"
                items={rails.upcoming.map(toAudioVisual)}
                onSelect={(item) => navigateToDetail(item, route)}
              />
            </>
          )}
        </article>
      )}
    </div>
  );
}
