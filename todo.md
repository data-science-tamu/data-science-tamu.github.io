# Academic Website Release Tasks

## News Source Corrections

- [x] Audit all News links and replace weak owner sources.
- [x] Reverse People photos to 2026, 2025, 2024.
- [x] Change Tatthapong will present to presented.
- [x] Tests/build/preservation/browser/review.
- [x] Commit/push/integrate/deploy/readback/closeout.


## QSR News Photos

- [x] Add attachment 1 to Tatthapong finalist News (2026.11.01).
- [x] Add attachment 2 to Council News (2026).
- [x] Append attachment 3 to webinar News (2026.10.21), retaining existing media.
- [x] Verify original bytes, preservation, tests/build/browser and independent review.
- [x] Commit/push/CI, integrate main, deploy/live readback and close history.

## QSR Council Election News

- [x] Verify exact role/term against supplied CV; do not infer election date.
- [x] Worker: test-first one year-only News entry, preserve all17 existing records and every other field.
- [x] Parent: tests/build, News/Home responsive/console/accessibility/links, independent review.
- [x] Parent: commit/push, main integration, Pages/live readback and history closeout.


## CV, News and People Refresh

- [x] Compare supplied CV/PDF and update all applicable content, preserving source truth
- [x] Remove webinar media sentence/inline flyer; keep PDF, YouTube and acknowledgement
- [x] Add Tatthapong 2026 finalist to Home/CV Awards and Honors
- [x] Add Sina QCRE group and certificate photos to existing News entry
- [x] Add Sina website and verified LinkedIn links for Tatthapong, Sina, Tanvir
- [x] Implement accessible horizontal Lab photos navigation with existing design
- [x] Confirm three funded grants, calculate total and add News
- [x] Find exact QSR LinkedIn highlight and add linked News
- [x] Parent: final content review, branch CI, main integration, Pages and live readback passed

### Existing News Link Audit

- [x] 2026.11.01: Tatthapong QSR finalist: existing official link retained
- [x] 2026.10.21: QSR webinar: recording/PDF retained, redundant media removed
- [x] 2026.05.16: Doctoral colloquium: specific CIEADH post added
- [x] 2026.03.23: Sina Technometrics: article DOI added
- [x] 2025.11.06: Montague Scholar: owner announcement added
- [x] 2025.10.27: QSR refereed finalist: official awards link added
- [x] 2025: Tatthapong received second place in the ISEN Best Presentation Competition organized by the INFORMS Student Chapter at Texas A&M University.
- [x] 2025.09.19: Tatthapong Advanced Science: article DOI added
- [x] 2025.09.01: Tanvir joins: preserved; verified profile linked on People
- [x] 2025.04.22: Sina QCRE finalist: official newsletter and two photos added
- [x] 2025.02.01: We are excited to begin the "Cannery 4.0" industry project with Crider Foods and look forward to building real-time machine breakdown prediction AI model.
- [x] 2024.12.10: SPAICD: repaired official TAMIDS link
- [x] 2024.12.11: IISE Best Paper: UW-Madison announcement added
- [x] 2024.07.22: Associate Editor: existing board/journal links retained
- [x] 2023.04.16: Top-viewed article: paper DOI added, historical date conflict recorded
- [x] 2022.10.04: ISE Magazine: paper DOI added; feature body remains member-gated


## INFORMS 2026 Lab Photo

- [x] Add native JPEG and caption with focused regression checks.
- [x] Parent: verify tests/build/preservation and desktop/mobile/accessibility.
- [x] Parent: commit/push, integrate main, deploy and read back live photo.


## QSR Webinar News

- [x] Verify existing finalist, webinar date/title and recording content.
- [x] Download flyer JPEG/PDF; locate owner-approved acknowledgement JPEG.
- [x] Worker: failing tests, one October 21 entry, two photos and recording/PDF links.
- [x] Worker: preserve prior news and non-news data; full tests/build/docs.
- [x] Parent: independent review, desktop/mobile/accessibility/assets/console QA.
- [x] Parent: commit/push, integrate main, deploy/live readback; close history.

Worker evidence: focused RED 18 tests / 5 expected failures; focused GREEN 22/22;
full tests 157/157; build, exact baseline/asset preservation and whitespace checks
passed. See .local/qsr-webinar/worker-result.md. Final parent QA/review and public release/readback passed; no QSR item remains open.


## Publication Presentation

- [x] Remove redundant DOI/Publisher record rows; keep functional title links.
- [x] Sequential journal labels shared across all pages; verify same-paper links.
- [x] Readable emphasized highlights, with factual wording preserved.
- [x] Project index numbers cannot shrink/wrap; native browser regression.
- [x] Full tests/build/preservation/browser QA and independent review.
- [x] Commit/push task, integrate main, deploy, live readback and close history.

## CV Publication Synchronization

- [x] Worker: record focused expected RED before production changes; synchronize
      all 15 journal / 4 review / 2 working / 4 conference records and research citations.
- [x] Worker: retain legacy fragments, public CV annotations/notes, original
      captures/PDF/assets and unrelated content; record approved source exceptions.
- [x] Worker: current-CV manifest, documentation, 118 passing tests, build and whitespace checks.
- [x] Parent: independent review and actual desktop/mobile/keyboard, no-JS/print,
      console and accessibility QA (worker browser tool blocked by approval policy).
- [x] Parent: verified publication-only CV rebuild/application, update current-CV
      manifest, and repeat tests/build and served-PDF comparison.
- [x] Parent: commit/push, CI, main integration, deploy dist and live HTML/PDF readback.


## Research Menu Correction

- [x] Worker: tests first, unified menu appearance, Overview and exact main theme.
- [x] Worker: update research presentation/wiki; tests/build.
- [x] Parent: visual desktop/mobile and keyboard/touch QA; independent review.
- [x] Parent: branch CI, main integration, deployment and public verification.


## Research Structure Task

- [x] Add semantic/structural and client-state tests; record expected RED.
- [x] Implement shared Research disclosures and progressive enhancement.
- [x] Structure every project/citation and overview; move integration figure.
- [x] Run npm test/build and git diff --check; update editing/wiki contracts.
- [x] Record implementation RED/GREEN and parent preservation/browser evidence.
- [x] Correct responsive focus race and hover-only Escape; repeat real-browser checks.
- [x] Parent: independent browser/accessibility QA, final review and local documentation.
- [x] Parent: commit/push, main integration and deployment/readback.

Academic/polish implementation and independent reviews are complete in history.md.
The owner-approved release was published and verified on 2026-10-13.

## Completed Release Gates

- [x] Fresh verification of final candidate: 58 tests/build, 55-file preservation and browser QA.
- [x] Commit/push approved task branch and verify successful exact-commit CI.
- [x] Fast-forward primary main and push main.
- [x] Verify successful exact-head Pages run and live HTTPS build readback; append
      release-success evidence to history.md and docs/validation.md.

## Consideration Only

These are options for later discussion, not approved implementation tasks. First
evaluate how the website can improve research visibility, qualified collaboration
and evidence-grounded publicity. This release approval does not authorize them.

- [ ] [consideration] Prior suggestion 2: Feature selected research on the home page using an existing figure, a concise problem/contribution statement and a publication link. Select work for strategic relevance, not only recency.
- [ ] [consideration] Prior suggestion 3: Make the Research landing page an overview and keep project details on the relevant research-direction pages, reducing repeated content while retaining factual coverage.
- [ ] [consideration] Prior suggestion 4: Consider a clearer Join Us entry point using the existing recruitment guidance; add recruiting periods or specific openings only after owner confirmation. Assess its priority against collaboration and publicity goals first.
