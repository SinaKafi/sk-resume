"use client";

import { useEffect, useRef } from "react";
import { clamp, damp, hasFinePointer, pointer, prefersReducedMotion } from "@/lib/motion";

/** Depth per blob layer — larger moves further, which reads as closer. */
const LAYERS = [
  {
    depth: 42,
    className:
      "animate-drift absolute -left-40 -top-48 h-[42rem] w-[42rem] rounded-full bg-iris-500/22 blur-[130px]",
  },
  {
    depth: 26,
    className:
      "animate-drift-slow absolute -right-52 top-24 h-[38rem] w-[38rem] rounded-full bg-aqua-400/16 blur-[140px]",
  },
  {
    depth: 60,
    className:
      "animate-pulse-soft absolute bottom-[-14rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-orchid-400/16 blur-[150px]",
  },
];

/**
 * Moves the backdrop's colour blobs against the pointer at three different
 * depths, which is what gives the fixed background a sense of distance.
 *
 * Translates only — rotating or scaling elements this large is expensive, and
 * the blur radii already cost enough.
 */
export function ParallaxLayers() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;

    let frame = 0;
    let last = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const tick = (now: number) => {
      const dt = last ? clamp((now - last) / 1000, 0, 0.05) : 0.016;
      last = now;

      targetX = pointer.seen ? -pointer.nx : 0;
      targetY = pointer.seen ? -pointer.ny : 0;

      currentX = damp(currentX, targetX, 0.02, dt);
      currentY = damp(currentY, targetY, 0.02, dt);

      for (let index = 0; index < LAYERS.length; index += 1) {
        const element = refs.current[index];
        if (!element) continue;
        const { depth } = LAYERS[index];
        element.style.transform = `translate3d(${(currentX * depth).toFixed(2)}px, ${(currentY * depth).toFixed(2)}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      {LAYERS.map((layer, index) => (
        <div
          key={layer.className}
          ref={(element) => {
            refs.current[index] = element;
          }}
          /*
           * The transform is owned by the rAF loop above, so the drifting
           * keyframe animation runs on a child instead of fighting it.
           */
          className="absolute inset-0 will-change-transform"
        >
          <div className={layer.className} />
        </div>
      ))}
    </>
  );
}
