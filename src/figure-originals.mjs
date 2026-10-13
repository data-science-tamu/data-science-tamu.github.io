import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { dimensions } from "./helpers.mjs";

// Optional higher-resolution counterparts; captured previews are never replaced.
export function validateFigureOriginals(entries, publicRoot, knownFigures) {
  const invalid = (reason) => { throw new Error("Invalid figure originals: " + reason); };
  if (!Array.isArray(entries)) invalid("catalog must be an array");
  const known = new Set(knownFigures), originals = new Map();
  for (const item of entries) {
    if (!item || !known.has(item.preview) || originals.has(item.preview))
      invalid("unknown or duplicate preview");
    if (typeof item.original !== "string" ||
        !/^\/assets\/images\/originals\/[a-zA-Z0-9_-]+\.(png|jpg)$/.test(item.original))
      invalid("original must be a local original-image path");
    if (!Number.isInteger(item.width) || !Number.isInteger(item.height) ||
        item.width <= 0 || item.height <= 0 || !/^[a-f0-9]{64}$/.test(item.sha256))
      invalid("missing dimensions or SHA-256");
    try {
      const file = path.join(publicRoot, item.original);
      const actual = dimensions(file), preview = dimensions(path.join(publicRoot, item.preview));
      if (actual.width !== item.width || actual.height !== item.height ||
          actual.width <= preview.width || actual.height < preview.height)
        invalid("source dimensions do not match a larger image");
      if (Math.abs(actual.width / actual.height - preview.width / preview.height) > 0.01)
        invalid("source aspect ratio differs from preview");
      if (createHash("sha256").update(fs.readFileSync(file)).digest("hex") !== item.sha256)
        invalid("source hash mismatch");
    } catch (error) {
      invalid(error.message);
    }
    originals.set(item.preview, item.original);
  }
  return originals;
}
