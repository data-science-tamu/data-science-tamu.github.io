import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createPages } from "../src/templates.mjs";
import { imageRenderer, rich } from "../src/helpers.mjs";
import { assertNewsBaseline } from "./source-baseline.mjs";
import {
  assertPresentationCorrection,
  normalizePresentationForBaseline,
  presentationCorrection,
} from "./news-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const lab = JSON.parse(read("content/lab.json"));
const render = (data = lab) => createPages(
  JSON.parse(read("content/site.json")), data, imageRenderer(path.join(root, "public")),
);
const articles = (html) => [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)]
  .map((match) => match[0]);
const privateDate = /Competition date:|October 16, 2025|2025[.-]10[.-]16|_comment/;

test("the single corrected ISEN presentation preserves its sentence, photos and source section among 15 records", () => {
  assert.equal(lab.news.length, 15);
  assertPresentationCorrection(lab.news);
  assert.deepEqual(lab.news.filter((item) => item.date.startsWith("2024.12")).map((item) => item.date),
    ["2024.12.10", "2024.12.11"], "Deliberate legacy December order survives");
});

test("migration normalization changes only the approved presentation's date, position and author note", () => {
  const before = structuredClone(lab.news);
  const corrected = assertPresentationCorrection(lab.news);
  const normalized = normalizePresentationForBaseline(lab.news);
  assert.deepEqual(lab.news, before, "Baseline comparisons never mutate maintained data");
  const original = normalized.find((item) => item.sourceSection === 3);
  const { _comment, ...expected } = presentationCorrection;
  assert.deepEqual(original, { ...expected, date: "2026.03.26" });
  assert.equal(normalized[normalized.indexOf(original) - 1].date, "2026.05.16");
  assert.equal(normalized[normalized.indexOf(original) + 1].date, "2026.03.23");
  assert.deepEqual(normalized.filter((item) => item !== original),
    lab.news.filter((item) => item !== corrected), "All other records and their order stay exact");
});

test("source baseline rejects missing, duplicate, wrong-year, misplaced or altered presentation corrections", () => {
  assert.doesNotThrow(() => assertNewsBaseline(lab.news));
  const mutations = {
    missing: (news, index) => news.splice(index, 1),
    duplicate: (news, index) => news.splice(index, 0, structuredClone(news[index])),
    "old date": (news, index) => { news[index].date = "2026.03.26"; },
    "wrong year": (news, index) => { news[index].date = "2026"; },
    "numeric year": (news, index) => { news[index].date = 2025; },
    "visible exact date": (news, index) => { news[index].date = "2025.10.16"; },
    misplaced: (news, index) => news.unshift(...news.splice(index, 1)),
    "missing comment": (news, index) => { delete news[index]._comment; },
    "wrong comment": (news, index) => { news[index]._comment = "Competition date: October 16, 2026."; },
    "missing photo": (news, index) => news[index].images.pop(),
    "reordered photos": (news, index) => news[index].images.reverse(),
    "changed photo": (news, index) => { news[index].images[0] = lab.news[1].images[0]; },
    "changed text": (news, index) => { news[index].text += " Changed."; },
    "changed html": (news, index) => { news[index].html += " Changed."; },
    "changed source section": (news, index) => { news[index].sourceSection = 9; },
  };
  for (const [name, mutate] of Object.entries(mutations)) {
    const news = structuredClone(lab.news);
    mutate(news, news.findIndex((item) => item.sourceSection === 3));
    assert.throws(() => assertNewsBaseline(news), name);
  }
  const reordered = structuredClone(lab.news);
  const index = reordered.findIndex((item) => item.date === "2024.12.10");
  [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
  assert.throws(() => assertNewsBaseline(reordered), "Unrelated legacy reorder must still fail");
});

for (const route of ["/", "/news/"]) {
  test(`${route} renders full dates as time and any year-only date as a plain news-date span`, () => {
    const data = structuredClone(lab);
    data.news = [structuredClone(presentationCorrection), {
      date: "2030.04.05", html: "Full date fixture.", text: "Full date fixture.", images: [],
    }, {
      date: "2031", html: "Year-only fixture.", text: "Year-only fixture.", images: [],
      _comment: "Private generic author note.",
    }];
    const html = render(data).find((page) => page.route === route).body;
    const items = articles(html);
    assert.equal(items.length, 3);
    assert.ok(items[0].includes('<span class="news-date">2025</span>'));
    assert.ok(items[0].includes(`<p>${presentationCorrection.html}</p>`));
    assert.ok(items[1].includes('<time datetime="2030-04-05">2030.04.05</time>'));
    assert.ok(items[2].includes('<span class="news-date">2031</span>'));
    assert.doesNotMatch(html, /<time[^>]*datetime="\d{4}"|Private generic author note/);
    assert.doesNotMatch(html, privateDate, "Exact date stays out of text, markup and aria attributes");
    if (route === "/news/") {
      for (const [index, src] of presentationCorrection.images.entries()) {
        assert.ok(items[0].includes(`href="${src}"`));
        assert.ok(items[0].includes(`src="${src}"`));
        assert.ok(items[0].includes(`aria-label="View full-size photo ${index + 1} for news dated 2025"`));
      }
    }
  });

  test(`${route} never renders maintained author notes or the presentation's exact day`, () => {
    const html = render().find((page) => page.route === route).body;
    assert.doesNotMatch(html, privateDate);
    if (route === "/news/") {
      const item = articles(html).find((article) => article.includes(presentationCorrection.html));
      assert.ok(item.includes('<span class="news-date">2025</span>'));
      assert.doesNotMatch(item, /<time\b|2026\.03\.26/);
      assert.match(item, /id="news-2025"/);
    }
  });
}

test("year-only news dates share the existing date size, color and tabular numeral styles", () => {
  const css = read("public/assets/site.css");
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const declarations = (selector) => Object.fromEntries(rules
    .filter((rule) => rule[1].trim().split(/,\s*/).includes(selector))
    .flatMap((rule) => [...rule[2].matchAll(/([\w-]+)\s*:\s*([^;]+);/g)]
      .map((match) => [match[1], match[2].trim()])));
  for (const property of ["font-size", "color", "font-variant-numeric"]) {
    assert.ok(declarations("time")[property], property);
    assert.equal(declarations(".news-date")[property], declarations("time")[property], property);
  }
});

test("rich HTML still rejects comments and date tags; author notes belong only in JSON", () => {
  for (const html of ["<!-- Competition date: October 16, 2025. -->",
    '<span class="news-date">2025</span>', '<time datetime="2025-10-16">2025</time>'])
    assert.throws(() => rich(html), /Invalid inline/);
});
