import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createPages } from "../src/templates.mjs";
import { anchor, escape, imageRenderer } from "../src/helpers.mjs";
import * as publications from "../src/publications.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const data = () => JSON.parse(read("content/lab.json"));
const pages = (lab) => createPages(JSON.parse(read("content/site.json")), lab, imageRenderer(path.join(root, "public")));
const entries = (html) => [...html.matchAll(/<li class="publication" id="([^"]+)"[^>]*>([\s\S]*?)<\/article><\/li>/g)];
const presentation = (records) => {
  assert.equal(typeof publications.publicationPresentation, "function", "An explicit shared presentation map is required");
  return publications.publicationPresentation(records);
};
const references = (html, context) => {
  assert.equal(typeof publications.publicationReferences, "function", "Inline groups need the shared presentation context");
  return publications.publicationReferences(html, context);
};
const expectedLabel = (record, records) => record.type === "journal"
  ? `J${records.filter((p) => p.type === "journal").length - records.filter((p) => p.type === "journal").findIndex((p) => p.id === record.id)}`
  : record.id;

test("listing removes redundant record rows and retains DOI-first titles and bibliography", () => {
  const lab = data(), html = pages(lab).find((p) => p.route === "/publication/").body;
  assert.doesNotMatch(html, /publication-links|DOI record|Publisher record|Preprint record/);
  for (const [, id, body] of entries(html)) {
    const record = lab.publications.find((p) => anchor(p.id) === id);
    assert.equal((body.match(/<a href=/g) || []).length, record.doi || record.links.length ? 1 : 0, id);
    if (record.doi) {
      assert.ok(body.includes(`doi:${escape(record.doi)}`), id);
      assert.ok(body.includes(`<h3><a href="https://doi.org/${escape(record.doi)}">${escape(record.title)}</a></h3>`));
    }
  }
});

test("primary link selector supports publisher fallback and plain titles in listing and citations", () => {
  assert.equal(typeof publications.publicationPrimaryLink, "function");
  const lab = data(), base = lab.publications[0];
  for (const [links, destination] of [[[{href: "https://example.test/publisher"}], "https://example.test/publisher"], [[], undefined]]) {
    const record = {...base, doi: undefined, links};
    assert.equal(publications.publicationPrimaryLink(record), destination);
    lab.publications[0] = record;
    const body = entries(pages(lab).find((p) => p.route === "/publication/").body)[0][2];
    assert.ok(body.includes(destination ? `<h3><a href="${destination}">${escape(base.title)}</a></h3>` : `<h3>${escape(base.title)}</h3>`));
    const citation = publications.publicationCitation(record.id, presentation(lab.publications));
    assert.equal(citation.includes(`<a href="${destination}">`), Boolean(destination));
  }
});

for (const variant of ["approved", "inserted", "reordered"]) test(`${variant} listing and all research references use same-paper labels and stable fragments`, () => {
  const lab = data();
  if (variant === "inserted") lab.publications.unshift({...structuredClone(lab.publications[0]), id: "J99", title: "In-memory insertion", legacyAnchors: []});
  if (variant === "reordered") [lab.publications[0], lab.publications[5]] = [lab.publications[5], lab.publications[0]];
  const rendered = pages(lab), listing = entries(rendered.find((p) => p.route === "/publication/").body);
  assert.deepEqual(listing.map((m) => m[1]), lab.publications.map((p) => anchor(p.id)), "Approved order remains unchanged");
  for (const [, id, body] of listing) {
    const record = lab.publications.find((p) => anchor(p.id) === id);
    assert.ok(body.includes(`<div class="publication-id">[${expectedLabel(record, lab.publications)}]</div>`), id);
    for (const alias of record.legacyAnchors || []) assert.ok(body.includes(`id="${alias}"`));
  }
  for (const page of rendered.filter((p) => p.route.startsWith("/research/"))) {
    const area = lab.research.areas.find((a) => page.route === `/research/${a.slug}/`);
    const projects = area ? lab.projects.filter((p) => area.projects.includes(p.id)) : lab.projects;
    for (const item of [...(area?.selected || []), ...projects.flatMap((p) => p.paragraphs)].filter((p) => p.kind === "citation")) {
      const record = lab.publications.find((p) => p.id === item.recordId), label = expectedLabel(record, lab.publications);
      assert.ok(page.body.includes(`<li><p>[${label}] `), `${page.route}: ${record.id}`);
      assert.ok(page.body.includes(`Publication record: <a href="/publication/#${anchor(record.id)}">[${label}]</a>`));
      const href = record.doi ? `https://doi.org/${record.doi}` : record.links[0]?.href;
      if (href) assert.ok(page.body.includes(`<a href="${escape(href)}">${escape(record.title)}</a>`));
    }
  }
});

test("mapping does not persistently mutate records or cache numbering across order changes", () => {
  const lab = data(), records = lab.publications, before = structuredClone(lab);
  const freeze = (object) => { for (const value of Object.values(object)) if (value && typeof value === "object") freeze(value); return Object.freeze(object); };
  freeze(lab);
  const first = presentation(records), second = presentation([...records].reverse());
  for (const record of records) {
    assert.notEqual(first.get(record.id), record);
    assert.equal(first.get(record.id).id, record.id);
    assert.equal(first.get(record.id).displayId, expectedLabel(record, records));
  }
  assert.equal(second.get(records[0].id).displayId, "J1");
  assert.equal(first.get(records[0].id).displayId, "J15");
  const rendered = pages(lab);
  assert.deepEqual(pages(lab), rendered);
  assert.deepEqual(lab, before);
  assert.deepEqual(presentation(records), first);
});

test("citations fail closed without explicit mapped presentation context", () => {
  const lab = data();
  assert.throws(() => publications.publicationCitation(lab.publications[0]), /presentation/i);
  assert.throws(() => publications.publicationCitation("J12", new Map(lab.publications.map((p) => [p.id, p]))), /presentation/i);
  assert.throws(() => publications.publicationCitation("J999", presentation(lab.publications)), /presentation/i);
});

test("inline renderer preserves existing links, attributes, punctuation, and unmatched source-only C5", () => {
  const context = presentation(data().publications);
  const html = '<strong>Scope:</strong> [J10,J12, C5]; <a href="https://example.test/[J10]">existing [J9]</a> and unbracketed J10.';
  assert.equal(references(html, context), '<strong>Scope:</strong> [<a href="/publication/#J10">J9</a>,<a href="/publication/#J12">J15</a>, C5]; <a href="https://example.test/[J10]">existing [J10]</a> and unbracketed J10.');
  assert.equal(references("Unrelated [2025], [Goal], J10 and [C5].", context), "Unrelated [2025], [Goal], J10 and [C5].");
  assert.equal(references("[J15*]", context), '[<a href="/publication/#J15">J14</a>]');
  assert.equal(references("[J17*, C4]", context), '[<a href="/publication/#J17-review">J17*</a>, <a href="/publication/#C4">C4</a>]');
});

test("unknown journal references fail closed in maintained HTML", () => {
  const lab = data();
  lab.research.overview.find((p) => p.items).items[0].html += " [J999]";
  assert.throws(() => pages(lab), /journal reference/i);
});

test("inline references use the shared context in project prose, notes, and direction selections", () => {
  const lab = data(), source = "In-memory prose [J10,J15*].";
  lab.projects[0].paragraphs.unshift({html: source});
  lab.projects[0].paragraphs.find((p) => p.kind === "citation").notes = [{html: source}];
  lab.research.areas[0].selected[0].notes = [{html: source}];
  const expected = 'In-memory prose [<a href="/publication/#J10">J9</a>,<a href="/publication/#J15">J14</a>].';
  for (const page of pages(lab).filter((p) => p.route === "/research/" || p.route === `/research/${lab.research.areas[0].slug}/`))
    assert.ok(page.body.includes(expected), page.route);
});

test("real textContent search finds the visible journal label rather than hidden legacy text", () => {
  const element = () => ({value: "", hidden: false, listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; }});
  const search = element(), year = element(), type = element(), form = element(), count = element(), empty = element(), reset = element();
  const lab = data();
  const records = entries(pages(lab).find((p) => p.route === "/publication/").body).map(([, id, body]) => ({id, hidden: false,
    dataset: {type: lab.publications.find((p) => anchor(p.id) === id).type, year: ""}, textContent: body.replace(/<[^>]*>/g, "")}));
  const groups = ["journal", "review", "working", "conference"].map((kind) => ({querySelectorAll: () => records.filter((p) => p.dataset.type === kind)}));
  const elements = new Map([["#publication-filters", form], ["#publication-search", search], ["#publication-year", year], ["#publication-type", type], ["#publication-count", count], ["#publication-empty", empty], ["#empty-reset", reset]]);
  vm.runInNewContext(read("public/assets/site.js"), {document: {querySelector: (s) => elements.get(s), querySelectorAll: (s) => s === ".publication" ? records : s === ".publication-group" ? groups : []}, setTimeout: (fn) => fn()});
  type.value = "journal";
  for (const [query, expected] of [["J15", "J12"], ["J12", "J13"], ["[J14]", "J15"]]) {
    search.value = query; form.listeners.input();
    assert.deepEqual(records.filter((p) => !p.hidden).map((p) => p.id), [expected]);
  }
  assert.ok(!records.find((p) => p.id === "J12").textContent.includes("J12"));
});

const declarations = (selector) => [...read("public/assets/site.css").replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter((m) => m[1].trim().split(/,\s*/).includes(selector)).map((m) => m[2]).join("\n");
test("publication and citation notes have body-size ink with a restrained maroon rule", () => {
  for (const selector of [".publication-notes", ".citation-notes"]) {
    const css = declarations(selector);
    assert.doesNotMatch(css, /color:\s*var\(--muted\)/, selector);
    assert.match(css, /color:\s*var\(--ink\)/, selector);
    assert.match(css, /font-size:\s*var\(--text-body\)/, selector);
    assert.match(css, /border-left:\s*0\.125rem solid var\(--maroon\)/, selector);
    assert.doesNotMatch(css, /background:|box-shadow|border-radius/);
  }
});

test("all note wording is preserved without repeated Highlights headings", () => {
  const lab = data(), rendered = pages(lab), listing = rendered.find((p) => p.route === "/publication/").body;
  for (const record of lab.publications) for (const note of record.notes) assert.ok(listing.includes(`<li>${escape(note)}</li>`));
  for (const project of lab.projects) for (const paragraph of project.paragraphs) for (const note of paragraph.notes || [])
    assert.ok(rendered.find((p) => p.route === "/research/").body.includes(`<li>${note.html}</li>`));
  assert.doesNotMatch(rendered.map((p) => p.body).join(""), />Highlights<\/h[1-6]>/);
});

test("project index has nonshrinking nowrap digits and a wrapping bounded title with unchanged anchors", () => {
  assert.match(declarations(".project-index a"), /min-width:\s*0/);
  assert.match(declarations(".project-index a"), /max-width:\s*100%/);
  assert.match(declarations(".project-index .project-number"), /flex:\s*0 0 auto/);
  assert.match(declarations(".project-index .project-number"), /white-space:\s*nowrap/);
  assert.match(declarations(".project-index .project-number"), /overflow-wrap:\s*normal/);
  assert.match(declarations(".project-index .project-title"), /min-width:\s*0/);
  assert.match(declarations(".project-index .project-title"), /white-space:\s*normal/);
  assert.match(declarations(".project-index .project-title"), /overflow-wrap:\s*anywhere/);
  const lab = data();
  lab.projects[0].title = "An intentionally long title ".repeat(20);
  const index = pages(lab).find((p) => p.route === "/research/").body.match(/<nav class="project-index"[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.deepEqual([...index.matchAll(/<a href="([^"]+)">/g)].map((m) => m[1]), lab.projects.map((p) => `#${p.id}`));
  assert.ok(index.includes(`<span class="project-number">01</span> <span class="project-title">${escape(lab.projects[0].title)}</span>`));
});

for (const variant of ["approved", "inserted", "reordered"]) test(`${variant} overview renders every inline group by stable identity`, () => {
  const lab = data();
  if (variant === "inserted") lab.publications.unshift({...structuredClone(lab.publications[0]), id: "J99", legacyAnchors: []});
  if (variant === "reordered") [lab.publications[0], lab.publications[5]] = [lab.publications[5], lab.publications[0]];
  const overview = pages(lab).find((p) => p.route === "/research/").body;
  for (const item of lab.research.overview.flatMap((p) => p.items || [])) {
    const expected = item.html.replace(/\[((?:[JC]\d+\*?)(?:\s*,\s*[JC]\d+\*?)*)\]/g, (group) => group.replace(/[JC]\d+\*?/g, (id) => {
      const record = lab.publications.find((p) => p.id === id || p.legacyAnchors?.includes(anchor(id)));
      return record ? `<a href="/publication/#${anchor(record.id)}">${expectedLabel(record, lab.publications)}</a>` : id;
    }));
    assert.ok(overview.includes(`<li>${expected}</li>`), `${variant}: ${item.text}`);
  }
  assert.doesNotMatch(overview, /href="[^"]*#C5"|>J15\*</);
});
