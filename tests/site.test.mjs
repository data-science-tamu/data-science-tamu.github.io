import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { normalizeResearchFieldLists } from "./research-field-normalization.mjs";
import {
  assertPublicationBaseline,
  assertNewsBaseline,
} from "./source-baseline.mjs";
import { assertSourceCoverage } from "./source-coverage.mjs";

const root = path.resolve(import.meta.dirname, "..");
function runBuild(args = []) {
  fs.mkdirSync(path.join(root, ".local"), { recursive: true });
  const temp = fs.mkdtempSync(path.join(root, ".local/build-check-"));
  const stdoutPath = path.join(temp, "stdout"), stderrPath = path.join(temp, "stderr");
  const stdout = fs.openSync(stdoutPath, "w"), stderr = fs.openSync(stderrPath, "w");
  try {
    // File descriptors preserve real exit status and diagnostics in restricted
    // environments where child-process pipe capture reports EPERM.
    const result = spawnSync(process.execPath, ["scripts/build.mjs", ...args], {
      cwd: root, stdio: ["ignore", stdout, stderr],
    });
    if (result.error) throw result.error;
    return { ...result, stdout: fs.readFileSync(stdoutPath, "utf8"), stderr: fs.readFileSync(stderrPath, "utf8") };
  } finally {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
    fs.rmSync(temp, { recursive: true, force: true });
  }
}
const result = runBuild();
test("the actual static build succeeds", () => {
  assert.equal(result.status, 0, result.stderr);
});
const routes = [
  "/",
  "/people/",
  "/cv/",
  "/research/",
  "/research/ai-for-systems/",
  "/research/ai-for-processes/",
  "/research/physics-informed-ai/",
  "/news/",
  "/publication/",
];
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const htmlAt = (r) => read(`dist${r}index.html`);
const plain = (h) =>
  h
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, String.fromCharCode(39))
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
for (const route of routes) {
  test(`${route} has semantic complete HTML without JS`, () => {
    const html = htmlAt(route);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<main id="main"/);
    assert.match(html, /href="#main"/);
    assert.match(html, /aria-current="page"/);
    assert.doesNotMatch(
      html,
      /sitesv-images|gstatic\.com|fonts\.googleapis|<iframe|target="_blank"/,
    );
    assert.ok(plain(html).length > 500);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(ids.length, new Set(ids).size, "duplicate IDs");
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image[0], /alt="[^"]+"/);
      assert.match(image[0], /width="\d+"/);
      assert.match(image[0], /height="\d+"/);
    }
  });
}
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
}
test("all internal links, fragments, CSS URLs and assets resolve", () => {
  for (const file of files(path.join(root, "dist")).filter((p) =>
    /\.(html|css)$/.test(p),
  )) {
    const content = fs.readFileSync(file, "utf8");
    const refs = file.endsWith(".html")
      ? [...content.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1])
      : [...content.matchAll(/url\("?([^"\)]+)"?\)/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (/^(https?:|mailto:|data:)/.test(ref)) continue;
      const u = new URL(
        ref,
        "https://example.test/" + path.relative(path.join(root, "dist"), file),
      );
      let target = path.join(root, "dist", decodeURIComponent(u.pathname));
      if (u.pathname.endsWith("/")) target = path.join(target, "index.html");
      assert.ok(fs.existsSync(target), `${file}: ${ref}`);
      if (u.hash)
        assert.ok(
          fs
            .readFileSync(target, "utf8")
            .includes(`id="${decodeURIComponent(u.hash.slice(1))}"`),
          `${file}: fragment ${ref}`,
        );
    }
  }
});
test("publication IDs, citations, categories and all source titles survive", () => {
  const data = JSON.parse(read("content/lab.json"));
  const pubs = data.publications;
  assertPublicationBaseline(pubs);
  assert.equal(
    (htmlAt("/publication/").match(/class="publication"/g) || []).length,
    pubs.length,
  );
  const html = htmlAt("/publication/");
  for (const p of pubs) {
    assert.ok(plain(html).includes(p.title), p.id + " title");
    assert.ok(
      html.includes(`id="${p.id.replace("*", "-review")}"`),
      p.id + " anchor",
    );
  }
  assert.match(html, /doi:10\.3390\/bioengineering10070845/);
  assert.ok(pubs.find((p) => p.id === "J7").links.some((link) =>
    link.href === "https://www.mdpi.com/2306-5354/10/7/845"), "Original publisher fact retained");
  assert.match(html, /href="https:\/\/doi\.org\/10\.3390\/bioengineering10070845"/);
  assert.doesNotMatch(html, /href="[^"]*bioengineering1007084"/);
});
test("all source news dates, people, degrees, projects and local images are represented", () => {
  const data = JSON.parse(read("content/lab.json"));
  assertNewsBaseline(data.news);
  assert.ok(data.people.current.length >= 3);
  assert.ok(data.people.current.flatMap((p) => p.education).length >= 8);
  assert.ok(data.faculty.education.length >= 5);
  assert.ok(data.projects.length >= 8);
  for (const name of [
    "Tatthapong Srikitrungruang",
    "Sina Aghaee Dabaghan Fard",
    "Tanvir Ahmed",
    "Noor S. Obeidat",
    "Shu Nee Khor",
    "Matthew Lemon",
    "Gabriel Gonzalez",
    "Anna Hartman",
  ])
    assert.ok(plain(htmlAt("/people/")).includes(name), name);
  const all = routes.map(htmlAt).join(" ");
  for (const a of JSON.parse(read("content/source/manifest.json")).assets)
    assert.ok(all.includes(a.path.replace("public", "")), a.path);
  assert.doesNotMatch(all, /href="http:\/\/202\d\./);
  assert.doesNotMatch(all, /href="http:\/\/doi.org\/2025"/);
});
test("CV PDF matches maintained artifact provenance and has direct local open and download links", () => {
  const pdf = fs.readFileSync(
    path.join(root, "dist/assets/documents/jaesung-lee-cv.pdf"),
  );
  const currentCv = JSON.parse(read("content/cv-current.json"));
  assert.equal(pdf.length, currentCv.bytes);
  assert.equal(
    createHash("sha256").update(pdf).digest("hex"),
    currentCv.sha256,
  );
  const html = htmlAt("/cv/");
  assert.match(html, /href="\/assets\/documents\/jaesung-lee-cv.pdf" download/);
  assert.ok(plain(html).includes("Education"));
});
test("output includes 404 and crawler files but never provenance, prompts or source code", () => {
  for (const f of ["404.html", "robots.txt", "sitemap.xml", "favicon.svg"])
    assert.ok(fs.existsSync(path.join(root, "dist", f)));
  const sitemap = read("dist/sitemap.xml");
  for (const r of routes)
    assert.ok(sitemap.includes(`https://data-science-tamu.github.io${r}`));
  for (const f of files(path.join(root, "dist")))
    assert.ok(
      !/source|prompts|package|lab\.json|\.mjs$/.test(
        path.relative(path.join(root, "dist"), f),
      ),
      f,
    );
});
test("build is fail-closed for missing and invalid required config without destroying output", () => {
  const existing = read("dist/index.html");
  const config = JSON.parse(read("content/site.json"));
  for (const bad of [
    { ...config, email: "" },
    { ...config, url: "not-a-url" },
    { ...config, title: "" },
  ]) {
    const temp = path.join(root, ".local", "invalid-site.json");
    fs.mkdirSync(path.dirname(temp), { recursive: true });
    fs.writeFileSync(temp, JSON.stringify(bad));
    const r = runBuild(["--config", temp]);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Invalid site config/);
    assert.equal(read("dist/index.html"), existing);
  }
  const missing = runBuild(["--config", ".local/nonexistent.json"]);
  assert.notEqual(missing.status, 0);
  assert.equal(read("dist/index.html"), existing);
});
test("repeated build is byte-identical", () => {
  const digest = () =>
    files(path.join(root, "dist"))
      .sort()
      .map((p) => [
        path.relative(path.join(root, "dist"), p),
        createHash("sha256").update(fs.readFileSync(p)).digest("hex"),
      ]);
  const before = digest();
  const r = runBuild();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(digest(), before);
});

test("every substantive source paragraph is retained on its owning page", () => {
  assertSourceCoverage(JSON.parse(read("content/lab.json")), htmlAt);
});

test("home title and faculty footer come from maintained content", async () => {
  const { createPages, layout } = await import("../src/templates.mjs");
  const { imageRenderer } = await import("../src/helpers.mjs");
  const site = {
    ...JSON.parse(read("content/site.json")),
    title: "Editorial Research Group",
  };
  const data = JSON.parse(read("content/lab.json"));
  const home = createPages(
    site,
    data,
    imageRenderer(path.join(root, "public")),
  )[0];
  assert.ok(
    plain(home.body.match(/<h1>([\s\S]*?)<\/h1>/)[1]).includes(site.title),
  );
  assert.ok(layout(site, home, data.faculty.name, data.research.areas).includes(data.faculty.name));
});


test("actual build includes all approved browse routes, canonical links and unchanged existing bodies", () => {
  const configPath = path.join(root, "content/research-index.json");
  assert.ok(fs.existsSync(configPath), "maintained approved research index must exist");
  const index = JSON.parse(read("content/research-index.json"));
  const selected = index.groups.flatMap((group) => group.items.map((item) => ({
    ...item, route: '/research/browse/' + group.id + '/' + item.slug + '/',
  })));
  assert.equal(selected.length, 12);
  const built = files(path.join(root, "dist/research/browse")).filter((f) => f.endsWith(".html"));
  assert.equal(built.length, 12);
  assert.ok(!fs.existsSync(path.join(root, "dist/research/browse/methods")), "removed Methods routes must not survive a rebuild");
  const sitemap = read("dist/sitemap.xml");
  assert.doesNotMatch(sitemap, /\/research\/browse\/methods\//);
  for (const item of selected) {
    const html = htmlAt(item.route);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /aria-current="page"/);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(ids.length, new Set(ids).size, item.route);
    assert.ok(plain(html).includes(item.label));
    assert.ok(sitemap.includes('https://data-science-tamu.github.io' + item.route));
    assert.ok(html.includes('rel="canonical" href="https://data-science-tamu.github.io' + item.route + '"'));
    assert.match(html, /href="\/assets\/research-index.css"/);
  }
  const baseline = JSON.parse(read("tests/fixtures/research-menu-preservation.json"));
  for (const [file, digest] of Object.entries(baseline.builtBodies)) {
    const body = read('dist/' + file).match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
    assert.equal(createHash("sha256").update(normalizeResearchFieldLists(body)).digest("hex"), digest, file);
  }
  assert.equal(read("dist/assets/research-index.css"), read("src/research-index.css"));
  for (const file of files(path.join(root, "public"))) {
    const relative = path.relative(path.join(root, "public"), file);
    assert.deepEqual(fs.readFileSync(path.join(root, "dist", relative)), fs.readFileSync(file), relative);
  }
});

test("build fails closed for invalid research index before touching last good output", () => {
  const existing = read("dist/index.html");
  const digest = () => files(path.join(root, "dist")).sort().map((file) => [
    path.relative(path.join(root, "dist"), file),
    createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
  ]);
  const before = digest();
  const temp = path.join(root, ".local/invalid-research-index.json");
  fs.writeFileSync(temp, JSON.stringify({ groups: [] }));
  try {
    for (const indexPath of [temp, ".local/no-such-research-index.json"]) {
      const invalid = runBuild(["--research-index", indexPath]);
      assert.notEqual(invalid.status, 0, "invalid/missing research index must reject the build");
      assert.equal(read("dist/index.html"), existing);
      assert.deepEqual(digest(), before);
    }
    fs.writeFileSync(temp, "{not json");
    const malformed = runBuild(["--research-index", temp]);
    assert.notEqual(malformed.status, 0);
    assert.deepEqual(digest(), before);
  } finally {
    fs.rmSync(temp, { force: true });
  }
});
