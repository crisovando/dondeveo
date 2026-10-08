import { PersonDetail } from "@/shared/types";
import { useEffect, useRef, useState } from "preact/hooks";

const URL_API = "/api/person/{id}";

export const usePersonData = (id: string) => {
  const seqRef = useRef(0);
  const [data, setData] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPerson = (personId: string) => {
    const seq = ++seqRef.current;
    setLoading(true);
    setError(false);

    fetch(URL_API.replace("{id}", personId))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<PersonDetail>;
      })
      .then((json) => {
        if (seqRef.current !== seq) return;
        setData(json);
      })
      .catch(() => {
        if (seqRef.current !== seq) return;
        setData(null);
        setError(true);
      })
      .finally(() => {
        if (seqRef.current === seq) setLoading(false);
      });
  };

  useEffect(() => {
    setData(null);
    fetchPerson(id);
  }, [id]);

  const retry = () => fetchPerson(id);

  return { data, loading, error, retry };
};
