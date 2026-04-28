import styles from "./Skeletons.module.css";

export function MovieSkeleton() {
  return (
    <div className={styles.carousel}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className={styles.skeletonCard}>
          <div className={styles.skeletonPoster} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonMeta} />
        </div>
      ))}
    </div>
  );
}

export function HeroDetailSkeleton() {
  return (
    <section class={styles.heroSkeleton}>
      <div class={styles.heroSkeletonImg} />
      <div class={styles.heroSkeletonOverlay}>
        <div class={styles.heroSkeletonContent}>
          <div class={`${styles.heroSkeletonLine} ${styles.heroSkeletonGenres}`} />
          <div class={`${styles.heroSkeletonLine} ${styles.heroSkeletonTitle}`} />
          <div class={styles.heroSkeletonActions}>
            <div class={`${styles.heroSkeletonLine} ${styles.heroSkeletonButton}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
export function WatchProvidersSkeleton() {
  return (
    <div className={styles.providersSkeleton}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className={styles.providerSkeletonCard}>
          <div className={styles.providerSkeletonLogo} />
          <div className={styles.providerSkeletonText} />
        </div>
      ))}
    </div>
  );
}
