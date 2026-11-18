import { escape as e } from "./helpers.mjs";

const glyphs = {
  email: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
  profile: '<path d="m3 8 9-5 9 5H3Zm2 2v9m7-9v9m7-9v9M3 21h18"/>',
  scholar: '<path d="m2 8 10-5 10 5-10 5L2 8Zm4 3v6c4 3 8 3 12 0v-6m4-3v9"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="1"/><text x="12" y="17" text-anchor="middle" fill="currentColor" stroke="none" font-size="14" font-weight="700">in</text>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
};
const services = {
  email: "email",
  "faculty profile": "profile",
  profile: "profile",
  "google scholar": "scholar",
  scholar: "scholar",
  linkedin: "linkedin",
  "curriculum vitae": "cv",
  cv: "cv",
};

export function personLinks(name, email, links = []) {
  const available = [
    ...(typeof email === "string" && email.trim() ? [{ label: "Email", href: `mailto:${email}` }] : []),
    ...(Array.isArray(links) ? links : []),
  ].filter((link) => typeof link?.href === "string" && /^(?:https?:\/\/|mailto:|\/(?!\/))\S+$/.test(link.href));
  if (!available.length) return "";
  return `<span class="person-links">${available.map((link) => {
    const service = typeof link.label === "string" && link.label.trim() ? link.label : "Website";
    const icon = Object.hasOwn(services, service.toLowerCase()) ? services[service.toLowerCase()] : "globe";
    const label = e(`${name}: ${icon === "cv" ? "CV (Curriculum vitae)" : service}`);
    const content = icon === "cv" ? "CV" : `<svg class="person-icon person-icon-${icon}" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">${glyphs[icon]}</svg>`;
    return `<a class="person-link" href="${e(link.href)}" aria-label="${label}" title="${label}">${content}</a>`;
  }).join("")}</span>`;
}
