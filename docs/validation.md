# Validation Evidence

## Scope

The website is generated from maintained local content and assets. Original Google Sites captures are immutable migration evidence, not runtime dependencies. The local implementation model was gpt-6.1-sol with reasoning max; the parent owns independent reviews, targeted corrections and release verification.

## Local Verification

- npm test: 23 passed, 0 failed.
- npm run build: nine content pages plus 404; 20 publications, 14 news items and 8 projects.
- Source fidelity: every substantive captured paragraph is tested on its owning page; identifiers, statuses, author metadata, people and news are preserved. The CV hash matches the original capture.
- Internal references: 71 URL/fragment targets resolve in the independent browser checker; repository tests also inspect CSS URLs and all asset paths.
- Chromium responsive QA: all nine routes at widths 1440, 390 and 320; 27 combinations passed with no horizontal overflow, missing images, console/page errors or tested axe-core WCAG A/AA violations.
- Interaction QA: mobile menu open/Escape/navigation, text/year/type filters, empty/reset states, exact original PDF download, keyboard skip link and JavaScript-disabled navigation/reading; 11 checks passed.
- Manual screenshot review covered desktop and mobile home, people, publications, CV and scientific research figures. Scientific diagrams retain aspect ratio and expose full-size originals.
- Repeated builds are byte-identical. Invalid required config does not replace existing output. Incomplete executable inline tags and invalid publication categories fail closed. Valid new publication/news records pass baseline tests and render without dropping originals.

Screenshots and executable parent QA evidence are operator-local under the primary checkout .local/qa/. Worker evidence is in the isolated task worktree .local/. Neither is published by Pages.

## Review Corrections

The first content review identified J9 research citation year loss while repairing a malformed DOI link. The source-confirmed 2025 is retained, along with the exact DOI link supplied by the source publication page.

The first code review requested changes for overly strict live record counts and incomplete-tag validation; it also identified unknown publication categories. These were fixed at the baseline assertion and build-validation boundaries, with regression tests. Public-facing migration-mechanics prose was removed; factual provenance remains in docs.

An initial parent filter-reset assertion read before the native form reset default action and scheduled UI update. Instrumentation showed four filtered records during reset, then an empty query and all 20 records in the next task. The harness now waits for the DOM state, without changing correct production behavior.

## Release Verification

Pending focused review approval, GitHub CI, integration and live HTTPS verification. This local report does not claim public deployment.

## Limitations

External publisher/profile URLs are source-provided and were not exhaustively tested for availability. Testing does not claim Safari/Firefox or full assistive-technology coverage. The existing source/CV discrepancies are documented in source-provenance.md; source capture does not establish that every academic status is current.
