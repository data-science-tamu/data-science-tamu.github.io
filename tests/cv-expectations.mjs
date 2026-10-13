import assert from "node:assert/strict";
import fs from "node:fs";

const fixture = JSON.parse(fs.readFileSync(
  new URL("./fixtures/cv-publications.json", import.meta.url), "utf8",
));
export const approved = fixture.records;
export const captured = fixture.capturedRecords;

// Independent, public-only expectations transcribed before implementation.
export function assertApprovedPublications(records) {
  for (const expected of approved) {
    const matches = records.filter((p) => p.id === expected.id);
    assert.equal(matches.length, 1, `${expected.id}: public CV record coverage`);
    for (const [key, value] of Object.entries(expected))
      assert.deepEqual(matches[0][key], value, `${expected.id}: approved ${key}`);
  }
}
