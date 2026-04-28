import { Trash } from "lucide-preact";
import styles from "./HistoryHeader.module.css";

export function HistoryHeader() {
  return (
    <header class={styles.containerHeader}>
      <div class={styles.wrapperTitle}>
        <h2 class={styles.title}>Historial</h2>
        <p class={styles.description}>Tu viaje cinematográfico.</p>
      </div>

      <button class={styles.clearButton} type="button">
        <Trash size={16} /> Limpiar historial
      </button>
    </header>
  );
}
