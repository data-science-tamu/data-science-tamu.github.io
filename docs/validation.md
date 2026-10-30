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

## Research Menu Correction: Local Evidence (2026-10-13)

Baseline main 8c634be passed 83 existing tests, but the new actual-browser contract
failed on the visible Directions label. That mismatch is the reported UI defect,
not a failure to navigate. Baseline screenshots and failure are under
.local/research-menu/qa/before/.

Parent reran npm ci --ignore-scripts, npm test (86 passed, zero failures), npm run
build (9 content pages plus 404), and git diff --check. The exact source/content
preservation check permits only the owner-authored research.theme.title change
in content/lab.json; production JS, image/font/source assets and dependencies are
unchanged. Existing source-coverage and CV-byte tests remain active.

Actual Chromium at http://127.0.0.1:4177:

- menu.cjs: 26 cases passed, no browser errors. Tests single visible Research
  label, no diagonal arrow/Directions text, borderless header icon, contiguous
  matched home colors, Overview-first link order, current-page semantics, actual
  Research and Overview clicks, hover travel, keyboard Escape, native touch,
  no-JS, print and exact single theme H1. Viewports 1440/1024/801/800/390/320.
- check.cjs: 27 page/viewport accessibility cases and 80 local targets; no failures.
- interactions.cjs: 11 existing user journeys passed.
- viewer.cjs: 30 scientific-figure cases passed, plus modified-link/no-JS fallback.
- extra.cjs: 8 print, image-error, short-screen/large-text and fallback checks passed.
- focus-resize.cjs after: 48 transitions passed, zero BODY/hidden-focus outcomes.
- escape-viewer.cjs: 3 hover-only Escape/native modal cancellation checks passed.

Parent inspected desktop header/home, mobile home and overview screenshots.
Screenshots captured after keyboard activation intentionally show the keyboard
focus outline; this is not the removed default Directions button border.
The focused suite was repeated after final shared hover/focus CSS changes.
Local harness corrections: axe needs explicit browser.newContext(); selectors
for Research were made specific because Overview deliberately shares its href.
These were QA harness fixes, not runtime failures or changes to acceptance.

Artifacts stay in ignored .local/research-menu/qa/. Independent review and live
release verification are pending; the local results do not claim deployment.

### Independent Menu Review

APPROVE with no substantive findings. Reviewer independently reran 34 targeted
tests, in-memory rendering/link/control-ID assertions, parsed content equality
apart from the approved title, unchanged JS and whitespace checks. The final six
reviewed source/test hashes were read back and matched the candidate. Report:
.local/research-menu/review.md. Parent owns actual browser and deployment checks.
Local worker completed normally with exit 0; its result is
.local/research-menu/result.md. The verified model was gpt-6.1-sol, reasoning max.
Remote recovery tag was pushed and read back at baseline 8c634be. Release pending.

### Research Menu Public Release

- Implementation commit 7f25023b68ec0d2665fea2e52b6b22409783cda5.
- Task branch CI 38446195880 succeeded. Parent fast-forwarded clean primary main,
  reran all 86 tests and build there, pushed main and read back the exact SHA.
- Main Pages 38446259522 succeeded (test-build and deploy).
- Actual https://data-science-tamu.github.io/ integrity: 58 requests, zero failures;
  public artifacts match the verified 55-file build, including custom 404 handling
  for private/unknown routes. Approved artifact manifest remained unchanged.
- Repeated on public HTTPS: 26 menu/appearance/navigation cases passed with zero
  browser errors; 27 page/viewport accessibility cases and 80 targets passed;
  3 hover-only Escape and native-viewer cancellation checks passed.
- Public Research and Overview clicks from header and home reach /research/;
  both show the exact owner-authored single H1. Both menus start with Overview
  followed by all three maintained directions. No visible Directions label,
  separate header chevron box or two-color home split remains.
- Recovery tag backup/pre-research-menu-20261013 was pushed/read back at
  8c634bea071e4c8b505c13e0d5981cc8b4db1445. Source facts, original scientific assets,
  CV and original Google Sites remain unchanged. No task-specific gate is open.


## CV Publication Synchronization: Local Worker Evidence (2026-10-13)

These results verify the local website implementation; the served PDF still has
its original bytes and parent PDF synchronization/release gates remain open.

| Command/check | Actual result |
| --- | --- |
| Before production edits: node tests/cv-publication-sync.test.mjs | Exit 1; 31 expected failures (RED), including 14/2/0/4 vs approved 15/4/2/4 |
| Final focused node tests/cv-publication-sync.test.mjs | Exit 0; 32 passed, 0 failed |
| npm test | Exit 0; all 10 test files passed |
| node --test --test-isolation=none tests/*.test.mjs | Exit 0; 118 passed, 0 failed, 0 skipped |
| npm run build | Exit 0; 9 content pages plus 404; 25 publications, 14 news, 8 projects |
| git diff --check | Exit 0; no whitespace errors |
| Source coverage / research hashes | All 243 substantive paragraphs covered; original hash fixture unchanged; only recorded approved citation replacements |
| Internal links/assets/fragments and deterministic rebuild | Passed through actual generator tests, including J15-review alias |
| Protected source/image/PDF hashes and unrelated content | 45 protected files unchanged; unrelated maintained content identical |

Focused mutations reject missing journal venue, wrong author order, incorrect DOI,
reclassified Manufacturing Letters and omission of each of the 25 public records.
The real existing client script filters both working/undated papers, finds J11
under IISE Transactions, hides empty groups and resets all 25 records. Static
HTML includes all records without JavaScript; existing print rules restore all
hidden publication entries/groups. These are Node/data/markup/event-handler
contracts, not a claim of measured browser or assistive-technology QA.

Default sandbox Node child-process pipe capture returned spawnSync EPERM with
empty diagnostics, including on the negative config checks. The test build helper
uses temporary file descriptors and rejects launcher errors; real build exit
codes and error output are preserved. No expected failure assertion was removed.
The normal npm reporter shows files only in this environment; the detailed
no-isolation command supplies the actual individual-test count.

Browser tool navigation was attempted and rejected: approval is required but the
policy is never. Actual desktop/mobile layout, keyboard, no-JS/print, console
and accessibility gates remain explicitly pending for the parent. No worker
browser success, live-site change or deployment is claimed. Local commands,
RED/GREEN logs and preservation results are in ignored .local/cv-sync/.

### Parent PDF and Release Steps

1. Independently verify the staged publication-only CV changes against the
   approved bibliography in source-provenance.md. Keep BibTeX keys, other CV
   sections, public notes and author annotations; exclude private instructions.
   Use J11’s 2026 bibliography/assigned November issue without claiming print
   completion; retain J2’s CV final issue rather than incomplete API pages.
2. Back up/checksum the original CV, rebuild and inspect the public PDF, then
   apply the verified file to public/assets/documents/jaesung-lee-cv.pdf.
3. Set content/cv-current.json bytes, SHA-256 and truthful rebuilt-artifact
   provenance. Preserve content/source/manifest.json as the original capture.
   Tests allow a verified replacement; they do not force the original PDF forever.
4. Repeat npm test, npm run build and actual browser/source/PDF review, including
   the 15/4/2/4 categories, working filter, legacy anchors, print and no-JS.
5. Parent commits/pushes, verifies CI, integrates main, deploys dist only and reads
   back the live Pages HTML/PDF. Record those gates only after actual success.

## CV Synchronization: Parent Verification (2026-10-13)

The parent independently applied the reviewed five-source CV patch after a
backup/checksum guard; no BibTeX keys were added. The rebuilt public PDF has
10 pages, 167237 bytes and SHA-256
`5bff8f004569a8fccd6d34129b8b028ce2b2317f00a9cfe44dd45ffbc79b272d`.
The website PDF and current manifest now match this rebuild, superseding the
worker-only PDF checkpoint above. Nonpublication CV text is unchanged.

| Parent command/check | Actual result |
| --- | --- |
| npm test; npm run build; git diff --check | 118 passed, 0 failed; build and whitespace check passed |
| Independent publication-contract.cjs | 205 assertions passed; 15/4/2/4 records |
| validate_publications.py | 113 source checks passed |
| validate_pdf.py | 60 PDF/preservation checks passed; real TeX-built baseline and corrected PDF |
| Rendered CV publication pages | Visually inspected; no clipping or overlap |
| SHA-256 protected-file guard | 51 source, image, font, workflow and dependency files unchanged |
| site-layout.cjs (Chromium + axe WCAG A/AA) | 27 route/viewport combinations; 81 local targets; 0 failures, accessibility violations or console errors |
| publication-interactions.cjs | 44 checks passed: categories, search, reset, legacy fragment, print, no-JS and canonical research citations |
| keyboard-download.cjs | 6 checks passed: skip link, mobile keyboard menu, search/reset/category selection, exact corrected PDF download |
| Served local PDF byte comparison | Identical to reviewed rebuild |

Viewports: 1440, 390 and 320 CSS pixels. Automated accessibility checks are not
a claim of exhaustive assistive-technology testing. External publication URLs
were verified through the recorded publisher/Crossref audit where available,
not by bypassing publisher access restrictions.

Parent QA initially exposed a generated harness syntax error and asynchronous
assertion races (the reset wait matched the total in "0 of 25"; fragment position
was read before navigation scroll completed). Corrected harnesses wait for the
actual state and retain the assertions; no production change was needed.

Reproducible QA scripts, CV patch/backup and evidence are retained in the
operator-local CV synchronization archive; worker evidence is in ignored
`.local/cv-sync/`. No private CV source or backup enters the public build.
Independent gpt-6.1-sol/max review and remote release gates are recorded separately
only after completion.

### Independent Review Follow-up

The independent gpt-6.1-sol/max reviewer found one P2 mismatch: Matthew Lemon
was underlined in website J9 but not in the public CV PDF. The existing CV
StudentList omitted the comma between Matthew/Lemon and Tanvir/Ahmed. The
website matched the intended list but not the rendered PDF. Release is blocked
until the narrowly scoped delimiter repair, real-PDF verification and renewed
review are complete. All other public bibliography and source-preservation
checks were accepted; no substantive subprocess-handling defect was found.

### Final Parent Annotation Follow-up (supersedes both preceding rebuilds)

The comma-only repair exposed a second pre-existing parser issue: whitespace
after the last StudentList entry prevented Tanvir/Ahmed from matching. The
parent added the conventional TeX line-ending `%` to suppress that whitespace.
No names or roles were invented. Exactly two characters now differ outside the
previously authorized article driver, enforced by a byte-exact inverse guard.
The focused regression genuinely failed 12/13 before this second repair and now
passes 13/13 using the actual TeX parser. The 113 source checks and 66 actual-PDF/
preservation checks pass. M. Lemon has a real stroked underline, and all
nonpublication text plus immutable baseline files remain unchanged.

Final public artifact: 10 pages, 167272 bytes, SHA-256 `baf3923c557fc9c8f4ccd2fc48ae412377e7a7dd6926a50a6368f66e096ea65e`.
Original CV macro and website PDF/current manifest were applied by the parent.
The earlier 5bff8f and 3a033a artifacts are superseded, retained as historical
validation evidence only. New BibTeX keys: none.

### Final independent review: APPROVE

A separate gpt-6.1-sol/max read-only re-review verified the sole P2 remediation,
actual underline drawing, exact two-character CV macro change, preserved baseline
and matching staged/public/dist PDF. No blocking findings remain. Final local
gates: website118, source113, PDF/preservation66, realTeX13 and keyboard/download6
all passed. Branch CI, main integration and live Pages readback are the remaining
release gates and are not claimed by this local checkpoint.

## CV Publication Synchronization - Published and Verified (2026-10-13)

Implementation commit: `ba68f2a742e2b21842a8e0c5d35fe9940b1f3914`.
[Branch CI](https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/38482004793)
and [main test-build/Pages deployment](https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/38482075910)
both succeeded for that exact commit. Primary main was fast-forwarded and pushed;
only `dist` was deployed. Public site: https://data-science-tamu.github.io/.

Post-deployment HTTPS verification: all58 public-file/private-404 checks passed;
all served public files matched the reviewed build. Publication205 assertions
confirmed15 journal,4 review/revision,2 working and4 conference records. All44
publication interactions and6 keyboard/download checks passed. Live layout/axe
checks covered27 route/viewport combinations and81 local targets with no errors,
accessibility violations or overflow. JavaScript-disabled and print checks passed.

The live10-page PDF was downloaded separately and byte-compared:167272 bytes,
SHA-256 `baf3923c557fc9c8f4ccd2fc48ae412377e7a7dd6926a50a6368f66e096ea65e`.
The original CV sources, final staged PDF and served PDF now agree. Existing
BibTeX keys and all old publication fragments survive; no new BibTeX keys.
The sole independent-review P2 was fixed and re-reviewed APPROVE. No task-specific
implementation or release gate remains open. Earlier pending checkpoints above
are historical, not the current release state. Automated accessibility coverage
is not exhaustive assistive-technology certification.

## 2026-10-13 Publication Presentation Candidate

Owner requests: remove redundant record rows, use J15..J1 consistently across
all pages, make highlights legible, and keep project-index digits on one line.
Implementation used gpt-6.1-sol with reasoning max in its dedicated worktree.
Stored paper IDs/old URLs are stable; a shared order/count-based presentation map
feeds listing, canonical citations, record links and bracketed inline references.
Title links stay DOI-first; bibliography, notes and source data remain intact.
Notes use body-size ink and a thin maroon rule; nowrap nonshrinking project digits
are separate from wrapping titles. No client JS, scientific asset or CV change.

Causes and prior gaps: the listing rendered historical storage IDs as labels
after CV reordering; overview prose also embedded those IDs. Previous tests
protected identity but not sequential presentation. Notes inherited the shared
muted metadata style. Project digits were shrinkable flex children inheriting
overflow-wrap:anywhere; general page-overflow tests did not detect internal digit
line breaks. Guards now act at the presentation map/rendering and scoped CSS.

Evidence: baseline118tests passed. New expected RED reached16failures/1pass,
then17/17targeted GREEN. Parent independently ran135/135full tests, canonical
build and git diff --check successfully. All protected maintained/source content,
CV/images/fonts/JavaScript/dependencies and source fixtures equal e639d2c.
Native browser:254focused checks passed;27page/viewport checks and85local
targets passed; no accessibility/console/overflow failures. Focused checks cover
all13inline-reference items, journal search, same-paper href/title/DOI, original
fragments, no-JS/print, six viewport widths and enlarged text. Desktop/mobile
screenshots were inspected. Independent source reviewer APPROVE was read back
and matched to all4runtime SHA256s; reviewer separately ran17targeted tests.

Local evidence: .local/publication-presentation/{red.log,red-inline.log,green.log,
review.md}, qa/{report.md,numbering-map.json,after/results.json,evidence/qa-report.json}.
Candidate release gate was satisfied by the verified release below.

### Publication Presentation Release Verified

Implementation commit: acb9304cccd417ff4a82cc4a9c76072b11520128. Branch CI
38511150730 succeeded for this exact commit. Parent fast-forwarded clean main
from e639d2c, repeated 135 tests/build successfully, pushed, and verified remote
main equality. Pages run38511199791 succeeded for the implementation commit.

Public readback at https://data-science-tamu.github.io/ passed all58URL/content
integrity checks, including custom404 and non-public source paths. The native
focused browser repeated254checks with0failures on the public origin; general
browser repeated27page/viewport checks and85local targets with0failures.
Public desktop publication and mobile project-index screenshots were inspected.
All15journal display labels descend and resolve the same publications; existing
shared fragments and J15-review still target their original paper identities.

The remote recovery tag backup/pre-publication-presentation-20261013 was read
back at e639d2c232c4682a84cff36bee3db3981cc08300. Local candidate manifest has
55files and matches the unchanged production artifact. Final closeout changes
only planning/history/validation documentation. The requested task is closed;
existing consideration-only ideas remain unapproved and untouched.

Evidence: .local/publication-presentation/qa/live/results.json,
qa/evidence/{live-integrity.json,qa-report.json}, qa/candidate-results.json,
qa/candidate-manifest.json and the independently verified review.md. Coverage
limits remain Chromium and automated accessibility; no native assistive-tool or
external publisher-content audit is claimed. Non-blocking upstream Actions
Node20 deprecation and future Ubuntu-runner migration notices were observed;
workflow changes are outside this correction.

## Tatthapong QSR Finalist News: Local Verification (2026-10-27)

- One new `content/lab.json` record dated `2026.11.01`, the owner-supplied scheduled presentation date, with the official finalist announcement linked from the competition name.
- Parent independently reran all 139 tests: 139 passed, 0 failed. Deterministic build, source coverage and internal links/assets/fragments passed through the project suite. Build: 9 content pages plus 404; 25 publications, 15 news records, 8 projects.
- Compared to baseline `0bb2f3d`, all 14 previous news records and every non-news content field are unchanged; CV, source captures, images, CSS, JavaScript, templates and workflow are unchanged.
- Chromium checks passed for news and home at widths 1440, 390 and 320: six route/viewport cases, no overflow, console errors or tested axe WCAG A/AA violations. Official link href, keyboard focus, future-tense copy and November 1 date passed. News remains readable with JavaScript disabled and in print. Desktop/mobile screenshots were inspected.
- Evidence: `.local/qsr-news/parent-final-tests.log`, `qa-local/results.json` and `preservation.json` in the task worktree. Chromium/automated accessibility coverage is not exhaustive assistive-technology certification.
- At this local checkpoint, final corrected-date review and GitHub publication are pending; no live success is claimed.

### Tatthapong QSR News: Public Release Verified

- Final corrected-date independent review: APPROVE; focused tests 4/4.
- Content commit: d2008c4682ff806c6ab5215433fea47305a78986. Task-branch run [40552290402](https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/40552290402) succeeded; primary main fast-forward and push were read back from GitHub.
- Exact-commit main [40552388264](https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/40552388264) test/build and Pages deployment succeeded. The primary build matched all 55 approved build files.
- Actual HTTPS news and homepage bytes match the approved build. Checked all 15 news entries and 3 latest-news entries, with the new item dated 2026.11.01 and linked to the official announcement.
- Repeated native browser checks on public home/news at 1440, 390 and 320 pixels: six cases, zero console errors, overflow or tested axe A/AA violations. Keyboard link focus, no-JS and print passed.
- Evidence: `.local/qsr-news/live-integrity.json` and `qa-live/results.json`. The earlier local pending status is historical. Subsequent closeout edits change only documentation/planning, not any public build bytes.

## 2026-10-29: ISEN Presentation Year - Parent Local Verification

- Owner-confirmed event date is held only in the CV comment and website inert
  `_comment`; visible award year is 2025. Second-place wording and photos survive.
- Parent independently passed npm test, all 148 individual tests with isolation
  disabled for explicit totals, canonical/deterministic build and diff checks.
  The PDF replacement was followed by another passing npm test and build.
- Independent review deleg_d21d6bd3 approved the implementation with no blockers.
- Chromium checked News, Home and CV at 1440, 390 and 320 pixels: 9 cases, no
  tested WCAG A/AA violations, console errors or horizontal overflow. Target
  date, photo links, 15 records, chronology, unchanged QSR date, keyboard focus,
  JavaScript-disabled reading and print visibility passed. Desktop/mobile
  screenshots were visually inspected; final PDF download matched the manifest.
- Verified PDF is 167722 bytes, 10 pages, SHA-256
  `4e50fb2cd1765d39bac640913ad3b3fab0ab54fcd0b4697ee315724bc57c848e`.
  Exact day is not rendered. Current local CV body differs only by added 2025;
  public PDF additionally catches up already-approved nonpublication updates.
- Evidence: `.local/presentation-year/` with parent test logs, browser-check.cjs,
  qa-local/results.json/screenshots/downloaded-cv.pdf and worker RED/GREEN records.
  Publication/live readback remains a separate gate.

## 2026-10-29: Tatthapong ISEN Presentation Year - Published

- Corrected the owner-confirmed second-place presentation award to visible year
  2025 in the local CV and website. Exact day remains only in source comments.
  The news record is in 2025 chronology; sentence, two photos and QSR news remain
  unchanged. The download is the verified current 10-page CV.
- Content commit `8ecfe9538494003e6c2bde3c90a2402179a799d0` passed task-branch
  [CI](https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/40962425814),
  was fast-forward integrated into clean primary main, and passed exact-head
  [test/build and Pages](https://github.com/data-science-tamu/data-science-tamu.github.io/actions/runs/40962502835).
- Live [news](https://data-science-tamu.github.io/news/#news-2025), Home and CV
  passed the same 9 desktop/mobile Chromium cases, keyboard/no-JS/print checks,
  with no tested accessibility violations, console errors or overflow. Seven
  fetched HTML/CSS/photo/PDF resources match the verified build byte-for-byte.
  The real downloaded PDF is 10 pages and includes the corrected award year.
- Implementation, PDF synchronization, review, local/CI validation, integration,
  deployment and live readback are complete. Active task entries were removed
  from plan/todo; unrelated consideration-only items remain. Evidence is under
  `.local/presentation-year/` (live-integrity.json, qa-live/results.json, downloaded
  PDF and screenshots). Original Google Sites and immutable captures are intact.

## 2026-10-29: Session Chair Label

The owner requested removal of `(scheduled)` from the 2026 Session Chair entry
only. The authoritative local CV retains the exact session title and November
2026 date. Full-PDF text comparison confirms that this label is the sole body
change; both PDFs are 10 pages and the Tatthapong presentation award remains
2025. The parent visually checked page 9 and refreshed the public PDF/manifest.
All 148 tests and the deterministic build passed; only the PDF differs in build
output, with HTML, CSS, images and news byte-identical to the verified release.
Evidence: `.local/session-chair/`; final distribution is gated by exact-head
CI/Pages success and public PDF hash/text readback.

## CV Header Links (2026-10-30)

Parent verified 10 pages, exact label-to-URI annotation rectangles, no printed
profile addresses and unchanged remaining body text. Full npm test and all
148 individual tests passed; deterministic build and diff checks passed. Only
the PDF differs in the build, so HTML/CSS/images/news are byte-identical to the
previously verified release. Evidence: `.local/header-links/`; public acceptance
requires exact-head CI/Pages success and real downloaded-PDF annotation readback.

## Compact CV Contact Row (2026-10-30)

Parent verified the label order, shared baseline, exact four URI targets and
nominal 10pt contact size below unchanged 11pt affiliation. Full CV is 10 pages;
remaining body and other source files are unchanged. Header screenshot passed
visual inspection. npm test, all 148 individual tests and deterministic build
passed; only the PDF differs in build output. Exact-head CI and live PDF
readback evidence are retained under `.local/contact-row/`.

## Elected QSR Council Member (2026-10-30)

Parent verified 10 pages and that adding Elected is the sole body difference.
The first-page raster is pixel-identical, all URI destinations are preserved,
and page 8 passed visual review. npm test, all 148 individual tests and the
deterministic build passed. Only the PDF differs in the build output; website
HTML/CSS/images/news remain byte-identical. Exact-head CI and public PDF
readback receipts are retained under `.local/elected-council/`.

## FLATE Date and Collaborator Name Corrections (2026-10-30)

Baseline and corrected TeX Live 2025 builds both have 10 pages. Exact normalized
body comparison permits only the supplied FLATE entry replacement and the two
Andrew Read-Fuller corrections; only pages 4/5 differ in raster comparison.
Both pages passed visual review, all URI destinations are unchanged, and the
exact November 12 date is absent from visible PDF text. Source manifest confirms
only presentation.tex and proposal.entry.tex changed; the short CV is untouched.

`npm test`, all 148 tests with isolation disabled, deterministic build and local
browser checks passed. At 1440/390/320 px, news/home/CV routes have no overflow,
console errors or axe WCAG A/AA violations; no-JS and print checks passed. The
actually downloaded local PDF matches its manifest and passes the same semantic
checks. Build comparison confirms every non-PDF output remains byte-identical.
Evidence: `.local/flate-name/`; branch CI, independent review and live-release
receipts are recorded separately at release.
