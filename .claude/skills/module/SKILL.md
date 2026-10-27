---
name: module
description: Writes and strictly reviews new edge course modules (lessons, sources, glossary, facts) with parallel subagents, then checks and pushes. USE WHEN the user asks to write the next modules, "/module <ids>", or to continue the curriculum. Run in ~/personal/edge.
---

# Writing modules

One writer subagent per module, then one strict reviewer per module, in parallel (each module has its own files under `data/`). The standard is `data/README.md`.

1. **Plan.** Put the module's lesson ids in `data/curriculum.json` (in order). Pick a scope per lesson in one line each, and what it builds on, so writers don't repeat other modules.
2. **Write.** Per module, a background subagent (at most 4 at once) with this prompt: "Read and follow `.claude/skills/module/writer-brief.md`. Your module: <id> (<title>), lessons in order: <id: one-line scope> …"
3. **Review.** When a writer reports, start a reviewer subagent (at most 4 at once): "Read and follow `.claude/skills/module/reviewer-brief.md`. Your module: <id> (lessons …). Writer's notes to check: <their uncertain points>." Send back anything left unresolved that matters.
4. **Check.** `pnpm content:check --accept` (only for wording fixes the reviewers reported), `pnpm lint`, `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm build`.
5. **Push.** Code changes in the same step get a fresh-eyes review and a ponytail review first. Then commit on `main` and push (Vercel deploys).
