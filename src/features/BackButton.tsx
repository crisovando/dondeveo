import { ChevronLeft } from "lucide-preact";
import { useLocation } from "preact-iso";
import styles from "./BackButton.module.css";

interface BackButtonProps {
  from?: string;
}

export function BackButton({ from }: BackButtonProps) {
  const { route } = useLocation();

  const handleClick = () => {
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
