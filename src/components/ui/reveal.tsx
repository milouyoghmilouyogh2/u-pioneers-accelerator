"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Content that's already on screen at first paint isn't something the
  // user "arrived at" by scrolling - it should just be there, with no
  // animation played, instead of every above-the-fold section sliding up
  // together the instant the page loads.
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Safety net: whatever happens with the observer below, content must
    // never stay invisible - a silently-failing animation must not be able
    // to hide real page content. This must be long enough that it never
    // fires during ordinary scrolling (a 1.2s version used to force-reveal
    // sections before the user had even scrolled there) - it only exists
    // to catch a genuinely broken/unsupported observer.
    const fallback = setTimeout(() => setVisible(true), 10000);

    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- unsupported-API fallback, not derived from props/state
      setVisible(true);
      setSkipAnimation(true);
      return () => clearTimeout(fallback);
    }

    // Element may already be on screen by the time this effect runs
    // (e.g. above the fold) - show it in its final state immediately,
    // with no transition played, since there was no scroll "arrival".
    // Threshold is deliberately generous (0.4 = must be genuinely
    // substantially in view) so sections reveal once the user has actually
    // arrived, not the moment they first peek into the bottom of the screen.
    const rect = node.getBoundingClientRect();
    const shownHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (rect.height > 0 && shownHeight / rect.height >= 0.4) {
      setSkipAnimation(true);
      setVisible(true);
      clearTimeout(fallback);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          clearTimeout(fallback);
          observer.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", skipAnimation && "reveal-no-anim", visible && "is-visible", className)}
      style={{ transitionDelay: visible && !skipAnimation ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
