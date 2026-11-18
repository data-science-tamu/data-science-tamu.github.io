import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createPages } from "../src/templates.mjs";
import { imageRenderer } from "../src/helpers.mjs";
import { personLinks } from "../src/people-links.mjs";
import { educationItemHtml, normalizeContactEducationHtml } from "./contact-education-expectations.mjs";

const read = (file) => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const site = JSON.parse(read('content/site.json'));
const lab = JSON.parse(read('content/lab.json'));
const img = imageRenderer(new URL('../public', import.meta.url).pathname);
const render = (data = lab) => new Map(createPages(site, data, img).map((page) => [page.route, page.body]));
const pages = render();
const css = read('public/assets/site.css');
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const declarations = (selector) => rules.filter((rule) => rule[1].trim().split(/,\s*/).includes(selector)).map((rule) => rule[2]).join('\n');

for (const [route, degrees] of [
  ['/people/', lab.people.current.flatMap((person) => person.education)],
  ['/cv/', lab.faculty.education],
]) test(route + ' shares inline degree (unchanged dates), field and institution markup', () => {
  const items = [...pages.get(route).matchAll(/<ul class="education-list">([\s\S]*?)<\/ul>/g)]
    .flatMap((match) => [...match[1].matchAll(/<li>[\s\S]*?<\/li>/g)].map((item) => item[0]));
  assert.deepEqual(items, degrees.map(educationItemHtml));
  assert.doesNotMatch(pages.get('/'), /class="education-list"/);
});

test('shared education keeps ranges, open dates, escaping and source data unchanged', () => {
  const data = structuredClone(lab);
  const degrees = [
    {degree: 'MS & <degree>', dates: '2021-2022', field: 'Field <name>', institution: 'Institution & <campus>'},
    {degree: 'PhD', dates: '2023-', field: 'Another field', institution: 'Another institution'},
  ];
  data.faculty.education = structuredClone(degrees);
  data.people.current[0].education = structuredClone(degrees);
  const before = structuredClone(data);
  const variants = render(data);
  for (const route of ['/people/', '/cv/']) {
    for (const degree of degrees) assert.ok(variants.get(route).includes(educationItemHtml(degree)), route);
    assert.doesNotMatch(variants.get(route), /<degree>|<name>|<campus>/);
  }
  assert.deepEqual(data, before);
});

test('name controls occupy their own row under the heading at every width', () => {
  assert.match(declarations('.person-name'), /flex-direction:\s*column/);
  assert.match(declarations('.person-name'), /align-items:\s*flex-start/);
  assert.doesNotMatch(declarations('.person-name'), /flex-direction:\s*row|align-items:\s*center/);
  const names = [...pages.get('/people/').matchAll(/<div class="person-name"><h([23])>([^<]+)<\/h\1><span class="person-links">/g)];
  assert.deepEqual(names.map((match) => match[2]), [lab.faculty.name, ...lab.people.current.map((person) => person.name)]);
});

test('education uses aligned tab-like columns, inline details and a safe narrow stack', () => {
  const education = declarations('.education-list li');
  assert.match(education, /grid-template-columns:\s*minmax\(0, 9rem\) minmax\(0, 1fr\)/);
  assert.match(education, /gap:\s*1\.5rem/);
  assert.match(education, /overflow-wrap:\s*anywhere/);
  for (const selector of ['.degree span', '.institution']) {
    assert.match(declarations(selector), /display:\s*inline/);
    assert.doesNotMatch(declarations(selector), /display:\s*block|white-space:\s*nowrap/);
  }
  assert.match(css.slice(css.indexOf('@media (max-width: 560px)')), /\.education-list li\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\);\s*gap:\s*0\.25rem/);
});

test('CV is literal visible text with its expanded accessible name and unchanged link box', () => {
  const html = pages.get('/people/');
  assert.ok(html.includes('<a class="person-link" href="/cv/" aria-label="Jaesung Lee: CV (Curriculum vitae)" title="Jaesung Lee: CV (Curriculum vitae)">CV</a>'));
  assert.doesNotMatch(html, /person-icon-cv/);
  assert.equal((html.match(/class="person-icon /g) || []).length, 4 + lab.people.current.reduce((count, person) => count + 1 + person.links.length, 0));
  for (const label of ['CV', 'Curriculum vitae']) {
    const links = personLinks('Name <&>', undefined, [{label, href: '/cv/'}]);
    assert.match(links, /aria-label="Name &lt;&amp;&gt;: CV \(Curriculum vitae\)"/);
    assert.match(links, />CV<\/a>/);
  }
  for (const dimension of ['width', 'height']) assert.match(declarations('.person-link'), new RegExp('(?:^|[;\\s])' + dimension + ':\\s*2\\.75rem'));
});

test('historical adapter reverses only presentation and preserves mutated facts and targets', () => {
  const item = educationItemHtml(lab.faculty.education[0]);
  const old = '<li><span class="degree">PhD <span>2022</span></span><div><strong>Industrial &amp; Systems Engineering</strong><span class="institution">University of Wisconsin\u2013Madison, Madison, WI</span></div></li>';
  assert.equal(normalizeContactEducationHtml(item), old);
  for (const value of ['PhD', '2022', 'Industrial &amp; Systems Engineering', 'University of Wisconsin\u2013Madison, Madison, WI'])
    assert.equal(normalizeContactEducationHtml(item.replace(value, value + ' CHANGED')), old.replace(value, value + ' CHANGED'));
  const control = personLinks('Owner', undefined, [{label: 'Curriculum vitae', href: '/cv/'}]);
  assert.match(normalizeContactEducationHtml(control), /person-icon-cv/);
  for (const changed of [control.replace('/cv/', '/wrong/'), control.replace('>CV</a>', '>Wrong</a>'), control.replaceAll('CV (Curriculum vitae)', 'Wrong label')])
    assert.equal(normalizeContactEducationHtml(changed), changed);
});
