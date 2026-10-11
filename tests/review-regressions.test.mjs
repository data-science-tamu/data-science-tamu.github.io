import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { rich, validatePublications, imageRenderer } from "../src/helpers.mjs";
import { createPages } from "../src/templates.mjs";
import {
  assertPublicationBaseline,
  assertNewsBaseline,
} from "./source-baseline.mjs";
const root = path.resolve(import.meta.dirname, "..");
const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(root, "content", name), "utf8"));
test("rich text rejects complete and incomplete executable markup", () => {
  for (const html of [
    '<img src=x onerror="alert(1)" ',
    'text <script src="https://example.invalid/x.js"',
    '<strong>ok</strong><img src=x onerror="alert(1)" ',
    '<a href="javascript:alert(1)">bad</a>',
    '<img src=x onerror="alert(1)">',
    "<>",
  ])
    assert.throws(() => rich(html), /Invalid inline/);
  assert.equal(
    rich(
      'Research &lt; 5 <strong>safe</strong> <a href="/research/">Research</a>',
    ),
    'Research &lt; 5 <strong>safe</strong> <a href="/research/">Research</a>',
  );
});
test("publication validation rejects unknown categories and duplicate IDs", () => {
  const baseline = read("lab.json").publications;
  assert.doesNotThrow(() => validatePublications(baseline));
  for (const bad of [
    [{ ...baseline[0], type: "journals" }, ...baseline.slice(1)],
    [...baseline, baseline[0]],
    [{ ...baseline[0], id: "" }],
    [],
  ])
    assert.throws(() => validatePublications(bad), /Invalid publication/);
});
test("maintained publications and news may grow without weakening source coverage", () => {
  const data = read("lab.json"),
    site = read("site.json");
  // Synthetic regression fixtures are rendered in memory only, never in dist.
  const publication = {
    ...data.publications[0],
    id: "J17",
    title: "Synthetic regression publication",
    metadata: "Regression fixture only.",
    year: "2030",
    citation: "",
    links: [],
    notes: [],
  };
  const news = {
    date: "2030.01.01",
    text: "Synthetic regression news",
    html: "Synthetic regression news",
    images: [],
  };
  data.publications.unshift(publication);
  data.news.unshift(news);
  assertPublicationBaseline(data.publications);
  assertNewsBaseline(data.news);
  assert.doesNotThrow(() => validatePublications(data.publications));
  const pages = createPages(
    site,
    data,
    imageRenderer(path.join(root, "public")),
  );
  const pubs = pages.find((p) => p.route === "/publication/").body;
  assert.equal(
    (pubs.match(/class="publication"/g) || []).length,
    data.publications.length,
  );
  assert.ok(pubs.includes(publication.title));
  assert.ok(pages.find((p) => p.route === "/news/").body.includes(news.text));
  assert.throws(() =>
    assertPublicationBaseline(data.publications.filter((p) => p.id !== "J9")),
  );
  assert.throws(() => assertNewsBaseline(data.news.slice(0, -1)));
});
test("the corrected J9 research citation keeps its source-confirmed year", () => {
  const data = read("lab.json");
  const citation = data.projects
    .find((p) => p.id === "bone-elastic-properties")
    .paragraphs.find((p) => p.text.startsWith("[J9]"));
  assert.match(citation.text, /Accepted, 2025, 10\.1002\/advs\.202508445/);
  assert.match(citation.html.replace(/<[^>]*>/g, ""), /Accepted, 2025,/);
  assert.match(
    citation.html,
    /href="http:\/\/doi\.org\/10\.1002\/advs\.202508445"/,
  );
});
