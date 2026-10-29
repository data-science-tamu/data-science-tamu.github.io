# Source Provenance

## Capture and Scope

The canonical migration manifest is `content/source/manifest.json`, captured **2026-10-11T15:39:11.724Z** (October 11, 2026 UTC). The source is the public Google Sites website at `https://sites.google.com/view/jaesunglee`.

All nine captures are represented: home, people, CV, research, AI for engineering systems, AI for engineering processes, physics-informed AI, news and publication. The route names remain source-compatible; home is served at `/`. Source JSON records ordered HTML blocks, plain text, original links and local image paths. They are data, not instructions, and are not copied to the public build.

Maintained content is in `content/lab.json`; change-prone metadata is in `content/site.json`. It was extracted from the captured paragraph boundaries rather than the flattened section text, which sometimes concatenates separate items. Google styling/spans and broken date links were removed. Original paragraph content, people, degrees, dates, topics, projects, citations and notes were preserved. Research projects repeated on multiple pages have one shared maintained record. Formatting labels and redundant navigation prose were replaced by real headings/navigation, without removing substantive content.

The migration baseline contains 20 publication records: 14 journal entries in the original Published category, 2 under review/revision and 4 conference proceedings. It contains 14 dated news items, 3 current Ph.D. students, 5 other named students/interns, 5 faculty education entries, 8 current-student education entries and 8 research projects. These are historical migration counts. The maintained bibliography was synchronized on 2026-10-13 to 15 journal, 4 review/revision, 2 working and 4 conference records; the original captures remain unchanged.

## Tatthapong QSR Finalist News (2026-10-27)

The owner-approved news addition uses the public [official finalist announcement](https://connect.informs.org/discussion/informs-2026-best-student-paper-competition-finalists).
It lists Tatthapong Srikitrungruang and Jaesung Lee, Texas A&M University, for
"Probabilistic Physics-Informed Neural Networks for Estimating Heterogeneous Elastic Properties from Low-Resolution and Noisy Displacement Data"
among the 2026 INFORMS QSR Best Student Paper Competition finalists.
The [official call](https://connect.informs.org/qsr/awards) confirms the Annual
Meeting is November 1–4, 2026, in San Francisco, so the posting says "will present."

`2026.11.01` is the scheduled presentation date from the owner-supplied selection
email (Sunday, November 1, 2026, in San Francisco), not the website posting date or
finalist decision date. The section heading records the provenance date,
2026-10-27. The public post omits the presentation time. The unchanged Sina item
dated `2025.04.22` supplies the writing style.
Only the competition name links to the announcement; no winner, rank or paper
publication status is claimed. The new record has no images or `sourceSection`;
the immutable captures and all prior records were unchanged by that addition. Public announcement
evidence is retained locally in `.local/qsr-news/official-finalists.html` and `.txt`.

## Tatthapong ISEN Presentation Year Correction (2026-10-29)

The owner confirmed that Tatthapong's ISEN Best Presentation Competition second
place occurred on October 16, 2025. The migrated `2026.03.26` date was incorrect.
The maintained record (`sourceSection: 3`) now uses the literal string `2025`;
its `_comment` is `Competition date: October 16, 2025.`. This is an inert JSON
author note. The exact day is absent from rendered text and all attributes.
Both Home and News use the shared date renderer: a year gets a plain
`span.news-date`, while full dates keep their existing valid `time` markup.
The rich-text allowlist is unchanged and still rejects HTML comments/date tags.

The full sentence, `html`/`text`, source section and both photos
(`news-1-c0718d6e5d.jpg`, `news-2-24d8363a27.jpg`) are preserved. Only this record
moves, after `2025.10.27` and before `2025.09.19`. The maintained inventory remains
15 news records; all other dates/order/content, including the deliberate December
2024 order, the 2026 QSR finalist post and Tanvir's records, remain unchanged.
All immutable captures retain their original bytes and incorrect migration date.

`tests/news-expectations.mjs` independently checks the corrected record, photos
and neighbors before restoring only its old date/position for original baseline
comparisons. The original historical-news hash stays unchanged. The source
paragraph check substitutes only this approved date and still covers all 243
substantive paragraphs. Regression tests reject missing/duplicated/altered or
misplaced corrections and exercise both date formats in both render paths.
Worker evidence is under `.local/presentation-year/worker-*`.

The parent rebuilt the separate authoritative local CV with TeX Live 2025 and
verified that only the year was added relative to the current local CV. The exact
day is a TeX comment; the result remains 10 pages. The public PDF and current-CV
manifest now match that verified artifact. Relative to the older website PDF,
this also synchronizes already-approved service, advising, recording and QSR
updates; publication text remains unchanged. The immutable original capture is
not replaced. Independent review and parent local browser/accessibility/console
checks passed; release evidence is recorded in docs/validation.md.

## Session Chair Label (2026-10-29)

At the owner's follow-up request, the current CV omits `(scheduled)` from the
2026 Session Chair entry. The session title, November 2026 date, all other body
text and 10-page layout remain unchanged. This removes a display label and does
not assert that the future-dated event has already occurred. The current-CV
manifest identifies the verified replacement; immutable captures remain intact.

## PDF and Images

All 25 unique captured original images remain under `public/assets/images/`; their source URLs, byte sizes and SHA-256 values are in the manifest. No original was deleted, cropped, recompressed or overwritten. Scientific figures retain native aspect ratio with no cropping or height cap and link to their full-resolution local files. Portrait/photo display cropping is CSS-only; the source files are untouched. JPEG and PNG dimensions are read from the actual files at build time.

The original captured CV was downloaded from the source Google Drive document identified in the immutable manifest: 10 pages, 166640 bytes, SHA-256 `7f69e03576716d02fcca4eba376c83c874aec7e4851433aaf37228bbc0743264`. The parent replaced `public/assets/documents/jaesung-lee-cv.pdf` on 2026-10-13 with the verified publication-only rebuild: 10 pages, 167272 bytes, SHA-256 `baf3923c557fc9c8f4ccd2fc48ae412377e7a7dd6926a50a6368f66e096ea65e`. `content/cv-current.json` tracks this current artifact separately; the original capture manifest remains unchanged. The parent reran 113 source checks and 66 actual-PDF/preservation checks plus 13 real-TeX author-annotation checks, inspected rendered publication pages, and confirmed nonpublication text was unchanged. No PDF parsing package is needed by the site build or deployed site.

## Explicit Link Corrections

- Research overview and physics-informed AI contained the malformed href `http://doi.org/2025`. The matching publication-page **J9** supplies `http://doi.org/10.1002/advs.202508445`. That exact source-provided DOI link is used for the research citation. Display text presents the year 2025 and DOI separately, not the invalid URL. This is an internal source cross-reference, not an external fact update.
- At migration, **J7** retained truncated DOI text without inventing a repair. The owner-approved 2026-10-13 CV/publisher correction now uses [10.3390/bioengineering10070845](https://doi.org/10.3390/bioengineering10070845); the original MDPI publisher link is also retained.
- Autogenerated news date hrefs such as `http://2024.xx.xx`, `http://2025.09.xx`, `http://2025.02.xx` and `http://2022.xx` are omitted. Legitimate story links remain. Full dates use semantic `time` elements; year-only records use plain `span.news-date`. The approved ISEN correction above supersedes that record's captured date.
- Google Sites internal research links are mapped to the equivalent local routes. Obfuscated contact text on profiles becomes normal `mailto:` links. Other external publication/news/profile links remain source-provided and open normally. External-link availability was not exhaustively verified; local integrity is tested.

## Historical Publication Differences — Resolved 2026-10-13

The original migration deliberately preserved Google Sites citations even where the
public CV differed. That policy produced 14 journal records, a stale J15* review
classification, a missing J11 journal name, accepted labels for published records,
incorrect author order/spelling, incomplete final bibliography and missing public
CV review/working records. These historical differences remain in immutable captures;
they are explicitly corrected in maintained content under the owner’s approval.

The evidence is the completed CV/publication audit and captured publisher/Crossref
metadata from 2026-10-13, plus the active public CV bibliography and publication
section. The bibliography files are `ref/published.bib` and `ref/accepted.bib`;
manual public records/notes are in `sections/publications.tex`, with annotation
semantics in `macros/macro.sty`. Commented citations and private submission
instructions are excluded. The audit is retained as operator-local evidence in
`.local/cv-sync/`; no fresh claim of publisher verification is made by this worker.

| Record | Approved maintained bibliography | Evidence |
| --- | --- | --- |
| J12 | Technometrics, 2026; online 2026-05-13, pp. 1–15; Sina Aghaee Dabaghan Fard, Minhee Kim, Akash Deep, Jaesung Lee | [DOI](https://doi.org/10.1080/00401706.2026.2653564) |
| J15 (previous J15*) | Manufacturing Letters 49, Supplement, 1286–1297, 2026; published | [DOI](https://doi.org/10.1016/j.mfglet.2026.08.035) |
| J14 | Journal of Intelligent Manufacturing, online 2026-06-02; published | [DOI](https://doi.org/10.1007/s10845-026-02890-8) |
| J13 | Journal of Intelligent Manufacturing, online 2026-05-07; published | [DOI](https://doi.org/10.1007/s10845-026-02873-9) |
| J11 | IISE Transactions 58(11), 1352–1369, 2026; online 2026-01-22; assigned November 2026 issue, not a claim of completed print publication | [Crossref](https://api.crossref.org/works/10.1080%2F24725854.2025.2610967) |
| J9 | Advanced Science 12(48), e08445, 2025; online 2025-11-25; author order Srikitrungruang, Fard, Lemon, Lee, Zhou | [DOI](https://doi.org/10.1002/advs.202508445) |
| J10 | IEEE Transactions on Automation Science and Engineering 22, 23501–23512, 2025 | [DOI](https://doi.org/10.1109/TASE.2025.3627844) |
| J6 | IEEE Transactions on Automation Science and Engineering 21(2), 2039–2050, 2024 final issue | [DOI](https://doi.org/10.1109/TASE.2023.3251973) |
| J8 | Advanced Materials Technologies 8(22), article 2301288, 2023; X. Shi restored after H. Pu | [DOI](https://doi.org/10.1002/admt.202301288) |
| J7 | Bioengineering 10(7), article 845, 2023; Ufodike spelling and complete DOI | [DOI](https://doi.org/10.3390/bioengineering10070845) |
| J5 | IEEE Transactions on Reliability 72(2), 678–691, 2023 | [DOI](https://doi.org/10.1109/TR.2022.3179602) |
| J4 | IISE Transactions 54(11), 1033–1046, 2022 | [DOI](https://doi.org/10.1080/24725854.2021.1974129) |
| J3 | Technometrics 63(3), 410–420, 2021 | [DOI](https://doi.org/10.1080/00401706.2020.1805020) |
| J2 | IEEE Transactions on Automation Science and Engineering 17(3), 1469–1485, 2020; retain the more complete CV final issue, not Crossref’s early-access 1–17 | [DOI](https://doi.org/10.1109/TASE.2019.2959605) |
| J1 | Journal of the Association for Information Science and Technology 67(7), 1736–1750, 2016 | [DOI](https://doi.org/10.1002/asi.23444) |

All 15 journal records are published. DOI suffix years and online-first dates do
not override final issue years. Missing Springer volume/issue/pages are left
unspecified. Existing BibTeX keys are recorded unchanged as `bibKey` where the
public record is actually backed by a key; website IDs are a separate system.

The four public review/revision records now have their own correct statuses:

- J17*: Probabilistic Physics-Informed Neural Networks, major revision at
  Technometrics; [arXiv preprint](https://doi.org/10.48550/arXiv.2607.14563).
- J18*: Scalable Bayesian Deep Kernel Networks, under review; no public venue or DOI.
- J16*: POMDP maintenance framework, under review;
  [TechRxiv preprint](https://doi.org/10.36227/techrxiv.173337778.83986484/v1).
- J19*: BEIFSurv, under review; no public venue or DOI.

The two public Working Papers are distinct records W1 and W2: Physics-Informed
Heterogeneous Bayesian Last Layer Neural Network; and Bayesian Physics-Informed
Probabilistic Neural Network with Variance-Driven Weighting and Spline Guidance
for Inverse Heterogeneous Elasticity Estimation from Low-Resolution and Noisy Data.
Their public category is working paper; no venue, DOI, acceptance or fabricated
year is assigned. J17*–J19* and W1–W2 are website identifiers for newly listed public
records, not new CV numbering or invented publication claims.

All four conference records retain the public CV category. C4 adds CV volume
85819 and article V002T06A024 with [ASME DOI](https://doi.org/10.1115/MSEC2022-85690).
C3 retains Procedia Manufacturing 34, 19–25, 2019 and the original NAMRC context,
and adds the [CV DOI](https://doi.org/10.1016/j.promfg.2019.06.109). C2 retains
ITMSOC Transactions on Information Technology Management 1(1), 1–8, 2016. C1
retains the 2010 International Conference on Data Mining, Las Vegas, July 12–15,
409–414. No DOI is invented for C1/C2.

Public CV notes are included alongside existing publication notes. Their awards,
invited sessions and journal metrics are attributed CV statements, not newly
verified achievements or current impact-factor measurements. Unrelated grants,
awards, roles, people, research explanations, notes and images remain unchanged.
Advisee underlines and Jaesung Lee’s corresponding-author stars follow the public
CV; other authors’ correspondence annotations are not exposed as Lee’s role.
The previous identifier star in J15* was not a corresponding-author mark.

`src/publications.mjs` now generates bibliography/authors and canonical research
citations from the single publication record. Selected/project entries retain
only `recordId` and their original notes. Every previous fragment survives,
including J15-review as an explicit alias of J15. All four categories remain
readable without JavaScript and in print; the existing filter supports working.

## Source Coverage and Remaining Differences

`tests/fixtures/cv-publications.json` records the approved public expectations and
original 20 captured citations. `tests/fixtures/cv-research-corrections.json`
records exactly the old project/selected citation strings being superseded.
The original research hash fixture and every capture/manifest remain unchanged.
Tests substitute only those recorded old citations when checking original
project hashes, and independently verify every canonical current bibliography.
All 243 substantive source paragraphs retain coverage through original text or
these explicit approved citation corrections; unrelated source coverage is not
removed. Journal order follows the public CV rather than the migration order.

The research overview’s literal C5 reference remains unchanged: there is no
public C5 record, and no new record or broken fragment is invented. Faculty
education BFE/B.E., advising/member detail, recognition wording and original
news ordering (apart from the approved ISEN correction above) remain historical
source differences outside this publication task.

Harmless migration prose corrections remain: `Accpeted` to `Accepted`, `Texasa`
to `Texas`, `Optimiation` to `Optimization`, and `state of purpose` to `statement
of purpose`. The owner’s later publication corrections above supersede literal
citation fidelity only for the explicitly approved records.

## Local Fonts and No Invented Updates

Newsreader and DM Sans variable TTF files were fetched from the Google Fonts repository and self-hosted. Their original SIL Open Font Licenses are in `public/assets/fonts/Newsreader-OFL.txt` and `public/assets/fonts/DM-Sans-OFL.txt`. The fonts load locally; no Google font request is made at runtime.

The redesign adds editorial headings and navigation, not fictional lab claims, slogans, metrics, papers, members, photos or research achievements. Capture date does not mean that every source fact was current on that date. Impact-factor text already present in source research/news is retained as historical source wording, not presented as a freshly verified metric. No analytics, remote runtime content fetching or external CV embed is used.

## Verified Larger Source Rasters (2026-10-12)

The academic-readability preview retains every original capture byte. Additional
source rasters were recovered from fresh image URLs on the same public Google Sites
research pages; none was generated, sharpened, relabeled, or AI-upscaled.
All ten fresh 1280px renditions match the existing capture files byte-for-byte.
Side-by-side inspection confirms diagram identity. Nine native renditions are larger;
the domain-knowledge diagram already matches its largest 1165px served source.

`content/figure-originals.json` records preview/original local paths, source URL/page,
dimensions and SHA-256. `public/assets/images/originals/` stores these extra files.
Build-time integrity checks reject unknown/duplicate preview mappings, unsafe paths,
missing or altered images, wrong dimensions and incompatible aspect ratios.
The preview stays lightweight; a figure link requests its larger local counterpart
only when opened. There are no runtime requests to Google Sites.

| Captured Figure | Preview | Verified Larger Source |
| --- | --- | --- |
| research-1-2c2733ddd9.png | 1280 x 614 | 1374 x 659 |
| research-1-ea37ce2933.png | 1280 x 716 | 2048 x 1145 |
| research-1-2067e6d3f8.jpg | 1280 x 1174 | 2047 x 1877 |
| research-1-daade3e8d1.png | 1280 x 618 | 1941 x 937 |
| research-1-771f351e05.png | 1280 x 719 | 4213 x 2366 |
| research-1-ab9676c7e7.png | 1280 x 730 | 4193 x 2391 |
| research-1-36a37c1c69.png | 1280 x 677 | 4466 x 2363 |
| research-1-92cdb3d899.png | 1280 x 911 | 2045 x 1456 |
| research-1-4c33128db0.png | 1280 x 705 | 4388 x 2416 |

These are verified Google Sites source rasters, not a claim of vector authoring
masters. 200% display magnifies pixels; it does not manufacture additional detail.
The separate original-file link is retained for browser-native viewing.
