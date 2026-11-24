import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createPages } from "../src/templates.mjs";
import { escape, imageRenderer } from "../src/helpers.mjs";
import { homeIconCaption, originalHomeCaption, normalizeHomeIconsHtml } from "./home-icon-expectations.mjs";

const read = (file) => fs.readFileSync(new URL("../" + file, import.meta.url), "utf8");
const site = JSON.parse(read("content/site.json"));
const lab = JSON.parse(read("content/lab.json"));
const img = imageRenderer(new URL("../public", import.meta.url).pathname);
const render = (metadata = site) => new Map(createPages(metadata, lab, img).map((page) => [page.route, page.body]));
const caption = (html) => html.match(/<figure class="faculty-portrait">[\s\S]*?(<figcaption>[\s\S]*?<\/figcaption>)/)?.[1];
const facultyLinks = (html) => html.match(/<section class="section faculty-feature">[\s\S]*?(<span class="person-links">[\s\S]*?<\/span>)/)?.[1];
const expectedLinks = homeIconCaption.match(/<span class="person-links">[\s\S]*?<\/span>/)[0];
const cvLink = '<a class="person-link" href="/cv/" aria-label="Jaesung Lee: CV (Curriculum vitae)" title="Jaesung Lee: CV (Curriculum vitae)">CV</a>';

test("Home faculty caption replaces only the email text with exactly four existing accessible SVG links", () => {
  const home = render().get("/");
  assert.equal(caption(home), homeIconCaption);
  const links = [...caption(home).matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(([html]) => html);
  assert.equal(links.length, 4);
  for (const [index, [href, label]] of [
    ["mailto:" + site.email, "Email"], [site.profile, "Faculty profile"],
    [site.scholar, "Google Scholar"], [site.linkedin, "LinkedIn"],
  ].entries()) {
    assert.ok(links[index].includes('href="' + escape(href) + '"'));
    for (const attribute of ["aria-label", "title"])
      assert.ok(links[index].includes(attribute + '="' + escape(lab.faculty.name + ": " + label) + '"'));
    assert.match(links[index], /><svg class="person-icon person-icon-[a-z]+"[^>]*aria-hidden="true" focusable="false">[\s\S]*<\/svg><\/a>$/);
    assert.doesNotMatch(links[index], /\btarget=|\brel=|tabindex|onclick/);
  }
  assert.doesNotMatch(caption(home), />j\.lee@tamu\.edu<|>CV<|href="\/cv\/"/);
});

test("People retains all five exact faculty links and its original conditional CV while Home never includes CV", () => {
  for (const cv of [site.cv, " /existing-cv.pdf ", undefined, null, "", " \t ", false, 0]) {
    const pages = render({ ...site, cv });
    const includeCv = typeof cv === "string" && cv.trim();
    assert.equal(facultyLinks(pages.get("/people/")), expectedLinks.replace("</span>", (includeCv ? cvLink : "") + "</span>"));
    assert.equal(caption(pages.get("/")), homeIconCaption);
  }
});

test("historical Home icon normalization reverses only the exact approved caption", () => {
  assert.equal(normalizeHomeIconsHtml(homeIconCaption), originalHomeCaption);
  for (const changed of [
    homeIconCaption.replace("mailto:j.lee@tamu.edu", "mailto:wrong@example.test"),
    homeIconCaption.replace("Faculty profile", "Changed label"),
    homeIconCaption.replace("person-icon-scholar", "person-icon-globe"),
    homeIconCaption.replace("Assistant Professor", "Changed role"),
    homeIconCaption.replace("</span>", cvLink + "</span>"),
  ]) assert.equal(normalizeHomeIconsHtml(changed), changed);
  assert.equal(normalizeHomeIconsHtml("before" + homeIconCaption + "after"), "before" + originalHomeCaption + "after");
});
