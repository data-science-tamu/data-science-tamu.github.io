import assert from "node:assert/strict";
import { escape } from "../src/helpers.mjs";

export const capturedPartners = [
  {
    text: "My research group has been working with industry collaborators and supported by multiple institutions:",
    html: "My research group has been working with industry collaborators and supported by multiple institutions:",
  },
  {
    text: "Industrial Research Collaborators: - EOS North America, 3Degrees",
    html: "Industrial Research Collaborators: <br>- EOS North America, 3Degrees",
  },
  {
    text: "Funding Partners:- NSF, NIH, LIFT, U.S. Department of War/Defense, TAMIDS, Crider Foods",
    html: "Funding Partners:<br>- NSF, NIH, LIFT, U.S. Department of War/Defense, TAMIDS, Crider Foods",
  },
];
export const approvedPartners = {
  introduction: capturedPartners[0],
  groups: [
    { title: "Industrial Research Collaborators", items: ["EOS North America", "3Degrees"] },
    { title: "Funding Partners", items: [
      "U.S. National Science Foundation (NSF)",
      "National Institutes of Health (NIH)",
      "Lightweight Innovations for Tomorrow (LIFT)",
      "U.S. Department of War/Defense",
      "Texas A&M Institute of Data Science (TAMIDS)",
      "Crider Foods",
    ] },
  ],
};

// Reverse this exact partner delta only; all prior provenance guards still run.
export function normalizePartnersForBaseline(lab) {
  const data = structuredClone(lab);
  assert.deepEqual(data.faculty.partners, approvedPartners, "Exact approved structured partner groups");
  data.faculty.partners = structuredClone(capturedPartners);
  return data;
}

export function assertPartnerGroupCoverage(main, index) {
  const group = approvedPartners.groups[index];
  const expected = '<h3>' + escape(group.title) + '</h3><ul class="partner-list">' +
    group.items.map((item) => '<li>' + escape(item) + '</li>').join('') + '</ul>';
  assert.equal(main.split(expected).length - 1, 1, 'home partners: exact ' + group.title + ' membership and order');
}

export const approvedPast = [
  {
    title: "Master's Students", label: "Past Students",
    names: [
      "Noor S. Obeidat (Graduated, 2025 Fall); Outstanding Master of Science Thesis Student Award, 2025.",
      "Shu Nee Khor (2023 Nov- 2024 January), Student Intern",
    ],
  },
  {
    title: "Undergraduate Students", label: "Past Students",
    names: [
      "Matthew Lemon (2024 Sep-2025 June)",
      "Gabriel Gonzalez (2024 Sep-2025 June); admitted to an M.S. program at Harvard University.",
      "Anna Hartman (2023 May-July), REU Program (Research Experiences for Undergraduates)",
    ],
  },
];
const inlineRoles = [
  { group: 0, row: 1, title: "Student Intern", original: "Shu Nee Khor (2023 Nov- 2024 January)" },
  { group: 1, row: 2, title: "REU Program (Research Experiences for Undergraduates)", original: "Anna Hartman (2023 May-July)" },
];
export const capturedPastRoleParagraphs = inlineRoles.flatMap(({ title, original }) => [title, original]);
const restorePastRoles = (past) => inlineRoles.flatMap(({ group, row, title, original }) => [
  { ...past[group], names: past[group].names.slice(0, row) },
  { title, names: [original] },
]);
const pastRosterHtml = (past) => '<div class="past-members people-roster">' + past.map((group) =>
  '<section><h3>' + escape(group.title) + '</h3><ul class="student-roster">' +
  group.names.map((name) => '<li>' + escape(name) + '</li>').join('') + '</ul></section>').join('') + '</div>';

// Restore only the moved rows; prior name/claim fields keep their original guards.
export function normalizePastRosterForBaseline(lab) {
  const data = structuredClone(lab), past = data.people.past;
  const message = "Exact approved inline past roster";
  assert.equal(past.length, 2, message);
  for (const { group, row } of inlineRoles) {
    assert.equal(past[group].names.length, row + 1, message);
    assert.equal(past[group].names[row], approvedPast[group].names[row], message);
  }
  data.people.past = restorePastRoles(past);
  return data;
}

export function normalizePastRosterRaw(raw) {
  const data = JSON.parse(raw);
  assert.equal(raw, JSON.stringify(data, null, 2) + '\n', "Canonical JSON formatting remains exact");
  return JSON.stringify(normalizePastRosterForBaseline(data), null, 2) + '\n';
}

export const normalizePastRosterHtml = (html) => html.replace(pastRosterHtml(approvedPast), pastRosterHtml(restorePastRoles(approvedPast)));

export function assertPastRosterCoverage(main) {
  const expected = pastRosterHtml(approvedPast);
  assert.equal(main.split(expected).length - 1, 1, 'people roster: exact two categories, inline roles, dates, claims and order');
  for (const group of approvedPast) for (const name of group.names)
    assert.equal(main.split(escape(name)).length - 1, 1, 'people roster: unique ' + name);
}
