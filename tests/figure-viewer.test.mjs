import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const script = fs.readFileSync(new URL("../public/assets/site.js", import.meta.url), "utf8");

// A small DOM platform double exercises the real client script without browser QA.
function fixture({ supported = true, throws = false, movesScroll = false } = {}) {
  const doc = { activeElement: null };
  class Element {
    constructor() {
      this.listeners = new Map();
      this.attributes = new Map();
      this.dataset = {};
      this.style = {};
      this.children = [];
      this.hidden = false;
      this.disabled = false;
      this.isConnected = true;
      this.textContent = "";
    }
    addEventListener(type, handler, options = {}) {
      const events = this.listeners.get(type) || [];
      events.push({ handler, once: options.once });
      this.listeners.set(type, events);
    }
    emit(type, extra = {}) {
      const event = { button: 0, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...extra };
      for (const listener of [...(this.listeners.get(type) || [])]) {
        if (listener.once) this.listeners.set(type, this.listeners.get(type).filter((l) => l !== listener));
        listener.handler(event);
      }
      return event;
    }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    hasAttribute(name) { return this.attributes.has(name); }
    focus() { doc.activeElement = this; }
    replaceChildren(...children) { this.children = children; }
  }
  const body = new Element();
  body.style.overflow = "clip";
  const dialog = new Element();
  dialog.hidden = true;
  dialog.open = false;
  const title = new Element();
  const close = new Element();
  const original = new Element();
  const status = new Element();
  const scroll = new Element();
  scroll.clientWidth = 600;
  scroll.clientHeight = 320;
  scroll.scrollLeft = 50;
  scroll.scrollTop = 80;
  const slot = new Element();
  const scales = ["fit", "1", "2"].map((scale) => {
    const button = new Element();
    button.dataset.viewerScale = scale;
    return button;
  });
  const map = new Map([
    ["[data-viewer-title]", title], ["[data-viewer-close]", close],
    ["[data-viewer-original]", original], ["[data-viewer-status]", status],
    [".figure-scroll", scroll], ["[data-viewer-image]", slot],
  ]);
  dialog.querySelector = (selector) => map.get(selector) || null;
  const focusables = () => [close, ...scales.filter((b) => !b.disabled), original, scroll];
  dialog.querySelectorAll = (selector) => selector === "[data-viewer-scale]" ? scales : focusables();
  if (supported) dialog.showModal = () => {
    if (throws) throw new Error("Modal unavailable");
    dialog.open = true;
    if (movesScroll) win.scrollY = 0;
    close.focus();
  };
  dialog.close = () => {
    dialog.open = false;
    dialog.emit("close");
  };
  const links = ["/assets/images/research-1-cd79bc1b85.png", "/assets/images/research-1-2c2733ddd9.png"].map((src, i) => {
    const link = new Element();
    link.setAttribute("href", src);
    link.dataset.figureTitle = `Existing figure ${i + 1}`;
    const image = new Element();
    image.alt = `Original scientific label ${i + 1}`;
    link.closest = () => ({ querySelector: () => image });
    return link;
  });
  doc.body = body;
  doc.querySelector = (selector) => selector === "#figure-viewer" ? dialog : null;
  doc.querySelectorAll = (selector) => selector === "[data-figure-open]" ? links : [];
  const win = new Element();
  win.scrollX = 12;
  win.scrollY = 300;
  win.scrollTo = (x, y) => { win.restoredScroll = [x, y]; };
  const images = [];
  class Image extends Element {
    constructor() {
      super();
      this.naturalWidth = 1165;
      this.naturalHeight = 434;
      images.push(this);
    }
  }
  vm.runInNewContext(script, { document: doc, window: win, Image, setTimeout });
  return { doc, body, dialog, title, close, original, status, scroll, slot, scales, links, win, images };
}

function open(f) {
  const event = f.links[0].emit("click");
  assert.equal(event.defaultPrevented, true, "Normal link is enhanced only after successful modal opening");
  assert.equal(f.dialog.open, true);
  return f.images.at(-1);
}

test("a normal figure link opens at original 100% resolution and keeps source/alt/title", () => {
  const f = fixture();
  const image = open(f);
  assert.equal(f.dialog.hidden, false);
  assert.equal(f.title.textContent, f.links[0].dataset.figureTitle);
  assert.equal(f.original.getAttribute("href"), f.links[0].getAttribute("href"));
  assert.equal(image.src, f.links[0].getAttribute("href"));
  assert.equal(image.alt, "Original scientific label 1");
  assert.ok(f.scales.every((s) => s.disabled), "Loading controls are not active");
  image.emit("load");
  assert.equal(image.style.width, "1165px");
  assert.equal(image.style.height, "auto");
  assert.equal(f.scales[1].getAttribute("aria-pressed"), "true");
  assert.ok(f.scales.every((s) => !s.disabled));
  assert.equal(f.scroll.scrollLeft, 0);
  assert.equal(f.scroll.scrollTop, 0);
});

test("Fit contains the complete image without upscaling, and 200% grows layout for corner scrolling", () => {
  const f = fixture();
  const image = open(f);
  image.emit("load");
  f.scales[0].emit("click");
  assert.ok(Number.parseFloat(image.style.width) <= 600);
  assert.ok(Number.parseFloat(image.style.width) / 1165 * 434 <= 320);
  f.scales[2].emit("click");
  assert.equal(image.style.width, "2330px");
  assert.equal(image.style.height, "auto");
  assert.equal(f.scales[2].getAttribute("aria-pressed"), "true");
  assert.match(f.status.textContent, /magnification|magnified/i);
  f.scales[1].emit("click");
  assert.equal(image.style.width, "1165px");
});

test("Fit responds to viewport resizing while 100% stays at natural width", () => {
  const f = fixture();
  const image = open(f);
  image.emit("load");
  f.scales[0].emit("click");
  f.scroll.clientWidth = 280;
  f.win.emit("resize");
  assert.ok(Number.parseFloat(image.style.width) <= 280);
  f.scales[1].emit("click");
  f.win.emit("resize");
  assert.equal(image.style.width, "1165px");
});

test("Close restores the opener, exact prior body overflow and page scroll position", () => {
  const f = fixture();
  open(f).emit("load");
  assert.equal(f.body.style.overflow, "hidden");
  f.close.emit("click");
  assert.equal(f.dialog.open, false);
  assert.equal(f.dialog.hidden, true);
  assert.equal(f.body.style.overflow, "clip");
  assert.equal(f.doc.activeElement, f.links[0]);
  assert.deepEqual(f.win.restoredScroll, [12, 300]);
});

test("native Escape cancellation closes and restores focus/scroll", () => {
  const f = fixture();
  open(f);
  const event = f.dialog.emit("cancel");
  assert.equal(event.defaultPrevented, true);
  assert.equal(f.dialog.open, false);
  assert.equal(f.doc.activeElement, f.links[0]);
  assert.equal(f.body.style.overflow, "clip");
});

test("Tab and Shift+Tab wrap between the keyboard scroll region and first control", () => {
  const f = fixture();
  open(f).emit("load");
  f.scroll.focus();
  assert.equal(f.dialog.emit("keydown", { key: "Tab" }).defaultPrevented, true);
  assert.equal(f.doc.activeElement, f.close);
  assert.equal(f.dialog.emit("keydown", { key: "Tab", shiftKey: true }).defaultPrevented, true);
  assert.equal(f.doc.activeElement, f.scroll);
});

test("modified, middle-button, pre-cancelled and new-tab clicks are never intercepted", () => {
  for (const modifier of ["ctrlKey", "metaKey", "altKey", "shiftKey"]) {
    const f = fixture();
    assert.equal(f.links[0].emit("click", { [modifier]: true }).defaultPrevented, false, modifier);
    assert.equal(f.dialog.open, false);
  }
  for (const options of [{ button: 1 }, { button: 2 }, { defaultPrevented: true }]) {
    const f = fixture();
    const event = f.links[0].emit("click", options);
    assert.equal(event.defaultPrevented, Boolean(options.defaultPrevented));
    assert.equal(f.dialog.open, false);
  }
  const f = fixture();
  f.links[0].setAttribute("target", "_blank");
  assert.equal(f.links[0].emit("click").defaultPrevented, false);
});

test("unsupported or failed native dialogs leave the original links and body untouched", () => {
  for (const options of [{ supported: false }, { throws: true }]) {
    const f = fixture(options);
    assert.equal(f.links[0].emit("click").defaultPrevented, false);
    assert.equal(f.dialog.hidden, true);
    assert.equal(f.body.style.overflow, "clip");
  }
});

test("image errors provide recovery and keep magnification controls disabled", () => {
  const f = fixture();
  const image = open(f);
  image.emit("error");
  assert.match(f.status.textContent, /could not load|unable to load/i);
  assert.match(f.status.textContent, /original/i);
  assert.ok(f.scales.every((s) => s.disabled));
  assert.equal(image.hidden, true);
  assert.equal(f.original.getAttribute("href"), f.links[0].getAttribute("href"));
  f.close.emit("click");
  assert.equal(f.body.style.overflow, "clip");
});

test("late events from a closed figure cannot change the next figure", () => {
  const f = fixture();
  const stale = open(f);
  f.close.emit("click");
  f.links[1].emit("click");
  const current = f.images.at(-1);
  assert.notEqual(stale, current);
  stale.emit("load");
  stale.emit("error");
  assert.ok(f.scales.every((s) => s.disabled));
  current.emit("load");
  assert.ok(f.scales.every((s) => !s.disabled));
  assert.equal(f.title.textContent, f.links[1].dataset.figureTitle);
});

test("scroll restoration uses the page position before modal autofocus can move it", () => {
  const f = fixture({ movesScroll: true });
  open(f);
  f.close.emit("click");
  assert.deepEqual(f.win.restoredScroll, [12, 300]);
});
