const XINYUEHU_PLUGIN_ID = '@dsh-external/dsh-client-ui-skin-wuthering-xinyuehu';
const XINYUEHU_BODY_ATTR = 'data-dsh-skin-xinyuehu';
const XINYUEHU_OWNER_ATTR = 'data-xinyuehu-theme-owned';

function createXinyuehuOwnedElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  element.setAttribute(XINYUEHU_OWNER_ATTR, XINYUEHU_PLUGIN_ID);
  return element;
}

function mountXinyuehuTheme() {
  const body = document.body;
  const head = document.head;
  if (!body || !head) throw new Error('Xinyuehu theme requires document.body and document.head');
  const fullEffects = document.documentElement?.getAttribute('data-dsh-wuthering-performance') === 'full';

  document
    .querySelectorAll(`[${XINYUEHU_OWNER_ATTR}="${XINYUEHU_PLUGIN_ID}"]`)
    .forEach((node) => node.remove());

  const previousBodyAttr = body.getAttribute(XINYUEHU_BODY_ATTR);
  const previousTitle = document.title;
  const existingThemeColor = head.querySelector('meta[name="theme-color"]');
  const previousThemeColor = existingThemeColor?.getAttribute('content') ?? null;
  const themeColor = existingThemeColor ?? document.createElement('meta');
  const themeColorWasCreated = !existingThemeColor;

  if (themeColorWasCreated) {
    themeColor.setAttribute('name', 'theme-color');
    head.append(themeColor);
  }

  const style = createXinyuehuOwnedElement('style', 'xinyuehu-theme__style');
  style.textContent = XINYUEHU_THEME_CSS;
  head.append(style);

  const scene = createXinyuehuOwnedElement('div', 'xinyuehu-theme__scene');
  scene.setAttribute('aria-hidden', 'true');

  const dreamscape = document.createElement('div');
  dreamscape.className = 'xinyuehu-theme__dreamscape';
  scene.append(dreamscape);

  const lattice = document.createElement('div');
  lattice.className = 'xinyuehu-theme__lattice';
  scene.append(lattice);

  if (fullEffects) {
    const orbits = document.createElement('div');
    orbits.className = 'xinyuehu-theme__orbits';
    scene.append(orbits);
  }

  const moon = document.createElement('div');
  moon.className = 'xinyuehu-theme__moon';
  scene.append(moon);

  if (fullEffects) {
    const astrolabe = document.createElement('div');
    astrolabe.className = 'xinyuehu-theme__astrolabe';
    scene.append(astrolabe);

    const silks = document.createElement('div');
    silks.className = 'xinyuehu-theme__silks';
    silks.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
    scene.append(silks);
  }

  const foxfireField = document.createElement('div');
  foxfireField.className = 'xinyuehu-theme__foxfire-field';
  for (let index = 0; index < (fullEffects ? 5 : 2); index += 1) {
    const foxfire = document.createElement('i');
    foxfire.className = `xinyuehu-theme__foxfire xinyuehu-theme__foxfire--${index + 1}`;
    const flameTail = document.createElement('span');
    foxfire.append(flameTail);
    foxfireField.append(foxfire);
  }
  scene.append(foxfireField);

  if (fullEffects) {
    const motes = document.createElement('div');
    motes.className = 'xinyuehu-theme__motes';
    for (let index = 0; index < 12; index += 1) {
      const mote = document.createElement('i');
      mote.style.setProperty('--mote-index', index);
      mote.style.setProperty('--mote-size', `${3 + (index % 5) * 2}px`);
      mote.style.setProperty('--mote-left', `${4 + index * 7.2}%`);
      mote.style.setProperty('--mote-bottom', `${-5 - (index % 4) * 8}%`);
      motes.append(mote);
    }
    scene.append(motes);

    const sparks = document.createElement('div');
    sparks.className = 'xinyuehu-theme__sparks';
    for (let index = 0; index < 9; index += 1) sparks.append(document.createElement('i'));
    scene.append(sparks);
  }

  const portrait = createXinyuehuOwnedElement('img', 'xinyuehu-theme__portrait');
  portrait.src = XINYUEHU_ASSET_POSTER;
  portrait.alt = '';
  portrait.decoding = 'async';

  const sigil = document.createElement('div');
  sigil.className = 'xinyuehu-theme__sigil';
  sigil.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
  scene.append(sigil);

  const brand = createXinyuehuOwnedElement('div', 'xinyuehu-theme__brand');
  const brandName = document.createElement('strong');
  brandName.textContent = 'XIN · 心';
  const brandTagline = document.createElement('span');
  brandTagline.textContent = '朝月清辉 · MOONLIT HEART';
  brand.append(brandName, brandTagline);
  body.prepend(scene);
  body.append(portrait, brand);

  const hud = createXinyuehuOwnedElement('div', 'xinyuehu-theme__hud');
  hud.setAttribute('aria-hidden', 'true');

  const hudSignal = document.createElement('div');
  hudSignal.className = 'xinyuehu-theme__hud-signal';
  const hudSonar = document.createElement('i');
  hudSonar.className = 'xinyuehu-theme__hud-compass';
  if (fullEffects) hudSonar.append(document.createElement('span'));
  const hudSignalCopy = document.createElement('div');
  hudSignalCopy.className = 'xinyuehu-theme__hud-copy';
  const hudSignalLabel = document.createElement('span');
  hudSignalLabel.textContent = 'LUNAR FRACTAL · 07';
  const hudSignalValue = document.createElement('strong');
  hudSignalValue.textContent = 'MYRIAD FORMS // LINKED';
  const hudSignalMeta = document.createElement('small');
  hudSignalMeta.textContent = 'GUIDANCE  99.7%';
  hudSignalCopy.append(hudSignalLabel, hudSignalValue, hudSignalMeta);
  hudSignal.append(hudSonar, hudSignalCopy);

  const hudStatus = document.createElement('div');
  hudStatus.className = 'xinyuehu-theme__hud-status';
  const hudPulse = document.createElement('i');
  hudPulse.className = 'xinyuehu-theme__hud-pulse';
  const hudStatusCopy = document.createElement('div');
  hudStatusCopy.className = 'xinyuehu-theme__hud-copy';
  const hudStatusLabel = document.createElement('span');
  hudStatusLabel.textContent = 'FOX-FIRE LINK';
  const hudStatusValue = document.createElement('strong');
  hudStatusValue.textContent = 'MENGZHOU LANTERNS · STABLE';
  hudStatusCopy.append(hudStatusLabel, hudStatusValue);
  const hudWave = document.createElement('div');
  hudWave.className = 'xinyuehu-theme__hud-spectrum';
  if (fullEffects) {
    for (let index = 0; index < 8; index += 1) hudWave.append(document.createElement('i'));
  }
  hudStatus.append(hudPulse, hudStatusCopy);
  if (fullEffects) hudStatus.append(hudWave);

  hud.append(hudSignal, hudStatus);
  if (fullEffects) {
    const hudFrame = document.createElement('div');
    hudFrame.className = 'xinyuehu-theme__hud-frame';
    hudFrame.append(document.createElement('i'), document.createElement('i'));
    hud.append(hudFrame);

    const hudMotes = document.createElement('div');
    hudMotes.className = 'xinyuehu-theme__hud-motes';
    for (let index = 0; index < 8; index += 1) hudMotes.append(document.createElement('i'));
    hud.append(hudMotes);
  }
  body.append(hud);

  body.setAttribute(XINYUEHU_BODY_ATTR, '');
  document.title = '鸣潮 · 心月狐 | DeepSeek Harness';

  const updateThemeColor = () => {
    const isDark = body.hasAttribute('data-ds-dark-theme');
    themeColor.setAttribute('content', isDark ? '#171110' : '#eee5d7');
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
      .querySelectorAll(`[${XINYUEHU_OWNER_ATTR}="${XINYUEHU_PLUGIN_ID}"]`)
      .forEach((node) => node.remove());

    if (previousBodyAttr === null) {
      body.removeAttribute(XINYUEHU_BODY_ATTR);
    } else {
      body.setAttribute(XINYUEHU_BODY_ATTR, previousBodyAttr);
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
      id: 'wuthering-xinyuehu',
      name: '鸣潮 · 心月狐',
      tagline: '月照孤城、狐火机关与朱砂墨金',
      accent: '#c7463f',
      order: 30,
      previewUrl: XINYUEHU_ASSET_POSTER,
      mount: mountXinyuehuTheme,
    }),
    'Register the Wuthering Waves Xinyuehu skin with the theme hub',
  );
}

exports.apply = apply;
