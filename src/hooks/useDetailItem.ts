import { DetailItem } from "@/shared/types";
import { useEffect, useState } from "preact/hooks";

const URL_API = "/api/detail/{type}/{id}";

export const useDetailData = (type: string, id: string) => {
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);
  useEffect(() => {
    if (detailItem && String(detailItem.id) === String(id)) return;

    let cancelled = false;

    fetch(URL_API.replace("{type}", type).replace("{id}", id.toString()))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setDetailItem(json);
      });

    return () => {
      cancelled = true;
    };
  }, [type, id]);

  // While the next title is in flight the state still holds the previous one;
  // never hand it to the page, which would paint the wrong title's data.
  const data = detailItem && String(detailItem.id) === String(id) ? detailItem : null;

  return { data };
};
