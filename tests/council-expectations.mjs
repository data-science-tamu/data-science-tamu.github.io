import assert from "node:assert/strict";

const organization = "INFORMS Quality, Statistics, and Reliability (QSR) Section";
const text = "Dr. Lee was elected as a Council Member of the " + organization + " for the 2026\u20132028 term.";
export const councilNews = {
  date: "2026",
  html: text.replace(organization, '<a href="https://connect.informs.org/qsr/officers">' + organization + "</a>"),
  text,
  images: [],
  sourceSection: null,
};

// Validate the exact owner-approved addition before historic baseline comparisons.
export function normalizeCouncilNewsForBaseline(news) {
  const matches = news.filter(item => item.date === councilNews.date ||
    /Council Member|connect\.informs\.org\/qsr\/officers/.test(JSON.stringify(item)));
  assert.equal(matches.length, 1, "Exactly one approved Council News record");
  assert.equal(news[0], matches[0], "Council News is the single newest owner-provided update");
  assert.deepEqual(news[0], councilNews, "Council News has only the exact approved fields and year-only date");
  return news.slice(1);
}
