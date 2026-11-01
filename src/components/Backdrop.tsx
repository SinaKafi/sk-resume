import { ParallaxLayers } from "./ParallaxLayers";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Fixed, non-interactive page backdrop: an aurora wash, three drifting blobs
 * (parallaxed against the pointer), a faint grid and a film-grain layer —
 * everything the glass panels sit on.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_-15%,#1a2250_0%,#0a0e20_42%,#04050c_100%)]" />

      <ParallaxLayers />

      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(80%_60%_at_50%_20%,#000_10%,transparent_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.13] mix-blend-soft-light"
        style={{ backgroundImage: `url("${NOISE}")` }}
      />

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void to-transparent" />
    </div>
  );
}
