import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createPages } from "../src/templates.mjs";
import { dimensions, imageRenderer } from "../src/helpers.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const lab = JSON.parse(read("content/lab.json"));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const prior = [
  { src: "/assets/images/people-1-c060cdafd7.jpg", caption: "INFORMS Annual Meeting 2024 (Seattle, WA)" },
  { src: "/assets/images/people-2-c9f2346674.jpg", caption: "INFORMS Annual Meeting 2025 (Atlanta, GA)" },
];
const approved = {
  src: "/assets/images/informs-2026-san-francisco.jpg",
  caption: "INFORMS Annual Meeting 2026 (San Francisco, CA)",
};

test("one approved INFORMS 2026 photo follows the unchanged 2024 and 2025 records", () => {
  assert.deepEqual(lab.people.photos, [...prior, approved]);
});

test("all other lab content and prior photo bytes remain exact", () => {
  const baseline = structuredClone(lab);
  baseline.people.photos = baseline.people.photos.slice(0, 2);
  assert.equal(sha256(JSON.stringify(baseline)), "76b3380da37c4424c312058748367bdbf3aa74209f63d7c86dab20e45417a1c7");
  const assets = [{"src":"/assets/images/people-1-c060cdafd7.jpg","sha256":"c060cdafd7c2c8cc2eeb132a2fcb994c8c8ff3309b51fa30b7c7c836a5033b9d"},{"src":"/assets/images/people-2-c9f2346674.jpg","sha256":"c9f234667493e6983e7e334a75ab7d41b15d43c4754c1150455092b2a9a91d6c"}];
  for (const asset of assets) {
    assert.equal(sha256(fs.readFileSync(path.join(root, "public", asset.src))), asset.sha256);
  }
});

test("the new JPEG retains the supplied original bytes and native dimensions", () => {
  const file = path.join(root, "public", approved.src);
  assert.ok(fs.existsSync(file), "The supplied original JPEG must be copied to the public asset path");
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.length, 1040397);
  assert.equal(sha256(bytes), "77138f39611d0e0e0bfa44d12e1736a96a1518b14f7b9ae0e73bdd33ad0f4fcc");
  assert.deepEqual(dimensions(file), { width: 6560, height: 4928 });
});

test("the existing People renderer emits ordered semantic figures with matching captions and alt text", () => {
  const html = createPages(
    JSON.parse(read("content/site.json")), lab, imageRenderer(path.join(root, "public")),
  ).find((page) => page.route === "/people/").body;
  const gallery = html.match(/<div class="photo-grid">([\s\S]*?)<\/div>/);
  assert.ok(gallery, "People retains its Lab photos gallery");
  const figures = [...gallery[1].matchAll(/<figure>([\s\S]*?)<\/figure>/g)].map((match) => match[1]);
  assert.equal(figures.length, 3);
  for (const [index, photo] of [...prior, approved].entries()) {
    assert.ok(figures[index].includes(`src="${photo.src}" alt="${photo.caption}"`));
    assert.ok(figures[index].includes(`<figcaption>${photo.caption}</figcaption>`));
  }
  assert.match(figures[2], /width="6560" height="4928"/);
  assert.match(figures[2], /loading="lazy"/);
});
