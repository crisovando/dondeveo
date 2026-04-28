import { DetailItem } from "@/shared/types";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { transitionData } from "@/signals/transitionData";

const URL_API = "/api/detail/{type}/{id}";

const detailDataSignal = signal<DetailItem | null>(null);

export const useDetailData = (type: string, id: string) => {
  useEffect(() => {
    if (detailDataSignal.value && String(detailDataSignal.value.id) === String(id)) return;

    detailDataSignal.value = null;

    fetch(URL_API.replace("{type}", type).replace("{id}", id.toString()))
      .then((res) => res.json())
      .then((json) => {
        detailDataSignal.value = json;
      });

    return () => {
      transitionData.value = null;
    };
  }, [type, id]);

  return { data: detailDataSignal.value };
};
