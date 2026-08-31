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
      setTimeout(() => setShowInstall(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Dev mode: show banner after 5s
    const testTimer = process.env.NODE_ENV === "development"
      ? setTimeout(() => {
          if (!localStorage.getItem("pwa-install-dismissed") &&
              !window.matchMedia("(display-mode: standalone)").matches) {
            setShowInstall(true);
          }
        }, 5000)
      : undefined;

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (testTimer) clearTimeout(testTimer);
    };
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
      setDeferredPrompt(null);
    }
  }

  function dismiss() {
    setShowInstall(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  }

  return { showInstall, install, dismiss };
}
