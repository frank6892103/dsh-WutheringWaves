import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { GITHUB_REPOSITORY, collectionTag } from './release-meta.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releaseDir = join(repoRoot, 'release');
const args = new Set(process.argv.slice(2));
const skipPack = args.has('--skip-pack');
const draft = args.has('--draft');

const run = (command, commandArgs, cwd = repoRoot, shell = false) => {
  const result = spawnSync(command, commandArgs, { cwd, stdio: 'inherit', shell });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${commandArgs.join(' ')} exited with ${result.status}`);
};

if (!skipPack) {
  run(process.execPath, ['scripts/release-themes.mjs']);
}

const rootPackage = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8'));
const tag = collectionTag(rootPackage.version);
const notesPath = join(releaseDir, 'RELEASE-NOTES.md');
await stat(notesPath);

const names = await readdir(releaseDir);
const assets = names
  .filter((name) => name.endsWith('.tgz') || name === 'THEME-SHA256SUMS.txt' || name === 'theme-release.json' || name === 'INSTALL-THEMES.md')
  .map((name) => join(releaseDir, name));

if (assets.filter((path) => path.endsWith('.tgz')).length < 12) {
  throw new Error('Expected versioned and latest-alias tarballs in release/ before creating a GitHub Release');
}

const gh = process.platform === 'win32' ? 'gh.cmd' : 'gh';
const createArgs = [
  'release',
  'create',
  tag,
  ...assets,
  '--repo',
  GITHUB_REPOSITORY,
  '--title',
  tag,
  '--notes-file',
  notesPath,
];
if (draft) createArgs.push('--draft');

run(gh, createArgs, repoRoot, process.platform === 'win32');
console.log(`GitHub Release ${tag} created for ${GITHUB_REPOSITORY}`);
