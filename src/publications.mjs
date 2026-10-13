import { escape as e } from "./helpers.mjs";

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

export function publicationLinks(p) {
  const links = p.doi ? [{ href: `https://doi.org/${p.doi}`, text: p.preprint ? "Preprint record" : "DOI record" }] : [];
  for (const link of p.links || []) {
    if (!links.some((l) => l.href === link.href || l.href === link.href.replace(/^http:/, "https:")))
      links.push({ ...link, text: "Publisher record" });
  }
  return links;
}

// All research citations use the same authors/title/bibliography as the listing.
export function publicationCitation(p) {
  const link = publicationLinks(p)[0];
  const title = link ? `<a href="${e(link.href)}">${e(p.title)}</a>` : e(p.title);
  return `[${e(p.id)}] ${publicationAuthors(p)}, “${title},” ${e(publicationMetadata(p))}`;
}
