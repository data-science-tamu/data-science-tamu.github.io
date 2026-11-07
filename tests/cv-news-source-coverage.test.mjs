import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { createPages } from "../src/templates.mjs";
import { imageRenderer } from "../src/helpers.mjs";
import { assertSourceCoverage } from "./source-coverage.mjs";

const root = path.resolve(import.meta.dirname,"..");
const read = file => JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));

test("all 243 substantive captured paragraphs retain source coverage through exact approved replacements",()=>{
  const lab=read("content/lab.json");
  const pages=createPages(read("content/site.json"),lab,imageRenderer(path.join(root,"public")));
  assertSourceCoverage(lab,route=>"<main>"+pages.find(page=>page.route===route).body+"</main>");
});
