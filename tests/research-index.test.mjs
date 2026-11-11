import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { normalizeResearchFieldLists } from "./research-field-normalization.mjs";
import { validateFigureOriginals } from "../src/figure-originals.mjs";
import * as publications from "../src/publications.mjs";
import { createPages, layout } from "../src/templates.mjs";
import { escape, anchor, imageRenderer } from "../src/helpers.mjs";
import { publicationAuthors, publicationMetadata, publicationPresentation } from "../src/publications.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const baseline = JSON.parse(read("tests/fixtures/research-menu-preservation.json"));
const lab = JSON.parse(read("content/lab.json"));
const site = JSON.parse(read("content/site.json"));
const originalPages = createPages(site, lab, imageRenderer(path.join(root, "public")));
const publicationMap = publicationPresentation(lab.publications);
const img = imageRenderer(path.join(root, "public"));
const originals = validateFigureOriginals(JSON.parse(read("content/figure-originals.json")), path.join(root, "public"), [...lab.research.figures.map((f) => f.src), ...lab.projects.map((p) => p.image)]);
const config = () => {
  assert.ok(fs.existsSync(path.join(root, "content/research-index.json")), "approved research browse config must exist");
  return JSON.parse(read("content/research-index.json"));
};
async function implementation() {
  assert.ok(fs.existsSync(path.join(root, "src/research-index.mjs")), "research browse resolver/renderer must exist");
  return import("../src/research-index.mjs");
}
const links = (html) => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => [m[1], m[2]]);
const section = (body, title) => {
  const heading = body.indexOf('<h2>' + title + '</h2>');
  if (heading === -1) return undefined;
  const start = heading + ('<h2>' + title + '</h2>').length;
  let depth = 1;
  for (const match of body.slice(start).matchAll(/<\/?section\b[^>]*>/g)) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (!depth) return body.slice(start, start + match.index);
  }
  assert.fail('Unclosed section: ' + title);
};
const projectBlocks = (body) => [...body.matchAll(/<article class="project" id="([^"]+)">[\s\S]*?<\/article>/g)];
const projectBlock = (body, id) => projectBlocks(body).find((match) => match[1] === id)?.[0];
const freeze = (value) => {
  for (const child of Object.values(value)) if (child && typeof child === "object") freeze(child);
  return Object.freeze(value);
};

// Locked before implementation, including every existing content file and public asset.
test("existing maintained data and every public file stay byte-identical", () => {
  for (const [file, digest] of Object.entries(baseline.files))
    assert.equal(hash(fs.readFileSync(path.join(root, file))), digest, file);
});
test("all existing page bodies including the home hero remain exactly unchanged", () => {
  assert.deepEqual(Object.fromEntries(originalPages.map((page) => [page.route, hash(normalizeResearchFieldLists(page.body))])), baseline.bodies);
});
test("maintained browse config preserves approved Topics/Problems exactly with only Methods removed", () => {
  const { asOf, ...mapping } = config();
  assert.equal(asOf, "2026-11", "explicit local-preview month, separate from approved mappings");
  assert.equal(hash(JSON.stringify(mapping, null, 2) + "\n"), baseline.activeMapSha256);
});
test("resolver yields exactly 5 topics and 7 problems without mutating input", async () => {
  const { resolveResearchIndex } = await implementation();
  const data = config(), before = JSON.stringify({ data, lab });
  const groups = resolveResearchIndex(data, lab);
  assert.deepEqual(groups.map((g) => [g.id, g.label, g.items.length]), [["topics", "Topics", 5], ["problems", "Problems", 7]]);
  const routes = groups.flatMap((group) => group.items.map((item) => item.route));
  assert.equal(routes.length, 12);
  assert.equal(new Set(routes).size, 12);
  for (const [i, group] of groups.entries())
    for (const [j, item] of group.items.entries()) {
      const approved = data.groups[i].items[j];
      assert.equal(item.route, '/research/browse/' + group.id + '/' + approved.slug + '/');
      assert.equal(item.label, approved.label);
      assert.equal(item.summary, approved.summary);
      assert.deepEqual(item.projects.map((p) => p.id), approved.projects);
      assert.deepEqual(item.publications.map((p) => p.id), approved.publications);
      assert.deepEqual(item.funding.map((p) => p.title), approved.funding);
    }
  assert.equal(JSON.stringify({ data, lab }), before);
});

const invalidCases = [
  ["missing snapshot", (c) => { delete c.asOf; }],
  ["invalid snapshot month", (c) => { c.asOf = "2026-13"; }],
  ["malformed snapshot", (c) => { c.asOf = "2026-1"; }],
  ["non-string snapshot", (c) => { c.asOf = 202611; }],
  ["snapshot must be month only", (c) => { c.asOf = "2026-11-01"; }],
  ["missing groups", (c) => { delete c.groups; }],
  ["unknown root field", (c) => { c.routes = []; }],
  ["Methods cannot replace Problems", (c) => { c.groups[1].id = "methods"; }],
  ["Methods cannot be appended", (c) => { c.groups.push({ ...structuredClone(c.groups[0]), id: "methods", label: "Methods" }); }],
  ["unknown group", (c) => { c.groups[0].id = "unknown"; }],
  ["unknown group field", (c) => { c.groups[0].href = "/elsewhere/"; }],
  ["missing group", (c) => { c.groups.pop(); }],
  ["duplicate group", (c) => { c.groups[1] = structuredClone(c.groups[0]); }],
  ["empty group", (c) => { c.groups[0].items = []; }],
  ["malformed group items", (c) => { c.groups[0].items = {}; }],
  ["duplicate route", (c) => { c.groups[0].items.push(structuredClone(c.groups[0].items[0])); }],
  ["path traversal slug", (c) => { c.groups[0].items[0].slug = "../escape"; }],
  ["malformed slug", (c) => { c.groups[0].items[0].slug = "Has spaces"; }],
  ["blank label", (c) => { c.groups[0].items[0].label = " "; }],
  ["missing summary", (c) => { delete c.groups[0].items[0].summary; }],
  ["unknown item field", (c) => { c.groups[0].items[0].papers = []; }],
  ["missing reference list", (c) => { delete c.groups[0].items[0].funding; }],
  ["non-array references", (c) => { c.groups[0].items[0].publications = "J12"; }],
  ["empty destination", (c) => { Object.assign(c.groups[0].items[0], { projects: [], publications: [], funding: [] }); }],
  ["malformed project reference", (c) => { c.groups[0].items[0].projects = [{ id: "preventive-maintenance" }]; }],
  ["unknown project reference", (c) => { c.groups[0].items[0].projects = ["missing-project"]; }],
  ["malformed publication reference", (c) => { c.groups[0].items[0].publications = ["J012"]; }],
  ["unresolved publication reference", (c) => { c.groups[0].items[0].publications = ["J999"]; }],
  ["unresolved legacy alias", (c) => { c.groups[0].items[0].publications = ["J16"]; }],
  ["unresolved funding reference", (c) => { c.groups[0].items[0].funding = ["Cannery 4.0"]; }],
  ["malformed funding reference", (c) => { c.groups[0].items[0].funding = [null]; }],
  ["funding cannot be a publication", (c) => { c.groups[0].items[0].publications = ["Cannery 4.0 Phase 2"]; }],
];
for (const type of ["projects", "publications", "funding"])
  invalidCases.push(['duplicate ' + type + ' references', (c) => { const refs = c.groups[0].items[0][type]; refs.push(refs[0]); }]);
for (const [label, mutate] of invalidCases)
  test('invalid browse config fails closed: ' + label, async () => {
    const { resolveResearchIndex } = await implementation();
    const data = config();
    mutate(data);
    assert.throws(() => resolveResearchIndex(data, lab), /Invalid research index/);
  });
for (const [label, mutate] of [
  ["ambiguous projects", (l) => { l.projects.push(structuredClone(l.projects[0])); }],
  ["ambiguous publications", (l) => { l.publications.push(structuredClone(l.publications[0])); }],
  ["ambiguous funding title", (l) => { l.faculty.funding.items.push(structuredClone(l.faculty.funding.items[0])); }],
  ["missing funding records", (l) => { delete l.faculty.funding; }],
  ["missing funding sponsor", (l) => { delete l.faculty.funding.items[0].sponsor; }],
  ["missing funding role", (l) => { delete l.faculty.funding.items[0].role; }],
  ["malformed funding period", (l) => { l.faculty.funding.items[0].period = "13/2026-08/2030"; }],
  ["reversed funding period", (l) => { l.faculty.funding.items[0].period = "09/2031\u201308/2030"; }],
  ["invalid publication status", (l) => { l.publications.find((p) => p.id === "J16*").status = "published"; }],
])
  test('canonical ambiguity or missing metadata fails closed: ' + label, async () => {
    const { resolveResearchIndex } = await implementation();
    const data = structuredClone(lab);
    mutate(data);
    assert.throws(() => resolveResearchIndex(config(), data), /Invalid research index/);
  });

test("every approved destination renders only its exact typed records with truthful canonical metadata", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const groups = resolveResearchIndex(config(), lab);
  const pages = createResearchBrowsePages(groups, lab, img, originals);
  assert.equal(pages.length, 12);
  for (const item of groups.flatMap((g) => g.items)) {
    const page = pages.find((p) => p.route === item.route);
    assert.ok(page, item.route);
    assert.equal(page.title, item.label);
    assert.equal(page.description, item.summary);
    assert.match(page.body, /<nav class="breadcrumb" aria-label="Breadcrumb"><a href="\/research\/">Research<\/a>/);
    assert.ok(page.body.includes('<h1>' + escape(item.label) + '</h1>'));
    assert.equal((page.body.match(/<h1\b/g) || []).length, 1);
    assert.ok(page.body.includes(escape(item.summary)));
    assert.match(page.body, /projects are research activities/i);
    assert.match(page.body, /publications are outputs/i);
    assert.match(page.body, /funding supports (?:research )?programs/i);
    assert.match(page.body, /shared topic does not establish grant-to-paper attribution/i);
    assert.doesNotMatch(page.body, /(?:grant-funded publications|publications funded by|resulting publications|(?:has completed|we built|delivered) (?:a )?digital twin|certification is complete|verified mapping|storage ID|schema)/i);
    let level = 0;
    for (const [, next] of page.body.matchAll(/<h([1-6])\b/g)) {
      assert.ok(Number(next) <= level + 1, item.route + ': heading outline');
      level = Number(next);
    }
    const projects = section(page.body, "Research Projects");
    const publications = section(page.body, "Publications");
    const funding = section(page.body, "Funded Research");
    assert.equal(Boolean(projects), item.projects.length > 0);
    assert.equal(Boolean(publications), item.publications.length > 0);
    assert.equal(Boolean(funding), item.funding.length > 0);
    assert.deepEqual(projectBlocks(projects || "").map((match) => match[1]), item.projects.map((p) => p.id));
    for (const p of item.projects) {
      assert.ok(projects.includes(escape(p.title)));
      const overview = createPages(site, lab, img, originals).find((p) => p.route === "/research/");
      assert.equal(projectBlock(projects, p.id), projectBlock(overview.body, p.id), item.route + ": full canonical project");
    }
    assert.deepEqual(links(publications || "").map(([href]) => href), item.publications.map((p) => '/publication/#' + anchor(p.id)));
    for (const p of item.publications) {
      const record = publicationMap.get(p.id);
      assert.ok(publications.includes('[' + escape(record.displayId) + ']'));
      assert.ok(publications.includes(escape(record.title)));
      assert.ok(publications.includes(publicationAuthors(record)));
      assert.ok(publications.includes(escape(publicationMetadata(record))));
      for (const note of record.notes) assert.ok(publications.includes(escape(note)));
      assert.ok(!funding?.includes(escape(record.title)), 'paper must not become a funding entry');
    }
    assert.deepEqual(links(funding || "").map(([href]) => href), item.funding.map(() => "/cv/"));
    for (const award of item.funding) {
      for (const field of ["title", "sponsor", "role", "period"])
        assert.ok(funding.includes(escape(award[field])), award.title + ': ' + field);
      assert.ok(!publications?.includes(escape(award.title)), 'funding must not become a paper');
    }
    assert.doesNotMatch(funding || "", /\b(?:active|completed|outcomes|deliverables)\b/i);
  }
});
test("review, accepted, working and conference status use shared presentation, never journal storage numbering", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const pages = createResearchBrowsePages(resolveResearchIndex(config(), lab), lab, img, originals);
  const maintenance = pages.find((p) => p.route === "/research/browse/problems/maintenance-planning/").body;
  const pomdp = [...section(maintenance, "Publications").matchAll(/<li><h3>[\s\S]*?<\/li>/g)]
    .map((match) => match[0]).find((entry) => entry.includes("POMDP"));
  assert.ok(pomdp);
  assert.match(pomdp, /Under review/);
  assert.doesNotMatch(pomdp, /Published online|Accepted/);
  const all = pages.map((p) => p.body).join("\n");
  assert.match(all, /Major revision at Technometrics/);
  assert.match(all, /Working paper/);
  const accepted = structuredClone(lab);
  accepted.publications[0].status = "accepted";
  const acceptedBody = createResearchBrowsePages(resolveResearchIndex(config(), accepted), accepted, img, originals)[0].body;
  assert.match(acceptedBody, /Accepted/);
  assert.match(all, /ASME 2022/);
  const smart = pages.find((p) => p.route === "/research/browse/topics/smart-manufacturing/").body;
  assert.ok(smart.includes('[' + publicationMap.get("J12").displayId + ']'));
  assert.notEqual(publicationMap.get("J12").displayId, "J12");
});
test("digital-twin foundational work and future implant award retain explicit limits", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const pages = createResearchBrowsePages(resolveResearchIndex(config(), lab), lab, img, originals);
  const digital = pages.find((p) => p.route === "/research/browse/topics/digital-twins/").body;
  assert.match(digital, /related foundational work, not a claim of a completed digital twin/);
  for (const page of pages.filter((p) => p.body.includes(escape(lab.faculty.funding.items[1].title)))) {
    assert.match(section(page.body, "Funded Research"), /Starts June 2027[^<]*scheduled start/i);
    assert.ok(section(page.body, "Funded Research").includes(escape("06/2027\u201305/2030")));
  }
  const virtual = pages.find((p) => p.route === "/research/browse/problems/virtual-testing-qualification/").body;
  assert.equal(section(virtual, "Research Projects"), undefined);
  assert.equal(section(virtual, "Publications"), undefined);
  assert.ok(section(virtual, "Funded Research"));
});
test("canonical labels, summaries, goals, citations and funding are escaped rather than executable markup", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const data = config(), variant = structuredClone(lab);
  const payload = '<img src=x onerror="alert(1)"> & test';
  data.groups[0].label = payload;
  data.groups[0].items[0].label = payload;
  data.groups[0].items[0].summary = payload;
  variant.projects[0].title = payload;
  variant.projects[0].paragraphs[0].text = "Goal: " + payload;
  variant.projects[0].paragraphs[0].html = "Goal: " + escape(payload);
  variant.publications[0].title = payload;
  variant.publications[0].authors[0].name = payload;
  variant.faculty.funding.items.find((p) => p.title === "Cannery 4.0 Phase 2").sponsor = payload;
  const groups = resolveResearchIndex(data, variant);
  const page = createResearchBrowsePages(groups, variant, img, originals)[0];
  assert.ok(page.body.includes(escape(payload)));
  assert.doesNotMatch(page.body, /<img src=x|<script/);
  const html = layout(site, page, variant.faculty.name, variant.research.areas, groups);
  assert.doesNotMatch(html, /<img src=x|<script>alert/);
  assert.ok([...html.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].some((match) => match[1] === escape(payload)));
});
test("only the header receives Topics/Problems after the original four ordered links, including on 404", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const groups = resolveResearchIndex(config(), lab);
  const pages = [...originalPages, ...createResearchBrowsePages(groups, lab, img, originals), { route: "/404.html", title: "Not found", description: "Not found", body: "" }];
  for (const page of pages) {
    const html = layout(site, page, lab.faculty.name, lab.research.areas, groups);
    const header = html.match(/<header class="site-header">([\s\S]*?)<\/header>/)[1];
    const disclosure = header.match(/<div class="research-disclosure[^>]*>([\s\S]*?)<\/div>/)[1];
    const menu = disclosure.slice(disclosure.indexOf('<ul class="research-directions'));
    const expected = [["/research/", "Overview"], ...lab.research.areas.map((a) => ['/research/' + a.slug + '/', escape(a.title)]), ...groups.flatMap((g) => g.items.map((i) => [i.route, escape(i.label)]))];
    const actual = links(menu).filter(([href]) => href.startsWith("/research/"));
    assert.deepEqual(actual, expected, page.route);
    assert.deepEqual([...menu.matchAll(/<h3\b[^>]*>([^<]*)<\/h3>/g)].map((match) => match[1]), groups.map((group) => escape(group.label)));
    assert.doesNotMatch(menu, /role="menu|aria-haspopup="menu|<ul[^>]*\shidden\b/);
    assert.match(header, /data-research-toggle[^>]*aria-expanded="false"[^>]*hidden/);
    const current = [...menu.matchAll(/<a[^>]*href="([^"]+)"[^>]*aria-current="page"/g)].map((m) => m[1]);
    assert.deepEqual(current, page.route.startsWith("/research/") ? [page.route] : []);
    assert.equal((html.match(/research-menu-groups/g) || []).length, 1);
    assert.match(html, /href="\/assets\/research-index.css"/);
    assert.ok(html.includes('<main id="main" tabindex="-1" class="container">' + page.body + '</main>'));
  }
  const legacy = layout(site, originalPages[0], lab.faculty.name, lab.research.areas);
  assert.doesNotMatch(legacy, /research-menu-groups|research-index.css/);
});
test("preview styles keep first four links vertical with two desktop groups and bounded mobile lists", () => {
  assert.ok(fs.existsSync(path.join(root, "src/research-index.css")), "scoped preview stylesheet must exist outside public");
  const css = read("src/research-index.css");
  assert.match(css, /\.research-menu-groups\s*\{[^}]*display:\s*grid/);
  assert.match(css.split("@media")[0], /\.primary-nav \.research-browse-menu\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /\.research-menu-groups\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /max-height:\s*calc\(100dvh\s*-\s*[^)]+\)/);
  assert.match(css, /overflow-y:\s*auto/);
  assert.match(css, /max-width:\s*calc\(100vw - 2rem\)/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*\.research-menu-groups\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.doesNotMatch(css, /gradient\(|box-shadow|@keyframes|--text-title\s*:/);
  assert.doesNotMatch(read("src/research-index.mjs"), /Date\.now|new Date|fetch\(/);
});


test("future award start notes derive only from the explicit validated preview month", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  for (const [asOf, scheduled] of [["2026-11", true], ["2027-05", true], ["2027-06", false], ["2028-01", false]]) {
    const index = { ...config(), asOf };
    const pages = createResearchBrowsePages(resolveResearchIndex(index, lab), lab, img, originals);
    const body = pages.find((p) => p.route === "/research/browse/topics/digital-twins/").body;
    assert.equal(body.includes("Starts June 2027 (scheduled start)."), scheduled, asOf);
  }
});


test("browse projects retain original figures, complete citation context and unique document IDs", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const groups = resolveResearchIndex(config(), lab);
  const overview = createPages(site, lab, img, originals).find((p) => p.route === "/research/");
  for (const page of createResearchBrowsePages(groups, lab, img, originals)) {
    const item = groups.flatMap((g) => g.items).find((i) => i.route === page.route);
    for (const project of item.projects) {
      const block = projectBlock(page.body, project.id);
      assert.ok(block, page.route + ': ' + project.id + ' full project article');
      assert.equal(block, projectBlock(overview.body, project.id));
      assert.match(block, /<div class="project-text"><h3>/);
      assert.ok(block.includes('src="' + project.image + '"'));
      assert.ok(block.includes('alt="' + escape(project.alt) + '"'));
      assert.deepEqual(links(block).filter(([href]) => href.startsWith('/assets/images/')).map(([href]) => href), [originals.get(project.image) || project.image, originals.get(project.image) || project.image]);
      for (const citation of project.paragraphs.filter((p) => p.kind === "citation")) {
        const record = publicationMap.get(citation.recordId);
        assert.ok(block.includes('href="/publication/#' + anchor(record.id) + '"'));
        assert.ok(block.includes(publications.publicationCitation(record.id, publicationMap)));
        for (const note of citation.notes || []) assert.ok(block.includes(note.html));
      }
    }
    const publicationSection = section(page.body, "Publications") || "";
    assert.doesNotMatch(publicationSection, /<figure|<img|data-figure-open/);
    const html = layout(site, page, lab.faculty.name, lab.research.areas, groups);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(ids.length, new Set(ids).size, page.route);
    assert.equal(html.includes('id="figure-viewer"'), Boolean(item.projects.length));
  }
});

for (const canonical of lab.projects) test('one canonical project edit propagates only to its mapped pages: ' + canonical.id, async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const data = structuredClone(lab), index = config();
  const edited = data.projects.find((p) => p.id === canonical.id);
  const paragraph = edited.paragraphs.find((p) => p.label === "Methodologies:") || edited.paragraphs.find((p) => p.html);
  const marker = " Canonical in-memory refinement [J10].";
  paragraph.html += marker;
  paragraph.text += marker;
  const citation = edited.paragraphs.find((p) => p.kind === "citation");
  citation.notes = [...(citation.notes || []), { html: "Canonical in-memory note [J10].", text: "Canonical in-memory note [J10]." }];
  const before = structuredClone({ data, index });
  freeze(data); freeze(index);
  const oldGroups = resolveResearchIndex(index, lab), groups = resolveResearchIndex(index, data);
  const previous = [...createPages(site, lab, img, originals), ...createResearchBrowsePages(oldGroups, lab, img, originals)];
  const next = [...createPages(site, data, img, originals), ...createResearchBrowsePages(groups, data, img, originals)];
  const mapped = groups.flatMap((g) => g.items).filter((item) => item.projects.some((p) => p.id === canonical.id));
  const expectedRoutes = ["/research/", ...data.research.areas.filter((area) => area.projects.includes(canonical.id)).map((area) => '/research/' + area.slug + '/'), ...mapped.map((item) => item.route)].sort();
  const actualRoutes = next.filter((page) => page.body !== previous.find((p) => p.route === page.route).body).map((p) => p.route).sort();
  assert.deepEqual(actualRoutes, expectedRoutes);
  const expected = projectBlock(next.find((p) => p.route === "/research/").body, canonical.id);
  assert.ok(expected.includes('Canonical in-memory refinement [<a href="/publication/#J10">' + publicationMap.get("J10").displayId + '</a>].'));
  assert.ok(expected.includes('Canonical in-memory note [<a href="/publication/#J10">' + publicationMap.get("J10").displayId + '</a>].'));
  for (const page of next) {
    if (expectedRoutes.includes(page.route)) assert.equal(projectBlock(page.body, canonical.id), expected, page.route);
    for (const other of data.projects.filter((p) => p.id !== canonical.id))
      assert.equal(projectBlock(page.body, other.id), projectBlock(previous.find((p) => p.route === page.route).body, other.id), page.route + ': unrelated ' + other.id);
    const ids = [...page.body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(ids.length, new Set(ids).size, page.route);
  }
  assert.deepEqual({ data, index }, before, "rendering must not mutate either input");
});

test("listing and browse reuse identical author, metadata and note detail markup without paper figures", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  assert.equal(typeof publications.publicationDetails, "function", "shared publication details renderer");
  const data = structuredClone(lab);
  data.publications[0].authors[0].name = 'Canonical author & detail';
  data.publications[0].notes = [...data.publications[0].notes, 'Canonical publication note <safe>'];
  const before = structuredClone(data);
  freeze(data);
  const listing = createPages(site, data, img, originals).find((p) => p.route === "/publication/").body;
  const groups = resolveResearchIndex(config(), data), pages = createResearchBrowsePages(groups, data, img, originals);
  for (const item of groups.flatMap((g) => g.items)) for (const record of item.publications) {
    const detail = publications.publicationDetails(record);
    assert.ok(listing.includes(detail), record.id + ': listing');
    const body = section(pages.find((p) => p.route === item.route).body, "Publications");
    assert.ok(body.includes(detail), item.route + ': ' + record.id);
    assert.doesNotMatch(body, /<figure|<img|data-figure-open/);
  }
  assert.deepEqual(data, before);
});

test("browse project figures use full page width rather than a prose-width section", () => {
  const css = read("src/research-index.css");
  const sectionStyle = css.match(/\.research-browse-section\s*\{([^}]*)\}/)?.[1] || "";
  assert.doesNotMatch(sectionStyle, /max-width:\s*var\(--measure\)/);
  assert.match(css, /\.research-browse-section:not\(\.research-browse-projects\)\s*\{[^}]*max-width:\s*var\(--measure\)/);
  assert.match(css, /@media print[\s\S]*\.research-browse-section:not\(\.research-browse-projects\)\s*\{[^}]*max-width:\s*none/, "print must still override the prose-width selector");
  assert.doesNotMatch(css, /(?:\.research-browse-projects|\.research-browse-section)[^{]*\.scientific-figure[^}]*max-width:\s*(?:var\(--measure\)|\d+(?:px|rem))/);
});

test("unsafe canonical project inline markup fails closed in browse just as on Overview", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const data = structuredClone(lab);
  data.projects[0].paragraphs[0].html = 'Goal: <img src=x onerror="alert(1)">';
  assert.throws(() => createPages(site, data, img, originals), /Invalid inline markup/);
  assert.throws(() => createResearchBrowsePages(resolveResearchIndex(config(), data), data, img, originals), /Invalid inline markup/);
});

test("J16* remains a maintenance paper and has no removed Reinforcement Learning destination", async () => {
  const { resolveResearchIndex, createResearchBrowsePages } = await implementation();
  const groups = resolveResearchIndex(config(), lab);
  assert.deepEqual(groups.flatMap((g) => g.items).filter((item) => item.publications.some((p) => p.id === "J16*")).map((item) => item.route), ["/research/browse/problems/maintenance-planning/"]);
  assert.ok(createResearchBrowsePages(groups, lab, img, originals).find((p) => p.route === "/research/browse/problems/maintenance-planning/").body.includes('href="/publication/#J16-review"'));
});
