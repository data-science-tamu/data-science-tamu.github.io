# Research Top-Menu Comparison

## Scope and Authority

The comparison was initially LOCAL ONLY on 2026-11-07. On 2026-11-11 the owner authorized publishing the current preview. The owner subsequently confirmed both W1 topic/problem memberships explicitly. Publication and retention of those memberships are authorized; release verification is tracked in plan.md and todo.md. The earlier research-message preview is a separate comparison and must not be overwritten.

Baseline: main b9f8086ddbcc29b3bbc37cdc5c6b14b1ad757dc3. Candidate branch: preview/research-topic-menu. Worktree: /home/jlee/projects/.worktrees/data-science-tamu.github.io-research-topic-menu.

## Compare

- Frozen existing version: http://localhost:4200/research/
- Candidate: http://localhost:4201/research/
- Main example: http://localhost:4201/research/browse/topics/digital-twins/
- Manufacturing example: http://localhost:4201/research/browse/topics/smart-manufacturing/

The refined header Research disclosure places Overview and the three existing directions vertically in one column. Topics and Problems follow in two desktop columns, stacked on mobile. Methods is excluded from this comparison. The homepage hero disclosure and existing page structure are not redesigned. The later label-bullet refinement changes only explicit project metadata paragraph wrappers into semantic list items. Browse pages reuse the existing full research presentation, not independently authored copies.

## Content Contract

- Research Projects reuse the existing complete project block: title, Goal, methodologies, collaborators, citation notes and figure. Overview, direction pages and browse destinations read the same project record and use the same rendering code.
- Publications are separately identified output records. Existing presentation numbering, authors, publication/review/working status and metadata are reused. Storage IDs are not substituted for displayed journal numbers.
- Funded Research contains supporting programs with canonical title, sponsor, role and period. A future award's start is identified explicitly against the configured preview snapshot; a passed end date is not evidence of a completed research result. Funding amounts are not repeated here.
- The grouping means shared topic/problem, NOT a verified grant-to-paper output relationship. No inferred attribution edges are created.
- Digital Twins deliberately calls bone-property inference foundational work, not a finished digital twin. The published Advanced Science paper and the Technometrics major-revision manuscript keep separate status metadata. The NIH spine award and NSF implant award stay funding records; the implant project starts June 2027.
- Figures currently belong to project records, not inferred paper or grant records. No project figure is relabelled as a specific paper figure. Publication metadata continues to come from canonical publication records.
- Sections with no mapped records are omitted. An unmapped type is not a statement that the lab has no such activity.

## Ownership and Editing

content/research-index.json contains the navigation labels, summaries, snapshot and explicit references; content/lab.json remains authoritative for source facts. src/research-index.mjs validates and resolves references, then creates static browse pages. src/research-index.css is the scoped menu/destination stylesheet. scripts/build.mjs integrates the index and output stylesheet. src/templates.mjs supplies the index only to header navigation, not the hero or existing page bodies. Existing public assets are not changed. `src/research-projects.mjs` owns `researchRenderers(img, originals, publicationsById)`: its `project` and `figure` functions are used by both the existing page templates and browse pages. `src/publications.mjs` owns `publicationDetails`, shared by the publication listing and browse outputs. `src/research-content.mjs` remains responsible for structured paragraphs and citations.

Unresolved/ambiguous references, malformed/duplicate routes, unsupported fields, empty destinations and invalid periods fail closed before replacing the last valid output. Public integration and both W1 memberships are owner-authorized; required code, browser and release verification still apply.

## Run and Verify

From the candidate worktree: npm test; npm run build; PORT=4201 node scripts/serve.mjs. The frozen baseline is .local/research-menu/before-dist and is served with python3 -m http.server 4200 --bind 127.0.0.1 --directory .local/research-menu/before-dist. These servers bind loopback only.

The current parent QA harness .local/research-menu/revision2/qa.cjs checks all mapped routes, typed content, canonical links, main-body/asset preservation, desktop/mobile/short-viewport navigation, keyboard/Escape, no-JavaScript access, console and WCAG-tagged automated checks. Screenshots and machine-readable report are under .local/research-menu/revision2/qa/. Final results are recorded in docs/validation.md and history.md after verification.

## Recovery And Content Review

The pre-refinement source/output snapshot is at `.local/research-menu/revision2/before` and `before-dist`. Because WSL ran out of space, that evidence directory and the frozen comparison baseline are stored under `/mnt/d/wsl_backup/data-science-tamu.github.io/research-topic-menu/` with task-local symlinks. Source remains in the existing WSL worktree. No other project files were cleaned.

The earlier semantic audit questioned W1 membership in Healthcare & Biomechanics and Inverse Problems & Calibration. That question remained open during local formatting work and was resolved on 2026-11-11 when the author explicitly confirmed both memberships; the existing index is retained unchanged. Removing Methods naturally removes the separately questioned J16* Reinforcement Learning placement; its Maintenance Planning placement remains. Implementation/UI verification remains distinct from author-confirmed categorization and deployment verification.

## Label-Bullet Refinement

The owner requested bullet points before bold research-detail labels. The shared `researchContent` renderer groups adjacent labeled paragraphs and collaborator entries into a real unordered list, while maintaining their exact text/order and existing bold prefixes. Citation blocks and scientific figures remain separate and unchanged. The local body-preservation contract permits this narrow wrapper-only change rather than accepting wholesale fixture refreshes. Before-state and current verification evidence are under `.local/research-menu/label-bullets/`; the later owner publication approval and explicit membership confirmation are tracked separately from formatting verification.

## Author-Confirmed Categorization

Pre-release review deleg_9546757a correctly identified that the canonical W1 title alone did not establish healthcare or inverse-problem relevance. The owner was shown both menu paths, the Publications placement, and the full title, Physics-Informed Heterogeneous Bayesian Last Layer Neural Network. The owner then explicitly confirmed both classifications and requested inclusion in both on 2026-11-11. This closes that specific evidence gap as author-confirmed categorization, not a claim of independent manuscript verification.

Keep W1 in Healthcare & Biomechanics, Inverse Problems & Calibration, and its existing Scientific & Engineering ML group. Do not infer grant-to-paper attribution, completed research, or publication acceptance; the original working-paper status remains unchanged. The confirmation requires no production-code or index edit.

Before confirmation, review found no additional implementation blocker: 112 focused tests passed and 117 source/77 built hashes matched. Final release checks and independent review closure are recorded in docs/validation.md and history.md after execution.
