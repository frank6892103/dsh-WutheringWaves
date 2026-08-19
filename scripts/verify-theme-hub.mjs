import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';

const runtime = await readFile(resolve(import.meta.dirname, '..', 'shared', 'theme-hub-runtime.js'), 'utf8');
assert.match(runtime, /\.dsh-theme-hub \{[^}]*bottom: 60px;/, 'desktop selector should clear bottom HUD decorations');
assert.match(runtime, /@media \(max-width: 900px\)[^{]*\{[^}]*\.dsh-theme-hub \{[^}]*bottom: 18px;/, 'compact layouts should recover vertical space');
const stored = new Map();
const errors = [];
class FakeCustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = init?.detail;
  }
}

const window = {
  CustomEvent: FakeCustomEvent,
  console: { error: (...args) => errors.push(args) },
  dispatchEvent: () => {},
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
  },
  setTimeout: (callback) => { callback(); return 1; },
};
const context = vm.createContext({
  CustomEvent: FakeCustomEvent,
  Date,
  console,
  decodeURIComponent,
  document: { body: null, cookie: '', head: null },
  encodeURIComponent,
  Map,
  Object,
  Set,
  String,
  TypeError,
  Error,
  window,
});
vm.runInContext(`${runtime}\nglobalThis.__testHub = getWutheringThemeHub();`, context);
const hub = context.__testHub;

let alphaMounts = 0;
let alphaCleanups = 0;
const unregisterAlpha = hub.register({
  id: 'alpha',
  name: 'Alpha',
  mount: () => {
    alphaMounts += 1;
    return () => { alphaCleanups += 1; };
  },
});
const unregisterBroken = hub.register({
  id: 'broken',
  name: 'Broken',
  mount: () => { throw new Error('expected mount failure'); },
});

hub.setActive('alpha');
assert.equal(hub.getActive(), 'alpha');
assert.equal(alphaMounts, 1);
assert.equal(stored.get(hub.storageKey), 'alpha');

hub.setActive('broken');
assert.equal(hub.getActive(), 'alpha', 'a failed switch must restore the previous theme');
assert.equal(alphaCleanups, 1, 'the old theme is cleaned before switching');
assert.equal(alphaMounts, 2, 'the old theme is remounted after the new theme fails');
assert.equal(errors.length, 1, 'the failure should be reported once');

hub.setActive('official');
assert.equal(hub.getActive(), 'official');
assert.equal(alphaCleanups, 2);
assert.equal(stored.get(hub.storageKey), 'official');

unregisterBroken();
unregisterAlpha();
assert.equal(window.__DSH_WUTHERING_THEME_HUB__, undefined, 'the global hub is removed with its last theme');
console.log('Verified theme hub: persistence, exclusivity, rollback, official cleanup');
