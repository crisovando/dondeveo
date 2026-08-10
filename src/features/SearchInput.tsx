import { TargetedInputEvent } from "preact";
import { Search, X } from "lucide-preact";
import styles from "./SearchInput.module.css";
import { useEffect, useRef, useState } from "preact/hooks";

interface SearchInputProps {
  onSearch: (a: string) => void;
  initialValue?: string;
  onSetSearchControl?: (setSearch: (value: string) => void) => void;
}

export function SearchInput({ onSearch, initialValue = "", onSetSearchControl }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(initialValue.length > 0);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    onSetSearchControl?.((value: string) => {
      if (inputRef.current) inputRef.current.value = value;
      setHasValue(value.length > 0);
      onSearchRef.current(value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          Buscar películas y series
        </label>
        <input
          id="search-input"
          class={styles.input}
          placeholder="Buscar películas y series"
          type="search"
          autocomplete="off"
          spellcheck={false}
          defaultValue={initialValue}
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
