---
name: comment-discipline
description: "Trigger: comments, comentarios, comentar, code generation, writing code, review. Prevent redundant comments in this repo: comment only non-obvious why, never what."
license: Apache-2.0
metadata:
  author: "crisovando"
  version: "1.0"
---

# Skill: comment-discipline

## Activation Contract

Load when writing or editing code in this repo (`.ts`, `.tsx`, `.css`, `.mjs`), when generating new files, when reviewing diffs for comment hygiene, or when the user asks about "comentarios", "comentar", "explain the code".

## Hard Rules

1. Never add a comment that restates what the code does — the code already says that.
2. Comment only non-obvious WHY: decisions, runtime contracts, SSR/hydration ordering, edge-runtime constraints, cache/perf behavior, bug workarounds.
3. One line per comment. A paragraph means the code needs a better name or a DESIGN.md entry.
4. When editing a file, delete redundant comments in the lines you touch. Do not rewrite whole files unless asked.
5. Prefer expressive names over comments. A comment that explains "what" is a rename or extraction in disguise.
6. Never comment types or trivial values in TS/TSX — the typechecker documents them.
7. No dead-code comments, no TODO without a linked issue, no attribution/signature banners.

## Decision Gates

| Situation | Action |
| --- | --- |
| Comment explains WHAT | Delete it; rename or extract the code |
| Non-obvious WHY (SSR/hydration, edge runtime, cache, perf) | Add one concise line |
| Redundant comment in a touched hunk | Remove it |
| Long design rationale | Move to DESIGN.md / README.md, not code |
| Non-visible security/perf warning | One short line, reference a doc if needed |

## Execution Steps

1. Before writing any comment, classify it as WHAT or WHY. WHAT → do not write it.
2. Start from zero comments; write code with expressive names.
3. Add a comment only when a future reader cannot deduce the WHY from the code alone.
4. When editing existing files, scan the diff hunk and strip redundant comments there.
5. Never write "// main function" filler or section banners.

## Output Contract

Return the final diff plus one line: comments added (with the WHY) and comments removed (restating WHAT), or "no comments needed".

## References

- `../../DESIGN.md` — where design rationale belongs instead of code comments.
- `../../README.md` — project overview and conventions.
