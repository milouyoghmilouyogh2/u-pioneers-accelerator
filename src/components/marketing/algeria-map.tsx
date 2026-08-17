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

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fallback = setTimeout(() => setVisible(true), 900);

    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- unsupported-API fallback, not derived from props/state
      setVisible(true);
      return () => clearTimeout(fallback);
    }
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
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
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.97)",
        transition: "opacity 1.1s ease-out, transform 1.1s ease-out",
      }}
      aria-hidden
    >
      <path
        d={ALGERIA_PATH_D}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="0 4.2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
