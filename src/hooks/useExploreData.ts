import type { SearchData } from "@/shared/types";
import { useRef, useState } from "preact/hooks";

const URL_API = "/api/explore";

export const useExploreData = (query: string | null) => {
  const currentQuery = useRef<string | null>(null);
  const currentPage = useRef(1);
  const seq = useRef(0);
  const [data, setData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const fetchPage = (target: string, page = 1) => {
    const id = ++seq.current;

    setLoading(true);
    setError(false);
    setLoadMoreError(false);

    if (target !== currentQuery.current) {
      currentQuery.current = target;
      currentPage.current = page;
      setData(null);
    } else {
      currentPage.current = page;
    }

    fetch(`${URL_API}?${target}&page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<SearchData>;
      })
      .then((json) => {
        if (seq.current !== id) return;
        setData((prev) => {
          if (!prev || page === 1) return json;
          return {
            ...prev,
            audiovisuals: [...prev.audiovisuals, ...json.audiovisuals],
          };
        });
      })
      .catch(() => {
        if (seq.current !== id) return;
        if (page === 1) {
          setData(null);
          setError(true);
        } else {
          setLoadMoreError(true);
        }
      })
      .finally(() => {
        if (seq.current === id) setLoading(false);
      });
  };

  const loadMore = async () => {
    if (!currentQuery.current) return;
    fetchPage(currentQuery.current, currentPage.current + 1);
  };

  const retry = () => {
    if (!currentQuery.current) return;
    fetchPage(currentQuery.current, 1);
  };

  const retryLoadMore = () => {
    if (!currentQuery.current) return;
    fetchPage(currentQuery.current, currentPage.current);
  };

  const reset = () => {
    seq.current += 1;
    currentQuery.current = null;
    currentPage.current = 1;
    setData(null);
    setLoading(false);
    setError(false);
    setLoadMoreError(false);
  };

  const restore = (target: string, json: SearchData) => {
    seq.current += 1;
    currentQuery.current = target;
    currentPage.current = json.page || 1;
    setData(json);
    setLoading(false);
    setError(false);
    setLoadMoreError(false);
  };

  return {
    query,
    data,
    loading,
    error,
    loadMoreError,
    fetchPage,
    loadMore,
    retry,
    retryLoadMore,
    reset,
    restore,
  };
};
