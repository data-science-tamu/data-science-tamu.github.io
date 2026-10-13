# Validation Evidence

## Scope

The website is generated from maintained local content and assets. Original Google Sites captures are immutable migration evidence, not runtime dependencies. The local implementation model was gpt-6.1-sol with reasoning max; the parent owns independent reviews, targeted corrections and release verification.

## Initial Local Verification (2026-10-11)

- npm test: 23 passed, 0 failed.
- npm run build: nine content pages plus 404; 20 publications, 14 news items and 8 projects.
- Source fidelity: every substantive captured paragraph is tested on its owning page; identifiers, statuses, author metadata, people and news are preserved. The CV hash matches the original capture.
- Internal references: 71 URL/fragment targets resolve in the independent browser checker; repository tests also inspect CSS URLs and all asset paths.
- Chromium responsive QA: all nine routes at widths 1440, 390 and 320; 27 combinations passed with no horizontal overflow, missing images, console/page errors or tested axe-core WCAG A/AA violations.
- Interaction QA: mobile menu open/Escape/navigation, text/year/type filters, empty/reset states, exact original PDF download, keyboard skip link and JavaScript-disabled navigation/reading; 11 checks passed.
- Manual screenshot review covered desktop and mobile home, people, publications, CV and scientific research figures. Scientific diagrams retain aspect ratio and expose full-size originals.
- Repeated builds are byte-identical. Invalid required config does not replace existing output. Incomplete executable inline tags and invalid publication categories fail closed. Valid new publication/news records pass baseline tests and render without dropping originals.

Screenshots and executable parent QA evidence are operator-local under the primary checkout .local/qa/. Worker evidence is in the isolated task worktree .local/. Neither is published by Pages.

## Initial Review Corrections (2026-10-11)

The first content review identified J9 research citation year loss while repairing a malformed DOI link. The source-confirmed 2025 is retained, along with the exact DOI link supplied by the source publication page.

The first code review requested changes for overly strict live record counts and incomplete-tag validation; it also identified unknown publication categories. These were fixed at the baseline assertion and build-validation boundaries, with regression tests. Public-facing migration-mechanics prose was removed; factual provenance remains in docs.

An initial parent filter-reset assertion read before the native form reset default action and scheduled UI update. Instrumentation showed four filtered records during reset, then an empty query and all 20 records in the next task. The harness now waits for the DOM state, without changing correct production behavior.

## Initial Release Verification (2026-10-11)

- Focused final code review: APPROVE, after testing collision-free future publication fixtures. The existing J17 in-memory regression also passed all four targeted tests.
- Latest feature-branch CI passed: https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/38154637890
- Verified implementation commit e163dcfb4719b799a85d0438211353f6c16c3f8e was fast-forward integrated into the clean primary main worktree and pushed.
- Main test/build and Pages deployment passed: https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/38154808069
- Public URL: https://data-science-tamu.github.io/ ; Pages build type is workflow and HTTPS is enforced.
- Live integrity checks: 49 requests passed. Published HTML, images, fonts, CSS/JS and the real CV match local build SHA-256 hashes. Unknown routes and non-public build-source paths return the custom 404.
- The full Chromium QA was repeated against the live HTTPS website: 27 page/viewport cases, 71 internal targets and 11 interaction checks passed with no failures.
- Source-code/provenance files remain available in the intentionally public GitHub repository but are not served by the Pages website.
- At that release checkpoint, only documentation closeout remained; these results do not verify the later academic/polish release.

## Limitations

External publisher/profile URLs are source-provided and were not exhaustively tested for availability. Testing does not claim Safari/Firefox or full assistive-technology coverage. The existing source/CV discrepancies are documented in source-provenance.md; source capture does not establish that every academic status is current.

## Academic Readability Preview (2026-10-12, Historical Local Scope)

See [scope, measured comparison, evidence and rollback](academic-preview.md).
Final parent suite:50/50; deterministic build9 pages+404; content20 publications,
14 news items,8 projects. Chromium27 route/viewport cases,80 local targets,11
legacy interactions and30 figure-viewer cases passed. Large text/short-height,
print/no-JS, source-load failure, unsupported dialog and pending-preview image
geometry gates passed. Baseline42 protected files and243 paragraphs preserved.

Evidence: .local/academic/qa/{before,after,evidence}/, .local/academic/review.md,
.local/academic/source-resolution/summary.json and .local/academic/worker-result.md.
Fresh larger source assets are documented in source-provenance.md and verified
by the build; they do not replace captured original assets. Public main and the
4174 information-architecture prototype were unchanged at that historical local-only
checkpoint. That dated evidence did not claim or authorize the later release.

## Academic and Polish Release Preparation (2026-10-13)

- Owner explicitly authorized GitHub publication of the current academic + restrained
  polish using gpt-6.1-sol/max; earlier local-only restrictions/timeout are superseded.
- Academic review: APPROVE including the cold-image fix and33 pending-load cases.
- Polish review: deleg_9b881723 APPROVE; reviewer independently passed58 tests.
- Parent independently verified58 tests/build,27 routes/viewports,80 targets,
  11 interactions,30 viewer cases and four-width print/focus/content/type/photo
  invariance; recovery/no-JS/print gates passed. Evidence: .local/polish/qa/ and
  .local/polish/preservation.json;55 output files, only CSS changed in last polish.
- Retained recovery: backup/pre-academic-20261012 at
  7ad88ee1362f885fee1688796e9dbb00a96a6d95, verified
  .local/academic/pre-academic.bundle, and81-file .local/polish/pre-polish-source.tar.gz.
- Documentation worker: npm test58 passed/0 failed; npm run build9 pages+404,
  20 publications,14 news items,8 projects; git diff --check passed today.
- Release still pending: parent fresh verification, task commit/push+exact-commit CI,
  main fast-forward/push, exact-head Pages success and live HTTPS build readback.
  Parent will append success evidence; authorization/local QA is not publication.

Parent fresh pre-release checks (2026-10-13): locked npm install, 58 tests, build,
27 Chromium route/viewport/accessibility cases, 80 targets, 11 interaction flows,
30 figure cases and 8 additional print/recovery/large-text cases passed. All 55
build files exactly match the owner-approved preview. Evidence is under
.local/release/local-qa/ and .local/release/approved-dist.json. No runtime file
changed during release preparation. The Sol/max documentation worker completed
its seven-file edits and test/build pass; parent took over final closeout.
