# edge

Stay sharp as a senior engineer: hard multiple-choice questions on spaced repetition, with short
lessons. JS/TS, browser, React, system design, DSA, AI engineering, Go, Rails and staff-level
skills. Invite-only accounts, installable on your phone as a web app.

- **Lessons:** a pretest (try first), then dense concept cards and questions, 5 to 8 minutes.
- **Questions are the flashcards:** scheduled with FSRS
  ([ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs)). Think of the answer, show the
  options, say how sure you are: wrong = Again, right but unsure = Hard, right and sure = Good.
  Sure-but-wrong answers come back first. Each review shows another variant.
- **Checked content:** every claim cites a spec or official docs with a quote, and
  `pnpm content:check` runs every "what does this log" snippet against its answer.

Plan: [docs/plan.md](docs/plan.md). Content standard: [data/README.md](data/README.md).

## Develop

```sh
pnpm install
pnpm content:check      # validate data/, run snippets, write src/lib/content-index.ts
pnpm test
pnpm dev
```

Stack: Next 16, Postgres (Neon) with drizzle, Better Auth (email + password, `ALLOWED_EMAILS`),
Tailwind 4, biome, vitest with PGlite. Engine copied from
[vo2](https://github.com/tomrenard/vo2).
