import { Search } from "lucide-preact";
import { useLocation } from "preact-iso";
import { useState } from "preact/hooks";

export function Header() {
  const { route, path } = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const handleClickMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOverlay = () => {
    setShowMenu(false);
  };

  const handleClickLogo = () => {
    if (!document.startViewTransition) {
      route("/");
      return;
    }
    document.startViewTransition(() => {
      route("/");
    });
  };

  const handleClickSearch = () => {
    if (!document.startViewTransition) {
      route("/search");
      return;
    }
    document.startViewTransition(() => {
      route("/search");
    });
  };

  const isSearchPage = path === "/search";

  return (
    <>
      <div class="menuButtonContainer">
        <button
          id="menuButton"
          class={`hamburgerButton ${showMenu ? "open" : ""}`}
          aria-expanded={showMenu}
          aria-label={showMenu ? "Cerrar menú" : "Abrir menú"}
          onClick={handleClickMenu}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <header class="header">
        <div id="overlay-menu" class={showMenu ? "show" : ""} onClick={handleClickOverlay} />
        <nav id="main-nav" className={`${showMenu ? "showing" : ""}`}>
          <span class="nav-label">Navegación</span>
          <ul class={"main-menu"}>
            <li>
              <a href="/home" class={path === "/home" ? "active" : ""}>
                Inicio
              </a>
            </li>
            <li>
              <a href="/favorites" class={path === "/favorites" ? "active" : ""}>
                Favoritos
              </a>
            </li>
            <li>
              <a href="/historical" class={path === "/historical" ? "active" : ""}>
                Historial
              </a>
            </li>
          </ul>
        </nav>
        <span class="logo-container" onClick={handleClickLogo}>
          <img class="logo" alt="Logo" src="/logo.svg" fetchpriority="high" />
          <img src="/logo-text.svg" alt="Donde veo" class="logo-text" fetchpriority="high" />
        </span>
        {!isSearchPage && <Search class="icon-search" onClick={handleClickSearch} />}
      </header>
    </>
  );
}
