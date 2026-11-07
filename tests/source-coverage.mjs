import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { publicationCitation, publicationMetadata, publicationPresentation, publicationReferences } from "../src/publications.mjs";
import { assertApprovedPublications, captured } from "./cv-expectations.mjs";
import { assertPresentationCorrection, presentationCorrection } from "./news-expectations.mjs";
import { approvedParagraphText, normalizeRefreshForBaseline } from "./refresh-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const plain = (h) =>
  h
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, String.fromCharCode(39))
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
export function assertSourceCoverage(data, htmlAt) {
  const normalize = (s) =>
    plain(s)
      .toLowerCase()
      .replace(/\s+at\s+/g, "@")
      .replace(/doi\.org\/2025/g, "2025")
      .replace(/accpeted/g, "accepted")
      .replace(/texasa/g, "texas")
      .replace(/optimiation/g, "optimization")
      .replace(/state of purpose/g, "statement of purpose")
      .replace(/[^a-z0-9]/g, "");
  const labels = [
    "Specifically, my research topics include",
    "Please see the research page for details.",
    "Link: (Google scholar) (Linkedin)",
    "My research Interests:",
    "The research of my group was featured:",
    "Below are my previous and ongoing research works:",
    "Current Ph.D Students",
    "Photos",
    "Selected publications",
    "Selected Publications",
  ].map(normalize);
  const manifest = JSON.parse(read("content/source/manifest.json"));
  normalizeRefreshForBaseline(data);
  const publicationsById = publicationPresentation(data.publications);
  assertApprovedPublications(data.publications);
  let checked = 0;
  for (const page of manifest.pages) {
    if (page.slug === "cv") continue;
    const html = htmlAt(page.slug === "home" ? "/" : `/${page.slug}/`);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    const rendered = normalize(main);
    for (const section of JSON.parse(read(page.source)).sections) {
      for (const match of section.blocks
        .join("")
        .matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
        const text = plain(match[1].replace(/<[^>]*>/g, ""));
        if (!text || labels.includes(normalize(text))) continue;
        if (/^\[([JC]\d+\*?)\]/.test(text)) {
          const id = text.match(/^\[([^\]]+)\]/)[1];
          const p = data.publications.find((p) => p.id === (id === "J15*" ? "J15" : id));
          const original = captured.find((p) => p.id === id);
          assert.ok(p, id);
          assert.ok(original, `${id}: explicit approved source exception`);
          if (page.slug === "publication")
            assert.equal(normalize(`[${id}] ${original.authors} ${original.title} ${original.metadata}`),
              normalize(text), `${id}: immutable captured metadata`);
          else
            assert.ok(normalize(text).includes(normalize(original.title)), `${id}: original research title mapping`);
          for (const part of page.slug === "publication"
            ? [p.title, ...p.authors.map((a) => a.name), publicationMetadata(p)]
            : [publicationCitation(p.id, publicationsById)])
            assert.ok(
              rendered.includes(normalize(part)),
              id + " rendered approved correction",
            );
        } else {
          let approvedText = approvedParagraphText(page.slug, text, normalize);
          // Only this owner-corrected news paragraph supersedes its captured date.
          if (page.slug === "news" &&
            normalize(text) === normalize(`2026.03.26 ${presentationCorrection.text}`)) {
            const corrected = assertPresentationCorrection(data.news);
            approvedText = `${corrected.date} ${corrected.text}`;
          }
          assert.ok(
            rendered.includes(normalize(page.slug.startsWith("research")
              ? publicationReferences(approvedText, publicationsById) : approvedText)),
            `${page.slug}: ${text}`,
          );
        }
        checked++;
      }
    }
  }
  assert.equal(checked, 243, "Captured substantive paragraph baseline");
}
