import { TargetedInputEvent } from "preact";
import { Search, X } from "lucide-preact";
import styles from "./SearchInput.module.css";
import { useRef } from "preact/hooks";

interface SearchInputProps {
  onSearch: (a: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInput = (e: TargetedInputEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (value) onSearch(value);
  };

  const clear = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section class={styles.container}>
      <div class={styles.searchInputWrapper}>
        <div class={styles.iconContainer}>
          <Search class={styles.icon} />
        </div>
        <input
          class={styles.input}
          placeholder="Buscar peliculas, series..."
          type="text"
          onInput={handleInput}
          ref={inputRef}
        />
        <div class={styles.inputRight}>
          <button class={styles.buttonClear} onClick={clear}>
            <X />
          </button>
        </div>
      </div>
    </section>
  );
}
