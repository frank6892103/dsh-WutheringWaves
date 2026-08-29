const ZHANGBEIHAI_PLUGIN_ID = '@dsh-external/dsh-client-ui-skin-threebody-zhangbeihai';
const ZHANGBEIHAI_BODY_ATTR = 'data-dsh-skin-zhangbeihai';
const ZHANGBEIHAI_OWNER_ATTR = 'data-zhangbeihai-theme-owned';

function createZhangbeihaiOwnedElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  element.setAttribute(ZHANGBEIHAI_OWNER_ATTR, ZHANGBEIHAI_PLUGIN_ID);
  return element;
}

function mountZhangbeihaiTheme() {
  const body = document.body;
  const head = document.head;
  if (!body || !head) throw new Error('Zhang Beihai theme requires document.body and document.head');
  const fullEffects = document.documentElement?.getAttribute('data-dsh-wuthering-performance') === 'full';

  document
    .querySelectorAll(`[${ZHANGBEIHAI_OWNER_ATTR}="${ZHANGBEIHAI_PLUGIN_ID}"]`)
    .forEach((node) => node.remove());

  const previousBodyAttr = body.getAttribute(ZHANGBEIHAI_BODY_ATTR);
  const previousTitle = document.title;
  const existingThemeColor = head.querySelector('meta[name="theme-color"]');
  const previousThemeColor = existingThemeColor?.getAttribute('content') ?? null;
  const themeColor = existingThemeColor ?? document.createElement('meta');
  const themeColorWasCreated = !existingThemeColor;

  if (themeColorWasCreated) {
    themeColor.setAttribute('name', 'theme-color');
    head.append(themeColor);
  }

  const style = createZhangbeihaiOwnedElement('style', 'zhangbeihai-theme__style');
  style.textContent = ZHANGBEIHAI_THEME_CSS;
  head.append(style);

  const scene = createZhangbeihaiOwnedElement('div', 'zhangbeihai-theme__scene');
  scene.setAttribute('aria-hidden', 'true');

  const artwork = document.createElement('img');
  artwork.className = 'zhangbeihai-theme__artwork';
  artwork.src = ZHANGBEIHAI_ASSET_BACKGROUND;
  artwork.alt = '';
  artwork.decoding = 'async';
  scene.append(artwork);

  const wash = document.createElement('div');
  wash.className = 'zhangbeihai-theme__wash';
  scene.append(wash);

  const portraitFrame = createZhangbeihaiOwnedElement('div', 'zhangbeihai-theme__portrait-frame');
  const portraitAura = document.createElement('span');
  portraitAura.className = 'zhangbeihai-theme__portrait-aura';
  const portraitOrbit = document.createElement('span');
  portraitOrbit.className = 'zhangbeihai-theme__portrait-orbit';
  portraitOrbit.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
  const portrait = document.createElement('img');
  portrait.className = 'zhangbeihai-theme__portrait';
  portrait.src = ZHANGBEIHAI_ASSET_CHARACTER;
  portrait.alt = '';
  portrait.decoding = 'async';
  const portraitScan = document.createElement('span');
  portraitScan.className = 'zhangbeihai-theme__portrait-scan';
  const portraitNodes = document.createElement('span');
  portraitNodes.className = 'zhangbeihai-theme__portrait-nodes';
  for (let index = 0; index < 5; index += 1) {
    const node = document.createElement('i');
    node.style.setProperty('--portrait-node-index', index);
    portraitNodes.append(node);
  }
  portraitFrame.append(portraitAura, portraitOrbit, portrait, portraitScan, portraitNodes);

  const commandGrid = document.createElement('div');
  commandGrid.className = 'zhangbeihai-theme__command-grid';
  scene.append(commandGrid);

  const horizon = document.createElement('div');
  horizon.className = 'zhangbeihai-theme__horizon';
  horizon.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
  scene.append(horizon);

  const course = document.createElement('div');
  course.className = 'zhangbeihai-theme__course';
  for (let index = 0; index < 5; index += 1) {
    const node = document.createElement('i');
    node.style.setProperty('--course-index', index);
    course.append(node);
  }
  scene.append(course);

  const starfield = document.createElement('div');
  starfield.className = 'zhangbeihai-theme__starfield';
  for (let index = 0; index < (fullEffects ? 42 : 12); index += 1) {
    const star = document.createElement('i');
    star.style.setProperty('--star-index', index);
    star.style.setProperty('--star-left', `${(index * 37 + 11) % 100}%`);
    star.style.setProperty('--star-top', `${(index * 53 + 7) % 78}%`);
    star.style.setProperty('--star-size', `${1 + (index % 3)}px`);
    star.style.setProperty('--star-delay', `${-(index % 11) * 0.7}s`);
    starfield.append(star);
  }
  scene.append(starfield);

  const decision = document.createElement('div');
  decision.className = 'zhangbeihai-theme__decision';
  decision.append(document.createElement('i'), document.createElement('i'));
  portraitFrame.insertBefore(decision, portrait);

  const trisolaris = createZhangbeihaiOwnedElement('div', 'zhangbeihai-theme__trisolaris');
  trisolaris.setAttribute('aria-hidden', 'true');
  const trisolarOrbit = document.createElement('div');
  trisolarOrbit.className = 'zhangbeihai-theme__trisolar-orbit';
  trisolarOrbit.append(
    document.createElement('i'),
    document.createElement('i'),
    document.createElement('i'),
    document.createElement('b'),
  );
  const trisolarCopy = document.createElement('div');
  const trisolarEyebrow = document.createElement('span');
  trisolarEyebrow.textContent = 'TRISOLARIS / CHAOTIC ORBIT';
  const trisolarTitle = document.createElement('strong');
  trisolarTitle.textContent = '三体恒星系统';
  const trisolarMeta = document.createElement('small');
  trisolarMeta.textContent = '危机纪元 208 · HUMAN FLEET LINK';
  trisolarCopy.append(trisolarEyebrow, trisolarTitle, trisolarMeta);
  trisolaris.append(trisolarOrbit, trisolarCopy);

  if (fullEffects) {
    const dust = document.createElement('div');
    dust.className = 'zhangbeihai-theme__dust';
    for (let index = 0; index < 16; index += 1) {
      const particle = document.createElement('i');
      particle.style.setProperty('--dust-index', index);
      particle.style.setProperty('--dust-left', `${(index * 29 + 4) % 100}%`);
      particle.style.setProperty('--dust-delay', `${-(index % 8) * 1.3}s`);
      particle.style.setProperty('--dust-duration', `${12 + (index % 6) * 2}s`);
      dust.append(particle);
    }
    scene.append(dust);

    const transit = document.createElement('div');
    transit.className = 'zhangbeihai-theme__transit';
    scene.append(transit);
  }

  const brand = createZhangbeihaiOwnedElement('div', 'zhangbeihai-theme__brand');
  const brandIndex = document.createElement('span');
  brandIndex.textContent = 'HUMAN FLEET / COMMAND RECORD 07';
  const brandName = document.createElement('strong');
  brandName.textContent = '章 北 海';
  const brandTagline = document.createElement('small');
  brandTagline.textContent = '自然选择号执行舰长 · 危机纪元 208';
  brand.append(brandIndex, brandName, brandTagline);
  portraitFrame.append(brand);

  const dossier = createZhangbeihaiOwnedElement('div', 'zhangbeihai-theme__dossier');
  dossier.setAttribute('aria-hidden', 'true');
  const dossierEyebrow = document.createElement('span');
  dossierEyebrow.textContent = 'NATURAL SELECTION / COMMAND AUTHORITY';
  const dossierMain = document.createElement('strong');
  dossierMain.textContent = '自然选择 · 前进四';
  const dossierMeta = document.createElement('small');
  dossierMeta.textContent = fullEffects ? 'ESCAPE VECTOR / ACTIVE' : 'ESCAPE VECTOR / ARMED';
  const dossierTrack = document.createElement('div');
  dossierTrack.className = 'zhangbeihai-theme__dossier-track';
  dossierTrack.append(
    document.createElement('i'),
    document.createElement('i'),
    document.createElement('i'),
    document.createElement('b'),
  );
  const dossierFoot = document.createElement('em');
  dossierFoot.textContent = 'COURSE 120.0° · STELLAR CLASS';
  dossier.append(dossierEyebrow, dossierMain, dossierMeta, dossierTrack, dossierFoot);

  const bearing = createZhangbeihaiOwnedElement('div', 'zhangbeihai-theme__bearing');
  bearing.setAttribute('aria-hidden', 'true');
  const bearingMark = document.createElement('i');
  bearingMark.append(document.createElement('b'), document.createElement('b'), document.createElement('b'));
  const bearingCopy = document.createElement('div');
  const bearingLabel = document.createElement('span');
  bearingLabel.textContent = '危机纪元 208';
  const bearingValue = document.createElement('strong');
  bearingValue.textContent = '黑暗森林广播';
  const bearingMeta = document.createElement('small');
  bearingMeta.textContent = '187J3X1 / LISTENING';
  bearingCopy.append(bearingLabel, bearingValue, bearingMeta);
  bearing.append(bearingMark, bearingCopy);

  body.prepend(scene);
  body.append(portraitFrame, trisolaris, dossier, bearing);
  body.setAttribute(ZHANGBEIHAI_BODY_ATTR, '');
  document.title = '三体 · 章北海 | DeepSeek Harness';

  const updateThemeColor = () => {
    const isDark = body.hasAttribute('data-ds-dark-theme');
    themeColor.setAttribute('content', isDark ? '#091119' : '#e7e7e2');
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
      .querySelectorAll(`[${ZHANGBEIHAI_OWNER_ATTR}="${ZHANGBEIHAI_PLUGIN_ID}"]`)
      .forEach((node) => node.remove());

    if (previousBodyAttr === null) {
      body.removeAttribute(ZHANGBEIHAI_BODY_ATTR);
    } else {
      body.setAttribute(ZHANGBEIHAI_BODY_ATTR, previousBodyAttr);
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
      id: 'threebody-zhangbeihai',
      name: '三体 · 章北海',
      tagline: '危机纪元、三恒星混沌轨道与不可逆的星际航向',
      accent: '#b64f46',
      order: 50,
      previewUrl: ZHANGBEIHAI_ASSET_PREVIEW,
      mount: mountZhangbeihaiTheme,
    }),
    'Register the Three-Body Zhang Beihai skin with the theme hub',
  );
}

exports.apply = apply;
