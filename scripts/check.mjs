import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let count = 0;
for (const directory of ['src', 'scripts', 'tests']) {
  for (const name of await fs.readdir(path.join(root, directory))) {
    if (!/\.(?:js|mjs)$/.test(name)) continue;
    const result = spawnSync(process.execPath, ['--check', path.join(root, directory, name)], { stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status || 1);
    count += 1;
  }
}
console.log(`Syntax check passed for ${count} JavaScript modules.`);
