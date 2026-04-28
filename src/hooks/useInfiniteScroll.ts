import { useCallback, useEffect, useRef } from "preact/hooks";

export const useInfiniteScroll = (fetchData: () => Promise<void>, hasMore: boolean) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0]?.isIntersecting;
      if (isIntersecting && hasMore) {
        isFetchingRef.current = true;
        await fetchData();
        isFetchingRef.current = false;
      }
    },
    [fetchData, hasMore],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "300px 0px",
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  return { loadMoreRef };
};
