import assert from "node:assert/strict";
import fs from "node:fs";
const source = (file) =>
  JSON.parse(
    fs.readFileSync(
      new URL("../content/source/" + file, import.meta.url),
      "utf8",
    ),
  );
const ids = [
  ...source("publication.json").sections[1].text.matchAll(/\[([JC]\d+\*?)\]/g),
].map((m) => m[1]);
const dates = [
  ...source("news.json")
    .sections.map((s) => s.text)
    .join(" ")
    .matchAll(/\d{4}\.\d{2}\.\d{2}/g),
].map((m) => m[0]);
// Keep the immutable migration baseline, while allowing newly maintained records.
export function assertPublicationBaseline(publications) {
  const captured = publications.filter((p) => ids.includes(p.id));
  assert.deepEqual(
    captured.map((p) => p.id),
    ids,
  );
  assert.equal(captured.filter((p) => p.type === "review").length, 2);
  assert.equal(captured.filter((p) => p.type === "conference").length, 4);
}
export function assertNewsBaseline(news) {
  assert.deepEqual(
    news.filter((n) => dates.includes(n.date)).map((n) => n.date),
    dates,
  );
}
