import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'pages-export');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) {
  throw new Error('Expected a GitHub Pages repository path, such as /my-portfolio.');
}

// Next prefixes routes and framework assets. Its public/ URLs are authored as
// root-relative strings, including SVG images and preloaded illustration layers.
// Prefix only those references in the export; local preview source stays intact.
const publicReference = /(?<![\w./:-])\/(?:assets\/|fonts\/|audio\/|(?:favicon|file|globe|window)\.svg\b)/g;
const textFiles = new Set(['.html', '.js', '.css', '.txt', '.json']);
let updated = 0;
async function prepare(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await prepare(filename);
    } else if (basePath && textFiles.has(path.extname(filename))) {
      const original = await readFile(filename, 'utf8');
      const patched = original.replace(publicReference, match => `${basePath}${match}`);
      if (patched !== original) {
        await writeFile(filename, patched);
        updated++;
      }
    }
  }
}
await prepare(output);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`GitHub Pages export ready: ${basePath || '/'} (${updated} text files updated)`);
