import { escape as e, anchor } from "./helpers.mjs";
import { publicationCitation, publicationReferences } from "./publications.mjs";

// Presentation is authored in maintained data, never inferred from prose.
export function researchContent(items, publicationsById, headingLevel = 4) {
  let html = "", publications = false, citationList = false, fieldList = false;
  const content = (html) => publicationReferences(html, publicationsById);
  const closeList = () => {
    if (citationList) html += "</ul>";
    citationList = false;
  };
  const closeFields = () => {
    if (fieldList) html += "</ul>";
    fieldList = false;
  };
  for (const item of items) {
    const kind = item.kind || "paragraph";
    if (!["paragraph", "collaborators", "citation", "publication-heading", "list"].includes(kind) ||
        (item.notes && kind !== "citation") || (item.items && kind !== "list"))
      throw new Error("Invalid research presentation metadata");
    if (item.label !== undefined && (kind !== "paragraph" ||
        typeof item.label !== "string" || !item.label.trim() ||
        typeof item.html !== "string" || !item.html.startsWith(item.label)))
      throw new Error("Invalid research paragraph label");
    const field = kind === "collaborators" || item.label !== undefined;
    if (!field) closeFields();
    if (kind === "citation") {
      const publication = publicationsById.get(item.recordId);
      if (!publication) throw new Error("Invalid research citation record");
      if (!publications) {
        html += `<section class="project-publications"><h${headingLevel}>Publications</h${headingLevel}>`;
        publications = true;
      }
      if (!citationList) html += '<ul class="research-publications">';
      citationList = true;
      html += `<li><p>${publicationCitation(item.recordId, publicationsById)}</p><p class="project-refs">Publication record: <a href="/publication/#${anchor(publication.id)}">[${e(publication.displayId)}]</a></p>${item.notes?.length ? `<ul class="citation-notes">${item.notes.map((n) => `<li>${content(n.html)}</li>`).join("")}</ul>` : ""}</li>`;
      continue;
    }
    closeList();
    if (kind === "publication-heading") {
      if (!publications) throw new Error("Invalid research publication heading");
      html += `<p class="publication-group-label"><strong>${content(item.html)}</strong></p>`;
      continue;
    }
    if (publications) {
      html += "</section>";
      publications = false;
    }
    if (kind === "list") {
      if (!Array.isArray(item.items) || !item.items.length) throw new Error("Invalid research overview list");
      html += `<section class="research-overview-group"><h3>${content(item.html)}</h3><ul>${item.items.map((p) => `<li>${content(p.html)}</li>`).join("")}</ul></section>`;
      continue;
    }
    if (field) {
      if (!fieldList) html += '<ul class="project-fields">';
      fieldList = true;
      html += kind === "collaborators"
        ? `<li class="project-collaborators"><strong>Collaborators:</strong> ${content(item.html)}</li>`
        : `<li><strong>${e(item.label)}</strong>${content(item.html.slice(item.label.length))}</li>`;
      continue;
    }
    html += `<p>${content(item.html)}</p>`;
  }
  closeFields();
  closeList();
  if (publications) html += "</section>";
  return html;
}
