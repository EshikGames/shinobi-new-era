import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { characters, gallery, faqs } from '../lib/site-content.mjs';
import { editorialReleases, editorialPosts } from '../lib/releases/catalog.mjs';
import { gameLanguages, publicFiles, browserEdition } from '../lib/game-info.mjs';
import { releaseCenter, releaseArticles } from '../lib/releases/model.mjs';

test('public browser Beta and downloads remain separate from planned Act III', () => {
  const center = releaseCenter(editorialReleases);
  assert.match(center.current.description, /Act III is not included/);
  assert.match(center.next.title, /Act III in development/);
  assert.equal(center.next.is_published, false);
  assert.equal(center.next.public_release_at, null);
  assert.deepEqual(center.early, []);
  assert.equal(browserEdition.version, '0.4beta.fix');
  assert.equal(publicFiles.length, 3);
  assert.ok(publicFiles.every(file => file.version === '0.4beta.fix'));
  assert.equal(new Set(gameLanguages).size, 14);
});

test('public cast and gallery reference only existing approved artwork', () => {
  assert.equal(new Set(characters.map(c => c.name)).size, 9);
  assert.ok(characters.every(c => c.description && (!c.image || existsSync(new URL('../public' + c.image, import.meta.url)))));
  assert.equal(characters.filter(c => c.image).length, 7);
  assert.deepEqual(gallery.map(g => g.src), ['/images/hero.jpg', '/images/1.jpg']);
  assert.ok(faqs.some(f => /in-game supporter privileges/.test(f.question) && /in-game gallery/.test(f.answer)));
});

test('official posts retain unique URLs and dates; release notes use the announcement date', () => {
  const posts = [...editorialPosts, ...releaseArticles(editorialReleases)];
  assert.equal(new Set(posts.map(p => p.slug)).size, posts.length);
  assert.equal(new Set(posts.map(p => p.source)).size, posts.length);
  assert.ok(posts.every(p => p.source.startsWith('https://eshik-games.itch.io/shinobi-new-era/devlog/') && Number.isFinite(Date.parse(p.date))));
  assert.equal(posts.find(p => p.slug === 'new-character-art-styles').date.slice(0,10), '2026-11-02');
  assert.equal(releaseArticles(editorialReleases)[0].date, '2026-10-19T01:48:52Z');
});
