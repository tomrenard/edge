# edge lesson writer brief

You write lessons for "edge", an app that keeps a senior software engineer sharp through short concept cards and hard multiple-choice questions, scheduled for spaced review on an iPhone. The learner is a senior engineer (JS/TS, React, some Go and Rails) preparing for senior, staff and principal interviews. Write for an expert: skip basics, aim at what a good senior could still get wrong. English, plain words, no em dashes.

Repo: /Users/tom.renard/personal/edge. Read fully first:
- data/README.md: the writing standard (lesson flow, pretest, code rules, item rules, sources). Follow it exactly.
- src/lib/content.ts: the JSON format (zod).
- data/curriculum.json: your module and its lesson ids, in order (use `jq`, the file is long).
- If data/lessons/ has reviewed lessons, open one as the example of quality, tone and length.

## Your files, and only these
- data/lessons/<lesson id>.json for each lesson of your module
- data/sources/<module id>.json, data/glossary/<module id>.json, data/facts/<module id>.json (create them, `{}` if empty)
Never edit curriculum.json, src/, scripts/ or another module's files. To reuse a source or term already defined elsewhere, `grep -r '"<id>"' data/` and copy the entry with identical content.

## Each lesson
- 5 to 8 minutes: `pretest` (2 or 3 item ids on the hardest ideas), then 3 to 5 concept cards of about 120 words plus at most one code block, each followed by 1 to 3 questions on that card, 6 to 9 scored questions in all, recap.
- Items: 2 to 4 variants each (new code or new scenario, same idea), 3 options (4 only for a real fourth misconception), one correct, a `why` for every option, Bloom tag, at least 40% apply/analyse/evaluate per module, `recallFirst: true` when the stem is answerable without the options.
- Pretest items are asked again in the lesson with another variant than the first (`"variant"` on the question step).
- `runs: true` on every variant that asks what a Node-runnable JS/TS snippet logs. content:check runs it: the correct option must be exactly what it logs. Run each snippet yourself with `node` while writing.
- Code lines at most 46 characters. Short snippets (about 15 lines max).
- Key claims marked [[c:id]] with sources and a quoted sentence copied word for word from the page.
- `requires`: the previous lesson in the module (first lesson: []). `lastReviewed`: today (`date +%F`). Version-dependent items: `versions` + `reviewBy` (one year later).

## Sources
Never cite from memory, and never list a source you couldn't read. Fetch each page (`curl -sL <url> | python3 -c 'import sys,html,re; t=re.sub(r"<[^>]+>"," ",sys.stdin.read()); print(html.unescape(re.sub(r"\s+"," ",t)))' | grep -o '.\{0,200\}<phrase>.\{0,200\}'`) and quote a supporting sentence word for word. Prefer: ECMAScript spec (tc39.es/ecma262), WHATWG HTML spec (html.spec.whatwg.org), MDN, Node docs (nodejs.org/en/learn, nodejs.org/api), web.dev, V8 blog, articles by spec or engine authors (e.g. jakearchibald.com). Copy the exact page title and URL.

## Done means
`pnpm content:check --module <module id>` passes. Don't commit.

Report under 250 words: lessons written with item and variant counts, Bloom split, sources used, anything technically uncertain (spec vs engine behaviour, Node vs browser), any format limits you hit.

## Budget (every tool call resends your whole context, so keep it small)
- Read data/README.md and src/lib/content.ts once. Look things up with `jq`/`grep`, don't `cat` big files.
- Fetch and quote sources in one batch script. Write each lesson in one go, run `pnpm content:check --module <id>` once per lesson, fix, move on. Aim for under 50 tool calls.
- Put scratch scripts in your own subfolder of the scratchpad (`<scratchpad>/<module-id>/`). Never send personal data to an outside service.
