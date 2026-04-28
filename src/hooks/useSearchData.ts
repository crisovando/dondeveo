import { SearchData } from "@/shared/types";
import { useRef, useState } from "preact/hooks";

const URL_API = "/api/search";

export const useSearchData = () => {
  const currentQuery = useRef("");
  const currentPage = useRef(1);
  const [data, setData] = useState<SearchData | null>(null);

  const fetchData = (query: string, page = 1) => {
    fetch(`${URL_API}?query=${query}&page=${page}`)
      .then((res) => res.json())
      .then((json) => {
        if (query !== currentQuery.current) {
          setData(json);
          currentQuery.current = query;
        } else {
          setData((prev) => {
            if (!prev) return json;

            return {
              ...prev,
              audiovisuals: [...prev.audiovisuals, ...json.audiovisuals],
            };
          });
        }
      });
  };

  const loadMore = async () => {
    currentPage.current += 1;
    return fetchData(currentQuery.current, currentPage.current);
  };

  return { data, fetchData, loadMore };
};
