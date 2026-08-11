import { Download, Search, X } from "lucide-preact";
import { useLocation } from "preact-iso";
import { useState } from "preact/hooks";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function Header() {
  const { path } = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const {
    canInstall,
    isStandalone,
    isInstalled,
    install,
    isIOSHintVisible,
    dismissIOSHint,
    isInstallBannerVisible,
    dismissInstallBanner,
  } = useInstallPrompt();

  const handleClickOverlay = () => {
    setShowMenu(false);
  };

  const showInstallButton = canInstall && !isStandalone && !isInstalled;

  const isHome = path === "/" || path === "/home";
  const isSearchPage = path === "/search";

  return (
    <>
      <button
        id="menuButton"
        class={`hamburgerButton ${showMenu ? "open" : ""}`}
        aria-expanded={showMenu}
        aria-controls="main-nav"
        aria-label={showMenu ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <a href="#contenido" class="skip-link">
        Saltar al contenido
      </a>
      <header class="header">
        <div id="overlay-menu" class={showMenu ? "show" : ""} onClick={handleClickOverlay} />
        <nav id="main-nav" class={showMenu ? "showing" : ""} aria-label="Navegación principal">
          <span class="nav-label">Navegación</span>
          <ul class="main-menu">
            <li>
              <a href="/" class={isHome ? "active" : ""}>
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
        <a class="logo-container" href="/" aria-label="Ir al inicio de Donde veo">
          <img class="logo" alt="" src="/logo.svg" fetchpriority="high" width="50" height="50" />
          <img
            src="/logo-text.svg"
            alt="Donde veo"
            class="logo-text"
            fetchpriority="high"
            width="211"
            height="40"
          />
        </a>
        {isIOSHintVisible && (
          <div class="ios-install-hint" role="status">
            <span class="ios-install-hint-text">Compartir → Añadir a Pantalla de Inicio</span>
            <button
              type="button"
              class="ios-install-hint-close"
              aria-label="Cerrar aviso"
              onClick={dismissIOSHint}
            >
              <X class="ios-install-hint-close-icon" aria-hidden="true" />
            </button>
          </div>
        )}
        {isInstallBannerVisible && (
          <div class="install-banner" role="status">
            <Download class="install-banner-icon" aria-hidden="true" />
            <span class="install-banner-text">Agregar a tu pantalla de inicio</span>
            <button
              type="button"
              class="install-banner-action"
              aria-label="Instalar aplicación"
              onClick={install}
            >
              Instalar
            </button>
            <button
              type="button"
              class="install-banner-close"
              aria-label="Cerrar aviso"
              onClick={dismissInstallBanner}
            >
              <X class="install-banner-close-icon" aria-hidden="true" />
            </button>
          </div>
        )}
        <div class="header-actions">
          {showInstallButton && (
            <button
              type="button"
              class="install-button"
              aria-label="Instalar aplicación"
              onClick={install}
            >
              <Download class="install-button-icon" aria-hidden="true" />
              <span>Instalar</span>
            </button>
          )}
          {!isSearchPage && (
            <a href="/search" class="icon-search-link" aria-label="Buscar películas y series">
              <Search class="icon-search" aria-hidden="true" />
            </a>
          )}
        </div>
      </header>
    </>
  );
}
