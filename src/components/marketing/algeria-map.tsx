"use client";

import { useEffect, useRef, useState } from "react";
import { ALGERIA_VIEWBOX, ALGERIA_PATH_D } from "./algeria-data";

// Real wilaya-boundary geometry (amCharts geodata, MIT-licensed geographic
// data), rendered as a dotted outline - not a filled shape - so it reads as
// a subtle map watermark rather than a solid blob. A single <path> element
// with a small round-capped dash pattern: cheap to render (one draw call,
// GPU-composited), no per-dot DOM nodes, no animation loop.
export function AlgeriaMap({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);
  // The map lives in the hero, so it's on screen at first paint on every
  // normal visit - that's not a scroll "arrival", so it should just be
  // there already instead of fading in on load.
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fallback = setTimeout(() => setVisible(true), 900);

    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- unsupported-API fallback, not derived from props/state
      setVisible(true);
      setSkipAnimation(true);
      return () => clearTimeout(fallback);
    }
    const rect = node.getBoundingClientRect();
    const shownHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (rect.height > 0 && shownHeight / rect.height >= 0.1) {
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
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={ALGERIA_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`algeria-map${visible ? " is-visible" : ""}${skipAnimation ? " no-anim" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden
    >
      <path
        d={ALGERIA_PATH_D}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="0 5.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
