---
name: architecture
description: Repository map, rendering model, conventions and the CI/CD pipeline. Read before changing any code.
type: agent-doc
generated: false
related: ["agents-readme", "design", "content"]
---

# Architecture

Part of the [agent knowledge base](./README.md). Visual rules live in
[design.md](./design.md); the copy pipeline lives in [content.md](./content.md).

## What this repository is

A single-page, statically exported portfolio site. There is **no server, no
database and no API at runtime** — `next build` emits plain HTML, CSS and JS to
`out/`, and GitHub Pages serves it.

```
.                              repo root
├── AGENTS.md                  entry point for agents
├── agents/                    this knowledge base
├── .github/workflows/
│   ├── deploy.yml             build + deploy to GitHub Pages (push to main)
│   ├── ci.yml                 lint + typecheck + build + agents:check (PRs)
│   └── sync-agents.yml        regenerate agents/ docs and commit (push to main)
├── scripts/sync-agents.mjs    agent doc generator + link-graph checker
├── public/.nojekyll           stops a Jekyll pass from eating _next/
├── src/
│   ├── app/
│   │   ├── layout.tsx         fonts, metadata, the inline `js` class script
│   │   ├── page.tsx           composes the sections — the only route
│   │   ├── globals.css        design tokens + glass utilities
│   │   └── icon.svg           favicon
│   ├── components/            one file per section, plus shared primitives
│   └── lib/content.ts         ALL site copy — the single source of truth
├── next.config.ts             output: "export", env-driven basePath
└── postcss.config.mjs         Tailwind v4
```

## Rendering model

| Concern | Decision |
| --- | --- |
| Output | `output: "export"` — fully static, no server runtime |
| Routing | `trailingSlash: true` so Pages resolves `about/index.html` |
| Images | `images.unoptimized` — the optimiser needs a server |
| Base path | `NEXT_PUBLIC_BASE_PATH`, auto-filled by `actions/configure-pages` |
| Fonts | `next/font/google` (Geist), self-hosted at build time |

### Client vs server components

Server by default. A component becomes a client component only when it needs an
event listener, a rAF loop or other browser-only state.

| Component | Why |
| --- | --- |
| `SiteHeader.tsx` | scroll state, scroll-spy, mobile menu |
| `RevealObserver.tsx` | one shared `IntersectionObserver` for the whole page |
| `Cursor.tsx` | pointer tracking + rAF |
| `PhysicsField.tsx` | canvas 2D + rAF |
| `ParallaxLayers.tsx` | pointer parallax + rAF |
| `TiltCard.tsx` | per-card pointer events + an idle-terminating rAF loop |
| — | everything else is a server component |

`Reveal.tsx` is a **server** component on purpose. It renders a plain
`<div data-reveal>` and nothing else; the animation is armed from CSS. This is
deliberate — see the content-visibility rule below.

`TiltCard` is a client component that takes `children`, so server-rendered cards
pass straight through it without becoming client components themselves.

### Motion layer

`src/lib/motion.ts` holds every shared primitive: `clamp`, `lerp`, `damp`
(frame-rate independent smoothing), the `prefersReducedMotion()` and
`hasFinePointer()` probes, and a single module-level `pointer` store.

Two rules keep it cheap, and both are load-bearing:

- **One set of listeners.** `attachPointerTracking()` is idempotent, so the
  cursor, the tilt cards and the particle canvas read the same pointer state
  instead of each attaching their own handlers.
- **The rAF loops write `transform` directly.** Driving this through React state
  would re-render on every frame. Where a CSS keyframe animation also applies to
  the same element (the backdrop blobs), the transform goes on a wrapper so the
  two do not fight over one property.

The whole layer is CSS 3D, a 2D canvas and `requestAnimationFrame` — no
dependency, which is why it can be dropped without touching the build.

### Content-visibility rule

**Anything that hides content behind JavaScript must have a non-JS path.**
This is a hard rule, learned from a real bug:

- `[data-reveal]` blocks render **visible** in the server HTML.
- An inline script in `layout.tsx` adds `.js` to `<html>` before first paint,
  which is what arms the hidden start state. No JS → nothing is ever hidden.
- The same inline script schedules a 3s fallback that reveals everything, and
  `RevealObserver` cancels it once the app boots. If the bundle never loads, the
  page still appears.
- `prefers-reduced-motion` zeroes transition **delays** as well as durations —
  a leftover delay leaves blocks stuck at `opacity: 0`.
- `RevealObserver` also reveals anything already on screen when it mounts. The
  observer only reports threshold crossings, and a block that straddles the fold
  at load can sit below its `0.1` threshold and so never fire — visible, but
  stranded at `opacity: 0`. The mount-time pass uses the same `-10%` boundary the
  observer does, so it is a no-op wherever the observer already fires.

Do not reintroduce `useState`-driven hiding in `Reveal`. It caused a blank page.

## Conventions

- **Copy lives in `src/lib/content.ts`.** Components render it; they never
  hardcode a sentence. Changing site text means changing that file — and then
  running `npm run agents:sync`, because the agent docs derive from it.
- **Adding a section** is three edits: the component, a render in `page.tsx`
  with a matching `id`, and an entry in `navItems`.
- **Adding a document to `agents/`** means linking it from
  [README.md](./README.md) and back-linking it here — or the orphan check fails.
- Match the surrounding style: no comment unless the *why* is non-obvious.
- Tailwind utilities only; the few custom classes are declared as `@utility` or
  `@layer components` in `globals.css`.

## Commands

```bash
npm run dev             # dev server
npm run build           # static export -> ./out
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
npm run agents:sync     # regenerate agents/ from src/lib/content.ts
npm run agents:check    # fail if agent docs are stale
```

## CI/CD pipeline

| Workflow | Trigger | Does |
| --- | --- | --- |
| `ci.yml` | pull requests, feature branches | lint, typecheck, build, `agents:check` |
| `sync-agents.yml` | push to `main` | regenerates agent docs, commits if changed |
| `deploy.yml` | push to `main` | builds and deploys `out/` to GitHub Pages |

Ordering detail worth keeping: in `deploy.yml`, **Configure Pages runs before
Build**, because the build step reads `steps.pages.outputs.base_path`. Moving it
after the build breaks asset paths on project pages.

`sync-agents.yml` commits with the default `GITHUB_TOKEN`, and pushes made with
that token do not trigger further workflow runs — so there is no loop, and no
`[skip ci]` marker is needed.

## Deployment

Set **Settings → Pages → Source → GitHub Actions** once. The base path is
auto-detected, so the same source works for a project site (`/<repo>`), a user
site (`""`) and a custom domain (`""`).
