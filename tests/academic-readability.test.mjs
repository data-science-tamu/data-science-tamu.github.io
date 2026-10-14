import test from "node:test";
import { publicationCitation, publicationPresentation } from "../src/publications.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createPages, layout } from "../src/templates.mjs";
import { imageRenderer, escape, dimensions } from "../src/helpers.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const site = JSON.parse(read("content/site.json"));
const lab = JSON.parse(read("content/lab.json"));
const publicationsById = publicationPresentation(lab.publications);
const pages = createPages(site, lab, imageRenderer(path.join(root, "public")));
const css = read("public/assets/site.css");
const rules = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const declarations = (selector) => rules.filter((m) => m[1].trim().split(/,\s*/).includes(selector)).map((m) => m[2]).join("\n");
const token = (name) => css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];
const research = pages.filter((p) => p.route.startsWith("/research/"));

test("home has a natural maintained title, without a forced line break or colored word", () => {
  assert.ok(pages[0].body.includes(`<h1>${escape(site.title)}</h1>`));
});

test("templates have a logical heading outline without decorative eyebrow labels", () => {
  for (const page of pages) {
    assert.doesNotMatch(page.body, /class="eyebrow"/, page.route);
    let previous = 0;
    for (const [, level] of page.body.matchAll(/<h([1-6])\b/g)) {
      assert.ok(Number(level) <= previous + 1, `${page.route}: h${previous} to h${level}`);
      previous = Number(level);
    }
  }
});

test("all research pages share one hidden, named native dialog with keyboard scroll and original-file fallback", () => {
  for (const page of pages) {
    const html = layout(site, page, lab.faculty.name, lab.research.areas);
    assert.equal((html.match(/<dialog\b/g) || []).length, research.includes(page) ? 1 : 0, page.route);
    if (!research.includes(page)) continue;
    assert.match(html, /<dialog[^>]*id="figure-viewer"[^>]*aria-labelledby="figure-viewer-title"[^>]*hidden/);
    assert.match(html, /id="figure-viewer-title"/);
    assert.match(html, /data-viewer-close[^>]*>Close/);
    for (const scale of ["fit", "1", "2"])
      assert.ok(html.includes(`data-viewer-scale="${scale}"`));
    assert.match(html, /class="figure-scroll"[^>]*tabindex="0"[^>]*role="region"[^>]*aria-label="[^"]+"/);
    assert.match(html, /data-viewer-original/);
    assert.match(html, /200%[^<]*magnification[^<]*detail/i);
    assert.match(html, /data-viewer-status[^>]*role="status"/);
    assert.ok(html.indexOf("<dialog") > html.indexOf("</main>"), "No substantive content hidden in dialog");
  }
});

test("each scientific figure remains a direct original image link without JavaScript", () => {
  for (const page of research) {
    for (const [, body] of page.body.matchAll(/<figure class="scientific-figure">([\s\S]*?)<\/figure>/g)) {
      const src = body.match(/<img src="([^"]+)"/)[1];
      assert.match(body, new RegExp(`<a href="${src}"[^>]*data-figure-open`));
      assert.match(body, /data-figure-title="[^"]+"/);
      assert.doesNotMatch(body, /<button/);
      const size = dimensions(path.join(root, "public", src));
      assert.ok(body.includes(`width="${size.width}" height="${size.height}"`));
    }
  }
});

test("full project text precedes its image, with no accordion or hidden project paragraphs", () => {
  for (const page of research) {
    assert.doesNotMatch(page.body, /<details|<summary/);
    for (const [, id, body] of page.body.matchAll(/<article class="project" id="([^"]+)">([\s\S]*?)<\/article>/g)) {
      const project = lab.projects.find((p) => p.id === id);
      const imageOffset = body.indexOf('<figure class="scientific-figure">');
      const beforeFigure = body.slice(0, imageOffset).replace(/<[^>]*>/g, "");
      const content = project.paragraphs.flatMap((p) => [p, ...(p.notes || [])]);
      for (const paragraph of content)
        assert.ok(beforeFigure.includes((paragraph.kind === "citation"
          ? publicationCitation(paragraph.recordId, publicationsById)
          : paragraph.html).replace(/<[^>]*>/g, "")), `${id}: full semantic text before figure`);
      assert.doesNotMatch(body, /<(?:p|div|article)\b[^>]*(?:\shidden\b|\saria-hidden="true")/);
    }
  }
});

test("white neutral surfaces and a single local sans type system replace gradients and display decoration", () => {
  assert.equal(token("paper"), "#fff");
  assert.equal(token("sans"), '"DM Sans", Verdana, sans-serif');
  assert.doesNotMatch(css, /Newsreader|--serif|gradient\(|box-shadow|@keyframes|text-transform:\s*uppercase/);
  for (const selector of ["body", ".site-header", ".site-footer", ".contact-panel"])
    assert.match(declarations(selector), /background:\s*var\(--paper\)/, selector);
  for (const page of pages)
    assert.doesNotMatch(layout(site, page, lab.faculty.name, lab.research.areas), /newsreader\.ttf/);
});

test("central rem tokens enforce the tight, accessible academic type scale", () => {
  assert.equal(token("text-body"), "1.0625rem");
  assert.equal(token("text-small"), "0.9375rem");
  assert.equal(token("text-section"), "1.625rem");
  assert.equal(token("text-project"), "1.3125rem");
  assert.equal(token("text-title"), "2.125rem");
  assert.match(declarations("body"), /font:\s*400 var\(--text-body\)/);
  assert.match(declarations("h1"), /font-size:\s*var\(--text-title\)/);
  assert.match(declarations("h2"), /font-size:\s*var\(--text-section\)/);
  assert.match(declarations("h3"), /font-size:\s*var\(--text-project\)/);
  for (const [, size] of css.matchAll(/font-size:\s*([\d.]+)rem/g))
    assert.ok(Number(size) >= 0.9375 && Number(size) <= 2.25, `Font outside shared scale: ${size}rem`);
  assert.doesNotMatch(css, /font-size:\s*[\d.]+px|font-size:\s*clamp/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*--text-title:\s*1\.8125rem/);
});

test("research images occupy the wide canvas at native aspect ratio and do not upscale small sources", () => {
  assert.equal(token("width"), "80rem");
  for (const selector of [".project", ".research-context"])
    assert.match(declarations(selector), /display:\s*block/);
  const figure = declarations(".scientific-figure img");
  assert.match(figure, /width:\s*var\(--image-width\)/);
  assert.match(figure, /max-width:\s*100%/);
  assert.match(figure, /height:\s*auto/);
  assert.doesNotMatch(figure, /max-height|object-fit:\s*cover|height:\s*[\d.]+(?:px|rem)/);
  assert.doesNotMatch(declarations(".overview-figure"), /max-width:\s*\d/);
  assert.match(declarations(".project-text"), /max-width:\s*var\(--measure\)/);
});

test("home uses a compact portrait and above-content headings instead of a giant gutter", () => {
  assert.equal(token("portrait"), "11.25rem");
  assert.match(declarations(".faculty-portrait > img"), /width:\s*var\(--portrait\)/);
  assert.match(declarations(".home-hero"), /padding:\s*1\.5rem 0/);
  assert.match(declarations(".split-section"), /display:\s*block/);
});

test("nav breakpoint, form scale, focus and reduced motion remain accessible", () => {
  assert.match(css, /@media \(max-width: 800px\)/);
  assert.match(read("public/assets/site.js"), /matchMedia\("\(max-width: 800px\)"\)/);
  for (const selector of ["input", "select"])
    assert.match(declarations(selector), /font-size:\s*1rem/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(declarations(".figure-scroll"), /overflow:\s*auto/);
  assert.match(declarations(".figure-scroll img"), /max-width:\s*none/);
});

test("printing includes recruitment and every publication even after filtering", () => {
  const print = css.slice(css.indexOf("@media print"));
  assert.ok(print);
  assert.doesNotMatch(print, /\.contact-panel[^{}]*\{[^}]*display:\s*none/);
  assert.match(print, /\.publication\[hidden\][^{}]*\{[^}]*display:\s*grid\s*!important/);
  assert.match(print, /\.publication-group\[hidden\][^{}]*\{[^}]*display:\s*block\s*!important/);
  assert.match(print, /\.figure-viewer[^{}]*\{[^}]*display:\s*none\s*!important/);
});

test("large-text figure dialogs preserve an image area and scroll rather than clip controls", () => {
  assert.match(declarations(".figure-viewer"), /overflow:\s*auto/);
  assert.match(declarations(".figure-viewer[open]"), /minmax\([1-9][\d.]*rem,\s*1fr\)/);
});

test("scientific images reserve their decoded-file dimensions before lazy download", () => {
  const render = imageRenderer(path.join(root, "public"));
  for (const project of lab.projects) {
    const size = dimensions(path.join(root, "public", project.image));
    assert.ok(render(project.image, project.alt).includes('style="--image-width: ' + size.width + 'px"'));
  }
});
