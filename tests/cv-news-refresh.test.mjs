import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createPages } from "../src/templates.mjs";
import { dimensions, imageRenderer, rich } from "../src/helpers.mjs";
import { refresh, normalizeRefreshForBaseline } from "./refresh-expectations.mjs";

const root = path.resolve(import.meta.dirname, "..");
const lab = JSON.parse(fs.readFileSync(path.join(root,"content/lab.json"),"utf8"));
const sha256 = value => createHash("sha256").update(value).digest("hex");
const plain = html => html.replace(/<[^>]*>/g, "").replaceAll("&amp;","&").replaceAll("&gt;",">").replaceAll("&lt;","<").replaceAll("&nbsp;"," ").replace(/\s+/g," ").trim();
const actualPath = keys => keys[0] === "news" && keys[1] >= refresh.newsAddition.index
  ? [keys[0],keys[1]+1,...keys.slice(2)] : keys;
function leaves(value, keys = []) {
  return value && typeof value === "object"
    ? Object.entries(value).flatMap(([key,item]) => leaves(item,[...keys,key]))
    : [{keys,value}];
}
function changeAt(data, keys, value) {
  const parent = keys.slice(0,-1).reduce((item,key) => item[key],data);
  parent[keys.at(-1)] = value;
}

test("the exact approved CV, people and News delta preserves every unrelated content field", () => {
  const before = structuredClone(lab);
  normalizeRefreshForBaseline(lab);
  assert.deepEqual(lab,before,"Preservation comparisons do not mutate maintained content");
  assert.equal(lab.news.length,17);
  assert.deepEqual(lab.faculty.interests.map(item=>item.text),[
    "Domain-informed statistical machine learning and uncertainty quantification",
    "Bayesian modeling, uncertainty quantification, and data-driven decision-making",
    "Digital twins and predictive analytics for advanced manufacturing and healthcare",
  ]);
});

test("every approved changed value, including all funding fields and URLs, rejects mutation or omission", () => {
  normalizeRefreshForBaseline(lab);
  for (const change of refresh.changes) {
    const keys = actualPath(change.path);
    for (const leaf of leaves(change.after)) {
      const data = structuredClone(lab), target = [...keys,...leaf.keys];
      changeAt(data,target,String(leaf.value)+" UNAPPROVED");
      assert.throws(()=>normalizeRefreshForBaseline(data),target.join("."));
    }
    const data = structuredClone(lab);
    const parent = keys.slice(0,-1).reduce((item,key)=>item[key],data);
    delete parent[keys.at(-1)];
    assert.throws(()=>normalizeRefreshForBaseline(data),keys.join(".")+" missing");
    if (Array.isArray(change.after) && change.after.length > 1) {
      const reordered = structuredClone(lab);
      changeAt(reordered, keys, [...change.after].reverse());
      assert.throws(()=>normalizeRefreshForBaseline(reordered),keys.join(".")+" reordered");
    }
  }
  for (const leaf of leaves(refresh.newsAddition.record)) {
    const data = structuredClone(lab), target = ["news",refresh.newsAddition.index,...leaf.keys];
    changeAt(data,target,String(leaf.value)+" UNAPPROVED");
    assert.throws(()=>normalizeRefreshForBaseline(data),target.join("."));
  }
});

test("the refresh guard rejects unrelated research/publication changes, extra claims and historical reordering", () => {
  normalizeRefreshForBaseline(lab);
  const mutations = [
    data=>{data.research.theme.title += " Changed";},
    data=>{data.projects[0].title += " Changed";},
    data=>{data.publications[0].title += " Changed";},
    data=>{data.publications[0].status = "under-review";},
    data=>{data.faculty.bio[0].text += " Changed";},
    data=>{data.people.current[0].education[0].dates = "2023–2027";},
    data=>{data.people.photos.reverse();},
    data=>{data.news[2].images.push("/assets/images/qsr-2026-acknowledgement.jpg");},
    data=>{data.faculty.funding.items[0].invented = "claim";},
    data=>{data.people.current[0].links.push({label:"Unknown",href:"https://example.invalid/"});},
    data=>{data.news.splice(2,0,structuredClone(data.news[2]));},
    data=>{data.news.splice(2,1);},
    data=>{data.news.push(...data.news.splice(-2,1));},
    data=>{data.news.find(item=>item.date === "2025").date="2025.10.16";},
  ];
  for (const mutate of mutations) {
    const data = structuredClone(lab);
    mutate(data);
    assert.throws(()=>normalizeRefreshForBaseline(data));
  }
});

test("rich content keeps exact text/HTML parity and ordinary verified links", () => {
  normalizeRefreshForBaseline(lab);
  for(const item of [...lab.news,...lab.faculty.awards,...lab.faculty.courses,...lab.faculty.interests]) {
    assert.equal(plain(rich(item.html)),item.text);
  }
  const webinar = lab.news.find(item=>item.date==="2026.10.21");
  assert.doesNotMatch(webinar.html,/View the webinar flyer|flyer\.jpg/);
  const grants = lab.news[2];
  assert.deepEqual(grants.images,[]);
  assert.doesNotMatch(grants.html,/<(?:iframe|embed|object)|all projects.*underway|personal funding/i);
  assert.match(grants.text,/approximately \$1\.94 million in project funding/);
  const amounts = lab.faculty.funding.items.map(item=>Number(item.amount.match(/Project total: \$([\d,]+)/)[1].replaceAll(",","")));
  assert.equal(amounts.slice(0,3).reduce((a,b)=>a+b),1935591);
  assert.equal(amounts.reduce((a,b)=>a+b),3077219);
  assert.equal(amounts.filter((_,index)=>![4,6].includes(index)).reduce((a,b)=>a+b),2955591);
  assert.equal(lab.faculty.funding.items[1].period,"06/2027–05/2030");
  assert.equal(lab.faculty.service.length,7);
});

for(const photo of refresh.photos) {
  test(photo.src+" is the exact unprocessed source JPEG",()=>{
    const file=path.join(root,"public",photo.src);
    assert.ok(fs.existsSync(file),"Approved Sina source photo is copied to its public path");
    const bytes=fs.readFileSync(file);
    assert.equal(bytes.length,photo.bytes);
    assert.equal(sha256(bytes),photo.sha256);
    assert.deepEqual(dimensions(file),{width:photo.width,height:photo.height});
  });
}

test("News renders the exact combined grant entry and finalist photos in approved order without embeds",()=>{
  normalizeRefreshForBaseline(lab);
  const pages=createPages(JSON.parse(fs.readFileSync(path.join(root,"content/site.json"),"utf8")),lab,imageRenderer(path.join(root,"public")));
  for(const route of ["/","/news/"]) {
    const body=pages.find(page=>page.route===route).body;
    const articles=[...body.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match=>match[0]);
    assert.equal(articles.length,route==="/"?3:17);
    assert.ok(articles[2].includes("<p>"+refresh.newsAddition.record.html+"</p>"));
    assert.match(articles[2],/<time datetime="2026-09-04">2026\.09\.04<\/time>/);
    assert.doesNotMatch(body,/<(?:iframe|embed|object)\b/i);
    if(route==="/news/") {
      const sina=articles.find(item=>item.includes('id="news-2025-04-22"'));
      const images=[...sina.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(match=>match[1]);
      assert.deepEqual(images,refresh.photos.map(photo=>photo.src));
      assert.doesNotMatch(sina,/\b(?:winner|won)\b/i);
    }
  }
});
