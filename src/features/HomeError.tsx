import styles from "./HomeError.module.css";

interface HomeErrorProps {
  message: string;
  onRetry: () => void;
}

export function HomeError({ message, onRetry }: HomeErrorProps) {
  return (
    <section class={styles.wrapper} role="alert" aria-labelledby="home-error-title">
      <h1 id="home-error-title">No pudimos cargar el inicio</h1>
      <p class={styles.message}>{message}</p>
      <button type="button" class={styles.retry} onClick={onRetry}>
        Reintentar
      </button>
    </section>
  );
}
