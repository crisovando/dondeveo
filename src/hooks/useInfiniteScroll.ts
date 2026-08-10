import { useCallback, useEffect, useRef } from "preact/hooks";

export const useInfiniteScroll = (fetchData: () => Promise<void>, hasMore: boolean) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const fetchRef = useRef(fetchData);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    fetchRef.current = fetchData;
  }, [fetchData]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const handleIntersection = useCallback(async (entries: IntersectionObserverEntry[]) => {
    const isIntersecting = entries[0]?.isIntersecting;
    if (isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
      isFetchingRef.current = true;
      try {
        await fetchRef.current();
      } finally {
        isFetchingRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "300px 0px",
      threshold: 0.1,
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [handleIntersection, hasMore]);

  return { loadMoreRef };
};
