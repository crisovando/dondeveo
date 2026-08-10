import styles from "./Spinner.module.css";

interface SpinnerProps {
  inline?: boolean;
}

export function Spinner({ inline = false }: SpinnerProps) {
  if (inline) {
    return (
      <div class={styles.overlayInline} aria-hidden="true">
        <div class={styles.ringInline} />
      </div>
    );
  }

  return (
    <div class={styles.overlay}>
      <div class={styles.ring} />
    </div>
  );
}
