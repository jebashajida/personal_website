import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { clamp, escapeHTML, safeURL, filterProjects, nextTankLevel, alarmState, generateStudy } from '../src/utils.js';
import { profile, projects, research, skillGroups } from '../src/data.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
test('profile uses the supplied CV identity and GitHub profile', () => {
  assert.equal(profile.name, 'Jeba Shajida');
  assert.equal(profile.socials.github, 'https://github.com/jebashajida');
  assert.equal(profile.socials.linkedin, 'https://www.linkedin.com/in/jeba-shajida-1253823b2/');
  assert.equal(profile.email, 'jeba.18feb@gmail.com');
});
test('all project IDs and project numbers are unique', () => {
  assert.ok(projects.length > 0);
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length);
  assert.equal(new Set(projects.map(p => p.number)).size, projects.length);
});
test('project notes and descriptions exist and external links use HTTPS', () => {
  for (const p of projects) {
    assert.ok(p.description.length > 40); assert.ok(p.sourceNote);
    for (const key of ['github', 'preview', 'live']) if (p[key]) assert.ok(safeURL(p[key]));
  }
});
test('live links can be added without breaking deployment checks', () => {
  for (const project of projects) {
    if (project.live) assert.ok(safeURL(project.live), 'Use a verified HTTPS deployment URL.');
    if (project.preview) assert.ok(safeURL(project.preview));
  }
});
test('filters return the expected categories without mutating data', () => {
  assert.equal(filterProjects(projects, 'all').length, projects.length);
  for (const category of ['software', 'graphics', 'ml']) {
    assert.deepEqual(filterProjects(projects, category), projects.filter(p => p.category === category));
  }
  assert.equal(filterProjects(projects, 'missing').length, 0);
});
test('HTML escaping neutralizes injected markup', () => {
  assert.equal(escapeHTML('<script>"&\'</script>'), '&lt;script&gt;&quot;&amp;&#39;&lt;/script&gt;');
});
test('unsafe and malformed URL schemes are rejected', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'http://example.com', '/local', 'bad', '']) assert.equal(safeURL(url), '');
  assert.equal(safeURL('https://github.com/jebashajida'), 'https://github.com/jebashajida');
});
test('tank simulation cannot overflow or underflow', () => {
  assert.equal(nextTankLevel(99, true, 20), 100);
  assert.equal(nextTankLevel(1, false, 20), 0);
  assert.equal(nextTankLevel(50, true, .5), 52.5);
  assert.equal(nextTankLevel(50, true, -1), 50);
  assert.equal(clamp(101, 0, 100), 100);
});
test('alarm thresholds include the boundary values', () => {
  assert.equal(alarmState(15), 'Low level'); assert.equal(alarmState(16), 'Normal');
  assert.equal(alarmState(84), 'Normal'); assert.equal(alarmState(85), 'High level');
});
test('generative artwork is deterministic and bounded', () => {
  assert.deepEqual(generateStudy(7, 18), generateStudy(7, 18));
  assert.notDeepEqual(generateStudy(7, 18), generateStudy(8, 18));
  assert.equal(generateStudy(7, -100).length, 6); assert.equal(generateStudy(7, 100).length, 28);
});
test('all relative source-module imports resolve', async () => {
  for (const name of await fs.readdir(path.join(root, 'src'))) {
    if (!name.endsWith('.js')) continue;
    const source = await fs.readFile(path.join(root, 'src', name), 'utf8');
    for (const match of source.matchAll(/from\s+['"](\.\/?[^'"]+)['"]/g)) await fs.stat(path.resolve(root, 'src', match[1]));
  }
});
test('CV download contains a real PDF and required portfolio sections exist', async () => {
  const pdf = await fs.readFile(path.join(root, 'public', profile.resumeFile));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.equal(research.length, 4); assert.equal(skillGroups.length, 3);
  const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /name="viewport"/); assert.match(html, /type="module"/); assert.match(html, /<noscript>/);
});
