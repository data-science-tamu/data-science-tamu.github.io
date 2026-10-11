# Data Science Lab Website

A dependency-free static academic website for the Data Science Lab, led by Jaesung Lee at Texas A&M University. English content is grounded in nine captured public Google Sites pages and the supplied CV. The original Google Sites website is not changed.

## Develop and Verify

Requires Node.js 22 or newer and npm. No production or development packages are required.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run dev
```

The development server listens at `http://127.0.0.1:4173` and serves only `dist/`. Set `PORT` to use another port. Re-run `npm run build` after content or style edits, then refresh the browser. There is deliberately no watcher, framework, backend or analytics. Stop the server with Ctrl+C.

`npm test` runs the actual build and project-local Node tests. It checks all routes, page structure, captured paragraphs and publication metadata, content counts/IDs, links/fragments, image dimensions/alt, exact CV hash, fail-closed config, output isolation and byte-identical rebuilds. Browser and accessibility checks remain separate review gates.

## Edit Content

- `content/site.json`: site title, canonical URL, contact email, university/department, faculty role/location, profile links, CV path and home description. Required values are validated before build output is changed. Use an HTTPS origin without a trailing slash.
- `content/lab.json`: maintained faculty biography/education/teaching/awards, people, shared research projects/directions, news and publication records. Edit this file for normal maintenance. Shared projects are defined once and referenced by stable IDs on each research route.
- Rich text fields accept only `a` with a safe explicit href, `em`, `strong` and `br`. Other inline markup fails the build. Keep ordinary strings free of HTML.
- Publications retain literal source IDs such as `J15*`. The corresponding HTML anchor is `J15-review`; the displayed identifier remains `[J15*]`. `type` is `journal`, `review` or `conference`. Unknown source years are `null`, not inferred from a preprint identifier. Keep author order, venue, year, volume/pages, acceptance/review statuses and notes as supplied. Original publisher/DOI links belong in `links`; do not guess missing identifiers.
- News uses original `YYYY.MM.DD` date text. `html` contains the full item, and `text` is its plain-text counterpart for alt descriptions. Images belong to that item. Date text must not become a fabricated date URL. Source order is preserved, including the December 2024 ordering.
- Education records separate `degree`, `dates`, `field` and `institution`. Open-ended source dates remain open-ended; they are not silently promoted to graduation dates.
- Add assets under `public/assets/`. Captured assets must remain unchanged. Each rendered image has actual intrinsic dimensions, meaningful alt text and lazy loading except the home portrait. Scientific figures link to their full-size originals and are never cropped or resized in the build.
- Replace the CV only with an owner-approved verified PDF. Update provenance and its hash baseline deliberately when the document changes.

The capture under `content/source/` is immutable migration provenance, not a runtime source or an automatically refreshed dependency. The source-fidelity tests enforce coverage of the captured baseline while permitting additional publication and news records. Adding a valid record does not require changing test counts. For approved changes to existing factual records, update the affected regression expectations and document the approved new source without deleting historical evidence. See `docs/source-provenance.md` for known discrepancies.

## Design and Code

`src/templates.mjs` centralizes the header/footer, page layouts and repeated content components. `src/helpers.mjs` validates config/rich markup and reads JPEG/PNG dimensions. `public/assets/site.css` owns the warm-white editorial design, maroon accents, responsive layouts, visible focus and reduced-motion behavior. `public/assets/site.js` provides only progressive-enhancement navigation and publication filtering. Full readable content and navigation remain available with JavaScript disabled.

The fonts are locally hosted Newsreader and DM Sans, with original SIL Open Font Licenses alongside them. There are no remote fonts, external embeds or runtime requests to Google Sites. The CV opens/downloads directly; it does not rely on Google Drive.

Code ownership, route mapping and reading order are in `wiki/codebase.md`.

## Routes

`/`, `/people/`, `/cv/`, `/research/`, `/research/ai-for-systems/`, `/research/ai-for-processes/`, `/research/physics-informed-ai/`, `/news/`, `/publication/`. Slugs retain compatibility with the Google-source routes. The site also provides `/404.html`, `/robots.txt`, `/sitemap.xml` and `/favicon.svg`.

## Deployment

GitHub Pages uses GitHub Actions as its publishing source. Changes merged into `main` are tested, built and deployed automatically.

The GitHub Actions workflow tests/builds on pushes and pull requests. Only a non-PR event on `main` uploads a Pages artifact, and that artifact contains **only `dist/`**. The dependent deployment job uses `actions/deploy-pages`; source captures, prompts, tests and `.local/` evidence are never deployed. The `github-pages` environment permits deployments from `main`. After changing deployment settings, verify the workflow result and the actual HTTPS website; a successful upload alone is not proof that the public site is current. See `docs/validation.md` for verification evidence.
