import { useEffect, useState } from "preact/hooks";

interface BeforeInstallPromptEvent {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

const IOS_HINT_SESSION_KEY = "dondeveo-ios-hint-dismissed";
const INSTALL_BANNER_SESSION_KEY = "dondeveo-install-banner-dismissed";

const isIOSDevice = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

function readStandalone(): boolean {
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  return (navigator as { standalone?: boolean }).standalone === true;
}

function hasDismissedIOSHint(): boolean {
  try {
    return window.sessionStorage.getItem(IOS_HINT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function hasDismissedInstallBanner(): boolean {
  try {
    return window.sessionStorage.getItem(INSTALL_BANNER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  // Browser-only state is hydrated inside an effect (not in useState
  // initializers) so the SSR first paint is deterministic: every value starts
  // at its safe default and matches what the server rendered.
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedEvent, setInstalledEvent] = useState(false);
  const [iosHintDismissed, setIOSHintDismissed] = useState(false);
  const [installBannerDismissed, setInstallBannerDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const canInstall = deferredPrompt !== null && !isStandalone;
  const isInstalled = isStandalone || installedEvent;
  const isIOSHintVisible =
    isIOS && !isStandalone && !isInstalled && !iosHintDismissed;
  const isInstallBannerVisible =
    canInstall && !isStandalone && !isInstalled && !installBannerDismissed;

  useEffect(() => {
    setIsStandalone(readStandalone());
    setIsIOS(isIOSDevice());
    setIOSHintDismissed(hasDismissedIOSHint());
    setInstallBannerDismissed(hasDismissedInstallBanner());

    const onInstallPrompt = (event: Event) => {
      setDeferredPrompt(event as unknown as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setInstalledEvent(true);
    };
    const media = window.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = () => {
      setIsStandalone(readStandalone());
    };

    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    media.addEventListener("change", onDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      media.removeEventListener("change", onDisplayModeChange);
    };
  }, []);

  useEffect(() => {
    if (!isIOSHintVisible) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      const hint = document.querySelector(".ios-install-hint");
      if (hint && hint.contains(event.target as Node)) return;
      setIOSHintDismissed(true);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isIOSHintVisible]);

  const install = async () => {
    const promptEvent = deferredPrompt;
    if (!promptEvent) return;
    setDeferredPrompt(null);
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch {
      // user dismissed the prompt or it failed: nothing to surface
    }
  };

  const dismissIOSHint = () => {
    setIOSHintDismissed(true);
    try {
      window.sessionStorage.setItem(IOS_HINT_SESSION_KEY, "1");
    } catch {
      // storage unavailable: hint stays hidden for this session view
    }
  };

  const dismissInstallBanner = () => {
    setInstallBannerDismissed(true);
    try {
      window.sessionStorage.setItem(INSTALL_BANNER_SESSION_KEY, "1");
    } catch {
      // storage unavailable: banner stays hidden for this session view
    }
  };

  return {
    canInstall,
    isStandalone,
    isIOS,
    install,
    isInstalled,
    isIOSHintVisible,
    dismissIOSHint,
    isInstallBannerVisible,
    dismissInstallBanner,
  };
};