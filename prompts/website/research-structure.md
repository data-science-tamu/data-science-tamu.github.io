# Research navigation and presentation

Implement ONLY in /home/jlee/projects/.worktrees/data-science-tamu.github.io-research-structure,
branch feat/research-structure, starting at 6bcceef. Read this repo's AGENTS.md.
Use absolute paths/workdir: terminal default can point to unrelated AI-Research-Assistant.
Do not edit other repositories, auth/config/skills. First terminal call explicitly
cd to this worktree, next call pwd verifies persistence. You are gpt-6.1-sol/max.
Parent owns QA harness, final docs closeout, commit, push, main integration/deployment.
Do NOT git commit/push, start servers, spawn agents, or change runtime configuration.

Owner request: hovering Research should expose three research directions. Research
text currently is unstructured: Goal, Methodologies, PDE Equation need strong
labels; collaborators distinguished; Advanced Science explanation is a subitem
of its citation, not a peer paragraph. Apply throughout research pages. The
integration-of-three-things diagram belongs at the top of Research, before directions.

## Acceptance

1. Shared data-driven Research disclosure on header across all routes including
404 AND home primary Research action (not footer). Reuse lab.research.areas; do not
copy direction names/URLs. Keep Research itself a normal /research/ link.
Separate visible toggle for keyboard/touch. Hover opens on mouse; pointer can
travel into menu without gap closing it. Keyboard access to all links, Escape
dismissal with appropriate focus return, outside-click and focus departure close.
ARIA matches visibility. No role=menu for site navigation. Mobile directions must
not clip. No-JS links remain usable; no dead toggles. Minimal JS/CSS, no dependency.
Hide dropdowns in print. Handle viewport changes and outer mobile-nav Escape.
2. Present all eight projects in /research/ and direction pages with hierarchy.
Bold existing Goal:, Methodologies:, PDE Equation:, Detail: labels; distinguish
collaborators. Group citations beneath Publications label, and nested lists for
journal/award/featured note(s) explaining that citation. Keep Publication record
links integrated. Do NOT infer relationships at runtime from prose regex or
special-case IDs/venues in code. Prefer small explicit presentation metadata on
maintained paragraphs and one narrow renderer. Preserve original text/links,
accepted status/year/names. No invented Goals. All text visible without accordion.
3. Reorder Research: title/summary, overarching integration theme and original
/assets/images/research-1-cd79bc1b85.png, then directions, then supporting
interests/overview, other figure/news and projects. Three concepts are Domain
Knowledge; Statistical/ML Modeling; Uncertainty Quantification. Original figure
lists physics/engineering knowledge; data-driven modeling; Bayesian framework.
Add concise accessible textual counterpart grounded in these labels, new authored
research text in content/lab.json, not code. Move figure, do not duplicate. Retain
source-size viewer. Restore headings and real lists for Tasks:/Approaches:/
Applications: overview, currently flat paragraphs. Do not remove or rewrite facts.

Preserve white academic design, type tokens, restrained maroon accents, image
geometry, viewer, original assets/CV and other pages. No gradients, shadows,
decorative panels, packages, external loads or tracking. content/source immutable.
Never weaken source paragraph coverage. Existing tests comparing raw html may be
updated to equivalent semantic text preservation if inline strong tags changed.

## Workflow

Refresh plan.md/todo.md for task; preserve consideration-only ideas. Strict TDD:
write structural/semantic tests, run RED before code, record RED/GREEN under
.local/research-structure/. Parent baseline npm test already passed 58 tests.
Implement, npm test/build, git diff --check. Update wiki/codebase.md and concise
canonical docs for metadata/navigation. Parent gates remain pending. Write actual
results and selectors/state behavior to .local/research-structure/result.md.
Stay focused, concise reads, implement rather than repeatedly plan.
