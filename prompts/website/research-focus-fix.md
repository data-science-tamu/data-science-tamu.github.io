# Fix one verified responsive-focus race

Work ONLY /home/jlee/projects/.worktrees/data-science-tamu.github.io-research-structure.
Read AGENTS.md. First explicit cd+pwd, second pwd verify. Existing dirty files are
approved in-progress task changes; don't revert. Parent owns docs/review/commit/push.
You are gpt-6.1-sol/max. Previous implementation process stopped by parent after
runtime complete and tests75. No other source writer now. Do not start server or
spawn agents; don't change content, styling, auth, config, skills. Tiny focused fix.

Bug: opening header Research directions, focus a direction link at width1024,
resize to390 causes document.activeElement BODY instead of visible mobile Menu.
Intermittent ~half or more of20runs. Full parent failing harness:
node .local/research-structure/qa/navigation-extra.cjs
Evidence .local/research-structure/qa/resize-repeat.json. Current server4176 reads
dist; npm run build after changes. playwright at .local/research-structure/node_modules.
All other gates passed: 22structure scenarios,27page/axe,11journeys,30viewer and
sourcepreservation. No new features/redo navigation/styling.

Likely cause in public/assets/site.js: per-disclosure window.resize and media change
close(true) choose own control.focus() when header nav is already CSS-hidden at
mobile width. Later outer media listener reads activeElement BODY, loses old focus.
Fake DOM tests let hidden controls receive focus, so don't model actual browser.
Trace with real browser and fix earliest focus-owner boundary, not timeout/rAF
retries or sticky inferred state. Prefer minimal visible-target choice before hide:
when focused child is in header disclosure with nav currently collapsed by mobile
layout, transfer directly to outer Menu, otherwise own Directions. Consider event
ordering; all links inside primary-nav and samebreakpoint resize should remain sane.
Use real DOM ownership, not assumed root class/id detection hacks if avoidable.

1. Reproduce and add narrow regression test FIRST. Existing node DOM fake harness
can model visible/hidden ancestor focus, but prove via repeated browser transitions.
2. Minimal fix. Preserve existing mouse-hover, touch, Tab/Escape, noJS, ordinary and
modified link navigation. Do NOT change typography or presentation.
3. npm test && npm run build. Run parent's navigation-extra.cjs and repeat actual
1024->390 focused direction20+times with animation-frame sync. All should focus
visible Menu, never BODY or hidden node. Check1024->801 and390->1024 too.
4. Record actual commands/result/root cause in .local/research-structure/focus-fix.md
then STOP. Parent updates maintained docs. Do not broaden audit or continuously plan.
