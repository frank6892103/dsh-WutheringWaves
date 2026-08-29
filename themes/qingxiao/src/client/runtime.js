const QINGXIAO_PLUGIN_ID = '@dsh-external/dsh-client-ui-skin-wuthering-qingxiao';
const QINGXIAO_BODY_ATTR = 'data-dsh-skin-qingxiao';
const QINGXIAO_OWNER_ATTR = 'data-qingxiao-theme-owned';

function createQingxiaoOwnedElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  element.setAttribute(QINGXIAO_OWNER_ATTR, QINGXIAO_PLUGIN_ID);
  return element;
}

function mountQingxiaoTheme() {
  const body = document.body;
  const head = document.head;
  if (!body || !head) throw new Error('Qingxiao theme requires document.body and document.head');
  const fullEffects = document.documentElement?.getAttribute('data-dsh-wuthering-performance') === 'full';

  document
    .querySelectorAll(`[${QINGXIAO_OWNER_ATTR}="${QINGXIAO_PLUGIN_ID}"]`)
    .forEach((node) => node.remove());

  const previousBodyAttr = body.getAttribute(QINGXIAO_BODY_ATTR);
  const previousTitle = document.title;
  const existingThemeColor = head.querySelector('meta[name="theme-color"]');
  const previousThemeColor = existingThemeColor?.getAttribute('content') ?? null;
  const themeColor = existingThemeColor ?? document.createElement('meta');
  const themeColorWasCreated = !existingThemeColor;

  if (themeColorWasCreated) {
    themeColor.setAttribute('name', 'theme-color');
    head.append(themeColor);
  }

  const style = createQingxiaoOwnedElement('style', 'qingxiao-theme__style');
  style.textContent = QINGXIAO_THEME_CSS;
  head.append(style);

  const scene = createQingxiaoOwnedElement('div', 'qingxiao-theme__scene');
  scene.setAttribute('aria-hidden', 'true');

  const atmosphere = document.createElement('div');
  atmosphere.className = 'qingxiao-theme__atmosphere';
  scene.append(atmosphere);

  const moonGate = document.createElement('div');
  moonGate.className = 'qingxiao-theme__moon-gate';
  moonGate.append(document.createElement('i'), document.createElement('i'));
  scene.append(moonGate);

  const mountains = document.createElement('div');
  mountains.className = 'qingxiao-theme__mountains';
  mountains.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
  scene.append(mountains);

  const cloudSea = document.createElement('div');
  cloudSea.className = 'qingxiao-theme__cloud-sea';
  scene.append(cloudSea);

  const portraitFrame = document.createElement('div');
  portraitFrame.className = 'qingxiao-theme__portrait-frame';
  const characterAura = document.createElement('span');
  characterAura.className = 'qingxiao-theme__character-aura';
  const characterOrbit = document.createElement('span');
  characterOrbit.className = 'qingxiao-theme__character-orbit';
  characterOrbit.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
  const character = document.createElement('img');
  character.className = 'qingxiao-theme__character';
  character.src = QINGXIAO_ASSET_CHARACTER;
  character.alt = '';
  character.decoding = 'async';
  character.fetchPriority = 'high';
  const weaponPulse = document.createElement('span');
  weaponPulse.className = 'qingxiao-theme__weapon-pulse';
  const resonanceNodes = document.createElement('span');
  resonanceNodes.className = 'qingxiao-theme__resonance-nodes';
  for (let index = 0; index < (fullEffects ? 7 : 3); index += 1) {
    const node = document.createElement('i');
    node.style.setProperty('--node-index', index);
    resonanceNodes.append(node);
  }
  portraitFrame.append(characterAura, characterOrbit, character, weaponPulse, resonanceNodes);
  scene.append(portraitFrame);

  const swordField = document.createElement('div');
  swordField.className = 'qingxiao-theme__sword-field';
  for (let index = 0; index < (fullEffects ? 9 : 3); index += 1) {
    const sword = document.createElement('i');
    sword.style.setProperty('--sword-index', index);
    swordField.append(sword);
  }
  scene.append(swordField);

  if (fullEffects) {
    const strings = document.createElement('div');
    strings.className = 'qingxiao-theme__strings';
    for (let index = 0; index < 5; index += 1) strings.append(document.createElement('i'));
    scene.append(strings);

    const leaves = document.createElement('div');
    leaves.className = 'qingxiao-theme__leaves';
    for (let index = 0; index < 8; index += 1) {
      const leaf = document.createElement('i');
      leaf.style.setProperty('--leaf-index', index);
      leaves.append(leaf);
    }
    scene.append(leaves);

    const swordTrace = document.createElement('div');
    swordTrace.className = 'qingxiao-theme__sword-trace';
    scene.append(swordTrace);
  }

  let foreground = null;
  if (fullEffects) {
    foreground = createQingxiaoOwnedElement('div', 'qingxiao-theme__foreground');
    foreground.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 7; index += 1) {
      const bladeLight = document.createElement('i');
      bladeLight.style.setProperty('--blade-index', index);
      foreground.append(bladeLight);
    }
  }

  const seal = document.createElement('div');
  seal.className = 'qingxiao-theme__seal';
  seal.textContent = '清宵';
  scene.append(seal);

  const brand = createQingxiaoOwnedElement('div', 'qingxiao-theme__brand');
  const brandKicker = document.createElement('span');
  brandKicker.textContent = 'MENGZHOU · SWORD INTENT';
  const brandName = document.createElement('strong');
  brandName.textContent = '清宵';
  const brandTagline = document.createElement('small');
  brandTagline.textContent = '弦凝千古寂 · 剑起满天清';
  brand.append(brandKicker, brandName, brandTagline);

  const hud = createQingxiaoOwnedElement('div', 'qingxiao-theme__hud');
  hud.setAttribute('aria-hidden', 'true');
  const hudMark = document.createElement('i');
  hudMark.className = 'qingxiao-theme__hud-mark';
  const hudCopy = document.createElement('div');
  hudCopy.className = 'qingxiao-theme__hud-copy';
  const hudLabel = document.createElement('span');
  hudLabel.textContent = 'HEAVEN · EARTH · HEARTSWORD';
  const hudValue = document.createElement('strong');
  hudValue.textContent = '天地弦心剑';
  const hudMeta = document.createElement('small');
  hudMeta.textContent = fullEffects ? 'WIND CHANNEL // FULL' : 'WIND CHANNEL // STILL';
  hudCopy.append(hudLabel, hudValue, hudMeta);
  const hudSignal = document.createElement('div');
  hudSignal.className = 'qingxiao-theme__hud-signal';
  for (let index = 0; index < 4; index += 1) hudSignal.append(document.createElement('i'));
  hud.append(hudMark, hudCopy, hudSignal);

  body.prepend(scene);
  body.append(brand, hud);
  if (foreground) body.append(foreground);
  body.setAttribute(QINGXIAO_BODY_ATTR, '');
  document.title = '鸣潮 · 清宵 | DeepSeek Harness';

  const updateThemeColor = () => {
    const isDark = body.hasAttribute('data-ds-dark-theme');
    themeColor.setAttribute('content', isDark ? '#071a24' : '#dff5f1');
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
      .querySelectorAll(`[${QINGXIAO_OWNER_ATTR}="${QINGXIAO_PLUGIN_ID}"]`)
      .forEach((node) => node.remove());

    if (previousBodyAttr === null) {
      body.removeAttribute(QINGXIAO_BODY_ATTR);
    } else {
      body.setAttribute(QINGXIAO_BODY_ATTR, previousBodyAttr);
    }

    document.title = previousTitle;
    if (themeColorWasCreated) {
      themeColor.remove();
    } else if (previousThemeColor === null) {
      themeColor.removeAttribute('content');
    } else {
      themeColor.setAttribute('content', previousThemeColor);
    }
  };
}

function apply(ctx) {
  const hub = getWutheringThemeHub();
  ctx.effect(
    () => hub.register({
      id: 'wuthering-qingxiao',
      name: '鸣潮 · 清宵',
      tagline: '云岚琴心、万剑清光与青玉长风',
      accent: '#54cbd0',
      order: 40,
      previewUrl: QINGXIAO_ASSET_POSTER,
      mount: mountQingxiaoTheme,
    }),
    'Register the Wuthering Waves Qingxiao skin with the theme hub',
  );
}

exports.apply = apply;
