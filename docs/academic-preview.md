# Academic Readability Preview

## Approved Release, Publication Pending

The owner explicitly authorized GitHub publication of the current academic and
restrained-polish candidate on 2026-10-13. Implementation and independent reviews
are complete. Earlier local-only restrictions and the approval timeout are
historical and superseded; this authorization is not a successful-publication claim.
Parent owns fresh verification, Git/CI, main integration and exact-head Pages/live checks.

- Primary checkout preview (serves its current dist): http://localhost:4173/
- Previous research/collaboration proposal (unchanged): http://localhost:4174/
- Academic readability revision: http://localhost:4175/

These loopback URLs work only on the same Windows/WSL computer. The server uses
scripts/serve.mjs and serves dist only, not this repository or local evidence.
Build with npm run build; serve this worktree with PORT=4175 node scripts/serve.mjs.

## Recovery

The exact starting point is commit 7ad88ee1362f885fee1688796e9dbb00a96a6d95, retained
by local tag backup/pre-academic-20261012. The independent previous proposal is
preserved on preview/research-collaboration. No previous candidate is overwritten.

A verified offline Git bundle at .local/academic/pre-academic.bundle retains the
original tag and reachable history. The81-file pre-polish archive is retained at
.local/polish/pre-polish-source.tar.gz, preserving the earlier academic version.
Port4173 serves primary dist and can change after its next rebuild.
For an unchanged original comparison, create a separate worktree at the backup
tag, then build and serve it on a free port. Do not reset a dirty worktree.

If the approved release later needs rollback, create a new revert commit for the
exact promoted changes and run normal release tests/deployment verification. Do
not force-push main, delete current work, or use destructive reset for rollback.

## Verification Status

Academic and polish implementation and independent review are complete: academic
APPROVE including the cold-image fix (33 pending-load cases); polish deleg_9b881723
APPROVE with58 independently passed tests. Parent verification is recorded below;
publication success remains pending the parent-only release gates in ../todo.md.
Before evidence: .local/academic/qa/before/readability.json and screenshots.
Baseline measurements: 1440px viewport, home title 110.88px; bone figure 455.375px
wide from a 1280px original. Source-content/asset preservation manifest is under
.local/academic/qa/preservation.json. Source fidelity remains the existing
243-paragraph owning-page gate in tests/site.test.mjs.

See [source provenance](source-provenance.md), [codebase guide](../wiki/codebase.md)
and [active plan](../plan.md). Runtime ownership stays inside this repository.

## Genuine Higher-Resolution Figures
Fresh Google Sites image URLs recovered nine larger source rasters. Ten corresponding
1280px downloads are byte-identical to the existing captured images. Side-by-side
inspection matched the diagrams. The files are not AI upscales or rewritten labels.
They are additional assets, not replacements for captured migration evidence.
Catalog: content/figure-originals.json. Downloads/provenance measurements are under
.local/academic/source-resolution/. Original image URLs are retained in that catalog
for provenance only; the deployed site will use local assets, not Google hotlinks.

These are Google Sites source rasters, not a claim of vector/authoring masters.
The 1165px domain-knowledge diagram already matches the largest served source;
there is no higher-resolution replacement for it.

## Verified Comparison (2026-10-12)
At 1440px viewport, home title: 110.88px -> 34px; section headings: 44.8px ->
26px; body 17px, small text minimum 15px. Bone figure inline width:
455.375px -> 1232px, with 2047px authentic source available at native 100%.
Original home introduction height: 644.33px -> 369.80px without factual deletions.

Parent verification: 50 Node tests; 27 route/viewport cases at1440/390/320;
80 local targets; 11 existing interactions; all10 figures at3 widths (30cases),
Fit/native/200%, corners, keyboard, Escape and focus/scroll restoration.
Open-dialog and page axe checks had zero violations for the tested WCAG tags.
Additional short-screen, 200% text, touch-emulated opening, load failure, unsupported
dialog, no-JS and print checks passed. All20 publications print after a zero-result
filter; recruitment and all8 projects/10 figures remain in print.

Cold-preview tests held every research-image download pending: all10 figures
reserved their true aspect-ratio space at1440/390 and originals opened before
previews finished loading. This prevents zero-area lazy images and layout jumps.

All42 protected baseline files stayed byte-identical. All243 captured substantive
paragraphs stayed on their owning pages. No publication status, person, source
image, or CV was replaced. Two parent-found issues were reproduced and corrected:
zero-height viewer at200% text, and zero-area lazy previews before decoding.

Windows localhost:4175 homepage and full-size bone original were fetched using
Windows curl and compared byte-for-byte with generated/local source files. A stale
WSL interop socket initially blocked the checker; selecting the existing working
socket only for those checks resolved it, without changing system configuration.

Browser testing used Chromium and emulated touch, not physical Safari or a screen
reader. Source rasters can still contain author-origin contrast/detail limitations.
This dated technical QA did not itself authorize release. The owner's separate
2026-10-13 GitHub publication approval is recorded above; no live release is claimed.

## Restrained Polish Follow-up

The owner requested a little more visual character after accepting the white
academic direction. The same local4175 preview now has a thin active/hover/focus
nav rule, one small maroon Research action, a fine offset portrait frame, and
slightly tighter h1/brand tracking. No gradient, shadow, motion or extra panel
was added. Exact font sizes, photo dimensions, scientific-figure geometry and
all content remain unchanged. Only assets/site.css differs among55 build files.

Before this pass,81 maintained files were archived and verified at
.local/polish/pre-polish-source.tar.gz; exact pre-polish CSS is
.local/polish/before.css and screenshots are in .local/polish/qa/before/.
The larger source archive preserves the complete earlier academic version. For a
published rollback, create a new revert commit covering the exact promoted changes,
including their tests, then rerun normal verification and deployment gates. A
polish-only comparison belongs in a separate worktree using the retained archive;
do not overwrite the approved candidate or park tests in the release worktree.

Parent validation:58 tests;27 layouts/accessibility cases;80 internal targets;
11 original interaction journeys;30 figure viewer cases; four-width comparison
of content/type/photo sizes/focus and print-safe action. Research viewer recovery,
large-text/short-screen and publication/project print checks still pass.
Evidence: .local/polish/qa/ and .local/polish/preservation.json.
No public deployment or Git commit was performed during that historical local-only
pass. Independent review is now APPROVE; current release authorization is above.
