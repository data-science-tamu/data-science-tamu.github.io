import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import vm from "node:vm";
import { createPages } from "../src/templates.mjs";
import { imageRenderer, validatePublications } from "../src/helpers.mjs";
import { approved, assertApprovedPublications } from "./cv-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const data = () => read("content/lab.json");
const pages = (lab) => createPages(read("content/site.json"), lab, imageRenderer(path.join(root, "public")));

test("all 25 public CV records occur once in their approved categories", () => {
  const pubs = data().publications;
  assert.deepEqual(Object.fromEntries(["journal", "review", "working", "conference"].map(
    (type) => [type, pubs.filter((p) => p.type === type).length],
  )), { journal: 15, review: 4, working: 2, conference: 4 });
  assertApprovedPublications(pubs);
  for (const type of ["journal", "review", "working", "conference"])
    assert.deepEqual(pubs.filter((p) => p.type === type).map((p) => p.id),
      approved.filter((p) => p.type === type).map((p) => p.id), `${type}: public CV order`);
});

for (const expected of approved) test(`${expected.id} matches public authors, title, status and complete bibliography`, () => {
  assertApprovedPublications([data().publications.find((p) => p.id === expected.id)].filter(Boolean).concat(
    approved.filter((p) => p.id !== expected.id),
  ));
});

test("publication validation requires a real journal venue and supports working papers", () => {
  const valid = approved.map((p) => ({ ...structuredClone(p), metadata: "Test fixture", links: [], notes: [] }));
  assert.doesNotThrow(() => validatePublications(valid));
  for (const venue of [undefined, "", "   "]) {
    const p = { ...valid[0], venue };
    assert.throws(() => validatePublications([p]), /Invalid publication/);
  }
});

test("mutations of author order, DOI, Manufacturing Letters classification or any public record are rejected", () => {
  assertApprovedPublications(data().publications);
  for (const mutate of [
    (p) => { const j = p.find((r) => r.id === "J12"); [j.authors[1], j.authors[2]] = [j.authors[2], j.authors[1]]; },
    (p) => { p.find((r) => r.id === "J7").doi = "10.3390/bioengineering1007084"; },
    (p) => { p.find((r) => r.id === "J15").type = "review"; },
    (p) => { delete p.find((r) => r.id === "J11").venue; },
  ]) {
    const corrupted = structuredClone(data().publications);
    mutate(corrupted);
    assert.throws(() => assertApprovedPublications(corrupted), /approved/);
  }
  for (const p of approved)
    assert.throws(() => assertApprovedPublications(data().publications.filter((r) => r.id !== p.id)), /coverage/);
});

test("working papers, annotations, DOI links and every legacy publication fragment render without JS", () => {
  const lab = data();
  const html = pages(lab).find((p) => p.route === "/publication/").body;
  assert.match(html, /<option value="working">Working papers<\/option>/);
  assert.match(html, /id="working-papers"/);
  assert.match(html, /href="#working-papers"/);
  assert.match(html, /class="publication-filters"[^>]*hidden/);
  assert.match(html, /Advisees are underlined/);
  assert.match(html, /class="advisee"/);
  assert.match(html, /aria-label="corresponding author"/);
  for (const id of [...approved.map((p) => p.id.replace("*", "-review")), "J15-review"])
    assert.ok(html.includes(`id="${id}"`), id);
  for (const p of approved.filter((p) => p.doi))
    assert.ok(html.includes(`href="https://doi.org/${p.doi}"`), p.id);
  assert.equal((html.match(/class="publication"/g) || []).length, 25);
  assert.doesNotMatch(html, /Targeting|internalInfo|under review[^<]*Manufacturing Letters/i);
});

test("research selected and project citations resolve canonical publication metadata", () => {
  const lab = data();
  const journal = lab.publications.find((p) => p.id === "J11");
  journal.title = "A canonical title edited once";
  journal.venue = "A canonical journal edited once";
  const rendered = pages(lab);
  for (const route of ["/research/", "/research/ai-for-systems/"]) {
    const html = rendered.find((p) => p.route === route).body;
    assert.ok(html.includes(journal.title), route);
    assert.ok(html.includes(journal.venue), route);
  }
  for (const items of [lab.research.areas.flatMap((a) => a.selected), ...lab.projects.map((p) => p.paragraphs)])
    for (const item of items.filter((p) => p.kind === "citation")) {
      assert.equal(item.html, undefined, `${item.recordId}: no duplicate citation HTML`);
      assert.equal(item.text, undefined, `${item.recordId}: no duplicate citation text`);
    }
});

test("current CV artifact has a maintained manifest separate from immutable capture provenance", () => {
  const manifest = read("content/cv-current.json");
  assert.equal(manifest.path, "public/assets/documents/jaesung-lee-cv.pdf");
  const pdf = fs.readFileSync(path.join(root, manifest.path));
  assert.equal(pdf.length, manifest.bytes);
  assert.equal(createHash("sha256").update(pdf).digest("hex"), manifest.sha256);
  assert.ok(typeof manifest.description === "string" && manifest.description.trim());
});

test("real publication handlers filter working/undated records, find the restored journal and reset; print restores all groups", () => {
  const element = () => ({ value: "", hidden: false, listeners: {},
    addEventListener(name, handler) { this.listeners[name] = handler; }, focus() { this.focused = true; } });
  const search = element(), year = element(), type = element(), form = element(), count = element(), empty = element(), reset = element();
  const entries = data().publications.map((p) => ({
    id: p.id, dataset: {type: p.type, year: p.year || "undated"}, hidden: false,
    textContent: `${p.title} ${p.authors.map((a) => a.name).join(" ")} ${p.venue || ""} ${p.doi || ""}`,
  }));
  const groups = ["journal", "review", "working", "conference"].map((kind) => ({ hidden: false,
    querySelectorAll: () => entries.filter((p) => p.dataset.type === kind),
  }));
  form.reset = () => { search.value = year.value = type.value = ""; form.listeners.reset(); };
  const elements = new Map([["#publication-filters", form], ["#publication-search", search], ["#publication-year", year],
    ["#publication-type", type], ["#publication-count", count], ["#publication-empty", empty], ["#empty-reset", reset]]);
  vm.runInNewContext(fs.readFileSync(path.join(root, "public/assets/site.js"), "utf8"), {
    document: {querySelector: (selector) => elements.get(selector),
      querySelectorAll: (selector) => selector === ".publication" ? entries : selector === ".publication-group" ? groups : []},
    setTimeout: (handler) => handler(),
  });
  const visible = () => entries.filter((p) => !p.hidden).map((p) => p.id);
  assert.equal(form.hidden, false);
  type.value = "working"; year.value = "undated"; form.listeners.change();
  assert.deepEqual(visible(), ["W1", "W2"]);
  assert.equal(count.textContent, "2 of 25 publications");
  assert.deepEqual(groups.map((g) => g.hidden), [true, true, false, true]);
  form.reset(); search.value = "IISE Transactions"; form.listeners.input();
  assert.deepEqual(visible(), ["J11", "J4"]);
  search.value = "no such record"; form.listeners.input(); assert.equal(empty.hidden, false);
  reset.listeners.click(); assert.equal(visible().length, 25); assert.equal(search.focused, true);
  const print = fs.readFileSync(path.join(root, "public/assets/site.css"), "utf8").split("@media print")[1];
  assert.match(print, /\.publication\[hidden\]\s*\{[^}]*display:\s*grid\s*!important/);
  assert.match(print, /\.publication-group\[hidden\]\s*\{[^}]*display:\s*block\s*!important/);
});
