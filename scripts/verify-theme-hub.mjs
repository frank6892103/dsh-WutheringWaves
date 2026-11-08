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
assert.equal(hub.getPerformance(), 'economy', 'cloud-friendly economy mode should be the default');
assert.equal(hub.positionStorageKey, 'dsh.wuthering-waves.theme-hub-position.v1');
assert.equal(hub.getPosition(), null, 'the selector stays at its default corner until the user drags it');
assert.match(runtime, /preview\.dataset\.previewUrl = previewUrl/);
assert.match(runtime, /function hydratePreviews\(\)/);

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

hub.setPerformance('full');
assert.equal(hub.getPerformance(), 'full');
assert.equal(stored.get(hub.performanceStorageKey), 'full');
assert.equal(alphaCleanups, 1, 'changing the profile remounts the active theme');
assert.equal(alphaMounts, 2, 'the remount can create the full-effects DOM');
assert.throws(() => hub.setPerformance('turbo'), /economy.*full/);

hub.setActive('broken');
assert.equal(hub.getActive(), 'alpha', 'a failed switch must restore the previous theme');
assert.equal(alphaCleanups, 2, 'the old theme is cleaned before switching');
assert.equal(alphaMounts, 3, 'the old theme is remounted after the new theme fails');
assert.equal(errors.length, 1, 'the failure should be reported once');

hub.setActive('official');
assert.equal(hub.getActive(), 'official');
assert.equal(alphaCleanups, 3);
assert.equal(stored.get(hub.storageKey), 'official');

unregisterBroken();
unregisterAlpha();
assert.equal(window.__DSH_WUTHERING_THEME_HUB__, undefined, 'the global hub is removed with its last theme');
console.log('Verified theme hub: persistence, exclusivity, rollback, official cleanup');

const positionStored = new Map();
const positionTimers = [];
const positionWindow = {
  CustomEvent: FakeCustomEvent,
  console: { error: () => {} },
  dispatchEvent: () => {},
  innerWidth: 1280,
  innerHeight: 720,
  localStorage: {
    getItem: (key) => positionStored.get(key) ?? null,
    setItem: (key, value) => positionStored.set(key, value),
    removeItem: (key) => positionStored.delete(key),
  },
  setTimeout: (callback) => {
    positionTimers.push(callback);
    return positionTimers.length;
  },
  addEventListener: (type, fn) => {
    positionWindow.listeners[type] = fn;
  },
  removeEventListener: (type, fn) => {
    if (positionWindow.listeners[type] === fn) delete positionWindow.listeners[type];
  },
  listeners: {},
};
function flushPositionTimers() {
  while (positionTimers.length) positionTimers.shift()();
}

function matchesSelector(element, selector) {
  return selector.split(',').some((part) => {
    let rest = part.trim();
    if (!element?.getAttribute) return false;
    if (rest.startsWith('.')) {
      const bracket = rest.indexOf('[');
      const className = bracket === -1 ? rest.slice(1) : rest.slice(1, bracket);
      if (!String(element.className).split(/\s+/).includes(className)) return false;
      rest = bracket === -1 ? '' : rest.slice(bracket);
    }
    if (!rest) return true;
    const attr = rest.match(/^\[([^\]=\s]+)(?:="([^"]*)")?\]$/);
    if (!attr) return false;
    const value = element.getAttribute(attr[1]);
    return attr[2] === undefined ? value != null : value === attr[2];
  });
}

function queryAll(root, selector) {
  const found = [];
  const visit = (node) => {
    if (matchesSelector(node, selector)) found.push(node);
    for (const child of node.children || []) visit(child);
  };
  for (const child of root.children || []) visit(child);
  return found;
}

function createClassList(element) {
  const tokens = () => String(element.className).split(/\s+/).filter(Boolean);
  const write = (names) => { element.className = [...names].join(' '); };
  return {
    add(...names) {
      const next = new Set(tokens());
      names.forEach((name) => next.add(name));
      write(next);
    },
    remove(...names) {
      const drop = new Set(names);
      write(tokens().filter((name) => !drop.has(name)));
    },
    toggle(name, force) {
      const next = new Set(tokens());
      const has = next.has(name);
      const enable = force === undefined ? !has : Boolean(force);
      if (enable) next.add(name);
      else next.delete(name);
      write(next);
      return enable;
    },
  };
}

function createElement() {
  const element = {
    className: '',
    textContent: '',
    hidden: false,
    title: '',
    draggable: false,
    type: '',
    dataset: {},
    style: { setProperty(name, value) { this[name] = value; } },
    children: [],
    parentNode: null,
    attributes: new Map(),
    listeners: new Map(),
    setAttribute(name, value) { this.attributes.set(name, String(value)); },
    getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; },
    removeAttribute(name) { this.attributes.delete(name); },
    append(...nodes) {
      nodes.forEach((node) => {
        node.parentNode = this;
        this.children.push(node);
      });
    },
    replaceChildren(...nodes) {
      this.children.forEach((child) => { child.parentNode = null; });
      this.children = [];
      if (nodes.length) this.append(...nodes);
    },
    remove() {
      this.parentNode?.children?.splice(this.parentNode.children.indexOf(this), 1);
      this.parentNode = null;
    },
    addEventListener(type, fn) {
      const list = this.listeners.get(type) || [];
      list.push(fn);
      this.listeners.set(type, list);
    },
    removeEventListener(type, fn) {
      this.listeners.set(type, (this.listeners.get(type) || []).filter((item) => item !== fn));
    },
    dispatch(type, event) {
      (this.listeners.get(type) || []).forEach((fn) => fn(event));
    },
    focus() {},
    setPointerCapture() {},
    getBoundingClientRect() {
      const left = Number.parseFloat(this.style.left);
      const top = Number.parseFloat(this.style.top);
      const resolvedLeft = Number.isFinite(left) ? left : 1120;
      const resolvedTop = Number.isFinite(top) ? top : 618;
      return {
        left: resolvedLeft,
        top: resolvedTop,
        width: 142,
        height: 42,
        right: resolvedLeft + 142,
        bottom: resolvedTop + 42,
      };
    },
  };
  element.classList = createClassList(element);
  element.closest = (selector) => {
    let current = element;
    while (current) {
      if (matchesSelector(current, selector)) return current;
      current = current.parentNode;
    }
    return null;
  };
  element.querySelector = (selector) => queryAll(element, selector)[0];
  element.querySelectorAll = (selector) => queryAll(element, selector);
  element.contains = (node) => {
    let current = node;
    while (current) {
      if (current === element) return true;
      current = current.parentNode;
    }
    return false;
  };
  return element;
}

function createHost(tag) {
  return {
    tag,
    children: [],
    append(node) {
      node.parentNode = this;
      this.children.push(node);
    },
  };
}

const positionHead = createHost('head');
const positionBody = createHost('body');
const positionDocument = {
  head: positionHead,
  body: positionBody,
  cookie: '',
  documentElement: {
    clientWidth: 1280,
    clientHeight: 720,
    setAttribute() {},
    getAttribute() { return null; },
    removeAttribute() {},
  },
  createElement,
  listeners: new Map(),
  addEventListener(type, fn) {
    const list = this.listeners.get(type) || [];
    list.push(fn);
    this.listeners.set(type, list);
  },
  removeEventListener(type, fn) {
    this.listeners.set(type, (this.listeners.get(type) || []).filter((item) => item !== fn));
  },
  dispatch(type, event) {
    (this.listeners.get(type) || []).forEach((fn) => fn(event));
  },
  querySelectorAll(selector) {
    return [...queryAll(positionHead, selector), ...queryAll(positionBody, selector)];
  },
};

const positionContext = vm.createContext({
  CustomEvent: FakeCustomEvent,
  Date,
  JSON,
  Math,
  Number,
  console,
  decodeURIComponent,
  document: positionDocument,
  encodeURIComponent,
  Map,
  Object,
  Set,
  String,
  TypeError,
  Error,
  window: positionWindow,
});
vm.runInContext(`${runtime}\nglobalThis.__positionHub = getWutheringThemeHub();`, positionContext);
const positionHub = positionContext.__positionHub;
positionStored.set(positionHub.positionStorageKey, '{');
assert.equal(positionHub.getPosition(), null, 'corrupt coordinates are ignored');
positionStored.delete(positionHub.positionStorageKey);

const unregisterPositionTheme = positionHub.register({
  id: 'position-theme',
  name: 'Position',
  mount: () => () => {},
});
const positionRoot = positionBody.children.find((node) => String(node.className).includes('dsh-theme-hub'));
const positionTrigger = positionRoot.querySelector('.dsh-theme-hub__trigger');
const positionPanel = positionRoot.querySelector('.dsh-theme-hub__panel');
const positionHeading = positionRoot.querySelector('.dsh-theme-hub__heading');
const positionOption = positionRoot.querySelector('.dsh-theme-hub__option');
assert.equal(positionPanel.hidden, true);
assert.equal(positionStored.has(positionHub.positionStorageKey), false);

const pointer = (type, target, x, y) => ({
  type,
  target,
  button: 0,
  isPrimary: true,
  pointerId: 1,
  clientX: x,
  clientY: y,
  preventDefault() {},
  stopPropagation() {},
});
const release = (target, x, y) => {
  positionRoot.dispatch('pointerdown', pointer('pointerdown', target, x, y));
  positionDocument.dispatch('pointermove', pointer('pointermove', target, x, y));
  positionDocument.dispatch('pointerup', pointer('pointerup', target, x, y));
  positionTrigger.dispatch('click', pointer('click', target, x, y));
  flushPositionTimers();
};

release(positionTrigger, 10, 10);
assert.equal(positionPanel.hidden, false, 'a click without movement still opens the selector');
assert.equal(positionStored.has(positionHub.positionStorageKey), false);
release(positionTrigger, 10, 10);
assert.equal(positionPanel.hidden, true);

positionRoot.dispatch('pointerdown', pointer('pointerdown', positionTrigger, 400, 400));
positionDocument.dispatch('pointermove', pointer('pointermove', positionTrigger, 80, -198));
positionDocument.dispatch('pointerup', pointer('pointerup', positionTrigger, 80, -198));
assert.equal(positionRoot.style.left, '800px');
assert.equal(positionRoot.style.top, '20px');
assert.equal(positionRoot.style.right, 'auto');
assert.equal(positionRoot.style.bottom, 'auto');
assert.equal(positionHub.getPosition().left, 800);
assert.equal(positionHub.getPosition().top, 20);
assert.ok(positionRoot.className.includes('dsh-theme-hub--panel-below'), 'a high position opens the panel downward');
assert.ok(!positionRoot.className.includes('dsh-theme-hub--panel-start'));
positionTrigger.dispatch('click', pointer('click', positionTrigger, 80, -198));
assert.equal(positionPanel.hidden, true, 'the click that ends a drag does not toggle the panel');
flushPositionTimers();

positionWindow.innerWidth = 400;
positionWindow.innerHeight = 300;
positionWindow.listeners.resize();
assert.equal(positionHub.getPosition().left, 250, 'resize keeps the selector inside the viewport');
assert.equal(positionHub.getPosition().top, 20);

positionRoot.dispatch('pointerdown', pointer('pointerdown', positionOption, 20, 20));
positionDocument.dispatch('pointermove', pointer('pointermove', positionOption, 300, 300));
positionDocument.dispatch('pointerup', pointer('pointerup', positionOption, 300, 300));
assert.equal(positionHub.getPosition().left, 250, 'theme rows stay clickable and do not drag');
assert.equal(positionHub.getPosition().top, 20);

release(positionTrigger, 10, 10);
assert.equal(positionPanel.hidden, false);
positionRoot.dispatch('pointerdown', pointer('pointerdown', positionHeading, 10, 10));
positionDocument.dispatch('pointermove', pointer('pointermove', positionHeading, -700, 10));
positionDocument.dispatch('pointerup', pointer('pointerup', positionHeading, -700, 10));
assert.equal(positionRoot.style.left, '8px', 'the panel header drags the selector and clamps to the margin');
assert.ok(positionRoot.className.includes('dsh-theme-hub--panel-start'), 'a left-edge position opens the panel toward free space');
positionTrigger.dispatch('click', pointer('click', positionTrigger, 10, 10));
assert.equal(positionPanel.hidden, true, 'dragging the header does not swallow the next trigger click');

unregisterPositionTheme();
positionWindow.innerWidth = 1280;
positionWindow.innerHeight = 720;
vm.runInContext('globalThis.__restoredHub = getWutheringThemeHub();', positionContext);
const restoredHub = positionContext.__restoredHub;
restoredHub.register({ id: 'position-theme', name: 'Position', mount: () => () => {} });
const restoredRoot = positionBody.children.find((node) => String(node.className).includes('dsh-theme-hub'));
assert.equal(restoredRoot.style.left, '8px');
assert.equal(restoredRoot.style.top, '20px');
assert.equal(restoredHub.getPosition().left, 8, 'the dragged position is restored on the next page');
assert.equal(restoredHub.getPosition().top, 20);
console.log('Verified theme hub: drag, clamp, panel anchor, position restore');
