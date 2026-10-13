import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
const catalog=JSON.parse(fs.readFileSync(path.join(root,"content/figure-originals.json")));
const lab=JSON.parse(fs.readFileSync(path.join(root,"content/lab.json")));
const figures=[...lab.research.figures.map(f=>f.src),...lab.projects.map(p=>p.image)];
async function validator(){
  assert.ok(fs.existsSync(path.join(root,"src/figure-originals.mjs")),"Original-resolution catalog requires a build-time integrity guard");
  return (await import("../src/figure-originals.mjs")).validateFigureOriginals;
}
test("verified original catalog maps real larger images without changing preview bytes",async()=>{
  const validate=await validator(),map=validate(catalog,path.join(root,"public"),figures);
  assert.equal(map.size,catalog.length);
  for(const item of catalog)assert.equal(map.get(item.preview),item.original);
});
test("original catalog rejects duplicate, unrelated, remote, absent, altered or mislabeled images",async()=>{
  const validate=await validator();
  const mutations=[
    c=>c.push(c[0]),c=>{c[0].preview="/assets/images/unknown.png"},
    c=>{c[0].original="https://example.test/image.png"},
    c=>{c[0].original="/assets/images/../private.png"},
    c=>{c[0].original="/assets/images/originals/missing.png"},
    c=>{c[0].sha256="0".repeat(64)},c=>{c[0].width++},c=>{c[0].height=0},
    c=>{c[0].original=c[0].preview},
  ];
  assert.throws(()=>validate(null,path.join(root,"public"),figures),/Invalid figure originals/);
  for(const mutate of mutations){const c=structuredClone(catalog);mutate(c);assert.throws(()=>validate(c,path.join(root,"public"),figures),/Invalid figure originals/);}
});

test("research links use verified full originals while inline previews remain lightweight",async()=>{
  const validate=await validator();
  const {createPages}=await import("../src/templates.mjs");
  const {imageRenderer}=await import("../src/helpers.mjs");
  const site=JSON.parse(fs.readFileSync(path.join(root,"content/site.json")));
  const map=validate(catalog,path.join(root,"public"),figures);
  const pages=createPages(site,lab,imageRenderer(path.join(root,"public")),map);
  const seen=new Set();
  for(const page of pages.filter(p=>p.route.startsWith("/research/"))){
    for(const [,figure] of page.body.matchAll(/<figure class="scientific-figure">([\s\S]*?)<\/figure>/g)){
      const preview=figure.match(/<img src="([^"]+)"/)[1];
      const original=map.get(preview)||preview;
      const links=[...figure.matchAll(/<a href="([^"]+)"[^>]*data-figure-open/g)].map(m=>m[1]);
      assert.deepEqual(links,[original,original]);
      assert.ok(!preview.includes("/originals/"),"Larger source is only fetched on demand");
      seen.add(preview);
    }
  }
  assert.deepEqual([...seen].sort(), [...figures].sort());
});
