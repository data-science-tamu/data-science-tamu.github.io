import fs from "node:fs";
import { escape } from "../src/helpers.mjs";

const refresh = JSON.parse(fs.readFileSync(new URL("./fixtures/cv-news-refresh.json", import.meta.url), "utf8"));
const records = refresh.changes.find((change) => change.path.join(".") === "faculty.experience").after;
const section = (list) => '<section class="section split-section"><div class="section-heading"><h2>Professional Experience</h2></div><div>' + list + '</div></section>';
const current = section('<ul>' + records.map((item) => '<li><strong>' + escape(item.role) + '</strong>, ' + escape(item.organization) + ' (' + escape(item.period) + ')</li>').join('') + '</ul>');
const historical = section('<ul class="clean-list detail-list">' + records.map((item) => '<li><h3>' + escape(item.role) + '</h3><p>' + escape(item.organization) + '</p><p class="small">' + escape(item.period) + '</p></li>').join('') + '</ul>');

// Reverse only this exact section; changed facts, order or markup still fail byte guards.
export const normalizeCvExperienceHtml = (html) => html.replace(current, historical);
