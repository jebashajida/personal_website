/** Small dependency-free HTTP server for local development and preview. */
import http from 'node:http';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.pdf':'application/pdf', '.ico':'image/x-icon', '.txt':'text/plain; charset=utf-8' };
export function createStaticServer(rootDirectory, basePath = '/') {
  const root = path.resolve(rootDirectory);
  const base = `/${basePath.split('/').filter(Boolean).join('/')}${basePath.split('/').filter(Boolean).length ? '/' : ''}`;
  return http.createServer(async (req, res) => {
    const finish = (code, message) => { res.writeHead(code, { 'Content-Type':'text/plain; charset=utf-8' }); res.end(message); };
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); finish(405, 'Method not allowed'); return; }
    try {
      let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (!pathname.startsWith(base) || pathname.includes('\0') || pathname.includes('\\')) { finish(404, 'Not found'); return; }
      pathname = pathname.slice(base.length);
      const relative = pathname || 'index.html';
      // Do not expose source-control files, scripts, tests, credentials or docs.
      if (!/^(index\.html|src\/[\w./-]+|public\/[\w./ -]+)$/.test(relative) || relative.split('/').some(segment => segment.startsWith('.'))) { finish(404, 'Not found'); return; }
      const file = path.resolve(root, relative);
      if (!file.startsWith(root + path.sep)) { finish(403, 'Forbidden'); return; }
      const real = await fs.realpath(file);
      if (!real.startsWith(await fs.realpath(root) + path.sep)) { finish(403, 'Forbidden'); return; }
      const stat = await fs.stat(real);
      if (!stat.isFile()) { finish(404, 'Not found'); return; }
      const type = types[path.extname(real).toLowerCase()];
      if (!type) { finish(404, 'Not found'); return; }
      res.writeHead(200, {
        'Content-Type': type, 'Content-Length': stat.size, 'Cache-Control':'no-cache',
        'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      });
      if (req.method === 'HEAD') { res.end(); return; }
      const stream = createReadStream(real);
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch (error) {
      if (error instanceof URIError || error instanceof TypeError) { finish(400, 'Bad request'); return; }
      finish(error.code === 'ENOENT' ? 404 : 500, error.code === 'ENOENT' ? 'Not found' : 'Unable to serve file');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const argumentsList = process.argv.slice(2);
  const option = (name, fallback) => { const index = argumentsList.indexOf(name); return index >= 0 ? argumentsList[index + 1] : fallback; };
  const port = Number(option('--port', process.env.PORT || 5173));
  const directory = path.resolve(projectRoot, option('--dir', '.'));
  const host = option('--host', '127.0.0.1');
  const base = option('--base', '/');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Choose a port between 1 and 65535.');
  const server = createStaticServer(directory, base);
  server.on('error', error => { console.error(`Could not start: ${error.message}. Try --port 5174.`); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`\n  Jeba Shajida / portfolio\n  http://${host}:${port}${base}\n  Serving ${directory}\n  Press Ctrl+C to stop.\n`));
  for (const name of ['SIGINT', 'SIGTERM']) process.on(name, () => server.close(() => process.exit(0)));
}
