import { escape as e, rich, anchor } from "./helpers.mjs";

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
const sectionHead = (label, title) =>
  `<div class="section-heading"><p class="eyebrow">${e(label)}</p><h2>${e(title)}</h2></div>`;
const pageHead = (label, title, description) =>
  `<header class="page-heading"><p class="eyebrow">${e(label)}</p><h1>${e(title)}</h1><p class="lead">${e(description)}</p></header>`;
const education = (items) =>
  `<ul class="education-list">${items.map((d) => `<li><span class="degree">${e(d.degree)} <span>${e(d.dates)}</span></span><div><strong>${e(d.field)}</strong><span class="institution">${e(d.institution)}</span></div></li>`).join("")}</ul>`;

export function createPages(site, lab, img) {
  const faculty = lab.faculty;
  const areas = () =>
    `<div class="research-areas">${lab.research.areas.map((a, i) => `<a class="area-link" href="/research/${e(a.slug)}/"><span class="index">0${i + 1}</span><div><h3>${e(a.title)}</h3><p>${e(a.summary)}</p></div>${arrow}</a>`).join("")}</div>`;
  const figure = (src, alt, caption = alt) =>
    `<figure class="scientific-figure"><a href="${e(src)}" aria-label="${e(`View full-size figure: ${caption}`)}">${img(src, alt)}</a><figcaption>${e(caption)} <a href="${e(src)}">View full-size figure ${arrow}</a></figcaption></figure>`;
  const project = (p) =>
    `<article class="project" id="${e(p.id)}"><div class="project-text"><p class="eyebrow">Research Project</p><h3>${e(p.title)}</h3>${p.prefix ? `<p class="small">${rich(p.prefix.html)}</p>` : ""}${paragraphs(p.paragraphs)}${p.relatedIds.length ? `<p class="project-refs">Publication record: ${p.relatedIds.map((id) => `<a href="/publication/#${anchor(id)}">[${e(id)}]</a>`).join(" ")}</p>` : ""}</div>${figure(p.image, p.alt, p.title)}</article>`;
  const contact = () =>
    `<section class="contact-panel" id="prospective-students"><div><p class="eyebrow">Prospective Students &amp; Collaborators</p><h2>Work with the lab</h2></div><div>${paragraphs([faculty.collaboration, faculty.prospective])}${button(`mailto:${site.email}`, site.email)}</div></section>`;
  const facultyLinks = () =>
    `<div class="text-links"><a href="${e(site.profile)}">Faculty profile ${arrow}</a><a href="${e(site.scholar)}">Google Scholar ${arrow}</a><a href="${e(site.linkedin)}">LinkedIn ${arrow}</a></div>`;
  const facultyDetails =
    () => `<section class="section split-section" id="faculty-background">${sectionHead("Jaesung Lee", "Education")}<div>${education(faculty.education)}<p class="section-link"><a href="/cv/">Full curriculum vitae ${arrow}</a></p></div></section>
  <section class="section faculty-details"><div>${sectionHead("Teaching", "Courses taught")}${list(faculty.courses)}</div><div>${sectionHead("Research", "Interests & recognition")}${list(faculty.interests)}<h3>Research Recognition</h3>${list(faculty.recognition)}</div></section>
  <section class="section split-section">${sectionHead("Recognition", "Awards and Honors")}<div>${list(faculty.awards)}</div></section>`;
  const latest = lab.news.slice(0, 3);
  const home = `<section class="home-hero"><div class="hero-copy"><p class="eyebrow">${e(site.institution)} <span aria-hidden="true">/</span> ${e(site.department)}</p><h1>${e(site.title.split(" ").slice(0, -1).join(" "))}<br><span>${e(site.title.split(" ").at(-1))}</span></h1><div class="hero-lead">${paragraphs([faculty.bio[1]])}</div><div class="hero-actions">${button("/research/", "Explore our research")}${button("/publication/", "Publications", true)}</div><a class="student-link" href="#prospective-students">Interested in a Ph.D. position? <span aria-hidden="true">&#8595;</span></a></div><figure class="faculty-portrait">${img(faculty.portrait, `Portrait of ${faculty.name}`, { eager: true })}<figcaption><h2>${e(faculty.name)}</h2><p>${e(site.facultyRole)}<br>${e(site.department)}</p><a href="mailto:${e(site.email)}">${e(site.email)}</a></figcaption></figure></section>
  <section class="section split-section">${sectionHead("Research Focus", "Knowledge, data & uncertainty")}<div class="prose">${paragraphs([faculty.bio[2]])}<ul class="topic-list">${faculty.topics.map((t) => `<li>${e(t)}</li>`).join("")}</ul><p class="section-link"><a href="/people/">Meet the research group ${arrow}</a></p></div></section>
  <section class="section">${sectionHead("Research Directions", "From engineering data to decisions")}${areas()}</section>
  <section class="section split-section">${sectionHead("Lab Notes", "Latest news")}<div class="latest-news">${latest.map((n) => `<article><time datetime="${n.date.replaceAll(".", "-")}">${n.date}</time><p>${rich(n.html)}</p></article>`).join("")}<a href="/news/">All lab news ${arrow}</a></div></section>
  ${contact()}
  <section class="section split-section">${sectionHead("About the Faculty", faculty.name)}<div class="prose">${paragraphs([faculty.bio[0]])}${facultyLinks()}</div></section>${facultyDetails()}
  <section class="section split-section">${sectionHead("Collaboration", "Industry & funding partners")}<div class="prose">${paragraphs(faculty.partners)}</div></section>`;
  const people = `${pageHead("Our Group", "People", "Faculty, current Ph.D. students, and past members of the Data Science Lab.")}
  <section class="section faculty-feature"><div>${img(faculty.portrait, `Portrait of ${faculty.name}`)}</div><div><p class="eyebrow">Faculty</p><h2>${e(faculty.name)}</h2>${paragraphs([faculty.bio[0]])}<a href="mailto:${e(site.email)}">${e(site.email)}</a>${facultyLinks()}<p><a href="/cv/">Curriculum vitae ${arrow}</a></p></div></section>
  <section class="section"><div class="section-heading"><p class="eyebrow">Current Members</p><h2>Ph.D. Students</h2></div><div class="student-list">${lab.people.current.map((p) => `<article class="student"><div class="student-photo">${img(p.portrait, `Portrait of ${p.name}`)}</div><div><h3>${e(p.name)}</h3><a class="email" href="mailto:${e(p.email)}">${e(p.email)}</a><h4>Education</h4>${education(p.education)}</div></article>`).join("")}</div></section>
  <section class="section">${sectionHead("Past Members", "Students & research experiences")}<div class="past-members">${lab.people.past.map((g) => `<section><h3>${e(g.title)}</h3>${g.label ? `<p class="small">${e(g.label)}</p>` : ""}<ul>${g.names.map((n) => `<li>${e(n)}</li>`).join("")}</ul></section>`).join("")}</div></section>
  <section class="section">${sectionHead("Together", "Lab photos")}<div class="photo-grid">${lab.people.photos.map((p) => `<figure>${img(p.src, p.caption)}<figcaption>${e(p.caption)}</figcaption></figure>`).join("")}</div></section>${contact()}`;
  const cv = `${pageHead("Jaesung Lee", "Curriculum Vitae", "Academic background, teaching and research. Open or download the complete curriculum vitae below.")}
  <section class="cv-document"><div><p class="eyebrow">Complete Document</p><h2>Jaesung Lee <span class="muted">/ CV</span></h2><p>The full CV includes academic appointments, education, publications, research activities and professional service.</p></div><div class="cv-actions">${button(site.cv, "Open CV PDF")}<a class="button button-secondary" href="${e(site.cv)}" download>Download CV PDF <span aria-hidden="true">&#8595;</span></a></div><p class="small cv-note">PDF not opening in your browser? Use the download link to view it in a PDF reader.</p></section>
  ${facultyDetails()}<section class="section split-section">${sectionHead("Research", "Publications & projects")}<div><p>Explore the lab research pages and the full publication record, including work under review and conference proceedings.</p><div class="text-links"><a href="/publication/">Publications ${arrow}</a><a href="/research/">Research ${arrow}</a></div></div></section>`;
  const research = `${pageHead("Research", "Domain-informed data science", "Statistical and machine learning methods for engineering processes and systems, integrating domain knowledge with data and uncertainty.")}
  <section class="section">${sectionHead("Explore", "Research directions")}${areas()}</section>
  <section class="section research-context"><div class="prose"><h2>Research interests</h2>${paragraphs(lab.research.interests.slice(1))}<h2>Previous & ongoing work</h2>${paragraphs(lab.research.overview.slice(1))}</div><div>${lab.research.figures.map((f) => figure(f.src, f.alt)).join("")}<aside class="featured-in"><h2>Research in the news</h2><ul>${lab.research.features.map((l) => `<li><a href="${e(l.href)}">${e(l.text)} ${arrow}</a></li>`).join("")}</ul></aside></div></section>
  <section class="section projects">${sectionHead("Research Portfolio", "Projects & applications")}<nav class="project-index" aria-label="Research project index">${lab.projects.map((p, i) => `<a href="#${e(p.id)}"><span>0${i + 1}</span> ${e(p.title)}</a>`).join("")}</nav>${lab.projects.map(project).join("")}</section>`;
  const news = `${pageHead("From the Lab", "News", "Research milestones, student achievements and news from the Data Science Lab.")}<div class="news-timeline">${lab.news.map((n, i) => `${i === 0 || n.date.slice(0, 4) !== lab.news[i - 1].date.slice(0, 4) ? `<h2 class="news-year">${n.date.slice(0, 4)}</h2>` : ""}<article class="news-entry" id="news-${n.date.replaceAll(".", "-")}"><time datetime="${n.date.replaceAll(".", "-")}">${n.date}</time><div><p>${rich(n.html)}</p>${n.images.length ? `<div class="news-photos">${n.images.map((src, j) => `<a href="${e(src)}" aria-label="${e(`View full-size photo ${j + 1} for news dated ${n.date}`)}">${img(src, `Lab news photo ${j + 1}: ${n.text}`)}</a>`).join("")}</div>` : ""}</div></article>`).join("")}</div>`;
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
  const publication = `${pageHead("Research Output", "Publications", "Journal papers, work under review or revision, and conference proceedings.")}
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
      body: `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/research/">Research</a><span aria-hidden="true">/</span><span>${e(area.title)}</span></nav>${pageHead("Research Direction", area.title, area.summary)}<nav class="research-subnav" aria-label="Research directions">${lab.research.areas.map((a) => `<a href="/research/${a.slug}/"${a.slug === area.slug ? ` aria-current="page"` : ""}>${e(a.title)}</a>`).join("")}</nav><section class="section split-section">${sectionHead("Overview", "Research focus")}<div class="prose">${paragraphs(area.intro)}</div></section>${area.slug === "ai-for-systems" ? `<div class="overview-figure">${figure(lab.research.figures[0].src, lab.research.figures[0].alt)}</div>` : ""}${area.selected.length ? `<section class="section split-section">${sectionHead("Related Work", "Selected publications")}<div class="selected-publications">${paragraphs(area.selected)}<a href="/publication/">Complete publication record ${arrow}</a></div></section>` : ""}<section class="section projects">${sectionHead("In Detail", "Projects & applications")}${area.projects.map((id) => project(lab.projects.find((p) => p.id === id))).join("")}</section><section class="section">${sectionHead("Explore Further", "Other research directions")}${areas()}</section>`,
    });
  }
  return pages;
}

export function layout(site, page, facultyName) {
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
<link rel="preload" href="/assets/fonts/newsreader.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script src="/assets/site.js" defer></script>
</head>
<body class="${isHome ? "home" : "inner-page"}">
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="${e(site.title)} home"><span class="brand-mark" aria-hidden="true">DS<span>L</span></span><span>${e(site.title)}<small>${e(site.institution)}</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" hidden>Menu <span aria-hidden="true">&#9776;</span></button><nav class="primary-nav" id="primary-navigation" aria-label="Main navigation">${nav.map(([href, label]) => `<a href="${href}"${href === page.route ? ` aria-current="page"` : page.route.startsWith("/research/") && href === "/research/" ? ` class="active-section"` : ""}>${label}</a>`).join("")}</nav></div></header>
<main id="main" tabindex="-1" class="container">${page.body}</main>
<footer class="site-footer"><div class="footer-inner"><div><a class="footer-brand" href="/">${e(site.title)}</a><p>${e(site.department)}<br>${e(site.institution)}<br>${e(site.location)}</p></div><div><p class="eyebrow">Contact</p><a href="mailto:${e(site.email)}">${e(site.email)}</a><p>${e(facultyName)} <span aria-hidden="true">/</span> ${e(site.facultyRole)}</p></div><div class="footer-links"><a href="/research/">Research</a><a href="/people/">People</a><a href="/publication/">Publications</a><a href="/cv/">Curriculum vitae</a></div></div><div class="footer-bottom"><span>Data Science Lab <span aria-hidden="true">&middot;</span> ${e(site.institution)}</span><a href="#main">Back to top <span aria-hidden="true">&#8593;</span></a></div></footer>
</body></html>`;
}
