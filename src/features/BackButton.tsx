import { ChevronLeft } from "lucide-preact";
import { useLocation } from "preact-iso";
import { transitionData } from "@/signals/transitionData";
import styles from "./BackButton.module.css";

export function BackButton() {
  const { route } = useLocation();

  const handleClick = () => {
    const from = transitionData.value?.from;

    if (!from) {
      route("/");
      return;
    }

    if (!document.startViewTransition) {
      route(from, true);
      return;
    }

    document.startViewTransition(() => route(from, true));
  };

  return (
    <button type="button" class={styles.backButton} onClick={handleClick} aria-label="Volver">
      <ChevronLeft size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
