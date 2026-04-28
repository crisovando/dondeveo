import styles from "./Synopsis.module.css";

interface SynopsisProps {
  text: string;
}

export function Synopsis({ text }: SynopsisProps) {
  return (
    <section class={styles.synopsis}>
      <h2 class={styles.title}>Sinopsis</h2>
      <p>{text}</p>
    </section>
  );
}
