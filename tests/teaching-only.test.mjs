import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createPages } from "../src/templates.mjs";
import { imageRenderer } from "../src/helpers.mjs";
import { normalizeRefreshForBaseline } from "./refresh-expectations.mjs";
import { assertSourceCoverage } from "./source-coverage.mjs";
import { awardItemHtml, topLevelAwardItems } from "./award-detail-expectations.mjs";
import { approvedCourses, courseDetail, teachingHtml, historicalTeachingHtml, cvAwardsHtml, historicalCvAwardsHtml, normalizeCourseBulletsHtml } from "./course-bullet-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const lab = read("content/lab.json"), site = read("content/site.json");
const img = imageRenderer(path.join(root, "public"));
const render = (data = lab) => createPages(site, data, img);
const pages = render();
const body = (route, variants = pages) => variants.find((page) => page.route === route).body;
const routes = ["/", "/cv/"];
const section = (html, title) => {
  const heading = html.indexOf('<h2>' + title + '</h2>');
  assert.ok(heading >= 0, title + ': section exists');
  const start = html.lastIndexOf('<section', heading);
  return html.slice(start, html.indexOf('</section>', heading) + '</section>'.length);
};
const freeze = (value) => {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};
const htmlAt = (variants = pages) => (route) => '<main>' + body(route, variants) + '</main>';
const withoutTeachingResearch = (html) => html.replace(
  /<section class="section faculty-details">[\s\S]*?<\/section>/,
  teachingHtml(approvedCourses),
);

for (const route of routes) {
  test(route + " omits the combined interests and Research Recognition headings", () => {
    assert.doesNotMatch(body(route), /<h[1-6]>Research Interests(?: &amp; recognition)?<\/h[1-6]>|<h[1-6]>Research Recognition<\/h[1-6]>/);
    assert.doesNotMatch(body(route), /class="section faculty-details"/);
  });

  test(route + " uses three native course bullets with the exact development detail nested once", () => {
    assert.deepEqual(lab.faculty.courses, approvedCourses);
    const teaching = section(body(route), "Courses taught");
    assert.equal(teaching, teachingHtml());
    assert.deepEqual(topLevelAwardItems(teaching), approvedCourses.map(awardItemHtml));
    assert.equal(teaching.split(courseDetail.html).length - 1, 1);
    assert.doesNotMatch(teaching, /clean-list|style=|role=/);
    assert.equal((body(route).match(/<h2>Courses taught<\/h2>/g) || []).length, 1);
  });
}

test("teaching is adjacent to the original neighboring sections without empty columns or placeholders", () => {
  const teaching = teachingHtml(approvedCourses);
  assert.ok(body("/").includes(section(body("/"), "Industry &amp; funding partners") + '\n  ' + teaching + '\n  ' + section(body("/"), "Prospective Students &amp; Collaborators")));
  assert.ok(body("/cv/").includes(section(body("/cv/"), "Education") + '\n  ' + teaching + '\n  ' + section(body("/cv/"), "Awards and Honors")));
  assert.doesNotMatch(body("/cv/"), /<h[1-6]>Professional Experience<\/h[1-6]>/);
});

for (const field of ["interests", "recognition"]) {
  const first = { text: field + ' hidden sentinel one', html: '<strong>' + field + ' hidden sentinel one</strong>' };
  const second = { text: field + ' hidden sentinel two', html: '<em>' + field + ' hidden sentinel two</em>' };
  for (const [label, records] of [
    ["absent"], ["undefined", undefined], ["null", null], ["empty", []],
    ["singleton", [first]], ["multiple", [first, second]], ["reordered", [second, first]],
  ]) {
    test(field + " never reappears for " + label + " canonical records and rendering does not mutate inputs", () => {
      const data = structuredClone(lab);
      if (label === "absent") delete data.faculty[field];
      else data.faculty[field] = structuredClone(records);
      const before = structuredClone(data);
      freeze(data);
      const variants = render(data);
      for (const route of routes) {
        assert.equal(body(route, variants), body(route));
        assert.doesNotMatch(body(route, variants), /hidden sentinel/);
      }
      assert.deepEqual(data, before);
    });
  }
}

test("both teaching lists retain rich course HTML and canonical order for populated or empty courses", () => {
  const richCourse = {
    text: 'Test Course & Lab: Details',
    html: '<strong>Test Course &amp; Lab</strong>: <em><a href="/cv/">Details</a></em>',
    details: [
      { text: 'First detail & context', html: '<em>First detail</em> &amp; context' },
      { text: 'Second detail', html: '<a href="/cv/">Second detail</a><br>More context' },
    ],
  };
  for (const courses of [[], [richCourse], [richCourse, { text: 'Plain', html: 'Plain', details: [] }], [...approvedCourses, richCourse], [richCourse, ...approvedCourses].reverse()]) {
    const data = structuredClone(lab);
    data.faculty.courses = structuredClone(courses);
    const before = structuredClone(data);
    freeze(data);
    for (const route of routes)
      assert.equal(section(body(route, render(data)), "Courses taught"), teachingHtml(courses));
    assert.deepEqual(data, before);
  }
});

test("course parent and detail use the existing rich-text validation", () => {
  for (const html of ['<script>alert(1)</script>', '<a href="/cv/" onclick="alert(1)">Detail</a>', '<a href="javascript:alert(1)">Detail</a>', 'Detail <', null]) {
    for (const target of ['parent', 'detail']) {
      const data = structuredClone(lab);
      const course = { text: 'Parent', html: 'Parent', details: [{ text: 'Detail', html: 'Detail' }] };
      if (target === 'parent') course.html = html;
      else course.details[0].html = html;
      data.faculty.courses = [course];
      assert.throws(() => render(data), /Invalid inline (?:content|markup)/, target);
    }
  }
});

test("historical section adapters accept only the exact approved markup and preserve unrelated bytes", () => {
  for (const [current, historical, route] of [[teachingHtml(), historicalTeachingHtml, '/'], [cvAwardsHtml, historicalCvAwardsHtml, '/cv/']]) {
    assert.equal(normalizeCourseBulletsHtml(current + ' sentinel', route), historical + ' sentinel');
    assert.equal(normalizeCourseBulletsHtml(historical, route), historical);
    const items = topLevelAwardItems(current);
    for (const changed of [
      current.replace('<ul>', '<ul class="clean-list">'),
      current.replace(items[0], ''),
      current.replace(items[0], items[0] + items[0]),
      current.replace(items[0] + items[1], items[1] + items[0]),
      current.replace('2025', '2099'),
    ]) {
      assert.notEqual(changed, current);
      assert.equal(normalizeCourseBulletsHtml(changed, route), changed);
    }
  }
  assert.equal(normalizeCourseBulletsHtml(cvAwardsHtml, '/'), cvAwardsHtml, 'Home awards are never adapted');
});

test("source provenance rejects missing, duplicated, flattened or misattached course details", () => {
  normalizeRefreshForBaseline(lab);
  for (const mutate of [
    (courses) => { delete courses[2].details; },
    (courses) => { courses[2].details.push(structuredClone(courseDetail)); },
    (courses) => { courses.push(...courses[2].details); delete courses[2].details; },
    (courses) => { courses[0].details = courses[2].details; delete courses[2].details; },
    (courses) => { delete courses[2].html; },
  ]) {
    const data = structuredClone(lab);
    mutate(data.faculty.courses);
    assert.throws(() => normalizeRefreshForBaseline(data), (error) => error.code === 'ERR_ASSERTION');
  }
});

test("all 243 source paragraphs remain covered with interests and recognition retained only in canonical data", () => {
  const variants = pages.map((page) => routes.includes(page.route)
    ? { ...page, body: withoutTeachingResearch(page.body) } : page);
  const before = structuredClone(lab);
  assertSourceCoverage(freeze(structuredClone(lab)), htmlAt(variants));
  assert.deepEqual(lab, before);
});

test("non-displayed canonical records remain exact and source coverage rejects each missing or altered record even if rendered elsewhere", () => {
  normalizeRefreshForBaseline(lab);
  for (const field of ["interests", "recognition"]) {
    for (const index of lab.faculty[field].keys()) {
      for (const mutate of [
        (records) => records.splice(index, 1),
        (records) => { records[index].text += ' UNAPPROVED'; },
        (records) => { records[index].html += ' UNAPPROVED'; },
      ]) {
        const data = structuredClone(lab);
        mutate(data.faculty[field]);
        const variants = pages.map((page) => ({ ...page, body: page.body + '<p>' + lab.faculty[field][index].html + '</p>' }));
        assert.throws(() => assertSourceCoverage(data, htmlAt(variants)), (error) => error.code === 'ERR_ASSERTION', field + '[' + index + ']');
      }
    }
    const data = structuredClone(lab);
    data.faculty[field].reverse();
    assert.throws(() => assertSourceCoverage(data, htmlAt()), (error) => error.code === 'ERR_ASSERTION', field + ': order');
  }
});

test("canonical-only coverage does not allow courses or unrelated Home content to disappear", () => {
  for (const original of [
    ...approvedCourses.map(awardItemHtml),
    awardItemHtml(courseDetail),
    '<p>' + lab.faculty.bio[2].html + '</p>',
    '<li>' + lab.faculty.awards.find((award) => award.text.includes('Best paper award, Management')).html + '</li>',
  ]) {
    const changed = body("/").replace(original, '');
    assert.notEqual(changed, body("/"));
    const variants = pages.map((page) => page.route === "/" ? { ...page, body: changed } : page);
    assert.throws(() => assertSourceCoverage(lab, htmlAt(variants)), (error) => error.code === 'ERR_ASSERTION');
  }
});
