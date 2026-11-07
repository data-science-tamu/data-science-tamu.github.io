import assert from "node:assert/strict";
import fs from "node:fs";

export const corrections = JSON.parse(fs.readFileSync(new URL("./fixtures/news-source-corrections.json", import.meta.url), "utf8"));

function restoreApprovedChanges(data, changes) {
  const restored = structuredClone(data);
  for (const change of changes) {
    const parent = change.path.slice(0, -1).reduce((value, key) => value?.[key], restored);
    const key = change.path.at(-1), message = "Approved News/gallery correction: " + change.path.join(".");
    assert.ok(parent && Object.hasOwn(parent, key), message + " must exist");
    assert.deepEqual(parent[key], change.after, message + " must match exactly before restoration");
    parent[key] = structuredClone(change.before);
  }
  return restored;
}

export function normalizeCorrectionsForBaseline(lab) {
  return restoreApprovedChanges(lab, corrections.changes);
}

export function normalizeNonNewsCorrectionsForBaseline(lab) {
  return restoreApprovedChanges(lab, corrections.changes.filter(change => change.path[0] !== "news"));
}

export function normalizeNewsCorrectionsForBaseline(news) {
  return restoreApprovedChanges({ news }, corrections.changes.filter(change => change.path[0] === "news")).news;
}

// Existing release fixtures stay immutable; rendered expectations use only this explicit delta.
export function correctedNewsExpectation(record) {
  const result = structuredClone(record);
  for (const change of corrections.changes.filter(change => change.path[0] === "news")) {
    const key = change.path.at(-1);
    if (result[key] === change.before) result[key] = change.after;
  }
  return result;
}
