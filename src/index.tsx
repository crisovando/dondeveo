import { LocationProvider, Router, Route, lazy, hydrate } from "preact-iso";
import { useEffect } from "preact/hooks";

import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { loadGenres } from "./signals/genres";
import { loadFavorites } from "./signals/favorites";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/header.css";
import { loadHistory } from "./signals/history";
import { UpdateToast } from "./components/UpdateToast";

// Non-home routes are lazy-loaded: only "/" is server-rendered, so keeping Home
// as a static import preserves SSR hydration, while the other pages leave the
// initial bundle and load on demand when the user navigates to them.
const Detail = lazy(() => import("./pages/Detail").then((m) => m.Detail));
const Search = lazy(() => import("./pages/Search").then((m) => m.Search));
const Platform = lazy(() => import("./pages/Platform").then((m) => m.Platform));
const Favorites = lazy(() => import("./pages/Favorites").then((m) => m.Favorites));
const Historical = lazy(() => import("./pages/Historical").then((m) => m.Historical));
const NotFound = lazy(() => import("./pages/_404").then((m) => m.NotFound));

export function App() {
  useEffect(() => {
    loadGenres();
    loadFavorites();
    loadHistory();
  }, []);

  return (
    <LocationProvider>
      <Header />
      <main id="contenido">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/historical" component={Historical} />
          <Route path="/search" component={Search} />
          <Route path="/platform/:providerId" component={Platform} />
          <Route path="/detail/:type/:id" component={Detail} />
          <Route default component={NotFound} />
        </Router>
      </main>
      <UpdateToast />
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app") ?? undefined);
}
