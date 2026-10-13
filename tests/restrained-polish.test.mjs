import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createPages } from "../src/templates.mjs";
import { imageRenderer } from "../src/helpers.mjs";

const root = path.resolve(import.meta.dirname, "..");
const css = fs.readFileSync(path.join(root, "public/assets/site.css"), "utf8");
const screen = css.slice(0, css.indexOf("@media print"));
const print = css.slice(css.indexOf("@media print"));
const primary = ".home-hero .hero-actions > .button:first-child";
const rules = (source) => [...source.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .map((match) => ({ selectors: match[1].trim().split(/,\s*/), body: match[2] }));
const declarations = (body) => Object.fromEntries([...body.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)]
  .map((match) => [match[1], match[2].trim()]));
const desktop = screen.slice(0, screen.indexOf("@media"));
const rule = (selector, source = desktop) => Object.assign({}, ...rules(source)
  .filter((entry) => entry.selectors.includes(selector)).map((entry) => declarations(entry.body)));
const mobile = screen.slice(screen.indexOf("@media (max-width: 560px)"));
const tokens = rule(":root");

test("main navigation reserves a thin border before hover, focus or current-section styling", () => {
  assert.equal(rule(".primary-nav a")["border-bottom"], "0.0625rem solid transparent");
  assert.equal(rule(".primary-nav a")["padding-block"], "0.625rem");
  for (const state of [":hover", ":focus-visible", "[aria-current]"]) {
    assert.equal(rule(".primary-nav a" + state)["border-bottom-color"], "var(--maroon)", state);
    assert.equal(rule(".primary-nav a" + state).color, "var(--maroon)", state);
    assert.notEqual(rule(".primary-nav a" + state)["text-decoration"], "underline", state);
  }
  assert.equal(rule(".primary-nav .active-section")["border-bottom-color"], "var(--maroon)");
  assert.notEqual(rule(".primary-nav .active-section")["text-decoration"], "underline");
});

test("only the first home Research action receives the rectangular filled treatment", () => {
  const button = rule(primary);
  assert.equal(button.background, "var(--maroon)");
  assert.equal(button.color, "var(--paper)");
  assert.equal(button.border, "0.0625rem solid var(--maroon)");
  assert.equal(button["padding-inline"], "0.875rem");
  assert.equal(button["text-decoration"], "none");
  assert.equal(button["border-radius"] || "0", "0");
  const filled = rules(screen).filter((entry) => /background:\s*(?:var\(--maroon\)|#3b0000)/.test(entry.body));
  assert.equal(filled.length, 2);
  for (const entry of filled) assert.ok(entry.selectors.every((selector) => selector === primary || selector === primary + ":hover"));
  const site = JSON.parse(fs.readFileSync(path.join(root, "content/site.json"), "utf8"));
  const lab = JSON.parse(fs.readFileSync(path.join(root, "content/lab.json"), "utf8"));
  const home = createPages(site, lab, imageRenderer(path.join(root, "public"))).find((page) => page.route === "/");
  assert.match(home.body, /class="hero-actions"><a class="button" href="\/research\/">Research /);
  assert.match(home.body, /class="button button-secondary" href="\/publication\/">Publications /);
});

test("the primary hover subtly darkens while keyboard focus keeps its visible outline", () => {
  assert.equal(rule(primary + ":hover").background, "#3b0000");
  assert.equal(rule(primary + ":hover")["border-color"], "#3b0000");
  assert.equal(rule(":focus-visible").outline, "0.1875rem solid #245b86");
  assert.equal(rule(":focus-visible")["outline-offset"], "0.1875rem");
  for (const entry of rules(screen).filter((entry) => entry.selectors.some((selector) => selector.startsWith(primary))))
    assert.doesNotMatch(entry.body, /outline\s*:\s*(?:none|0)\s*;/);
});

test("the filled action has a black-on-paper print fallback even while hovered", () => {
  for (const selector of [primary, primary + ":hover"]) {
    const printed = rule(selector, print);
    assert.equal(printed.color, "#000", selector);
    assert.equal(printed.background, "none", selector);
    assert.equal(printed["border-color"], "#000", selector);
  }
});

test("the fine portrait outline never changes desktop or 96px mobile image geometry", () => {
  assert.deepEqual(rule(".faculty-portrait > img"), {
    width: "var(--portrait)",
    height: "12rem",
    "object-fit": "cover",
    "object-position": "center 30%",
    outline: "0.0625rem solid var(--rule)",
    "outline-offset": "0.25rem",
  });
  assert.equal(rule(".faculty-portrait", mobile)["--portrait"], "6rem");
  assert.deepEqual(rule(".faculty-portrait > img", mobile), { height: "7rem" });
  assert.equal(tokens["--portrait"], "11.25rem");
});

test("negative tracking is restricted to h1 and the brand, not supporting text", () => {
  assert.equal(rule("h1")["letter-spacing"], "-0.02em");
  assert.equal(rule(".brand")["letter-spacing"], "-0.015em");
  assert.equal(rule(".brand small")["letter-spacing"], "normal");
  for (const entry of rules(css).filter((entry) => /letter-spacing\s*:/.test(entry.body)))
    assert.ok(entry.selectors.every((selector) => ["h1", ".brand", ".brand small"].includes(selector)));
});

test("academic type sizes, white surfaces and unfilled shared buttons stay unchanged", () => {
  assert.equal(tokens["--paper"], "#fff");
  assert.equal(tokens["--text-body"], "1.0625rem");
  assert.equal(tokens["--text-small"], "0.9375rem");
  assert.equal(tokens["--text-title"], "2.125rem");
  assert.equal(tokens["--text-section"], "1.625rem");
  assert.equal(tokens["--text-project"], "1.3125rem");
  assert.equal(rule("h1")["font-size"], "var(--text-title)");
  assert.equal(rule("body").font, "400 var(--text-body)/1.6 var(--sans)");
  for (const selector of ["body", ".site-header", ".site-footer", ".contact-panel", ".scientific-figure"])
    assert.equal(rule(selector).background, "var(--paper)", selector);
  assert.deepEqual(rule(".button"), {
    display: "inline-flex", "align-items": "center", gap: "0.375rem",
    "min-height": "2.75rem", "font-size": "var(--text-small)", "font-weight": "600",
  });
  assert.equal(rule(".hero-actions").display, "flex");
  assert.equal(rule(".hero-actions")["flex-wrap"], "wrap");
  assert.equal(rule(".hero-actions").gap, "0.25rem 1.5rem");
  assert.equal(rule(":root", screen.slice(screen.indexOf("@media (max-width: 800px)")))["--gutter"], "1rem");
  assert.doesNotMatch(css, /gradient\(|box-shadow|@keyframes|animation\s*:|transition\s*:/);
});

test("scientific image sizing and viewer scrolling receive no decorative changes", () => {
  assert.deepEqual(rule(".scientific-figure img"), {
    width: "var(--image-width)", "max-width": "100%", height: "auto",
  });
  assert.deepEqual(rule(".figure-scroll img"), { "max-width": "none", height: "auto" });
  assert.equal(rule(".figure-scroll").overflow, "auto");
});
