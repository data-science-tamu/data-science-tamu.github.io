import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createPages } from "../src/templates.mjs";
import { escape, imageRenderer } from "../src/helpers.mjs";

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8");
const site = JSON.parse(read("../content/site.json"));
const source = JSON.parse(read("../content/lab.json"));
const renderImage = imageRenderer(new URL("../public", import.meta.url).pathname);
const script = read("../public/assets/site.js");
const css = read("../public/assets/site.css");
function baseline() {
  const lab = structuredClone(source);
  for (const key of ["experience", "funding", "service"]) delete lab.faculty[key];
  delete lab.people.undergraduates;
  for (const student of lab.people.current) {
    delete student.links;
    delete student.highlights;
  }
  return lab;
}
const render = (lab) => new Map(createPages(site, lab, renderImage).map((page) => [page.route, page.body]));
const student = (html) => html.match(/<article class="student">([\s\S]*?)<\/article>/)[1];

test("student links follow email and escaped highlights follow education", () => {
  const lab = baseline();
  lab.people.current = [{ ...lab.people.current[0],
    links: [{label: "Personal <site>", href: "https://example.test/?a=1&b=2"},
      {label: "LinkedIn", href: "https://www.linkedin.com/in/example/"}],
    highlights: ["Example <award> & recognition", "Example research highlight"],
  }];
  const html = student(render(lab).get("/people/"));
  assert.match(html, /class="text-links"><a href="https:\/\/example.test\/\?a=1&amp;b=2">Personal &lt;site&gt;/);
  assert.match(html, /href="https:\/\/www.linkedin.com\/in\/example\/">LinkedIn/);
  assert.ok(html.indexOf("class=\"email\"") < html.indexOf("class=\"text-links\""));
  assert.match(html, /<ul class="student-highlights"><li>Example &lt;award&gt; &amp; recognition<\/li><li>Example research highlight<\/li><\/ul>/);
  assert.ok(html.indexOf("class=\"education-list\"") < html.indexOf("class=\"student-highlights\""));
  assert.doesNotMatch(html, /<award>|<site>/);
});

test("current undergraduate research is separate from past members", () => {
  const lab = baseline();
  lab.people.undergraduates = [{name: "Example <student>", period: "Example period", description: "Research & mentoring"}];
  const html = render(lab).get("/people/");
  assert.match(html, /<h2>Current Undergraduate Research<\/h2>/);
  assert.match(html, /<h3>Example &lt;student&gt;<\/h3>/);
  assert.match(html, /Example period/);
  assert.match(html, /Research &amp; mentoring/);
  assert.ok(html.indexOf("Current Undergraduate Research") < html.indexOf("Past members:"));
  assert.match(html, /Past members: Students &amp; research experiences/);
});

test("optional experience, funding and service render on CV only with exact escaped strings", () => {
  const lab = baseline();
  lab.faculty.experience = [{role: "Example appointment <role>", organization: "Example organization & lab", period: "Example appointment period"}];
  lab.faculty.funding = {summary: "Example funding summary <exact>", items: [
    {role: "Example PI role", sponsor: "Example sponsor", title: "Example project <title>", period: "Example project period", amount: "$123,456 (exact)", details: "Example details & scope", href: "https://example.test/award?a=1&b=2"},
    {role: "Example co-PI", sponsor: "Another sponsor", title: "Project without optional details", period: "Another period", amount: "$10 (exact)"},
  ]};
  lab.faculty.service = ["Example service <plain>", "Example editorial & review service"];
  const pages = render(lab);
  const cv = pages.get("/cv/");
  for (const text of [...Object.values(lab.faculty.experience[0]), lab.faculty.funding.summary,
    ...lab.faculty.funding.items.flatMap((item) => Object.values(item)), ...lab.faculty.service]) {
    assert.ok(cv.includes(escape(text)), text);
    for (const [route, html] of pages) if (route !== "/cv/") assert.ok(!html.includes(escape(text)), route + ": " + text);
  }
  assert.match(cv, /<h2>Professional Experience<\/h2>/);
  assert.match(cv, /<h2>Research Funding<\/h2>/);
  assert.match(cv, /<h2>Professional Service<\/h2>/);
  assert.match(cv, /<h3><a href="https:\/\/example.test\/award\?a=1&amp;b=2">Example project &lt;title&gt;<\/a><\/h3>/);
  assert.ok(cv.indexOf("Example project &lt;title&gt;") < cv.indexOf("Example PI role"));
  assert.match(cv, /<li>Example service &lt;plain&gt;<\/li>/);
  assert.doesNotMatch(cv, /undefined|<exact>|<plain>/);
});

test("absent or empty optional arrays preserve baseline pages without empty new sections", () => {
  for (const empty of [false, true]) {
    const lab = baseline();
    if (empty) {
      lab.faculty.experience = [];
      lab.faculty.funding = {summary: "", items: []};
      lab.faculty.service = [];
      lab.people.undergraduates = [];
      for (const p of lab.people.current) { p.links = []; p.highlights = []; }
    }
    const pages = render(lab);
    assert.doesNotMatch(pages.get("/cv/"), /Professional Experience|Research Funding|Professional Service|undefined/);
    assert.doesNotMatch(pages.get("/people/"), /Current Undergraduate Research|student-highlights|undefined/);
    assert.doesNotMatch(student(pages.get("/people/")), /class="text-links"/);
  }
});

test("gallery keeps ordered uncropped semantic photos and exposes a labeled native scroll region", () => {
  const lab = baseline();
  const html = render(lab).get("/people/");
  assert.match(html, /<section[^>]*data-photo-gallery/);
  const track = html.match(/<div[^>]*class="photo-grid"[^>]*>([\s\S]*?)<\/div>/);
  assert.ok(track);
  assert.match(track[0], /role="region"/);
  assert.match(track[0], /tabindex="0"/);
  assert.match(track[0], /aria-label="Lab photos"/);
  assert.match(track[0], /id="lab-photos"/);
  const figures = [...track[1].matchAll(/<figure>([\s\S]*?)<\/figure>/g)];
  assert.equal(figures.length, lab.people.photos.length);
  for (const [index, photo] of lab.people.photos.entries()) {
    assert.ok(figures[index][1].includes(`src="${escape(photo.src)}" alt="${escape(photo.caption)}"`));
    assert.ok(figures[index][1].includes(`<figcaption>${escape(photo.caption)}</figcaption>`));
    assert.match(figures[index][1], /width="\d+" height="\d+"/);
  }
  assert.match(html, /<div[^>]*data-photo-controls[^>]*hidden/);
  for (const label of ["Previous lab photo", "Next lab photo"])
    assert.ok(html.includes(`aria-label="${label}" aria-controls="lab-photos"`));
  assert.match(html, /data-photo-status[^>]*role="status"[^>]*aria-live="polite"/);
});

test("gallery CSS provides native horizontal snapping, responsive cards and complete print output", () => {
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const declarations = (selector) => rules.filter((m) => m[1].trim().split(/,\s*/).includes(selector)).map((m) => m[2]).join("\n");
  assert.match(declarations(".photo-grid"), /overflow-x:\s*auto/);
  assert.match(declarations(".photo-grid"), /scroll-snap-type:\s*x\s+mandatory/);
  assert.match(declarations(".photo-grid > figure"), /scroll-snap-align:\s*start/);
  assert.match(declarations(".photo-grid img"), /height:\s*auto/);
  assert.doesNotMatch(declarations(".photo-grid img"), /object-fit:\s*cover|aspect-ratio/);
  const mobile = css.slice(css.indexOf("@media (max-width: 800px)"));
  assert.match(mobile, /\.photo-grid\s*\{[^}]*grid-auto-columns:\s*100%/);
  const print = css.slice(css.indexOf("@media print"));
  assert.match(print, /\.photo-grid\s*\{[^}]*overflow:\s*visible/);
  assert.match(print, /\.photo-grid\s*\{[^}]*grid-auto-flow:\s*row/);
  assert.match(print, /\.photo-controls[^{}]*\{[^}]*display:\s*none\s*!important/);
});

// Geometry is a controlled platform double; production event handlers run unchanged.
// Actual layout, native scrolling and accessibility are verified by parent browser QA.
function galleryFixture({count = 3, width = 600, cardWidth = 284, gap = 32, reduced = false} = {}) {
  const doc = {activeElement: null};
  class Element {
    constructor() { this.listeners = new Map(); this.attrs = new Map(); this.hidden = false; this.textContent = ""; }
    addEventListener(type, handler) { this.listeners.set(type, [...(this.listeners.get(type) || []), handler]); }
    emit(type, values = {}) {
      const event = {target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...values};
      for (const handler of this.listeners.get(type) || []) handler(event);
      return event;
    }
    setAttribute(key, value) { this.attrs.set(key, String(value)); }
    getAttribute(key) { return this.attrs.get(key) ?? null; }
    focus() { doc.activeElement = this; }
  }
  const root = new Element(), track = new Element(), controls = new Element();
  const previous = new Element(), next = new Element(), status = new Element();
  controls.hidden = true;
  track.clientWidth = width;
  track.scrollLeft = 0;
  const cards = Array.from({length: count}, () => new Element());
  function geometry(nextWidth, nextCardWidth) {
    track.clientWidth = nextWidth;
    track.scrollWidth = Math.max(nextWidth, count * nextCardWidth + Math.max(0, count - 1) * gap);
    cards.forEach((card, i) => {
      card.getBoundingClientRect = () => ({left: 24 + i * (nextCardWidth + gap) - track.scrollLeft, width: nextCardWidth, right: 24 + i * (nextCardWidth + gap) - track.scrollLeft + nextCardWidth});
    });
    track.scrollLeft = Math.min(track.scrollLeft, track.scrollWidth - nextWidth);
  }
  geometry(width, cardWidth);
  track.getBoundingClientRect = () => ({left: 24, right: 24 + track.clientWidth, width: track.clientWidth});
  track.querySelectorAll = () => cards;
  track.scrollTo = (options) => {
    track.lastScroll = options;
    track.scrollLeft = Math.max(0, Math.min(options.left, track.scrollWidth - track.clientWidth));
    track.emit("scroll");
  };
  const selectors = {"[data-photo-track]": track, "[data-photo-controls]": controls,
    "[data-photo-previous]": previous, "[data-photo-next]": next, "[data-photo-status]": status};
  root.querySelector = (selector) => selectors[selector] || null;
  doc.querySelector = () => null;
  doc.querySelectorAll = (selector) => selector === "[data-photo-gallery]" ? [root] : [];
  const win = new Element();
  const media = new Element();
  media.matches = reduced;
  win.matchMedia = () => media;
  vm.runInNewContext(script, {document: doc, window: win, setTimeout});
  return {doc, track, controls, previous, next, status, win, media, geometry};
}
const disabled = (button) => button.getAttribute("aria-disabled") === "true";

test("gallery initialization exposes count and end states; buttons retain focus", () => {
  const f = galleryFixture();
  assert.equal(f.controls.hidden, false);
  assert.equal(f.status.textContent, "Photos 1-2 of 3");
  assert.equal(disabled(f.previous), true);
  assert.equal(disabled(f.next), false);
  f.next.focus();
  f.next.emit("click");
  assert.equal(f.track.scrollLeft, 316);
  assert.equal(f.track.lastScroll.behavior, "smooth");
  assert.equal(f.status.textContent, "Photos 2-3 of 3");
  assert.equal(disabled(f.next), true);
  assert.equal(f.doc.activeElement, f.next);
  f.next.emit("click");
  assert.equal(f.track.scrollLeft, 316);
  f.previous.focus();
  f.previous.emit("click");
  assert.equal(f.track.scrollLeft, 0);
  assert.equal(f.doc.activeElement, f.previous);
  assert.equal(disabled(f.previous), true);
});

test("touch/native scrolling and resizing refresh counts and end states", () => {
  const f = galleryFixture();
  f.track.scrollLeft = 316;
  f.track.emit("scroll");
  assert.equal(disabled(f.next), true);
  assert.equal(f.status.textContent, "Photos 2-3 of 3");
  f.geometry(300, 300);
  f.win.emit("resize");
  assert.equal(disabled(f.next), false);
  f.track.scrollLeft = 664;
  f.track.emit("scroll");
  assert.equal(f.status.textContent, "Photo 3 of 3");
  assert.equal(disabled(f.next), true);
  f.geometry(1000, 284);
  f.win.emit("resize");
  assert.equal(f.status.textContent, "Photos 1-3 of 3");
  assert.equal(disabled(f.previous), true);
  assert.equal(disabled(f.next), true);
});

test("gallery handles arrows, Home and End only when the region itself is focused", () => {
  const f = galleryFixture({width: 300, cardWidth: 300});
  f.track.focus();
  for (const [key, left] of [["ArrowRight", 332], ["End", 664], ["ArrowLeft", 332], ["Home", 0]]) {
    assert.equal(f.track.emit("keydown", {key}).defaultPrevented, true);
    assert.equal(f.track.scrollLeft, left);
    assert.equal(f.doc.activeElement, f.track);
  }
  for (const values of [{key: "Tab"}, {key: "ArrowRight", target: {}}, {key: "Home", ctrlKey: true},
    {key: "End", metaKey: true}, {key: "ArrowLeft", altKey: true}, {key: "ArrowRight", shiftKey: true}]) {
    assert.equal(f.track.emit("keydown", values).defaultPrevented, false);
    assert.equal(f.track.scrollLeft, 0);
  }
  f.track.emit("keydown", {key: "End", defaultPrevented: true});
  assert.equal(f.track.scrollLeft, 0);
});

test("reduced motion is respected on each action, including preference changes", () => {
  const f = galleryFixture({reduced: true});
  f.next.emit("click");
  assert.equal(f.track.lastScroll.behavior, "instant");
  f.media.matches = false;
  f.previous.emit("click");
  assert.equal(f.track.lastScroll.behavior, "smooth");
});

test("zero and one photos have no active navigation or invalid count", () => {
  for (const count of [0, 1]) {
    const f = galleryFixture({count});
    assert.equal(disabled(f.previous), true);
    assert.equal(disabled(f.next), true);
    assert.equal(f.controls.hidden, count === 0);
    assert.equal(f.status.textContent, count ? "Photo 1 of 1" : "0 photos");
    f.next.emit("click");
    f.previous.emit("click");
    assert.equal(f.track.scrollLeft, 0);
    f.win.emit("resize");
    assert.doesNotMatch(f.status.textContent, /NaN|undefined|Photo 0 of/);
  }
});
