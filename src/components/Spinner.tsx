import styles from "./Spinner.module.css";

export function Spinner() {
  return (
    <div class={styles.overlay}>
      <div class={styles.ring} />
    </div>
  );
}
