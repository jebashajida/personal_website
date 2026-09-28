import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { profile, experience, projects, research } from '../src/data.js';
import { normalizeRepository, normalizeRepositories, fetchPublicRepositories } from '../src/github-model.js';
import { safeURL } from '../src/utils.js';
import { createStaticServer } from '../scripts/serve.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = (name = 'example', extra = {}) => ({
  name, html_url: `https://github.com/jebashajida/${name}`, description: 'A repository description.',
  homepage: '', language: 'JavaScript', private: false, fork: false, ...extra,
});

test('final CV is canonical and all compatibility downloads have identical bytes', async () => {
  assert.equal(profile.resumeFile, 'Jeba_Shajida_CV_Final.pdf');
  const latest = await fs.readFile(new URL('../public/Jeba_Shajida_CV_Final.pdf', import.meta.url));
  const alias = await fs.readFile(new URL('../public/Jeba-Shajida-CV.pdf', import.meta.url));
  assert.deepEqual(latest, alias);
  assert.equal(latest.subarray(0, 5).toString(), '%PDF-');
});
test('headline and experience match the final CV instead of older dates', () => {
  assert.equal(profile.headline, 'Frontend developer & interactive 3D developer');
  assert.equal(experience.length, 2);
  assert.equal(experience[0].role, 'Software Development Research Assistant');
  assert.equal(experience[0].period, 'June 2026 - September 2026');
  assert.equal(experience[1].organization, 'Bisorgo');
  assert.equal(experience[1].period, 'February 2026 - May 2026');
});
test('all five final CV projects are present without guessed deployment links', () => {
  for (const id of ['heks-dashboard', 'steadystep', 'city-landscape', 'animal-classification', 'student-classification']) {
    const project = projects.find(project => project.id === id);
    assert.ok(project); assert.equal(project.live, '');
  }
  assert.equal(projects.length, 9);
  assert.equal(research.length, 4);
});
test('approved avatar variants are real local WebP assets', async () => {
  for (const size of [640, 1024, 1254]) {
    const bytes = await fs.readFile(new URL(`../public/jeba-avatar-${size}.webp`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
    assert.ok(bytes.length > 10000);
  }
});
test('no-JavaScript CV link and metadata use the final CV identity', async () => {
  const html = await fs.readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /public\/Jeba_Shajida_CV_Final\.pdf/);
  assert.doesNotMatch(html, /public\/Jeba-Shajida-CV\.pdf/);
  assert.match(html, /Frontend &amp; Interactive 3D Developer/);
});
test('saved repository selection is honestly partial and validates', async () => {
  const snapshot = JSON.parse(await fs.readFile(new URL('../public/github-projects.json', import.meta.url), 'utf8'));
  assert.equal(snapshot.username, 'jebashajida');
  assert.ok(Array.isArray(snapshot.repositories));
  assert.equal(normalizeRepositories(snapshot.repositories).length, snapshot.repositories.length);
  if (snapshot.source === 'reviewed-selection') assert.equal(snapshot.complete, false);
});
test('repository normalizer rejects foreign, private, forked, and unsafe sources', () => {
  assert.ok(normalizeRepository(fixture()));
  for (const extra of [{ private: true }, { fork: true }, { html_url: 'https://example.com/jebashajida/example' }, { html_url: 'https://github.com/someone/example' }, { html_url: 'javascript:alert(1)' }, { html_url: 'https://user:secret@github.com/jebashajida/example' }]) assert.equal(normalizeRepository(fixture('example', extra)), null);
  assert.equal(normalizeRepository(null), null);
});
test('repository metadata has safe dates, websites, and raw text only', () => {
  const result = normalizeRepository(fixture('example', { updated_at: 'not a date', homepage: 'javascript:alert(1)', description: '<img src=x>' }));
  assert.equal(result.updated_at, null); assert.equal(result.homepage, '');
  assert.equal(result.description, '<img src=x>'); // Escaped by the rendering layer.
});
test('repository normalization deduplicates and sorts new updates first', () => {
  const result = normalizeRepositories([
    fixture('old', { updated_at: '2025-01-01' }), fixture('new', { updated_at: '2026-09-28' }), fixture('old', { updated_at: '2025-01-01' }),
  ]);
  assert.deepEqual(result.map(r => r.name), ['new', 'old']);
});
test('malformed API list shape is rejected, not interpreted as no projects', () => {
  assert.throws(() => normalizeRepositories({ message: 'denied' }), /repository list/);
});
test('GitHub fetch follows actual pagination and emits a complete snapshot', async () => {
  const calls = [];
  const result = await fetchPublicRepositories({ fetchImpl: async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify([fixture(calls.length === 1 ? 'one' : 'two')]), { status: 200, headers: calls.length === 1 ? { link: '<https://api.github.com/next>; rel="next"' } : {} });
  } });
  assert.equal(calls.length, 2); assert.equal(result.complete, true); assert.equal(result.repositories.length, 2);
  assert.ok(calls[1].url.includes('page=2'));
  assert.equal(calls[0].options.credentials, 'omit');
  assert.equal(calls[0].options.headers.Authorization, undefined);
});
test('pagination cap is explicit rather than claiming all projects were read', async () => {
  const result = await fetchPublicRepositories({ maxPages: 1, fetchImpl: async () => new Response(JSON.stringify([fixture()]), { headers: { link: '<https://api.github.com/next>; rel="next"' } }) });
  assert.equal(result.complete, false);
});
test('GitHub rate limits produce actionable errors', async () => {
  for (const status of [403, 429]) await assert.rejects(fetchPublicRepositories({ fetchImpl: async () => new Response('{}', { status }) }), /limit reached/);
});
test('GitHub network and invalid-response failures are not reported as success', async () => {
  await assert.rejects(fetchPublicRepositories({ fetchImpl: async () => { throw new Error('offline'); } }), /offline/);
  await assert.rejects(fetchPublicRepositories({ fetchImpl: async () => new Response('{}') }), /repository list/);
});
test('unsafe URL credentials are refused as well as non-HTTPS links', () => {
  assert.equal(safeURL('https://person:secret@example.com'), '');
  assert.equal(safeURL('https://example.com'), 'https://example.com/');
});
test('server serves all final CV, avatar, and snapshot assets from a Pages subpath', async () => {
  const server = createStaticServer(root, '/portfolio/');
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const origin = `http://127.0.0.1:${server.address().port}/portfolio/`;
    for (const [name, type] of [['Jeba_Shajida_CV_Final.pdf', 'application/pdf'], ['jeba-avatar-640.webp', 'image/webp'], ['jeba-avatar-1254.webp', 'image/webp'], ['github-projects.json', 'application/json']]) {
      const response = await fetch(`${origin}public/${name}`);
      assert.equal(response.status, 200); assert.ok(response.headers.get('content-type').startsWith(type));
      await response.arrayBuffer();
    }
    const home = await fetch(origin);
    assert.ok(home.headers.get('content-security-policy').includes('https://api.github.com'));
    await home.text();
  } finally { await new Promise(resolve => server.close(resolve)); }
});
