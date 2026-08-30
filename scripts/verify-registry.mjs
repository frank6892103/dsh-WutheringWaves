import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { GITHUB_REPOSITORY, collectionTag } from './release-meta.mjs';

const repoRoot = resolve(import.meta.dirname, '..');
const rootPackage = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8'));
assert.match(rootPackage.repository.url, new RegExp(GITHUB_REPOSITORY.replaceAll('/', '\\/')));
assert.match(rootPackage.version, /^\d+\.\d+\.\d+$/);
assert.equal(collectionTag(rootPackage.version), `v${rootPackage.version}`);
const registry = JSON.parse(await readFile(join(repoRoot, 'theme-registry.json'), 'utf8'));
const hubRuntime = await readFile(join(repoRoot, 'shared', 'theme-hub-runtime.js'), 'utf8');

assert.equal(registry.schemaVersion, 3);
assert.equal(registry.selector.officialThemeId, 'official');
assert.equal(registry.selector.activation, 'exclusive');
assert.equal(registry.selector.persistence, 'local-storage-with-cookie-fallback');
assert.equal(registry.selector.defaultPerformance, 'economy');
assert.deepEqual(registry.selector.performanceModes, ['economy', 'full']);
assert.equal(registry.selector.previewLoading, 'on-selector-open');
assert.match(hubRuntime, new RegExp(registry.selector.storageKey.replaceAll('.', '\\.')));
assert.match(hubRuntime, new RegExp(registry.selector.performanceStorageKey.replaceAll('.', '\\.')));
assert.ok(hubRuntime.includes(registry.selector.globalApi));
assert.ok(hubRuntime.includes('previousTheme.mount()'), 'switch failures must remount the previous theme');
assert.ok(hubRuntime.includes('activeCleanup();'), 'switches must dispose the active theme');

const ids = new Set();
const packages = new Set();
const bodyAttrs = new Set();
for (const theme of registry.themes) {
  assert.match(theme.id, /^[a-z0-9-]+$/);
  assert.ok(!ids.has(theme.id), `duplicate theme id: ${theme.id}`);
  assert.ok(!packages.has(theme.package), `duplicate theme package: ${theme.package}`);
  assert.ok(!bodyAttrs.has(theme.bodyAttr), `duplicate body attr: ${theme.bodyAttr}`);
  ids.add(theme.id);
  packages.add(theme.package);
  bodyAttrs.add(theme.bodyAttr);

  const [packageJson, skin] = await Promise.all([
    readFile(join(repoRoot, theme.path, 'package.json'), 'utf8').then(JSON.parse),
    readFile(join(repoRoot, theme.path, 'skin.json'), 'utf8').then(JSON.parse),
  ]);
  assert.equal(packageJson.name, theme.package);
  assert.equal(skin.id, theme.id);
  assert.equal(skin.name, theme.name);
  assert.equal(skin.bodyAttr, theme.bodyAttr);
  assert.equal(skin.package, theme.package);
  assert.equal(skin.order, theme.order);
}

assert.ok(registry.themes.length >= 2, 'multi-theme verification requires at least two themes');
console.log(`Verified registry: ${registry.themes.length} themes, exclusive selector ${registry.selector.globalApi}`);
