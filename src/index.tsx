import { LocationProvider, Router, Route, hydrate } from "preact-iso";
import { useEffect } from "preact/hooks";

import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Detail } from "./pages/Detail";
import { Search } from "./pages/Search";
import { Favorites } from "./pages/Favorites";
import { NotFound } from "./pages/_404";
import { loadGenres } from "./signals/genres";
import { loadFavorites } from "./signals/favorites";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/header.css";
import { loadHistory } from "./signals/history";
import { Historical } from "./pages/Historical";
import * as serviceWorkerRegistration from "./service-worker";

export function App() {
  useEffect(() => {
    loadGenres();
    loadFavorites();
    loadHistory();
  }, []);

  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/historical" component={Historical} />
          <Route path="/search" component={Search} />
          <Route path="/detail/:type/:id" component={Detail} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
  serviceWorkerRegistration.register();
}
