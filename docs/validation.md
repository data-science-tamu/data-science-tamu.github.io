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
- At this preparation checkpoint the parent release gates were pending; their
  subsequently verified completion is recorded below.

Parent fresh pre-release checks (2026-10-13): locked npm install, 58 tests, build,
27 Chromium route/viewport/accessibility cases, 80 targets, 11 interaction flows,
30 figure cases and 8 additional print/recovery/large-text cases passed. All 55
build files exactly match the owner-approved preview. Evidence is under
.local/release/local-qa/ and .local/release/approved-dist.json. No runtime file
changed during release preparation. The Sol/max documentation worker completed
its seven-file edits and test/build pass; parent took over final closeout.

## Verified Academic Release (2026-10-13)

- Implementation commit: f39fdb590b66bc8a2957043d1231cc6ab85572a1.
- Task branch CI: https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/38414792839 (success).
- Fast-forward integrated into clean primary main and pushed; exact-head test-build
  and Pages deployment: https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/38414888674 (both success).
- Public URL: https://data-science-tamu.github.io/.
- Live integrity: 58 requests passed, comparing public HTML/assets/CV and custom
  404 bytes with the verified build. Source-only paths remain custom404 on Pages.
- Repeated live Chromium checks: 27 route/viewport/accessibility combinations,
  80 targets, 11 interaction flows and 30 figure-viewer cases passed.
- Parent and Sol/max each ran 58 passing tests and the actual build. Primary build
  matched all 55 owner-approved preview files. Fresh independent release review
  deleg_37203263 approved the unchanged runtime and dist-only publishing boundary.
- Recovery tag backup/pre-academic-20261012 is also on GitHub; peeled commit is
  7ad88ee1362f885fee1688796e9dbb00a96a6d95. Local bundle and pre-polish archive remain.
- Evidence: .local/release/live-qa/evidence/ and .local/release/live-qa/after/ in
  the academic worktree. Google Sites and separate4174 prototype were untouched.
- Subsequent closeout edits are documentation-only; parent verifies their exact-head
  workflow again before handoff. No Safari/Firefox or physical screen-reader claim.

Non-blocking CI platform notices: existing v4 Actions use a deprecated Node20
action runtime now executed as Node24 by GitHub; ubuntu-latest migration was
also announced. Both jobs passed; no workflow upgrade was included in this release.

## Research Structure Local Verification (2026-10-13)

Baseline:6bcceef. Task branch:feat/research-structure. Implementation and follow-up
fixes used gpt-6.1-sol/max; the parent owns independent QA and release.

- npm ci --ignore-scripts, npm test and npm run build succeeded:83 tests,0 failed.
  Source export without Git history independently passed all83 tests.
- 22 new rendered-structure cases passed:both disclosure locations across1440,
  1024,801,800,390,320px; source text on four research routes; print; no-JS at1440,
  390,320; emulated touch at390,320. Tested axe A/AA rules report no violations.
- 19 additional navigation cases passed:BODY-focus hover Escape for both instances,
  200% text at five widths, breakpoint/same-breakpoint focus recovery, nested/outer
  Escape, and all ten shared headers including404 plus print-hidden directions.
- 48 actual focus transitions passed:30 direction1024->390;6 direction1024->801;
  6 direction390->1024;6 primary-link1024->390. No BODY or hidden focus outcomes.
- Existing regression QA passed:27 page/viewport/accessibility combinations,
  80 local targets,11 interaction journeys,30 scientific viewer cases and8 extra
  print,large-text,short-screen,error/fallback checks.
- Preservation:45 captured-source/image/CV files match the baseline hashes;
  16 project renderings retain72 paragraph instances and16 original citation-link
  instances. Faculty,people,publications,news maintained data are unchanged.
  Existing243-paragraph source gate remains. Image-source/catalog tests pass.
- Visual checks covered theme ordering and all-new menu states at desktop/mobile,
  and actual bone project text at1440/390:Goal/Methodologies/PDE labels are strong,
  collaborators distinct and Advanced Science note nested beneathJ9.

Causal correction:the original flat renderer had no presentation-role metadata;
text-preservation tests could not detect a missing hierarchy. New metadata and
semantic tests correct the data/rendering boundary. For responsive focus,the DOM
platform double accepted hidden focus and missed browser CSS-induced blur before
resize/media events. Production now resolves actual nav via Menu aria-controls,
selects a visible owner before hide,and handles null-relatedTarget focusout on a
collapsed nav. Hover-only Escape now reaches a document listener without default
prevention or focus theft. Both defects were reproduced before fixes.

Evidence lives in ignored .local/research-structure/:RED/GREEN logs,qa scripts,
JSON results/screenshots,baseline hashes,focus-fix.md and independent review files.
No QA evidence,source,docs or prompts enter dist. Browser coverage is Chromium,
including emulated touch,not physical assistive-technology or cross-browser QA.
Final review approval and deployment evidence are recorded separately below.

### Independent Review Approval

Content/theme review approved all eight projects and exact text/HTML/link
preservation. Final focused navigation re-review approved both repaired P2s with
23targeted tests,19extended cases,48focus cases and18independent browser probes.
Source and served JS matched SHA-256 4fbf425e789a9ecd9f439ddea6fb2f931522c17f43a14135836ace027542a14c.
Reports: .local/research-structure/deleg_74078668.json and final-review.md.
No in-scope blocking findings remain. These are local/review gates,not a claim
that GitHub integration or public deployment has finished.

## Research Structure Public Release (2026-10-13)

- Implementation commit:7a378bfb0e89a9344738e1b5860bb9865bf83ace.
- Task branch CI38438196473 succeeded; the same commit fast-forwarded into clean
  primary main. Parent reran83tests/build there before pushing.
- Main Pages run38438288315 succeeded in test-build and deploy. Actual GitHub
  readback confirms the intended main commit and rollback tag
  backup/pre-research-structure-20261013 at6bcceef1f1df17ace63b2d6141a50f1e02f9bd0b.
- Live https://data-science-tamu.github.io/ integrity:58requests,0failures. The
  55public artifact files match the approved local candidate; protected/unknown
  paths return custom404 rather than exposing source material.
- Repeated full parent QA on the public HTTPS URL:22structure scenarios,
  19extended navigation checks,27page/viewport axe cases,80local targets,
  11existing interactions,30viewer cases and8extra checks all passed.
- Workflow emitted existing advisory notices about actions'Node20 runtime and
  upcoming ubuntu-latest migration; neither failed either job. CI migration is
  outside this presentation change; no workflow or dependency change was made.
- Public source/asset/content preservation remains as documented above. No
  remaining task-specific acceptance gate; strategic ideas remain consideration-only.
