# Codebase Guide

## Ownership and Reading Order

This independent repository owns only the Data Science Lab website. Follow root `AGENTS.md`; the parent owns independent final QA, commits, GitHub settings, integration and deployment. No shared runtime/profile or AI-Research-Assistant dependency belongs in this project.

Read `README.md` for commands/editing, `docs/source-provenance.md` for source integrity and discrepancies, then `content/site.json`, `content/lab.json`, `scripts/build.mjs`, `src/helpers.mjs` and `src/templates.mjs`.

## Build Path

`npm run build` runs `scripts/build.mjs`. It resolves all paths relative to the repository, loads explicit metadata and maintained content, validates required config and inline rich text, reads actual image dimensions, and renders all pages through the shared layout. Rendering happens before existing output is replaced, so invalid config/content does not destroy the last valid build. Assets are copied only from `public/` into a temporary `.local/build-output` directory; successful output replaces `dist/`. This is a deterministic local build, not a Google Sites importer.

`src/helpers.mjs` owns HTML escaping, publication fragment IDs, required config validation, the small inline-markup allowlist, JPEG/PNG dimension parsing and the image-rendering closure. `src/templates.mjs` owns all layout and rendering. `createPages` accepts the build-validated optional original-figure map as its fourth argument and returns explicit route/title/description/body records, and `layout` wraps each body with the common document head, skip link, brand, primary navigation and footer. The faculty footer name is supplied from maintained content.

## Content Boundaries

- `content/site.json`: title, canonical origin, affiliation/contact/profile settings and CV path. No implicit environment-based metadata fallback.
- `content/lab.json`: faculty records, current/past people and education, research area intros/selections, a shared project catalog, news and publications.
- Research area `projects` arrays contain catalog IDs, not duplicate project facts. Main research renders all eight; systems renders preventive-maintenance, failure-prognostics and fault-diagnosis; processes renders nanosensor-monitoring, robust-design, functional-data-calibration and water-sensing; physics-informed AI renders bone-elastic-properties.
- Source-specific selected citations and project citations preserve source wording even when publication/CV details differ. This is intentional provenance, not accidental status drift.
- `content/figure-originals.json`: explicit larger-source counterparts with dimensions, SHA-256 and acquisition provenance. `src/figure-originals.mjs` validates this catalog before output replacement. All original captures remain unchanged; on-demand larger assets live under `public/assets/images/originals/`.
- `content/source/`: immutable nine-page captures/manifest, never consumed by the production generator and never copied to `dist/`. Tests consume them for fidelity.
- `public/`: captured images/PDF, local licensed fonts, CSS/JS and favicon. All 25 captured original image files are retained.

## Browser Behavior

`public/assets/site.css` owns the shared academic type and layout system: a white canvas, local DM Sans, charcoal text, neutral rules and restrained maroon links. Central rem tokens define body text (1.0625rem), small text (0.9375rem), project headings (1.3125rem), section headings (1.625rem) and page titles (2.125rem, 1.8125rem on mobile). The same hierarchy applies to home, people, research, publications, news and CV; inputs use 1rem. Compact sections put headings above content rather than in a wide empty gutter. The home portrait is 11.25rem wide on desktop; only portrait display may crop an image.

`src/templates.mjs` owns scientific-figure markup and the shared `figureViewer` dialog. Research projects render complete text first, followed by a full-width figure; overview figures also use the wide canvas. `.scientific-figure img` preserves native aspect ratio, has no height cap and never enlarges a small source beyond its natural width. `imageRenderer` emits the decoded file width as `--image-width`; the scientific-image rule uses it with the HTML dimensions to reserve space before lazy image data arrives, avoiding zero-area links and scroll jumps. The 80rem container leaves room for dense inline figures, while prose uses a 76ch reading measure. Each figure remains an original image link without JavaScript; the viewer follows that link's `href`, not a separately inferred asset path. Source and image-integrity contracts remain in [source provenance](../docs/source-provenance.md).

`public/assets/site.js` enhances mobile navigation, publication search/year/type filtering and scientific-figure reading. Menu expansion uses `aria-expanded`/`aria-controls`, supports Escape and restores focus. CSS and JavaScript both use the 800px mobile breakpoint. With JS disabled, navigation stays visible at every width. Filters start hidden, appear only after initialization, update a live result count, hide empty groups and offer reset/empty-state recovery. Every publication is in the original HTML regardless of JS.

Research pages contain one hidden native dialog, outside substantive main content. Where `showModal` is supported, ordinary figure clicks open it at original 100% resolution; Fit gives an overview and 200% magnifies without creating detail. The focusable `.figure-scroll` region uses actual image layout width, not transforms or centered overflow, so native scrolling and arrow keys can reach every corner. The dialog preserves a minimum image area and allows its own controls to scroll on short screens or with large user text. The dialog has scale controls, a Close button, a named title, loading/error status and an original-file link. Modified, new-tab and download clicks retain normal link behavior. Native Escape cancellation and Close restore focus, prior body overflow and pre-modal page scroll. Stale image events cannot change a later figure, and load failure leaves a recovery link and disabled scale controls. Unsupported dialogs leave direct links intact; no enhancement buttons are exposed without JavaScript.

Print styles retain recruitment/contact paragraphs, complete project text and figures, and every publication even after filtering. Only navigation, filtering controls and the viewer are omitted. There is no decorative entry animation; reduced-motion and visible-focus rules remain supported. Behavior ownership and parent-only browser/release gates are defined by [AGENTS.md](../AGENTS.md).

The CV page deliberately avoids embedded viewers: direct open/download links are reliable, local and usable without JS. The unchanged full PDF retains richer information than the home-derived text summary.

## Routes and Verification

The generator renders `/`, `/people/`, `/cv/`, `/research/`, its three source-compatible subroutes, `/news/` and `/publication/`, plus `404.html`. It generates crawler files with the configured canonical origin and includes a favicon and `.nojekyll`.

`tests/site.test.mjs` uses Node built-ins and executes the real generator. It covers semantic structure, headings/descriptions, captured publication IDs/metadata and substantive paragraphs, all local URLs/fragments/assets, people/degrees/news/projects/image coverage, exact PDF bytes/hash, required-config failure, output isolation, maintained title reuse and deterministic rebuilds. Baselines are intentional migration regression gates; approved future factual updates should revise them with documented source evidence.

`scripts/serve.mjs` serves `dist/` only on loopback, handles MIME types, redirects directory URLs to trailing-slash routes, provides the local 404 and rejects path escape. It does not watch files or expose provenance. `npm run dev` builds first and starts that server.

## Deployment Boundary

`.github/workflows/pages.yml` tests and builds on push/PR. Artifact upload and dependent Pages deployment are restricted to non-PR main events. The upload path is `dist`, never the checkout root. Parent must configure Pages and verify the external result; a successful local test is not a deployed website.

`.local/` is ignored worker evidence: startup verification, extraction/audit scripts/results, browser screenshots, reports and temporary PDF-reading packages. None is required for the portable build or deployed artifact. `plan.md`, `todo.md` and `history.md` track implementation versus parent-only remaining gates.

## Review Regression Coverage

- tests/academic-readability.test.mjs checks the shared type tokens, natural title, heading hierarchy, neutral surfaces, wide native figures, complete text before figures, hidden shared dialog, direct no-JS figure links, mobile breakpoint, form scale and substantive print output. These are source/template contracts, not measured browser layout.
- tests/figure-viewer.test.mjs executes the real client script in a small DOM platform double, checking original-size opening, Fit/200% behavior, resize, native cancellation, focus wrapping/restoration, body/page scroll restoration, modified-click fallback, unsupported/failed dialogs, load recovery and stale image events. It does not substitute for the parent's real browser and assistive-technology QA.
- tests/source-baseline.mjs owns immutable source ID/date coverage assertions while allowing new maintained entries.
- tests/review-regressions.test.mjs checks incomplete HTML rejection, publication type/ID guards, non-destructive content growth, and the source-confirmed J9 year.
- src/helpers.mjs validatePublications is the build-time publication guard used before rendering by scripts/build.mjs.
- docs/validation.md and history.md record verified gates; plan.md and todo.md track only remaining release work.

- `tests/figure-originals.test.mjs` verifies catalog integrity, rejects invalid mappings/assets, and checks every figure uses the verified original only for opening, not initial inline download.
- Local comparison scope, server links and non-destructive rollback are in [academic preview](../docs/academic-preview.md).

### Restrained Academic Polish

The small follow-up is CSS-only at runtime: main-navigation state borders, a
home-only first Research action, an outline on .faculty-portrait > img, and
h1/brand tracking. Scientific image selectors and all JS/HTML are unchanged.
The home action has a print override at matching hover specificity so printing
without backgrounds keeps black readable text. tests/restrained-polish.test.mjs
guards scoping, sizes, frame geometry, focus, print and absence of decorative
background/motion effects. See ../docs/academic-preview.md for comparison/recovery.
Academic/polish implementation and reviews are complete; the owner authorized GitHub
publication on 2026-10-13. Parent-only release gates are in ../plan.md and ../todo.md;
publication remains unverified until exact-head Pages success and live readback.
