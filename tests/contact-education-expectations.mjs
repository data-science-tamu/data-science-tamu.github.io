import { escape } from "../src/helpers.mjs";

export const educationItemHtml = (degree) =>
  '<li><span class="degree">' + escape(degree.degree) + ' <span>(' + escape(degree.dates) + ')</span></span><div><strong>' + escape(degree.field) + '</strong>, <span class="institution">' + escape(degree.institution) + '</span></div></li>';

// Reverse only the approved presentation delta, retaining historical byte guards.
export function normalizeContactEducationHtml(html) {
  return html
    .replace(/(<span class="degree">[^<]+ <span>)\(([^<]+)\)(<\/span><\/span><div><strong>[^<]+<\/strong>), (<span class="institution">)/g, '$1$2$3$4')
    .replace(/<a class="person-link" href="\/cv\/" aria-label="([^"]+): CV \(Curriculum vitae\)" title="\1: CV \(Curriculum vitae\)">CV<\/a>/g,
      (_, name) => '<a class="person-link" href="/cv/" aria-label="' + name + ': Curriculum vitae" title="' + name + ': Curriculum vitae"><svg class="person-icon person-icon-cv" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8m-8 4h8m-8 3h5"/></svg></a>');
}
