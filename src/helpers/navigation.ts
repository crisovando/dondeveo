import { castTransitionData, transitionData } from "@/signals/transitionData";

type RouteFn = (path: string) => void;

// Structural subset of AudioVisualDto/DetailItem accepted by the detail page
// hero. `poster`/`backdrop` are nullable because HistoryItem (DetailItem-based)
// can carry a null poster from TMDb.
export interface DetailNavigationItem {
  id: number;
  title: string;
  poster: string | null;
  backdrop: string | null;
  mediaType: string;
}

// One stable name shared by the tapped tile and the destination avatar. The tile
// is named only on click, so each snapshot holds a single element with this name:
// duplicate actors cannot collide and one group rule covers every cast morph.
export const CAST_AVATAR_TRANSITION_NAME = "cast-avatar";

export interface PersonNavigationTarget {
  id: number;
  name: string;
  photo: string | null;
}

export function navigateToDetail(item: DetailNavigationItem, route: RouteFn) {
  transitionData.value = {
    id: item.id,
    title: item.title,
    poster: item.poster,
    backdrop: item.backdrop || "",
    from: window.location.pathname + window.location.search,
  };

  const path = `/detail/${item.mediaType}/${item.id}`;

  if (!document.startViewTransition) {
    route(path);
    return;
  }

  document.startViewTransition(() => route(path));
}

export function navigateToPerson(target: PersonNavigationTarget, route: RouteFn) {
  castTransitionData.value = {
    personId: target.id,
    photo: target.photo,
    name: target.name,
  };

  const path = `/persona/${target.id}`;

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
