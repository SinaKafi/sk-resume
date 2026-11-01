"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp, damp, hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Corner radius applied to the inner 3D layer and the specular sheen. */
  radiusClassName?: string;
  /** Maximum rotation in degrees. Kept low by default — this is polish, not a toy. */
  max?: number;
};

/**
 * Gives a card real CSS 3D: it rotates toward the pointer and a specular
 * highlight tracks across its surface, which is what sells the glass.
 *
 * The rotation is driven by a rAF loop that only runs while the card is
 * hovered or still settling, so an idle page costs nothing.
 */
export function TiltCard({
  children,
  className = "",
  radiusClassName = "rounded-3xl",
  max = 7,
}: TiltCardProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    const glow = glowRef.current;
    if (!inner || !glow) return;
    if (prefersReducedMotion() || !hasFinePointer()) return;

    let frame = 0;
    let last = 0;
    let hovering = false;

    // Current and target rotation, in degrees.
    let rx = 0;
    let ry = 0;
    let trx = 0;
    let tryy = 0;

    // Specular position, normalised to 0..1 across the card.
    let gx = 0.5;
    let gy = 0.5;
    let tgx = 0.5;
    let tgy = 0.5;
    let glowOpacity = 0;
    let targetGlow = 0;

    const tick = (now: number) => {
      const dt = last ? clamp((now - last) / 1000, 0, 0.05) : 0.016;
      last = now;

      rx = damp(rx, trx, 0.0005, dt);
      ry = damp(ry, tryy, 0.0005, dt);
      gx = damp(gx, tgx, 0.0005, dt);
      gy = damp(gy, tgy, 0.0005, dt);
      glowOpacity = damp(glowOpacity, targetGlow, 0.0005, dt);

      inner.style.transform = `perspective(1000px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
      glow.style.opacity = glowOpacity.toFixed(3);
      glow.style.background = `radial-gradient(420px circle at ${(gx * 100).toFixed(1)}% ${(gy * 100).toFixed(1)}%, rgba(255,255,255,0.13), transparent 62%)`;

      const settled =
        Math.abs(rx - trx) < 0.01 &&
        Math.abs(ry - tryy) < 0.01 &&
        Math.abs(glowOpacity - targetGlow) < 0.01;

      if (!hovering && settled) {
        inner.style.transform = "";
        glow.style.opacity = "0";
        frame = 0;
        last = 0;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = inner.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      tgx = clamp(px, 0, 1);
      tgy = clamp(py, 0, 1);
      // Pointer above centre tilts the top away from the viewer.
      trx = (0.5 - py) * max * 2;
      tryy = (px - 0.5) * max * 2;
      wake();
    };

    const onEnter = () => {
      hovering = true;
      targetGlow = 1;
      wake();
    };

    const onLeave = () => {
      hovering = false;
      targetGlow = 0;
      trx = 0;
      tryy = 0;
      wake();
    };

    inner.addEventListener("pointerenter", onEnter);
    inner.addEventListener("pointermove", onMove);
    inner.addEventListener("pointerleave", onLeave);

    return () => {
      inner.removeEventListener("pointerenter", onEnter);
      inner.removeEventListener("pointermove", onMove);
      inner.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      inner.style.transform = "";
    };
  }, [max]);

  return (
    <div className={`[perspective:1000px] ${className}`}>
      <div
        ref={innerRef}
        className={`relative h-full w-full will-change-transform ${radiusClassName}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ borderRadius: "inherit" }}
        />
      </div>
    </div>
  );
}
