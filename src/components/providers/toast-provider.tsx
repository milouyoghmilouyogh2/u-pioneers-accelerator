"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, XCircle, X } from "lucide-react";

type ToastKind = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastKind, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
};

const KIND_STYLES: Record<ToastKind, string> = {
  success: "border-emerald-500/40 text-cream",
  error: "border-red-500/40 text-cream",
  warning: "border-gold-500/40 text-cream",
  info: "border-cream-dim/30 text-cream",
};

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.kind];
          return (
            <div
              key={toast.id}
              className={cnToast(toast.kind)}
              role="status"
            >
              <Icon className="size-5 shrink-0" />
              <p className="text-sm leading-snug">{toast.message}</p>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="ms-2 shrink-0 opacity-60 hover:opacity-100"
                aria-label="إغلاق"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

function cnToast(kind: ToastKind) {
  return `card-luxury animate-fade-up flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-xl ${KIND_STYLES[kind]}`;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
