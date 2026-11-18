import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createPages } from "../src/templates.mjs";
import { escape, imageRenderer } from "../src/helpers.mjs";
import { assertSourceCoverage } from "./source-coverage.mjs";
import { normalizeRefreshForBaseline } from "./refresh-expectations.mjs";
import { approvedPartners, assertPartnerGroupCoverage, normalizePartnersForBaseline, approvedPast, normalizePastRosterForBaseline, normalizePastRosterHtml, assertPastRosterCoverage } from "./people-partner-expectations.mjs";
import { educationItemHtml } from "./contact-education-expectations.mjs";

const read = (file) => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const site = JSON.parse(read('content/site.json'));
const lab = JSON.parse(read('content/lab.json'));
const img = imageRenderer(new URL('../public', import.meta.url).pathname);
const render = (data = lab, metadata = site) => new Map(createPages(metadata, data, img).map((page) => [page.route, page.body]));
const pages = render();
const people = pages.get('/people/');
const home = pages.get('/');
const facultyBlock = (html) => html.match(/<section class="section faculty-feature">([\s\S]*?)<\/section>/)[1];
const students = (html) => [...html.matchAll(/<article class="student">([\s\S]*?)<\/article>/g)].map((match) => match[1]);
const icons = (html) => [...html.matchAll(/<a class="person-link" href="([^"]+)" aria-label="([^"]+)" title="([^"]+)">([\s\S]*?)<\/a>/g)];
const hrefs = (html) => [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1]);
const nameRow = (html) => html.match(/<div class="person-name">[\s\S]*?<\/div>/)?.[0];
const freeze = (value) => {
  for (const child of Object.values(value)) if (child && typeof child === 'object') freeze(child);
  return Object.freeze(value);
};

function assertIcons(html, name, level, expected) {
  assert.ok(html.includes('<div class="person-name"><h' + level + '>' + escape(name) + '</h' + level + '><span class="person-links">'), 'links follow, not sit inside, the clean name heading');
  const found = icons(html);
  assert.deepEqual(found.map((match) => [match[1], match[2], match[3]]), expected.map(([href, label]) => [escape(href), escape(name + ': ' + label), escape(name + ': ' + label)]));
  assert.deepEqual(hrefs(nameRow(html)), expected.map(([href]) => escape(href)), 'name controls have no leftover text links or invented targets');
  for (const match of found) {
    if (match[2] === escape(name + ': CV (Curriculum vitae)')) assert.equal(match[4], 'CV');
    else assert.match(match[4], /^<svg class="person-icon person-icon-[a-z]+" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">[\s\S]+<\/svg>$/);
    assert.doesNotMatch(match[0], /tabindex|onclick|<script|<use|<image|https?:\/\/[^\"]+\.svg/);
  }
}

test('faculty has five accessible controls below the name, ending in visible CV with the existing target', () => {
  assertIcons(facultyBlock(people), lab.faculty.name, 2, [
    ['mailto:' + site.email, 'Email'], [site.profile, 'Faculty profile'],
    [site.scholar, 'Google Scholar'], [site.linkedin, 'LinkedIn'], ['/cv/', 'CV (Curriculum vitae)'],
  ]);
  assert.ok(facultyBlock(people).includes('<p>' + lab.faculty.bio[0].html + '</p>'));
  assert.doesNotMatch(facultyBlock(people), /class="text-links"|href="\/assets\/documents\//);
});

test('each current PhD student has only their own email and existing profile targets', () => {
  const blocks = students(people);
  assert.equal(blocks.length, lab.people.current.length);
  for (const [index, person] of lab.people.current.entries()) {
    assertIcons(blocks[index], person.name, 3, [['mailto:' + person.email, 'Email'], ...person.links.map((link) => [link.href, link.label])]);
    assert.doesNotMatch(blocks[index], /Google Scholar|Curriculum vitae|class="email"|class="text-links"/);
    const education = '<h4>Education</h4><ul class="education-list">' + person.education.map(educationItemHtml).join('') + '</ul>';
    assert.ok(blocks[index].includes(education), person.name + ': existing profile details stay exact');
    for (const item of person.highlights) assert.ok(blocks[index].includes('<li>' + escape(item) + '</li>'));
    assert.ok(blocks[index].includes('src="' + person.portrait + '"'));
  }
});

test('unknown valid link labels keep their meaning, escaping and globe rather than becoming invented services', () => {
  const data = structuredClone(lab);
  const person = data.people.current[0];
  person.name = 'Example <student> & "name"';
  person.email = 'example+"quoted"@example.test';
  person.links = [
    { label: 'Personal <site> & "profile"', href: 'https://example.test/?a=1&b="two"' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/example/' },
  ];
  const block = students(render(data).get('/people/'))[0];
  assertIcons(block, person.name, 3, [['mailto:' + person.email, 'Email'], ...person.links.map((link) => [link.href, link.label])]);
  assert.match(icons(block)[1][4], /person-icon-globe/);
  assert.match(icons(block)[2][4], /person-icon-linkedin/);
  assert.doesNotMatch(block, /<student>|<site>|aria-label="[^\"]*"profile"/);
});

test('empty, missing and unsafe link data create no empty or executable controls', () => {
  for (const empty of [undefined, []]) {
    const data = structuredClone(lab), metadata = structuredClone(site);
    for (const key of ['email', 'profile', 'scholar', 'linkedin', 'cv']) delete metadata[key];
    for (const person of data.people.current) { delete person.email; person.links = empty; }
    const html = render(data, metadata).get('/people/');
    for (const block of [facultyBlock(html), ...students(html)]) {
      assert.deepEqual(hrefs(nameRow(block)), []);
      assert.doesNotMatch(block, /person-link|undefined|null/);
    }
  }
  const data = structuredClone(lab);
  data.people.current[0].links = [{href: ''}, {href: ' '}, {}, {label: 'Unsafe', href: 'javascript:alert(1)'}, {label: 'Unsafe', href: '//example.test/'}, {label: '', href: 'https://example.test/'}];
  const found = icons(students(render(data).get('/people/'))[0]);
  assert.equal(found.length, 2);
  assert.equal(found[1][2], lab.people.current[0].name + ': Website');
  assert.match(found[1][4], /person-icon-globe/);
});

test('Andres remains a current compact bulleted undergraduate with exact dates, research credit and no invented links', () => {
  const current = people.slice(people.indexOf('<h2>Current Undergraduate Research</h2>'), people.indexOf('<h2>Past members:'));
  assert.match(current, /<ul class="student-roster"><li>Andres Sanchez \(Fall 2026\u2013present\); DAEN 491, research credit<\/li><\/ul>/);
  assert.doesNotMatch(current, /<h3>|class="small"|detail-list|<a\b|<svg\b/);
  assert.equal((people.match(/Andres Sanchez/g) || []).length, 1);
  assert.ok(people.includes('<ul class="student-roster"><li>Matthew Lemon (2024 Sep-2025 June)</li>'));
});

test('past members have only two categories with exact inline roles, dates, claims and order', () => {
  const past = people.match(/<div class="past-members people-roster">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(past, 'dedicated one-column past roster');
  assert.deepEqual(lab.people.past, approvedPast);
  assert.deepEqual([...past.matchAll(/<section><h3>([^<]+)<\/h3><ul class="student-roster">([\s\S]*?)<\/ul><\/section>/g)].map((match) => [match[1], [...match[2].matchAll(/<li>([^<]*)<\/li>/g)].map((item) => item[1])]), approvedPast.map((group) => [escape(group.title), group.names.map(escape)]));
  assertPastRosterCoverage(people);
  assert.doesNotMatch(past, /<h[2456]|Andres Sanchez|Past Students|role=/);
  assert.doesNotMatch(people, /<p[^>]*>Past Students<\/p>/);
});

test('past-role normalization is immutable and preserves original claim guard ownership', () => {
  const data = structuredClone(lab), before = structuredClone(data);
  freeze(data);
  const restored = normalizePastRosterForBaseline(data);
  assert.deepEqual(data, before);
  assert.deepEqual(restored.people.past.map((group) => group.title), ["Master's Students", "Student Intern", "Undergraduate Students", "REU Program (Research Experiences for Undergraduates)"]);
  assert.equal(restored.people.past[1].names[0], 'Shu Nee Khor (2023 Nov- 2024 January)');
  assert.equal(restored.people.past[3].names[0], 'Anna Hartman (2023 May-July)');
  for (const [group, row, originalPath] of [[0, 0, 'people.past.0.names.0'], [1, 1, 'people.past.2.names.1']]) {
    const changed = structuredClone(lab);
    changed.people.past[group].names[row] += ' UNAPPROVED';
    assert.throws(() => normalizeRefreshForBaseline(changed), (error) => error.code === 'ERR_ASSERTION' && error.message.startsWith(originalPath + ': exact approved value'));
  }
});

for (const [label, mutate] of [
  ['missing person', (past) => past[0].names.pop()],
  ['duplicate person', (past) => past[1].names.push(past[1].names[2])],
  ['reordered members', (past) => past[1].names.reverse()],
  ['wrong inline label', (past) => { past[0].names[1] = past[0].names[1].replace('Student Intern', 'Intern'); }],
  ['changed dates', (past) => { past[1].names[2] = past[1].names[2].replace('2023 May-July', '2024 May-July'); }],
  ['added claim', (past) => { past[0].names[1] += '; new achievement'; }],
  ['extra role heading', (past) => past.push({ title: 'Student Intern', names: [] })],
]) test('past provenance rejects ' + label, () => {
  const data = structuredClone(lab);
  mutate(data.people.past);
  assert.throws(() => normalizeRefreshForBaseline(data), /Exact approved inline past roster/);
});

test('historical HTML normalization reverses only the exact approved roster', () => {
  assert.notEqual(normalizePastRosterHtml(people), people);
  const changed = people.replace(approvedPast[0].names[1], approvedPast[0].names[1] + '; new achievement');
  assert.equal(normalizePastRosterHtml(changed), changed);
  const old = normalizePastRosterHtml(people);
  assert.throws(() => assertPastRosterCoverage(old), /people roster:/);
});

test('optional undergrad links render only supplied values while preserving compact roster escaping', () => {
  const data = structuredClone(lab);
  data.people.undergraduates = [{ name: 'Example <student>', period: 'Exact & period', description: 'Research <credit>', links: [{ label: 'Personal <site>', href: 'https://example.test/?a=1&b=2' }] }];
  const html = render(data).get('/people/');
  assert.match(html, /<li>Example &lt;student&gt; \(Exact &amp; period\); Research &lt;credit&gt; <span class="person-links">/);
  assert.ok(html.includes('aria-label="Example &lt;student&gt;: Personal &lt;site&gt;"'));
  assert.ok(html.includes('href="https://example.test/?a=1&amp;b=2"'));
  assert.doesNotMatch(html, /<student>|<credit>|<site>/);
});

test('new scoped CSS retains shared styles and supplies wrapping, uniform glyphs, touch space and one-column rosters at every width', () => {
  const css = read('public/assets/site.css');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const declarations = (selector) => rules.filter((rule) => rule[1].trim().split(/,\s*/).includes(selector)).map((rule) => rule[2]).join('\n');
  for (const selector of ['.person-name', '.person-links']) {
    assert.match(declarations(selector), /flex-wrap:\s*wrap/);
    assert.match(declarations(selector), /min-width:\s*0/);
  }
  for (const dimension of ['width', 'height']) assert.match(declarations('.person-link'), new RegExp('(?:^|[;\\s])' + dimension + ':\\s*2\\.75rem'));
  assert.match(declarations('.person-link'), /font:\s*600 var\(--text-small\)\/1 var\(--sans\)/);
  for (const dimension of ['width', 'height']) assert.match(declarations('.person-icon'), new RegExp(dimension + ':\\s*1\\.25rem'));
  assert.match(declarations('.person-name > h2'), /margin:\s*0/);
  assert.match(declarations('.person-name > h3'), /margin:\s*0/);
  assert.match(declarations('.past-members.people-roster'), /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.doesNotMatch(declarations('.past-members.people-roster'), /repeat\(2|order:/);
  assert.match(declarations('.people-roster .student-roster'), /font-size:\s*var\(--text-body\)/);
  assert.match(declarations(':focus-visible'), /outline:\s*0\.1875rem solid #245b86/);
  assert.doesNotMatch(declarations('.person-link') + declarations('.person-link:focus-visible'), /outline:\s*(?:none|0)/);
  assert.equal(read('public/assets/site.js').includes('person-link'), false, 'icons require no JavaScript');
});

test('Home owns one explicitly structured partner dataset with exact approved names and order', () => {
  assert.deepEqual(lab.faculty.partners, approvedPartners);
  for (const [index, group] of approvedPartners.groups.entries()) assertPartnerGroupCoverage(home, index);
  const section = home.match(/<h2>Industry &amp; funding partners<\/h2>[\s\S]*?<\/section>/)[0];
  assert.equal((section.match(/<ul\b/g) || []).length, 2);
  assert.equal((section.match(/<li>/g) || []).length, 8);
  assert.ok(section.includes('<p>' + approvedPartners.introduction.html + '</p>'));
  assert.deepEqual([...section.matchAll(/<h3>([^<]*)<\/h3>/g)].map((match) => match[1]), approvedPartners.groups.map((group) => group.title));
  assert.doesNotMatch(section, /<li>\s*-|<br>|formerly|National Advanced Materials|program or legal operator/i);
  assert.equal((section.match(/Department of War\/Defense/g) || []).length, 1);
});

test('partner rendering uses escaped structured items directly without parsing source punctuation or duplicating maintained records', () => {
  const data = structuredClone(lab);
  data.faculty.partners = { introduction: {html: 'Existing introduction'}, groups: [{title: 'Group <heading>', items: ['One, exact & item', 'Second <item>']}] };
  const html = render(data).get('/');
  assert.ok(html.includes('<h3>Group &lt;heading&gt;</h3><ul class="partner-list"><li>One, exact &amp; item</li><li>Second &lt;item&gt;</li></ul>'));
  assert.doesNotMatch(html, /<heading>|<item>/);
  const source = read('src/templates.mjs');
  assert.doesNotMatch(source, /partners[^;\n]*\.split\(/);
});

test('structured partner normalization reverses only the approved delta and never mutates input', () => {
  const data = structuredClone(lab), before = structuredClone(data);
  freeze(data);
  assert.ok(Array.isArray(normalizePartnersForBaseline(data).faculty.partners));
  normalizeRefreshForBaseline(data);
  assert.deepEqual(data, before);
});

for (const [label, mutate] of [
  ['missing funding partner', (data) => data.faculty.partners.groups[1].items.pop()],
  ['duplicate funding partner', (data) => data.faculty.partners.groups[1].items.push(data.faculty.partners.groups[1].items[0])],
  ['wrong partner order', (data) => data.faculty.partners.groups[1].items.reverse()],
  ['wrong LIFT expansion', (data) => { data.faculty.partners.groups[1].items[2] = 'National Advanced Materials Manufacturing Innovation Institute (LIFT)'; }],
  ['historical LIFT qualifier', (data) => { data.faculty.partners.groups[1].items[2] = 'LIFT (formerly Lightweight Innovations for Tomorrow)'; }],
  ['split Defense partner', (data) => data.faculty.partners.groups[1].items.splice(3, 1, 'U.S. Department of War', 'U.S. Department of Defense')],
  ['added assertion', (data) => { data.faculty.partners.groups[0].claim = 'New sponsor'; }],
]) test('partner provenance rejects ' + label, () => {
  assert.deepEqual(lab.faculty.partners, approvedPartners);
  const data = structuredClone(lab);
  mutate(data);
  assert.throws(() => normalizeRefreshForBaseline(data), /Exact approved structured partner groups/);
});

const coverage = (overrides = {}) => assertSourceCoverage(lab, (route) => '<main>' + (overrides[route] ?? pages.get(route)) + '</main>');
test('all captured paragraphs remain covered after icons, scoped roster-label aliases and structured partners', () => coverage());
for (const group of approvedPast) for (const row of group.names)
  test('source coverage rejects missing owning-list past member: ' + row, () => {
    const original = '<li>' + escape(row) + '</li>';
    assert.ok(people.includes(original));
    assert.throws(() => coverage({ '/people/': people.replace(original, '') + '<p>' + escape(row) + '</p>' }), /people roster:/);
  });
test('source coverage rejects detached role labels, extra headings and duplicate members', () => {
  const row = approvedPast[0].names[1];
  for (const changed of [
    people.replace(escape(row), escape(row.replace(', Student Intern', ''))) + '<p>Student Intern</p>',
    people.replace('<li>' + escape(row), '<h3>Student Intern</h3><li>' + escape(row)),
    people + '<p>' + escape(row) + '</p>',
  ]) assert.throws(() => coverage({ '/people/': changed }), /people roster:/);
});
for (const [index, group] of approvedPartners.groups.entries()) {
  for (const item of group.items) test('source coverage rejects missing owning-list partner: ' + item, () => {
    const original = '<li>' + escape(item) + '</li>';
    assert.ok(home.includes(original));
    assert.throws(() => coverage({'/': home.replace(original, '') + '<p>' + escape(item) + '</p>'}), /home partners:/);
  });
  test('source coverage rejects reordered owning-list partners: ' + group.title, () => {
    const original = group.items.map((item) => '<li>' + escape(item) + '</li>').join('');
    assert.ok(home.includes(original));
    assert.throws(() => coverage({'/': home.replace(original, [...group.items].reverse().map((item) => '<li>' + escape(item) + '</li>').join(''))}), /home partners:/);
  });
}
for (const person of lab.people.current) test('source coverage rejects missing owning-person email: ' + person.name, () => {
  const target = 'mailto:' + escape(person.email);
  assert.ok(people.includes('href="' + target + '"'));
  assert.throws(() => coverage({'/people/': people.replace('href="' + target + '"', 'href="mailto:wrong@example.test"') + '<p>' + person.email + '</p>'}), /people contact:/);
});
test('source coverage retains unrelated paragraph and both specific past categories instead of blanket missing-content permission', () => {
  for (const original of ['<h3>Master&#39;s Students</h3>', '<h3>Undergraduate Students</h3>', lab.faculty.bio[1].html]) {
    const route = original === lab.faculty.bio[1].html ? '/' : '/people/';
    assert.ok(pages.get(route).includes(original));
    assert.throws(() => coverage({[route]: pages.get(route).replace(original, '')}));
  }
});
