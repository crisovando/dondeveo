import { useState, useRef, useEffect } from "preact/hooks";
import { AudioVisualDto, FavoriteEntry } from "@/shared/types";
import { addToFavorites } from "@/signals/favorites";
import styles from "./AddFavoriteModal.module.css";

interface Props {
  movie: AudioVisualDto;
  onClose: () => void;
}

const FOCUSABLE =
  'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';

export function AddFavoriteModal({ movie, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [wantsNotification, setWantsNotification] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [comment, setComment] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (focusable && focusable.length > 0) {
      focusable[0]?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;

        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const isScheduledAtValid = (value: string): boolean => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.getTime() > Date.now();
  };

  const isSaveDisabled = wantsNotification && !isScheduledAtValid(scheduledAt);

  const minDatetime = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
      `T${pad(now.getHours())}:${pad(now.getMinutes())}`
    );
  };

  const handleScheduledAtChange = (value: string) => {
    setScheduledAt(value);
    if (value && !isScheduledAtValid(value)) {
      setDateError("La fecha debe ser en el futuro.");
    } else {
      setDateError("");
    }
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (wantsNotification && !isScheduledAtValid(scheduledAt)) return;

    const entry: FavoriteEntry = {
      ...movie,
      ...(wantsNotification && scheduledAt
        ? { notification: { scheduledAt, comment, sent: false } }
        : {}),
    };

    addToFavorites(entry);

    // Acá iría logica de notificación
    // Guardar en algun cron job de back, puede ser supabase, a evaluar.

    onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div class={styles.backdrop} onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        class={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header class={styles.header}>
          <h2 id="modal-title" class={styles.title}>
            Agregar a favoritos
          </h2>
          <p class={styles.movieTitle}>{movie.title}</p>
        </header>

        <hr class={styles.divider} />

        <form onSubmit={handleSubmit} noValidate>
          <label class={styles.checkRow}>
            <input
              type="checkbox"
              class={styles.checkbox}
              checked={wantsNotification}
              onChange={(e) => setWantsNotification((e.target as HTMLInputElement).checked)}
            />
            <span class={styles.checkLabel}>Quiero agendar la cita</span>
          </label>

          {wantsNotification && (
            <div class={styles.fields}>
              <div>
                <span class={styles.fieldLabel} id="datetime-label">
                  Fecha y hora
                </span>
                <input
                  type="datetime-local"
                  aria-labelledby="datetime-label"
                  aria-invalid={dateError ? "true" : "false"}
                  aria-describedby={dateError ? "datetime-error" : undefined}
                  class={`${styles.input} ${dateError ? styles.inputError : ""}`}
                  value={scheduledAt}
                  min={minDatetime()}
                  onInput={(e) => handleScheduledAtChange((e.target as HTMLInputElement).value)}
                />
                {dateError && (
                  <p class={styles.fieldError} id="datetime-error" role="alert">
                    {dateError}
                  </p>
                )}
              </div>
              <div>
                <span class={styles.fieldLabel} id="comment-label">
                  Comentario (opcional)
                </span>
                <textarea
                  class={styles.textarea}
                  aria-labelledby="comment-label"
                  placeholder="Ej: Ver con Laura el sábado a la noche"
                  value={comment}
                  onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
                  maxLength={140}
                />
                {!scheduledAt && (
                  <p class={styles.hint}>Seleccioná una fecha y hora para agendar la cita.</p>
                )}
              </div>
            </div>
          )}

          <div class={styles.actions}>
            <button type="button" class={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" class={styles.btnSave} disabled={isSaveDisabled}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
