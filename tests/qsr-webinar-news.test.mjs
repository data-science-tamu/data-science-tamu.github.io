import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createPages } from "../src/templates.mjs";
import { dimensions, imageRenderer } from "../src/helpers.mjs";
import { normalizeRefreshForBaseline } from "./refresh-expectations.mjs";
import { newsPhotos, normalizeNewsPhotosForBaseline } from "./news-photo-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const lab = JSON.parse(read("content/lab.json"));
const before = JSON.parse(read("tests/fixtures/qsr-webinar-before.json"));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const title = "Robust Inference of Unseen Heterogeneous Physical Properties from Imperfect Data: A Unified Probabilistic Physics-Informed Machine Learning Framework";
const recording = "https://youtu.be/SUy7JjjuqcM";
const flyerPdf = "/assets/documents/qsr-webinar-2026-10-21-flyer.pdf";
const flyerImage = "/assets/images/qsr-webinar-2026-10-21-flyer.jpg";
const acknowledgement = "/assets/images/qsr-2026-acknowledgement.jpg";
const text = `Dr. Lee presented "${title}" as part of the INFORMS QSR Webinar Series. Watch the recording on YouTube. Webinar flyer (PDF).`;
const approved = {
  date: "2026.10.21",
  html: text.replace("YouTube", `<a href="${recording}">YouTube</a>`)
    .replace("Webinar flyer (PDF)", `<a href="${flyerPdf}">Webinar flyer (PDF)</a>`),
  text,
  images: [acknowledgement, newsPhotos[2].src],
};
const assets = [
  { src: flyerImage, width: 1487, height: 1925, bytes: 641693,
    sha256: "088188e0aca36031cec8378e4e79f50c2adcbad46bdbb68e9750c154dac61761" },
  { src: acknowledgement, width: 800, height: 533, bytes: 69996,
    sha256: "4c433abda82773511a71ab5daae2b6ee1073bf954c49e2acff42b7725ea6ad42" },
  { src: flyerPdf, bytes: 182065,
    sha256: "b30ddc0190cc127170419a2b429c2b447cdb522ad4312ae52b8b84d4e8d83ef0" },
];

function assertWebinarNews(data) {
  const matches = data.news.filter((item) => item.date === approved.date ||
    /QSR Webinar Series|Robust Inference|SUy7JjjuqcM|qsr-webinar-2026-10-21-flyer/.test(JSON.stringify(item)));
  assert.equal(matches.length, 1, "Exactly one QSR webinar record");
  assert.deepEqual(matches[0], approved, "Only the approved webinar facts, links and native images");
  assert.equal(data.news.length, 18);
  assert.equal(data.news[2], matches[0], "The webinar follows the existing finalist");
  assert.deepEqual(normalizeNewsPhotosForBaseline(data.news)[1], before.news[0],
    "The finalist after Council remains exact after reversing only the approved photo");
  assert.equal(data.news[3].date, "2026.09.04", "The combined grant entry follows the webinar");
  assert.equal(data.news[4].date, "2026.05.16", "The grant entry precedes the May 16 record");
}

function assertPreserved(data) {
  const baseline = normalizeRefreshForBaseline(data);
  const historical = baseline.news.filter((item) => item.date !== approved.date);
  assert.deepEqual(historical, before.news, "All 15 prior records and their order remain exact");
  assert.deepEqual(data.people.photos, [
    {
      src: "/assets/images/people-1-c060cdafd7.jpg",
      caption: "INFORMS Annual Meeting 2024 (Seattle, WA)",
    },
    {
      src: "/assets/images/people-2-c9f2346674.jpg",
      caption: "INFORMS Annual Meeting 2025 (Atlanta, GA)",
    },
    {
      src: "/assets/images/informs-2026-san-francisco.jpg",
      caption: "INFORMS Annual Meeting 2026 (San Francisco, CA)",
    },
  ], "Only the exact approved photo addition is allowed");
  const { news, ...other } = structuredClone(baseline);
  other.people.photos.pop();
  assert.equal(sha256(JSON.stringify(other)), before.nonNewsSha256,
    "All historic non-News lab data remain exact");
}

test("one October 21 webinar uses the official full title and ordinary recording/PDF links after the unchanged finalist", () => {
  assertWebinarNews(lab);
  assert.doesNotMatch(lab.news[2].html, /Search on the Replay Buffer|<iframe|<embed|<object|\b(?:winner|rank|ceremony|council)\b/i);
  assert.match(lab.news[2].text, /^[\x20-\x7e]+$/);
  assert.doesNotMatch(JSON.stringify(lab.news[2]), /shown below/i);
});

test("the portable pre-webinar fixture preserves every previous News record and all other lab data", () => {
  assert.equal(before.news.length, 15);
  assert.equal(sha256(JSON.stringify(before.news)),
    "ddeff3b3af12987921a8a3015383cf59f6c3613f9fd127f1221931d430278362");
  assert.equal(before.nonNewsSha256,
    "f42554420f52bde50e53dc78ad69bcafda93a79a1b3cb25de583359ca21cb053");
  assertPreserved(lab);
});

test("webinar expectations reject duplicates, wrong dates/title/links, an inline flyer and unsupported claims", () => {
  assertWebinarNews(lab);
  const mutations = {
    missing: (data) => data.news.splice(2, 1),
    duplicate: (data) => data.news.splice(2, 0, structuredClone(data.news[2])),
    "announcement date": (data) => { data.news[2].date = "2026.09.21"; },
    "photo posting date": (data) => { data.news[2].date = "2026.11.06"; },
    "wrong video title": (data) => { data.news[2].html = "Search on the Replay Buffer:Bridging Planning and Reinforcement Learning by Jaesung Lee"; },
    "wrong recording": (data) => { data.news[2].html = data.news[2].html.replace(recording, "https://example.org/"); },
    "missing PDF link": (data) => { data.news[2].html = data.news[2].html.replace(flyerPdf, "/cv/"); },
    "missing photo": (data) => data.news[2].images.pop(),
    "inline flyer": (data) => data.news[2].images.unshift(flyerImage),
    "captured section": (data) => { data.news[2].sourceSection = 1; },
    misplaced: (data) => data.news.unshift(...data.news.splice(2, 1)),
    "winner claim": (data) => { data.news[2].text += " Dr. Lee was the winner."; },
    embed: (data) => { data.news[2].html += `<iframe src="${recording}"></iframe>`; },
  };
  for (const [name, mutate] of Object.entries(mutations)) {
    const data = structuredClone(lab);
    mutate(data);
    assert.throws(() => assertWebinarNews(data), name);
  }
});

test("preservation checks reject changes to prior news order/content or unrelated lab data", () => {
  assertPreserved(lab);
  const mutations = {
    "old sentence": (data) => { data.news[1].text += " Changed."; },
    "finalist photo": (data) => data.news[1].images.push(acknowledgement),
    "missing old record": (data) => data.news.pop(),
    "legacy order": (data) => data.news.push(...data.news.splice(data.news.length - 2, 1)),
    "faculty name": (data) => { data.faculty.name += " Changed"; },
    "research theme": (data) => { data.research.theme.title += " Changed"; },
  };
  for (const [name, mutate] of Object.entries(mutations)) {
    const data = structuredClone(lab);
    mutate(data);
    assert.throws(() => assertPreserved(data), name);
  }
});

for (const asset of assets) {
  test(`${asset.src} retains the supplied native bytes, hash and dimensions`, () => {
    const file = path.join(root, "public", asset.src);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.length, asset.bytes);
    assert.equal(sha256(bytes), asset.sha256);
    if (asset.width) assert.deepEqual(dimensions(file), { width: asset.width, height: asset.height });
    else assert.match(bytes.subarray(0, 8).toString("ascii"), /^%PDF-1\.7/);
  });
}

for (const route of ["/", "/news/"]) {
  test(`${route} renders one webinar third with the exact title/date and recording/PDF links, never an embed`, () => {
    const html = createPages(
      JSON.parse(read("content/site.json")), lab, imageRenderer(path.join(root, "public")),
    ).find((page) => page.route === route).body;
    const articles = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map((match) => match[0]);
    assert.equal(articles.length, route === "/" ? 3 : 18);
    assert.ok(articles[1].includes(`<p>${before.news[0].html}</p>`));
    if (route === "/") assert.doesNotMatch(articles[1], /<img\b|news-photos/);
    else assert.ok(articles[1].includes("<img src=\"" + newsPhotos[1].src + "\""));
    const item = articles[2];
    assert.doesNotMatch(item, /View the webinar flyer and QSR acknowledgement photo|qsr-webinar-2026-10-21-flyer\.jpg/,
      `${route}: redundant sentence and inline flyer are removed`);
    assert.doesNotMatch(item, /shown below/i);
    assert.ok(item.includes(`<p>${approved.html}</p>`));
    assert.match(item, /<time datetime="2026-10-21">2026\.10\.21<\/time>/);
    for (const [href, label] of [[recording, "YouTube"], [flyerPdf, "Webinar flyer (PDF)"]]) {
      assert.equal(html.split(`<a href="${href}">${label}</a>`).length - 1, 1);
    }
    assert.doesNotMatch(html, /<(?:iframe|embed|object)\b/i);
    assert.doesNotMatch(item, /Search on the Replay Buffer|2026\.09\.21|2026\.11\.06/);
    if (route === "/news/") {
      assert.match(item, /id="news-2026-10-21"/);
      const images = [...item.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
      assert.deepEqual(images.map((image) => image.match(/\bsrc="([^"]+)"/)[1]), approved.images);
      for (const [index, asset] of [assets[1], newsPhotos[2]].entries()) {
        assert.ok(images[index].includes(`width="${asset.width}" height="${asset.height}"`));
        assert.ok(images[index].includes(`style="--image-width: ${asset.width}px"`));
        assert.match(images[index], /alt="[^"]+"/);
        assert.ok(item.includes(`<a href="${asset.src}" aria-label="View full-size photo ${index + 1} for news dated 2026.10.21">`));
      }
    } else {
      assert.doesNotMatch(item, /<img\b|news-photos/, "Home retains its text-only summary renderer");
    }
  });
}

