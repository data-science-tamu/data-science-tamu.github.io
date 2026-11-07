import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createPages } from "../src/templates.mjs";
import { imageRenderer } from "../src/helpers.mjs";
import { corrections, normalizeCorrectionsForBaseline } from "./correction-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const raw = fs.readFileSync(path.join(root, "content/lab.json"), "utf8");
const lab = JSON.parse(raw);
const site = JSON.parse(fs.readFileSync(path.join(root, "content/site.json"), "utf8"));
const sha256 = value => createHash("sha256").update(value).digest("hex");
const montague = "https://cte.tamu.edu/news-and-highlights/faculty-named-montague-2025-2026.html";
const department = "https://www.linkedin.com/posts/wm-michael-barnes-64-department-of-industrial-systems-engineering-at-texas-a-m-university_dr-jaesung-lee-an-assistant-professor-in-activity-7501423618027982848-FY2_";
const spotlight = "https://www.linkedin.com/posts/informs-quality-statistics-and-reliability-qsr_quality-statistics-reliability-activity-7501331937618370560-xMwW";

function assertOnlyCorrections(data) {
  const baseline = normalizeCorrectionsForBaseline(data);
  assert.equal(sha256(JSON.stringify(baseline)), corrections.baselineSha256,
    "Every unrelated baseline content value must remain exact");
  assert.equal(sha256(JSON.stringify(baseline, null, 2) + "\n"), corrections.baselineRawSha256,
    "Only the approved corrections may change baseline bytes");
  return baseline;
}

test("People photos are exactly the original objects in newest-first 2026, 2025, 2024 order", () => {
  const correction = corrections.changes.find(change => change.path.join(".") === "people.photos");
  assert.deepEqual(lab.people.photos, correction.after);
  assert.deepEqual([...lab.people.photos].reverse(), correction.before);
  assert.equal(new Set(lab.people.photos.map(photo => photo.src)).size, 3);
});

test("Tatthapong already presented, retaining finalist status, date, official source and photo", () => {
  const item = lab.news[1];
  assert.equal(item.date, "2026.11.01");
  for (const key of ["html", "text"]) {
    assert.match(item[key], /Tatthapong presented this work/);
    assert.doesNotMatch(item[key], /will present|\b(?:won|winner|first place)\b/i);
    assert.match(item[key], /was selected as a finalist/);
  }
  assert.match(item.html, /href="https:\/\/connect.informs.org\/discussion\/informs-2026-best-student-paper-competition-finalists"/);
  assert.deepEqual(item.images, ["/assets/images/qsr-2026-student-paper-finalists.jpg"]);
});

test("the grants item uses the verified department announcement and retains QSR Member Spotlight", () => {
  const item = lab.news[3];
  assert.equal(item.date, "2026.09.04");
  assert.ok(item.html.includes('<a href="' + department + '">department announcement</a>'));
  assert.ok(item.html.includes('<a href="' + spotlight + '">INFORMS QSR Member Spotlight</a>'));
  assert.match(item.text, /Read the department announcement and the INFORMS QSR Member Spotlight/);
  for (const fact of ["Principal Investigator", "approximately $1.94 million", "NIH/NIAMS R01", "NSF FDT-BioTech", "NIH/NIDCR R21"]) {
    assert.ok(item.html.includes(fact));
    assert.ok(item.text.includes(fact));
  }
});

test("News and the shared Home/CV Montague award use the owner-specified CTE link", () => {
  assert.ok(lab.news[6].html.includes('href="' + montague + '"'));
  assert.ok(lab.faculty.awards[1].html.includes('href="' + montague + '"'));
  assert.equal(lab.news[6].date, "2025.11.06");
  for (const item of [...lab.news, ...lab.faculty.awards]) {
    assert.doesNotMatch(item.html, /linkedin.com\/posts\/jaesung-lee-phd/);
  }
});

test("reversing only the exact approved correction delta restores every baseline byte without mutation", () => {
  const before = structuredClone(lab);
  assertOnlyCorrections(lab);
  assert.deepEqual(lab, before);
  assert.equal(raw, JSON.stringify(lab, null, 2) + "\n");
});

const mutations = {
  "old presentation tense": data => { data.news[1].text = data.news[1].text.replace("presented", "will present"); },
  "winner claim": data => { data.news[1].text = data.news[1].text.replace("finalist", "winner"); },
  "changed News date": data => { data.news[6].date = "2025.11.07"; },
  "duplicate News": data => data.news.push(structuredClone(data.news[1])),
  "wrong News order": data => data.news.reverse(),
  "personal source": data => { data.news[6].html = data.news[6].html.replace(montague, "https://www.linkedin.com/posts/jaesung-lee-phd"); },
  "old Montague Scholars News href": data => { data.news[6].html = data.news[6].html.replace(montague, "https://scholars.library.tamu.edu/vivo/display/n0dce822f-af71-11f0-9de4-005056bbe4f8"); },
  "old Montague Scholars faculty award href": data => { data.faculty.awards[1].html = data.faculty.awards[1].html.replace(montague, "https://scholars.library.tamu.edu/vivo/display/n0dce822f-af71-11f0-9de4-005056bbe4f8"); },
  "wrong gallery order": data => data.people.photos.reverse(),
  "duplicate gallery photo": data => { data.people.photos[1] = structuredClone(data.people.photos[0]); },
  "changed caption": data => { data.people.photos[0].caption += " Changed"; },
  "changed photo path": data => { data.people.photos[0].src += "-resized"; },
  "missing gallery photo": data => data.people.photos.pop(),
  "funding amount": data => { data.news[3].text = data.news[3].text.replace("1.94", "3.94"); },
  "removed Spotlight": data => { data.news[3].html = data.news[3].html.replace(spotlight, "https://example.invalid/"); },
  "changed faculty name": data => { data.faculty.name += " Changed"; },
  "changed publication status": data => { data.publications[0].status = "retracted"; },
  "changed research": data => { data.projects[0].title += " Changed"; },
  "changed student dates": data => { data.people.current[0].education[0].dates = "2023-2027"; },
  "removed award": data => data.faculty.awards.pop(),
};
for (const [name, mutate] of Object.entries(mutations)) {
  test("the exact correction boundary rejects " + name, () => {
    assertOnlyCorrections(lab);
    const data = structuredClone(lab);
    mutate(data);
    assert.throws(() => assertOnlyCorrections(data), /Approved News\/gallery correction|unrelated baseline content/);
  });
}

for (const route of ["/", "/news/", "/cv/", "/people/"]) {
  test(route + " renders the approved correction through the unchanged templates", () => {
    const html = createPages(site, lab, imageRenderer(path.join(root, "public"))).find(page => page.route === route).body;
    assert.doesNotMatch(html, /linkedin.com\/posts\/jaesung-lee-phd|will present this work/);
    if (route === "/" || route === "/news/") assert.match(html, /Tatthapong presented this work/);
    if (route === "/" || route === "/cv/" || route === "/news/") assert.ok(html.includes('href="' + montague + '"'));
    if (route === "/news/") assert.ok(html.includes('href="' + department + '"'));
    if (route === "/people/") {
      const figures = [...html.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/g)].map(match => match[0]);
      const photos = corrections.changes.find(change => change.path.join(".") === "people.photos").after;
      for (const [index, photo] of photos.entries()) {
        assert.ok(figures[index].includes('src="' + photo.src + '" alt="' + photo.caption + '"'));
      }
      assert.match(html, /aria-label="Lab photos"/);
      assert.match(html, /aria-controls="lab-photos"/);
    }
  });
}

test("the 2025 QSR finalist links the named official finalist announcement, not the generic awards page", () => {
  const item = lab.news.find(item => item.date === "2025.10.27");
  assert.ok(item.html.includes('<a href="https://connect.informs.org/discussion/qsr-best-referred-paper-competition-finalists">QSR Best Refereed Paper Competition</a>'));
  assert.doesNotMatch(item.html, /href="https:\/\/connect.informs.org\/qsr\/awards"/);
  assert.match(item.text, /selected as a finalist/);
  assert.doesNotMatch(item.text, /\b(?:won|winner)\b/i);
});

for (const change of corrections.changes) {
  test("the correction guard rejects a reverted or missing approved field: " + change.path.join("."), () => {
    assertOnlyCorrections(lab);
    for (const missing of [false, true]) {
      const data = structuredClone(lab);
      const parent = change.path.slice(0, -1).reduce((value, key) => value[key], data);
      if (missing) delete parent[change.path.at(-1)];
      else parent[change.path.at(-1)] = structuredClone(change.before);
      assert.throws(() => assertOnlyCorrections(data), /Approved News\/gallery correction/);
    }
  });
}
