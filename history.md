# Website History

## 2026-10-27: Tatthapong QSR Presentation Date Correction

- Implementation complete: the new news item uses `2026.11.01`, the scheduled
  presentation date from the owner-supplied selection email, rather than the
  website posting date or finalist decision date. No presentation time is public.
- Preserved the approved wording, future tense, official link and original 14
  news records. Updated the existing four focused tests and active documentation.
- Worker validation: direct focused execution passed all 4 tests; `npm test`
  passed all 12 test files; `npm run build` generated 9 content pages plus 404
  (25 publications, 15 news items, 8 projects); `git diff --check` passed.
- Parent QA, final review and release remain pending. No commit, push or deployment
  was performed; prior logs and the parent-owned browser script were untouched.

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
- At preparation time, parent-only gates remained: fresh verification; task commit/push+CI;
  main fast-forward/push; exact-head Pages run and live build readback.
  Their subsequently verified completion is recorded below.
- Recovery retains the baseline tag/bundle and pre-polish archive. Use a new
  revert commit for rollback, not reset/force-push. Port4173 follows primary
  dist; a separate worktree at the backup tag provides the original comparison.

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

## 2026-10-13: Research Navigation and Information Hierarchy

- Implemented with gpt-6.1-sol, reasoning max, in isolated feat/research-structure.
- Shared header and home Research disclosures derive three directions from maintained
  content and retain the Research landing-page link, touch/keyboard controls,
  JavaScript-disabled links and print behavior.
- One research-content renderer uses explicit labels, collaborator/citation roles,
  record IDs and nested explanatory notes. All eight projects and their source
  facts/links remain complete. Tasks, Approaches and Applications are real lists.
- Moved the original three-part integration theme/figure ahead of directions.
  White academic type, source-size scientific figures and CV are unchanged.
- Parent found and reproduced two navigation boundaries missed by the initial DOM
  double: CSS-driven focus loss before resize handlers, and hover-only Escape
  originating outside the disclosure. Focused Sol/max corrections use actual nav
  ownership/focusout and document Escape, with RED/GREEN regressions and repeated
  browser verification. No production diagnostic instrumentation remains.
- Parent local gates:83 tests/build; Git-free source export83 tests;22 structure
  scenarios;19 extended nav cases;48 focus transitions;27 page/viewport axe cases;
  80 internal targets;11 existing journeys;30 viewer cases plus8 extra checks.
  Source/asset preservation passed. Full evidence and limits: docs/validation.md.
- Release integration and public readback are not claimed in this entry.

- Independent content/theme and focused final navigation reviews APPROVE; parent
  verified the reviewed runtime hash. Release gates remain tracked in plan/todo.

## 2026-10-13: Research Structure Release

- Integrated7a378bf into primary main after branch CI38438196473 passed; Pages
  run38438288315 passed and actual public HTTPS readback matched55artifact files.
- Public58request integrity check,22structure,19extended navigation,27page/viewport,
  80target,11journey,30viewer and8extra checks passed. Both independent reviews
  approved the final source/runtime. Detailed evidence:docs/validation.md.
- Remote backup/pre-research-structure-20261013 preserves6bcceef for recovery.
  No source-fact,scientific-asset,CV or original Google Sites changes.
- Closed the task plan/todo. Consideration-only strategic suggestions remain unapproved.

## 2026-10-13: Research Menu Visual Correction

- Owner rejected the two-label/two-color Research and Directions presentation.
  The shared researchDisclosure template had introduced the redundant label and
  home diagonal arrow; the generic button rule and isolated Research-link fill
  produced the boxed header toggle and contrasting homepage controls. Earlier
  tests validated that split markup rather than the intended visual grouping.
- Sol/max implementation replaces this with a Research link and adjacent
  icon-only chevron: borderless in the header, same-color contiguous home action,
  shared hover/focus colors and retained keyboard focus indicators. JS unchanged.
- researchLinks shares Overview followed by the existing three directions across
  both dropdowns and the direction-page subnav. Research and Overview both lead
  to /research/. Exact-route current-page semantics are preserved.
- The owner-authored research.theme.title is now the main overview H1, replacing
  the generic H1 and competing integration H2. Scientific content, original
  diagram, publications, source snapshots, assets and CV remain unchanged.
- Parent local verification passed: 86 tests/build; 26 focused menu/appearance
  scenarios; 27 page/viewport accessibility cases and 80 targets; 11 existing
  journeys; 30 figure cases; 8 extra print/error/large-text cases; 48 responsive
  focus transitions; 3 hover-Escape/native-viewer checks. See docs/validation.md.
- Independent review, commit/CI, integration and live readback remain release
  gates tracked in plan.md/todo.md. Recovery tag: backup/pre-research-menu-20261013.

- Independent focused source/test review APPROVE, final reviewed-file hashes
  matched. Worker exit 0; parent owns remaining CI/integration/public readback.


## 2026-10-13: Research Menu Release Verified

- Published 7f25023 after task branch CI 38446195880 and main Pages 38446259522
  succeeded. Primary main has the verified change; both worktrees remain separate.
- Public exact-byte integrity passed 58 requests; the 26 focused visual/menu
  cases, 27 page/viewport checks, 80 targets and 3 Escape/viewer cases also passed.
- Closed plan/todo for this correction. Remote recovery tag preserves 8c634be.
  Detailed evidence and source/asset preservation: docs/validation.md.


## CV Publication Synchronization — Worker Complete (2026-10-13)

Implemented the owner-approved public CV/publisher correction set in the dedicated
CV-sync worktree. Maintained records are now 15 journal, 4 review/revision, 2 working
and 4 conference, ordered as the public CV. J15 replaces the stale J15* review
classification and retains J15-review; every previous publication fragment remains.
The new review/working website IDs do not change any CV BibTeX key.

Canonical structured authors/bibliography replace duplicate metadata/citation
strings. Research selected/project entries resolve recordId through the same
renderer, with all explanatory paragraphs, nested notes and images unchanged.
Public CV annotations/notes are retained; private destinations are excluded.
The current-CV manifest records the existing PDF truthfully, separately from the
immutable original capture manifest. The worker does not rebuild or write the CV.

Test-first evidence: 31 focused regressions failed before production edits; the
first mismatch was 14/2/0/4 vs 15/4/2/4. The corrected suite has 32 passing focused
tests, including an additional real-client-handler/print contract. Mutation checks
reject missing records, a missing journal, wrong author order/DOI and Manufacturing
Letters reclassification. npm test exited 0; the detailed no-isolation run reported
118 passed, 0 failed, 0 skipped. npm run build exited 0 (9 pages + 404, 25 records);
git diff --check passed. Build diagnostic capture now uses file descriptors because
sandbox child-process pipes returned EPERM and suppressed diagnostics; negative
build checks still assert actual nonzero status/error and preserved output.

All 243 source paragraphs retain coverage. Existing research paragraph hash
fixtures are unchanged; only explicit old citation substitutions are allowed.
45 protected source/image/PDF hashes and all unrelated maintained content compare
unchanged. PDF remains 166640 bytes, SHA-256
7f69e03576716d02fcca4eba376c83c874aec7e4851433aaf37228bbc0743264.
Evidence remains in ignored .local/cv-sync/.

Worker browser navigation was rejected by approval policy never; actual browser
layout/console/accessibility checks are not claimed. Parent still owns independent
review, original CV writes, verified PDF replacement/current manifest update,
actual browser QA, commits/pushes, integration, deployment and live readback.
No commit, push or deployment was performed by this worker.

## CV Publication Synchronization - Parent Local QA (2026-10-13)

Applied the backed-up five-source publication-only CV patch and rebuilt public PDF.
Maintained PDF provenance now supersedes the historical capture without modifying
that capture. Parent repeated 118 website tests, 205 publication assertions, 113
CV-source checks and 60 PDF/preservation checks. Actual browser checks passed:
27 route/viewport cases, 81 internal targets, 44 publication interactions and 6
keyboard/download checks. No automated accessibility or console failures.
All 51 protected non-CV assets/config/source captures remain unchanged.
Independent sol/max review and remote release are separate pending gates.

Independent review P2 resolved: CV StudentList separator/trailing whitespace
prevented intended advisee underlines. Real TeX regressions now13/13, source113/113,
PDF/preservation66/66; original CV and served candidate updated. Exact artifact
provenance is in content/cv-current.json. Final focused review remains pending.

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
