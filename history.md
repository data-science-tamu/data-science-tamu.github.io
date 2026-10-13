# Website History

## 2026-10-11: Initial Website Implementation and Local Validation

- Created the independent organization website repository and isolated task worktree; the original Google Sites and unrelated repositories were not modified.
- Captured all nine original pages, 25 unique image assets and the unchanged 166640-byte CV PDF with source URLs and hashes.
- Implemented the English editorial redesign with gpt-6.1-sol, reasoning max. Parent review corrections and deployment are separate ownership steps.
- Added a dependency-free Node static generator, shared layouts, responsive CSS, local licensed fonts, mobile navigation, publication filtering, sitemap and 404 page.
- Preserved 20 publication records, 14 news items, 8 research projects, faculty and student records, original statuses and identifiers. Source/CV disagreements are documented rather than silently reconciled.
- Independent source review found one missing year in the corrected J9 research citation; 2025 is restored and regression-tested.
- Independent code review found overly fixed content-count tests, incomplete-tag validation and unknown-category handling. Parent corrections preserve source baselines while permitting new records, reject incomplete HTML and validate publication categories before rendering.
- Parent executed npm test: 23 passed, 0 failed; npm run build: nine content pages plus 404. Tests cover byte-identical rebuilds and unchanged CV hash.
- Parent final Chromium QA: 27 page/viewport combinations, 71 internal URL/fragment targets and 11 interaction checks passed; no tested WCAG A/AA violations, horizontal overflow, image-load or JavaScript errors.
- Completed release evidence follows below.

## 2026-10-11: Organization Pages Release

- Final focused review approved the collision-free synthetic publication fixture. Current content and in-memory future J17/J18 and dense-ID scenarios were verified without writing test records into maintained content.
- Feature-branch CI run 38154637890 succeeded; approved commit e163dcfb4719b799a85d0438211353f6c16c3f8e was integrated into the primary main worktree and pushed.
- Main workflow run 38154808069 succeeded in both test-build and deploy jobs.
- https://data-science-tamu.github.io is live with HTTPS enforced. Published artifacts match the verified build; 49 live integrity requests passed.
- Repeated the complete browser QA against the public URL: 27 page/viewport cases, 71 local targets and 11 functional checks passed.
- No unfinished implementation items remain. External-link availability and source/CV status differences are documented limitations, not fabricated corrections.

## 2026-10-11: Record Visibility Considerations

- Recorded the requested prior suggestions 2, 3 and 4 as consideration-only items in todo.md, with a pointer in plan.md.
- Distinguished these options from approved implementation: assess research visibility, qualified collaboration and publicity outcomes before choosing features.
- This documentation-only change does not modify website content, templates, assets, runtime behavior or public-facing output. Strategic recommendations remain proposals, not actions or outreach commitments.

## 2026-10-12 - Reversible Academic Readability Preview

Historical local-only scope; the 2026-10-13 release authorization below supersedes it.

- Responded to owner feedback on the current public/left design, not the separate
  information-architecture prototype. Dedicated preview/academic-readability worktree;
  no public push, main merge or Pages deployment. Baseline main remains7ad88ee.
- White/charcoal academic presentation with one locally hosted type system;
  title34px (29 mobile), section26px, project21px, body17px, supporting15px.
  Removed display-serif typography, gradient tint, oversized title/gutters and
  decorative blocks; retained every substantive section and factual record.
- Source-verified larger rasters added for9 of10 scientific diagrams; all original
  assets preserved. Full-width previews and native100%/Fit/200% reading with scroll,
  keyboard/escape/focus, error and no-JS fallback. Source map/hash/dimension guards
  fail before replacing valid output. Larger images load only on opening.
- Parent reproduced and fixed short-screen/large-text zero-height viewer and
  pre-decoding zero-size scientific previews at their CSS/dimension boundary.
- Verification:50 Node tests, deterministic9-page+404 build,27 viewport/route cases,
 80 local targets,11 existing journeys,30 figure cases, print/recovery/no-JS and
  large-text/short-screen checks passed. Cold-image tests cover all10 figures at
  two widths while requests are held pending.42 original files and243 substantive
  paragraphs preserved. Windows localhost:4175 homepage and original image readback
  match exact local bytes. Public homepage readback still matches baseline.
- Independent review evidence is .local/academic/review.md; see
  docs/academic-preview.md and docs/validation.md for scope, limits and measurements.
- Recovery: backup/pre-academic-20261012 annotates original7ad88ee; verified Git
  bundle retained under .local/academic/pre-academic.bundle. The independent4174
  prototype was unchanged during this task; academic comparison ran on4175. Port4173
  serves primary dist and can change after its next rebuild.

Implementation by gpt-6.1-sol/max (resumed session20261012_202011_ebc116), with
parent-owned integration, browser QA, source recovery and bounded corrections.
No physical Safari/screen-reader test was performed. At this local-only checkpoint,
owner design/public-release approval had not been recorded; see 2026-10-13 below.

## 2026-10-12 - Restrained Academic Polish

Owner requested just a little visual character without returning to AI-style
decoration. Sol/max session20261012_212412_71d983 changed31 CSS lines and added
8 guards. Current nav has a fine maroon rule; the home Research action has a
small rectangular accent; portrait has a fine offset frame; h1/brand tracking
is tighter. White canvas, current type sizes, images, text and layout stay intact.

Parent ran58 tests/build,27 viewport/accessibility cases,80 local targets,
11 interaction flows,30 figure viewer cases and four-width detail/print checks.
Only CSS differs among55 output files; source/asset comparisons confirm no
non-style runtime change. Full pre-polish source backup verified (81 files),
plus before/after screenshots under .local/polish/.

At this historical local-only checkpoint, comparison ran on localhost:4175 and
public main and the separate4174 prototype were unchanged. The earlier Git
approval timeout left the commit unexecuted; no commit retry, push, merge or
deployment was attempted in this pass. That restriction is superseded
by the 2026-10-13 authorization below; independent review is now complete.

## 2026-10-13 - Approved Academic and Polish Release Preparation

- Academic readability implementation and independent review are complete:
  APPROVE, including the cold-image correction and33 pending-load cases.
- Restrained polish implementation and independent review are complete:
  deleg_9b881723 APPROVE; reviewer independently passed58 tests.
- Parent independently verified58 tests/build,27 routes/viewports,80 targets,
  11 interactions,30 viewers, and four-width print/focus/content/type/photo
  invariance plus recovery/no-JS/print. Only CSS changed among55 output files
  in the last polish; the81-file pre-polish archive remains retained.
- Owner explicitly approved GitHub publication of the current academic +
  restrained polish using gpt-6.1-sol/max. This supersedes earlier local-only
  prohibitions and the approval timeout; it does not establish release success.
- Documentation worker reran npm test (58 passed,0 failed), npm run build
  (9 content pages+404;20 publications,14 news items,8 projects) and
  git diff --check successfully on2026-10-13.
- Parent-only remaining gates: fresh final verification; task commit/push+CI;
  main fast-forward/push; exact-head Pages run and live build readback.
  Parent appends publication-success evidence only after these are verified.
- Recovery retains the baseline tag/bundle and pre-polish archive. Use a new
  revert commit for rollback, not reset/force-push. Port4173 follows primary
  dist; a separate worktree at the backup tag provides the original comparison.
