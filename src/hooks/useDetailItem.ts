import { DetailItem } from "@/shared/types";
import { useEffect, useState } from "preact/hooks";
import { transitionData } from "@/signals/transitionData";

const URL_API = "/api/detail/{type}/{id}";

export const useDetailData = (type: string, id: string) => {
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);
  useEffect(() => {
    if (detailItem && String(detailItem.id) === String(id)) return;

    fetch(URL_API.replace("{type}", type).replace("{id}", id.toString()))
      .then((res) => res.json())
      .then((json) => {
        setDetailItem(json);
      });

    return () => {
      transitionData.value = null;
    };
  }, [type, id]);

  return { data: detailItem };
};
