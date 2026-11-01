# sk-portfolio

A single-page glassmorphism portfolio for **Sina Kafi** — Senior Front-End Developer.

Built with **Next.js 16** (App Router), **React 19**, **TypeScript** and **Tailwind CSS v4**,
statically exported and deployed to **GitHub Pages** by a GitHub Actions workflow.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Motion | CSS + `IntersectionObserver` for reveals; WebGL particle field (`three`) + cursor and easing (`gsap`) for ambient decoration |
| Icons | Inline SVG components (no icon package) |
| Hosting | GitHub Pages via `actions/deploy-pages` |

Everything is prerendered to plain HTML/CSS/JS in `out/` — no server, no runtime
dependencies, no external requests beyond the self-hosted font files. The WebGL
field and the custom cursor are decoration: both degrade to a static frame or to
nothing when WebGL is missing, when JavaScript is off, on touch pointers, and
under `prefers-reduced-motion`.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build         # static export -> ./out
npm run lint          # ESLint
npm run typegen       # write .next/types without a full build
npm run typecheck     # next typegen && tsc --noEmit
npm run agents:sync   # regenerate agents/ from src/lib/content.ts
npm run agents:check  # fail if agent docs are stale
npm run start         # serve the exported ./out folder locally
```

---

## Editing content

**All copy lives in one file:** `src/lib/content.ts`.
It is the single source of truth for the profile, experience, projects, skills
and navigation. Components only render it — no hardcoded strings to hunt down.

It is also the source for the **agent knowledge base** under `agents/`, which is
regenerated from it. After changing `src/lib/content.ts`, run:

```bash
npm run agents:sync
```

The source of truth for the resume-style copy is `agents/content.md`; when that
changes, mirror it into `src/lib/content.ts`.

### Adding a job

Append an object to the `experience` array:

```ts
{
  company: "Company",
  role: "Senior Front-End Developer",
  location: "Tehran, Iran",
  period: "2025 – Present",
  summary: "Optional framing paragraph.",
  highlights: [{ title: "What you did", body: "Why it mattered." }],
  stack: ["React", "TypeScript"],
}
```

Adding a **new section** to the nav means three things: create the component,
render it in `src/app/page.tsx` with a matching `id`, and add an entry to
`navItems` in `src/lib/content.ts`.

---

## Agent knowledge base

`AGENTS.md` is the entry point for AI agents. The `agents/` directory is a set of
documents that describe the project, the person behind it and the codebase, so an
agent does not have to re-derive anything from source.

| Document | Contains | Origin |
| --- | --- | --- |
| `agents/README.md` | Index, recursion rules, sync contract | manual |
| `agents/business.md` | Positioning, experience timeline, accomplishments, projects, contact | generated |
| `agents/skill.md` | Skill groups, stack per role, technology → usage index | generated |
| `agents/architecture.md` | Repo map, rendering model, conventions, CI/CD | manual |
| `agents/design.md` | Glass design system: tokens, utilities, motion rules | manual |
| `agents/content.md` | Raw resume copy — the upstream human source | manual |
| `agents/meta/index.md` | Manifest: a content hash per document | generated |

### It's a graph, not a pile

Two invariants are enforced by `npm run agents:check`:

1. **Every link resolves** — any markdown link to a local `.md` file under
   `agents/` must point at a file that exists.
2. **Every document is reachable** — following links from `AGENTS.md` must visit
   every document. A document nothing links to is an *orphan* and fails.

So a new document must be linked from `agents/README.md` and link back.

### Staying in sync

`node scripts/sync-agents.mjs` regenerates the derived documents from
`src/lib/content.ts`. It is deliberately churn-free:

- **No timestamps.** Freshness is a content hash of the source file, so a
  document is rewritten only when the content feeding it actually changed.
- **Files are written only when their bytes differ.**
- The generated files carry a banner; never hand-edit them.

| Command | Does |
| --- | --- |
| `npm run agents:sync` | Regenerate `agents/` from `src/lib/content.ts` |
| `npm run agents:check` | Exit non-zero if a doc is stale or the graph is broken |

In CI, `ci.yml` runs `agents:check` on every pull request, and
`sync-agents.yml` regenerates and commits the docs on every push to `main` that
touches content. A push made with `GITHUB_TOKEN` does not trigger further
workflow runs, so the sync cannot loop.

---

## Design system

The glass look is defined once, in `src/app/globals.css`:

- `glass` — the base frosted panel (gradient fill, 20px backdrop blur, hairline border, inner highlight).
- `glass-nav` — heavier, darker variant used by the sticky header.
- `glass-sheen` — adds the light-catching 1px top edge to a card.
- `text-gradient` — the iris→aqua gradient used for the name and accents.

Palette and motion tokens (colours, radii, keyframes) live in the `@theme` block
of the same file, so they are available as regular Tailwind utilities
(`bg-iris-500`, `text-aqua-400`, `animate-drift`, …).

Motion respects `prefers-reduced-motion`: every animation and transition
collapses to near-zero duration when the visitor has asked for reduced motion.

---

## Deploying to GitHub Pages

The workflow at `.github/workflows/deploy.yml` builds and publishes the site on
every push to `main`. A second workflow, `.github/workflows/ci.yml`, runs lint,
typecheck and a build on pull requests and feature branches.

**One-time setup:** in the repository, go to **Settings → Pages** and set
**Source** to **GitHub Actions**.

### Base path

`next.config.ts` reads `NEXT_PUBLIC_BASE_PATH`. The workflow fills it from
`actions/configure-pages`, so the correct value is detected automatically:

| Deployment | URL | Base path |
| --- | --- | --- |
| Project site | `https://<user>.github.io/<repo>/` | `/<repo>` (auto) |
| User/org site | `https://<user>.github.io/` | `""` (auto) |
| Custom domain | `https://sinakafi.com` | `""` (auto) |

For a **custom domain**, add the domain in Settings → Pages (GitHub writes the
`CNAME` file for you) and create a DNS record pointing at GitHub Pages. To
reproduce the project-site build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/sk-portfolio npm run build
```

### Why `trailingSlash` and `.nojekyll`

- `trailingSlash: true` emits `about/index.html` instead of `about.html`, which
  Pages resolves without rewrite rules.
- `public/.nojekyll` stops any Jekyll pass from dropping Next's `_next/`
  directory.

---

## Project structure

```
.github/workflows/             # deploy.yml, ci.yml, sync-agents.yml
agents/                        # agent knowledge base (entry point: AGENTS.md)
scripts/sync-agents.mjs        # agent doc generator + link-graph checker
public/.nojekyll               # keeps _next/ from being ignored on Pages
src/
  app/
    layout.tsx                 # fonts, metadata, <noscript> reveal fallback
    page.tsx                   # section composition
    globals.css                # design tokens + glass utilities
    icon.svg                   # favicon
  components/
    Backdrop.tsx               # fixed aurora/grid/grain background
    SiteHeader.tsx             # sticky glass nav + scroll spy + mobile sheet
    Hero.tsx                   # name, tagline, CTAs, stat tiles
    About.tsx                  # profile summary + focus areas
    Experience.tsx             # timeline of roles
    Projects.tsx               # selected projects
    Skills.tsx                 # grouped skill chips
    Contact.tsx                # contact panel + footer
    Section.tsx                # shared section shell
    Reveal.tsx                 # IntersectionObserver scroll reveal
    Icon.tsx                   # inline SVG icon set
  lib/content.ts               # ← all site copy lives here
```

---

## Accessibility notes

- Semantic landmarks (`header`, `main`, `footer`), one `h1`, ordered lists for
  the experience timeline.
- Visible `:focus-visible` ring on every interactive element; the mobile menu is
  keyboard-dismissible with <kbd>Esc</kbd> and locks background scroll while open.
- Decorative layers (backdrop, blobs, icons) are `aria-hidden`.
- Scroll-revealed content is always present in the HTML, and a `<noscript>` rule
  reveals it when JavaScript is off.
