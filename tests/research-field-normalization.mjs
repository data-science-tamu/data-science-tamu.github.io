// Reverse only the owner-approved field wrappers for the unchanged body hashes.
export function normalizeResearchFieldLists(html) {
  return html.replace(/<ul class="project-fields">([\s\S]*?)<\/ul>/g, (block, body) => {
    const items = [...body.matchAll(/<li( class="project-collaborators")?>(<strong>[^<>]+<\/strong>(?:[^<>]|<(?:\/?(?:strong|em)|br\s*\/?|a href="[^"<>]+"|\/a)>)*?)<\/li>/g)];
    if (!items.length || items.map((item) => item[0]).join("") !== body ||
        items.some((item) => item[1] && !item[2].startsWith("<strong>Collaborators:</strong> ")))
      return block;
    return items.map(([, attributes = "", content]) => `<p${attributes}>${content}</p>`).join("");
  });
}
