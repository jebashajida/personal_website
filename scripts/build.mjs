/** The deployable artifact contains only website files, never development files. */
import { cp, mkdir, rm, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'dist');
for (const file of ['index.html', 'src/boot.js', 'src/site.js', 'src/styles.css', 'public/Jeba_Shajida_CV_Final.pdf', 'public/jeba-avatar-1254.webp', 'public/github-projects.json']) await stat(path.join(root, file));
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const file of ['index.html', 'src', 'public']) await cp(path.join(root, file), path.join(target, file), { recursive: true });
await writeFile(path.join(target, '.nojekyll'), '');
console.log('Build complete: dist/ (static HTML, CSS, ES modules and local assets).');
