import { useEffect, useState } from "preact/hooks";

interface BeforeInstallPromptEvent {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

const IOS_HINT_SESSION_KEY = "dondeveo-ios-hint-dismissed";

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

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(readStandalone);
  const [installedEvent, setInstalledEvent] = useState(false);
  const [iosHintDismissed, setIOSHintDismissed] =
    useState(hasDismissedIOSHint);

  const isIOS = isIOSDevice();
  const canInstall = deferredPrompt !== null && !isStandalone;
  const isInstalled = isStandalone || installedEvent;
  const isIOSHintVisible =
    isIOS && !isStandalone && !isInstalled && !iosHintDismissed;

  useEffect(() => {
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

  return {
    canInstall,
    isStandalone,
    isIOS,
    install,
    isInstalled,
    isIOSHintVisible,
    dismissIOSHint,
  };
};