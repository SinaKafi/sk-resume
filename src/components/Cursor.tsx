"use client";

import { useEffect, useRef } from "react";
import {
  advancePointerSmoothing,
  attachPointerTracking,
  clamp,
  damp,
  hasFinePointer,
  pointer,
  prefersReducedMotion,
} from "@/lib/motion";

/**
 * Additive cursor layer: a soft aura and a lagging ring that trail the pointer.
 *
 * Deliberately *additive* — the native cursor stays visible. Hiding it breaks
 * text-input affordances and is a well-known accessibility trap, so this only
 * adds light around it.
 *
 * Movement is written straight to `transform` from a rAF loop, so following the
 * pointer never triggers a React render.
 */
export function Cursor() {
  const auraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const aura = auraRef.current;
    const ring = ringRef.current;
    if (!root || !aura || !ring) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let last = 0;
    let ringX = 0;
    let ringY = 0;
    let auraX = 0;
    let auraY = 0;
    let scale = 1;
    let visible = false;
    const detach = attachPointerTracking();

    const tick = (now: number) => {
      const dt = last ? clamp((now - last) / 1000, 0, 0.05) : 0.016;
      last = now;

      advancePointerSmoothing(dt);

      // Two different lags: the ring is tight, the aura drifts.
      ringX = damp(ringX, pointer.smoothX, 0.0001, dt);
      ringY = damp(ringY, pointer.smoothY, 0.0001, dt);
      auraX = damp(auraX, pointer.x, 0.00002, dt);
      auraY = damp(auraY, pointer.y, 0.00002, dt);

      const target = pointer.active ? 1.8 : pointer.down ? 0.7 : 1;
      scale = damp(scale, target, 0.0002, dt);

      if (pointer.seen !== visible) {
        visible = pointer.seen;
        root.style.opacity = visible ? "1" : "0";
      }

      if (visible) {
        aura.style.transform = `translate3d(${auraX - 130}px, ${auraY - 130}px, 0) scale(${scale})`;
        ring.style.transform = `translate3d(${ringX - 14}px, ${ringY - 14}px, 0) scale(${scale})`;
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      root.style.display = "block";
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      root.style.display = "none";
    };

    // Only run for a real pointer, and never against an explicit preference.
    const sync = () => {
      if (prefersReducedMotion() || !hasFinePointer()) stop();
      else start();
    };

    sync();
    motionQuery.addEventListener("change", sync);

    return () => {
      motionQuery.removeEventListener("change", sync);
      stop();
      detach();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      /*
       * Starts hidden inline rather than via a class: `display` is toggled
       * imperatively in the effect, and a class would win over the inline
       * value. Inline also means nothing is stranded on screen if the bundle
       * never boots.
       */
      style={{ display: "none" }}
      className="pointer-events-none fixed inset-0 z-60 opacity-0 transition-opacity duration-300"
    >
      <div
        ref={auraRef}
        className="absolute left-0 top-0 h-[260px] w-[260px] rounded-full opacity-70 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(139,147,255,0.16) 0%, rgba(86,225,255,0.07) 45%, transparent 70%)",
        }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-7 w-7 rounded-full border border-white/35 bg-white/4 backdrop-blur-[1px] will-change-transform"
      />
    </div>
  );
}
