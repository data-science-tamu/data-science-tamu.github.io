import { escape as e, rich } from "./helpers.mjs";
import { researchContent } from "./research-content.mjs";

const arrow = `<span aria-hidden="true">&#8599;</span>`;

export function researchRenderers(img, originals, publicationsById) {
  const figure = (src, alt, caption = alt) =>
    `<figure class="scientific-figure"><a href="${e(originals.get(src) || src)}" data-figure-open data-figure-title="${e(caption)}" aria-label="${e(`View full-size figure: ${caption}`)}">${img(src, alt)}</a><figcaption>${e(caption)} <a href="${e(originals.get(src) || src)}" data-figure-open data-figure-title="${e(caption)}">View full-size figure ${arrow}</a></figcaption></figure>`;
  const project = (p) =>
    `<article class="project" id="${e(p.id)}"><div class="project-text"><h3>${e(p.title)}</h3>${p.prefix ? `<p class="small">${rich(p.prefix.html)}</p>` : ""}${researchContent(p.paragraphs, publicationsById)}</div>${figure(p.image, p.alt, p.title)}</article>`;
  return { figure, project };
}
