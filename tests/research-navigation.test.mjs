import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const script = fs.readFileSync(new URL("../public/assets/site.js", import.meta.url), "utf8");

// Executes production event handlers; real layout and accessibility are parent QA.
function fixture() {
  const doc = {activeElement: null};
  class Element {
    constructor(classes = []) {
      this.classes = new Set(classes);
      this.children = [];
      this.listeners = new Map();
      this.attrs = new Map();
      this.hidden = false;
      this.style = {};
      this.dataset = {};
      this.classList = {
        add: (v) => this.classes.add(v), remove: (v) => this.classes.delete(v),
        contains: (v) => this.classes.has(v),
        toggle: (v, force = !this.classes.has(v)) => force ? this.classes.add(v) : this.classes.delete(v),
      };
    }
    append(...children) { for (const c of children) { c.parent = this; this.children.push(c); } }
    contains(target) { return this === target || this.children.some((c) => c.contains(target)); }
    addEventListener(type, fn) { this.listeners.set(type, [...(this.listeners.get(type) || []), fn]); }
    emit(type, values = {}) {
      const event = {target: this, pointerType: "mouse", key: "", relatedTarget: null,
        defaultPrevented: false, stopped: false,
        preventDefault() { this.defaultPrevented = true; },
        stopPropagation() { this.stopped = true; }, ...values};
      for (let node = this; node; node = event.stopped ? null : node.parent)
        for (const fn of node.listeners.get(type) || []) fn(event);
      return event;
    }
    setAttribute(k, v) { this.attrs.set(k, String(v)); }
    getAttribute(k) { return this.attrs.get(k) ?? null; }
    getClientRects() {
      for (let node = this; node; node = node.parent)
        if (node.hidden || (node === nav && media.matches &&
          header.classList.contains("has-menu") && !header.classList.contains("nav-open"))) return [];
      return [this.getBoundingClientRect()];
    }
    focus() {
      if (this.getClientRects().length) doc.activeElement = this;
    }
    getBoundingClientRect() { return {left: 24, width: 300, right: 324}; }
    querySelector(selector) { return this.map?.[selector] || null; }
    querySelectorAll(selector) { return this.all?.[selector] || []; }
    closest(selector) { return selector === ".site-header" ? (header.contains(this) ? header : null) : null; }
  }
  const documentEvents = new Element();
  const header = new Element(["site-header"]);
  const outer = new Element(["menu-toggle"]);
  outer.hidden = true;
  outer.setAttribute("aria-expanded", "false");
  outer.setAttribute("aria-controls", "primary-navigation");
  const nav = new Element();
  nav.id = "primary-navigation";
  header.append(outer, nav);
  const disclosures = [0, 1].map((i) => {
    const root = new Element(["research-disclosure"]);
    const link = new Element();
    link.setAttribute("href", "/research/");
    const toggle = new Element();
    toggle.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    const list = new Element();
    const links = [new Element(), new Element(), new Element()];
    list.append(...links);
    root.append(link, toggle, list);
    root.map = {"[data-research-toggle]": toggle, "[data-research-directions]": list};
    root.all = {"a": [link, ...links]};
    if (!i) nav.append(root);
    return {root, link, toggle, list, links};
  });
  const media = new Element();
  media.matches = false;
  const win = new Element();
  win.innerWidth = 1200;
  win.matchMedia = () => media;
  doc.getElementById = (id) => id === nav.id ? nav : null;
  doc.querySelector = (s) => ({".menu-toggle": outer, ".site-header": header, "#primary-navigation": nav}[s] || null);
  doc.querySelectorAll = (s) => ({
    ".research-disclosure": disclosures.map((d) => d.root),
    ".primary-nav a": [disclosures[0].link, ...disclosures[0].links],
  }[s] || []);
  doc.addEventListener = (...args) => documentEvents.addEventListener(...args);
  vm.runInNewContext(script, {document: doc, window: win, setTimeout});
  const body = new Element();
  documentEvents.append(header, disclosures[1].root, body);
  const flushLayout = () => {
    if (doc.activeElement && !doc.activeElement.getClientRects().length) doc.activeElement = body;
  };
  return {doc, header, outer, nav, disclosures, media, win, documentEvents, body, flushLayout};
}
const expectOpen = (d, open) => {
  assert.equal(d.list.hidden, !open);
  assert.equal(d.toggle.getAttribute("aria-expanded"), String(open));
};

test("progressive enhancement exposes functioning toggles and collapses lists with matching ARIA", () => {
  const f = fixture();
  for (const d of f.disclosures) {
    assert.equal(d.toggle.hidden, false);
    expectOpen(d, false);
    d.toggle.emit("click");
    expectOpen(d, true);
    d.toggle.emit("click");
    expectOpen(d, false);
    assert.equal(d.link.getAttribute("href"), "/research/");
  }
});

test("mouse hover opens and menu travel does not close, while touch hover is ignored", () => {
  const f = fixture();
  const d = f.disclosures[0];
  d.root.emit("pointerenter", {pointerType: "touch"});
  expectOpen(d, false);
  d.root.emit("pointerenter");
  expectOpen(d, true);
  d.links[0].emit("pointerover");
  expectOpen(d, true);
  d.root.emit("pointerleave");
  expectOpen(d, false);
});

test("keyboard/touch click exposes every normal link and nested Escape restores its toggle", () => {
  const f = fixture();
  f.outer.emit("click");
  const d = f.disclosures[0];
  d.toggle.focus();
  d.toggle.emit("click");
  for (const link of d.links) {
    link.focus();
    expectOpen(d, true);
  }
  const event = d.links.at(-1).emit("keydown", {key: "Escape"});
  expectOpen(d, false);
  assert.equal(f.doc.activeElement, d.toggle);
  assert.equal(event.defaultPrevented, true);
  assert.equal(f.outer.getAttribute("aria-expanded"), "true");
  d.toggle.emit("keydown", {key: "Escape"});
  assert.equal(f.outer.getAttribute("aria-expanded"), "false");
  assert.equal(f.doc.activeElement, f.outer);
});

test("focus movement inside keeps disclosure open and focus departure closes without stealing focus", () => {
  const f = fixture();
  const d = f.disclosures[1];
  d.toggle.emit("click");
  d.root.emit("focusout", {relatedTarget: d.links[1]});
  expectOpen(d, true);
  d.links[1].focus();
  d.root.emit("pointerleave");
  expectOpen(d, true);
  f.outer.focus();
  d.root.emit("focusout", {relatedTarget: f.outer});
  expectOpen(d, false);
  assert.equal(f.doc.activeElement, f.outer);
});

test("outside pointer click dismisses but clicking inside preserves navigation", () => {
  const f = fixture();
  const d = f.disclosures[0];
  d.toggle.emit("click");
  f.documentEvents.emit("pointerdown", {target: d.links[0]});
  expectOpen(d, true);
  f.documentEvents.emit("pointerdown", {target: f.outer});
  expectOpen(d, false);
  assert.equal(d.link.emit("click").defaultPrevented, false);
});

test("outer mobile-nav closure resets nested state even if Escape originates outside the disclosure", () => {
  const f = fixture();
  const d = f.disclosures[0];
  f.outer.emit("click");
  d.toggle.emit("click");
  f.outer.emit("keydown", {key: "Escape"});
  expectOpen(d, false);
  assert.equal(f.outer.getAttribute("aria-expanded"), "false");
  assert.equal(f.doc.activeElement, f.outer);
});

test("viewport changes close disclosures and return focus from a hidden direction", () => {
  const f = fixture();
  const d = f.disclosures[1];
  d.toggle.emit("click");
  d.links[0].focus();
  f.win.emit("resize");
  expectOpen(d, false);
  assert.equal(f.doc.activeElement, d.toggle);
  f.outer.emit("click");
  f.disclosures[0].toggle.emit("click");
  f.disclosures[0].links[0].focus();
  f.media.matches = true;
  f.media.emit("change");
  expectOpen(f.disclosures[0], false);
  assert.equal(f.doc.activeElement, f.outer);
});

test("desktop dropdown positioning clamps both viewport edges even when navigation wraps", () => {
  const f = fixture();
  const d = f.disclosures[0];
  f.win.innerWidth = 1000;
  d.list.getBoundingClientRect = () => ({width: 416});
  for (const left of [4, 750]) {
    d.root.getBoundingClientRect = () => ({left});
    d.toggle.emit("click");
    const panelLeft = left + Number.parseFloat(d.list.style.left);
    assert.ok(panelLeft >= 16);
    assert.ok(panelLeft + 416 <= f.win.innerWidth - 16);
    d.toggle.emit("click");
  }
});

test("outside clicks leave no hidden focused link and null focus departure dismisses", () => {
  const f = fixture();
  const d = f.disclosures[0];
  d.toggle.emit("click");
  d.links[0].focus();
  f.documentEvents.emit("pointerdown", {target: f.header});
  expectOpen(d, false);
  assert.equal(f.doc.activeElement, d.toggle);
  d.toggle.emit("click");
  d.root.emit("focusout", {relatedTarget: null});
  expectOpen(d, false);
});

test("link activation cannot leave focus in the hidden direction list", () => {
  const f = fixture();
  const d = f.disclosures[1];
  d.toggle.emit("click");
  d.links[0].focus();
  assert.equal(d.links[0].emit("click", {ctrlKey: true}).defaultPrevented, false);
  expectOpen(d, false);
  assert.equal(f.doc.activeElement, d.toggle);
});

test("mobile route-link closure returns focus to the visible outer navigation button", () => {
  const f = fixture();
  f.media.matches = true;
  f.outer.emit("click");
  const d = f.disclosures[0];
  d.toggle.emit("click");
  d.links[0].focus();
  assert.equal(d.links[0].emit("click", {ctrlKey: true}).defaultPrevented, false);
  expectOpen(d, false);
  assert.equal(f.outer.getAttribute("aria-expanded"), "false");
  assert.equal(f.doc.activeElement, f.outer);
});

test("desktop direction focus transfers directly to Menu when mobile layout collapses its navigation", () => {
  for (const resizeFirst of [true, false]) {
    const f = fixture();
    const d = f.disclosures[0];
    d.toggle.emit("click");
    d.links[0].focus();
    f.media.matches = true;
    f.win.innerWidth = 390;
    const events = resizeFirst ? [[f.win, "resize"], [f.media, "change"]]
      : [[f.media, "change"], [f.win, "resize"]];
    for (const [target, type] of events) {
      target.emit(type);
      f.flushLayout();
    }
    expectOpen(d, false);
    assert.equal(f.doc.activeElement, f.outer, `resizeFirst=${resizeFirst}`);
    assert.notEqual(f.doc.activeElement, f.body);
    assert.equal(f.outer.getAttribute("aria-expanded"), "false");
  }
});

test("collapsed navigation restores focus from the browser focusout origin before resize handlers", () => {
  for (const direction of [false, true]) {
    const f = fixture();
    const d = f.disclosures[0];
    d.toggle.emit("click");
    const origin = direction ? d.links[0] : d.link;
    origin.focus();
    f.media.matches = true;
    f.flushLayout();
    assert.equal(f.doc.activeElement, f.body);
    origin.emit("focusout", {relatedTarget: null});
    assert.equal(f.doc.activeElement === f.outer, true, `direction=${direction}`);
    f.win.emit("resize");
    f.media.emit("change");
    expectOpen(d, false);
    assert.equal(f.doc.activeElement, f.outer);
  }
});

test("null focus departure from visible mobile navigation does not steal focus", () => {
  const f = fixture();
  f.media.matches = true;
  f.outer.emit("click");
  const d = f.disclosures[0];
  d.toggle.emit("click");
  d.links[0].focus();
  f.doc.activeElement = f.body;
  d.links[0].emit("focusout", {relatedTarget: null});
  expectOpen(d, false);
  assert.equal(f.doc.activeElement, f.body);
});

for (const [index, scope] of [[0, "header"], [1, "home"]]) {
  test(`${scope} hover-only disclosure dismisses on Escape without moving outside focus`, () => {
    for (const bodyFocus of [true, false]) {
      const f = fixture();
      const d = f.disclosures[index];
      const outside = bodyFocus ? f.body : f.disclosures[1 - index].link;
      outside.focus();
      d.root.emit("pointerenter");
      expectOpen(d, true);
      const event = outside.emit("keydown", {key: "Escape"});
      expectOpen(d, false);
      assert.equal(f.doc.activeElement, outside);
      assert.equal(event.defaultPrevented, false);
      assert.equal(event.stopped, false);
    }
  });
}

test("document dismissal leaves non-Escape and already handled key events alone", () => {
  const f = fixture();
  f.body.focus();
  for (const d of f.disclosures) d.root.emit("pointerenter");
  for (const values of [{key: "Tab"}, {key: "Escape", defaultPrevented: true}]) {
    f.body.emit("keydown", values);
    for (const d of f.disclosures) expectOpen(d, true);
    assert.equal(f.doc.activeElement, f.body);
  }
  const event = f.body.emit("keydown", {key: "Escape"});
  for (const d of f.disclosures) expectOpen(d, false);
  assert.equal(event.defaultPrevented, false);
  assert.equal(f.doc.activeElement, f.body);
});
