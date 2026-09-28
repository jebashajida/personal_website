/** Optional build-time public repository refresh. Does not publish anything. */
import { writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchPublicRepositories } from '../src/github-model.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'public', 'github-projects.json');
try {
  const snapshot = await fetchPublicRepositories({
    signal: AbortSignal.timeout(20000), token: process.env.GITHUB_TOKEN || '',
  });
  await writeFile(`${destination}.tmp`, `${JSON.stringify(snapshot, null, 2)}\n`);
  await rename(`${destination}.tmp`, destination);
  console.log(`Saved ${snapshot.repositories.length} public repositories${snapshot.complete ? '' : ' (partial list)'}.`);
} catch (error) {
  // An API outage must not erase previously reviewed content or block Pages.
  console.warn(`GitHub refresh skipped: ${error.message}. Existing snapshot kept.`);
  if (process.argv.includes('--strict')) process.exitCode = 1;
}
