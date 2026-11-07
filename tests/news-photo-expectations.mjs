import assert from "node:assert/strict";

export const newsPhotos = [
  {
    date: "2026",
    source: "img_e342af444ecc.jpeg",
    src: "/assets/images/qsr-2026-council-election.jpg",
    before: [],
    bytes: 147722,
    sha256: "cc083b7ca14b1ad6abb7e3eced8c58db82fa92053fd8ee3a9871191955c51405",
    width: 1536,
    height: 1152,
  },
  {
    date: "2026.11.01",
    source: "img_13780f6e66c5.jpeg",
    src: "/assets/images/qsr-2026-student-paper-finalists.jpg",
    before: [],
    bytes: 186414,
    sha256: "3d2a878d5c3b295d1109f921449ff7d2223a4f8f6ba918406c06e247e0e4e21b",
    width: 1536,
    height: 1152,
  },
  {
    date: "2026.10.21",
    source: "img_90a06d9956a6.jpeg",
    src: "/assets/images/qsr-2026-webinar-speakers.jpg",
    before: ["/assets/images/qsr-2026-acknowledgement.jpg"],
    bytes: 151782,
    sha256: "6a9b0da8c58b17de284a247de125c97d8383c7b51dc937eddf0ee0ce24cb126b",
    width: 1536,
    height: 1152,
  },
];

// Validate the complete approved photo delta before restoring earlier News baselines.
export function normalizeNewsPhotosForBaseline(news) {
  for (const item of news) {
    assert.ok(Array.isArray(item.images), "Council/Tatthapong/webinar photo delta: each News record has an images array");
  }
  const baseline = structuredClone(news);
  for (const [index, photo] of newsPhotos.entries()) {
    const message = "Council/Tatthapong/webinar photo delta: " + photo.date;
    const matches = news.filter(item => item.date === photo.date);
    assert.equal(matches.length, 1, message + " has exactly one News record");
    assert.equal(news[index], matches[0], message + " remains at its original position");
    assert.deepEqual(matches[0].images, [...photo.before, photo.src], message + " has only its approved ordered photos");
    assert.deepEqual(news.filter(item => item.images.includes(photo.src)), [matches[0]],
      message + " photo appears only in its matching News record");
    baseline[index].images = structuredClone(photo.before);
  }
  return baseline;
}
