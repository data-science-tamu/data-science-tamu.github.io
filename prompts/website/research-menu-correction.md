# Research menu correction

Only work in /home/jlee/projects/.worktrees/data-science-tamu.github.io-research-menu.
Read its AGENTS.md. This is an INDEPENDENT repository, not AI-Research-Assistant.
Absolute workdir/paths in every tool. Parent prepared task branch, plan and todo.
You are the implementation worker on owner-required gpt-6.1-sol reasoning max.

Owner rejected the prior UI: Research and Directions look like two different
things; homepage uses two colors and an extraneous diagonal arrow, header has a
box only around Directions unlike every other navigation item. Correct this:

1. Shared header/home component must look like ONE Research with adjacent down
   chevron. NO visible Directions label and NO diagonal arrow on this action.
   Preserve ordinary Research link -> /research/. Keep a separate semantic
   icon-only toggle (accessible name e.g. Open research menu) to support touch and
   keyboard, but integrate visually. No separate box/divider/border around the
   header chevron; typography/color/height/baseline aligned to Research and other
   nav items. Homepage is one same-color maroon action, including chevron, no gap
   or contrasting fill. Keep its existing compact rectangular academic design.
   Keep usable hit targets and visible keyboard focus. No giant controls.
2. Dropdown first entry Overview -> /research/, followed by the three existing
   research direction links exactly. Header and home share same helper. Overview
   has aria-current page only on exact /research/. Add Overview to the existing
   research subnav on direction pages for consistency; no new sections/features.
3. Main H1 for Research overview must be the exact owner-authored phrase:
   Domain-informed Statistical Machine learning and modeling with Uncertainty Quantification
   (The owner's final sentence period is not needed in a heading.) Store in
   lab.research.theme.title and render as page H1, not competing smaller H2.
   Remove old generic Domain-informed data science page heading and generic
   Integrating knowledge, modeling and uncertainty title from this overview.
   Keep existing integration explanation, concept mappings and original diagram
   before directions. Do not change science/citations/assets or rewrite source.
4. Preserve current working hover, Escape, responsive focus recovery, native
   figure viewer cancellation, no-JS access and print. Prefer no JS changes if
   markup/CSS suffice. No dependencies or unrelated cleanup.

First write relevant tests and record expected RED. Adjust previously incorrect
 tests (e.g. three total menu links becomes Overview plus 3 direction links; old
heading) for the new contract. Then implement narrowly and run npm test/build,
git diff --check. Update docs/research-presentation.md and wiki/codebase.md.
Parent owns plan/todo/history finalization and deployment, do not edit those.

No git commits/pushes/servers. Parent owns .local/research-menu/qa and will create
browser evidence independently; do not touch parent QA. Write .local/research-menu/result.md
with exact commands, counts, RED/GREEN and files changed, then finish. Aim for
small correct change, not prolonged research; max 35 turns / 900 seconds.
