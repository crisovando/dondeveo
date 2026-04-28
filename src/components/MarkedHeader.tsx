import styles from "./MarkedHeader.module.css";

interface MarkedHeaderProps {
  title: string;
  subtitle: string;
  onViewAll?: () => void;
}

export function MarkedHeader({ title, subtitle, onViewAll }: MarkedHeaderProps) {
  return (
    <div class={styles.container}>
      <div class={styles.marking}>
        <h3 class={styles.title}>{title}</h3>
        <p class={styles.subtitle}>{subtitle}</p>
      </div>
      {onViewAll && (
        <button class={styles.viewAllButton} onClick={onViewAll}>
          Ver todo
        </button>
      )}
    </div>
  );
}
