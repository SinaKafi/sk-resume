---
name: meta-index
description: Manifest of the agent knowledge base: every document with its content hash and origin.
type: agent-doc
generated: true
source-hash: 854304508bc8
related: ["../README", "../business", "../skill"]
---

<!-- GENERATED FILE — run `npm run agents:sync` to update. -->

# Agent docs manifest

Source of truth: `src/lib/content.ts` at `854304508bc8`. This file is excluded from
its own table — it cannot hash itself. A change to any listed hash means that
document drifted from what the generator produces.

## Documents

| File | Content hash | Origin |
| --- | --- | --- |
| [`README.md`](../README.md) | `1ea2bd270a72` | manual |
| [`architecture.md`](../architecture.md) | `379668d80176` | manual |
| [`business.md`](../business.md) | `26717ae2e99c` | generated |
| [`content.md`](../content.md) | `3c449bc45a58` | manual |
| [`design.md`](../design.md) | `e796a59cce34` | manual |
| [`skill.md`](../skill.md) | `3de628f30b26` | generated |

## Invariants

The graph is verified on every sync and in CI by `npm run agents:check`:

- every markdown link to a local `.md` file under `agents/` resolves;
- every document is reachable from the root
  [`AGENTS.md`](../../AGENTS.md) by following links.

An orphan — a document nothing links to — fails the check. That is what keeps
the set navigable as it grows. Exempt: [content.md](../content.md), the upstream
resume copy, which is linked from [business.md](../business.md) and
[skill.md](../skill.md).
