import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createPages } from "../src/templates.mjs";
import { imageRenderer } from "../src/helpers.mjs";
import { assertNewsBaseline } from "./source-baseline.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const lab = JSON.parse(read("content/lab.json"));
const announcement = "https://connect.informs.org/discussion/informs-2026-best-student-paper-competition-finalists";
const competition = "2026 INFORMS QSR Best Student Paper Competition";
const approvedText = "Ph.D. student Tatthapong Srikitrungruang was selected as a finalist in the 2026 INFORMS QSR Best Student Paper Competition. Tatthapong will present this work at the 2026 INFORMS Annual Meeting in San Francisco. Congratulations, Tatthapong!";
const approvedHtml = approvedText.replace(competition, `<a href="${announcement}">${competition}</a>`);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

test("one newest Tatthapong finalist item uses only the approved wording and official link", () => {
  const matches = lab.news.filter((item) => item.html.includes(announcement) ||
    (item.text.includes("Tatthapong") && item.text.includes(competition)));
  assert.equal(matches.length, 1, "Exactly one Tatthapong QSR finalist announcement");
  assert.equal(lab.news[0], matches[0], "Prepend the scheduled presentation announcement");
  assert.deepEqual(matches[0], {
    date: "2026.11.01",
    html: approvedHtml,
    text: approvedText,
    images: [],
  });
  assert.match(matches[0].text, /was selected as a finalist/);
  assert.match(matches[0].text, /will present this work/);
  assert.doesNotMatch(matches[0].text, /\b(?:won|winner|ranked|first place|accepted|published|presented)\b/i);
});

test("the immutable capture and every prior news record, including Sina's, remain preserved", () => {
  assertNewsBaseline(lab.news);
  // Pin the original capture bytes and maintained source records before this addition.
  assert.equal(sha256(read("content/source/news.json")),
    "595176b2327d6f59bdb336431e89b6d181ca0075617beeea32ae86c1b81bfb55");
  const historical = lab.news.filter((item) => Object.hasOwn(item, "sourceSection"));
  assert.equal(sha256(JSON.stringify(historical)),
    "f807d45cde099edce0e7a7644d4395b8cb600249a484508eeb4ee579a6532434");
});

for (const route of ["/news/", "/"]) {
  test(`${route} renders the finalist first with a semantic presentation date and the expected news coverage`, () => {
    const html = createPages(
      JSON.parse(read("content/site.json")), lab, imageRenderer(path.join(root, "public")),
    ).find((page) => page.route === route).body;
    const articles = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map((match) => match[0]);
    assert.ok(articles[0].includes(`<p>${approvedHtml}</p>`));
    assert.match(articles[0], /<time datetime="2026-11-01">2026\.11\.01<\/time>/);
    assert.doesNotMatch(articles[0], /<img\b|news-photos/);
    assert.equal(html.split(`<a href="${announcement}">`).length - 1, 1);
    const expected = route === "/" ? lab.news.slice(0, 3) : lab.news;
    assert.equal(articles.length, expected.length);
    assert.deepEqual(articles.map((article) => article.match(/<time datetime="([^"]+)"/)[1]),
      expected.map((item) => item.date.replaceAll(".", "-")));
    if (route === "/news/") assert.match(articles[0], /id="news-2026-11-01"/);
  });
}
