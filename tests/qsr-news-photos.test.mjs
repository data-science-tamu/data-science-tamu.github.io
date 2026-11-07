import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createPages } from "../src/templates.mjs";
import { dimensions, imageRenderer } from "../src/helpers.mjs";
import { normalizeCorrectionsForBaseline } from "./correction-expectations.mjs";
import { newsPhotos, normalizeNewsPhotosForBaseline } from "./news-photo-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const labText = fs.readFileSync(path.join(root, "content/lab.json"), "utf8");
const lab = JSON.parse(labText);
const site = JSON.parse(fs.readFileSync(path.join(root, "content/site.json"), "utf8"));
const sha256 = value => createHash("sha256").update(value).digest("hex");
// Derived from git show 7283fba9e4b3c2bcbc1e19176dc9acc8bbfea041:content/lab.json.
const baselineSha256 = "7a9d4773bfa1076b945794108525786a09b06339801f8050845d2e8361adbc15";
const baselineRawSha256 = "24fee95e38d6bc0dc04fd09cfaf00a71e99c7a6d79299aace6e5b80a3911439a";

function assertOnlyNewsPhotos(data) {
  const baseline = normalizeCorrectionsForBaseline(data);
  baseline.news = normalizeNewsPhotosForBaseline(baseline.news);
  assert.equal(sha256(JSON.stringify(baseline)), baselineSha256,
    "The entire prior lab JSON baseline is restored after only the three approved photo additions");
  return baseline;
}

test("only the three approved photo additions restore every baseline JSON value and original file byte", () => {
  const before = structuredClone(lab);
  const baseline = assertOnlyNewsPhotos(lab);
  assert.deepEqual(lab, before, "Photo normalization does not mutate maintained content");
  assert.equal(labText, JSON.stringify(lab, null, 2) + "\n", "No unrelated formatting changes");
  assert.equal(sha256(JSON.stringify(baseline, null, 2) + "\n"), baselineRawSha256);
  assert.equal(lab.news.length, 18);
});

for (const photo of newsPhotos) {
  test(photo.source + " maps only to " + photo.date + " with exact original bytes and dimensions", () => {
    const item = lab.news.find(item => item.date === photo.date);
    assert.deepEqual(item.images, [...photo.before, photo.src]);
    const file = path.join(root, "public", photo.src);
    assert.ok(fs.existsSync(file), "The approved original photo exists at its mapped public path");
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.length, photo.bytes);
    assert.equal(sha256(bytes), photo.sha256);
    assert.deepEqual(dimensions(file), { width: photo.width, height: photo.height });
  });
}

const mutations = {
  "missing images array": data => { delete data.news[2].images; },
  "missing Council photo": data => data.news[0].images.pop(),
  "missing finalist photo": data => data.news[1].images.pop(),
  "missing webinar speakers photo": data => data.news[2].images.pop(),
  "swapped Council/finalist photos": data => {
    [data.news[0].images, data.news[1].images] = [data.news[1].images, data.news[0].images];
  },
  "reversed webinar photos": data => data.news[2].images.reverse(),
  "missing acknowledgement": data => data.news[2].images.shift(),
  "duplicate photo": data => data.news[0].images.push(newsPhotos[0].src),
  "photo copied to unrelated News": data => data.news[3].images.push(newsPhotos[0].src),
  "unapproved photo": data => data.news[1].images.push("/assets/images/qsr-2026-acknowledgement.jpg"),
  "restored inline flyer": data => data.news[2].images.unshift("/assets/images/qsr-webinar-2026-10-21-flyer.jpg"),
  "unrelated News text": data => { data.news[4].text += " Changed."; },
  "unrelated faculty text": data => { data.faculty.name += " Changed."; },
  "inferred election day": data => { data.news[0].date = "2026.11.02"; },
};
for (const [name, mutate] of Object.entries(mutations)) {
  test("the exact three-photo baseline guard rejects " + name, () => {
    assertOnlyNewsPhotos(lab);
    const data = structuredClone(lab);
    mutate(data);
    assert.throws(() => assertOnlyNewsPhotos(data), /photo delta|entire prior lab JSON baseline|Approved News\/gallery correction/);
  });
}

for (const route of ["/news/", "/"]) {
  test(route + " keeps each photo on its matching News only and Home summaries photo-free", () => {
    const pages = createPages(site, lab, imageRenderer(path.join(root, "public")));
    const body = pages.find(page => page.route === route).body;
    const articles = [...body.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
    assert.equal(articles.length, route === "/" ? 3 : 18);
    for (const [index, photo] of newsPhotos.entries()) {
      const article = articles[index];
      assert.ok(article.includes("<p>" + lab.news[index].html + "</p>"));
      const images = [...article.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
      assert.deepEqual(images.map(image => image.match(/\bsrc="([^"]+)"/)[1]),
        route === "/news/" ? [...photo.before, photo.src] : []);
      if (route === "/news/") {
        assert.equal(body.split("src=\"" + photo.src + "\"").length - 1, 1);
        const image = images.at(-1);
        assert.ok(image.includes("width=\"1536\" height=\"1152\""));
        assert.ok(image.includes("style=\"--image-width: 1536px\""));
        assert.match(image, /alt="[^"]+"/);
        assert.match(image, /loading="lazy" decoding="async"/);
        assert.ok(article.includes("<a href=\"" + photo.src + "\" aria-label=\"View full-size photo " +
          (photo.before.length + 1) + " for news dated " + photo.date + "\">"));
      } else {
        assert.ok(!body.includes(photo.src), "The supplied photo is absent from the entire Home page");
        assert.doesNotMatch(article, /<img\b|news-photos/);
      }
    }
  });
}

test("all other rendered pages remain exactly unchanged by the historical photo additions", () => {
  const baseline = assertOnlyNewsPhotos(lab);
  const oldPages = createPages(site, baseline, imageRenderer(path.join(root, "public")));
  const pages = createPages(site, normalizeCorrectionsForBaseline(lab), imageRenderer(path.join(root, "public")));
  assert.deepEqual(pages.filter(page => page.route !== "/news/"),
    oldPages.filter(page => page.route !== "/news/"));
});
