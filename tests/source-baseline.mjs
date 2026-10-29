import assert from "node:assert/strict";
import fs from "node:fs";
import { anchor } from "../src/helpers.mjs";
import { captured as originalRecords } from "./cv-expectations.mjs";
import { normalizePresentationForBaseline } from "./news-expectations.mjs";
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
  for (const id of ids) {
    const matches = publications.filter((p) => p.id === id || p.legacyAnchors?.includes(anchor(id)));
    assert.equal(matches.length, 1, `${id}: captured record and fragment coverage`);
    const original = originalRecords.find((p) => p.id === id);
    assert.equal(matches[0].type, id === "J15*" ? "journal" : original.type,
      `${id}: captured category or approved Manufacturing Letters promotion`);
  }
}
export function assertNewsBaseline(news) {
  assert.deepEqual(
    normalizePresentationForBaseline(news).filter((n) => dates.includes(n.date)).map((n) => n.date),
    dates,
  );
}
