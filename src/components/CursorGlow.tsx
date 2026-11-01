"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * GSAP cursor: a small solid dot that tracks the pointer closely, trailed by a
 * larger ring that lags behind it. Hovering anything clickable makes the ring
 * snap open and the dot shrink, so the cursor itself confirms the target.
 *
 * The whole effect is opt-in and reversible:
 *   - only on `(pointer: fine)` — touch devices keep the native cursor
 *   - never under `prefers-reduced-motion` — the effect is pure decoration
 *   - the native cursor is only hidden once this component has actually armed
 *     (`html.cursor-glow`), so with JavaScript off nothing is suppressed
 */

const INTERACTIVE = "a[href], button, [role='button'], [data-magnetic]";

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const canHover = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!canHover || prefersReducedMotion) return;

    const root = document.documentElement;
    root.classList.add("cursor-glow");

    let armed = false;
    const moveDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const moveRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const reveal = () => {
      if (armed) return;
      armed = true;
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
    };

    const conceal = () => {
      armed = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    const onPointerMove = (event: PointerEvent) => {
      reveal();
      moveDot(event.clientX);
      moveDotY(event.clientY);
      moveRing(event.clientX);
      moveRingY(event.clientY);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.(INTERACTIVE)) return;
      gsap.to(ring, {
        scale: 2.1,
        borderColor: "rgba(139,147,255,0.85)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: 0.4, duration: 0.35, ease: "power3.out" });
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.(INTERACTIVE)) return;
      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(255,255,255,0.35)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: 1, duration: 0.35, ease: "power3.out" });
    };

    const onPointerDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.25, ease: "power2.out" });
    };

    const onPointerUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    };

    const onDocumentLeave = (event: MouseEvent) => {
      if (event.relatedTarget === null) conceal();
    };

    // `autoAlpha` is opacity + visibility, so the pair is also taken out of the
    // accessibility tree while hidden.
    gsap.set([dot, ring], { autoAlpha: 0, xPercent: -50, yPercent: -50 });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseout", onDocumentLeave);

    return () => {
      root.classList.remove("cursor-glow");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseout", onDocumentLeave);
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-100">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-white opacity-0 shadow-[0_0_12px_rgba(139,147,255,0.9)]"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white/35 opacity-0 backdrop-blur-[1px]"
      />
    </div>
  );
}
