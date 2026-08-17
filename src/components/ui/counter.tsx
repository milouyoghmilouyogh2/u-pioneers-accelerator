"use client";

import { useEffect, useRef, useState } from "react";

export function Counter({
  value,
  suffix = "",
  duration = 1800,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function run() {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    function showFinal() {
      if (started.current) return;
      started.current = true;
      setDisplay(value);
    }

    // Safety net: if the observer never fires (unsupported, blocked, or any
    // other reason), the stat must still end up showing the real number.
    const fallback = setTimeout(run, 1200);

    if (typeof IntersectionObserver === "undefined") {
      run();
      return () => clearTimeout(fallback);
    }

    // Must match the observer's threshold below - a sliver of the element
    // peeking into the viewport used to count as "already visible", so on
    // phones the count-up finished before the user ever scrolled to it.
    // Already-visible-at-load also isn't a scroll "arrival" - jump straight
    // to the final number instead of counting up on page load.
    const rect = node.getBoundingClientRect();
    const shownHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (rect.height > 0 && shownHeight / rect.height >= 0.4) {
      showFinal();
      clearTimeout(fallback);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          clearTimeout(fallback);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
