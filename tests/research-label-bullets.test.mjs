import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { researchContent } from "../src/research-content.mjs";
import { escape, imageRenderer } from "../src/helpers.mjs";
import { publicationPresentation } from "../src/publications.mjs";
import { createPages } from "../src/templates.mjs";
import { createResearchBrowsePages, resolveResearchIndex } from "../src/research-index.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const records = publicationPresentation([{id: "C91", type: "conference", status: "published", title: "Canonical title", authors: [{name: "A. Author"}], venue: "Canonical venue", year: "2030"}]);
const field = (label, value) => ({label, html: label + " " + value});
const goal = field("Goal:", "Exact goal"), methods = field("Methodologies:", "Exact methods");
const collaborator = {kind: "collaborators", html: "Exact collaboration"};
const bullet = (item) => item.kind === "collaborators"
  ? `<li class="project-collaborators"><strong>Collaborators:</strong> ${item.html}</li>`
  : `<li><strong>${escape(item.label)}</strong>${item.html.slice(item.label.length)}</li>`;
const list = (...items) => `<ul class="project-fields">${items.map(bullet).join("")}</ul>`;
const citation = {kind: "citation", recordId: "C91", notes: [{html: "Exact note"}]};
const overview = {kind: "list", html: "Tasks:", items: [{html: "Existing task"}]};
const freeze = (value) => {
  for (const child of Object.values(value)) if (child && typeof child === "object") freeze(child);
  return Object.freeze(value);
};

test("adjacent explicit metadata shares one real list in authored order", () => {
  const items = [goal, methods, field("PDE Equation:", "Equation"), field("Detail:", "Detail"), collaborator];
  assert.equal(researchContent(items, records), list(...items));
});
for (const [name, item] of [["solitary label", goal], ["collaborator only", collaborator]])
  test(`${name} flushes a complete field list at end`, () => {
    assert.equal(researchContent([item], records), list(item));
  });

test("unlabeled lookalikes and bold prose remain ordinary paragraphs", () => {
  const items = [{html: "Goal: prose"}, {html: "<strong>Methodologies:</strong> prose"}, {html: "This work is done with no metadata"}, {html: "PDE Equation: prose"}, {html: "Detail: prose"}];
  assert.equal(researchContent(items, records), items.map((item) => `<p>${item.html}</p>`).join(""));
});
for (const [name, separator] of [["ordinary paragraph", {html: "Unlabelled prose"}], ["citation and notes", citation], ["overview task list", overview]])
  test(`field list closes before ${name} and reopens after it`, () => {
    assert.equal(researchContent([goal, separator, methods], records), list(goal) + researchContent([separator], records) + list(methods));
  });

test("publication headings, citation lists and overview tasks stay outside interleaved metadata lists", () => {
  const publications = [citation, {kind: "publication-heading", html: "Other <em>papers</em>:"}, citation];
  const items = [goal, {html: "Prose"}, methods, ...publications, collaborator, overview, field("Detail:", "Last")];
  assert.equal(researchContent(items, records), list(goal) + "<p>Prose</p>" + list(methods) + researchContent(publications, records) + list(collaborator) + researchContent([overview], records) + list(items.at(-1)));
  assert.equal(researchContent([citation, goal], records), researchContent([citation], records) + list(goal));
  assert.equal(researchContent([], records), "");
});

test("labels escape while field text, links and references retain shared rendering", () => {
  const item = field('Goal <safe> & "quoted":', '<em>Text &amp; detail</em> [C91] <a href="https://example.test/">source</a>');
  assert.equal(researchContent([item], records), list(item).replace("[C91]", '[<a href="/publication/#C91">C91</a>]'));
});
for (const [name, item] of [
  ["mismatched prefix", {html: "Unlabeled", label: "Goal:"}],
  ["empty label", {html: "Text", label: ""}],
  ["blank label", {html: " Text", label: " "}],
  ["numeric label", {html: "1 Text", label: 1}],
  ["null label", {html: "Text", label: null}],
  ["non-string HTML", {html: null, label: "Goal:"}],
  ["collaborator label", {...collaborator, label: "Goal:"}],
  ["citation label", {...citation, label: "Goal:"}],
  ["overview label", {...overview, label: "Goal:"}],
  ["publication-heading label", {kind: "publication-heading", html: "Goal: heading", label: "Goal:"}],
  ["orphan heading", {kind: "publication-heading", html: "Other papers:"}],
  ["orphan notes", {...goal, notes: [{html: "Orphan"}]}],
  ["orphan items", {...goal, items: [{html: "Orphan"}]}],
]) test(`invalid field metadata fails closed: ${name}`, () => {
  assert.throws(() => researchContent([item], records), /Invalid research/);
});
for (const item of [field("Goal:", '<img src=x onerror="alert(1)">'), {kind: "collaborators", html: '<script>alert(1)</script>'}])
  test(`unsafe inline markup still fails closed in ${item.kind || "labeled field"}`, () => {
    assert.throws(() => researchContent([item], records), /Invalid inline markup/);
  });

test("frozen fields and references are rendered without mutation", () => {
  const items = freeze(structuredClone([goal, methods, collaborator, citation, overview]));
  const before = structuredClone({items, records: [...records]});
  assert.ok(researchContent(items, records).startsWith(list(goal, methods, collaborator)));
  assert.deepEqual({items, records: [...records]}, before);
});

test("Overview, directions, Topics and Problems render identical canonical metadata bullets", () => {
  const lab = freeze(JSON.parse(read("content/lab.json"))), index = freeze(JSON.parse(read("content/research-index.json")));
  const before = JSON.stringify({lab, index}), img = imageRenderer(path.join(root, "public"));
  const pages = [...createPages(JSON.parse(read("content/site.json")), lab, img), ...createResearchBrowsePages(resolveResearchIndex(index, lab), lab, img, new Map())];
  const blocks = (page) => [...page.body.matchAll(/<article class="project" id="([^"]+)">[\s\S]*?<\/article>/g)];
  const canonical = new Map(blocks(pages.find((page) => page.route === "/research/")).map((match) => [match[1], match[0]]));
  for (const page of pages) for (const match of blocks(page)) {
    assert.equal(match[0], canonical.get(match[1]), `${page.route}: ${match[1]}`);
    assert.equal((match[0].match(/<ul class="project-fields">/g) || []).length, 1, `${page.route}: grouped metadata`);
    assert.doesNotMatch(match[0], /<p class="project-collaborators">/);
  }
  assert.equal(JSON.stringify({lab, index}), before);
});

test("scoped CSS provides compact real discs and responsive hanging indentation", () => {
  const css = read("src/research-index.css");
  assert.match(css, /\.project-fields\s*\{[^}]*list-style:\s*disc\s+outside/);
  assert.match(css, /\.project-fields\s*\{[^}]*padding-inline-start:\s*1\.375rem/);
  assert.match(css, /\.project-fields\s*\{[^}]*margin:\s*0\s+0\s+0\.875rem/);
  assert.match(css, /\.project-fields > li\s*\{[^}]*margin:\s*0/);
  assert.match(css, /\.project-fields > li \+ li\s*\{[^}]*margin-block-start:\s*0\.375rem/);
});

const normalize = async (html) => {
  assert.ok(fs.existsSync(path.join(root, "tests/research-field-normalization.mjs")), "test-only wrapper normalization must exist");
  return (await import("./research-field-normalization.mjs")).normalizeResearchFieldLists(html);
};
const legacy = '<p><strong>Goal:</strong> Exact goal</p><p><strong>Methodologies:</strong> Exact methods</p><p class="project-collaborators"><strong>Collaborators:</strong> Exact collaboration</p>';

test("approved list normalization reverses only tagged wrappers, not their inline content", async () => {
  const suffix = researchContent([citation, overview], records);
  assert.equal(await normalize(list(goal, methods, collaborator) + suffix), legacy + suffix);
  assert.equal(await normalize(legacy), legacy);
  const item = field("Detail:", '<strong>Nested emphasis</strong> <em>text</em><br> &nbsp; <a href="/publication/#C91">C91</a>');
  assert.equal(await normalize(list(item)), `<p><strong>Detail:</strong>${item.html.slice(item.label.length)}</p>`);
});
for (const [name, change] of [
  ["prose", (html) => html.replace("Exact goal", "Changed goal")],
  ["label", (html) => html.replace("Goal:", "Aim:")],
  ["collaborator text", (html) => html.replace("Exact collaboration", "Changed collaboration")],
  ["order", () => list(methods, goal, collaborator)],
  ["extra field", (html) => html.replace("</ul>", bullet(goal) + "</ul>")],
  ["link", (html) => html.replace("Exact methods", '<a href="/publication/#C91">Exact methods</a>')],
  ["outside prose", (html) => html + "<p>Unapproved</p>"],
]) test(`normalization cannot hide changed ${name} from the historical hash`, async () => {
  assert.notEqual(hash(await normalize(change(list(goal, methods, collaborator)))), hash(legacy));
});
for (const html of [
  '<ul><li><strong>Goal:</strong> Exact goal</li></ul>',
  list(goal).replace("project-fields", "other-fields"),
  list(goal).replace('<ul ', '<ul hidden '),
  list(goal).replace('<li>', '<li hidden>'),
  '<ul class="project-fields"><li>Goal: Exact goal</li></ul>',
  '<ul class="project-fields"><li><strong>Goal:</strong><p>Exact goal</p></li></ul>',
  '<ul class="project-fields"><li><strong>Goal:</strong><ul><li>Nested</li></ul></li></ul>',
  '<ul class="project-fields"></ul>',
  list(collaborator).replace("Collaborators:", "Goal:"),
]) test(`normalization rejects unapproved wrappers: ${html}`, async () => {
  assert.equal(await normalize(html), html);
});
