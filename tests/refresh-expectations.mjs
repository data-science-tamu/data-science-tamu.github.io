import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";

export const refresh = JSON.parse(fs.readFileSync(new URL("./fixtures/cv-news-refresh.json", import.meta.url), "utf8"));
const sha256 = value => createHash("sha256").update(value).digest("hex");
const parentAt = (data, keys) => keys.slice(0, -1).reduce((value, key) => value[key], data);

function restoreChanges(data, changes) {
  for (const change of changes) {
    const parent = parentAt(data, change.path), key = change.path.at(-1);
    assert.ok(Object.hasOwn(parent, key), change.path.join(".") + ": approved field must exist");
    assert.deepEqual(parent[key], change.after, change.path.join(".") + ": exact approved value before baseline restoration");
    if (Object.hasOwn(change, "before")) parent[key] = structuredClone(change.before);
    else delete parent[key];
  }
}

// Validate every changed field before reversing only the approved delta.
export function normalizeRefreshNewsForBaseline(news) {
  const data = {news: structuredClone(news)}, addition = refresh.newsAddition;
  const matches = data.news.filter(item => item.date === addition.record.date);
  assert.equal(matches.length, 1, "Exactly one combined grant/spotlight announcement");
  assert.deepEqual(data.news[addition.index], addition.record, "Exact new record at its approved position");
  data.news.splice(addition.index, 1);
  restoreChanges(data, refresh.changes.filter(change => change.path[0] === "news"));
  return data.news;
}

export function normalizeRefreshForBaseline(lab) {
  const data = structuredClone(lab);
  data.news = normalizeRefreshNewsForBaseline(data.news);
  restoreChanges(data, refresh.changes.filter(change => change.path[0] !== "news"));
  assert.equal(sha256(JSON.stringify(data)), refresh.baselineSha256,
    "All data outside the exact approved refresh remain byte-equivalent in the original JSON baseline");
  return data;
}

export function approvedParagraphText(page, text, normalize) {
  const correction = refresh.paragraphCorrections.find(item =>
    item.page === page && normalize(item.before) === normalize(text));
  return correction ? correction.after : text;
}
