"use client";

import { useEffect, useRef } from "react";
import { clamp, hasFinePointer, pointer, prefersReducedMotion } from "@/lib/motion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Rest position — the field is pulled back here, see below. */
  homeX: number;
  homeY: number;
  radius: number;
  /** Index into the palette. */
  tint: number;
};

const TINTS = [
  "rgba(255,255,255,0.55)",
  "rgba(139,147,255,0.65)",
  "rgba(86,225,255,0.55)",
  "rgba(192,140,255,0.5)",
];

/**
 * A canvas-2D particle field with real (if simple) physics: gravity, air drag,
 * an inverse-distance repulsion from the cursor, wall collisions with
 * restitution, and a weak spring back to each particle's home.
 *
 * The spring is what keeps gravity honest. With gravity alone the particles
 * would all pile up along the bottom edge within seconds; the restoring force
 * balances it so the field hovers, gets shoved around, and settles again.
 *
 * Sits behind the content, so particles drift past underneath the frosted glass
 * panes and get blurred by them.
 */
export function PhysicsField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const GRAVITY = 22; // px/s²
    const DRAG = 1.05; // per second, as an exponential decay rate
    const SPRING = 0.9; // s⁻², pulls a particle back to its home
    const REPEL_RADIUS = 150;
    const REPEL_FORCE = 26000;
    const RESTITUTION = 0.45;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let last = 0;

    const seed = () => {
      // Fewer, larger particles on small screens; the field is decorative.
      const area = width * height;
      const count = clamp(Math.round(area / 26000), 18, 56);

      particles = Array.from({ length: count }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          vx: 0,
          vy: 0,
          homeX: x,
          homeY: y,
          radius: 0.8 + Math.random() * 1.5,
          tint: Math.floor(Math.random() * TINTS.length),
        };
      });
    };

    const resize = () => {
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const step = (dt: number) => {
      const cursorActive = pointer.seen && hasFinePointer();

      for (const particle of particles) {
        // Gravity, downward, always on.
        particle.vy += GRAVITY * dt;

        // Spring back toward home — balances gravity so nothing piles up.
        particle.vx += (particle.homeX - particle.x) * SPRING * dt;
        particle.vy += (particle.homeY - particle.y) * SPRING * dt;

        // Cursor repulsion, strongest at the centre and falling off to zero.
        if (cursorActive) {
          const dx = particle.x - pointer.smoothX;
          const dy = particle.y - pointer.smoothY;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < REPEL_RADIUS * REPEL_RADIUS && distanceSq > 1) {
            const distance = Math.sqrt(distanceSq);
            const falloff = 1 - distance / REPEL_RADIUS;
            const force = (REPEL_FORCE * falloff * falloff) / distance;
            particle.vx += dx * force * dt;
            particle.vy += dy * force * dt;
          }
        }

        // Air drag — exponential so it behaves the same at any frame rate.
        const decay = Math.exp(-DRAG * dt);
        particle.vx *= decay;
        particle.vy *= decay;

        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        // Walls, with restitution so impacts read as bounces.
        if (particle.x < 0) {
          particle.x = 0;
          particle.vx = Math.abs(particle.vx) * RESTITUTION;
        } else if (particle.x > width) {
          particle.x = width;
          particle.vx = -Math.abs(particle.vx) * RESTITUTION;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy = Math.abs(particle.vy) * RESTITUTION;
        } else if (particle.y > height) {
          particle.y = height;
          particle.vy = -Math.abs(particle.vy) * RESTITUTION;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = TINTS[particle.tint];
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      const dt = last ? clamp((now - last) / 1000, 0, 0.033) : 0.016;
      last = now;
      step(dt);
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    start();

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[5]"
    />
  );
}
