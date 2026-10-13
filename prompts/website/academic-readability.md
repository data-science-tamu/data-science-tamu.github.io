# Academic Readability Implementation

You are gpt-6.1-sol/max implementation worker in the independent website repo
/home/jlee/projects/.worktrees/data-science-tamu.github.io-academic on branch
preview/academic-readability. Tools may default to unrelated AI-Research-Assistant:
use explicit absolute workdir on EVERY terminal call and absolute file paths.
Read this repo's AGENTS.md and applicable skills first. Never edit another repo,
worktree, shared config/auth or the user's original Google Sites.

User dislikes CURRENT PUBLIC (left) version: too AI slop; professional academic
page, human-made; image text readable; inconsistent huge/small fonts; attractive
but must not reduce information; white background; cream/maroon palette clashes
with figures; preserve rollback and fix it. Parent promised LOCAL FIRST, no public
release. Do NOT import the unrelated research/collaboration prototype changes.

## Your Owned Work
- public/assets/site.css, public/assets/site.js, src/templates.mjs;
- new/updated project-local tests and wiki/codebase.md only.
- Leave plan.md, todo.md, history.md, README, docs to parent.
- Do NOT commit/push/merge/deploy, start servers, create branches or run browser QA.
- Use test-first: write regressions, run RED save .local/academic/tdd-red.log,
  implement, run GREEN save .local/academic/tdd-green.log. Preserve original 23 tests
  and 243-paragraph owning-page gate; do not weaken or move content to cheat.
  content/*.json and source/images/fonts/PDF stay byte-identical.

## Specific Design
Academic reference site, not an advertising landing page. White canvas #fff,
charcoal text, restrained maroon only for links/accent acceptable. No beige, cream,
tan, gradients, oversized display headline, decorative serif/eyebrow clutter,
shadows, pills, huge blank gutters or generic card deck. Local DM Sans can serve
whole type system, no new font fetch; remove Newsreader preload if unused. Weight,
thin rules, considered compact spacing distinguish hierarchy.
Use CSS tokens for tight scale: body17px (1.0625rem), captions/nav/metadata >=15px,
project headings20-22px, sections25-26px, h1 max34-36px (28-30 mobile). Use rem units
for browser accessibility. Avoid selector-specific typography overrides fighting
one another. Prefer coherently replacing old CSS, not piling on overrides.

Home: render Data Science Lab naturally without forced Lab break or colored word.
Readable existing research intro, compact PI portrait ~170-190px, identity/contact
and research/publication links. Reduce hero padding/oversized buttons; research
focus starts in first desktop screen. Keep EVERY original section and text incl
qualifications/awards/education/partners on original page. Compact heading column
or above-content headings, not 35% giant empty gutter. Logical heading hierarchy.

Research: full project text THEN full-width image beneath, not narrow side-by-side
column. Overview figures also wide. Preserve aspect, no height cap/crop. White
canvas. Native image widths 1165/1280; inline >=1000px on 1440 desktop where
available, bounded to natural size if smaller. Text readable measure. No paragraph
hidden in accordion. Existing routes, links and IDs unchanged.

Figures: minimal accessible progressive enhancement for dense labels. One shared
native dialog viewer per relevant page with original image, Fit / 100% / 200%
controls, Close, scroll/pan area and original-file link is sufficient. Open at
original 100% for reading, offer Fit overview. 200% is magnification, not new detail.
Pan/scroll to ALL corners on mobile and keyboard (focusable scroll area). Escape,
focus containment/restoration and body scroll restoration. Do not intercept
Ctrl/Meta/new-tab clicks. Source links work without JS; no dead enhancement buttons
when JS absent. Accessible labels/title/unique IDs; no page horizontal overflow.
Do NOT AI-redraw/upscale source files or invent scientific text. All originals
byte-identical. No new runtime library/dependency. Handle load errors gracefully.

Other pages: SAME scale for publication title/authors/status, students, news, CV.
Keep all status metadata. Form inputs >=16px for mobile. White neutral footer and
contact; no decorative entry animation. Mobile nav same 800px breakpoint as JS;
skip link, filters, download, focus and reduced-motion; print substantive content.

## Finish
npm test && npm run build, git diff --check. Update wiki for figure/type code
ownership. Write .local/academic/worker-result.md with exact commands/results,
changed files and limits. Stop and return. Parent independently tests/reviews.
