import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStaticServer } from '../scripts/serve.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function withServer(base, run) {
  const server = createStaticServer(root, base);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try { await run(url); } finally { await new Promise(resolve => server.close(resolve)); }
}
test('server returns HTML, modules, stylesheet, and the CV with correct types', async () => {
  await withServer('/', async url => {
    for (const [file, type] of [['/', 'text/html'], ['/src/site.js', 'text/javascript'], ['/src/styles.css', 'text/css'], ['/public/Jeba-Shajida-CV.pdf', 'application/pdf']]) {
      const response = await fetch(url + file);
      assert.equal(response.status, 200); assert.ok(response.headers.get('content-type').startsWith(type)); await response.arrayBuffer();
    }
  });
});
test('source-control files, development files, traversal and unknown files are blocked', async () => {
  await withServer('/', async url => {
    for (const file of ['/.git/config', '/package.json', '/scripts/serve.mjs', '/.env', '/src/../../../etc/passwd', '/public/missing.png']) {
      const response = await fetch(url + file); assert.ok([403, 404].includes(response.status)); await response.text();
    }
    const response = await fetch(url + '/', { method: 'POST' }); assert.equal(response.status, 405); await response.text();
  });
});
test('subdirectory hosting preserves relative module and asset paths', async () => {
  await withServer('/jeba-portfolio/', async url => {
    assert.equal((await fetch(url + '/jeba-portfolio/')).status, 200);
    assert.equal((await fetch(url + '/jeba-portfolio/src/boot.js')).status, 200);
    assert.equal((await fetch(url + '/jeba-portfolio/public/Jeba-Shajida-CV.pdf')).status, 200);
    assert.equal((await fetch(url + '/')).status, 404);
  });
});
