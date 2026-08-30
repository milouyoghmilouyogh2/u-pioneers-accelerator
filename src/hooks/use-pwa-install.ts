"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Check if user already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowInstall(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Test mode: show banner after 5s even without event (for dev/testing)
    const testTimer = setTimeout(() => {
      if (!dismissed && !window.matchMedia("(display-mode: standalone)").matches) {
        setShowInstall(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(testTimer);
    };
  }, []);

  async function install() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstall(false);
        setDeferredPrompt(null);
        return;
      }
    }
    // If no deferredPrompt (test mode), just close
    setShowInstall(false);
  }

  function dismiss() {
    setShowInstall(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  }

  return { showInstall, install, dismiss };
}
