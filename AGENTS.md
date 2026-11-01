# AGENTS.md

Entry point for AI agents working in this repository.

**Project:** a statically exported, single-page glassmorphism portfolio for
**Sina Kafi**, Senior Front-End Developer.
**Stack:** Next.js 16 (App Router, `output: "export"`) · React 19 · TypeScript ·
Tailwind CSS v4.

## Knowledge base

Read the document that matches the task. They form a recursive graph — every
link resolves, every document is reachable from here.

| Task | Read |
| --- | --- |
| Anything about the person, experience, positioning, contact | [`agents/business.md`](./agents/business.md) |
| Anything about technologies, stacks, "has he used X?" | [`agents/skill.md`](./agents/skill.md) |
| Changing code, structure, build, CI/CD | [`agents/architecture.md`](./agents/architecture.md) |
| Styling, layout, colour, motion, accessibility | [`agents/design.md`](./agents/design.md) |
| The original human-written resume prose | [`agents/content.md`](./agents/content.md) |
| Hashes and link-graph status of all of the above | [`agents/meta/index.md`](./agents/meta/index.md) |
| Index and conventions for the knowledge base itself | [`agents/README.md`](./agents/README.md) |

## Hard rules

1. **Copy lives in `src/lib/content.ts`.** Components render it; never hardcode
   a sentence in a component. That file is the single source of truth for both
   the site and the derived agent docs.
2. **Never hand-edit a generated agent doc.** `agents/business.md`,
   `agents/skill.md` and `agents/meta/index.md` are produced by
   `scripts/sync-agents.mjs` and carry a generated-file banner. Edit
   `src/lib/content.ts`, then run `npm run agents:sync`.
3. **Content changes require a sync.** Any edit to `src/lib/content.ts` must be
   followed by `npm run agents:sync`. CI runs `npm run agents:check` and fails on
   drift.
4. **Keep the doc graph closed.** A new document in `agents/` must be linked from
   [`agents/README.md`](./agents/README.md) and link back. Orphans fail CI.
5. **Never hide content behind JavaScript.** Anything that starts hidden must be
   visible by default and revealed by progressive enhancement, with a
   `prefers-reduced-motion` path that disables motion *including delays*.
6. **No new dependencies without a reason.** This repo deliberately ships with
   no icon package, no animation library and no component library.

## Commands

```bash
npm run dev           # dev server              → http://localhost:3000
npm run build         # static export           → ./out
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run agents:sync   # regenerate agents/ from src/lib/content.ts
npm run agents:check  # fail if agent docs are stale or the link graph breaks
```

Before finishing any change, run at minimum `npm run lint`, `npm run typecheck`
and `npm run build`. If `src/lib/content.ts` changed, add `npm run agents:sync`.

## Layout

```
AGENTS.md                    ← you are here
agents/                      agent knowledge base (see agents/README.md)
  README.md                  index, recursion rules, sync contract
  business.md                generated — positioning, experience, projects
  skill.md                   generated — skills, stacks, technology index
  architecture.md            repo map, conventions, CI/CD
  design.md                  glass design system rules
  content.md                 upstream resume copy
  meta/index.md              generated manifest — hashes + graph status
.github/workflows/           deploy.yml, ci.yml, sync-agents.yml
scripts/sync-agents.mjs      doc generator + link-graph checker
src/app/                     layout, page, globals.css, icon.svg
src/components/              one file per section + shared primitives
src/lib/content.ts           ← ALL site copy, single source of truth
```
