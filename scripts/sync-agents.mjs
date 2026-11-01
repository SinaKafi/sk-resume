#!/usr/bin/env node
/**
 * Generates the agent knowledge base under `agents/` from the site's single
 * source of truth, `src/lib/content.ts`.
 *
 * Why generate instead of hand-writing: the portfolio and the agent docs must
 * never disagree. Deriving them means a content change propagates on the next
 * sync, and `--check` turns drift into a failing CI job.
 *
 * Two determinism rules keep the sync from churning:
 *   1. No timestamps anywhere. Freshness is a content hash of the source file,
 *      so a file is rewritten only when the content that feeds it changed.
 *   2. Files are written only when their bytes differ.
 *
 * Usage:
 *   node scripts/sync-agents.mjs           # write generated docs
 *   node scripts/sync-agents.mjs --check   # exit 1 if any doc is stale
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const AGENTS_DIR = path.join(ROOT, "agents");
const CONTENT_TS = path.join(ROOT, "src/lib/content.ts");
const ENTRYPOINT = path.join(ROOT, "AGENTS.md");
const MANIFEST = path.join("meta", "index.md");
const CHECK = process.argv.includes("--check");

const BANNER = "<!-- GENERATED FILE — run `npm run agents:sync` to update. -->";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const shortHash = (text) => createHash("sha256").update(text).digest("hex").slice(0, 12);

const list = (items) => items.map((item) => `- ${item}`).join("\n");

/**
 * Escapes a value for use inside a markdown table cell. Company names in the
 * content contain literal pipes ("Novin Arzesh | Arzesh Wallet"), which would
 * otherwise be read as column separators and corrupt the whole table.
 */
const cell = (value) =>
  String(value).replace(/\|/g, "\\|").replace(/\r?\n+/g, " ").trim();

/** Builds a markdown table. */
function table(headers, rows) {
  const head = `| ${headers.map(cell).join(" | ")} |`;
  const rule = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(cell).join(" | ")} |`).join("\n");
  return [head, rule, body].join("\n");
}

function frontmatter({ name, description, generated, sourceHash, related }) {
  const lines = [
    "---",
    `name: ${name}`,
    `description: ${description}`,
    "type: agent-doc",
    `generated: ${generated ? "true" : "false"}`,
  ];
  if (sourceHash) lines.push(`source-hash: ${sourceHash}`);
  lines.push(`related: [${related.map((rel) => `"${rel}"`).join(", ")}]`);
  lines.push("---");
  return lines.join("\n");
}

/** Relative markdown link from one doc to another, always repo-root-relative. */
const rel = (fromDir, toPath) => {
  const relPath = path.relative(fromDir, toPath).split(path.sep).join("/");
  return relPath.startsWith(".") ? relPath : `./${relPath}`;
};

/* ------------------------------------------------------------------ */
/* load the source of truth                                            */
/* ------------------------------------------------------------------ */

async function loadContent() {
  const source = await readFile(CONTENT_TS, "utf8");

  // Transpile in-process rather than adding a TS runner dependency. The module
  // is pure data with only erasable syntax, so type stripping is lossless.
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: "content.ts",
  });

  const encoded = Buffer.from(outputText, "utf8").toString("base64");
  const mod = await import(`data:text/javascript;base64,${encoded}`);

  return { source, hash: shortHash(source), data: mod };
}

/* ------------------------------------------------------------------ */
/* generated documents                                                 */
/* ------------------------------------------------------------------ */

function buildBusiness({ hash, data }) {
  const { profile, links, experience, projects, additional, stats, telHref, mailHref } = data;

  const timeline = table(
    ["Company", "Role", "Period", "Location"],
    experience.map((role) => [
      `**${role.company}**`,
      role.role,
      role.period,
      role.location,
    ]),
  );

  const accomplishments = experience
    .map((role) => {
      const bullets = role.highlights
        .map((highlight) => `- **${highlight.title}** — ${highlight.body}`)
        .join("\n");
      return `### ${role.company} · ${role.role} (${role.period})\n\n${bullets}`;
    })
    .join("\n\n");

  const projectRows = projects.map((project) => [
    `**${project.name}**`,
    project.description,
    project.href ? `[link](${project.href})` : "internal / no public URL",
  ]);

  const figures = table(
    ["Metric", "Value"],
    stats.map((stat) => [stat.label, stat.value]),
  );

  return `${frontmatter({
    name: "business",
    description:
      "Business-facing facts: positioning, target roles, experience timeline, accomplishments and projects.",
    generated: true,
    sourceHash: hash,
    related: ["skill", "content", "architecture"],
  })}

${BANNER}

# Business

Everything an agent needs to *talk about* Sina Kafi accurately. Technical
detail lives in [skill.md](./skill.md); the raw resume prose lives in
[content.md](./content.md).

## Positioning

- **Name:** ${profile.name}
- **Current title:** ${profile.role}
- **Tagline:** ${profile.tagline}
- **Based in:** ${profile.location}
- **Availability:** ${profile.availability}; open to senior front-end roles
- **One-liner:** ${profile.intro}

## Headline figures

${figures}

## Contact channels

${list([
    `Email — [${profile.email}](${mailHref})`,
    `Phone — [${profile.phone}](${telHref})`,
    `Website — [sinakafi.com](${links.website})`,
    `LinkedIn — [profile](${links.linkedin})`,
    `GitHub — [SinaKafi](${links.github})`,
  ])}

## Professional summary

${profile.summary.map((paragraph) => `${paragraph}\n`).join("\n")}
## Experience timeline

${timeline}

## Accomplishments by role

${accomplishments}

## Selected projects

${table(["Project", "What it is", "Link"], projectRows)}

## Languages

${list(additional.languages.map((language) => `**${language.name}** — ${language.level}`))}

## How to talk about this work

- Lead with **architecture and ownership**, not framework trivia: monorepos,
  design systems, multi-application ecosystems, build-infrastructure migration.
- The strongest quantified claims: **8+ years**, **50+ design-system
  components**, **six back-office applications**, **59-icon** typed icon library.
- Fintech, commerce, logistics and government are all real domains — use them
  for context, but do not invent metrics that are not listed above.
- Do not state a notice period, salary expectation or visa status: not recorded
  anywhere in the source content.
`;
}

function buildSkill({ hash, data }) {
  const { skillGroups, experience, projects } = data;

  const groups = skillGroups
    .map((group) => `### ${group.label}\n\n${list(group.items)}`)
    .join("\n\n");

  const byRole = table(
    ["Company", "Period", "Stack"],
    experience.map((role) => [
      `**${role.company}**`,
      role.period,
      role.stack.join(", "),
    ]),
  );

  // Aggregate every technology and record where it was used, so an agent can
  // answer "have you used X?" without reading seven job entries.
  const usage = new Map();
  for (const role of experience) {
    for (const item of role.stack) {
      if (!usage.has(item)) usage.set(item, new Set());
      usage.get(item).add(role.company);
    }
  }
  for (const project of projects) {
    for (const item of project.stack) {
      if (!usage.has(item)) usage.set(item, new Set());
      usage.get(item).add(project.name);
    }
  }

  const index = table(
    ["Technology", "Seen in"],
    [...usage.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([tech, where]) => [tech, [...where].join(", ")]),
  );

  const declared = new Set(skillGroups.flatMap((group) => group.items));
  const undeclared = [...usage.keys()]
    .filter((tech) => !declared.has(tech))
    .sort((a, b) => a.localeCompare(b));

  return `${frontmatter({
    name: "skill",
    description:
      "Technical skill inventory: declared skill groups, stack per role, and a technology → usage index.",
    generated: true,
    sourceHash: hash,
    related: ["business", "architecture", "design"],
  })}

${BANNER}

# Skill

The technical counterpart to [business.md](./business.md). Everything here is
derived from \`src/lib/content.ts\`.

## Skill groups

Declared proficiency areas, as listed on the site.

${groups}

## Stack by role

${byRole}

## Technology index

Every technology named anywhere in the content, and where it appears. Use this
to answer "has Sina used X?" — absence from this table means the technology is
not claimed anywhere.

${index}

${
  undeclared.length
    ? `## Named in experience but not in a skill group

These appear in role stacks or project stacks but are not listed under a
declared skill group — they describe tooling used on a project, not a headline
skill:

${list(undeclared)}
`
    : ""
}
## Boundaries

- **Do not invent depth.** A technology in the index is a claim that it was
  used on that project, not that it is a current specialism.
- **React, Next.js and TypeScript** are the core; the rest is contextual.
- Preferred framing is *front-end architecture* — the skill groups above are
  evidence, not a keyword list to recite.
`;
}

/* ------------------------------------------------------------------ */
/* recursive link graph                                                */
/* ------------------------------------------------------------------ */

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;

function linksIn(markdown) {
  const found = [];
  for (const match of markdown.matchAll(LINK_RE)) {
    const target = match[1].trim();
    // Only local markdown targets form the doc graph; ignore URLs and anchors.
    if (/^(https?:|mailto:|tel:|#|data:)/.test(target)) continue;
    if (!target.endsWith(".md")) continue;
    found.push(target.split("#")[0]);
  }
  return found;
}

/**
 * Verifies the docs form a closed, reachable graph:
 *   - every relative link resolves to a file on disk
 *   - every doc is reachable from AGENTS.md by following links
 * This is what makes the doc set *recursive* rather than a flat pile.
 *
 * Always reads the on-disk state, so it must run *after* the generated docs
 * have been written.
 */
async function checkLinkGraph() {
  const files = [ENTRYPOINT, ...(await walk(AGENTS_DIR))];
  const known = new Set(files.map((file) => path.resolve(file)));

  const edges = new Map();
  const broken = [];

  for (const file of files) {
    const markdown = await readFile(file, "utf8");
    const resolved = [];

    for (const target of linksIn(markdown)) {
      const absolute = path.resolve(path.dirname(file), target);
      if (!known.has(absolute)) {
        broken.push(`${path.relative(ROOT, file)} -> ${target}`);
        continue;
      }
      resolved.push(absolute);
    }

    edges.set(path.resolve(file), resolved);
  }

  const seen = new Set([path.resolve(ENTRYPOINT)]);
  const queue = [path.resolve(ENTRYPOINT)];
  while (queue.length) {
    const current = queue.shift();
    for (const next of edges.get(current) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }

  const orphans = files
    .map((file) => path.resolve(file))
    .filter((file) => !seen.has(file))
    .map((file) => path.relative(ROOT, file));

  return { broken, orphans };
}

/* ------------------------------------------------------------------ */
/* manifest                                                            */
/* ------------------------------------------------------------------ */

/**
 * Builds the manifest: every document in the knowledge base, its content hash
 * and its origin.
 *
 * Deliberately does *not* embed the link-graph result. The graph depends on the
 * manifest's own outgoing links, so embedding it would make the file's content
 * depend on itself — the sync would never converge. The graph is verified
 * against the final on-disk state instead, and reported by the run that checks
 * it. The File column links to every document, which is what keeps the manifest
 * a full node in the graph rather than a leaf.
 */
async function buildManifest({ hash, files }) {
  const dir = path.join(AGENTS_DIR, "meta");

  const rows = [];
  for (const file of files) {
    if (path.resolve(file) === path.resolve(AGENTS_DIR, MANIFEST)) continue;
    const key = path.relative(AGENTS_DIR, file).split(path.sep).join("/");
    const body = await readFile(file, "utf8");
    rows.push([
      `[\`${key}\`](${rel(dir, file)})`,
      `\`${shortHash(body)}\``,
      body.includes(BANNER) ? "generated" : "manual",
    ]);
  }

  return `${frontmatter({
    name: "meta-index",
    description:
      "Manifest of the agent knowledge base: every document with its content hash and origin.",
    generated: true,
    sourceHash: hash,
    related: ["../README", "../business", "../skill"],
  })}

${BANNER}

# Agent docs manifest

Source of truth: \`src/lib/content.ts\` at \`${hash}\`. This file is excluded from
its own table — it cannot hash itself. A change to any listed hash means that
document drifted from what the generator produces.

## Documents

${table(["File", "Content hash", "Origin"], rows)}

## Invariants

The graph is verified on every sync and in CI by \`npm run agents:check\`:

- every markdown link to a local \`.md\` file under \`agents/\` resolves;
- every document is reachable from the root
  [\`AGENTS.md\`](../../AGENTS.md) by following links.

An orphan — a document nothing links to — fails the check. That is what keeps
the set navigable as it grows. Exempt: [content.md](../content.md), the upstream
resume copy, which is linked from [business.md](../business.md) and
[skill.md](../skill.md).
`;
}

/* ------------------------------------------------------------------ */
/* write                                                               */
/* ------------------------------------------------------------------ */

async function writeIfChanged(relativePath, contents) {
  const absolute = path.join(AGENTS_DIR, relativePath);
  const next = contents.endsWith("\n") ? contents : `${contents}\n`;

  let current = null;
  try {
    current = await readFile(absolute, "utf8");
  } catch {
    // New file.
  }

  if (current === next) return { path: relativePath, status: "unchanged" };
  if (CHECK) return { path: relativePath, status: "stale" };

  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, next, "utf8");
  return { path: relativePath, status: current === null ? "created" : "updated" };
}

async function main() {
  const { source, hash, data } = await loadContent();

  if (!source.includes("export const profile")) {
    throw new Error(`${CONTENT_TS} does not look like the portfolio content module`);
  }

  const results = [];
  results.push(await writeIfChanged("business.md", buildBusiness({ hash, data })));
  results.push(await writeIfChanged("skill.md", buildSkill({ hash, data })));

  // The manifest hashes every other document, so it is written last.
  const files = (await walk(AGENTS_DIR)).sort();
  results.push(await writeIfChanged(MANIFEST, await buildManifest({ hash, files })));

  // Checked against the final on-disk state, never against stale content.
  const graph = await checkLinkGraph();

  const changed = results.filter((result) => result.status !== "unchanged");
  const graphBroken = graph.broken.length > 0 || graph.orphans.length > 0;

  if (CHECK) {
    // Report every problem in one pass. Bailing out on the first one hides the
    // real cause: an orphan or a broken link also shifts the manifest hashes,
    // so "stale" would otherwise mask it.
    if (changed.length) {
      console.error(
        `\n✗ Agent docs are stale: ${changed.map((r) => r.path).join(", ")}`,
      );
      console.error("  Run `npm run agents:sync` and commit the result.");
    }
    if (graphBroken) {
      console.error("\n✗ Agent doc link graph is broken:");
      for (const link of graph.broken) console.error(`    broken link: ${link}`);
      for (const file of graph.orphans) console.error(`    orphan doc:  ${file}`);
    }
    if (changed.length || graphBroken) {
      console.error("");
      process.exit(1);
    }
    console.log(`✓ Agent docs up to date (source ${hash}); link graph OK.`);
    return;
  }

  for (const result of results) {
    const marker =
      result.status === "unchanged" ? "=" : result.status === "created" ? "+" : "~";
    console.log(`  ${marker} agents/${result.path} (${result.status})`);
  }

  if (graph.broken.length || graph.orphans.length) {
    console.error("\n✗ Agent doc link graph is broken:");
    for (const link of graph.broken) console.error(`    broken link: ${link}`);
    for (const file of graph.orphans) console.error(`    orphan doc:  ${file}`);
    process.exit(1);
  }

  console.log(`\n✓ Agent docs synced from src/lib/content.ts (${hash}).`);
}

await main();
