# Codebase Guide

## Ownership and Reading Order

This independent repository owns only the Data Science Lab website. Follow root `AGENTS.md`; the parent owns independent final QA, commits, GitHub settings, integration and deployment. No shared runtime/profile or AI-Research-Assistant dependency belongs in this project.

Read `README.md` for commands/editing, `docs/source-provenance.md` for source integrity and discrepancies, then `content/site.json`, `content/lab.json`, `scripts/build.mjs`, `src/helpers.mjs` and `src/templates.mjs`.

## Build Path

`npm run build` runs `scripts/build.mjs`. It resolves all paths relative to the repository, loads explicit metadata and maintained content, validates required config and inline rich text, reads actual image dimensions, and renders all pages through the shared layout. Rendering happens before existing output is replaced, so invalid config/content does not destroy the last valid build. Assets are copied only from `public/` into a temporary `.local/build-output` directory; successful output replaces `dist/`. This is a deterministic local build, not a Google Sites importer.

`src/helpers.mjs` owns HTML escaping, publication fragment IDs, required config validation, the small inline-markup allowlist, JPEG/PNG dimension parsing and the image-rendering closure. `src/templates.mjs` owns all layout and rendering. `createPages` returns explicit route/title/description/body records, and `layout` wraps each body with the common document head, skip link, brand, primary navigation and footer. The faculty footer name is supplied from maintained content.

## Content Boundaries

- `content/site.json`: title, canonical origin, affiliation/contact/profile settings and CV path. No implicit environment-based metadata fallback.
- `content/lab.json`: faculty records, current/past people and education, research area intros/selections, a shared project catalog, news and publications.
- Research area `projects` arrays contain catalog IDs, not duplicate project facts. Main research renders all eight; systems renders preventive-maintenance, failure-prognostics and fault-diagnosis; processes renders nanosensor-monitoring, robust-design, functional-data-calibration and water-sensing; physics-informed AI renders bone-elastic-properties.
- Source-specific selected citations and project citations preserve source wording even when publication/CV details differ. This is intentional provenance, not accidental status drift.
- `content/source/`: immutable nine-page captures/manifest, never consumed by the production generator and never copied to `dist/`. Tests consume them for fidelity.
- `public/`: captured images/PDF, local licensed fonts, CSS/JS and favicon. All 25 captured original image files are retained.

## Browser Behavior

`public/assets/site.css` defines design tokens, typography, scholarly page rhythm, scientific-figure containment, mobile layouts, focus styles, reduced-motion behavior and print styles. Portraits may be cropped for display only. Figure links preserve access to the untouched full-size files.

`public/assets/site.js` only enhances mobile navigation and publication search/year/type filtering. Menu expansion uses `aria-expanded`/`aria-controls`, supports Escape and restores focus. With JS disabled, navigation stays visible at every width. Filters start hidden, appear only after initialization, update a live result count, hide empty groups and offer reset/empty-state recovery. Every publication is in the original HTML regardless of JS.

The CV page deliberately avoids embedded viewers: direct open/download links are reliable, local and usable without JS. The unchanged full PDF retains richer information than the home-derived text summary.

## Routes and Verification

The generator renders `/`, `/people/`, `/cv/`, `/research/`, its three source-compatible subroutes, `/news/` and `/publication/`, plus `404.html`. It generates crawler files with the configured canonical origin and includes a favicon and `.nojekyll`.

`tests/site.test.mjs` uses Node built-ins and executes the real generator. It covers semantic structure, headings/descriptions, captured publication IDs/metadata and substantive paragraphs, all local URLs/fragments/assets, people/degrees/news/projects/image coverage, exact PDF bytes/hash, required-config failure, output isolation, maintained title reuse and deterministic rebuilds. Baselines are intentional migration regression gates; approved future factual updates should revise them with documented source evidence.

`scripts/serve.mjs` serves `dist/` only on loopback, handles MIME types, redirects directory URLs to trailing-slash routes, provides the local 404 and rejects path escape. It does not watch files or expose provenance. `npm run dev` builds first and starts that server.

## Deployment Boundary

`.github/workflows/pages.yml` tests and builds on push/PR. Artifact upload and dependent Pages deployment are restricted to non-PR main events. The upload path is `dist`, never the checkout root. Parent must configure Pages and verify the external result; a successful local test is not a deployed website.

`.local/` is ignored worker evidence: startup verification, extraction/audit scripts/results, browser screenshots, reports and temporary PDF-reading packages. None is required for the portable build or deployed artifact. `plan.md`, `todo.md` and `history.md` track implementation versus parent-only remaining gates.

## Review Regression Coverage

- tests/source-baseline.mjs owns immutable source ID/date coverage assertions while allowing new maintained entries.
- tests/review-regressions.test.mjs checks incomplete HTML rejection, publication type/ID guards, non-destructive content growth, and the source-confirmed J9 year.
- src/helpers.mjs validatePublications is the build-time publication guard used before rendering by scripts/build.mjs.
- docs/validation.md and history.md record verified gates; plan.md and todo.md track only remaining release work.
