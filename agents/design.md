---
name: design
description: The glassmorphism design system — tokens, utilities, motion rules and what not to do.
type: agent-doc
generated: false
related: ["agents-readme", "architecture"]
---

# Design system

Part of the [agent knowledge base](./README.md). Where these rules are enforced
in code is described in [architecture.md](./architecture.md).

## Look

Dark, calm and glassy. A deep navy field with slow-drifting, pointer-parallaxed
colour blobs and a faint grid; every surface on top of it is a translucent,
blurred pane with a hairline border and a light-catch on its top edge. Colour is
used for emphasis only — accents mark structure, they do not fill space.

One accent family carries the identity:

| Role | Token | Hex |
| --- | --- | --- |
| Primary accent | `--color-iris-400` | `#8b93ff` |
| Bright accent / highlight | `--color-aqua-400` | `#56e1ff` |
| Warm accent | `--color-orchid-400` | `#c08cff` |
| Success / "available" | `--color-mint-400` | `#6ff0c0` |
| Page base | `--color-void` | `#04050c` |

Surfaces: `--color-void` → `--color-ink` → `--color-ink-soft`, darkest first.

## Utilities

Four custom utilities, all declared in `src/app/globals.css`. Use them rather
than re-deriving blur and border values inline.

| Utility | Purpose |
| --- | --- |
| `glass` | The base frosted panel: gradient fill, `blur(20px) saturate(150%)`, hairline border, inner top highlight, deep drop shadow |
| `glass-nav` | Darker, heavier variant for the sticky header and floating chips |
| `glass-sheen` | Adds the 1px light-catch line along a pane's top edge (needs `position: relative`) |
| `text-gradient` | The iris → white → aqua gradient used for the name and accents |

Tokens (colours, radii, keyframes) live in the `@theme` block, so they are
available as ordinary Tailwind utilities: `bg-iris-500`, `text-aqua-400`,
`animate-drift`, `rounded-4xl`.

## Composition rules

- **One `h1`.** Section titles are `h2`; card titles are `h3`.
- **Cards** are `rounded-3xl` glass panes with `p-5`/`p-6` and a `glass-sheen`
  top edge. Full-width feature panels use `rounded-[2rem]` or `rounded-4xl`.
- **Tiltable cards are wrapped in `TiltCard`**, which owns the 3D and the
  specular highlight — Projects cards, Skills groups and the About focus areas.
  The pane itself stays an ordinary glass `div`; keep `radiusClassName` matching
  the pane's radius so the highlight's rounded corners line up. Feature panels
  are deliberately *not* tilted: rotating a large surface reads as broken, not
  as depth.
- **Chips** split into two types and must not be mixed:
  - *Tech chips* — `font-mono`, `text-[0.7rem]`, `border-white/8`,
    `bg-white/4`. Used for stacks only.
  - *Skill chips* — `text-[0.75rem]`, `rounded-lg`, slightly brighter on hover.
- **Section rhythm** is fixed by `Section.tsx`: `py-16 sm:py-24` with a
  `max-w-6xl` container and `px-5 sm:px-8`.
- **Eyebrow labels** are uppercase, `tracking-[0.18em]`, `text-iris-300`, with a
  dot separator — this is the pattern for every section heading.

## Motion

CSS-first and dependency-free — there is no animation library, and there never
needs to be. Five systems, all decorative:

| System | Lives in | What it does |
| --- | --- | --- |
| Reveal on scroll | `RevealObserver.tsx` + `Reveal.tsx` | one shared `IntersectionObserver`; stagger via `delay`, capped ≈200ms |
| Backdrop parallax | `ParallaxLayers.tsx` | the three colour blobs keep their 26s/38s drift *and* translate against the pointer, by depth (42 / 26 / 60px) |
| Card tilt | `TiltCard.tsx` | real CSS 3D — `perspective(1000px)` + `rotateX`/`rotateY` up to `max` degrees (6–7 in practice), plus a specular highlight that tracks the pointer |
| Pointer cursor | `Cursor.tsx` | an additive aura and a lagging ring that trail the pointer at two different lags |
| Particle field | `PhysicsField.tsx` | canvas 2D with gravity, air drag, a home spring, cursor repulsion and wall restitution |

Rules that hold across all five:

- **`prefers-reduced-motion` disables, it does not soften.** `Cursor` stops and
  hides itself; `PhysicsField` never initialises (its canvas keeps the default
  300×150 backing store); `TiltCard` and `ParallaxLayers` never start a rAF loop.
  Reveal survives — but both durations *and* delays must be zeroed, or blocks sit
  at `opacity: 0` rather than merely un-animated.
- **Coarse pointers get none of it.** Every pointer-driven system bails out
  unless `(pointer: fine)` matches, so touch devices do no work at all.
- **The native cursor is never hidden.** `Cursor.tsx` only adds light around it;
  hiding the real cursor costs text-input affordances and is an a11y trap.
- **Idle costs nothing.** Each loop terminates when there is nothing left to do —
  `TiltCard` stops once the card has settled and its transform is reset.
- **Rotate small, translate large.** Tilt stays under 8°, parallax under ~60px,
  particles are 1–2px at 0.5–0.65 alpha. Anything louder stops reading as polish.

## Accessibility floors

- Body text sits at `text-white/60` or brighter on the dark field; `text-white/40`
  is for metadata only, never for prose.
- Every interactive element has a visible `:focus-visible` ring — defined once
  globally as a 2px iris outline with a 3px offset.
- Decorative layers (backdrop, blobs, particles, cursor, icons) are
  `aria-hidden`, and the motion layers are removed entirely for reduced-motion
  and coarse-pointer users — none of them carry meaning, so none of them may
  become the only way to perceive something.
- Contrast is checked against `--color-void`, not against a mid-page blob, since
  the background moves.

## Anti-patterns

- Do not add a second accent hue family. Four tokens is the budget.
- Do not stack `glass` on `glass` — nest at most one pane deep; use
  `bg-white/4` for the inner surface instead.
- Do not use `backdrop-blur` on large scrolling containers; it forces a
  repaint on every frame. It belongs on fixed layers and small panes.
- Do not introduce a component library or icon package. Icons are inline SVG in
  `Icon.tsx` and are added by extending its `IconName` union.
- Do not add an animation dependency, a cursor-hiding `cursor: none`, or a sixth
  motion system. The layer above is the motion budget.
- Do not animate layout properties (`width`, `top`, `filter`) — transforms and
  opacity only, and always from a rAF loop rather than React state.
