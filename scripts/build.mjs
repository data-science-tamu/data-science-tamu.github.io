import fs from "node:fs";
import path from "node:path";
import {
  validateConfig,
  validatePublications,
  imageRenderer,
  escape,
} from "../src/helpers.mjs";
import { createPages, layout } from "../src/templates.mjs";
import { validateFigureOriginals } from "../src/figure-originals.mjs";

const root = path.resolve(import.meta.dirname, "..");
const configFlag = process.argv.indexOf("--config");
const configPath =
  configFlag === -1
    ? path.join(root, "content/site.json")
    : path.resolve(root, process.argv[configFlag + 1] || "missing-config");
try {
  const site = JSON.parse(fs.readFileSync(configPath, "utf8"));
  validateConfig(site);
  const lab = JSON.parse(
    fs.readFileSync(path.join(root, "content/lab.json"), "utf8"),
  );
  for (const [key, count] of [
    ["projects", 8],
    ["news", 14],
    ["publications", 20],
  ])
    if (!Array.isArray(lab[key]) || lab[key].length < count)
      throw new Error(`Invalid lab content: ${key} is incomplete`);
  validatePublications(lab.publications);
  if (!fs.existsSync(path.join(root, "public", site.cv)))
    throw new Error("CV PDF is missing");
  const originals = validateFigureOriginals(
    JSON.parse(fs.readFileSync(path.join(root, "content/figure-originals.json"), "utf8")),
    path.join(root, "public"),
    [...lab.research.figures.map((f) => f.src), ...lab.projects.map((p) => p.image)],
  );
  const pages = createPages(
    site,
    lab,
    imageRenderer(path.join(root, "public")),
    originals,
  );
  const rendered = pages.map((page) => [
    `${page.route}index.html`,
    layout(site, page, lab.faculty.name),
  ]);
  const errorPage = {
    route: "/404.html",
    title: "Page Not Found",
    description:
      "This page could not be found. Return to the Data Science Lab website.",
    body: `<header class="page-heading"><p class="eyebrow">404</p><h1>Page not found</h1><p class="lead">The page may have moved, or the address may be incorrect.</p><div class="hero-actions"><a class="button" href="/">Return home</a><a class="button button-secondary" href="/research/">Explore research</a></div></header>`,
  };
  rendered.push(["404.html", layout(site, errorPage, lab.faculty.name)]);
  const stage = path.join(root, ".local/build-output");
  fs.mkdirSync(path.dirname(stage), { recursive: true });
  fs.rmSync(stage, { recursive: true, force: true });
  fs.cpSync(path.join(root, "public"), stage, { recursive: true });
  for (const [file, html] of rendered) {
    const target = path.join(stage, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html + "\n");
  }
  fs.writeFileSync(
    path.join(stage, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`,
  );
  fs.writeFileSync(
    path.join(stage, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${escape(site.url + p.route)}</loc></url>`).join("\n")}\n</urlset>\n`,
  );
  fs.writeFileSync(path.join(stage, ".nojekyll"), "");
  const dist = path.join(root, "dist");
  fs.rmSync(dist, { recursive: true, force: true });
  fs.renameSync(stage, dist);
  console.log(`Built ${pages.length} content pages + 404 into ${dist}`);
  console.log(
    `${lab.publications.length} publications; ${lab.news.length} news items; ${lab.projects.length} projects. No runtime dependencies.`,
  );
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
