import assert from "node:assert/strict";
import test from "node:test";
import { editorialPosts, editorialReleases } from "../lib/releases/catalog.mjs";
import {
  privateReleaseViews,
  publicReleaseView,
  releaseArticles,
  releaseCenter,
} from "../lib/releases/model.mjs";
import { supporterTierNames } from "../lib/early-access/presentation.mjs";

test("all release views agree on owner-confirmed versions without invented dates", () => {
  const center = releaseCenter(editorialReleases);
  assert.equal(center.current.version, "0.4beta");
  assert.equal(center.next.version, "0.4");
  assert.equal(center.current.public_release_at, null);
  assert.equal(center.next.public_release_at, null);
  assert.deepEqual(center.current.public_download_urls, []);
  assert.equal(center.previous[0].version, "0.2b");
  assert.deepEqual(
    center.previous[0].public_download_urls.map((item) => item.platform),
    ["Windows", "macOS", "Android"],
  );
});
test("public projection never leaks storage paths, secrets or private download URLs", () => {
  const view = publicReleaseView({
    id: "release",
    release_type: "early_access",
    is_published: true,
    storage_bucket: "early-access-builds",
    object_path: "secret-build.zip",
    private_storage_paths: ["secret-build.zip"],
    public_download_urls: [{ url: "https://example.test/private.zip" }],
    access_token: "private-token",
    allowed_tier_ids: ["tier"],
  });
  assert.deepEqual(view.public_download_urls, []);
  assert.equal(JSON.stringify(view).includes("secret-build"), false);
  for (const key of [
    "storage_bucket",
    "object_path",
    "private_storage_paths",
    "allowed_tier_ids",
    "access_token",
  ])
    assert.equal(Object.hasOwn(view, key), false);
});
test("unpublished public links and unsafe URL schemes are excluded", () => {
  const release = {
    release_type: "public",
    is_published: true,
    public_download_urls: [
      { platform: "Windows", url: "javascript:alert(1)" },
      {
        platform: "Android",
        url: "https://example.test/game.apk",
        secret: "never-client",
      },
      { platform: "macOS", url: "http://example.test/game.zip" },
    ],
  };
  assert.deepEqual(publicReleaseView(release).public_download_urls, [
    {
      platform: "Android",
      url: "https://example.test/game.apk",
      size: undefined,
    },
  ]);
  assert.deepEqual(
    publicReleaseView({ ...release, is_published: false }).public_download_urls,
    [],
  );
});
test("private metadata excludes drafts, wrong buckets, unknown platforms and invalid unlock dates", () => {
  const row = {
    id: "build",
    version: "example-test",
    platform: "windows",
    storage_bucket: "early-access-builds",
    unlock_at: "2030-01-01T00:00:00Z",
    is_published: true,
    object_path: "secret.zip",
  };
  const views = privateReleaseViews([
    row,
    { ...row, is_published: false },
    { ...row, storage_bucket: "public" },
    { ...row, platform: "unverified" },
    { ...row, unlock_at: "invalid" },
  ]);
  assert.equal(views.length, 1);
  assert.deepEqual(views[0].platforms, ["Windows"]);
  assert.equal(views[0].early_access_at, row.unlock_at);
  assert.equal(JSON.stringify(views).includes("secret.zip"), false);
});
test("empty and unavailable release sources do not fabricate supporter builds", () => {
  const center = releaseCenter([], [], "error");
  assert.equal(center.current, null);
  assert.equal(center.next, null);
  assert.deepEqual(center.early, []);
  assert.equal(center.availability, "error");
});
test("devlog is empty until a dated, confirmed publication or real changelog exists", () => {
  assert.deepEqual(editorialPosts, []);
  assert.deepEqual(releaseArticles(editorialReleases), []);
  const sample = {
    version: "test-only",
    release_type: "public",
    is_published: true,
    public_release_at: "2030-01-01T00:00:00Z",
    changelog: { Story: ["Test release note"] },
  };
  assert.equal(releaseArticles([sample]).length, 1);
  assert.deepEqual(
    releaseArticles([{ ...sample, public_release_at: null }]),
    [],
  );
  assert.deepEqual(
    releaseArticles([{ ...sample, release_type: "early_access" }]),
    [],
  );
});
test("tier names are display-only and require a verified active, allowed identity", () => {
  const allowed = ["29743574"];
  assert.deepEqual(
    supporterTierNames(
      {
        active: true,
        tierIds: ["29743574", "29743574", "29743581", "untrusted"],
      },
      allowed,
    ),
    ["Resonance Adept"],
  );
  assert.deepEqual(
    supporterTierNames({ active: false, tierIds: allowed }, allowed),
    [],
  );
  assert.deepEqual(
    supporterTierNames({ active: true, tierIds: [] }, allowed),
    [],
  );
});
