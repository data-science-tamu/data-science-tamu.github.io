# Publication Presentation Correction

Work ONLY in /home/jlee/projects/.worktrees/data-science-tamu.github.io-publication-presentation, branch fix/publication-presentation, baseline e639d2c. ALWAYS explicit absolute workdir/file paths. Read its AGENTS.md and test-driven-development skill. Ignore unrelated default repo context. You are requested gpt-6.1-sol / max.

Implement these owner requests, tests FIRST, expected RED before minimal code:
1. Publication titles already link to external record: remove redundant DOI record / Publisher record rows across listing (preprint too if title already linked). Preserve DOI-first title destination, publisher fallback for no DOI, plain title if no link. Keep DOI bibliographic text/facts. Refactor dead publicationLinks helper into minimal primary-link selector if clean, no unneeded abstraction.
2. Journal DISPLAY numbers J15 down to J1, current approved listing order unchanged. All Research overview/direction/project citation labels and internal Publication record labels must match the same paper's display label. Keep existing internal p.id/recordId and #Jx legacy fragments stable to preserve old shared URLs and captured/approved fixtures. Stable storage identities are not display numbers; document this. One small shared presentation mapping based on journal order/count, no manual 15-entry mapping in runtime or DOM string replacement. Use mapped records in both listing and research render. Non-journal labels remain unchanged. Do not mutate lab source or fixtures to make assertions pass. Prefer no new slug scheme; old anchors remain intentionally stable regardless of display index. Current search reads textContent and must return the current visible index, not hidden legacy text. Test insertion/reordering maps references consistently, no persistent accidental mutation, and same-paper href identity. Ensure citation function callers/tests updated to use explicit presentation context rather than silently getting stale journal labels.
3. publication-notes and citation-notes currently muted; make readable emphasis, body/ink text and a restrained maroon left rule or marker/weight suitable to existing white academic design. No bulky cards/giant badges. Preserve all note wording. No need to add noisy repeated Highlights headings.
4. project-index digits currently flex-shrink with overflow-wrap:anywhere; use nonshrinking nowrap digit column, long title still wraps normally and stays within viewport. Preserve all project anchor destinations. Test CSS contracts; parent native browser check at1440/1024/801/800/390/320 plus enlarged text.

Own source/CSS/test changes and relevant docs/research-presentation.md, docs/content-editing.md (if exists) and wiki/codebase.md. Do not edit parent's plan.md, todo.md, history.md, docs/validation.md, prompts or .local QA. No new dependencies, no unnecessary JS/nav/viewer change. Keep all content/lab.json, content/source, scientific assets, CV PDF/manifest, public metadata exactly unchanged. Existing 118 tests/source-coverage should remain meaningful; adapt presentation expectations without weakening immutable fact or source coverage.

Parent owns browser QA, independent review and release. Do NOT start servers, install browser, commit/push/merge/deploy. Run targeted RED/GREEN, npm test, npm run build, git diff --check, preserve protected paths. Finish with .local/publication-presentation/result.md listing actual commands/results, files and caveats. No need to wait for parent; return once implementation complete.

## Inline Reference Acceptance

All13reference-bearing overview items, including [J15*], must share the same
identity-to-display mapping. Recognize explicit bracketed reference groups only;
preserve surrounding scientific prose, attributes, punctuation and existing hrefs.
Avoid nested links. Unresolvable journal tokens fail closed. Source-only conference
C5 remains plain and unchanged; do not invent a publication. Verify insertion and
reordering against independent expected labels, not the production mapping helper.
