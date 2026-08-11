import { LocationProvider, Router, Route } from "preact-iso";

import { Header } from "@/components/Header";
import { Home } from "@/pages/Home";
import { Detail } from "@/pages/Detail";
import { Search } from "@/pages/Search";
import { Platform } from "@/pages/Platform";
import { Favorites } from "@/pages/Favorites";
import { NotFound } from "@/pages/_404";
import { Historical } from "@/pages/Historical";

// Server-side twin of <App/> in src/index.tsx. Deliberately omits <UpdateToast/>
// (it pulls in the Vite-only virtual:pwa-register/preact module, which does not
// exist in the edge runtime) and the startup effect that loads localStorage
// signals. UpdateToast renders null on the client first paint, so excluding it
// here keeps the SSR DOM structurally identical to the hydrated client DOM.
export function AppSsr() {
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
    </LocationProvider>
  );
}
