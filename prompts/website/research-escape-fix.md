# Approved parent QA follow-up

Continue only /home/jlee/projects/.worktrees/data-science-tamu.github.io-research-structure.
The parent intentionally added hover-only Escape checks to its own QA harness and
edited planning docs while your prompt explicitly delegated those to parent. These
are expected approved changes. No other writer is now modifying source or tests.
Your focus fix is accepted pending parent recheck. Do NOT discard any work.

Read .local/research-structure/navigation-review.md: defect2 is required because
user hover menu must be dismissible while focus remains on BODY. Fix it now with
TDD, not merely handoff. Minimal document-level Escape dismissal for hover-only
open disclosures, no focus theft, leave own-root nested Escape then outer Escape
behavior and native figure-dialog Escape unchanged. No styling/content changes.
Tests should include both header/home while focus outside, actual parent harness
and existing viewer tests. No broad investigation: reviewer already reproduced
and exact root cause is listener only on root. Existing researchClosers can share
closure. Keep change small; no redesign/new deps/global sticky state/timers.

npm test && npm run build; node .local/research-structure/qa/navigation-extra.cjs.
Record actual focus and Escape verification in .local/research-structure/focus-fix.md
then finish promptly. Parent owns other docs, review, commit/push/deploy.
