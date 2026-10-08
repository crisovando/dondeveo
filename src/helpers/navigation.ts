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

// A lazy destination suspends on its chunk and lands its real DOM swap after
// the transition's new-state capture, and Chrome cancels the whole transition
// when that swap lands mid-animation: the destination module must be awaited
// inside the callback, before the capture.
const routeModules: Record<string, () => Promise<unknown>> = {
  detail: () => import("@/pages/Detail"),
  favorites: () => import("@/pages/Favorites"),
  persona: () => import("@/pages/Person"),
};

function preloadRoute(path: string): Promise<unknown> | undefined {
  return routeModules[path.split("/")[1]]?.();
}

// The route commit is a microtask chain, and only a macrotask boundary can
// witness it: a rAF would deadlock, because rendering is suppressed while
// the callback's promise is pending.
function afterRouteCommit(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function navigateWithTransition(path: string, route: RouteFn) {
  if (!document.startViewTransition) {
    route(path);
    return;
  }

  const preload = preloadRoute(path);
  document.startViewTransition(async () => {
    // route() must win the navigation: preact-iso's own window-level click
    // handler fires later in the same click dispatch.
    route(path);
    if (preload) await preload.catch(() => undefined);
    await afterRouteCommit();
  });
}

export function navigateToDetail(item: DetailNavigationItem, route: RouteFn) {
  transitionData.value = {
    id: item.id,
    title: item.title,
    poster: item.poster,
    backdrop: item.backdrop || "",
    from: window.location.pathname + window.location.search,
  };

  navigateWithTransition(`/detail/${item.mediaType}/${item.id}`, route);
}

export function navigateToPerson(target: PersonNavigationTarget, route: RouteFn) {
  castTransitionData.value = {
    personId: target.id,
    photo: target.photo,
    name: target.name,
  };

  navigateWithTransition(`/persona/${target.id}`, route);
}

export function navigateToFavorites(route: RouteFn) {
  navigateWithTransition(`/favorites`, route);
}
