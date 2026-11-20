# Home Simplification - Local Preview Only

**Current presentation:** Home and the HTML CV share a standalone Courses
taught section: one bullet per course, with the development note nested under
DAEN 210. Both pages use bullets for Awards and Honors. Neither displays the
former Research Interests or Research Recognition lists. Home's Research focus
is unchanged. The sections below document the earlier preview.

Later local correction (2026-11-18): on Home and the HTML CV the $6,500 grant
sentence is one nested detail of the Montague Scholar award. This is the only
exception to the earlier CV HTML byte-preservation results below; the CV PDF
and all other rendered output still match the preceding local preview.

## Scope and Ownership

Owner request: 2026-11-17. Implementation is confined to the dedicated
`preview/home-simplify` worktree based on
`1de3cc31240c2a76faaae83b301f678becc10650`. This is an uncommitted local preview,
not a release. No commit, push, merge, deployment or worker-started server is
approved. The parent owns browser QA, independent final review and the preview
server. Earlier Research Interests drafts and Selected Publications proposals
are not part of this change.

## Home Composition

The existing hero portrait/name/role, Research focus, Research directions,
and Latest news stay byte-identical and in their original order. Following the
owner's additional 2026-11-17 request, they are followed by:

1. Awards and Honors.
2. Industry & funding partners.
3. The original Courses taught and Research Interests & recognition section,
   including its Research Recognition subsection.
4. Prospective Students & Collaborators, the final Home section before the
   shared footer. Its original text, links and unique prospective-students ID
   remain unchanged; the hero's student link still targets this section.

Home no longer repeats the Jaesung Lee heading, `faculty.bio[0]` introduction,
Faculty profile/Google Scholar/LinkedIn links or Education section. The People
profile remains complete; Education remains on CV. Courses, interests,
recognition and partners keep their original wording and markup. Home Awards
uses a native bulleted list; retained award entries, links and order are intact.
CV keeps its original list markup. Shared layout, menus, CSS, JavaScript and
research content do not change.

## Award Selection

`content/home.json` lists the exact canonical award texts excluded from Home:
the UW-Madison 2020 M.S. exam exceptional-performance award and KAIST 2013 Best
Master's Thesis Award. `content/lab.json` and `content/site.json` remain unchanged.
The 2015 best paper award and every other award remain on Home. CV retains the
complete canonical award list.

`src/templates.mjs:selectHomeAwards` validates the explicit configuration and
filters exact `award.text` matches without mutation or title/year/regex/slicing
heuristics. Any explicitly configured list of unique, existing award texts is
valid, including an empty list; there is no runtime exclusion-count rule.
Unknown, duplicate, ambiguous, blank or non-string entries fail closed.
The maintained-config test, not production code, locks the owner-approved pair.
New ordinary awards are retained automatically in canonical order. Changing or
removing a configured canonical text requires a matching reviewed config update.

Small shared Education, teaching/recognition and award renderers compose Home
and CV without duplicating their markup. CV output, including whitespace, is
byte-identical to the pre-implementation build.

## Tests and Preservation

`tests/home-simplification.test.mjs` guards the unique hero identity, omitted
Home-only content, exact section order and original copy, complete People/CV
presentation, the exact two exclusions, ordinary/future awards, alternate valid
config subsets, invalid config and frozen-input preservation.

`tests/fixtures/home-preservation.json` records the authorized Home composition
hash plus the unchanged prefix/teaching/partners/chrome and all 21 non-Home HTML
hashes. Its expected Home hash was derived from the baseline before production
edits. Historical fixtures are unchanged. Existing body-hash guards substitute
only the authorized Home expectation; every non-Home historical hash remains.

The source guard still checks all 243 captured substantive paragraphs. Exactly
eight specific Home paragraphs now require their original People or CV target:
the biography, Education label and five degrees, and 2013 thesis award. Mutation
tests remove each target's real text and prove another route cannot mask its
absence. The Education label requires its actual h2, not an incidental word in
CV prose. No whole page or paragraph is skipped.

## Initial Simplification Worker Evidence

All test/build commands use `TMPDIR=/dev/shm`; no install was needed.

- Focused RED: 33 tests, 2 passed, 31 expected failures before production edits.
- Focused GREEN: 33 passed, 0 failures.
- `npm test`: 417 passed, 0 failures, 0 skipped. This includes deterministic
  rebuilds, internal links/assets/fragments and both 243-paragraph checks.
- `npm run build`: 21 content pages plus 404; 25 publications, 18 News records
  and 8 projects.
- Full output comparison: 77 files, only `index.html` differs; all 76 other
  outputs, including all 21 non-Home HTML documents, are byte-identical.
- All 65 original maintained-data/capture/public-file hashes pass; original
  content/public files and historical fixtures have no Git diff.
- `git diff --check`: passed.

Detailed commands, logs, touched paths and limitations are in
`.local/home-simplify/worker-result.md`; ignored worker evidence is not a runtime
test dependency. The parent baseline manifest and other parent files are intact.

## Initial Simplification Parent Gates

- Parent independently ran 417 passing tests, build and whitespace checks.
- All 66 existing content/public files and all 76 non-Home output files match
  the parent baseline manifest exactly. Only Home HTML changed; content/home.json
  is the sole new file in those source/output trees.
- Native Chromium passed 20 page/viewport cases on Home, CV, People, Research
  and Publications at widths 1440, 800, 390 and 320, including tested axe WCAG
  A/AA checks, images, metadata, console and overflow checks.
- Four navigation cases, six no-JavaScript/print/200%-text cases and 87 local
  URL/fragment checks passed. Served CV PDF bytes match the unchanged source.
- Desktop/mobile screenshots were inspected. Heights: desktop 4506 to 3597px
  at 1440px width; mobile 7185 to 5950px at 390px width.
- Independent read-only review deleg_fb295d99: APPROVE (local-only), with 102
  focused tests passing and no blockers. All 21 non-Home HTML files and Home
  chrome were independently checked against the original baseline. The seven
  reviewed runtime/test files remained unchanged at parent closeout.
- Preview http://localhost:4202/ and baseline http://localhost:4200/ respond
  HTTP200. Windows curl independently verified the preview; its URL was delivered.

The first browser interaction harness incorrectly expected a click to open a
menu already opened by pointerenter. Both baseline and candidate reproduced
false -> hover true -> click false, with keyboard Enter correctly opening.
The harness now separates hover and keyboard cases; no production menu code
changed. Detailed evidence is `.local/home-simplify/parent-verification.md`,
`preservation.json`, `qa/` and `height-comparison.json`.

All initial simplification gates closed before the follow-up. Main was unchanged;
no commit, push, merge or deployment occurred. Browser evidence covers Chromium,
not Safari/Firefox or a physical screen reader. Publication is not authorized.

## Contact Position and Award Bullets Follow-Up

The follow-up baseline is the verified 417-test local preview, preserved under
`.local/home-simplify/followup/baseline/`. It authorizes only moving the unchanged
contact section to the bottom and making Home award bullets visible. Earlier
validation/review above does not cover this follow-up.

The expected Home hash was derived from the saved baseline before production
edits. The original prefix hash still protects hero/research/news plus relocated
contact by reconstructing that unchanged concatenation. All other fixture hashes
are unchanged. Worker focused RED had five expected failures among 35 tests;
focused GREEN passed all 35. Parent independently passed all 419 tests, build
and whitespace checks. Across 144 baseline source/output files, only Home HTML
changed; all 67 content/public files and 76 other output files remain exact.

Fresh native Chromium QA passed 20 page/viewport cases, four navigation/anchor
cases, six no-JS/print/200%-text cases and 87 local targets. Every Home case checks
native disc markers, hanging indentation and the contact section last. No tested
axe WCAG A/AA, console, image or overflow failures occurred. Desktop and mobile
screenshots were inspected. Windows localhost:4202 responds HTTP200; the served
CV PDF remains exact. Parent evidence: `.local/home-simplify/followup/`.

Fresh independent read-only review deleg_f6fe58c2: APPROVE, no findings, 35 focused
tests passed. The reviewer independently reconstructed the exact two-change
transformation and verified protected content/output. All three frozen review
files still matched at parent closeout; no repeat review or test cycle was needed.
All follow-up gates are closed and the revised preview URL has been delivered.
Main and the public website remain untouched; no publication is authorized.
