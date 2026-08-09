import { TargetedInputEvent } from "preact";
import { Search, X } from "lucide-preact";
import styles from "./SearchInput.module.css";
import { useRef, useState } from "preact/hooks";

interface SearchInputProps {
  onSearch: (a: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(false);

  const handleInput = (e: TargetedInputEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setHasValue(value.length > 0);
    onSearch(value);
  };

  const clear = () => {
    if (inputRef.current) inputRef.current.value = "";
    setHasValue(false);
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <section class={styles.container}>
      <div class={styles.searchInputWrapper}>
        <div class={styles.iconContainer}>
          <Search class={styles.icon} aria-hidden="true" />
        </div>
        <label class={styles.srOnly} htmlFor="search-input">
          Buscar películas, series y personas
        </label>
        <input
          id="search-input"
          class={styles.input}
          placeholder="Buscar películas, series y personas"
          type="search"
          autocomplete="off"
          spellcheck={false}
          onInput={handleInput}
          ref={inputRef}
        />
        {hasValue && (
          <div class={styles.inputRight}>
            <button
              class={styles.buttonClear}
              onClick={clear}
              type="button"
              aria-label="Limpiar búsqueda"
            >
              <X size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}