---
name: agents-readme
description: Entry point and index for the agent knowledge base. Explains the recursive structure and the sync contract.
type: agent-doc
generated: false
related: ["business", "skill", "architecture", "design", "content", "meta-index"]
---

# Agent knowledge base

This directory is the machine-readable description of the project. It exists so
an agent can answer questions about the portfolio, the person behind it and the
codebase **without re-deriving anything from source**.

The root entry point for the whole repository is [`AGENTS.md`](../AGENTS.md).

## Index

| Document | Contains | Origin |
| --- | --- | --- |
| [business.md](./business.md) | Positioning, experience timeline, accomplishments, projects, contact | generated |
| [skill.md](./skill.md) | Skill groups, stack per role, technology → usage index | generated |
| [architecture.md](./architecture.md) | Repo map, rendering model, conventions, deploy pipeline | manual |
| [design.md](./design.md) | Glass design system: tokens, utilities, rules | manual |
| [content.md](./content.md) | Raw resume copy — the upstream human source | manual |
| [meta/index.md](./meta/index.md) | Manifest: every document's content hash and origin | generated |

## Recursive structure

These documents are a **graph, not a pile**. Two invariants hold, and both are
enforced by `npm run agents:check`:

1. **Every link resolves.** Any markdown link pointing at a local `.md` file
   inside this directory must resolve to a file that exists.
2. **Every document is reachable.** Starting from [`AGENTS.md`](../AGENTS.md)
   and following links, every document in `agents/` must be visited. A document
   nothing links to is an *orphan* and fails the check.

So when you add a document, link it from here **and** back-link it to this file.
Navigation is bidirectional by design: you can always get back to
[the index](./README.md).

## Relationship between the documents

```
AGENTS.md                        root entry point (repo-wide rules)
  └─ agents/README.md            this file — the hub
       ├─ business.md ──────────► content.md      (derives the human copy)
       │      ▲   │
       │      │   └────────────► skill.md        (same source, technical view)
       │      │                       │
       │      └───────────────────────┘           cross-linked siblings
       ├─ architecture.md ──────► design.md
       └─ meta/index.md          hashes every node above
```

- [business.md](./business.md) and [skill.md](./skill.md) are **siblings from the
  same source**. Read both before answering anything about experience.
- [content.md](./content.md) is upstream: the original prose. The generated docs
  restructure it, they do not replace it.
- [meta/index.md](./meta/index.md) is the manifest — it records a content hash
  per document so drift is visible and machine-detectable.

## Sync contract

`src/lib/content.ts` is the single source of truth for site copy.
`node scripts/sync-agents.mjs` regenerates the derived documents from it.

Rules that keep this stable:

- **No timestamps.** Freshness is a content hash of the source file, so the sync
  only rewrites a document when the content feeding it actually changed.
- **Never hand-edit a generated document.** It carries an HTML banner and is
  overwritten on the next sync. Edit `src/lib/content.ts` instead.
- **Drift fails CI.** `npm run agents:check` exits non-zero if a generated
  document is stale or the link graph is broken.

See [meta/index.md](./meta/index.md) for the current hashes and graph status.
