import { PlatformData } from "@/shared/types";
import { useEffect, useRef, useState } from "preact/hooks";

const URL_API = "/api/platform/{providerId}";

export const usePlatformData = (providerId: string) => {
  const seqRef = useRef(0);
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPage = (page: number) => {
    const id = ++seqRef.current;
    setLoading(true);
    setError(false);

    fetch(`${URL_API.replace("{providerId}", providerId)}?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<PlatformData>;
      })
      .then((json) => {
        if (seqRef.current !== id) return;
        setData((prev) => {
          if (!prev || page === 1) return json;
          return {
            ...prev,
            movies: [...prev.movies, ...json.movies],
            tv: [...prev.tv, ...json.tv],
            page: json.page,
            totalPages: json.totalPages,
          };
        });
      })
      .catch(() => {
        if (seqRef.current !== id) return;
        setData(null);
        setError(true);
      })
      .finally(() => {
        if (seqRef.current === id) setLoading(false);
      });
  };

  useEffect(() => {
    fetchPage(1);
  }, [providerId]);

  const loadMore = async () => {
    if (!data || data.page >= data.totalPages || loading) return;
    fetchPage(data.page + 1);
  };

  const retry = () => {
    fetchPage(1);
  };

  return { data, loading, error, loadMore, retry };
};
