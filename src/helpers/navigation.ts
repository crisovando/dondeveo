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

// Named on click, not on render, so each snapshot holds one holder: duplicates cannot collide.
export const CAST_AVATAR_TRANSITION_NAME = "cast-avatar";

export interface PersonNavigationTarget {
  id: number;
  name: string;
  photo: string | null;
}

// Await the destination chunk: a swap after the new-state capture cancels the whole transition.
const routeModules: Record<string, () => Promise<unknown>> = {
  detail: () => import("@/pages/Detail"),
  favorites: () => import("@/pages/Favorites"),
  persona: () => import("@/pages/Person"),
};

function preloadRoute(path: string): Promise<unknown> | undefined {
  return routeModules[path.split("/")[1]]?.();
}

// Macrotask, not rAF: rendering is suppressed while the callback's promise is pending.
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
    // Run first: preact-iso's window-level click handler navigates later in the same dispatch.
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
