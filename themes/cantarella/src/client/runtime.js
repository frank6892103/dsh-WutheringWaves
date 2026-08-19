const CANTARELLA_PLUGIN_ID = '@dsh-external/dsh-client-ui-skin-wuthering-cantarella';
const CANTARELLA_BODY_ATTR = 'data-dsh-skin-cantarella';
const CANTARELLA_OWNER_ATTR = 'data-cantarella-theme-owned';

function createCantarellaOwnedElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  element.setAttribute(CANTARELLA_OWNER_ATTR, CANTARELLA_PLUGIN_ID);
  return element;
}

function mountCantarellaTheme() {
  const body = document.body;
  const head = document.head;
  if (!body || !head) throw new Error('Cantarella theme requires document.body and document.head');
  const fullEffects = document.documentElement?.getAttribute('data-dsh-wuthering-performance') === 'full';

  document
    .querySelectorAll(`[${CANTARELLA_OWNER_ATTR}="${CANTARELLA_PLUGIN_ID}"]`)
    .forEach((node) => node.remove());

  const previousBodyAttr = body.getAttribute(CANTARELLA_BODY_ATTR);
  const previousTitle = document.title;
  const existingThemeColor = head.querySelector('meta[name="theme-color"]');
  const previousThemeColor = existingThemeColor?.getAttribute('content') ?? null;
  const themeColor = existingThemeColor ?? document.createElement('meta');
  const themeColorWasCreated = !existingThemeColor;

  if (themeColorWasCreated) {
    themeColor.setAttribute('name', 'theme-color');
    head.append(themeColor);
  }

  const style = createCantarellaOwnedElement('style', 'cantarella-theme__style');
  style.textContent = CANTARELLA_THEME_CSS;
  head.append(style);

  const scene = createCantarellaOwnedElement('div', 'cantarella-theme__scene');
  scene.setAttribute('aria-hidden', 'true');

  const abyss = document.createElement('div');
  abyss.className = 'cantarella-theme__abyss';
  scene.append(abyss);

  const caustics = document.createElement('div');
  caustics.className = 'cantarella-theme__caustics';
  scene.append(caustics);

  if (fullEffects) {
    const currents = document.createElement('div');
    currents.className = 'cantarella-theme__currents';
    scene.append(currents);
  }

  const bloom = document.createElement('div');
  bloom.className = 'cantarella-theme__bloom';
  scene.append(bloom);

  if (fullEffects) {
    const refraction = document.createElement('div');
    refraction.className = 'cantarella-theme__refraction';
    scene.append(refraction);

    const ribbons = document.createElement('div');
    ribbons.className = 'cantarella-theme__ribbons';
    ribbons.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
    scene.append(ribbons);
  }

  const jellyField = document.createElement('div');
  jellyField.className = 'cantarella-theme__jelly-field';
  for (let index = 0; index < (fullEffects ? 5 : 2); index += 1) {
    const jellyfish = document.createElement('i');
    jellyfish.className = `cantarella-theme__jellyfish cantarella-theme__jellyfish--${index + 1}`;
    const tentacles = document.createElement('span');
    jellyfish.append(tentacles);
    jellyField.append(jellyfish);
  }
  scene.append(jellyField);

  if (fullEffects) {
    const bubbles = document.createElement('div');
    bubbles.className = 'cantarella-theme__bubbles';
    for (let index = 0; index < 12; index += 1) {
      const bubble = document.createElement('i');
      bubble.style.setProperty('--bubble-index', index);
      bubble.style.setProperty('--bubble-size', `${3 + (index % 5) * 2}px`);
      bubble.style.setProperty('--bubble-left', `${4 + index * 7.2}%`);
      bubble.style.setProperty('--bubble-bottom', `${-5 - (index % 4) * 8}%`);
      bubbles.append(bubble);
    }
    scene.append(bubbles);

    const glints = document.createElement('div');
    glints.className = 'cantarella-theme__glints';
    for (let index = 0; index < 9; index += 1) glints.append(document.createElement('i'));
    scene.append(glints);
  }

  const portrait = createCantarellaOwnedElement('img', 'cantarella-theme__portrait');
  portrait.src = CANTARELLA_ASSET_PORTRAIT;
  portrait.alt = '';
  portrait.decoding = 'async';

  const crest = document.createElement('div');
  crest.className = 'cantarella-theme__crest';
  crest.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
  scene.append(crest);

  const brand = createCantarellaOwnedElement('div', 'cantarella-theme__brand');
  const brandName = document.createElement('strong');
  brandName.textContent = 'CANTARELLA';
  const brandTagline = document.createElement('span');
  brandTagline.textContent = '海中梦 · SEA OF DREAMS';
  brand.append(brandName, brandTagline);
  body.prepend(scene);
  body.append(portrait, brand);

  const hud = createCantarellaOwnedElement('div', 'cantarella-theme__hud');
  hud.setAttribute('aria-hidden', 'true');

  const hudSignal = document.createElement('div');
  hudSignal.className = 'cantarella-theme__hud-signal';
  const hudSonar = document.createElement('i');
  hudSonar.className = 'cantarella-theme__hud-sonar';
  if (fullEffects) hudSonar.append(document.createElement('span'));
  const hudSignalCopy = document.createElement('div');
  hudSignalCopy.className = 'cantarella-theme__hud-copy';
  const hudSignalLabel = document.createElement('span');
  hudSignalLabel.textContent = 'SOMNO SONAR · 02';
  const hudSignalValue = document.createElement('strong');
  hudSignalValue.textContent = 'DREAM DEPTH // ABYSS';
  const hudSignalMeta = document.createElement('small');
  hudSignalMeta.textContent = 'RESONANCE  87.4%';
  hudSignalCopy.append(hudSignalLabel, hudSignalValue, hudSignalMeta);
  hudSignal.append(hudSonar, hudSignalCopy);

  const hudStatus = document.createElement('div');
  hudStatus.className = 'cantarella-theme__hud-status';
  const hudPulse = document.createElement('i');
  hudPulse.className = 'cantarella-theme__hud-pulse';
  const hudStatusCopy = document.createElement('div');
  hudStatusCopy.className = 'cantarella-theme__hud-copy';
  const hudStatusLabel = document.createElement('span');
  hudStatusLabel.textContent = 'MIRAGE LINK';
  const hudStatusValue = document.createElement('strong');
  hudStatusValue.textContent = 'TIDAL MEMORY · STABLE';
  hudStatusCopy.append(hudStatusLabel, hudStatusValue);
  const hudWave = document.createElement('div');
  hudWave.className = 'cantarella-theme__hud-wave';
  if (fullEffects) {
    for (let index = 0; index < 8; index += 1) hudWave.append(document.createElement('i'));
  }
  hudStatus.append(hudPulse, hudStatusCopy);
  if (fullEffects) hudStatus.append(hudWave);

  hud.append(hudSignal, hudStatus);
  if (fullEffects) {
    const hudFrame = document.createElement('div');
    hudFrame.className = 'cantarella-theme__hud-frame';
    hudFrame.append(document.createElement('i'), document.createElement('i'));
    hud.append(hudFrame);
  }
  body.append(hud);

  body.setAttribute(CANTARELLA_BODY_ATTR, '');
  document.title = '鸣潮 · 坎特蕾拉 | DeepSeek Harness';

  const updateThemeColor = () => {
    const isDark = body.hasAttribute('data-ds-dark-theme');
    themeColor.setAttribute('content', isDark ? '#100c2b' : '#dfe5ff');
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
      .querySelectorAll(`[${CANTARELLA_OWNER_ATTR}="${CANTARELLA_PLUGIN_ID}"]`)
      .forEach((node) => node.remove());

    if (previousBodyAttr === null) {
      body.removeAttribute(CANTARELLA_BODY_ATTR);
    } else {
      body.setAttribute(CANTARELLA_BODY_ATTR, previousBodyAttr);
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
      id: 'wuthering-cantarella',
      name: '鸣潮 · 坎特蕾拉',
      tagline: '深海幻梦、水母微光与紫蓝潮汐',
      accent: '#a99cff',
      order: 20,
      previewUrl: CANTARELLA_ASSET_PORTRAIT,
      mount: mountCantarellaTheme,
    }),
    'Register the Wuthering Waves Cantarella skin with the theme hub',
  );
}

exports.apply = apply;
