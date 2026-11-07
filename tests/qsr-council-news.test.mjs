import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createPages } from "../src/templates.mjs";
import { imageRenderer, rich } from "../src/helpers.mjs";
import { councilNews, normalizeCouncilNewsForBaseline } from "./council-expectations.mjs";
import { normalizeCorrectionsForBaseline, correctedNewsExpectation } from "./correction-expectations.mjs";
import { refresh } from "./refresh-expectations.mjs";
import { newsPhotos, normalizeNewsPhotosForBaseline } from "./news-photo-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const labText = read("content/lab.json");
const lab = JSON.parse(labText);
const sha256 = value => createHash("sha256").update(value).digest("hex");
// Derived with git show cc0dcde566793840b2fd4dd1ffe24205eaa0a9ad:content/lab.json.
const baselineSha256 = "68890819fb07c90d170f4b8beb933d9157935f4fc914e1dba6276d386d0d272d";
const baselineRawSha256 = "24d1e54be21a22437786e168d1f92edaa5ac0ca39ff5e3d28e1bb3698c408ad2";
const baselineNewsSha256 = "b2ad4aa9da9ff4231b36b516016d6dd8ed8114079cd129d3cac1118923efa4d1";

function assertOnlyCouncilAddition(data) {
  const baseline = normalizeCorrectionsForBaseline(data);
  baseline.news = normalizeCouncilNewsForBaseline(baseline.news);
  assert.equal(sha256(JSON.stringify(baseline)), baselineSha256,
    "The entire prior lab JSON baseline remains exact after removing only the approved Council entry");
}

test("one newest Council News record states only the owner-confirmed election and CV term", () => {
  normalizeCouncilNewsForBaseline(lab.news);
  assert.equal(lab.news.length, 18);
  assert.deepEqual(lab.news[0], { ...councilNews, images: [newsPhotos[0].src] });
  assert.equal(rich(lab.news[0].html).replace(/<[^>]*>/g, ""), lab.news[0].text);
  assert.equal(lab.faculty.service.filter(item => item ===
    "Elected Council Member, INFORMS Quality, Statistics, and Reliability (QSR) Section, 2026\u20132028").length, 1);
  assert.ok(lab.faculty.awards.every(item => !/Council Member/.test(item.text)));
});

test("removing only the approved Council addition restores the entire git-show baseline JSON hash", () => {
  assertOnlyCouncilAddition(lab);
});

test("all 17 prior News records retain their exact bytes, order and non-News data", () => {
  const before = structuredClone(lab.news);
  const restored = normalizeCorrectionsForBaseline(lab);
  const historical = normalizeCouncilNewsForBaseline(restored.news);
  assert.deepEqual(lab.news, before, "The test-only normalizer never mutates maintained News");
  assert.equal(historical.length, 17);
  assert.equal(sha256(JSON.stringify(historical)), baselineNewsSha256);
  assert.deepEqual(historical, normalizeNewsPhotosForBaseline(restored.news).slice(1));
  const normalizedText = JSON.stringify({ ...restored, news: normalizeNewsPhotosForBaseline(restored.news) }, null, 2) + "\n";
  const block = JSON.stringify(councilNews, null, 2).split("\n")
    .map(line => "    " + line).join("\n") + ",\n";
  const prefix = '  "news": [\n';
  assert.ok(normalizedText.includes(prefix + block), "Only the approved block is prepended after reversing the photo delta");
  assert.equal(sha256(normalizedText.replace(prefix + block, prefix)), baselineRawSha256,
    "Removing the exact new block restores every prior file byte, not just JSON values");
});

const councilMutations = {
  missing: news => news.shift(),
  duplicate: news => news.push(structuredClone(news[0])),
  "wrong year": news => { news[0].date = "2027"; },
  "invented election day": news => { news[0].date = "2026.11.02"; },
  "numeric year": news => { news[0].date = 2026; },
  "wrong position": news => news.splice(1, 0, ...news.splice(0, 1)),
  "changed text": news => { news[0].text += " Changed."; },
  "changed HTML": news => { news[0].html += " Changed."; },
  "wrong term": news => { news[0].text = news[0].text.replace("2028", "2029"); },
  "wrong organization link": news => { news[0].html = news[0].html.replace("/qsr/officers", "/qsr/awards"); },
  "election-announcement claim": news => { news[0].html += " Official election announcement."; },
  image: news => news[0].images.push("/assets/images/qsr-2026-acknowledgement.jpg"),
  "missing images": news => { delete news[0].images; },
  "wrong source section": news => { news[0].sourceSection = 8; },
  "missing source section": news => { delete news[0].sourceSection; },
  "invented author-note day": news => { news[0]._comment = "Election date: November 2, 2026."; },
  "extra field": news => { news[0].electionVerifiedByRoster = true; },
};
for (const [name, mutate] of Object.entries(councilMutations)) {
  test("the Council baseline guard rejects " + name, () => {
    normalizeCouncilNewsForBaseline(lab.news);
    const news = structuredClone(lab.news);
    mutate(news);
    assert.throws(() => normalizeCouncilNewsForBaseline(news), /Council/);
  });
}

const baselineMutations = {
  "prior News text": data => { data.news[1].text += " Changed."; },
  "prior News image": data => data.news[2].images.pop(),
  "missing prior record": data => data.news.pop(),
  "prior record order": data => data.news.push(...data.news.splice(-2, 1)),
  "extra unrelated News": data => data.news.push({ date: "2030", text: "Unapproved", html: "Unapproved", images: [] }),
  "faculty service": data => data.faculty.service.push(data.faculty.service[0]),
  "faculty award": data => data.faculty.awards.push({ text: councilNews.text, html: councilNews.html }),
  "research title": data => { data.research.theme.title += " Changed."; },
};
for (const [name, mutate] of Object.entries(baselineMutations)) {
  test("the full Council-addition baseline rejects " + name, () => {
    assertOnlyCouncilAddition(lab);
    const data = structuredClone(lab);
    mutate(data);
    assert.throws(() => assertOnlyCouncilAddition(data), /entire prior lab JSON baseline|photo delta|Approved News\/gallery correction/);
  });
}

for (const route of ["/", "/news/"]) {
  test(route + " renders Council, Tatthapong and webinar in order using the unchanged year-only date contract", () => {
    const body = createPages(JSON.parse(read("content/site.json")), lab,
      imageRenderer(path.join(root, "public"))).find(page => page.route === route).body;
    const articles = [...body.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
    assert.equal(articles.length, route === "/" ? 3 : 18);
    for (const [index, item] of lab.news.slice(0, 3).entries()) {
      assert.ok(articles[index].includes("<p>" + item.html + "</p>"));
    }
    const council = articles[0];
    assert.ok(council.includes('<span class="news-date">2026</span>'));
    assert.equal(body.split("<p>" + councilNews.html + "</p>").length - 1, 1);
    assert.equal((council.match(/<a\b/g) || []).length, route === "/" ? 1 : 2);
    assert.ok(council.includes('<a href="https://connect.informs.org/qsr/officers">INFORMS Quality, Statistics, and Reliability (QSR) Section</a>'));
    assert.doesNotMatch(council, /<time\b|_comment|<!--|2026[.-]\d{2}|November 2|election announcement/i);
    assert.match(articles[1], /<time datetime="2026-11-01">2026\.11\.01<\/time>/);
    assert.match(articles[2], /<time datetime="2026-10-21">2026\.10\.21<\/time>/);
    assert.deepEqual(lab.news[3], correctedNewsExpectation(refresh.newsAddition.record), "The grant record remains exact at index 3");
    if (route === "/") {
      assert.doesNotMatch(articles.join(""), /<img\b|news-photos/);
      assert.ok(!body.includes(correctedNewsExpectation(refresh.newsAddition.record).html), "Grant item leaves only the first-three Home summary");
    } else {
      assert.match(council, /id="news-2026"/);
      assert.ok(articles[3].includes("<p>" + correctedNewsExpectation(refresh.newsAddition.record).html + "</p>"));
      assert.match(articles[3], /<time datetime="2026-09-04">2026\.09\.04<\/time>/);
    }
  });
}
