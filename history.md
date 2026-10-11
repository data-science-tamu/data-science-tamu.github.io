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
- Remaining gate: focused review approval, remote CI, main integration and live HTTPS verification. See plan.md and todo.md.
