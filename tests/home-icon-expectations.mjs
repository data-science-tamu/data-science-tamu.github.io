import fs from "node:fs";

export const originalHomeCaption = '<figcaption><h2>Jaesung Lee</h2><p>Assistant Professor<br>Industrial &amp; Systems Engineering</p><a href="mailto:j.lee@tamu.edu">j.lee@tamu.edu</a></figcaption>';
export const homeIconCaption = fs.readFileSync(new URL("./fixtures/home-contact-icons.html", import.meta.url), "utf8").trimEnd();

// Reverse only the complete approved caption, retaining unrelated byte guards.
export function normalizeHomeIconsHtml(html) {
  return html.replace(homeIconCaption, originalHomeCaption);
}
