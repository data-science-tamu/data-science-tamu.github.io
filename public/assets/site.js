const toggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const navigation = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
const researchClosers = [];
for (const root of document.querySelectorAll(".research-disclosure")) {
  const control = root.querySelector("[data-research-toggle]");
  const directions = root.querySelector("[data-research-directions]");
  if (!control || !directions) continue;
  const viewport = window.matchMedia("(max-width: 800px)");
  const close = (restore = false) => {
    const focusedDirection = directions.contains(document.activeElement);
    if (restore && focusedDirection) {
      const owner = viewport.matches && navigation?.contains(root) && !navigation.getClientRects().length
        ? toggle : control;
      owner.focus();
    }
    directions.hidden = true;
    control.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    directions.hidden = false;
    control.setAttribute("aria-expanded", "true");
    if (!viewport.matches) {
      // Clamp relative positioning to the viewport even if the header wraps.
      const { left } = root.getBoundingClientRect();
      const { width } = directions.getBoundingClientRect();
      directions.style.left = `${Math.max(16, Math.min(left, window.innerWidth - width - 16)) - left}px`;
    }
  };
  control.addEventListener("click", () => directions.hidden ? open() : close());
  root.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") open();
  });
  root.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !root.contains(document.activeElement)) close();
  });
  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || directions.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    close();
    control.focus();
  });
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) close();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!root.contains(event.target)) close(true);
  });
  for (const link of root.querySelectorAll("a")) link.addEventListener("click", () => close(true));
  viewport.addEventListener("change", () => close(true));
  window.addEventListener("resize", () => close(true));
  researchClosers.push({root, close});
  close();
  root.classList.add("research-enhanced");
  control.hidden = false;
}
if (researchClosers.length) document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || event.defaultPrevented) return;
  for (const {root, close} of researchClosers)
    if (!root.contains(document.activeElement)) close();
});

if (toggle && header) {
  const viewport = window.matchMedia("(max-width: 800px)");
  toggle.hidden = false;
  header.classList.add("has-menu");
  const close = () => {
    const focusInside = navigation?.contains(document.activeElement);
    for (const disclosure of researchClosers)
      if (header.contains(disclosure.root)) disclosure.close(true);
    toggle.setAttribute("aria-expanded", "false");
    header.classList.remove("nav-open");
    if (viewport.matches && focusInside) toggle.focus();
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    if (!open) close();
    toggle.setAttribute("aria-expanded", String(open));
    header.classList.toggle("nav-open", open);
  });
  header.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      close();
      toggle.focus();
    }
  });
  document.querySelectorAll(".primary-nav a").forEach((a) => a.addEventListener("click", close));
  navigation?.addEventListener("focusout", (event) => {
    // CSS can blur a collapsed nav's child before resize/media-change handlers run.
    if (!event.relatedTarget && viewport.matches && !navigation.getClientRects().length)
      toggle.focus();
  });
  viewport.addEventListener("change", close);
}

const form = document.querySelector("#publication-filters");
if (form) {
  const search = document.querySelector("#publication-search");
  const year = document.querySelector("#publication-year");
  const type = document.querySelector("#publication-type");
  const entries = [...document.querySelectorAll(".publication")];
  const groups = [...document.querySelectorAll(".publication-group")];
  const count = document.querySelector("#publication-count");
  const empty = document.querySelector("#publication-empty");
  function filter() {
    const query = search.value.trim().toLocaleLowerCase("en");
    let visible = 0;
    for (const entry of entries) {
      entry.hidden = !(
        entry.textContent.toLocaleLowerCase("en").includes(query) &&
        (!year.value || entry.dataset.year === year.value) &&
        (!type.value || entry.dataset.type === type.value)
      );
      if (!entry.hidden) visible++;
    }
    for (const group of groups)
      group.hidden = ![...group.querySelectorAll(".publication")].some(
        (p) => !p.hidden,
      );
    count.textContent = `${visible} of ${entries.length} publication${visible === 1 ? "" : "s"}`;
    empty.hidden = visible > 0;
  }
  form.hidden = false;
  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("input", filter);
  form.addEventListener("change", filter);
  form.addEventListener("reset", () => setTimeout(filter, 0));
  document.querySelector("#empty-reset").addEventListener("click", () => {
    form.reset();
    search.focus();
  });
  filter();
}

const dialog = document.querySelector("#figure-viewer");
if (typeof dialog?.showModal === "function") {
  const title = dialog.querySelector("[data-viewer-title]");
  const close = dialog.querySelector("[data-viewer-close]");
  const original = dialog.querySelector("[data-viewer-original]");
  const status = dialog.querySelector("[data-viewer-status]");
  const scroll = dialog.querySelector(".figure-scroll");
  const slot = dialog.querySelector("[data-viewer-image]");
  const scales = [...dialog.querySelectorAll("[data-viewer-scale]")];
  let currentImage = null;
  let loaded = false;
  let mode = "1";
  let opener = null;
  let priorOverflow = "";
  let priorScroll = [0, 0];

  function setScale(value) {
    if (!loaded || !currentImage) return;
    mode = value;
    const { naturalWidth, naturalHeight } = currentImage;
    const scale = value === "fit"
      ? Math.min(1, scroll.clientWidth / naturalWidth, scroll.clientHeight / naturalHeight)
      : Number(value);
    // Real dimensions, not transforms, keep the top-left and all corners reachable.
    currentImage.style.width = `${naturalWidth * scale}px`;
    currentImage.style.height = "auto";
    for (const button of scales)
      button.setAttribute("aria-pressed", String(button.dataset.viewerScale === value));
    status.textContent = value === "fit"
      ? "Fit overview. Select 100% to read at original resolution."
      : value === "2"
        ? "200% magnification. Magnification does not add detail to the original."
        : "100% original resolution. Scroll the image area to read all corners.";
  }

  for (const button of scales)
    button.addEventListener("click", () => setScale(button.dataset.viewerScale));
  window.addEventListener("resize", () => {
    if (!dialog.open || mode !== "fit") return;
    setScale("fit");
  });
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener("close", () => {
    dialog.hidden = true;
    currentImage = null;
    loaded = false;
    if (!opener) return;
    document.body.style.overflow = priorOverflow;
    window.scrollTo(...priorScroll);
    if (opener.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')];
    const first = focusable[0];
    const last = focusable.at(-1);
    const active = document.activeElement;
    if (event.shiftKey ? active === first : active === last) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  });

  for (const link of document.querySelectorAll("[data-figure-open]")) {
    link.setAttribute("aria-haspopup", "dialog");
    link.setAttribute("aria-controls", "figure-viewer");
    link.addEventListener("click", (event) => {
      if ([event.defaultPrevented, event.button !== 0, event.ctrlKey,
        event.metaKey, event.shiftKey, event.altKey, link.hasAttribute("download")].some(Boolean)) return;
      const target = link.getAttribute("target");
      if (target) {
        if (target !== "_self") return;
      }
      if (dialog.open) return;
      title.textContent = link.dataset.figureTitle;
      original.setAttribute("href", link.getAttribute("href"));
      status.textContent = "Loading figure...";
      mode = "1";
      loaded = false;
      for (const button of scales) {
        button.disabled = true;
        button.setAttribute("aria-pressed", String(button.dataset.viewerScale === mode));
      }
      priorOverflow = document.body.style.overflow;
      priorScroll = [window.scrollX, window.scrollY];
      dialog.hidden = false;
      try {
        dialog.showModal();
      } catch {
        dialog.hidden = true;
        return;
      }
      // Only intercept after a working native modal is available.
      event.preventDefault();
      opener = link;
      document.body.style.overflow = "hidden";
      scroll.scrollLeft = 0;
      scroll.scrollTop = 0;
      const image = new Image();
      image.alt = link.closest(".scientific-figure").querySelector("img").alt;
      image.hidden = true;
      currentImage = image;
      slot.replaceChildren(image);
      image.addEventListener("load", () => {
        if (currentImage !== image || !dialog.open) return;
        if (!image.naturalWidth || !image.naturalHeight) return;
        loaded = true;
        image.hidden = false;
        for (const button of scales) button.disabled = false;
        setScale("1");
      }, { once: true });
      image.addEventListener("error", () => {
        if (currentImage !== image || !dialog.open) return;
        loaded = false;
        image.hidden = true;
        for (const button of scales) button.disabled = true;
        status.textContent = "Could not load this figure. Use the original image file link, or close and try again.";
      }, { once: true });
      image.src = link.getAttribute("href");
      close.focus();
    });
  }
}
