import { useEffect, useMemo, useRef } from "preact/hooks";

function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 1000,
) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: Parameters<T>) => {
      ref.current?.(...args);
    };

    return debounce(func, delay);
  }, [delay]);

  return debouncedCallback;
};
