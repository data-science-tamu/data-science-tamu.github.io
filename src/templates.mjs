import { escape as e, rich, anchor } from "./helpers.mjs";
import { researchContent } from "./research-content.mjs";

const nav = [
  ["/", "Home"],
  ["/research/", "Research"],
  ["/people/", "People"],
  ["/publication/", "Publications"],
  ["/news/", "News"],
  ["/cv/", "CV"],
];
const arrow = `<span aria-hidden="true">&#8599;</span>`;
const paragraphs = (items) =>
  items.map((p) => `<p>${rich(p.html)}</p>`).join("\n");
const list = (items) =>
  `<ul class="clean-list">${items.map((p) => `<li>${rich(p.html)}</li>`).join("")}</ul>`;
const button = (href, label, secondary = false) =>
  `<a class="button${secondary ? " button-secondary" : ""}" href="${e(href)}">${e(label)} ${arrow}</a>`;
const sectionHead = (title) =>
  `<div class="section-heading"><h2>${e(title)}</h2></div>`;
const pageHead = (title, description) =>
  `<header class="page-heading"><h1>${e(title)}</h1><p class="lead">${e(description)}</p></header>`;
const education = (items) =>
  `<ul class="education-list">${items.map((d) => `<li><span class="degree">${e(d.degree)} <span>${e(d.dates)}</span></span><div><strong>${e(d.field)}</strong><span class="institution">${e(d.institution)}</span></div></li>`).join("")}</ul>`;

function researchDisclosure(areas, id, route, action = false) {
  return `<div class="research-disclosure${action ? " research-action" : ""}"><a${action ? ' class="button"' : route === "/research/" ? ' aria-current="page"' : route.startsWith("/research/") ? ' class="active-section"' : ""} href="/research/">Research${action ? " " + arrow : ""}</a><button type="button" data-research-toggle aria-label="Research directions" aria-expanded="false" aria-controls="${id}" hidden>Directions <span aria-hidden="true">&#9662;</span></button><ul class="research-directions" id="${id}" data-research-directions>${areas.map((a) => `<li><a href="/research/${e(a.slug)}/"${route === `/research/${a.slug}/` ? ' aria-current="page"' : ""}>${e(a.title)}</a></li>`).join("")}</ul></div>`;
}

export function createPages(site, lab, img, originals = new Map()) {
  const faculty = lab.faculty;
  const publicationIds = new Set(lab.publications.map((p) => p.id));
  const themeFigures = lab.research.figures.filter((f) => f.placement === "theme");
  if (themeFigures.length !== 1) throw new Error("Invalid research theme figure placement");
  const themeFigure = themeFigures[0];
  const areas = () =>
    `<div class="research-areas">${lab.research.areas.map((a, i) => `<a class="area-link" href="/research/${e(a.slug)}/"><span class="index">0${i + 1}</span><div><h3>${e(a.title)}</h3><p>${e(a.summary)}</p></div>${arrow}</a>`).join("")}</div>`;
  const figure = (src, alt, caption = alt) =>
    `<figure class="scientific-figure"><a href="${e(originals.get(src) || src)}" data-figure-open data-figure-title="${e(caption)}" aria-label="${e(`View full-size figure: ${caption}`)}">${img(src, alt)}</a><figcaption>${e(caption)} <a href="${e(originals.get(src) || src)}" data-figure-open data-figure-title="${e(caption)}">View full-size figure ${arrow}</a></figcaption></figure>`;
  const project = (p) =>
    `<article class="project" id="${e(p.id)}"><div class="project-text"><h3>${e(p.title)}</h3>${p.prefix ? `<p class="small">${rich(p.prefix.html)}</p>` : ""}${researchContent(p.paragraphs, publicationIds)}</div>${figure(p.image, p.alt, p.title)}</article>`;
  const contact = () =>
    `<section class="contact-panel" id="prospective-students"><div><h2>Prospective Students &amp; Collaborators</h2></div><div>${paragraphs([faculty.collaboration, faculty.prospective])}${button(`mailto:${site.email}`, site.email)}</div></section>`;
  const facultyLinks = () =>
    `<div class="text-links"><a href="${e(site.profile)}">Faculty profile ${arrow}</a><a href="${e(site.scholar)}">Google Scholar ${arrow}</a><a href="${e(site.linkedin)}">LinkedIn ${arrow}</a></div>`;
  const facultyDetails =
    () => `<section class="section split-section" id="faculty-background">${sectionHead("Education")}<div>${education(faculty.education)}<p class="section-link"><a href="/cv/">Full curriculum vitae ${arrow}</a></p></div></section>
  <section class="section faculty-details"><div>${sectionHead("Courses taught")}${list(faculty.courses)}</div><div>${sectionHead("Research Interests & recognition")}${list(faculty.interests)}<h3>Research Recognition</h3>${list(faculty.recognition)}</div></section>
  <section class="section split-section">${sectionHead("Awards and Honors")}<div>${list(faculty.awards)}</div></section>`;
  const latest = lab.news.slice(0, 3);
  const home = `<section class="home-hero"><div class="hero-copy"><h1>${e(site.title)}</h1><p class="affiliation">${e(site.institution)} <span aria-hidden="true">/</span> ${e(site.department)}</p><div class="hero-lead">${paragraphs([faculty.bio[1]])}</div><div class="hero-actions">${researchDisclosure(lab.research.areas, "home-research-directions", "/", true)}${button("/publication/", "Publications", true)}</div><a class="student-link" href="#prospective-students">Interested in a Ph.D. position? <span aria-hidden="true">&#8595;</span></a></div><figure class="faculty-portrait">${img(faculty.portrait, `Portrait of ${faculty.name}`, { eager: true })}<figcaption><h2>${e(faculty.name)}</h2><p>${e(site.facultyRole)}<br>${e(site.department)}</p><a href="mailto:${e(site.email)}">${e(site.email)}</a></figcaption></figure></section>
  <section class="section split-section">${sectionHead("Research focus")}<div class="prose">${paragraphs([faculty.bio[2]])}<ul class="topic-list">${faculty.topics.map((t) => `<li>${e(t)}</li>`).join("")}</ul><p class="section-link"><a href="/people/">Meet the research group ${arrow}</a></p></div></section>
  <section class="section">${sectionHead("Research directions")}${areas()}</section>
  <section class="section split-section">${sectionHead("Latest news")}<div class="latest-news">${latest.map((n) => `<article><time datetime="${n.date.replaceAll(".", "-")}">${n.date}</time><p>${rich(n.html)}</p></article>`).join("")}<a href="/news/">All lab news ${arrow}</a></div></section>
  ${contact()}
  <section class="section split-section">${sectionHead(faculty.name)}<div class="prose">${paragraphs([faculty.bio[0]])}${facultyLinks()}</div></section>${facultyDetails()}
  <section class="section split-section">${sectionHead("Industry & funding partners")}<div class="prose">${paragraphs(faculty.partners)}</div></section>`;
  const people = `${pageHead("People", "Faculty, current Ph.D. students, and past members of the Data Science Lab.")}
  <section class="section faculty-feature"><div>${img(faculty.portrait, `Portrait of ${faculty.name}`)}</div><div><h2>${e(faculty.name)}</h2>${paragraphs([faculty.bio[0]])}<a href="mailto:${e(site.email)}">${e(site.email)}</a>${facultyLinks()}<p><a href="/cv/">Curriculum vitae ${arrow}</a></p></div></section>
  <section class="section"><div class="section-heading"><h2>Current Ph.D. Students</h2></div><div class="student-list">${lab.people.current.map((p) => `<article class="student"><div class="student-photo">${img(p.portrait, `Portrait of ${p.name}`)}</div><div><h3>${e(p.name)}</h3><a class="email" href="mailto:${e(p.email)}">${e(p.email)}</a><h4>Education</h4>${education(p.education)}</div></article>`).join("")}</div></section>
  <section class="section">${sectionHead("Past members: Students & research experiences")}<div class="past-members">${lab.people.past.map((g) => `<section><h3>${e(g.title)}</h3>${g.label ? `<p class="small">${e(g.label)}</p>` : ""}<ul>${g.names.map((n) => `<li>${e(n)}</li>`).join("")}</ul></section>`).join("")}</div></section>
  <section class="section">${sectionHead("Lab photos")}<div class="photo-grid">${lab.people.photos.map((p) => `<figure>${img(p.src, p.caption)}<figcaption>${e(p.caption)}</figcaption></figure>`).join("")}</div></section>${contact()}`;
  const cv = `${pageHead("Curriculum Vitae", "Academic background, teaching and research. Open or download the complete curriculum vitae below.")}
  <section class="cv-document"><div><h2>Jaesung Lee <span class="muted">/ CV</span></h2><p>The full CV includes academic appointments, education, publications, research activities and professional service.</p></div><div class="cv-actions">${button(site.cv, "Open CV PDF")}<a class="button button-secondary" href="${e(site.cv)}" download>Download CV PDF <span aria-hidden="true">&#8595;</span></a></div><p class="small cv-note">PDF not opening in your browser? Use the download link to view it in a PDF reader.</p></section>
  ${facultyDetails()}<section class="section split-section">${sectionHead("Publications & projects")}<div><p>Explore the lab research pages and the full publication record, including work under review and conference proceedings.</p><div class="text-links"><a href="/publication/">Publications ${arrow}</a><a href="/research/">Research ${arrow}</a></div></div></section>`;
  const research = `${pageHead("Domain-informed data science", "Statistical and machine learning methods for engineering processes and systems, integrating domain knowledge with data and uncertainty.")}
  <section class="research-theme"><h2>${e(lab.research.theme.title)}</h2><div class="prose">${paragraphs([lab.research.theme.summary])}<ul class="theme-concepts">${lab.research.theme.concepts.map((c) => `<li><strong>${e(c.label)}:</strong> ${rich(c.html)}</li>`).join("")}</ul></div>${figure(themeFigure.src, themeFigure.alt)}</section>
  <section class="section">${sectionHead("Research directions")}${areas()}</section>
  <section class="section research-context"><div class="prose"><h2>Research interests</h2>${paragraphs(lab.research.interests.slice(1))}<h2>Previous & ongoing work</h2>${researchContent(lab.research.overview.slice(1), publicationIds, 3)}</div><div>${lab.research.figures.filter((f) => f.placement !== "theme").map((f) => figure(f.src, f.alt)).join("")}<aside class="featured-in"><h2>Research in the news</h2><ul>${lab.research.features.map((l) => `<li><a href="${e(l.href)}">${e(l.text)} ${arrow}</a></li>`).join("")}</ul></aside></div></section>
  <section class="section projects">${sectionHead("Projects & applications")}<nav class="project-index" aria-label="Research project index">${lab.projects.map((p, i) => `<a href="#${e(p.id)}"><span>0${i + 1}</span> ${e(p.title)}</a>`).join("")}</nav>${lab.projects.map(project).join("")}</section>`;
  const news = `${pageHead("News", "Research milestones, student achievements and news from the Data Science Lab.")}<div class="news-timeline">${lab.news.map((n, i) => `${i === 0 || n.date.slice(0, 4) !== lab.news[i - 1].date.slice(0, 4) ? `<h2 class="news-year">${n.date.slice(0, 4)}</h2>` : ""}<article class="news-entry" id="news-${n.date.replaceAll(".", "-")}"><time datetime="${n.date.replaceAll(".", "-")}">${n.date}</time><div><p>${rich(n.html)}</p>${n.images.length ? `<div class="news-photos">${n.images.map((src, j) => `<a href="${e(src)}" aria-label="${e(`View full-size photo ${j + 1} for news dated ${n.date}`)}">${img(src, `Lab news photo ${j + 1}: ${n.text}`)}</a>`).join("")}</div>` : ""}</div></article>`).join("")}</div>`;
  const pubGroups = [
    [
      "journal",
      "journal-papers",
      "Journal Papers",
      "Published and accepted journal articles.",
    ],
    [
      "review",
      "under-review",
      "Under Review / Revision",
      "Manuscripts under review or revision.",
    ],
    ["conference", "conference-proceedings", "Conference Proceedings", ""],
  ];
  const years = [
    ...new Set(lab.publications.map((p) => p.year).filter(Boolean)),
  ]
    .sort()
    .reverse();
  const publication = `${pageHead("Publications", "Journal papers, work under review or revision, and conference proceedings.")}
  <nav class="jump-links" aria-label="Publication categories">${pubGroups.map(([, id, title]) => `<a href="#${id}">${title}</a>`).join("")}<a href="${e(site.scholar)}">Google Scholar ${arrow}</a></nav>
  <form class="publication-filters" id="publication-filters" role="search" aria-label="Filter publications" hidden><div><label for="publication-search">Search publications</label><input type="search" id="publication-search" placeholder="Title, author, topic or ID"></div><div><label for="publication-year">Year</label><select id="publication-year"><option value="">All years</option>${years.map((y) => `<option value="${y}">${y}</option>`).join("")}<option value="undated">Year not specified</option></select></div><div><label for="publication-type">Type</label><select id="publication-type"><option value="">All types</option><option value="journal">Journal papers</option><option value="review">Under review / revision</option><option value="conference">Conference proceedings</option></select></div><button type="reset">Reset filters</button></form>
  <p class="result-count" id="publication-count" role="status" aria-live="polite">${lab.publications.length} publications</p><div id="publication-empty" class="empty-state" hidden><h2>No matching publications</h2><p>Try another title, author, year or type.</p><button type="button" id="empty-reset">Clear all filters</button></div>
  ${pubGroups
    .map(
      ([type, id, title, subtitle]) =>
        `<section class="publication-group" id="${id}"><div class="section-heading"><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div><ol class="publication-list">${lab.publications
          .filter((p) => p.type === type)
          .map(
            (p) =>
              `<li class="publication" id="${anchor(p.id)}" data-type="${type}" data-year="${p.year || "undated"}"><div class="publication-id">[${e(p.id)}]</div><article><h3>${p.links.length ? `<a href="${e(p.links[0].href)}">${e(p.title)}</a>` : e(p.title)}</h3><p class="authors">${e(p.authors.replace(/,\s*$/, ""))}</p><p class="publication-meta">${e(p.metadata)}</p>${p.notes.length ? `<ul class="publication-notes">${p.notes.map((n) => `<li>${e(n)}</li>`).join("")}</ul>` : ""}${p.links.length ? `<p class="publication-links">${p.links.map((l) => `<a href="${e(l.href)}">Publisher record ${arrow}<span class="visually-hidden"> for ${e(p.id)}</span></a>`).join(" ")}</p>` : ""}</article></li>`,
          )
          .join("")}</ol></section>`,
    )
    .join("")}`;
  const pages = [
    {
      route: "/",
      title: site.title,
      description: site.description,
      body: home,
    },
    {
      route: "/people/",
      title: "People",
      description:
        "Meet Jaesung Lee, current Ph.D. students and past members of the Data Science Lab at Texas A&M University.",
      body: people,
    },
    {
      route: "/cv/",
      title: "Curriculum Vitae",
      description:
        "Jaesung Lee curriculum vitae, academic background, teaching and a direct local PDF download.",
      body: cv,
    },
    {
      route: "/research/",
      title: "Research",
      description:
        "Explore domain-informed data science research in engineering systems, engineering processes and physics-informed AI.",
      body: research,
    },
    {
      route: "/news/",
      title: "News",
      description:
        "Research milestones, student achievements and lab news at the Data Science Lab, Texas A&M University.",
      body: news,
    },
    {
      route: "/publication/",
      title: "Publications",
      description:
        "Publications by Jaesung Lee and collaborators, including journal papers, manuscripts under review and conference proceedings.",
      body: publication,
    },
  ];
  for (const area of lab.research.areas) {
    pages.push({
      route: `/research/${area.slug}/`,
      title: area.title,
      description: area.summary,
      body: `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/research/">Research</a><span aria-hidden="true">/</span><span>${e(area.title)}</span></nav>${pageHead(area.title, area.summary)}<nav class="research-subnav" aria-label="Research directions">${lab.research.areas.map((a) => `<a href="/research/${a.slug}/"${a.slug === area.slug ? ` aria-current="page"` : ""}>${e(a.title)}</a>`).join("")}</nav><section class="section split-section">${sectionHead("Research focus")}<div class="prose">${paragraphs(area.intro)}</div></section>${area.slug === "ai-for-systems" ? `<div class="overview-figure">${figure(lab.research.figures[0].src, lab.research.figures[0].alt)}</div>` : ""}${area.selected.length ? `<section class="section split-section">${sectionHead("Selected publications")}<div class="selected-publications">${researchContent(area.selected, publicationIds, 3)}<a href="/publication/">Complete publication record ${arrow}</a></div></section>` : ""}<section class="section projects">${sectionHead("Projects & applications")}${area.projects.map((id) => project(lab.projects.find((p) => p.id === id))).join("")}</section><section class="section">${sectionHead("Other research directions")}${areas()}</section>`,
    });
  }
  return pages;
}

export function layout(site, page, facultyName, researchAreas) {
  const isHome = page.route === "/";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(isHome ? `${site.title} | ${site.institution}` : `${page.title} | ${site.title}`)}</title>
<meta name="description" content="${e(page.description)}">
<link rel="canonical" href="${e(site.url + page.route)}">
<meta property="og:type" content="website"><meta property="og:title" content="${e(page.title + " | " + site.title)}"><meta property="og:description" content="${e(page.description)}"><meta property="og:url" content="${e(site.url + page.route)}">
<meta name="theme-color" content="#500000">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/dm-sans.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script src="/assets/site.js" defer></script>
</head>
<body class="${isHome ? "home" : "inner-page"}">
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="${e(site.title)} home"><span>${e(site.title)}<small>${e(site.institution)}</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" hidden>Menu <span aria-hidden="true">&#9776;</span></button><nav class="primary-nav" id="primary-navigation" aria-label="Main navigation">${nav.map(([href, label]) => href === "/research/" ? researchDisclosure(researchAreas, "header-research-directions", page.route) : `<a href="${href}"${href === page.route ? ` aria-current="page"` : ""}>${label}</a>`).join("")}</nav></div></header>
<main id="main" tabindex="-1" class="container">${page.body}</main>
${page.body.includes('class="scientific-figure"') ? figureViewer() : ""}
<footer class="site-footer"><div class="footer-inner"><div><a class="footer-brand" href="/">${e(site.title)}</a><p>${e(site.department)}<br>${e(site.institution)}<br>${e(site.location)}</p></div><div><p>Contact</p><a href="mailto:${e(site.email)}">${e(site.email)}</a><p>${e(facultyName)} <span aria-hidden="true">/</span> ${e(site.facultyRole)}</p></div><div class="footer-links"><a href="/research/">Research</a><a href="/people/">People</a><a href="/publication/">Publications</a><a href="/cv/">Curriculum vitae</a></div></div><div class="footer-bottom"><span>Data Science Lab <span aria-hidden="true">&middot;</span> ${e(site.institution)}</span><a href="#main">Back to top <span aria-hidden="true">&#8593;</span></a></div></footer>
</body></html>`;
}

function figureViewer() {
  return `<dialog class="figure-viewer" id="figure-viewer" aria-labelledby="figure-viewer-title" aria-describedby="figure-viewer-help" hidden>
<div class="figure-header"><p class="figure-title" id="figure-viewer-title" data-viewer-title>Scientific figure</p><button type="button" data-viewer-close autofocus>Close</button></div>
<div class="figure-toolbar"><div class="figure-scales" role="group" aria-label="Figure scale"><button type="button" data-viewer-scale="fit" aria-pressed="false" disabled>Fit</button><button type="button" data-viewer-scale="1" aria-pressed="true" disabled>100%</button><button type="button" data-viewer-scale="2" aria-pressed="false" disabled>200%</button></div><a href="#main" data-viewer-original>Open original image file ${arrow}</a></div>
<p class="figure-help" id="figure-viewer-help">Scroll or use arrow keys in the image area to read all corners. Fit shows an overview. 200% is magnification only; it does not add detail.</p>
<div class="figure-scroll" tabindex="0" role="region" aria-label="Scrollable scientific figure" aria-describedby="figure-viewer-help"><div data-viewer-image></div></div>
<p class="figure-status" data-viewer-status role="status" aria-live="polite"></p>
</dialog>`;
}
