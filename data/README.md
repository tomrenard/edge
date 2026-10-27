# edge content

Everything the app teaches lives here and is checked by `pnpm content:check` (format, item rules,
sources, ids, code that runs).

- `curriculum.json`: tracks → modules → lesson ids, in order. A module may list lessons not written yet.
- `lessons/<id>.json`: one lesson (format: `src/lib/content.ts`).
- `sources/<module>.json`: sources by id (`<publisher>-<topic>`, e.g. `mdn-queuemicrotask`, `html-event-loops`).
- `glossary/<module>.json`: terms, linked from text as `[microtask](g:microtask)`.
- `facts/<module>.json`: numbers used in more than one lesson (latency numbers, limits).
- `items.lock.json`: content hash per question, written by `pnpm content:check --accept`.

One file per module, so modules can be written at the same time. An id may appear in several
files only with the same content (`grep -r '"mdn-promise"' data/` before adding).
Check one module while others are being written: `pnpm content:check --module <id>`.

## The learner

A senior engineer (JS/TS, React, some Go and Rails) who wants to stay sharp and pass senior,
staff and principal interviews. Do not teach basics they already know: write for an expert
(expertise reversal). Every lesson must contain something a good senior could get wrong.

## Writing a lesson

A lesson is 5 to 8 minutes: pretest → concept → 1 to 3 questions → concept → … → recap.

- **Pretest** (`pretest`): 2 or 3 item ids asked before any reading, on the lesson's hardest
  ideas. Trying first helps the reading stick, even when the answer is wrong. Right and sure
  skips that question in the lesson; otherwise the lesson asks it again in another variant
  (its question step names a variant other than the first).
- **Concept cards:** one idea, about 120 words plus at most one code block. Dense: the rule, why it
  is so, the trap. Mark the claims that matter with `[[c:<claim id>]]` and list them in `claims`
  with sources and the quoted sentence that supports them.
- **Worked example** (`example`): a trace of code, step by step, for the first trace of a kind.
- **Recap:** 2 to 6 points, the ones to remember in an interview.
- Glossary links (`[term](g:id)`) are optional: only for terms a senior might not know exactly.

## Code

- Fenced blocks: ```` ```js ````, ```` ```ts ````, ```` ```tsx ````, ```` ```go ````, ```` ```rb ````, ```` ```sql ````.
- **Lines of 46 characters at most**, so code fits an iPhone without scrolling sideways
  (content:check fails longer lines). 2-space indent. At most about 15 lines.
- Use `console.log` in snippets, short names (`a`, `p`, `log`), no comments that give the answer away.
- **`runs: true`** on every variant whose stem asks what a JS/TS snippet logs and that runs in
  Node: content:check runs the stem's code block and the correct option must be exactly what it
  logs (words compared, ignoring backticks and commas), and no wrong option may match.
  Write options as the logged values in order: `` `4 1 2 3` ``.
- Browser-only code (DOM, `requestAnimationFrame`) can't run: check it against the spec by hand.

## Writing questions (items)

Each item tests one idea and has 2 to 4 variants (same idea, new code or new scenario), so a
review never shows the wording you remember. Rules:

- 3 options (4 only when the fourth is a real misconception), exactly one `correct`. Every wrong
  option is a real misconception a senior could hold, and its `why` says which and why it fails.
  The right option's `why` says why it is right. `why` texts: 1 to 3 sentences.
- Hard because of a real distinction, never because of wording tricks, hidden typos or trivia.
- No "all of the above", "none of the above", "both A and B"; no negative stems ("which is
  NOT…"); options of similar length and grammar, so the right one doesn't stand out.
- `recallFirst: true` on every item whose stem can be answered before seeing the options (most).
- Formats, best first: predict the output, find the line with the bug, compare A and B, scenario
  then pick the design, root cause of a symptom, ordering, pick the pattern.
- Bloom level on every item; per module at least 40% `apply`, `analyse` or `evaluate`.
- Questions that depend on a framework or runtime version: `versions` (e.g. `{"react": "19.2"}`)
  and `reviewBy` (one year after `lastReviewed`). Aim for 80% stable concepts.
- Never change what an existing item id asks. A typo fix keeps the id; a new meaning gets a new id.

## Sources

Prefer, in order: specs (ECMAScript, WHATWG HTML, RFCs), official docs (MDN, React, Next.js,
TanStack, Node, Go, Rails, PostgreSQL), books (DDIA), articles by the people who build the thing
(web.dev, V8 blog, engineering blogs). Never cite from memory, and never list a source you
couldn't read: open the page, copy its exact title and URL, and quote the supporting sentence
word for word.
