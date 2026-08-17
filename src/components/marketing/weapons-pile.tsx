"use client";

import { useEffect, useRef, useState } from "react";
import { motion, motionValue, animate, useInView, type MotionValue } from "motion/react";

type Weapon = { number: number; title: string; summary: string };

type CardValues = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
};

// Deterministic per-card pseudo-random number in [0, 1) - same seed always
// gives the same fall/fan, so the physics feel doesn't reshuffle between
// re-renders, but each of the 16 cards still gets its own distinct look.
function seeded(n: number) {
  const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);
}

const CARD_W = 168;
const CARD_H = 196;
const LIFT_SPRING = { type: "spring" as const, stiffness: 340, damping: 22 };
const REST_SPRING = { type: "spring" as const, stiffness: 260, damping: 20 };

function spacingFor(width: number) {
  if (width < 480) return 16;
  if (width < 768) return 22;
  if (width < 1024) return 28;
  return 34;
}

export function WeaponsPile({ weapons }: { weapons: Weapon[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFallen = useRef(false);
  const reducedMotion = useRef(false);
  const [canHover, setCanHover] = useState(false);
  const [spacing, setSpacing] = useState(28);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [values] = useState<CardValues[]>(() =>
    weapons.map(() => ({
      x: motionValue(0),
      y: motionValue(0),
      rotate: motionValue(0),
      scale: motionValue(1),
    }))
  );

  // Each card's resting spot on the baseline: a small, fixed random
  // vertical/rotational offset so the pile reads as naturally scattered
  // rather than a perfectly uniform stack.
  const [rest] = useState(() =>
    weapons.map((_, i) => ({
      y: (seeded(i + 300) - 0.5) * 12,
      rotate: (seeded(i + 400) - 0.5) * 18,
    }))
  );

  const inView = useInView(containerRef, { once: true, amount: 0.35 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotion.current = reduced;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability detection, unknowable during SSR
    setCanHover(!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    setSpacing(spacingFor(window.innerWidth));
    const onResize = () => setSpacing(spacingFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!inView || hasFallen.current) return;
    hasFallen.current = true;
    if (reducedMotion.current) return;
    weapons.forEach((_, i) => {
      const s1 = seeded(i);
      const s2 = seeded(i + 41);
      const s3 = seeded(i + 97);
      const s4 = seeded(i + 151);
      const fromY = -140 - s1 * 160;
      const fromX = (s2 - 0.5) * 50;
      const fromRotate = rest[i].rotate + (s3 - 0.5) * 60;
      const delay = s4 * 0.45;
      const { x, y, rotate } = values[i];

      animate(y, [fromY, 0], {
        type: "spring",
        stiffness: 220 + s1 * 60,
        damping: 12 + s2 * 5,
        mass: 0.85,
        delay,
      });
      animate(x, [fromX, 0], { type: "spring", stiffness: 190, damping: 15, delay });
      animate(rotate, [fromRotate, rest[i].rotate], {
        type: "spring",
        stiffness: 150 + s4 * 50,
        damping: 8 + s3 * 4,
        delay,
      });
    });
  }, [inView, weapons, values, rest]);

  function lift(i: number) {
    if (!hasFallen.current) return;
    setActiveIndex(i);
    const v = values[i];
    animate(v.y, -30, LIFT_SPRING);
    animate(v.rotate, 0, LIFT_SPRING);
    animate(v.scale, 1.14, LIFT_SPRING);
    if (i > 0) {
      animate(values[i - 1].x, -18, LIFT_SPRING);
      animate(values[i - 1].rotate, rest[i - 1].rotate - 6, LIFT_SPRING);
    }
    if (i < weapons.length - 1) {
      animate(values[i + 1].x, 18, LIFT_SPRING);
      animate(values[i + 1].rotate, rest[i + 1].rotate + 6, LIFT_SPRING);
    }
  }

  function settle(i: number) {
    setActiveIndex((cur) => (cur === i ? null : cur));
    const v = values[i];
    animate(v.y, 0, REST_SPRING);
    animate(v.rotate, rest[i].rotate, REST_SPRING);
    animate(v.scale, 1, REST_SPRING);
    if (i > 0) {
      animate(values[i - 1].x, 0, REST_SPRING);
      animate(values[i - 1].rotate, rest[i - 1].rotate, REST_SPRING);
    }
    if (i < weapons.length - 1) {
      animate(values[i + 1].x, 0, REST_SPRING);
      animate(values[i + 1].rotate, rest[i + 1].rotate, REST_SPRING);
    }
  }

  const pileWidth = CARD_W + spacing * (weapons.length - 1);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mt-10 overflow-x-auto overflow-y-visible py-8"
      style={{ height: CARD_H + 64 }}
    >
      <div className="relative mx-auto" style={{ width: pileWidth, height: CARD_H }}>
        {weapons.map((w, i) => {
          const { x, y, rotate, scale } = values[i];
          const isActive = activeIndex === i;
          return (
            <motion.div
              key={w.number}
              style={{
                x,
                y,
                rotate,
                scale,
                width: CARD_W,
                height: CARD_H,
                right: i * spacing,
                zIndex: isActive ? 100 : i,
              }}
              className="absolute top-0"
              onHoverStart={() => canHover && lift(i)}
              onHoverEnd={() => canHover && settle(i)}
              onTapStart={() => {
                if (canHover) return;
                if (activeIndex === i) settle(i);
                else {
                  if (activeIndex !== null) settle(activeIndex);
                  lift(i);
                }
              }}
              tabIndex={0}
              onFocus={() => lift(i)}
              onBlur={() => settle(i)}
            >
              <div className="card-luxury h-full w-full rounded-xl p-3 transition hover:border-gold-500/40">
                <span className="text-xs font-bold text-gold-500">
                  {String(w.number).padStart(2, "0")}
                </span>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-cream">{w.title}</p>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted">{w.summary}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
