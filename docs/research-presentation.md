# Research Presentation Contract

## Maintained Data

`content/lab.json` is the only maintained source for direction names/slugs and
research presentation. `content/source/` stays immutable. Preserve complete
explanatory `text`/`html`, notes and original links when adding presentation
metadata. Approved bibliography corrections follow [source provenance](source-provenance.md). Do not create missing Goals or interpret a journal note
as a newly verified metric.

- `label` names an existing exact leading label in `html`, such as `Goal:`,
  `Methodologies:`, `PDE Equation:` or `Detail:`. Only that prefix becomes strong.
- `kind: "collaborators"` distinguishes an existing collaborator paragraph;
  its original wording follows the visible `Collaborators:` label.
- `kind: "citation"` uses an explicit `recordId` from maintained publications.
  Citation paragraphs appear in a list beneath `Publications`, with an integrated
  Publication record link. `src/publications.mjs` resolves canonical authors,
  title, status and bibliography from that record; citation items have no
  duplicate `text`/`html`. `recordId` replaces unused project-level `relatedIds`.
- `notes` is an array of original explanatory paragraphs nested on the citation
  they explain. Journal, award and featured notes render as nested list items.
- `kind: "publication-heading"` retains an original label introducing another
  citation group inside Publications, without inferring a relationship to a paper.
- `kind: "list"` retains an original overview heading and groups its original
  paragraphs in `items`, rendered as an h3 and a real unordered list.

`src/research-content.mjs` is the single narrow renderer for projects, selected
citations and overview groups. It rejects unknown kinds, orphan notes, missing
publication IDs, mismatched label prefixes and empty overview lists. Validation
runs during rendering before the build replaces output. No prose regex, project
ID or journal-venue branch establishes these relationships.

`research.theme.title` is the sole H1 on the Research overview, exactly:
"Domain-informed Statistical Machine learning and modeling with Uncertainty Quantification".
It is not repeated as an H2, and the old generic overview and integration headings
are removed. `research.theme` also retains the integration summary and concept
counterparts: Domain Knowledge (physics/engineering knowledge), Statistical/ML
Modeling (data-driven modeling), and Uncertainty Quantification (Bayesian
framework). Exactly one existing `research.figures` entry has `placement: "theme"`.
It renders once after the page title/summary and before directions; other figures
remain below interests and the Tasks/Approaches/Applications overview. The
scientific-figure links, image geometry, original assets and viewer are unchanged.

## Publication Presentation

Publication storage identities are not display numbers. Keep `p.id`, citation
`recordId`, existing `#Jx` fragments and `legacyAnchors` stable when adding or
reordering papers. Do not renumber maintained facts or captured/approved fixtures.
`publicationPresentation(lab.publications)` in `src/publications.mjs` creates
fresh mapped records keyed by storage ID, assigning journal `displayId` values
from the journal count down to 1 in the existing listing order. Non-journal
labels stay unchanged. Listing and all research citations use this same map;
`publicationCitation(recordId, publicationsById)` requires it explicitly and
rejects missing/unmapped context. At the current approved order, stored J12 is
displayed as J15 while its shared URL remains `/publication/#J12`.

`publicationReferences(html, publicationsById)` recognizes only exact bracketed
reference groups such as `[J10,J12]` in maintained research text. It preserves
surrounding prose, whitespace, punctuation, markup and existing link destinations,
and links recognized tokens to their stable paper fragments. Existing links
receive updated text without nested anchors; attributes are never rewritten.
Legacy `[J15*]` resolves through `J15-review` to stored J15, currently displayed
as J14. Unknown journal tokens fail the build. The pre-existing source-only C5
has no maintained publication record and remains plain C5, not a fabricated link.

Titles use a DOI destination first, the first publisher link when no DOI exists,
or plain text without a link. Redundant DOI/Publisher/Preprint record rows are
not rendered; DOI bibliography and all note wording remain. Empty legacy alias
anchors contain no hidden index text, so existing `textContent` search sees the
current visible label. Notes use body-size ink and a thin maroon left rule.
Project-index numbers are nonshrinking and nowrap; a separate bounded title
column wraps normally, including long words, without changing project anchors.

## Shared Disclosure

`src/templates.mjs` uses one `researchDisclosure` component for the header and
home primary Research action. `layout` receives `lab.research.areas` as its fourth
argument, including when rendering 404. Research remains an ordinary `/research/`
link; its adjacent down chevron is a separate icon-only button named
`Open research menu`, controlling a normal list of site links, never an ARIA menu.
There is no visible Directions label or diagonal arrow on this action. The header
toggle inherits navigation typography and has no border, divider, box or gap.
The home link and toggle share one contiguous compact rectangular maroon
treatment, including shared hover color. Both retain visible keyboard focus and
the toggle retains a compact 2.75rem-high hit target.

`researchLinks` renders Overview (`/research/`) first, followed by the three
maintained direction links in their existing order. Both disclosure instances
and the existing direction-page research subnav use this helper. Overview has
`aria-current="page"` only on exact `/research/`; direction pages mark only their
own direction link current. The footer stays unchanged.

With JavaScript disabled, direction links are visible and toggle buttons remain
hidden. Enhancement exposes the buttons only after handlers are attached and
keeps `aria-expanded` synchronized with the controlled list's `hidden` state.
Mouse hover opens the shared container; its dropdown begins at `top: 100%` with
zero margin, so pointer travel has no closing gap. Toggle clicks support keyboard
and touch. Escape closes the disclosure and focuses its button without closing
an open outer mobile navigation; another Escape can close the outer navigation.
Escape from outside a hover-opened disclosure closes it without moving focus or
preventing the native key default. Outside pointer clicks, focus departure, route-link clicks, viewport resize and
breakpoint changes close disclosures. Closure never leaves a direction focused
after it becomes hidden. Menu ownership comes from aria-controls. CSS-induced
focusout from collapsed navigation restores visible Menu even before resize/media
handlers run; ordinary departures from visible navigation do not steal focus.
Outer mobile-nav closure resets its nested disclosure.

Desktop positioning is clamped to the viewport; at the shared 800px breakpoint,
direction lists are in-flow and bounded by their container. Print hides direction
lists and toggles while retaining the ordinary Research action and research text.

## Verification Boundary

Project-local Node tests exercise real rendering and production event handlers
through a small DOM platform double. Compact SHA-256 fixtures protect the exact
pre-change project/overview paragraph HTML. The explicit CV correction fixture
substitutes only recorded prior citation strings for hash checks; unrelated text
and notes retain the original hashes. Current canonical citations have independent
public CV expectations. All 243 source paragraphs retain coverage.
`tests/publication-presentation.test.mjs` independently checks order/count-derived
labels and same-paper destinations, all overview inline groups, insertion and
reordering, immutable inputs, explicit citation context, source-only C5, real
search handlers, unchanged notes and project-index CSS contracts. Source-coverage
expectations adapt only reference presentation; source facts/fixtures are unchanged.
These tests are not measured browser layout or assistive-technology QA. Parent
owns native-browser checks at 1440/1024/801/800/390/320px and enlarged text,
accessibility checks, independent review, final closeout and release.
