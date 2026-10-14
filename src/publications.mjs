import { escape as e, anchor, rich } from "./helpers.mjs";

// Storage IDs and shared fragments stay stable; journal labels follow listing order.
export function publicationPresentation(publications) {
  let journalNumber = publications.filter((p) => p.type === "journal").length;
  return new Map(publications.map((p) => [p.id, {
    ...p, displayId: p.type === "journal" ? `J${journalNumber--}` : p.id,
  }]));
}

export function publicationAuthors(p, annotated = true) {
  return p.authors.map((a, i) => {
    const name = e(a.name);
    const author = annotated && a.advisee
      ? `<span class="advisee">${name}<span class="visually-hidden"> (advisee)</span></span>`
      : name;
    const marker = annotated && a.corresponding
      ? '<sup aria-label="corresponding author">*</sup>' : "";
    return `${i ? i === p.authors.length - 1 ? (i === 1 ? " and " : ", and ") : ", " : ""}${author}${marker}`;
  }).join("");
}

export function publicationMetadata(p) {
  const parts = [];
  if (p.type === "review") {
    parts.push(p.status === "major revision" ? `Major revision at ${p.venue}` : "Under review");
  } else if (p.type === "working") {
    parts.push("Working paper");
  } else {
    parts.push(p.venue);
    if (p.volume) parts.push(`vol. ${p.volume}`);
    if (p.issue) parts.push(`no. ${p.issue}`);
    if (p.issueLabel === "Supplement") parts.push(p.issueLabel);
    if (p.pages) parts.push(`pp. ${p.pages.replaceAll("-", "–")}`);
    if (p.articleNumber) parts.push(`article ${p.articleNumber}`);
  }
  if (p.status === "accepted") parts.push("Accepted");
  if (p.year) parts.push(p.year);
  if (p.onlineDate) parts.push(`Published online ${p.onlineDate}`);
  if (p.issueLabel && p.issueLabel !== "Supplement") parts.push(p.issueLabel);
  if (p.event) parts.push(p.event);
  if (p.location) parts.push(p.location);
  if (p.eventDates) parts.push(p.eventDates);
  if (p.preprint) parts.push(`${p.preprint} preprint`);
  if (p.doi) parts.push(`doi:${p.doi}`);
  return parts.join(", ") + ".";
}

export function publicationPrimaryLink(p) {
  return p.doi ? `https://doi.org/${p.doi}` : p.links?.[0]?.href;
}

// All research citations use the same authors/title/bibliography as the listing.
export function publicationCitation(recordId, publicationsById) {
  const p = publicationsById?.get?.(recordId);
  if (!p?.displayId) throw new Error("Invalid publication presentation context");
  const href = publicationPrimaryLink(p);
  const title = href ? `<a href="${e(href)}">${e(p.title)}</a>` : e(p.title);
  return `[${e(p.displayId)}] ${publicationAuthors(p)}, “${title},” ${e(publicationMetadata(p))}`;
}

// Only exact bracketed reference groups in maintained text are presentation tokens.
export function publicationReferences(html, publicationsById) {
  let inLink = false;
  return rich(html).split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) {
      if (part.startsWith('<a ')) inLink = true;
      if (part === "</a>") inLink = false;
      return part;
    }
    return part.replace(/\[((?:[JC]\d+\*?)(?:\s*,\s*[JC]\d+\*?)*)\]/g, (group) =>
      group.replace(/[JC]\d+\*?/g, (id) => {
        const p = publicationsById.get(id) || [...publicationsById.values()]
          .find((record) => record.legacyAnchors?.includes(anchor(id)));
        if (!p && id.startsWith("J")) throw new Error(`Invalid journal reference: ${id}`);
        if (!p) return id; // Preserve pre-existing source-only conference references, e.g. C5.
        if (!p.displayId) throw new Error("Invalid publication presentation context");
        return inLink ? e(p.displayId) : `<a href="/publication/#${anchor(p.id)}">${e(p.displayId)}</a>`;
      }));
  }).join("");
}
