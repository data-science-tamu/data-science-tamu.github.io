# Research Presentation Contract

## Maintained Data

`content/lab.json` is the only maintained source for direction names/slugs and
research presentation. `content/source/` stays immutable. Preserve complete
`text`/`html`, author order, accepted status, years and original links when adding
presentation metadata. Do not create missing Goals or interpret a journal note
as a newly verified metric.

- `label` names an existing exact leading label in `html`, such as `Goal:`,
  `Methodologies:`, `PDE Equation:` or `Detail:`. Only that prefix becomes strong.
- `kind: "collaborators"` distinguishes an existing collaborator paragraph;
  its original wording follows the visible `Collaborators:` label.
- `kind: "citation"` uses an explicit `recordId` from maintained publications.
  Citation paragraphs appear in a list beneath `Publications`, with an integrated
  Publication record link. `recordId` replaces unused project-level `relatedIds`.
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
pre-change project/overview paragraph HTML while semantic text assertions allow
inline strong tags. The existing 243-paragraph source gate remains unchanged.
These tests are not measured browser layout or assistive-technology QA. Parent
owns independent browser/accessibility checks, final closeout and release.
