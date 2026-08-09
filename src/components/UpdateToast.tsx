import { useEffect, useRef } from "preact/hooks";
import { useRegisterSW } from "virtual:pwa-register/preact";
import { CloudCheck, RefreshCw, X } from "lucide-preact";
import styles from "./UpdateToast.module.css";

const OFFLINE_READY_DURATION = 4000;

export function UpdateToast() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const offlineTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (offlineReady) {
      offlineTimerRef.current = window.setTimeout(
        () => setOfflineReady(false),
        OFFLINE_READY_DURATION,
      );
    }

    return () => {
      if (offlineTimerRef.current !== undefined) {
        window.clearTimeout(offlineTimerRef.current);
        offlineTimerRef.current = undefined;
      }
    };
  }, [offlineReady, setOfflineReady]);

  const handleReload = async () => {
    await updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  if (offlineReady) {
    return (
      <div
        class={styles.toast}
        role="status"
        aria-live="polite"
        aria-label="Listo para ver sin conexión"
      >
        <CloudCheck class={styles.icon} size={16} aria-hidden="true" />
        <span class={styles.message}>Listo para ver sin conexión</span>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div
        class={`${styles.toast} ${styles.persistent}`}
        role="status"
        aria-live="polite"
        aria-label="Nueva versión disponible"
      >
        <RefreshCw class={styles.icon} size={16} aria-hidden="true" />
        <span class={styles.message}>Nueva versión disponible</span>
        <button
          type="button"
          class={styles.reloadButton}
          onClick={handleReload}
          aria-label="Recargar la aplicación"
        >
          Recargar
        </button>
        <button
          type="button"
          class={styles.dismissButton}
          onClick={handleDismiss}
          aria-label="Cerrar aviso de nueva versión"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return null;
}