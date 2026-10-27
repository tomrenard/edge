import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { Prose } from "./Prose";

it("renders a term link inside bold as a term, not raw markdown", () => {
  const html = renderToStaticMarkup(<Prose text="Watch **[the job queue](g:microtask)** drain." />);
  expect(html).toContain("<strong><button");
  expect(html).not.toContain("](g:");
});

it("renders a source mark inside bold", () => {
  const claim = { id: "x", text: "t", sources: [], evidence: [] };
  const html = renderToStaticMarkup(<Prose text="**Big [[c:x]]**" claims={[claim]} />);
  expect(html).toContain('aria-label="Source"');
  expect(html).not.toContain("[[c:");
});

it("renders a fenced code block as one pre, keeping indentation and markdown marks", () => {
  const text = "Before:\n```js\nif (a) {\n  log(**x**);\n}\n```\nAfter `inline` code.";
  const html = renderToStaticMarkup(<Prose text={text} />);
  expect(html).toContain("<pre");
  expect(html).toContain("if (a) {\n  log(**x**);\n}");
  expect(html).toContain("<code>inline</code>");
});
