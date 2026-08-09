import { ComponentChildren } from "preact";
import styles from "./EmptyRow.module.css";

interface EmptyRowProps {
  title: string;
  subtitle: string;
  icon: ComponentChildren;
  heading: string;
  description: string;
  action: string;
  onAction: () => void;
}

export function EmptyRow({
  title,
  subtitle,
  icon,
  heading,
  description,
  action,
  onAction,
}: EmptyRowProps) {
  return (
    <section class={styles.section} aria-label={title}>
      <header class={styles.header}>
        <div>
          <h2>{title}</h2>
          {subtitle && <p class={styles.subtitle}>{subtitle}</p>}
        </div>
      </header>

      <div class={styles.empty}>
        <span class={styles.icon} aria-hidden="true">
          {icon}
        </span>
        <h3 class={styles.heading}>{heading}</h3>
        <p class={styles.description}>{description}</p>
        <button type="button" class={styles.action} onClick={onAction}>
          {action}
        </button>
      </div>
    </section>
  );
}