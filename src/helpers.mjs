import fs from "node:fs";
import path from "node:path";

export const escape = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\x22/g, "&quot;")
    .replace(/\x27/g, "&#39;");
export const anchor = (id) => id.replace("*", "-review");
export function validateConfig(config) {
  for (const key of [
    "title",
    "url",
    "email",
    "institution",
    "department",
    "facultyRole",
    "location",
    "profile",
    "scholar",
    "linkedin",
    "cv",
    "description",
  ]) {
    if (typeof config[key] !== "string" || !config[key].trim())
      throw new Error(`Invalid site config: ${key} is required`);
  }
  let url;
  try {
    url = new URL(config.url);
  } catch {
    throw new Error("Invalid site config: url must be an HTTPS origin");
  }
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    config.url.endsWith("/")
  )
    throw new Error(
      "Invalid site config: url must be an HTTPS origin without a trailing slash",
    );
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email))
    throw new Error("Invalid site config: email");
  for (const key of ["profile", "scholar", "linkedin"]) {
    try {
      if (new URL(config[key]).protocol !== "https:") throw Error();
    } catch {
      throw new Error(`Invalid site config: ${key} must use HTTPS`);
    }
  }
  if (!/^\/assets\/documents\/[\w.-]+\.pdf$/.test(config.cv))
    throw new Error("Invalid site config: CV must be a local PDF");
}
export function rich(html) {
  if (typeof html !== "string") throw new Error("Invalid inline content");
  // Maintained rich text accepts only inline markup, never executable capture HTML.
  if (/[<>]/.test(html.replace(/<[^>]+>/g, "")))
    throw new Error("Invalid inline markup: incomplete tag");
  const tags = html.match(/<[^>]+>/g) || [];
  for (const tag of tags) {
    if (
      !/^<\/?(?:em|strong|br)\s*\/?\s*>$/.test(tag) &&
      !/^<\/a>$/.test(tag) &&
      !/^<a href="(?:https?:\/\/|mailto:|\/(?!\/))[^"<>]+">$/.test(tag)
    )
      throw new Error(`Invalid inline markup: ${tag}`);
  }
  return html;
}
export function validatePublications(publications) {
  if (!Array.isArray(publications) || !publications.length)
    throw new Error("Invalid publication records");
  const ids = new Set();
  for (const p of publications) {
    if (
      !p ||
      typeof p.id !== "string" ||
      !/^([JC]\d+\*?)$/.test(p.id) ||
      ids.has(p.id) ||
      typeof p.title !== "string" ||
      !p.title.trim() ||
      typeof p.metadata !== "string" ||
      !p.metadata.trim() ||
      !["journal", "review", "conference"].includes(p.type)
    )
      throw new Error("Invalid publication record");
    ids.add(p.id);
  }
}
export function dimensions(file) {
  const b = fs.readFileSync(file);
  if (b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] === 255 && b[1] === 216) {
    let i = 2;
    while (i < b.length) {
      if (b[i++] !== 255) continue;
      const marker = b[i++];
      if (marker === 255) {
        i--;
        continue;
      }
      if (marker === 216 || marker === 217) continue;
      const length = b.readUInt16BE(i);
      if (
        [
          192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207,
        ].includes(marker)
      )
        return { height: b.readUInt16BE(i + 3), width: b.readUInt16BE(i + 5) };
      i += length;
    }
  }
  throw new Error(`Unsupported or invalid image: ${file}`);
}
export function imageRenderer(publicRoot) {
  const cache = new Map();
  return (src, alt, { eager = false, className = "" } = {}) => {
    if (!/^\/assets\/images\/[\w.-]+\.(?:png|jpg)$/.test(src) || !alt)
      throw new Error(`Invalid image ${src}`);
    if (!cache.has(src)) cache.set(src, dimensions(path.join(publicRoot, src)));
    const { width, height } = cache.get(src);
    return `<img src="${escape(src)}" alt="${escape(alt)}" width="${width}" height="${height}" style="--image-width: ${width}px" ${eager ? `fetchpriority="high"` : `loading="lazy"`} decoding="async"${className ? ` class="${escape(className)}"` : ""}>`;
  };
}
