import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { publicationCitation, publicationMetadata, publicationPresentation, publicationReferences } from "../src/publications.mjs";
import { assertApprovedPublications, captured } from "./cv-expectations.mjs";
import { assertPresentationCorrection, presentationCorrection } from "./news-expectations.mjs";
import { approvedParagraphText, normalizeRefreshForBaseline } from "./refresh-expectations.mjs";
import { escape } from "../src/helpers.mjs";
import { capturedPartners, assertPartnerGroupCoverage, capturedPastRoleParagraphs, assertPastRosterCoverage } from "./people-partner-expectations.mjs";

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
  // Only these captured Home paragraphs have owner-approved People/CV destinations.
  const homeDestinations = new Map([
    ["I am an Assistant Professor in the Department of Industrial & Systems Engineering (ISEN) at Texas A&M University. I received my Ph.D. in Industrial Engineering from the University of Wisconsin - Madison.", "/people/"],
    ["Education", "/cv/"],
    ["PhD 2022 Industrial & Systems Engineering University of Wisconsin\u2013Madison, Madison, WI", "/cv/"],
    ["MS 2020 Statistics University of Wisconsin\u2013Madison, Madison, WI", "/cv/"],
    ["MS 2013 Management Engineering KAIST, Seoul, South Korea", "/cv/"],
    ["BFE 2011 Financial Engineering Korea University, Seoul, South Korea", "/cv/"],
    ["BS 2011 Industrial Systems Information Engineering Korea University, Seoul, South Korea", "/cv/"],
    ["Best Master\u2019s Thesis Award, KAIST, 2013", "/cv/"],
  ].map(([text, route]) => [normalize(text), route]));
  normalizeRefreshForBaseline(data);
  const peopleContacts = new Map(data.people.current.map((person) =>
    [normalize(`${person.name} (${person.email.replace("@", " at ")})`), person]));
  const pastRoleParagraphs = new Set(capturedPastRoleParagraphs.map(normalize));
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
        const partnerIndex = page.slug === "home" ? capturedPartners.slice(1).findIndex((paragraph) => normalize(paragraph.text) === normalize(text)) : -1;
        const person = page.slug === "people" && peopleContacts.get(normalize(text));
        if (partnerIndex !== -1) {
          assertPartnerGroupCoverage(main, partnerIndex);
          checked++;
          continue;
        }
        if (person) {
          const blocks = [...main.matchAll(/<article class="student">([\s\S]*?)<\/article>/g)]
            .filter((block) => block[1].includes('<h3>' + escape(person.name) + '</h3>'));
          assert.equal(blocks.length, 1, 'people contact: unique ' + person.name);
          assert.ok(blocks[0][1].includes('<a class="person-link" href="mailto:' + escape(person.email) + '" aria-label="' + escape(person.name + ': Email') + '"'), 'people contact: ' + person.name);
          checked++;
          continue;
        }
        if (page.slug === "people" && (normalize(text) === normalize("Past Students") || pastRoleParagraphs.has(normalize(text)))) {
          assert.match(main, /<h2>Past members: Students &amp; research experiences<\/h2>/, "people roster: explicit past membership");
          assertPastRosterCoverage(main);
          checked++;
          continue;
        }
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
          const destination = page.slug === "home" && homeDestinations.get(normalize(text));
          const targetHtml = destination ? htmlAt(destination).match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1] : main;
          const target = destination ? normalize(targetHtml) : rendered;
          if (destination && text === "Education")
            assert.match(targetHtml, /<h2>Education<\/h2>/, `home -> ${destination}: ${text}`);
          assert.ok(
            target.includes(normalize(page.slug.startsWith("research")
              ? publicationReferences(approvedText, publicationsById) : approvedText)),
            `${page.slug}${destination ? " -> " + destination : ""}: ${text}`,
          );
        }
        checked++;
      }
    }
  }
  assert.equal(checked, 243, "Captured substantive paragraph baseline");
}
