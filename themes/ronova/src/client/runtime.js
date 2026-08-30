const RONOVA_PLUGIN_ID = '@dsh-external/dsh-client-ui-skin-genshin-ronova';
const RONOVA_BODY_ATTR = 'data-dsh-skin-ronova';
const RONOVA_OWNER_ATTR = 'data-ronova-theme-owned';

function createRonovaOwnedElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  element.setAttribute(RONOVA_OWNER_ATTR, RONOVA_PLUGIN_ID);
  return element;
}

function appendIndexedChildren(parent, count, variableName) {
  for (let index = 0; index < count; index += 1) {
    const child = document.createElement('i');
    child.style.setProperty(variableName, index);
    parent.append(child);
  }
}

function mountRonovaTheme() {
  const body = document.body;
  const head = document.head;
  if (!body || !head) throw new Error('Ronova theme requires document.body and document.head');
  const fullEffects = document.documentElement?.getAttribute('data-dsh-wuthering-performance') === 'full';

  document
    .querySelectorAll(`[${RONOVA_OWNER_ATTR}="${RONOVA_PLUGIN_ID}"]`)
    .forEach((node) => node.remove());

  const previousBodyAttr = body.getAttribute(RONOVA_BODY_ATTR);
  const previousTitle = document.title;
  const existingThemeColor = head.querySelector('meta[name="theme-color"]');
  const previousThemeColor = existingThemeColor?.getAttribute('content') ?? null;
  const themeColor = existingThemeColor ?? document.createElement('meta');
  const themeColorWasCreated = !existingThemeColor;

  if (themeColorWasCreated) {
    themeColor.setAttribute('name', 'theme-color');
    head.append(themeColor);
  }

  const style = createRonovaOwnedElement('style', 'ronova-theme__style');
  style.textContent = RONOVA_THEME_CSS;
  head.append(style);

  const scene = createRonovaOwnedElement('div', 'ronova-theme__scene');
  scene.setAttribute('aria-hidden', 'true');
  scene.style.setProperty('--ronova-sanctuary', `url("${RONOVA_ASSET_POSTER}")`);

  const atmosphere = document.createElement('div');
  atmosphere.className = 'ronova-theme__atmosphere';
  scene.append(atmosphere);

  const eclipse = document.createElement('div');
  eclipse.className = 'ronova-theme__eclipse';
  eclipse.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
  scene.append(eclipse);

  const judgmentGate = document.createElement('div');
  judgmentGate.className = 'ronova-theme__judgment-gate';
  judgmentGate.append(document.createElement('i'), document.createElement('i'));
  scene.append(judgmentGate);

  const leyLines = document.createElement('div');
  leyLines.className = 'ronova-theme__ley-lines';
  appendIndexedChildren(leyLines, fullEffects ? 7 : 3, '--line-index');
  scene.append(leyLines);

  const portraitStage = document.createElement('div');
  portraitStage.className = 'ronova-theme__portrait-stage';

  const aura = document.createElement('span');
  aura.className = 'ronova-theme__character-aura';

  const decreeOrbit = document.createElement('span');
  decreeOrbit.className = 'ronova-theme__decree-orbit';
  decreeOrbit.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));

  const character = document.createElement('img');
  character.className = 'ronova-theme__character';
  character.src = RONOVA_ASSET_CHARACTER;
  character.alt = '';
  character.decoding = 'async';
  character.fetchPriority = 'high';

  const deathMark = document.createElement('span');
  deathMark.className = 'ronova-theme__death-mark';
  deathMark.append(document.createElement('i'));

  const eyeSigils = document.createElement('span');
  eyeSigils.className = 'ronova-theme__eye-sigils';
  appendIndexedChildren(eyeSigils, fullEffects ? 6 : 3, '--sigil-index');

  const soulThreads = document.createElement('span');
  soulThreads.className = 'ronova-theme__soul-threads';
  appendIndexedChildren(soulThreads, fullEffects ? 8 : 3, '--thread-index');

  portraitStage.append(aura, decreeOrbit, character, deathMark, eyeSigils, soulThreads);
  scene.append(portraitStage);

  const plumeField = document.createElement('div');
  plumeField.className = 'ronova-theme__plume-field';
  appendIndexedChildren(plumeField, fullEffects ? 14 : 5, '--plume-index');
  scene.append(plumeField);

  if (fullEffects) {
    const soulMotes = document.createElement('div');
    soulMotes.className = 'ronova-theme__soul-motes';
    appendIndexedChildren(soulMotes, 18, '--mote-index');
    scene.append(soulMotes);

    const edictLattice = document.createElement('div');
    edictLattice.className = 'ronova-theme__edict-lattice';
    appendIndexedChildren(edictLattice, 4, '--arc-index');
    scene.append(edictLattice);
  }

  let foreground = null;
  if (fullEffects) {
    foreground = createRonovaOwnedElement('div', 'ronova-theme__foreground');
    foreground.setAttribute('aria-hidden', 'true');
    appendIndexedChildren(foreground, 6, '--rift-index');
  }

  const brand = createRonovaOwnedElement('div', 'ronova-theme__brand');
  const brandKicker = document.createElement('span');
  brandKicker.textContent = 'TEYVAT · FOURTH SHADE';
  const brandName = document.createElement('strong');
  brandName.textContent = '若娜瓦';
  const brandTagline = document.createElement('small');
  brandTagline.textContent = '死生有律 · 万象归寂';
  brand.append(brandKicker, brandName, brandTagline);

  const hud = createRonovaOwnedElement('div', 'ronova-theme__hud');
  hud.setAttribute('aria-hidden', 'true');
  const hudMark = document.createElement('i');
  hudMark.className = 'ronova-theme__hud-mark';
  const hudCopy = document.createElement('div');
  hudCopy.className = 'ronova-theme__hud-copy';
  const hudLabel = document.createElement('span');
  hudLabel.textContent = 'RULER OF DEATH · JUDGMENT';
  const hudValue = document.createElement('strong');
  hudValue.textContent = '死之执政 // 终焉律令';
  const hudMeta = document.createElement('small');
  hudMeta.textContent = fullEffects ? 'EDICT ARRAY // FULL' : 'EDICT ARRAY // STILL';
  hudCopy.append(hudLabel, hudValue, hudMeta);
  const hudSignal = document.createElement('div');
  hudSignal.className = 'ronova-theme__hud-signal';
  appendIndexedChildren(hudSignal, 6, '--signal-index');
  hud.append(hudMark, hudCopy, hudSignal);

  const edictHud = createRonovaOwnedElement('div', 'ronova-theme__edict-hud');
  edictHud.setAttribute('aria-hidden', 'true');
  const edictSeal = document.createElement('i');
  edictSeal.className = 'ronova-theme__edict-seal';
  const edictCopy = document.createElement('div');
  const edictLabel = document.createElement('span');
  edictLabel.textContent = 'FINAL DECREE // 06';
  const edictValue = document.createElement('strong');
  edictValue.textContent = '此世边界 · 归于沉寂';
  const edictMeta = document.createElement('small');
  edictMeta.textContent = fullEffects ? 'SOUL PASSAGE SYNCHRONIZED' : 'SOUL PASSAGE DORMANT';
  edictCopy.append(edictLabel, edictValue, edictMeta);
  edictHud.append(edictSeal, edictCopy);

  body.prepend(scene);
  body.append(brand, hud, edictHud);
  if (foreground) body.append(foreground);
  body.setAttribute(RONOVA_BODY_ATTR, '');
  document.title = '原神 · 若娜瓦 | DeepSeek Harness';

  const updateThemeColor = () => {
    const isDark = body.hasAttribute('data-ds-dark-theme');
    themeColor.setAttribute('content', isDark ? '#16080b' : '#eee5df');
  };
  updateThemeColor();

  const observer = new MutationObserver(updateThemeColor);
  observer.observe(body, {
    attributes: true,
    attributeFilter: ['data-ds-dark-theme'],
  });

  return () => {
    observer.disconnect();
    document
      .querySelectorAll(`[${RONOVA_OWNER_ATTR}="${RONOVA_PLUGIN_ID}"]`)
      .forEach((node) => node.remove());

    if (previousBodyAttr === null) body.removeAttribute(RONOVA_BODY_ATTR);
    else body.setAttribute(RONOVA_BODY_ATTR, previousBodyAttr);

    document.title = previousTitle;
    if (themeColorWasCreated) themeColor.remove();
    else if (previousThemeColor === null) themeColor.removeAttribute('content');
    else themeColor.setAttribute('content', previousThemeColor);
  };
}

function apply(ctx) {
  const hub = getWutheringThemeHub();
  ctx.effect(
    () => hub.register({
      id: 'genshin-ronova',
      name: '原神 · 若娜瓦',
      tagline: '赤月终焉、六翼神瞳与死生律令',
      accent: '#c54845',
      order: 60,
      previewUrl: RONOVA_ASSET_POSTER,
      mount: mountRonovaTheme,
    }),
    'Register the Genshin Impact Ronova skin with the theme hub',
  );
}

exports.apply = apply;
