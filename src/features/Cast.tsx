import { useLocation } from "preact-iso";
import { ImgTmdb } from "@/components/ImgTmdb";
import { castAvatarTransitionName, navigateToPerson } from "@/helpers/navigation";
import styles from "./Cast.module.css";
import { PersonCast } from "@/shared/types";

interface CastProps {
  cast?: PersonCast[];
}

// Per-actor occurrence, not list index: the destination avatar falls back to
// occurrence 0, so a uniquely-cast actor pairs on both sides.
function withOccurrence(cast: PersonCast[]) {
  const seen = new Map<number, number>();
  return cast.map((person) => {
    const occurrence = seen.get(person.id) ?? 0;
    seen.set(person.id, occurrence + 1);
    return { person, occurrence };
  });
}

export function Cast({ cast }: CastProps) {
  const { route } = useLocation();

  if (!cast?.length) return null;

  return (
    <section class={styles.cast}>
      <h2 class={styles.title}>Elenco</h2>
      <div class={styles.castsContainer}>
        {withOccurrence(cast).map(({ person, occurrence }) => (
          <a
            key={`${person.id}-${occurrence}`}
            class={styles.person}
            href={`/persona/${person.id}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              navigateToPerson(
                { id: person.id, name: person.name, photo: person.profilePath, occurrence },
                route,
              );
            }}
          >
            <div
              class={styles.imageContainer}
              style={{ viewTransitionName: castAvatarTransitionName(person.id, occurrence) }}
            >
              <ImgTmdb
                src={person.profilePath}
                type="profile"
                size="w342"
                sizes="8rem"
                alt={person.name}
              />
            </div>
            <h4 class={styles.name}>{person.name}</h4>
            <p class={styles.character}>{person.character}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
