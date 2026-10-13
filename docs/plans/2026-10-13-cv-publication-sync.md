# CV Publication Synchronization Implementation Plan

> **For Hermes:** Execute scoped test-first implementation with independent parent review.

**Goal:** Match all public CV publications and verified publisher metadata across website and served CV.
**Architecture:** Maintained bibliography is canonical for publication/research citations. Immutable captures remain historical. Current CV artifact provenance is separate. Parent applies a reviewed staged CV build.
**Tech Stack:** Node static generator/tests; existing TinyTeX/Biber; browser QA; GitHub Pages.

## Sequential implementation
1. Add focused failing tests for15journal/4review/2working/4conference records, corrected author/venue/status/DOI fields, working filter and legacy anchors; record RED.
2. Apply minimal data/validation/rendering corrections and canonical research citations; record GREEN.
3. Document explicit approved source exceptions without weakening unrelated source coverage; maintain currentCV provenance.
4. Parent validates independently corrected staged CV source/PDF and applies publication-only edits with backup and checksum guard.
5. Run npm test, npm run build, git diff --check; independent review and actual desktop/mobile/keyboard/accessibility QA.
6. Parent commits/pushes branch, verifies exact-commit CI, integrates main and verifies Pages plus liveHTML/PDF; then records completed gates.

## Acceptance
Every publicCV record appears once in its correct category; all verified fields agree; no private targets leak; existing anchors/othercontent/assets remain; servedCV and research citations are current; no unrelated changes.


## Local Implementation Checkpoint (2026-10-13)

Steps 1–3 and the local checks in step 5 are complete: expected RED recorded,
32 focused/118 total checks pass, canonical public records/citations and explicit
source exceptions implemented, original captures/hash fixture/PDF unchanged,
current-CV provenance initialized. Actual commands/results: ../validation.md.

Steps 4 and 6 remain parent-owned, together with independent review and actual
browser/accessibility gates from step 5. Browser tool access was blocked by
approval policy never. The worker leaves all changes uncommitted; no CV source
write, PDF rebuild/replacement, push, integration or deployment is claimed.

## Parent Checkpoint

Step 4 and actual local-browser gates in step 5 are complete. PDF provenance and
measured parent results are recorded in docs/validation.md. Independent review and
step 6 are pending; no remote deployment success is claimed at this checkpoint.

Final parent and independent review gates passed after the two-character CV
author-list parsing repair. Only step6 remote release remains pending.
