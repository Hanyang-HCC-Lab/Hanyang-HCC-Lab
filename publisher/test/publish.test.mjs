import assert from "node:assert/strict";
import test from "node:test";
import { getUploadTarget } from "../src/publish.mjs";

test("member photo uploads stay in the dedicated member prefix", () => {
  process.env.MEMBER_ASSETS_BUCKET = "hyhccl";
  const target = getUploadTarget({ kind: "member-image", filename: "Kim photo.png" });
  assert.equal(target.bucket, "hyhccl");
  assert.match(target.key, /^image\/members\/\d{17}-Kim photo\.png$/);
  assert.equal(target.contentType, "image/png");
  assert.match(target.publicUrl, /^https:\/\/hyhccl\.s3\.ap-northeast-2\.amazonaws\.com\/image\/members\//);
});

test("publication PDFs use the selected year and reject other file types", () => {
  process.env.PUBLICATION_ASSETS_BUCKET = "astlyi";
  const target = getUploadTarget({ kind: "publication", filename: "TRIPLE.pdf", year: 2026 });
  assert.match(target.key, /^2026\/\d{17}-TRIPLE\.pdf$/);
  assert.equal(target.contentType, "application/pdf");
  assert.throws(() => getUploadTarget({ kind: "publication", filename: "TRIPLE.docx", year: 2026 }), /PDF/);
});

test("gallery uses path-style public URLs for the dotted website bucket", () => {
  process.env.WEBSITE_ASSETS_BUCKET = "hcc.hanyang.ac.kr";
  const target = getUploadTarget({ kind: "gallery", filename: "Lab day.webp" });
  assert.match(target.key, /^image\/gallery\/\d{17}-Lab day\.webp$/);
  assert.match(target.publicUrl, /^https:\/\/s3\.ap-northeast-2\.amazonaws\.com\/hcc\.hanyang\.ac\.kr\/image\/gallery\//);
});
