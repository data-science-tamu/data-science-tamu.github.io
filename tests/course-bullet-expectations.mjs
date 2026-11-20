import assert from "node:assert/strict";
import fs from "node:fs";
import { awardItemHtml, montagueParent, montagueDetail } from "./award-detail-expectations.mjs";

const refresh = JSON.parse(fs.readFileSync(new URL("./fixtures/cv-news-refresh.json", import.meta.url), "utf8"));
export const flatCourses = refresh.changes.find((change) => change.path.join(".") === "faculty.courses").after;
export const courseParent = flatCourses[2], courseDetail = flatCourses[3];
export const approvedCourses = [...flatCourses.slice(0, 2), { ...courseParent, details: [courseDetail] }];
export const approvedAwards = refresh.changes.find((change) => change.path.join(".") === "faculty.awards").after
  .filter((award) => award.text !== montagueDetail.text)
  .map((award) => award.text === montagueParent.text ? { ...montagueParent, details: [montagueDetail] } : award);
const sectionHtml = (title, items, bulleted) => '<section class="section split-section"><div class="section-heading"><h2>' + title + '</h2></div><div><ul' +
  (bulleted ? '' : ' class="clean-list"') + '>' + items.map(awardItemHtml).join('') + '</ul></div></section>';
export const teachingHtml = (courses = approvedCourses) => sectionHtml("Courses taught", courses, true);
export const historicalTeachingHtml = sectionHtml("Courses taught", flatCourses, false);
export const cvAwardsHtml = sectionHtml("Awards and Honors", approvedAwards, true);
export const historicalCvAwardsHtml = sectionHtml("Awards and Honors", approvedAwards, false);

// Match the entire approved section so unrelated changes still fail old hashes.
export function normalizeCourseBulletsHtml(html, route = "/") {
  const result = html.replace(teachingHtml(), historicalTeachingHtml);
  return route === "/cv/" ? result.replace(cvAwardsHtml, historicalCvAwardsHtml) : result;
}

export function normalizeCourseDetailsForBaseline(lab) {
  const data = structuredClone(lab);
  const matches = data.faculty.courses.filter((course) => course.text === courseParent.text);
  const message = "Course detail correction: exact approved nesting";
  assert.equal(matches.length, 1, message);
  const course = matches[0];
  const { details, ...parent } = course;
  assert.deepEqual(details, [courseDetail], message);
  // Keep parent fields intact for the existing exact-field provenance guard.
  data.faculty.courses.splice(data.faculty.courses.indexOf(course), 1, parent, ...details);
  return data;
}

export function normalizeCourseDetailsRaw(raw) {
  const data = JSON.parse(raw);
  assert.equal(raw, JSON.stringify(data, null, 2) + '\n', "Canonical JSON formatting remains exact");
  return JSON.stringify(normalizeCourseDetailsForBaseline(data), null, 2) + '\n';
}
