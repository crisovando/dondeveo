import styles from "./HeroFavorites.module.css";

export function HeroFavorites() {
  return (
    <section class={styles.heroFavorites}>
      <div class={styles.backgroundBlur} />
      <h2 class={styles.title}>
        Tus <span class={styles.primary}>Favoritos</span>
      </h2>
    </section>
  );
}
