/**
 * Shared motion primitives for the cursor, tilt and physics layers.
 *
 * Everything here is dependency-free and client-only. The pointer is tracked in
 * a single module-level store with one set of listeners, so N consumers (the
 * cursor, the tilt wrappers, the particle canvas) read the same state instead
 * of each attaching their own handlers.
 */

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

/**
 * Frame-rate independent smoothing. A plain `lerp(a, b, 0.1)` converges faster
 * on a 144Hz display than on 60Hz; this keeps the feel identical across them.
 */
export const damp = (from: number, to: number, smoothing: number, dt: number) =>
  lerp(from, to, 1 - Math.pow(smoothing, dt * 60));

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True for a mouse or trackpad — false on touch-only devices. */
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/* ------------------------------------------------------------------ */
/* pointer store                                                       */
/* ------------------------------------------------------------------ */

export type PointerState = {
  /** Viewport pixels. */
  x: number;
  y: number;
  /** Viewport pixels, smoothed — lags behind `x`/`y` for spring-y motion. */
  smoothX: number;
  smoothY: number;
  /** -1..1 relative to the viewport centre. */
  nx: number;
  ny: number;
  /** True once a real pointer position has been observed. */
  seen: boolean;
  /** True while the pointer is over an element marked interactive. */
  active: boolean;
  down: boolean;
};

export const pointer: PointerState = {
  x: 0,
  y: 0,
  smoothX: 0,
  smoothY: 0,
  nx: 0,
  ny: 0,
  seen: false,
  active: false,
  down: false,
};

/** Elements that grow the cursor ring when hovered. */
const INTERACTIVE = "a, button, [role='button'], input, textarea, select";

let listenersAttached = false;

/**
 * Starts pointer tracking and keeps it running for the lifetime of the page.
 * Returns a teardown, but callers are expected to keep it attached — the cost
 * is three passive listeners.
 */
export function attachPointerTracking(): () => void {
  if (typeof window === "undefined" || listenersAttached) return () => {};
  listenersAttached = true;

  const onMove = (event: PointerEvent) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!pointer.seen) {
      // Start the smoothed position on the first sample so nothing flies in
      // from the top-left corner.
      pointer.smoothX = event.clientX;
      pointer.smoothY = event.clientY;
      pointer.seen = true;
    }
    pointer.nx = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.ny = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.active = Boolean((event.target as Element)?.closest?.(INTERACTIVE));
  };

  const onDown = () => {
    pointer.down = true;
  };
  const onUp = () => {
    pointer.down = false;
  };
  const onLeave = () => {
    pointer.seen = false;
    pointer.active = false;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("pointerleave", onLeave, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointerleave", onLeave);
    listenersAttached = false;
  };
}

/** Keeps the smoothed coordinates in step with the raw ones. */
export function advancePointerSmoothing(dt: number, smoothing = 0.0016) {
  pointer.smoothX = damp(pointer.smoothX, pointer.x, smoothing, dt);
  pointer.smoothY = damp(pointer.smoothY, pointer.y, smoothing, dt);
}
