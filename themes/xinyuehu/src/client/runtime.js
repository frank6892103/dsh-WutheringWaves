const XINYUEHU_PLUGIN_ID = '@dsh-external/dsh-client-ui-skin-wuthering-xinyuehu';
const XINYUEHU_BODY_ATTR = 'data-dsh-skin-xinyuehu';
const XINYUEHU_OWNER_ATTR = 'data-xinyuehu-theme-owned';

function createXinyuehuOwnedElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  element.setAttribute(XINYUEHU_OWNER_ATTR, XINYUEHU_PLUGIN_ID);
  return element;
}

function appendRepeated(parent, tagName, count) {
  for (let index = 0; index < count; index += 1) {
    const element = document.createElement(tagName);
    element.style.setProperty('--item-index', index);
    parent.append(element);
  }
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

  const paper = document.createElement('div');
  paper.className = 'xinyuehu-theme__paper';

  const terrace = document.createElement('div');
  terrace.className = 'xinyuehu-theme__terrace';

  const moonGate = document.createElement('div');
  moonGate.className = 'xinyuehu-theme__moon-gate';
  const gateRing = document.createElement('i');
  gateRing.className = 'xinyuehu-theme__gate-ring';
  const moon = document.createElement('i');
  moon.className = 'xinyuehu-theme__moon';
  const gateTicks = document.createElement('span');
  gateTicks.className = 'xinyuehu-theme__gate-ticks';
  moonGate.append(gateRing, moon, gateTicks);

  const foldingScreen = document.createElement('div');
  foldingScreen.className = 'xinyuehu-theme__folding-screen';
  appendRepeated(foldingScreen, 'i', 4);

  const portraitFrame = document.createElement('div');
  portraitFrame.className = 'xinyuehu-theme__portrait-frame';
  const portraitAura = document.createElement('span');
  portraitAura.className = 'xinyuehu-theme__portrait-aura';
  const portraitOrbit = document.createElement('span');
  portraitOrbit.className = 'xinyuehu-theme__portrait-orbit';
  appendRepeated(portraitOrbit, 'i', 3);
  const portrait = document.createElement('img');
  portrait.className = 'xinyuehu-theme__portrait';
  portrait.src = XINYUEHU_ASSET_POSTER.replace(/xinyuehu-poster\.webp\?.*$/, 'xinyuehu-character-v2.png?rev=0.3.0');
  portrait.alt = '';
  portrait.decoding = 'async';
  portrait.fetchPriority = 'high';
  const tailFlame = document.createElement('span');
  tailFlame.className = 'xinyuehu-theme__tail-flame';
  appendRepeated(tailFlame, 'i', fullEffects ? 7 : 3);
  const resonanceNodes = document.createElement('span');
  resonanceNodes.className = 'xinyuehu-theme__resonance-nodes';
  appendRepeated(resonanceNodes, 'i', fullEffects ? 8 : 4);
  const portraitGlint = document.createElement('span');
  portraitGlint.className = 'xinyuehu-theme__portrait-glint';
  portraitFrame.append(portraitAura, portraitOrbit, tailFlame, portrait, portraitGlint, resonanceNodes);

  const fractal = document.createElement('div');
  fractal.className = 'xinyuehu-theme__fractal';
  appendRepeated(fractal, 'i', fullEffects ? 6 : 3);

  const lanterns = document.createElement('div');
  lanterns.className = 'xinyuehu-theme__lanterns';
  appendRepeated(lanterns, 'i', fullEffects ? 9 : 4);

  const clouds = document.createElement('div');
  clouds.className = 'xinyuehu-theme__clouds';
  clouds.append(document.createElement('i'), document.createElement('i'));

  let foxSparks = null;
  if (fullEffects) {
    foxSparks = document.createElement('div');
    foxSparks.className = 'xinyuehu-theme__fox-sparks';
    appendRepeated(foxSparks, 'i', 12);
  }

  scene.append(paper, terrace, moonGate, foldingScreen, portraitFrame, fractal, lanterns, clouds);
  if (foxSparks) scene.append(foxSparks);
  body.prepend(scene);

  const hudTop = createXinyuehuOwnedElement('div', 'xinyuehu-theme__hud xinyuehu-theme__hud--top');
  hudTop.setAttribute('aria-hidden', 'true');
  const hudTopMark = document.createElement('i');
  hudTopMark.className = 'xinyuehu-theme__hud-mark';
  hudTopMark.textContent = '心';
  const hudTopCopy = document.createElement('div');
  hudTopCopy.className = 'xinyuehu-theme__hud-copy';
  const hudTopLabel = document.createElement('span');
  hudTopLabel.textContent = 'MYRIAD MOON COURT · 07';
  const hudTopValue = document.createElement('strong');
  hudTopValue.textContent = '心月狐 · 万相分形';
  const hudTopMeta = document.createElement('small');
  hudTopMeta.textContent = fullEffects ? 'FOXFIRE LINK // FULL' : 'FOXFIRE LINK // STILL';
  hudTopCopy.append(hudTopLabel, hudTopValue, hudTopMeta);
  const hudTopSignal = document.createElement('div');
  hudTopSignal.className = 'xinyuehu-theme__hud-signal';
  appendRepeated(hudTopSignal, 'i', 5);
  hudTop.append(hudTopMark, hudTopCopy, hudTopSignal);

  const hudBottom = createXinyuehuOwnedElement('div', 'xinyuehu-theme__hud xinyuehu-theme__hud--bottom');
  hudBottom.setAttribute('aria-hidden', 'true');
  const hudBottomMark = document.createElement('i');
  hudBottomMark.className = 'xinyuehu-theme__hud-mark';
  hudBottomMark.textContent = '万';
  const hudBottomCopy = document.createElement('div');
  hudBottomCopy.className = 'xinyuehu-theme__hud-copy';
  const hudBottomLabel = document.createElement('span');
  hudBottomLabel.textContent = 'FRACTAL RESONANCE · ACTIVE';
  const hudBottomValue = document.createElement('strong');
  hudBottomValue.textContent = '灯随月转 · 狐影相生';
  const hudBottomMeta = document.createElement('small');
  hudBottomMeta.textContent = 'PHASE 07 / SYNC 99.7';
  hudBottomCopy.append(hudBottomLabel, hudBottomValue, hudBottomMeta);
  hudBottom.append(hudBottomMark, hudBottomCopy);

  body.append(hudTop, hudBottom);
  body.setAttribute(XINYUEHU_BODY_ATTR, '');
  document.title = '鸣潮 · 心月狐 | DeepSeek Harness';

  const updateThemeColor = () => {
    const isDark = body.hasAttribute('data-ds-dark-theme');
    themeColor.setAttribute('content', isDark ? '#193026' : '#eeece3');
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
      tagline: '玄方月苑、万相分形与梦州灯影',
      accent: '#b65045',
      order: 30,
      previewUrl: XINYUEHU_ASSET_POSTER,
      mount: mountXinyuehuTheme,
    }),
    'Register the Wuthering Waves Xinyuehu skin with the theme hub',
  );
}

exports.apply = apply;
