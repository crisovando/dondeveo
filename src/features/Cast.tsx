import { useLocation } from "preact-iso";
import { ImgTmdb } from "@/components/ImgTmdb";
import { CAST_AVATAR_TRANSITION_NAME, navigateToPerson } from "@/helpers/navigation";
import styles from "./Cast.module.css";
import { PersonCast } from "@/shared/types";

interface CastProps {
  cast?: PersonCast[];
}

// One name, one holder: a name left on a previously clicked tile collides with
// the next click and the browser silently drops the morph.
let namedAvatar: HTMLElement | null = null;

function nameAvatar(avatar: HTMLElement) {
  if (namedAvatar && namedAvatar !== avatar) namedAvatar.style.viewTransitionName = "";
  avatar.style.viewTransitionName = CAST_AVATAR_TRANSITION_NAME;
  namedAvatar = avatar;
}

export function Cast({ cast }: CastProps) {
  const { route } = useLocation();

  if (!cast?.length) return null;

  return (
    <section class={styles.cast}>
      <h2 class={styles.title}>Elenco</h2>
      <div class={styles.castsContainer}>
        {cast.map((person) => (
          <a
            key={`${person.id}-${person.character ?? person.name}`}
            class={styles.person}
            href={`/persona/${person.id}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              const avatar = e.currentTarget.querySelector<HTMLElement>("[data-cast-avatar]");
              if (avatar) nameAvatar(avatar);
              navigateToPerson(
                { id: person.id, name: person.name, photo: person.profilePath },
                route,
              );
            }}
          >
            <div class={styles.imageContainer} data-cast-avatar>
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
