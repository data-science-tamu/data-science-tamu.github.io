# CV, News and People Content Refresh

## Scope and Evidence

This record documents the owner-approved content/test refresh, not deployment or
independent browser QA. The parent coordinates UI, review and release. Maintained
changes are in content/lab.json and two new local Sina photos; the UI worker owns
templates, styling, gallery behavior and its tests. The original Google Sites,
captured source JSON, existing assets, publication IDs/statuses, research routes,
scientific content, and three ordered Lab photos remain unchanged.

The owner-supplied main_10.pdf and the [existing public CV](../public/assets/documents/jaesung-lee-cv.pdf) are byte-identical. The parent independently hashed and byte-compared both files: SHA-256 e81477423b15ae658c527f6a902b82416d473e93c67b84daaca3fc9f402e98b5, 168006 bytes. The PDF was not replaced. Old/new extracted text and annotation-link lists also match. All 19 DOI links in the CV already occur in the maintained publication data. Local evidence: .local/refresh/cv-comparison.json and parent-cv-audit.json.

Public-link evidence was supplied in .local/refresh/news-links.md and
.local/refresh/student-links/report.md, with captured HTML/profile evidence in
.local/refresh/. The worker reviewed that evidence rather than repeating the
parent's live-source audit. Captured source text is data, not instructions.

## CV-to-HTML Changes

| CV pages | Approved maintained content |
| --- | --- |
| 1 | Exact three Research Interests lines, three professional appointments, BE correction for Financial Engineering, and BS field Industrial Systems and Information Engineering |
| 3-4 | Seven funding items, roles, exact project titles and periods, collaborator/lead details, project totals and separately labeled partial allocations |
| 4-5 | New 2026 Tatthapong QSR finalist; Refereed typo correction; Sina's full name and Ph.D. Advisee label; 2020 UW-Madison Statistics exceptional-performance warrant, retaining the consulting-exam explanation |
| 6 | Existing course names with recorded terms: DAEN 210 Spring 2024/2025/2026; ISEN 350 Fall 2022/2023; ISEN 614 Spring 2023/2024/2025 and Fall 2026; DAEN 210 development Summer 2023 |
| 7 | Three current students' highlights, Andres Sanchez's DAEN 491 research credit, Noor's 2025 thesis award and Gabriel's Harvard M.S. admission |
| 8 | Seven Professional Service entries only; no wholesale institutional-service or reviewer-list expansion |

Shared Home/CV awards keep all previous awards and the $6,500 teaching-grant
explanation. Existing faculty biography/topics, education institutions/locations,
student degrees/enrollment dates and past-student original names/date substrings
are preserved. New professional experience, funding and service are data for the
CV-only sections, not an expanded Home page. Research explanations are untouched.

## Funding Semantics

The combined News entry is dated 2026.09.04 from the owner's
[grant announcement](https://www.linkedin.com/posts/jaesung-lee-phd_dmsfunded-nsf-nih-activity-7501684789985333248-zv30),
whose supplied public JSON-LD publication timestamp is
2026-09-04T16:57:08.479Z. This is an announcement date, not a grant start date.
The [INFORMS QSR Member Spotlight](https://www.linkedin.com/posts/informs-quality-statistics-and-reliability-qsr_quality-statistics-reliability-activity-7501331937618370560-xMwW)
was published 2026.09.03. These are one combined entry with two ordinary links,
no image or embed, inserted between the webinar and May 2026 colloquium.

| CV sponsor / role | CV project title and program | Period | Project total | Allocation caveat |
| --- | --- | --- | --- | --- |
| NIH/NIAMS / PI | SCH: Digital Twin Systems for Personalized Prediction of Osteoporotic Spine Fractures Using Physics-Informed Machine Learning; R01 | 09/2026-08/2030 | $1,027,705 | Project total, not personal funding |
| NSF / PI | Trustworthy Digital Twins for Patient-Specific Evaluation of Implant Systems; FDT-BioTech | 06/2027-05/2030 | $513,000 | Future start retained; not all grants are underway |
| NIH/NIDCR / PI | Toward Personalized Dental Surgery Planning: Dental Bone Stiffness Discovery and Strain Prediction Using Physics-Informed Machine Learning; R21 | 08/2026-07/2028 | $394,886 | Project total; Yuxiao Zhou is M-PI |
| NSF / Senior Personnel | Conference: Collaborative Research at the Intersection of Statistics and Engineering: High-Dimensional Data Analysis; DMS | 01/2026-12/2026 | $20,000 | Not a Lee PI award |
| Crider Foods / Co-PI | Cannery 4.0 Phase 2 | 02/2025-11/2025 | $101,628 | My share $36,390, already inside project total |
| LIFT / U.S. Department of War / Co-PI | VITAL: Virtual Qualification and Certification of an Advanced Structural Material Leveraging Advanced Data-Driven Approaches; AMC 2024 | 09/2025-09/2026 | $1,000,000 | TAMU portion $283,748; my share $93,237, both already inside project total |
| Texas A&M Institute of Data Science / PI | Toward Smart Orthopedic Surgery Planning Using Physics-Informed Machine Learning; SPAICD | 01/2025-12/2026 | $20,000 | Local institute funding, not federal |

The first three project totals sum to $1,935,591, approximately $1.94 million.
All seven project totals sum to $3,077,219, approximately $3.08 million; federal
project totals are $2,955,591, approximately $2.96 million. Shares/portions are
not added a second time. The News summary identifies digital twins and
physics-informed ML for biomedical prediction/evaluation without substituting
LinkedIn's different NSF project wording for the exact CV title. The CV funding
link uses the corresponding verified [TAMIDS funded-proposal list](https://tamids.tamu.edu/faculty-and-researchers/past-seed-grants/).
No unverified award-number or funding-database link is invented.

## Per-News Link Ledger

All 16 prior records retain their order, dates, sourceSection and facts except
the explicitly approved Refereed spelling and webinar cleanup. There are now
17 records. The deliberate 2024.12.10 then 2024.12.11 order is not sorted away.

| Maintained date | Result and evidence boundary |
| --- | --- |
| 2026.11.01 | Keep exact Tatthapong finalist item and [official finalist announcement](https://connect.informs.org/discussion/informs-2026-best-student-paper-competition-finalists). No winner/status inference. |
| 2026.10.21 | Keep official title, [recording](https://youtu.be/SUy7JjjuqcM) and [local flyer PDF](../public/assets/documents/qsr-webinar-2026-10-21-flyer.pdf). Remove the final media sentence/link and inline flyer; only the acknowledgement photo renders. Flyer JPEG remains at its stable public path with unchanged bytes. |
| 2026.09.04 | New combined grant/spotlight entry as documented above. Announcement date, not project start. |
| 2026.05.16 | Link Doctoral Student Colloquium to the [specific CIEADH organizer post](https://www.linkedin.com/posts/cieadh_iise-cieadh-activity-7465501192018739200-lxdH). Its 2026.05.27 posting date does not replace the event date. |
| 2026.03.23 | Link the first-paper phrase to the [Technometrics article DOI](https://doi.org/10.1080/00401706.2026.2653564). Online publication 2026.05.13 does not prove or replace the March acceptance date. |
| 2025.11.06 | Link the scholar phrase to the [owner's Montague announcement](https://www.linkedin.com/posts/jaesung-lee-phd_i-am-honored-to-be-selected-as-a-2025-26-activity-7392316347638214656-Idum), published 2025.11.06. The indexed university announcement returned 404 in the supplied audit and is not used. |
| 2025.10.27 | Correct Best Referred to Best Refereed and link the competition phrase to the [official QSR awards page](https://connect.informs.org/qsr/awards), whose 2025 finalists match the work. |
| 2025 | Leave ISEN second-place item unlinked: no event-specific public match found. Preserve the private author comment October 16, 2025; do not render its exact day. |
| 2025.09.19 | Link the first-paper phrase to the [Advanced Science article DOI](https://doi.org/10.1002/advs.202508445). Online publication 2025.11.25 does not replace the September acceptance date or newly verify historical IF wording. |
| 2025.09.01 | Keep Tanvir joining announcement unchanged and unlinked. A verified identity profile is linked on People; it is not precise joining-date evidence. |
| 2025.04.22 | Link the competition phrase to the [official May 2025 QCRE newsletter](https://myemail.constantcontact.com/QCRE-News---May-2025.html?aid=vKcqr1w06AU&soid=1101700049774). Its finalists list matches Sina, Jaesung Lee and the paper. Add group then certificate photos; finalist, not winner. May newsletter date does not replace April item date. |
| 2025.02.01 | Keep Cannery 4.0 unlinked; no specific public project match found. Generic company/automation pages are not substitutes. |
| 2024.12.10 | Repair the broken SPAICD link to the [current official past-seed-grants list](https://tamids.tamu.edu/faculty-and-researchers/past-seed-grants/), under 2024. Keep existing [TAMU Engineering](https://engineering.tamu.edu/news/2025/01/revolutionizing-dental-surgery-with-ai.html) and [Dental Tribune](https://www.dental-tribune.com/news/bones-and-machines-ai-and-the-transformation-of-dental-implantology) links. The secondary article reverses departments; do not adopt that error. |
| 2024.12.11 | Link Best Paper Award to the [specific UW-Madison ISyE announcement](https://www.linkedin.com/posts/uw-madison-dept-of-industrial-and-systems-engineering-isye_iiseannual2024-activity-7199389862829973504--xtp). Its 2024.05.23 post predates the existing December News date; unresolved posting/event distinction is preserved, not silently corrected. |
| 2024.07.22 | Keep [Associate Editor board link](https://link.springer.com/journal/10845/editorial-board) and [journal link](https://link.springer.com/journal/10845). Current board membership does not prove the start day. |
| 2023.04.16 | Link exact paper title to [Advanced Materials Technologies DOI](https://doi.org/10.1002/admt.202301288). It provides article identity, not top-viewed recognition evidence. The existing date precedes 2023.08.15 online publication and remains unresolved pending owner confirmation. No silent date/status repair. |
| 2022.10.04 | Link exact paper title to the [Landmark-embedded paper DOI](https://doi.org/10.1080/24725854.2021.1974129). The specific magazine body is member-gated; DOI is paper context, not independent proof of the feature. |

The matching verified sources also support contextual links in shared faculty
awards. Publication metadata dates never become acceptance, competition or
ceremony dates. Existing impact-factor and recognition prose is historical
source wording, not a newly verified metric or achievement.

## Student Identity and Advising

| Student | Verified identity links | Basis and caveat |
| --- | --- | --- |
| Tatthapong Srikitrungruang | [LinkedIn](https://www.linkedin.com/in/tatthapongjoe) | Public profile matches exact name, TAMU industrial-engineering PhD/MS and Chulalongkorn bachelor institution/field. Profile enrollment dates conflict with lab data: PhD 2023-2027, MS 2021-2023, bachelor 2013-2016. Preserve current lab dates. |
| Sina Aghaee Dabaghan Fard | [Website](https://sinalytics.net/) and [LinkedIn](https://www.linkedin.com/in/sinaaghaee) | Personal site explicitly links that LinkedIn and matches full name, lab email, TAMU ISEN, adviser Jaesung Lee, Sharif MS and IUST BS. |
| Tanvir Ahmed | [LinkedIn](https://www.linkedin.com/in/tanvir-ahmed-68126229b) | Profile matches TAMU GRA since August 2025 and BUET Industrial and Production Engineering BS. It does not explicitly list PhD or establish the lab joining day. Its BS 2019-2024 conflicts with lab 2018-2024; lab data stays unchanged. |

The supplied audit accessed public non-www profiles after www/authwall failures;
no private/login collection was used. CV page 7 supports Tatthapong's 2026 QSR
student finalist, 2025 QSR refereed finalist and 2025 ISEN second place; Sina's
2025 QCRE finalist; and Tanvir's 2026 chapter competition runner-up, not winner.
Andres Sanchez is current undergraduate research credit, not a new degree claim.
Noor and Gabriel additions append to, rather than replace, existing strings.

## Sina QCRE Photos

The parent visually verified the source previews; the worker did not load a
huge original into vision. Both photos are copied without crop, scaling,
recompression or other processing. Provenance credits Sina Aghaee Dabaghan Fard
here rather than adding redundant News prose.

Source page: [Sina's snapshots](https://sinalytics.net/snapshots.html).
Group: [iise-2025-3.jpeg](https://sinalytics.net/assets/snapshots/iise-2025-3.jpeg).
Certificate: [iise-2025-2.jpeg](https://sinalytics.net/assets/snapshots/iise-2025-2.jpeg).

| New public asset | Native dimensions | Bytes | SHA-256 |
| --- | --- | --- | --- |
| public/assets/images/sina-qcre-2025-group.jpg | 720 x 539 | 74829 | 4d17f556f26fd771c878f906faf42f2d16bacf34f260ae0dcfa6997a0c99b1a0 |
| public/assets/images/sina-qcre-2025-certificate.jpg | 800 x 620 | 73153 | a02c4d4ec4c6e10d91020cb49d9043357a8300e09b55ffcf6918fb36a63bf842 |

Their source and destination hashes match. At release, both image links are read from this canonical document, confirmed present in the source page, fetched, and compared byte-for-byte with the corresponding public assets. This checks the authored provenance URL, not merely a separately typed download URL. The group photo precedes the
certificate only in the existing April 2025 News item. The 2024, 2025 and 2026
Lab photos remain exactly unchanged in data, order and bytes.

## Worker Verification and Handoff

Before content changes, the focused existing suite passed 54 tests. New
cv-news-refresh tests were then run RED: seven expected failures from missing
approved grant content and photo files, with no syntax/runtime errors.
After implementation and narrow historical-test adaptations, this command
passed all 66 tests with zero failures or skips:

    node --test tests/cv-news-refresh.test.mjs tests/cv-news-source-coverage.test.mjs tests/qsr-webinar-news.test.mjs tests/tatthapong-qsr-news.test.mjs tests/news-date.test.mjs tests/informs-lab-photo.test.mjs tests/cv-publication-sync.test.mjs

The test-only approved-delta fixture records 32 exact field changes and one
exact inserted record. Every after-value is deep-compared before only its
approved field is restored to the recorded before-value. A full original-data
hash then rejects any unrelated change. Existing historical hashes and the
pre-webinar fixture are not replaced. Mutation checks cover changed strings,
all funding fields/links, missing/reordered approved fields, additional claims,
student dates/photos, unrelated research/publications and historical News order.

The former source-paragraph test is shared in tests/source-coverage.mjs so it
can run without starting a build; tests/site.test.mjs still calls the same
check on real build output. All 243 paragraphs remain checked. Twelve explicit
old-to-new paragraph mappings cover only the approved interest/course/award,
faculty education and Refereed replacements. The prior private ISEN correction
and publication exceptions remain intact. Existing original asset byte checks
still run, including the no-longer-inline webinar flyer.

No npm test or build was run by this worker during concurrent UI changes. The
parent subsequently began full-suite/build and browser QA after observing
focused GREEN; their outcomes are not claimed in this content handoff. The
worker does not own plan/todo/history/wiki, commits, pushes or deployment.
