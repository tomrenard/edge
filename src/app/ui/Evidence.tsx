import type { Lesson, Source } from "@/lib/content";
import { SOURCES } from "@/lib/refs-index";

type Claim = Extract<Lesson["steps"][number], { type: "concept" }>["claims"][number];

/** "MDN, 2025" */
export const cite = (source: Source) =>
  `${source.publisher}${source.year ? `, ${source.year}` : ""}`;

/** A source in a list: publisher, title, type, and a link to it. */
export function SourceLine({ id }: { id: string }) {
  const source = SOURCES[id];
  if (!source) return null;
  return (
    <li className="flex flex-col gap-0.5 text-sm">
      <span className="font-semibold">{cite(source)}</span>
      <span>{source.title}</span>
      <span className="muted">
        {source.type}
        {source.isbn ? ` · ISBN ${source.isbn}` : ""}
      </span>
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--brand)] underline"
        >
          Open
        </a>
      )}
    </li>
  );
}

/** The source mark after a claim: tap it for EvidencePopover (same id). */
export function EvidenceButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      popoverTarget={id}
      aria-label="Source"
      className="muted ml-0.5 align-super font-mono text-[0.7em] leading-none text-[var(--brand)]"
    >
      [src]
    </button>
  );
}

/** The claim, the quoted evidence and the sources. */
export function EvidencePopover({ claim, id }: { claim: Claim; id: string }) {
  return (
    <div popover="auto" id={id} className="font-sans text-base">
      <div className="flex flex-col gap-3">
        <strong>{claim.text}</strong>
        {claim.evidence.map((e) => (
          <figure key={e.quote} className="line border-l-2 pl-3">
            <q className="italic">{e.quote}</q>
            <figcaption className="muted text-xs">
              {SOURCES[e.source] ? cite(SOURCES[e.source] as Source) : e.source}
            </figcaption>
          </figure>
        ))}
        <ul className="flex flex-col gap-2">
          {claim.sources.map((s) => (
            <SourceLine key={s} id={s} />
          ))}
        </ul>
      </div>
    </div>
  );
}
