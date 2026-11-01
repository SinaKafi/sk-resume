"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * Ambient WebGL layer: a field of additive-glow particles that hang behind the
 * glass panes. The pointer acts as a gravity well — particles are pulled toward
 * it and a spring pulls them back to their home slot, with velocity damping, so
 * the field sloshes and settles instead of snapping. The camera drifts on a
 * GSAP-eased parallax in response to both the pointer and scroll.
 *
 * Decorative only — the canvas is `aria-hidden` and `pointer-events-none`, and
 * it is drawn *under* every pane, so nothing here is load-bearing for content.
 * Three escapes hatches are built in:
 *   - no WebGL  -> nothing is mounted and `Backdrop` carries the page as before
 *   - no JS     -> nothing is mounted, same as above
 *   - reduced motion -> one static frame, no pointer input, no ticker
 */

const PARTICLE_COUNT_DESKTOP = 1400;
const PARTICLE_COUNT_MOBILE = 650;

/** Field half-extents. Depth is shallow so the field reads as a sheet. */
const FIELD = { x: 26, y: 16, z: 9 };

/** Physics tunables, in world units per second. */
const SPRING = 4.4; // pull back toward the particle's home slot
const GRAVITY = 320; // pull toward the pointer
const SOFTENING = 9; // stops the inverse-square term exploding at the cursor
const MAX_FORCE = 58;
const DAMPING = 1.9; // exponential velocity decay
const MAX_SPEED = 26;

const VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;

  uniform float uOpacity;
  uniform float uPixelRatio;
  uniform float uScale;

  varying vec3 vColor;

  void main() {
    vColor = aColor;

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    // Perspective attenuation, so near particles bloom and far ones recede.
    gl_PointSize = aSize * uPixelRatio * uScale / max(-viewPosition.z, 0.001);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;

  void main() {
    // Round the square point into a soft glow using the point's own UV space.
    vec2 offset = gl_PointCoord - 0.5;
    float distanceToCenter = length(offset);
    if (distanceToCenter > 0.5) discard;

    float falloff = smoothstep(0.5, 0.0, distanceToCenter);
    falloff = pow(falloff, 1.9);

    gl_FragColor = vec4(vColor, falloff * uOpacity);
  }
`;

/** Accent family from the design tokens — no new hues. */
const PALETTE = ["#8b93ff", "#56e1ff", "#c08cff", "#b3b9ff", "#6ff0c0"];

/**
 * Context attributes must be supplied at creation time, and we create the
 * context ourselves so a missing WebGL implementation fails silently rather
 * than logging inside three.
 */
const CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: true,
  stencil: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  powerPreference: "high-performance",
  failIfMajorPerformanceCaveat: false,
};

function pickCount() {
  return window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
}

/** Deterministic-ish scatter: uniform in the box, brighter toward the middle. */
function buildField(count: number) {
  const positions = new Float32Array(count * 3);
  const homes = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  const color = new Color();

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;

    // Spread across the frame but biased slightly outward, so the middle of
    // the viewport — where the prose lives — stays the calmest part of the
    // field. Readability wins over even coverage.
    const x = (Math.random() * 2 - 1) * FIELD.x * (0.5 + Math.random() * 0.5);
    const y = (Math.random() * 2 - 1) * FIELD.y * (0.5 + Math.random() * 0.5);
    const z = (Math.random() * 2 - 1) * FIELD.z;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    homes[i3] = x;
    homes[i3 + 1] = y;
    homes[i3 + 2] = z;

    sizes[i] = 0.4 + Math.random() * 1.1;
    seeds[i] = Math.random() * Math.PI * 2;

    color.setStyle(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  return { positions, homes, velocities, sizes, colors, seeds };
}

export function MotionScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer: WebGLRenderer;

    // Probe for a context ourselves before handing a canvas to three. If the
    // browser has no WebGL (or the GPU is blocklisted) we bow out *quietly* —
    // `new WebGLRenderer` would otherwise log a context-creation error on its
    // way to throwing, which is noise for a purely decorative layer. The CSS
    // backdrop then carries the page exactly as it does today.
    const canvas = document.createElement("canvas");
    const context = (canvas.getContext("webgl2", CONTEXT_ATTRIBUTES) ??
      canvas.getContext("webgl", CONTEXT_ATTRIBUTES)) as
      | WebGL2RenderingContext
      | WebGLRenderingContext
      | null;

    if (!context) return;

    try {
      renderer = new WebGLRenderer({
        canvas,
        context,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block";
    container.appendChild(canvas);

    const scene = new Scene();
    const camera = new PerspectiveCamera(58, 1, 0.1, 200);
    camera.position.set(0, 0, 24);

    const count = pickCount();
    const field = buildField(count);

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(field.positions, 3));
    geometry.setAttribute("aSize", new BufferAttribute(field.sizes, 1));
    geometry.setAttribute("aColor", new BufferAttribute(field.colors, 3));

    const uniforms = {
      uOpacity: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uScale: { value: 190 },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
    });

    const points = new Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    const positionAttribute = geometry.getAttribute(
      "position",
    ) as BufferAttribute;

    const pointer = { x: 0, y: 0, active: false };
    // Projected pointer position on the z = 0 plane, in world space.
    const gravityWell = new Vector3(0, 0, 0);
    const projection = new Vector3();
    const parallax = { x: 0, y: 0, scroll: 0 };

    const resize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(uniforms.uPixelRatio.value);
      renderer.setSize(width, height, false);
    };

    resize();

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointer.active = true;
    };

    const onPointerLeave = (event: PointerEvent) => {
      // `pointerout` also fires when the pointer merely crosses between
      // elements; only a null `relatedTarget` means it left the window.
      if (event.relatedTarget === null) pointer.active = false;
    };

    // GSAP `quickTo` reuses one tween per property instead of allocating a new
    // one per pointer/scroll event — the easing lives here, the physics stays
    // in the frame loop above.
    const scrollTo = gsap.quickTo(parallax, "scroll", {
      duration: 1.1,
      ease: "power3.out",
    });
    const driftX = gsap.quickTo(parallax, "x", {
      duration: 1.4,
      ease: "power3.out",
    });
    const driftY = gsap.quickTo(parallax, "y", {
      duration: 1.4,
      ease: "power3.out",
    });

    const onScroll = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      scrollTo(Math.min(window.scrollY / max, 1));
    };

    const onPointerForParallax = (event: PointerEvent) => {
      driftX(((event.clientX / window.innerWidth) * 2 - 1) * 2.2);
      driftY(-((event.clientY / window.innerHeight) * 2 - 1) * 1.4);
    };

    /** One simulation + draw step. `dt` is seconds. */
    const step = (dt: number, time: number) => {
      const { positions, homes, velocities, seeds } = field;

      // Put the gravity well where the pointer ray crosses the z = 0 plane.
      if (pointer.active) {
        projection.set(pointer.x, pointer.y, 0.5).unproject(camera);
        projection.sub(camera.position).normalize();
        const distance = -camera.position.z / projection.z;
        gravityWell
          .copy(camera.position)
          .addScaledVector(projection, distance);
      }

      const damping = Math.exp(-DAMPING * dt);
      const active = pointer.active;

      for (let i = 0; i < count; i += 1) {
        const i3 = i * 3;

        let x = positions[i3];
        let y = positions[i3 + 1];
        let z = positions[i3 + 2];

        let vx = velocities[i3];
        let vy = velocities[i3 + 1];
        let vz = velocities[i3 + 2];

        // Ambient drift so the field breathes even with no pointer.
        const seed = seeds[i];
        vx += Math.sin(time * 0.35 + seed) * 1.4 * dt;
        vy += Math.cos(time * 0.29 + seed * 1.7) * 1.4 * dt;

        if (active) {
          const dx = gravityWell.x - x;
          const dy = gravityWell.y - y;
          const dz = gravityWell.z - z;

          // Softened inverse-square falloff, clamped so nothing slingshots.
          const strength = Math.min(
            GRAVITY / (dx * dx + dy * dy + dz * dz + SOFTENING),
            MAX_FORCE,
          );

          vx += dx * strength * dt;
          vy += dy * strength * dt;
          vz += dz * strength * dt;
        }

        // Spring back to the home slot.
        vx += (homes[i3] - x) * SPRING * dt;
        vy += (homes[i3 + 1] - y) * SPRING * dt;
        vz += (homes[i3 + 2] - z) * SPRING * dt;

        vx *= damping;
        vy *= damping;
        vz *= damping;

        // Clamp speed, preserving direction.
        const speedSq = vx * vx + vy * vy + vz * vz;
        if (speedSq > MAX_SPEED * MAX_SPEED) {
          const scale = MAX_SPEED / Math.sqrt(speedSq);
          vx *= scale;
          vy *= scale;
          vz *= scale;
        }

        x += vx * dt;
        y += vy * dt;
        z += vz * dt;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        velocities[i3] = vx;
        velocities[i3 + 1] = vy;
        velocities[i3 + 2] = vz;
      }

      positionAttribute.needsUpdate = true;

      // Eased camera parallax: pointer first, then scroll, then look at origin.
      camera.position.x = parallax.x;
      camera.position.y = parallax.y;
      camera.position.z = 24 + parallax.scroll * 8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    let rafTicker: (() => void) | null = null;
    let lastTime = performance.now();

    const start = () => {
      lastTime = performance.now();
      rafTicker = () => {
        const now = performance.now();
        // Clamp dt so a backgrounded tab does not explode the integrator.
        const dt = Math.min((now - lastTime) / 1000, 1 / 30);
        lastTime = now;
        step(dt, now / 1000);
      };
      gsap.ticker.add(rafTicker);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafTicker) gsap.ticker.remove(rafTicker);
        rafTicker = null;
      } else if (!rafTicker) {
        start();
      }
    };

    const onResize = () => resize();

    if (prefersReducedMotion) {
      // A single static frame: the field is present, but it never moves and
      // the pointer is ignored. No ticker, no listeners.
      uniforms.uOpacity.value = 0.3;
      step(0, 0);
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointermove", onPointerForParallax, {
        passive: true,
      });
      window.addEventListener("pointerout", onPointerLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibilityChange);
      onScroll();

      gsap.fromTo(
        uniforms.uOpacity,
        { value: 0 },
        { value: 0.42, duration: 1.8, ease: "power2.out" },
      );

      start();
    }

    window.addEventListener("resize", onResize);

    return () => {
      if (rafTicker) gsap.ticker.remove(rafTicker);
      gsap.killTweensOf(uniforms.uOpacity);
      gsap.killTweensOf(parallax);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointermove", onPointerForParallax);
      window.removeEventListener("pointerout", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    />
  );
}
