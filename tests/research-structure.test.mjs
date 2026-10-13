import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createPages, layout } from "../src/templates.mjs";
import { imageRenderer, escape } from "../src/helpers.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const lab = JSON.parse(read("content/lab.json"));
const site = JSON.parse(read("content/site.json"));
const pages = createPages(site, lab, imageRenderer(path.join(root, "public")));
const research = pages.filter((p) => p.route.startsWith("/research/"));
const text = (html) => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const digest = (items) => createHash("sha256").update(JSON.stringify(items)).digest("hex");
const flatten = (items) => items.flatMap((p) => [p.html, ...flatten(p.notes || []), ...flatten(p.items || [])]);

test("all headers including 404 and the home primary action share data-driven Research disclosures", () => {
  const renamed = structuredClone(lab);
  renamed.research.areas[0].title = "New Direction \u0026 Scope";
  renamed.research.areas[0].slug = "new-direction";
  const variants = createPages(site, renamed, imageRenderer(path.join(root, "public")));
  variants.push({route: "/404.html", title: "Not found", description: "Not found", body: ""});
  for (const page of variants) {
    const html = layout(site, page, lab.faculty.name, renamed.research.areas);
    const instances = html.match(/<div class="research-disclosure[^>]*>([\s\S]*?)<\/div>/g) || [];
    assert.equal(instances.length, page.route === "/" ? 2 : 1, page.route);
    for (const instance of instances) {
      assert.match(instance, /<a[^>]*href="\/research\/">Research<\/a>/);
      assert.match(instance, /<button[^>]*data-research-toggle[^>]*aria-expanded="false"[^>]*hidden/);
      const toggle = instance.match(/<button[^>]*>([\s\S]*?)<\/button>/)[0];
      assert.match(toggle, /aria-label="Open research menu"/);
      assert.equal(text(toggle), "", "Icon-only toggle has no visible Directions label");
      assert.match(toggle, /<svg[^>]*aria-hidden="true"/);
      assert.doesNotMatch(instance, /&#8599;|\u2197/);
      assert.match(instance, /<ul[^>]*data-research-directions/);
      assert.doesNotMatch(instance, /role="menu|aria-haspopup="menu|<ul[^>]*hidden/);
      const menu = instance.match(/<ul[^>]*>([\s\S]*?)<\/ul>/)[1];
      const links = [...menu.matchAll(/<a href="([^"]+)"([^>]*)>([^<]+)<\/a>/g)];
      assert.deepEqual(links.map((m) => [m[1], m[3]]), [
        ["/research/", "Overview"],
        ...renamed.research.areas.map((a) => [`/research/${a.slug}/`, escape(a.title)]),
      ]);
      assert.equal(links[0][2].includes('aria-current="page"'), page.route === "/research/");
      assert.equal(links.filter((m) => m[2].includes('aria-current="page"')).length,
        page.route.startsWith("/research/") ? 1 : 0);
      for (const a of renamed.research.areas)
        assert.ok(instance.includes(`href="/research/${a.slug}/"`));
      assert.ok(instance.includes(escape(renamed.research.areas[0].title)));
      const id = instance.match(/aria-controls="([^"]+)"/)[1];
      assert.ok(instance.includes(`id="${id}"`));
    }
    assert.doesNotMatch(html.match(/<footer[\s\S]*<\/footer>/)[0], /research-disclosure/);
  }
});

test("overview uses the exact maintained owner-authored theme as its only H1", () => {
  const title = "Domain-informed Statistical Machine learning and modeling with Uncertainty Quantification";
  const body = research.find((p) => p.route === "/research/").body;
  assert.equal(lab.research.theme.title, title);
  assert.deepEqual([...body.matchAll(/<h1>([^<]*)<\/h1>/g)].map((m) => m[1]), [title]);
  assert.doesNotMatch(body, /Domain-informed data science|Integrating knowledge, modeling and uncertainty/);
  assert.doesNotMatch(body, new RegExp(`<h2>${escape(title)}<\/h2>`));
  assert.ok(body.includes(lab.research.theme.summary.html));
  const renamed = structuredClone(lab);
  renamed.research.theme.title = "Maintained theme \u0026 title";
  const variant = createPages(site, renamed, imageRenderer(path.join(root, "public")))
    .find((p) => p.route === "/research/");
  assert.ok(variant.body.includes(`<h1>${escape(renamed.research.theme.title)}</h1>`));
});

test("direction subnavigation starts with Overview and preserves the three direction links", () => {
  for (const area of lab.research.areas) {
    const body = research.find((p) => p.route === `/research/${area.slug}/`).body;
    const subnav = body.match(/<nav class="research-subnav"[^>]*>([\s\S]*?)<\/nav>/)[1];
    const links = [...subnav.matchAll(/<a href="([^"]+)"([^>]*)>([^<]+)<\/a>/g)];
    assert.deepEqual(links.map((m) => [m[1], m[3]]), [
      ["/research/", "Overview"],
      ...lab.research.areas.map((a) => [`/research/${a.slug}/`, escape(a.title)]),
    ]);
    assert.equal(links[0][2], "");
    assert.deepEqual(links.filter((m) => m[2].includes('aria-current="page"')).map((m) => m[1]),
      [`/research/${area.slug}/`]);
  }
});

test("integration theme and exactly one original figure precede directions and supporting content", () => {
  const body = research.find((p) => p.route === "/research/").body.replaceAll("\u0026amp;", "\u0026");
  const figure = "/assets/images/research-1-cd79bc1b85.png";
  const srcs = [...body.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(srcs.filter((src) => src === figure).length, 1);
  const positions = [body.indexOf("<h1>"), body.indexOf('class="research-theme"'), body.indexOf(`<img src="${figure}"`), body.indexOf("Research directions</h2>"), body.indexOf("Research interests</h2>"), body.indexOf("Previous \u0026 ongoing work</h2>"), body.indexOf("Projects \u0026 applications</h2>")];
  assert.ok(positions.every((n) => n >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  const theme = body.match(/<section class="research-theme">([\s\S]*?)<\/section>/)[1];
  for (const label of ["Domain Knowledge", "Statistical/ML Modeling", "Uncertainty Quantification", "physics/engineering knowledge", "data-driven modeling", "Bayesian framework"])
    assert.ok(text(theme).includes(label), label);
  assert.match(theme, /data-figure-open/);
  assert.ok(lab.research.theme, "Authored text belongs in maintained data");
});

test("overview has real headings and lists with complete original items", () => {
  const html = research.find((p) => p.route === "/research/").body;
  for (const label of ["Tasks:", "Approaches:", "Applications:"]) {
    const group = lab.research.overview.find((p) => p.text === label);
    assert.equal(group.kind, "list");
    assert.ok(group.items.length > 0);
    assert.ok(html.includes(`<h3>${group.html}</h3><ul>`));
    for (const item of group.items) assert.ok(html.includes(`<li>${item.html}</li>`));
  }
});

test("all eight projects label facts, distinguish collaborators and nest notes under citations", () => {
  for (const page of research) {
    for (const [, id, html] of page.body.matchAll(/<article class="project" id="([^"]+)">([\s\S]*?)<\/article>/g)) {
      const p = lab.projects.find((p) => p.id === id);
      assert.match(html, /<h4>Publications<\/h4><ul class="research-publications">/);
      for (const item of p.paragraphs) {
        if (/^(Goal:|Methodologies:|PDE Equation:|Detail:)/.test(item.text)) {
          assert.ok(item.label);
          assert.ok(html.includes(`<strong>${item.label}</strong>`), `${id}: ${item.label}`);
        }
        if (item.text.startsWith("This work is done")) {
          assert.equal(item.kind, "collaborators");
          assert.ok(html.includes(`<p class="project-collaborators"><strong>Collaborators:</strong> ${item.html}</p>`));
        }
        if (/^\[[JC]\d/.test(item.text)) {
          assert.equal(item.kind, "citation");
          assert.ok(html.includes(`<li><p>${item.html}</p>`));
          assert.ok(html.includes(`href="/publication/#${item.recordId.replace("*", "-review")}"`));
          if (item.notes?.length)
            assert.ok(html.includes(`<ul class="citation-notes">${item.notes.map((n) => `<li>${n.html}</li>`).join("")}</ul></li>`));
        }
      }
      assert.doesNotMatch(html, /<details|\shidden\b/);
    }
  }
  const bone = lab.projects.find((p) => p.id === "bone-elastic-properties");
  assert.ok(bone.paragraphs.find((p) => p.recordId === "J9").notes[0].html.startsWith("Advanced Science"));
  assert.ok(!lab.projects.find((p) => p.id === "failure-prognostics").paragraphs.some((p) => p.label === "Goal:"));
});

test("selected citations share presentation and every original project text/link is preserved", () => {
  const baseline = JSON.parse(read("tests/research-paragraph-baseline.json"));
  for (const p of lab.projects) {
    const original = baseline.projects.find((item) => item.id === p.id);
    assert.equal(digest(flatten(p.paragraphs)), original.sha256, p.id);
    const owners = ["/research/", ...lab.research.areas.filter((a) => a.projects.includes(p.id)).map((a) => `/research/${a.slug}/`)];
    for (const page of research.filter((page) => owners.includes(page.route))) {
      for (const html of flatten(p.paragraphs)) assert.ok(text(page.body).includes(text(html)), `${page.route}: ${p.id}`);
      for (const html of flatten(p.paragraphs))
        for (const [link] of html.matchAll(/<a href="[^"]+">/g)) assert.ok(page.body.includes(link));
    }
  }
  assert.equal(digest(flatten(lab.research.overview)), baseline.overviewSha256);
  for (const area of lab.research.areas) {
    const page = research.find((p) => p.route === `/research/${area.slug}/`);
    for (const citation of area.selected) {
      assert.equal(citation.kind, "citation");
      assert.ok(page.body.includes(`<li><p>${citation.html}</p>`));
    }
  }
});

test("disclosure CSS is no-gap, viewport-bounded, mobile in-flow and hidden in print", () => {
  const css = read("public/assets/site.css");
  assert.match(css, /\.research-directions\s*\{[^}]*margin:\s*0/);
  assert.match(css, /\.research-enhanced > \.research-directions\s*\{[^}]*top:\s*100%/);
  assert.match(css, /\.research-enhanced > \.research-directions\s*\{[^}]*max-width:\s*calc\(100vw - 2rem\)/);
  const mobile = css.slice(css.indexOf("@media (max-width: 800px)"), css.indexOf("@media (max-width: 560px)"));
  assert.match(mobile, /\.research-enhanced > \.research-directions\s*\{[^}]*position:\s*static/);
  assert.match(css.slice(css.indexOf("@media print")), /\.research-directions[^{}]*\{[^}]*display:\s*none\s*!important/);
});
