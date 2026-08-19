const AEMEATH_PLUGIN_ID = '@dsh-external/dsh-client-ui-skin-wuthering-aemeath';
const AEMEATH_BODY_ATTR = 'data-dsh-skin-aemeath';
const AEMEATH_OWNER_ATTR = 'data-aemeath-theme-owned';

function createAemeathOwnedElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  element.setAttribute(AEMEATH_OWNER_ATTR, AEMEATH_PLUGIN_ID);
  return element;
}

function mountAemeathTheme() {
  const body = document.body;
  const head = document.head;
  if (!body || !head) throw new Error('Aemeath theme requires document.body and document.head');
  const fullEffects = document.documentElement?.getAttribute('data-dsh-wuthering-performance') === 'full';

  document
    .querySelectorAll(`[${AEMEATH_OWNER_ATTR}="${AEMEATH_PLUGIN_ID}"]`)
    .forEach((node) => node.remove());

  const previousBodyAttr = body.getAttribute(AEMEATH_BODY_ATTR);
  const previousTitle = document.title;
  const existingThemeColor = head.querySelector('meta[name="theme-color"]');
  const previousThemeColor = existingThemeColor?.getAttribute('content') ?? null;
  const themeColor = existingThemeColor ?? document.createElement('meta');
  const themeColorWasCreated = !existingThemeColor;

  if (themeColorWasCreated) {
    themeColor.setAttribute('name', 'theme-color');
    head.append(themeColor);
  }

  const style = createAemeathOwnedElement('style', 'aemeath-theme__style');
  style.textContent = AEMEATH_THEME_CSS;
  head.append(style);

  const scene = createAemeathOwnedElement('div', 'aemeath-theme__scene');
  scene.setAttribute('aria-hidden', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'aemeath-theme__backdrop';
  backdrop.style.backgroundImage = `url("${AEMEATH_ASSET_POSTER}")`;
  scene.append(backdrop);

  if (fullEffects) {
    const panelTexture = document.createElement('div');
    panelTexture.className = 'aemeath-theme__panel-texture';
    panelTexture.style.backgroundImage = `url("${AEMEATH_ASSET_PANEL}")`;
    scene.append(panelTexture);

    const starlight = document.createElement('div');
    starlight.className = 'aemeath-theme__starlight';
    scene.append(starlight);

    const aurora = document.createElement('div');
    aurora.className = 'aemeath-theme__aurora';
    scene.append(aurora);
  }

  const orbit = document.createElement('div');
  orbit.className = 'aemeath-theme__orbit';
  for (let index = 0; index < (fullEffects ? 3 : 1); index += 1) {
    const ring = document.createElement('i');
    ring.className = `aemeath-theme__orbit-ring aemeath-theme__orbit-ring--${index + 1}`;
    orbit.append(ring);
  }
  scene.append(orbit);

  if (fullEffects) {
    const grid = document.createElement('div');
    grid.className = 'aemeath-theme__grid';
    scene.append(grid);

    const scanlines = document.createElement('div');
    scanlines.className = 'aemeath-theme__scanlines';
    scene.append(scanlines);
  }

  const portrait = document.createElement('img');
  portrait.className = 'aemeath-theme__portrait';
  portrait.src = AEMEATH_ASSET_PORTRAIT;
  portrait.alt = '';
  portrait.decoding = 'async';
  scene.append(portrait);

  const brand = document.createElement('div');
  brand.className = 'aemeath-theme__brand';
  const brandName = document.createElement('strong');
  brandName.textContent = 'AEMEATH';
  const brandTagline = document.createElement('span');
  brandTagline.textContent = '长航的星辉';
  brand.append(brandName, brandTagline);
  scene.append(brand);

  body.prepend(scene);

  const hud = createAemeathOwnedElement('div', 'aemeath-theme__hud');
  hud.setAttribute('aria-hidden', 'true');

  const hudTop = document.createElement('div');
  hudTop.className = 'aemeath-theme__hud-top';
  const hudLabel = document.createElement('span');
  hudLabel.textContent = 'RESONANCE SIGNAL';
  const hudValue = document.createElement('strong');
  hudValue.textContent = 'AEMEATH // 100%';
  hudTop.append(hudLabel, hudValue);

  hud.append(hudTop);
  if (fullEffects) {
    const hudBottom = document.createElement('div');
    hudBottom.className = 'aemeath-theme__hud-bottom';
    const hudPulse = document.createElement('i');
    const hudText = document.createElement('span');
    hudText.textContent = 'STAR VOYAGE · ONLINE';
    hudBottom.append(hudPulse, hudText);

    const hudEdge = document.createElement('div');
    hudEdge.className = 'aemeath-theme__hud-edge';

    const hudMotion = document.createElement('div');
    hudMotion.className = 'aemeath-theme__hud-motion';
    for (let index = 0; index < 6; index += 1) hudMotion.append(document.createElement('i'));

    hud.append(hudBottom, hudEdge, hudMotion);
  }
  body.append(hud);

  body.setAttribute(AEMEATH_BODY_ATTR, '');
  document.title = '鸣潮 · 爱弥斯 | DeepSeek Harness';

  const updateThemeColor = () => {
    const isDark = body.hasAttribute('data-ds-dark-theme');
    themeColor.setAttribute('content', isDark ? '#081328' : '#dff6ff');
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
      .querySelectorAll(`[${AEMEATH_OWNER_ATTR}="${AEMEATH_PLUGIN_ID}"]`)
      .forEach((node) => node.remove());

    if (previousBodyAttr === null) {
      body.removeAttribute(AEMEATH_BODY_ATTR);
    } else {
      body.setAttribute(AEMEATH_BODY_ATTR, previousBodyAttr);
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
      id: 'wuthering-aemeath',
      name: '鸣潮 · 爱弥斯',
      tagline: '星海长航、青粉霓虹与电子幽灵',
      accent: '#73dcff',
      order: 10,
      previewUrl: AEMEATH_ASSET_POSTER,
      mount: mountAemeathTheme,
    }),
    'Register the Wuthering Waves Aemeath skin with the theme hub',
  );
}

exports.apply = apply;
