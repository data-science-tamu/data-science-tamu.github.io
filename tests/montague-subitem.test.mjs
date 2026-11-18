import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createPages, selectHomeAwards } from "../src/templates.mjs";
import { imageRenderer } from "../src/helpers.mjs";
import {
  montagueParent, montagueDetail, awardItemHtml, nestedMontagueHtml,
  normalizeMontagueDetailsForBaseline, normalizeMontagueDetailsHtml, topLevelAwardItems,
} from "./award-detail-expectations.mjs";
import { normalizeCorrectionsForBaseline } from "./correction-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const lab = read("content/lab.json"), site = read("content/site.json");
const homeConfig = read("content/home.json");
const img = imageRenderer(path.join(root, "public"));
const pages = (data = lab) => createPages(site, data, img);
const awardsSection = (page) => {
  const sections = [...page.body.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)]
    .filter((match) => match[0].includes('<h2>Awards and Honors</h2>'));
  assert.equal(sections.length, 1, page.route + ': exactly one awards section');
  return sections[0][0];
};
const count = (html, value) => html.split(value).length - 1;

// This protects the exact approved source relationship, not a visual indentation.
test("the exact Montague description is canonical detail data, never a separate award", () => {
  const parents = lab.faculty.awards.filter((award) => award.text === montagueParent.text);
  assert.equal(parents.length, 1);
  assert.deepEqual(parents[0], { ...montagueParent, details: [montagueDetail] });
  assert.equal(lab.faculty.awards.filter((award) => award.text === montagueDetail.text).length, 0);
  assert.equal(lab.faculty.awards.flatMap((award) => award.details || []).filter((detail) => detail.text === montagueDetail.text).length, 1);
});

for (const route of ['/', '/cv/']) {
  test(route + " nests the exact description once inside its Montague award with no orphan or duplicate", () => {
    const section = awardsSection(pages().find((page) => page.route === route));
    const selected = route === '/' ? selectHomeAwards(lab.faculty.awards) : lab.faculty.awards;
    assert.equal(count(section, nestedMontagueHtml), 1);
    assert.equal(count(section, montagueParent.html), 1);
    assert.equal(count(section, montagueDetail.html), 1);
    assert.ok(!topLevelAwardItems(section).includes(awardItemHtml(montagueDetail)));
    assert.deepEqual(topLevelAwardItems(section), selected.map(awardItemHtml));
    assert.match(section, route === '/' ? /<div><ul><li>/ : /<div><ul class="clean-list"><li>/);
  });
}

for (const reordered of [false, true]) {
  test("nested details follow arbitrary canonical parents through insertion and reordering: " + reordered, () => {
    const data = structuredClone(lab);
    const addition = {
      text: "Independent future recognition, 2034",
      html: '<strong>Independent future recognition</strong>, 2034',
      details: [
        { text: 'First detail & context', html: '<em>First detail</em> &amp; context' },
        { text: 'Second detail', html: '<a href="/cv/">Second detail</a><br>More context' },
      ],
    };
    data.faculty.awards.splice(3, 0, addition);
    data.faculty.awards.push({ text: 'Ordinary award', html: 'Ordinary award', details: [] });
    if (reordered) data.faculty.awards.reverse();
    const before = structuredClone(data);
    for (const page of pages(data).filter((page) => ['/', '/cv/'].includes(page.route))) {
      const expected = page.route === '/' ? selectHomeAwards(data.faculty.awards) : data.faculty.awards;
      const section = awardsSection(page);
      assert.deepEqual(topLevelAwardItems(section), expected.map(awardItemHtml));
      assert.equal(count(section, nestedMontagueHtml), 1);
      assert.equal(count(section, awardItemHtml(addition)), 1);
      assert.ok(section.includes('<li>Ordinary award</li>'));
    }
    assert.deepEqual(data, before);
  });
}

test("Home exclusions remove the parent with all its details, while CV retains them", () => {
  const data = structuredClone(lab);
  const excluded = data.faculty.awards.find((award) => award.text === homeConfig.excludedAwardTexts[0]);
  excluded.details = [{ text: 'Excluded parent detail', html: '<em>Excluded parent detail</em>' }];
  const variants = pages(data);
  assert.ok(!awardsSection(variants.find((page) => page.route === '/')).includes('Excluded parent detail'));
  assert.ok(awardsSection(variants.find((page) => page.route === '/cv/')).includes(awardItemHtml(excluded)));
  const selected = selectHomeAwards(data.faculty.awards, { excludedAwardTexts: [montagueParent.text] });
  assert.deepEqual(selected, data.faculty.awards.filter((award) => award.text !== montagueParent.text));
  assert.ok(!selected.some((award) => award.text === montagueDetail.text));
});

for (const [label, html] of [
  ['executable tag', '<script>alert(1)</script>'],
  ['event handler', '<a href="/cv/" onclick="alert(1)">Detail</a>'],
  ['unsafe URL', '<a href="javascript:alert(1)">Detail</a>'],
  ['incomplete markup', 'Detail <'],
  ['non-string markup', null],
]) {
  test("award parent and detail retain rich() validation: " + label, () => {
    for (const target of ['parent', 'detail']) {
      const data = structuredClone(lab);
      const award = { text: 'Validation parent', html: 'Validation parent', details: [{ text: 'Validation detail', html: 'Validation detail' }] };
      if (target === 'parent') award.html = html;
      else award.details[0].html = html;
      data.faculty.awards.unshift(award);
      assert.throws(() => pages(data), /Invalid inline (?:content|markup)/, target);
    }
  });
}

test("historical normalization reverses only the exact approved structure without mutation", () => {
  const before = structuredClone(lab);
  const flat = normalizeMontagueDetailsForBaseline(lab);
  assert.deepEqual(lab, before);
  const parent = flat.faculty.awards.findIndex((award) => award.text === montagueParent.text);
  assert.deepEqual(flat.faculty.awards.slice(parent, parent + 2), [montagueParent, montagueDetail]);
  for (const page of pages()) {
    const normalized = normalizeMontagueDetailsHtml(page.body);
    if (['/', '/cv/'].includes(page.route)) {
      assert.notEqual(normalized, page.body);
      assert.equal(normalized.replace(awardItemHtml(montagueParent) + awardItemHtml(montagueDetail), nestedMontagueHtml), page.body);
    } else assert.equal(normalized, page.body, page.route);
  }
});

for (const [label, mutate] of [
  ['missing detail', (award) => { delete award.details; }],
  ['duplicate detail', (award) => { award.details.push(structuredClone(montagueDetail)); }],
  ['changed wording', (award) => { award.details[0].text += ' Changed'; }],
  ['changed amount', (award) => { award.details[0].html = award.details[0].html.replace('$6,500', '$9,500'); }],
  ['changed parent link', (award) => { award.html = award.html.replace('cte.tamu.edu', 'example.invalid'); }],
]) {
  test("historical provenance still rejects " + label, () => {
    const data = structuredClone(lab);
    const award = data.faculty.awards.find((item) => item.text === montagueParent.text);
    assert.ok(Array.isArray(award.details), 'Canonical nested data must exist before mutation');
    mutate(award);
    assert.throws(() => normalizeCorrectionsForBaseline(data));
  });
}
