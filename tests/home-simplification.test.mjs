import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import * as templates from "../src/templates.mjs";
import { escape, imageRenderer } from "../src/helpers.mjs";
import { assertSourceCoverage } from "./source-coverage.mjs";
import { awardItemHtml, normalizeMontagueDetailsHtml, topLevelAwardItems } from "./award-detail-expectations.mjs";
import { educationItemHtml } from "./contact-education-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const lab = read("content/lab.json"), site = read("content/site.json");
const baseline = read("tests/fixtures/home-preservation.json");
const img = imageRenderer(path.join(root, "public"));
const pages = templates.createPages(site, lab, img);
const body = (route) => pages.find((page) => page.route === route).body;
const home = body("/"), cv = body("/cv/"), people = body("/people/");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const excludedAwardTexts = [
  "Exceptional performance warrant on M.S. exam (statistical consulting exam involving interviewing two clients, writing reports, and orally defending the reports to four faculty committees), Department of Statistics, UW\u2013Madison, 2020",
  "Best Master\u2019s Thesis Award, KAIST, 2013",
];
const config = () => ({ excludedAwardTexts: [...excludedAwardTexts] });
const section = (html, title) => {
  const heading = html.indexOf('<h2>' + escape(title) + '</h2>');
  assert.ok(heading >= 0, title + ': section exists');
  const start = html.lastIndexOf('<section', heading);
  return html.slice(start, html.indexOf('</section>', start) + '</section>'.length);
};
const teaching = (html) => section(html, "Courses taught");
const select = (awards, options = config()) => {
  assert.equal(typeof templates.selectHomeAwards, "function", "explicit Home-only award selector must exist");
  return templates.selectHomeAwards(awards, options);
};
const freeze = (value) => {
  for (const child of Object.values(value)) if (child && typeof child === "object") freeze(child);
  return Object.freeze(value);
};

test("Home has one faculty identity heading in the unchanged hero", () => {
  assert.equal((home.match(/<h1\b/g) || []).length, 1);
  assert.equal([...home.matchAll(new RegExp('<h2>' + lab.faculty.name + '</h2>', 'g'))].length, 1);
  assert.equal((home.match(/class="faculty-portrait"/g) || []).length, 1);
  assert.ok(home.includes('alt="Portrait of ' + lab.faculty.name + '"'));
  assert.ok(home.includes('<h2>' + lab.faculty.name + '</h2><p>' + escape(site.facultyRole)));
});

test("Home omits only the repeated introduction and external profile block", () => {
  assert.ok(!home.includes(lab.faculty.bio[0].html));
  for (const key of ["profile", "scholar", "linkedin"])
    assert.ok(!home.includes('href="' + escape(site[key]) + '"'), key);
  assert.doesNotMatch(home, /Faculty profile|Google Scholar|LinkedIn/);
});

test("Home omits Education while People profile and complete CV education remain", () => {
  assert.doesNotMatch(home, /<h[1-6]>Education<\/h[1-6]>|faculty-background|class="education-list"|Full curriculum vitae/);
  assert.ok(people.includes(lab.faculty.bio[0].html));
  for (const key of ["profile", "scholar", "linkedin"])
    assert.ok(people.includes('href="' + escape(site[key]) + '"'), key);
  assert.match(cv, /id="faculty-background"/);
  for (const degree of lab.faculty.education)
    for (const value of Object.values(degree)) assert.ok(cv.includes(escape(value)), value);
});

test("Home hero, research, news and relocated contact stay byte-identical", () => {
  const prefix = home.slice(0, home.indexOf(section(home, "Awards and Honors")));
  const contact = section(home, "Prospective Students & Collaborators");
  assert.equal(hash(prefix + contact), baseline.homePrefixSha256);
});

test("Home section order ends in Prospective Students & Collaborators", () => {
  assert.deepEqual([...home.matchAll(/<h2>([^<]*)<\/h2>/g)].map((match) => match[1]), [
    lab.faculty.name, "Research focus", "Research directions", "Latest news",
    "Awards and Honors",
    "Industry &amp; funding partners", "Courses taught",
    "Prospective Students &amp; Collaborators",
  ]);
  assert.equal(hash(teaching(home)), baseline.homeTeachingSha256);
  assert.equal(hash(section(home, "Industry & funding partners")), baseline.homePartnersSha256);
  for (const item of lab.faculty.courses) {
    assert.ok(teaching(home).includes('<li>' + item.html + '</li>'), 'courses: ' + item.text);
    assert.ok(teaching(cv).includes('<li>' + item.html + '</li>'), 'CV courses: ' + item.text);
  }
  for (const html of [home, cv])
    assert.doesNotMatch(html, /<h2>Research Interests &amp; recognition<\/h2>|<h3>Research Recognition<\/h3>/);
});

test("Home hero anchor resolves to exactly one final contact section before the footer", () => {
  const contact = section(home, "Prospective Students & Collaborators");
  assert.equal((home.match(/<section class="contact-panel"/g) || []).length, 1);
  assert.equal((home.match(/\bid="prospective-students"/g) || []).length, 1);
  assert.equal((home.match(/href="#prospective-students"/g) || []).length, 1);
  assert.match(contact, /^<section class="contact-panel" id="prospective-students">/);
  assert.match(home, /<a class="student-link" href="#prospective-students">Interested in a Ph\.D\. position\? <span aria-hidden="true">&#8595;<\/span><\/a>/);
  assert.ok(home.endsWith(contact));
  assert.doesNotMatch(home, /<footer\b/);
  const html = templates.layout(site, pages.find((page) => page.route === "/"), lab.faculty.name, lab.research.areas);
  assert.match(html, /<\/main>\s*<footer class="site-footer">[\s\S]*<\/footer>\s*<\/body><\/html>$/);
});

test("Home excludes exactly the two authorized awards and CV retains every award", () => {
  const expected = lab.faculty.awards.filter((award) => !excludedAwardTexts.includes(award.text));
  const awards = section(home, "Awards and Honors");
  assert.deepEqual(topLevelAwardItems(awards), expected.map(awardItemHtml));
  assert.equal(expected.length, lab.faculty.awards.length - 2);
  for (const award of lab.faculty.awards) {
    assert.equal(awards.includes(awardItemHtml(award)), !excludedAwardTexts.includes(award.text), award.text);
    assert.ok(section(cv, "Awards and Honors").includes(awardItemHtml(award)), 'CV: ' + award.text);
  }
  assert.ok(awards.includes('Best paper award, Management and Innovation Technology International Conference, 2015'));
});

test("Home awards use native bullets while CV awards retain clean-list markup", () => {
  const awards = section(home, "Awards and Honors");
  assert.match(awards, /<div><ul><li>/);
  assert.doesNotMatch(awards, /\bclean-list\b/);
  assert.match(section(cv, "Awards and Honors"), /<div><ul class="clean-list"><li>/);
});

test("Home layout retains the approved composition and structured partners except exact Montague detail nesting", () => {
  assert.equal(hash(normalizeMontagueDetailsHtml(home)), baseline.homeBodySha256);
});

test("maintained Home config names only the exact two award texts", () => {
  assert.ok(fs.existsSync(path.join(root, "content/home.json")), "explicit Home-only content config must exist");
  assert.deepEqual(read("content/home.json"), config());
});

test("Home award selection is exact, ordered and does not mutate frozen inputs", () => {
  const awards = structuredClone(lab.faculty.awards), options = config();
  const before = structuredClone({ awards, options });
  freeze(awards); freeze(options);
  const selected = select(awards, options);
  assert.deepEqual(selected, awards.filter((award) => !excludedAwardTexts.includes(award.text)));
  assert.ok(selected.every((award) => awards.includes(award)), "retain canonical records, not copies of their facts");
  assert.deepEqual({ awards, options }, before);
});

test("award selection accepts any explicit valid subset without a magic count", () => {
  for (const texts of [[], [lab.faculty.awards[0].text], lab.faculty.awards.slice(0, 3).map((award) => award.text)]) {
    const options = { excludedAwardTexts: texts };
    assert.deepEqual(select(lab.faculty.awards, options), lab.faculty.awards.filter((award) => !texts.includes(award.text)));
  }
});

test("new ordinary awards survive insertion, reordering and Master's-like wording automatically", () => {
  const additions = [
    { text: 'New ordinary award, 2032', html: 'New ordinary award, 2032' },
    { text: 'Future M.S. exam recognition, UW-Madison, 2030', html: 'Future M.S. exam recognition, UW-Madison, 2030' },
    { text: "Best Master's Thesis mentoring award, KAIST, 2031", html: "Best Master's Thesis mentoring award, KAIST, 2031" },
    { text: excludedAwardTexts[1] + ' (new related recognition)', html: excludedAwardTexts[1] + ' (new related recognition)' },
  ];
  for (const reordered of [false, true]) {
    const data = structuredClone(lab);
    data.faculty.awards.unshift(additions[0]);
    data.faculty.awards.splice(3, 0, additions[1]);
    data.faculty.awards.push(...additions.slice(2));
    if (reordered) data.faculty.awards.reverse();
    const before = structuredClone(data);
    freeze(data);
    const variants = templates.createPages(site, data, img);
    for (const route of ["/", "/cv/"]) {
      const awards = section(variants.find((page) => page.route === route).body, "Awards and Honors");
      const expected = data.faculty.awards.filter((award) => route !== "/" || !excludedAwardTexts.includes(award.text));
      assert.deepEqual(topLevelAwardItems(awards), expected.map(awardItemHtml));
    }
    assert.deepEqual(data, before);
  }
});

test("award exclusion uses exact text identity even when its markup changes", () => {
  const data = structuredClone(lab);
  data.faculty.awards.find((award) => award.text === excludedAwardTexts[0]).html = '<strong>Updated markup for the same excluded award</strong>';
  const variants = templates.createPages(site, data, img);
  assert.ok(!variants[0].body.includes('Updated markup for the same excluded award'));
  assert.ok(variants.find((page) => page.route === '/cv/').body.includes('Updated markup for the same excluded award'));
});

for (const [label, invalid] of [
  ["null", null], ["array root", []], ["missing list", {}],
  ["unknown field", { ...config(), awards: [] }],
  ["non-array list", { excludedAwardTexts: excludedAwardTexts[0] }],
  ["non-string entry", { excludedAwardTexts: [null, excludedAwardTexts[1]] }],
  ["blank entry", { excludedAwardTexts: [" ", excludedAwardTexts[1]] }],
  ["unknown text", { excludedAwardTexts: ["Unknown award", excludedAwardTexts[1]] }],
  ["near-match text", { excludedAwardTexts: [excludedAwardTexts[0] + " ", excludedAwardTexts[1]] }],
  ["duplicate text", { excludedAwardTexts: [excludedAwardTexts[0], excludedAwardTexts[0]] }],
]) test('invalid Home award exclusion config fails closed: ' + label, () => {
  assert.throws(() => select(lab.faculty.awards, invalid), /Invalid home award exclusions/);
});

test("ambiguous excluded canonical award fails closed", () => {
  const awards = [...lab.faculty.awards, lab.faculty.awards.find((award) => award.text === excludedAwardTexts[0])];
  assert.throws(() => select(awards), /Invalid home award exclusions/);
});

test("rendering leaves canonical source data and site metadata unmutated", () => {
  const data = structuredClone(lab), metadata = structuredClone(site);
  const before = structuredClone({ data, metadata });
  freeze(data); freeze(metadata);
  templates.createPages(metadata, data, img);
  assert.deepEqual({ data, metadata }, before);
});

const htmlAt = (overrides = {}) => (route) => '<main>' + (overrides[route] ?? body(route)) + '</main>';
const withoutRelocatedParagraphs = () => home
  .replace('<p>' + lab.faculty.bio[0].html + '</p>', '')
  .replace(/<section class="section split-section" id="faculty-background">[\s\S]*?<\/section>/, '')
  .replace('<li>' + lab.faculty.awards.find((award) => award.text === excludedAwardTexts[1]).html + '</li>', '');

test("all 243 captured paragraphs remain checked with explicit People/CV destinations", () => {
  assertSourceCoverage(lab, htmlAt({ '/': withoutRelocatedParagraphs() }));
});

const relocated = [
  ['faculty bio', '/people/', '<p>' + lab.faculty.bio[0].html + '</p>'],
  ['Education heading', '/cv/', '<h2>Education</h2>'],
  ...lab.faculty.education.map((degree) => [degree.degree + ' ' + degree.dates + ' ' + degree.field, '/cv/', educationItemHtml(degree)]),
  ['2013 thesis award', '/cv/', '<li>' + lab.faculty.awards.find((award) => award.text === excludedAwardTexts[1]).html + '</li>'],
];
for (const [label, route, original] of relocated)
  test('source coverage rejects missing specific target-route text: ' + label, () => {
    const changed = body(route).replace(original, '');
    assert.notEqual(changed, body(route), 'mutation must remove real original content');
    // Text surviving on Home or another page must not mask a missing destination.
    assert.throws(() => assertSourceCoverage(lab, htmlAt({ [route]: changed, '/': home + original })),
      (error) => error.code === 'ERR_ASSERTION' && error.message.includes('home -> ' + route + ':'));
  });
