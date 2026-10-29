import assert from "node:assert/strict";

// Owner-confirmed correction; the exact day is an inert author note only.
export const presentationCorrection = {
  date: "2025",
  _comment: "Competition date: October 16, 2025.",
  html: "Tatthapong received second place in the ISEN Best Presentation Competition organized by the INFORMS Student Chapter at Texas A&amp;M University.",
  text: "Tatthapong received second place in the ISEN Best Presentation Competition organized by the INFORMS Student Chapter at Texas A&M University.",
  images: [
    "/assets/images/news-1-c0718d6e5d.jpg",
    "/assets/images/news-2-24d8363a27.jpg",
  ],
  sourceSection: 3,
};

export function assertPresentationCorrection(news) {
  const matches = news.filter((item) => item.sourceSection === 3 ||
    item.text === presentationCorrection.text || item.html === presentationCorrection.html);
  assert.equal(matches.length, 1, "Exactly one ISEN second-place presentation record");
  const item = matches[0], index = news.indexOf(item);
  assert.deepEqual(item, presentationCorrection, "Only the approved year and author note change");
  assert.equal(news[index - 1]?.date, "2025.10.27", "Presentation follows October 27, 2025");
  assert.equal(news[index + 1]?.date, "2025.09.19", "Presentation precedes September 19, 2025");
  return item;
}

export function normalizePresentationForBaseline(news) {
  // Validate before normalization so missing/duplicate/incorrect corrections fail.
  const corrected = assertPresentationCorrection(news);
  const normalized = news.filter((item) => item !== corrected);
  const originalNext = normalized.findIndex((item) =>
    item.date === "2026.03.23" && item.sourceSection === 5);
  assert.notEqual(originalNext, -1, "Original migration insertion point remains present");
  const { _comment, ...original } = corrected;
  // Restore only this record's migration date/position for the unchanged baselines.
  normalized.splice(originalNext, 0, { ...original, date: "2026.03.26" });
  return normalized;
}
