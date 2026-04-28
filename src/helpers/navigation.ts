import { transitionData } from "@/signals/transitionData";
import type { AudioVisualDto } from "@/shared/types";

type RouteFn = (path: string) => void;

export function navigateToDetail(item: AudioVisualDto, route: RouteFn) {
  transitionData.value = {
    id: item.id,
    title: item.title,
    poster: item.poster,
    backdrop: item.backdrop || "",
  };

  const path = `/detail/${item.mediaType}/${item.id}`;

  if (!document.startViewTransition) {
    route(path);
    return;
  }

  document.startViewTransition(() => route(path));
}

export function navigateToFavorites(route: RouteFn) {
  const path = `/favorites`;

  if (!document.startViewTransition) {
    route(path);
    return;
  }

  document.startViewTransition(() => route(path));
}
