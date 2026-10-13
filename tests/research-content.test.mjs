import test from "node:test";
import assert from "node:assert/strict";

test("presentation uses only explicit metadata, not citation-like prose or venue names", async () => {
  const { researchContent } = await import("../src/research-content.mjs");
  const records = new Set(["C91"]);
  const items = [
    {html: "Goal: unchanged prose"},
    {html: "Goal: Explicitly labeled", label: "Goal:"},
    {html: "An independent venue and year", kind: "citation", recordId: "C91", notes: [{html: "An explicit explanatory note"}]},
  ];
  const html = researchContent(items, records);
  assert.ok(html.includes("<p>Goal: unchanged prose</p>"));
  assert.ok(html.includes("<strong>Goal:</strong> Explicitly labeled"));
  assert.ok(html.includes('<h4>Publications</h4><ul class="research-publications"><li><p>An independent venue and year</p>'));
  assert.ok(html.includes('href="/publication/#C91"'));
  assert.ok(html.includes('<ul class="citation-notes"><li>An explicit explanatory note</li></ul></li>'));
});

test("invalid research presentation fails closed before rendering misleading hierarchy", async () => {
  const { researchContent } = await import("../src/research-content.mjs");
  for (const items of [
    [{html: "Unlabeled", label: "Goal:"}],
    [{html: "Text", kind: "unknown"}],
    [{html: "Citation", kind: "citation", recordId: "J99"}],
    [{html: "Text", notes: [{html: "Orphan note"}]}],
    [{html: "List", kind: "list", items: []}],
    [{html: "Other publications", kind: "publication-heading"}],
  ]) assert.throws(() => researchContent(items, new Set(["J1"])), /Invalid research/);
});
