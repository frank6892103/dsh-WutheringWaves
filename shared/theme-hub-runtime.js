const WUTHERING_THEME_HUB_GLOBAL = '__DSH_WUTHERING_THEME_HUB__';
const WUTHERING_THEME_STORAGE_KEY = 'dsh.wuthering-waves.active-theme.v1';
const WUTHERING_PERFORMANCE_STORAGE_KEY = 'dsh.wuthering-waves.performance.v1';
const WUTHERING_POSITION_STORAGE_KEY = 'dsh.wuthering-waves.theme-hub-position.v1';
const WUTHERING_PERFORMANCE_ATTR = 'data-dsh-wuthering-performance';
const WUTHERING_OFFICIAL_THEME_ID = 'official';
const WUTHERING_HUB_OWNER_ATTR = 'data-dsh-wuthering-theme-hub-owned';
const HUB_DRAG_THRESHOLD = 4;
const HUB_VIEWPORT_MARGIN = 8;
const DRAG_LISTENER_OPTIONS = { capture: true, passive: false };

function createWutheringThemeHub() {
  const themes = new Map();
  const subscribers = new Set();
  let requestedId = readStoredThemeId();
  let performanceMode = readStoredPerformanceMode();
  let activeId = WUTHERING_OFFICIAL_THEME_ID;
  let activeCleanup = () => {};
  let root;
  let trigger;
  let panel;
  let list;
  let liveRegion;
  let performanceButton;
  let style;
  let open = false;
  let switching = false;
  let placed = false;
  let drag;
  let ignoreTriggerClick = false;

  function readStoredThemeId() {
    try {
      const stored = window.localStorage.getItem(WUTHERING_THEME_STORAGE_KEY);
      if (stored) return stored;
    } catch {
      // Fall through to the same-origin cookie used by embedded browsers.
    }
    try {
      const prefix = `${encodeURIComponent(WUTHERING_THEME_STORAGE_KEY)}=`;
      const cookie = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
      return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : WUTHERING_OFFICIAL_THEME_ID;
    } catch {
      return WUTHERING_OFFICIAL_THEME_ID;
    }
  }

  function writeStoredThemeId(id) {
    try {
      window.localStorage.setItem(WUTHERING_THEME_STORAGE_KEY, id);
    } catch {
      // Storage can be unavailable in hardened or private browser contexts.
    }
    try {
      const expires = new Date(Date.now() + 31_536_000_000).toUTCString();
      document.cookie = `${encodeURIComponent(WUTHERING_THEME_STORAGE_KEY)}=${encodeURIComponent(id)}; Path=/; Expires=${expires}; SameSite=Lax`;
    } catch {
      // Cookie persistence is a fallback for embedded browsers without localStorage.
    }
  }

  function readStoredPerformanceMode() {
    try {
      const stored = window.localStorage.getItem(WUTHERING_PERFORMANCE_STORAGE_KEY);
      if (stored === 'full' || stored === 'economy') return stored;
    } catch {
      // The performance profile remains usable without persistent storage.
    }
    return 'economy';
  }

  function writeStoredPerformanceMode(mode) {
    try {
      window.localStorage.setItem(WUTHERING_PERFORMANCE_STORAGE_KEY, mode);
    } catch {
      // The in-memory choice still applies for the current page.
    }
  }

  function applyPerformanceMode() {
    document.documentElement?.setAttribute(WUTHERING_PERFORMANCE_ATTR, performanceMode);
  }

  function readStoredPosition() {
    try {
      const raw = window.localStorage.getItem(WUTHERING_POSITION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const left = Number(parsed?.left);
      const top = Number(parsed?.top);
      if (!Number.isFinite(left) || !Number.isFinite(top)) return null;
      return { left, top };
    } catch {
      return null;
    }
  }

  function writeStoredPosition(position) {
    try {
      if (!position) {
        window.localStorage.removeItem(WUTHERING_POSITION_STORAGE_KEY);
        return;
      }
      window.localStorage.setItem(WUTHERING_POSITION_STORAGE_KEY, JSON.stringify({
        left: Math.round(position.left),
        top: Math.round(position.top),
      }));
    } catch {
      // The in-memory placement still applies for the current page.
    }
  }

  function viewportBox() {
    return {
      width: window.innerWidth || document.documentElement?.clientWidth || 0,
      height: window.innerHeight || document.documentElement?.clientHeight || 0,
    };
  }

  function hubSize() {
    const rect = root?.getBoundingClientRect?.();
    return {
      width: rect?.width || 142,
      height: rect?.height || 42,
    };
  }

  function clampHubPosition(left, top) {
    const { width, height } = viewportBox();
    const size = hubSize();
    if (!width || !height) return { left, top };
    const maxLeft = Math.max(HUB_VIEWPORT_MARGIN, width - size.width - HUB_VIEWPORT_MARGIN);
    const maxTop = Math.max(HUB_VIEWPORT_MARGIN, height - size.height - HUB_VIEWPORT_MARGIN);
    return {
      left: Math.min(Math.max(HUB_VIEWPORT_MARGIN, left), maxLeft),
      top: Math.min(Math.max(HUB_VIEWPORT_MARGIN, top), maxTop),
    };
  }

  function updatePanelAnchor() {
    if (!root) return;
    const rect = root.getBoundingClientRect?.();
    const { width, height } = viewportBox();
    if (!rect || !width || !height) return;
    const panelWidth = Math.min(380, Math.max(0, width - 24));
    const spaceAbove = Math.max(0, rect.top - HUB_VIEWPORT_MARGIN);
    const spaceBelow = Math.max(0, height - rect.bottom - HUB_VIEWPORT_MARGIN);
    const spaceLeft = Math.max(0, rect.right - HUB_VIEWPORT_MARGIN);
    const spaceRight = Math.max(0, width - rect.left - HUB_VIEWPORT_MARGIN);
    const placeBelow = spaceBelow > spaceAbove;
    const placeStart = spaceLeft < panelWidth && spaceRight > spaceLeft;
    root.classList.toggle('dsh-theme-hub--panel-below', placeBelow);
    root.classList.toggle('dsh-theme-hub--panel-start', placeStart);
    const room = Math.max(140, (placeBelow ? spaceBelow : spaceAbove) - 10);
    root.style.setProperty('--dsh-theme-hub-panel-max', `${Math.min(580, room)}px`);
  }

  function applyHubPosition(position, persist = false) {
    if (!root || !position) return null;
    const next = clampHubPosition(position.left, position.top);
    root.style.left = `${next.left}px`;
    root.style.top = `${next.top}px`;
    root.style.right = 'auto';
    root.style.bottom = 'auto';
    root.classList.add('dsh-theme-hub--placed');
    placed = true;
    updatePanelAnchor();
    if (persist) writeStoredPosition(next);
    return next;
  }

  function isDragHandle(target) {
    if (!target || typeof target.closest !== 'function') return false;
    if (target.closest('.dsh-theme-hub__option, .dsh-theme-hub__performance, .dsh-theme-hub__list')) return false;
    return Boolean(target.closest('.dsh-theme-hub__trigger, .dsh-theme-hub__grip, .dsh-theme-hub__heading, .dsh-theme-hub__subheading, .dsh-theme-hub__panel'));
  }

  function onDragPointerDown(event) {
    if (!root || event.button !== 0 || event.isPrimary === false || !isDragHandle(event.target)) return;
    const rect = root.getBoundingClientRect();
    drag = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      left: rect.left,
      top: rect.top,
      moved: false,
      fromTrigger: Boolean(event.target.closest?.('.dsh-theme-hub__trigger')),
    };
  }

  function onDragPointerMove(event) {
    if (!drag || event.pointerId !== drag.pointerId || !root) return;
    const dx = event.clientX - drag.originX;
    const dy = event.clientY - drag.originY;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < HUB_DRAG_THRESHOLD) return;
      drag.moved = true;
      root.classList.add('dsh-theme-hub--dragging');
      try { root.setPointerCapture(event.pointerId); } catch { /* Capture is optional. */ }
    }
    applyHubPosition({ left: drag.left + dx, top: drag.top + dy });
    event.preventDefault?.();
  }

  function finishDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const moved = drag.moved;
    const fromTrigger = drag.fromTrigger;
    drag = undefined;
    root?.classList.remove('dsh-theme-hub--dragging');
    if (!moved || !root) {
      updatePanelAnchor();
      return;
    }
    const rect = root.getBoundingClientRect();
    applyHubPosition({ left: rect.left, top: rect.top }, true);
    if (fromTrigger && event.type !== 'pointercancel') {
      ignoreTriggerClick = true;
      window.setTimeout(() => { ignoreTriggerClick = false; }, 0);
    }
  }

  function onTriggerClick(event) {
    if (ignoreTriggerClick) {
      ignoreTriggerClick = false;
      event.preventDefault?.();
      event.stopPropagation?.();
      return;
    }
    setOpen(!open);
  }

  function onViewportResize() {
    if (!root) return;
    if (!placed) {
      updatePanelAnchor();
      return;
    }
    const rect = root.getBoundingClientRect();
    applyHubPosition({ left: rect.left, top: rect.top }, true);
  }

  function announce(message) {
    if (!liveRegion) return;
    liveRegion.textContent = '';
    window.setTimeout(() => {
      if (liveRegion) liveRegion.textContent = message;
    }, 0);
  }

  function emit(reason, error) {
    const snapshot = api.getSnapshot();
    subscribers.forEach((subscriber) => subscriber(snapshot));
    if (typeof window.CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('dsh:wuthering-theme-change', {
        detail: { ...snapshot, reason, error: error ? String(error.message || error) : undefined },
      }));
    }
  }

  function setOpen(nextOpen) {
    open = Boolean(nextOpen);
    if (!trigger || !panel) return;
    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    root?.classList.toggle('dsh-theme-hub--open', open);
    if (open) {
      hydratePreviews();
      updatePanelAnchor();
      panel.querySelector('.dsh-theme-hub__option[aria-pressed="true"]')?.focus();
    }
  }

  function hydratePreviews() {
    if (!list) return;
    list.querySelectorAll('[data-preview-url]').forEach((preview) => {
      preview.style.backgroundImage = `url("${preview.dataset.previewUrl}")`;
      preview.removeAttribute('data-preview-url');
    });
  }

  function createThemeButton(id, name, tagline, accent, previewUrl) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dsh-theme-hub__option';
    button.dataset.themeId = id;
    button.setAttribute('aria-pressed', String(activeId === id));
    button.style.setProperty('--dsh-theme-option-accent', accent || '#8aa4bd');

    const preview = document.createElement('span');
    preview.className = 'dsh-theme-hub__preview';
    if (previewUrl) preview.dataset.previewUrl = previewUrl;
    preview.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('span');
    copy.className = 'dsh-theme-hub__copy';
    const title = document.createElement('strong');
    title.textContent = name;
    const description = document.createElement('small');
    description.textContent = tagline;
    copy.append(title, description);

    const check = document.createElement('span');
    check.className = 'dsh-theme-hub__check';
    check.textContent = activeId === id ? '✓' : '';
    check.setAttribute('aria-hidden', 'true');
    button.append(preview, copy, check);
    button.addEventListener('click', () => {
      api.setActive(id);
      setOpen(false);
      trigger?.focus();
    });
    return button;
  }

  function render() {
    if (!root || !list || !trigger) return;
    const activeTheme = themes.get(activeId);
    trigger.querySelector('.dsh-theme-hub__trigger-label').textContent = activeTheme?.name || '官方外观';
    if (performanceButton) {
      const full = performanceMode === 'full';
      performanceButton.setAttribute('aria-pressed', String(full));
      performanceButton.textContent = full ? '动态效果：完整' : '动态效果：省资源';
    }
    list.replaceChildren(
      createThemeButton(
        WUTHERING_OFFICIAL_THEME_ID,
        '官方默认',
        '保留 DSH 原生外观与明暗设置',
        '#8aa4bd',
      ),
      ...[...themes.values()]
        .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name))
        .map((theme) => createThemeButton(
          theme.id,
          theme.name,
          theme.tagline,
          theme.accent,
          theme.previewUrl,
        )),
    );
    if (open) hydratePreviews();
  }

  function installUi() {
    if (root || !document.body || !document.head) return;
    document
      .querySelectorAll(`[${WUTHERING_HUB_OWNER_ATTR}="true"]`)
      .forEach((node) => node.remove());

    style = document.createElement('style');
    style.setAttribute(WUTHERING_HUB_OWNER_ATTR, 'true');
    style.textContent = `
      .dsh-theme-hub { position: fixed; right: 18px; bottom: 60px; z-index: 2147483000; color: #eef7ff; font-family: Inter, "Microsoft YaHei", system-ui, sans-serif; }
      .dsh-theme-hub, .dsh-theme-hub * { box-sizing: border-box; }
      .dsh-theme-hub__trigger { min-width: 142px; height: 42px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 15px; border: 1px solid rgba(175, 217, 255, .3); border-radius: 999px; color: #f7fbff; background: linear-gradient(135deg, rgba(19, 29, 52, .94), rgba(40, 28, 69, .92)); box-shadow: 0 12px 36px rgba(4, 8, 24, .34), inset 0 1px rgba(255,255,255,.12); font: 600 12px/1 inherit; letter-spacing: .02em; cursor: grab; touch-action: none; backdrop-filter: blur(18px) saturate(1.25); }
      .dsh-theme-hub__trigger:hover { border-color: rgba(195, 229, 255, .62); transform: translateY(-1px); }
      .dsh-theme-hub__trigger-mark { width: 15px; height: 15px; border: 1px solid #aadaff; border-radius: 50% 46% 52% 45%; box-shadow: 0 0 12px rgba(124, 213, 255, .72); transform: rotate(28deg); }
      .dsh-theme-hub__panel { position: absolute; right: 0; bottom: 52px; width: min(380px, calc(100vw - 24px)); max-height: min(580px, var(--dsh-theme-hub-panel-max, calc(100vh - 134px))); overflow: auto; padding: 16px; border: 1px solid rgba(178, 213, 255, .24); border-radius: 22px; background: linear-gradient(145deg, rgba(9, 16, 35, .97), rgba(29, 20, 54, .96)); box-shadow: 0 24px 80px rgba(0, 0, 18, .5), inset 0 1px rgba(255,255,255,.1); backdrop-filter: blur(24px) saturate(1.25); }
      .dsh-theme-hub--panel-below .dsh-theme-hub__panel { top: 52px; bottom: auto; }
      .dsh-theme-hub--panel-start .dsh-theme-hub__panel { left: 0; right: auto; }
      .dsh-theme-hub__grip { display: block; width: 36px; height: 4px; margin: 0 auto 10px; border-radius: 999px; background: rgba(217, 232, 248, .38); cursor: grab; touch-action: none; }
      .dsh-theme-hub__heading, .dsh-theme-hub__subheading { cursor: grab; touch-action: none; user-select: none; }
      .dsh-theme-hub--dragging { user-select: none; }
      .dsh-theme-hub--dragging .dsh-theme-hub__trigger { transform: none; }
      .dsh-theme-hub--dragging .dsh-theme-hub__trigger, .dsh-theme-hub--dragging .dsh-theme-hub__grip, .dsh-theme-hub--dragging .dsh-theme-hub__heading, .dsh-theme-hub--dragging .dsh-theme-hub__subheading { cursor: grabbing; }
      .dsh-theme-hub__panel[hidden] { display: none; }
      .dsh-theme-hub__heading { margin: 0 0 4px; color: #f7fbff; font: 650 17px/1.35 inherit; }
      .dsh-theme-hub__subheading { margin: 0 0 14px; color: rgba(217, 232, 248, .62); font: 400 12px/1.5 inherit; }
      .dsh-theme-hub__performance { width: 100%; margin: 0 0 12px; padding: 7px 10px; border: 1px solid rgba(181, 206, 239, .16); border-radius: 10px; color: rgba(226, 238, 250, .78); background: rgba(255,255,255,.045); font: 500 11px/1.35 inherit; cursor: pointer; }
      .dsh-theme-hub__performance:hover { border-color: rgba(195, 229, 255, .42); background: rgba(255,255,255,.075); }
      .dsh-theme-hub__list { display: grid; gap: 9px; }
      .dsh-theme-hub__option { width: 100%; min-height: 72px; display: grid; grid-template-columns: 78px 1fr 22px; align-items: center; gap: 12px; padding: 8px; border: 1px solid rgba(181, 206, 239, .14); border-radius: 16px; color: inherit; text-align: left; background: rgba(255,255,255,.045); cursor: pointer; }
      .dsh-theme-hub__option:hover { background: rgba(255,255,255,.085); border-color: color-mix(in srgb, var(--dsh-theme-option-accent) 55%, transparent); }
      .dsh-theme-hub__option[aria-pressed="true"] { border-color: var(--dsh-theme-option-accent); background: color-mix(in srgb, var(--dsh-theme-option-accent) 15%, rgba(255,255,255,.035)); box-shadow: inset 3px 0 var(--dsh-theme-option-accent); }
      .dsh-theme-hub__preview { height: 54px; border-radius: 11px; background: radial-gradient(circle at 55% 35%, color-mix(in srgb, var(--dsh-theme-option-accent) 65%, white), transparent 20%), linear-gradient(135deg, color-mix(in srgb, var(--dsh-theme-option-accent) 45%, #11182d), #111425); background-size: cover; background-position: center 24%; box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); }
      .dsh-theme-hub__copy { min-width: 0; display: grid; gap: 4px; }
      .dsh-theme-hub__copy strong { overflow: hidden; color: #f7fbff; font: 600 13px/1.35 inherit; text-overflow: ellipsis; white-space: nowrap; }
      .dsh-theme-hub__copy small { display: -webkit-box; overflow: hidden; color: rgba(217, 232, 248, .62); font: 400 11px/1.45 inherit; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
      .dsh-theme-hub__check { color: var(--dsh-theme-option-accent); font-size: 17px; text-align: center; text-shadow: 0 0 12px var(--dsh-theme-option-accent); }
      .dsh-theme-hub__live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }
      @media (max-width: 900px) { .dsh-theme-hub { right: 14px; bottom: 18px; } }
      @media (max-width: 640px) { .dsh-theme-hub { right: 10px; bottom: 10px; } .dsh-theme-hub__trigger { min-width: 42px; width: 42px; padding: 0; } .dsh-theme-hub__trigger-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); } .dsh-theme-hub__panel { bottom: 50px; } }
      @media (prefers-reduced-motion: no-preference) { .dsh-theme-hub__trigger, .dsh-theme-hub__option { transition: transform .18s ease, border-color .18s ease, background .18s ease; } .dsh-theme-hub--open .dsh-theme-hub__panel { animation: dsh-theme-hub-enter .18s ease-out both; } @keyframes dsh-theme-hub-enter { from { opacity: 0; transform: translateY(8px) scale(.985); } } }
      html[${WUTHERING_PERFORMANCE_ATTR}="economy"] .dsh-theme-hub__trigger, html[${WUTHERING_PERFORMANCE_ATTR}="economy"] .dsh-theme-hub__panel { backdrop-filter: none; }
      html[${WUTHERING_PERFORMANCE_ATTR}="economy"] .dsh-theme-hub__trigger, html[${WUTHERING_PERFORMANCE_ATTR}="economy"] .dsh-theme-hub__option, html[${WUTHERING_PERFORMANCE_ATTR}="economy"] .dsh-theme-hub__panel { animation: none; transition: none; }
    `;
    document.head.append(style);

    root = document.createElement('div');
    root.className = 'dsh-theme-hub';
    root.setAttribute(WUTHERING_HUB_OWNER_ATTR, 'true');
    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'dsh-theme-hub__trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', '切换界面主题');
    trigger.title = '点击切换主题，拖动可移动位置';
    trigger.draggable = false;
    const triggerMark = document.createElement('span');
    triggerMark.className = 'dsh-theme-hub__trigger-mark';
    triggerMark.setAttribute('aria-hidden', 'true');
    const triggerLabel = document.createElement('span');
    triggerLabel.className = 'dsh-theme-hub__trigger-label';
    trigger.append(triggerMark, triggerLabel);

    panel = document.createElement('section');
    panel.className = 'dsh-theme-hub__panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '主题切换');
    panel.hidden = true;
    const grip = document.createElement('span');
    grip.className = 'dsh-theme-hub__grip';
    grip.title = '拖动可移动主题中心';
    grip.setAttribute('aria-hidden', 'true');
    const heading = document.createElement('h2');
    heading.className = 'dsh-theme-hub__heading';
    heading.textContent = '主题中心';
    const subheading = document.createElement('p');
    subheading.className = 'dsh-theme-hub__subheading';
    subheading.textContent = '多个主题可同时安装，任一时刻仅启用一个。';
    performanceButton = document.createElement('button');
    performanceButton.type = 'button';
    performanceButton.className = 'dsh-theme-hub__performance';
    performanceButton.addEventListener('click', () => {
      api.setPerformance(performanceMode === 'full' ? 'economy' : 'full');
    });
    list = document.createElement('div');
    list.className = 'dsh-theme-hub__list';
    liveRegion = document.createElement('span');
    liveRegion.className = 'dsh-theme-hub__live';
    liveRegion.setAttribute('aria-live', 'polite');
    panel.append(grip, heading, subheading, performanceButton, list, liveRegion);
    root.append(trigger, panel);
    document.body.append(root);

    trigger.addEventListener('click', onTriggerClick);
    root.addEventListener('pointerdown', onDragPointerDown);
    document.addEventListener('pointerdown', onOutsidePointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointermove', onDragPointerMove, DRAG_LISTENER_OPTIONS);
    document.addEventListener('pointerup', finishDrag, true);
    document.addEventListener('pointercancel', finishDrag, true);
    window.addEventListener?.('resize', onViewportResize);
    const storedPosition = readStoredPosition();
    if (storedPosition) applyHubPosition(storedPosition);
    else updatePanelAnchor();
    render();
  }

  function onOutsidePointerDown(event) {
    if (open && root && !root.contains(event.target)) setOpen(false);
  }

  function onKeyDown(event) {
    if (open && event.key === 'Escape') {
      setOpen(false);
      trigger?.focus();
    }
  }

  function destroyUi() {
    document.removeEventListener?.('pointerdown', onOutsidePointerDown, true);
    document.removeEventListener?.('keydown', onKeyDown, true);
    document.removeEventListener?.('pointermove', onDragPointerMove, DRAG_LISTENER_OPTIONS);
    document.removeEventListener?.('pointerup', finishDrag, true);
    document.removeEventListener?.('pointercancel', finishDrag, true);
    window.removeEventListener?.('resize', onViewportResize);
    drag = undefined;
    placed = false;
    ignoreTriggerClick = false;
    root?.remove();
    style?.remove();
    root = undefined;
    trigger = undefined;
    panel = undefined;
    list = undefined;
    liveRegion = undefined;
    performanceButton = undefined;
    style = undefined;
    open = false;
    if (document.documentElement?.getAttribute(WUTHERING_PERFORMANCE_ATTR) === performanceMode) {
      document.documentElement.removeAttribute(WUTHERING_PERFORMANCE_ATTR);
    }
  }

  function reconcile(reason, force = false) {
    if (switching) return;
    const target = themes.get(requestedId);
    const nextActiveId = target ? target.id : WUTHERING_OFFICIAL_THEME_ID;
    if (nextActiveId === activeId && !force) {
      render();
      return;
    }

    switching = true;
    const previousId = activeId;
    const previousTheme = themes.get(previousId);
    const previousCleanup = activeCleanup;
    previousCleanup();
    activeCleanup = () => {};
    activeId = WUTHERING_OFFICIAL_THEME_ID;

    try {
      if (target) {
        const cleanup = target.mount();
        activeCleanup = typeof cleanup === 'function' ? cleanup : () => {};
        activeId = target.id;
      }
      announce(`${target?.name || '官方默认'}主题已启用`);
      emit(reason);
    } catch (error) {
      try {
        if (previousTheme) {
          const cleanup = previousTheme.mount();
          activeCleanup = typeof cleanup === 'function' ? cleanup : () => {};
          activeId = previousId;
        }
      } catch {
        activeCleanup = () => {};
        activeId = WUTHERING_OFFICIAL_THEME_ID;
      }
      requestedId = activeId;
      writeStoredThemeId(requestedId);
      announce('主题切换失败，已恢复上一个主题');
      emit('rollback', error);
      window.console?.error?.('[DSH theme hub] theme switch failed and was rolled back', error);
    } finally {
      switching = false;
      render();
    }
  }

  const api = {
    storageKey: WUTHERING_THEME_STORAGE_KEY,
    performanceStorageKey: WUTHERING_PERFORMANCE_STORAGE_KEY,
    positionStorageKey: WUTHERING_POSITION_STORAGE_KEY,
    officialThemeId: WUTHERING_OFFICIAL_THEME_ID,
    register(theme) {
      if (!theme || typeof theme.id !== 'string' || !theme.id || theme.id === WUTHERING_OFFICIAL_THEME_ID) {
        throw new TypeError('theme.register requires a non-official string id');
      }
      if (typeof theme.mount !== 'function') throw new TypeError(`theme "${theme.id}" requires mount()`);
      if (themes.has(theme.id)) throw new Error(`theme "${theme.id}" is already registered`);
      const normalized = {
        accent: '#8aa4bd',
        name: theme.id,
        order: 100,
        previewUrl: '',
        tagline: '',
        ...theme,
      };
      themes.set(normalized.id, normalized);
      applyPerformanceMode();
      installUi();
      reconcile('register');
      render();

      let disposed = false;
      return () => {
        if (disposed) return;
        disposed = true;
        if (activeId === normalized.id) {
          activeCleanup();
          activeCleanup = () => {};
          activeId = WUTHERING_OFFICIAL_THEME_ID;
          if (requestedId === normalized.id) {
            requestedId = WUTHERING_OFFICIAL_THEME_ID;
            writeStoredThemeId(requestedId);
          }
        }
        themes.delete(normalized.id);
        emit('unregister');
        if (themes.size === 0) {
          destroyUi();
          delete window[WUTHERING_THEME_HUB_GLOBAL];
        } else {
          reconcile('unregister');
          render();
        }
      };
    },
    setActive(id) {
      if (id !== WUTHERING_OFFICIAL_THEME_ID && !themes.has(id)) {
        throw new Error(`theme "${id}" is not registered`);
      }
      requestedId = id;
      writeStoredThemeId(id);
      reconcile('user');
    },
    list() {
      return [
        { id: WUTHERING_OFFICIAL_THEME_ID, name: '官方默认', order: -1 },
        ...[...themes.values()].map(({ mount, ...theme }) => ({ ...theme })),
      ];
    },
    getActive() {
      return activeId;
    },
    getPerformance() {
      return performanceMode;
    },
    getPosition() {
      return readStoredPosition();
    },
    setPerformance(mode) {
      if (mode !== 'economy' && mode !== 'full') {
        throw new TypeError('theme.setPerformance requires "economy" or "full"');
      }
      if (mode === performanceMode) return;
      performanceMode = mode;
      writeStoredPerformanceMode(mode);
      applyPerformanceMode();
      reconcile('performance', true);
      announce(mode === 'economy' ? '省资源模式已启用' : '完整动态效果已启用');
    },
    getSnapshot() {
      return Object.freeze({
        activeId,
        performanceMode,
        requestedId,
        themes: Object.freeze(api.list()),
      });
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  };

  return api;
}

function getWutheringThemeHub() {
  if (!window[WUTHERING_THEME_HUB_GLOBAL]) {
    window[WUTHERING_THEME_HUB_GLOBAL] = createWutheringThemeHub();
  }
  return window[WUTHERING_THEME_HUB_GLOBAL];
}
