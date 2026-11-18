import assert from "node:assert/strict";

export const montagueParent = {
  text: "2025\u201326 Montague-Center for Teaching Excellence (CTE) Scholar, Texas A&M University, 2025",
  html: '<a href="https://cte.tamu.edu/news-and-highlights/faculty-named-montague-2025-2026.html">2025\u201326 Montague-Center for Teaching Excellence (CTE) Scholar</a>, Texas A&amp;M University, 2025',
};
export const montagueDetail = {
  text: "University-wide recognition for excellence and innovation in undergraduate teaching (includes a $6,500 teaching grant)",
  html: "University-wide recognition for excellence and innovation in undergraduate teaching (includes a $6,500 teaching grant)",
};
export const awardItemHtml = (award) => '<li>' + award.html +
  (award.details?.length ? '<ul>' + award.details.map((detail) => '<li>' + detail.html + '</li>').join('') + '</ul>' : '') + '</li>';
export const flatMontagueHtml = awardItemHtml(montagueParent) + awardItemHtml(montagueDetail);
export const nestedMontagueHtml = awardItemHtml({ ...montagueParent, details: [montagueDetail] });

// Reverse only this exact approved structure; keep historical fixtures immutable.
export function normalizeMontagueDetailsForBaseline(lab) {
  const data = structuredClone(lab);
  const matches = data.faculty.awards.filter((award) => award.text === montagueParent.text);
  const message = "Montague detail correction: unrelated baseline content must remain exact";
  assert.equal(matches.length, 1, message);
  const award = matches[0];
  const { details, ...parent } = award;
  assert.deepEqual(details, [montagueDetail], message);
  // Preserve parent fields for their existing provenance and href guards.
  data.faculty.awards.splice(data.faculty.awards.indexOf(award), 1,
    parent, ...details);
  return data;
}

export const normalizeMontagueDetailsHtml = (html) => html.replace(nestedMontagueHtml, flatMontagueHtml);
export function normalizeMontagueDetailsRaw(raw) {
  const data = JSON.parse(raw);
  assert.equal(raw, JSON.stringify(data, null, 2) + '\n', "Canonical JSON formatting remains exact");
  return JSON.stringify(normalizeMontagueDetailsForBaseline(data), null, 2) + '\n';
}

export function topLevelAwardItems(html) {
  const items = [];
  let depth = 0, start;
  for (const match of html.matchAll(/<\/?(?:ul|li)\b[^>]*>/g)) {
    if (match[0].startsWith('<ul')) depth++;
    else if (match[0] === '</ul>') depth--;
    else if (depth === 1 && match[0] === '<li>') start = match.index;
    else if (depth === 1 && match[0] === '</li>') {
      assert.notEqual(start, undefined, "Top-level award must have an opening li");
      items.push(html.slice(start, match.index + match[0].length));
      start = undefined;
    }
    assert.ok(depth >= 0, "Lists must be balanced");
  }
  assert.equal(depth, 0, "Lists must be balanced");
  assert.equal(start, undefined, "Awards must be closed");
  return items;
}
