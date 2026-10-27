import { z } from "zod";

/*
 * The course content format (see data/README.md). Tracks and modules in data/curriculum.json,
 * lessons in data/lessons/<id>.json, sources, glossary and shared facts per module. `pnpm content:check` validates all of it.
 *
 * App code imports only the types (import type), so zod never reaches the phone.
 */

const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "lowercase, digits and dashes");

/** One source: a spec, official docs, an RFC, a book or a talk. */
export const Source = z.object({
  title: z.string(),
  /** Who publishes it: "MDN", "ECMAScript spec", "React docs", "WHATWG HTML", a book's author. */
  publisher: z.string(),
  type: z.enum(["spec", "docs", "rfc", "book", "article", "talk", "paper"]),
  /** Required unless it is a book with an ISBN. */
  url: z.string().url().optional(),
  isbn: z.string().optional(),
  year: z.number().int().min(1990).optional(),
});
export type Source = z.infer<typeof Source>;

/** A claim worth marking: shown as a source mark where the concept text says [[c:<id>]]. */
const Claim = z.object({
  id,
  text: z.string(),
  sources: z.array(z.string()).min(1),
  /** The sentence from the source that supports the claim. */
  evidence: z.array(z.object({ source: z.string(), quote: z.string().min(20) })).min(1),
});

const Option = z.object({
  /** Stable: options are shuffled on screen, logs keep this id. */
  id: z.string().regex(/^[a-d]$/),
  text: z.string(),
  correct: z.literal(true).optional(),
  /** Why this option is right, or the misconception that makes it wrong. */
  why: z.string(),
});

/** One wording of a question. Its options are the same idea each time, worded or numbered anew. */
const Variant = z.object({
  id,
  stem: z.string(),
  options: z.array(Option).min(3).max(4),
  /** Worked solution, shown on the feedback screen. */
  solution: z.string().optional(),
  /**
   * The stem's code block is run by content:check (node, JS or TS) and what it logs must match
   * the correct option. For every "what does this log" question that runs outside a browser.
   */
  runs: z.literal(true).optional(),
});

/**
 * A question: the unit that is reviewed (FSRS state hangs on its id). Never reuse an id for a
 * question that now asks something else: give it a new id (content:check catches changes).
 */
export const Item = z.object({
  id,
  /** The concept card it tests: a missed review links back to it. */
  concept: id,
  bloom: z.enum(["remember", "understand", "apply", "analyse", "evaluate"]),
  /** Options hidden until tapped: recall first, then recognise. For items with a short answer. */
  recallFirst: z.boolean().optional(),
  sources: z.array(z.string()).min(1),
  variants: z.array(Variant).min(1).max(4),
  /** Framework versions the question depends on, e.g. { "react": "19.2" }: needs `reviewBy`. */
  versions: z.record(z.string(), z.string()).optional(),
  /** Check the question again by this date (frameworks change). */
  reviewBy: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});
export type Item = z.infer<typeof Item>;

const Step = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("concept"),
    id,
    title: z.string(),
    /**
     * ~120 words plus a code block. Small markdown with ```code``` and `code`; [[c:<claim>]]
     * places a source mark, [term](g:<glossary id>) a term.
     */
    text: z.string().max(2400),
    claims: z.array(Claim),
  }),
  /** A worked example: shown before the first calculation of its kind, steps one by one. */
  z.object({
    type: z.literal("example"),
    id,
    title: z.string(),
    problem: z.string(),
    steps: z.array(z.string()).min(2),
  }),
  /** A question from `items`, asked after the concept it tests. */
  z.object({ type: z.literal("question"), item: id, variant: id.optional() }),
  z.object({ type: z.literal("recap"), points: z.array(z.string()).min(2).max(6) }),
]);
export type Step = z.infer<typeof Step>;

export const Lesson = z.object({
  id,
  module: id,
  title: z.string(),
  /** What you can explain after the lesson, one sentence. */
  goal: z.string(),
  /**
   * Items asked before the first concept card (unscored unless right and sure: then the first
   * review comes later). Trying first helps the reading stick.
   */
  pretest: z.array(id).max(3),
  /** Lessons to know first (a soft warning when jumping ahead). */
  requires: z.array(id),
  /** Last full review of the content. */
  lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  steps: z.array(Step).min(3),
  items: z.array(Item).min(1),
});
export type Lesson = z.infer<typeof Lesson>;

export const Curriculum = z.array(
  z.object({
    id,
    title: z.string(),
    modules: z.array(
      z.object({
        id,
        title: z.string(),
        icon: z.string(),
        lessons: z.array(id).describe("lesson ids in order; may name lessons not written yet"),
      }),
    ),
  }),
);
export type Curriculum = z.infer<typeof Curriculum>;

export const Glossary = z.record(
  id,
  z.object({ term: z.string(), short: z.string().max(240), lesson: id.optional() }),
);
export type Glossary = z.infer<typeof Glossary>;

/** Numbers several lessons use, so they stay the same everywhere. */
export const Facts = z.record(
  id,
  z.object({ label: z.string(), value: z.string(), sources: z.array(z.string()).min(1) }),
);

export const Sources = z.record(id, Source);
