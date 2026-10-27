"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/content";
import { lessonFinished } from "../../actions";
import { Go } from "../../Nav";
import { Prose } from "../../ui/Prose";
import { Question, type Result } from "../../ui/Question";

const saved = (id: string) => `edge:lesson:${id}`;

/**
 * A lesson, one step at a time: the pretest, then concept cards, worked examples, questions and
 * the recap. A pretest question answered right and sure is not asked again in the lesson.
 */
export function Player({
  lesson,
  reps,
  examHref,
}: {
  lesson: Lesson;
  reps: Record<string, number>;
  examHref?: string;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [counts, setCounts] = useState(reps);
  const [done, setDone] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const steps = [
    ...lesson.pretest.map((item) => ({ type: "pretest" as const, item })),
    ...lesson.steps,
  ];
  const step = steps[index];

  // Pick up where you left off (this device only).
  useEffect(() => {
    try {
      const at = Number(localStorage.getItem(saved(lesson.id)));
      if (at > 0 && at < steps.length) setIndex(at);
    } catch {}
  }, [lesson.id, steps.length]);

  const go = (next: number) => {
    setIndex(next);
    try {
      localStorage.setItem(saved(lesson.id), String(next));
    } catch {}
    window.scrollTo(0, 0);
  };
  const next = (skip = known) => {
    let n = index + 1;
    while (steps[n]?.type === "question" && skip.has((steps[n] as { item: string }).item)) n++;
    return n < steps.length ? go(n) : finish();
  };
  const [finishError, setFinishError] = useState(false);
  const finish = async () => {
    try {
      await lessonFinished(lesson.id);
    } catch {
      setFinishError(true);
      return;
    }
    try {
      localStorage.removeItem(saved(lesson.id));
    } catch {}
    setDone(true);
  };

  if (done) return <Done lesson={lesson} results={results} examHref={examHref} />;
  if (!step) return null;

  return (
    <main className="screen">
      <div className="flex items-center gap-3">
        <Go href="/" aria-label="Close lesson" className="muted -ml-1 p-1 text-2xl leading-none">
          ×
        </Go>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-[width]"
            style={{ width: `${(100 * index) / steps.length}%` }}
          />
        </div>
        <span className="muted font-mono text-xs tabular-nums">
          {index + 1}/{steps.length}
        </span>
      </div>

      {step.type === "concept" && (
        <article className="flex flex-1 flex-col gap-4">
          <p className="eyebrow">{lesson.title}</p>
          <h1 className="font-serif text-3xl leading-tight">{step.title}</h1>
          <Prose text={step.text} claims={step.claims} prefix={step.id} />
          <button type="button" className="btn btn-primary mt-auto" onClick={() => next()}>
            Continue
          </button>
        </article>
      )}

      {step.type === "pretest" &&
        (() => {
          const item = lesson.items.find((i) => i.id === step.item);
          const variant = item?.variants[0];
          if (!item || !variant) return null;
          return (
            <div className="flex flex-1 flex-col gap-4">
              <p className="eyebrow">Before you read · try it</p>
              <Question
                key={index}
                item={item}
                variant={variant}
                mode="pretest"
                reps={0}
                onDone={(result) => {
                  if (!(result.correct && result.sure)) return next();
                  const more = new Set(known).add(item.id);
                  setKnown(more);
                  next(more);
                }}
              />
            </div>
          );
        })()}

      {step.type === "example" && <Example key={index} step={step} onDone={() => next()} />}

      {step.type === "question" &&
        (() => {
          const item = lesson.items.find((i) => i.id === step.item);
          const variant = item?.variants.find((v) => v.id === step.variant) ?? item?.variants[0];
          if (!item || !variant) return null;
          return (
            <Question
              key={index}
              item={item}
              variant={variant}
              mode="lesson"
              reps={counts[item.id] ?? 0}
              conceptHref={`/lesson/${lesson.id}/read#${item.concept}`}
              onDone={(result) => {
                setResults((r) => [...r, result]);
                setCounts((c) => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }));
                next();
              }}
            />
          );
        })()}

      {step.type === "recap" && (
        <article className="flex flex-1 flex-col gap-4">
          <p className="eyebrow">Recap</p>
          <h1 className="font-serif text-3xl leading-tight">{lesson.title}</h1>
          <ul className="prose-text flex list-disc flex-col gap-2 pl-5">
            {step.points.map((point) => (
              <li key={point}>
                <Prose text={point} prefix={`r-${point.slice(0, 8)}`} className="" />
              </li>
            ))}
          </ul>
          {finishError && (
            <p role="alert" className="text-sm text-[var(--wrong)]">
              Couldn't save the lesson. Check your connection and try again.
            </p>
          )}
          <button type="button" className="btn btn-primary mt-auto" onClick={() => next()}>
            Finish lesson
          </button>
        </article>
      )}
    </main>
  );
}

type ExampleStep = Extract<Lesson["steps"][number], { type: "example" }>;

/** A worked example: the problem, then one step of the solution per tap. */
function Example({ step, onDone }: { step: ExampleStep; onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const all = shown >= step.steps.length;
  return (
    <article className="flex flex-1 flex-col gap-4">
      <p className="eyebrow">Worked example</p>
      <h1 className="font-serif text-3xl leading-tight">{step.title}</h1>
      <Prose text={step.problem} prefix={`${step.id}-p`} />
      <ol className="flex flex-col gap-3">
        {step.steps.slice(0, shown).map((s, i) => (
          <li key={s} className="card flex gap-3">
            <span className="muted font-mono text-sm leading-6">{i + 1}</span>
            <Prose text={s} prefix={`${step.id}-${i}`} className="font-mono text-sm leading-6" />
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="btn btn-primary mt-auto"
        onClick={() => (all ? onDone() : setShown(shown + 1))}
      >
        {all ? "Continue" : shown === 0 ? "Show the first step" : "Next step"}
      </button>
    </article>
  );
}

function Done({
  lesson,
  results,
  examHref,
}: {
  lesson: Lesson;
  results: Result[];
  examHref?: string;
}) {
  const right = results.filter((r) => r.correct).length;
  const confidentMisses = results.filter((r) => !r.correct && r.sure).length;
  const guessed = results.filter((r) => r.correct && !r.sure).length;
  return (
    <main className="screen justify-center">
      <p className="eyebrow">Lesson done</p>
      <h1 className="font-serif text-3xl leading-tight">{lesson.title}</h1>
      <p className="prose-text">{lesson.goal}</p>
      <dl className="card grid grid-cols-3 gap-2 text-center">
        <Stat label="right" value={`${right}/${results.length}`} />
        <Stat label="guessed" value={guessed} />
        <Stat label="sure but wrong" value={confidentMisses} />
      </dl>
      <p className="muted text-sm">
        Every question is now in your reviews. Missed ones come back in about 10 minutes, the others
        in a few days.
      </p>
      {examHref && (
        <Go href={examHref} className="btn btn-primary">
          Take the module exam
        </Go>
      )}
      <Go href="/session" className={`btn ${examHref ? "" : "btn-primary"}`}>
        Review now
      </Go>
      <Go href="/" className="btn">
        Back to Study
      </Go>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dd className="font-mono text-2xl tabular-nums">{value}</dd>
      <dt className="muted text-xs">{label}</dt>
    </div>
  );
}
