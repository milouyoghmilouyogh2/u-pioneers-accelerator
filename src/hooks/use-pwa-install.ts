"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  const checkAndShow = useCallback(() => {
    // Don't show if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    setShowInstall(true);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show our custom banner immediately when browser prompt appears
      setTimeout(() => setShowInstall(true), 500);
    };

    // When user clicks "Annuler" on browser prompt, userChoice fires with "dismissed"
    const dismissedHandler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.userChoice.then((result) => {
        if (result.outcome === "dismissed") {
          // Show our custom banner immediately
          setTimeout(() => setShowInstall(true), 300);
        }
      });
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Dev mode: show banner after 5s
    const testTimer = process.env.NODE_ENV === "development"
      ? setTimeout(checkAndShow, 5000)
      : undefined;

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (testTimer) clearTimeout(testTimer);
    };
  }, [checkAndShow]);

  async function install() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstall(false);
        setDeferredPrompt(null);
        return;
      }
      // If dismissed again, keep showing
      setTimeout(() => setShowInstall(true), 500);
    } else {
      // No deferred prompt — close and retry later
      setShowInstall(false);
      setTimeout(checkAndShow, 2000);
    }
  }

  return { showInstall, install };
}
