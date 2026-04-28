import { ImgTmdb } from "@/components/ImgTmdb";
import styles from "./Cast.module.css";
import { PersonCast } from "@/shared/types";

interface CastProps {
  cast?: PersonCast[];
}

export function Cast({ cast }: CastProps) {
  if (!cast?.length) return null;

  return (
    <section class={styles.cast}>
      <h2 class={styles.title}>Elenco</h2>
      <div class={styles.castsContainer}>
        {cast?.map((person) => (
          <div key={person.id} class={styles.person}>
            <div class={styles.imageContainer}>
              <ImgTmdb
                src={person.profilePath}
                type="poster"
                layout="poster-carousel"
                alt={person.name}
              />
            </div>
            <h4 class={styles.name}>{person.name}</h4>
            <p class={styles.character}>{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
