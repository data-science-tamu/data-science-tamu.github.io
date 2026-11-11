import { escape as e, anchor, validatePublications } from "./helpers.mjs";
import { publicationDetails, publicationPresentation } from "./publications.mjs";
import { researchRenderers } from "./research-projects.mjs";

const groupIds = ["topics", "problems"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const text = (value) => typeof value === "string" && value.trim().length > 0;
const invalid = (detail) => { throw new Error('Invalid research index: ' + detail); };

function fields(value, keys, context) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      Object.keys(value).some((key) => !keys.includes(key)) ||
      keys.some((key) => !Object.hasOwn(value, key))) invalid(context + ' fields');
}

function recordsBy(records, key, context) {
  if (!Array.isArray(records)) invalid('missing ' + context + ' records');
  const result = new Map();
  for (const record of records) {
    if (!record || !text(record[key]) || !text(record.title) || result.has(record[key]))
      invalid('missing or ambiguous ' + context + ' record');
    result.set(record[key], record);
  }
  return result;
}

function fundingStart(period, asOf) {
  const match = typeof period === "string" && period.match(/^(0[1-9]|1[0-2])\/(\d{4})\u2013(0[1-9]|1[0-2])\/(\d{4})$/);
  if (!match) invalid('funding period');
  const start = match[2] + '-' + match[1], end = match[4] + '-' + match[3];
  if (start > end) invalid('reversed funding period');
  if (start <= asOf) return "";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return 'Starts ' + months[Number(match[1]) - 1] + ' ' + match[2] + ' (scheduled start).';
}

export function resolveResearchIndex(index, lab) {
  fields(index, ["asOf", "groups"], "index");
  if (typeof index.asOf !== "string" || !/^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(index.asOf))
    invalid("preview snapshot month (YYYY-MM)");
  if (!Array.isArray(index.groups) || index.groups.length !== groupIds.length)
    invalid('required groups');
  const projects = recordsBy(lab?.projects, "id", "project");
  const publications = recordsBy(lab?.publications, "id", "publication");
  try {
    validatePublications(lab.publications);
  } catch (error) {
    invalid(error.message);
  }
  const presentation = publicationPresentation([...publications.values()]);
  const funding = recordsBy(lab?.faculty?.funding?.items, "title", "funding");
  for (const award of funding.values()) {
    if (!text(award.sponsor) || !text(award.role)) invalid('funding metadata');
    funding.set(award.title, { ...award, startNote: fundingStart(award.period, index.asOf) });
  }
  const seenGroups = new Set(), routes = new Set();
  const references = (refs, source, type, pattern) => {
    if (!Array.isArray(refs)) invalid(type + ' references');
    const seen = new Set();
    return refs.map((ref) => {
      if (!text(ref) || (pattern && !pattern.test(ref)) || seen.has(ref))
        invalid('malformed or duplicate ' + type + ' reference');
      seen.add(ref);
      if (!source.has(ref)) invalid('unresolved ' + type + ' reference: ' + ref);
      return source.get(ref);
    });
  };
  return index.groups.map((group) => {
    fields(group, ["id", "label", "items"], "group");
    if (!groupIds.includes(group.id) || seenGroups.has(group.id) || !text(group.label) ||
        !Array.isArray(group.items) || !group.items.length) invalid('group');
    seenGroups.add(group.id);
    return { ...group, items: group.items.map((item) => {
      fields(item, ["slug", "label", "summary", "projects", "publications", "funding"], "item");
      if (!text(item.slug) || !slugPattern.test(item.slug) || !text(item.label) || !text(item.summary))
        invalid('item slug, label or summary');
      const route = '/research/browse/' + group.id + '/' + item.slug + '/';
      if (routes.has(route)) invalid('duplicate route');
      routes.add(route);
      const resolved = {
        ...item, route,
        projects: references(item.projects, projects, "project", slugPattern),
        publications: references(item.publications, presentation, "publication", /^[JCW][1-9]\d*\*?$/),
        funding: references(item.funding, funding, "funding"),
      };
      if (!resolved.projects.length && !resolved.publications.length && !resolved.funding.length)
        invalid('empty destination');
      return resolved;
    }) };
  });
}

export function createResearchBrowsePages(groups, lab, img, originals = new Map()) {
  const { project } = researchRenderers(img, originals, publicationPresentation(lab.publications));
  const section = (title, records, render) => records.length
    ? '<section class="research-browse-section"><h2>' + title + '</h2><ul class="research-browse-list">' + records.map(render).join("") + '</ul></section>' : "";
  return groups.flatMap((group) => group.items.map((item) => ({
    route: item.route,
    title: item.label,
    description: item.summary,
    body: '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/research/">Research</a><span aria-hidden="true">/</span><span>' + e(group.label) + '</span><span aria-hidden="true">/</span><span>' + e(item.label) + '</span></nav>' +
      '<header class="page-heading"><h1>' + e(item.label) + '</h1><p class="lead">' + e(item.summary) + '</p></header>' +
      '<p class="research-browse-context small">Projects are research activities, publications are outputs, and funding supports research programs. A shared topic does not establish grant-to-paper attribution.</p>' +
      (item.projects.length ? '<section class="research-browse-section research-browse-projects"><h2>Research Projects</h2>' + item.projects.map(project).join("") + '</section>' : "") +
      section("Publications", item.publications, (publication) => '<li><h3><span class="research-browse-reference">[' + e(publication.displayId) + ']</span> <a href="/publication/#' + e(anchor(publication.id)) + '">' + e(publication.title) + '</a></h3>' + publicationDetails(publication) + '</li>') +
      section("Funded Research", item.funding, (award) => {
        const start = award.startNote;
        return '<li><h3><a href="/cv/">' + e(award.title) + '</a></h3><p class="small">' + [award.sponsor, award.role, award.period].map(e).join(" &middot; ") + '</p>' + (start ? '<p class="small research-browse-start">' + e(start) + '</p>' : "") + '</li>';
      }),
  })));
}
