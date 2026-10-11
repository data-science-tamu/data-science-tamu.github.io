const toggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
if (toggle && header) {
  toggle.hidden = false;
  header.classList.add("has-menu");
  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    header.classList.remove("nav-open");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    header.classList.toggle("nav-open", open);
  });
  header.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      close();
      toggle.focus();
    }
  });
  document
    .querySelectorAll(".primary-nav a")
    .forEach((a) => a.addEventListener("click", close));
  window.matchMedia("(min-width: 801px)").addEventListener("change", close);
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
