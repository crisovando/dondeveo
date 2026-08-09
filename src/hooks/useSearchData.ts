import { SearchData } from "@/shared/types";
import { useRef, useState } from "preact/hooks";

const URL_API = "/api/search";

export const useSearchData = () => {
  const currentQuery = useRef("");
  const currentPage = useRef(1);
  const seq = useRef(0);
  const [data, setData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = (query: string, page = 1) => {
    const trimmed = query.trim();
    const id = ++seq.current;

    if (!trimmed) {
      currentQuery.current = "";
      currentPage.current = 1;
      setData(null);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    if (trimmed !== currentQuery.current) {
      currentQuery.current = trimmed;
      currentPage.current = page;
      setData(null);
    } else {
      currentPage.current = page;
    }

    fetch(`${URL_API}?query=${encodeURIComponent(trimmed)}&page=${page}`)
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
        setData(null);
        setError(true);
      })
      .finally(() => {
        if (seq.current === id) setLoading(false);
      });
  };

  const loadMore = async () => {
    if (!currentQuery.current) return;
    fetchData(currentQuery.current, currentPage.current + 1);
  };

  const retry = () => {
    if (!currentQuery.current) return;
    fetchData(currentQuery.current, 1);
  };

  const reset = () => {
    seq.current += 1;
    currentQuery.current = "";
    currentPage.current = 1;
    setData(null);
    setLoading(false);
    setError(false);
  };

  const restore = (query: string, json: SearchData) => {
    seq.current += 1;
    currentQuery.current = query.trim();
    currentPage.current = json.page || 1;
    setData(json);
    setLoading(false);
    setError(false);
  };

  return { data, loading, error, fetchData, loadMore, retry, reset, restore };
};
