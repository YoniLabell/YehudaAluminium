/* ==============================
   Accessibility Widget – AluMaster
   WCAG 2.2 / ת"י 5568
   ============================== */
(function () {
  'use strict';

  const STORAGE_KEY = 'alumaster_a11y';
  const HTML = document.documentElement;

  // Default state
  const defaults = {
    fontSize: 0,       // 0=normal 1=lg 2=xl 3=xxl
    highContrast: false,
    grayscale: false,
    invert: false,
    links: false,
    spacing: false,
    noAnim: false,
    bigCursor: false,
  };

  let state = Object.assign({}, defaults);

  // Load saved prefs
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.assign(state, saved);
  } catch (e) { /* ignore */ }

  // ── Build Widget HTML ───────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'a11y-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.setAttribute('aria-label', 'פתח סרגל נגישות');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'a11y-panel');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="3.5" r="1.5"/>
    <path d="M19 6.5h-5.25l-.44-1H19v-2h-7.88L9.5 7.17V9h5v2H9.5v3.5l1.5 4.5H9l-1.5-4.5V9.5C7.5 8.12 8.62 7 10 7h2.5l.56 1.25L14 6.5h5v-2z"/>
    <path d="M9.91 16.97L8.5 21H11l1.5-4.5h-1.5l-.09-.53z"/>
  </svg>`;

  const panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'a11y-panel-title');
  panel.setAttribute('dir', 'rtl');

  panel.innerHTML = `
    <div class="a11y-header">
      <h2 id="a11y-panel-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="3.5" r="1.5"/><path d="M19 6.5h-5.25l-.44-1H19v-2h-7.88L9.5 7.17V9h5v2H9.5v3.5l1.5 4.5H9l-1.5-4.5V9.5C7.5 8.12 8.62 7 10 7h2.5l.56 1.25L14 6.5h5v-2z"/></svg>
        כלי נגישות
      </h2>
      <button id="a11y-close" aria-label="סגור סרגל נגישות">✕</button>
    </div>
    <div class="a11y-body">

      <div class="a11y-group-label">גודל טקסט</div>
      <div class="a11y-font-row">
        <button class="a11y-icon-btn" id="a11y-font-dec" aria-label="הקטן טקסט" title="הקטן טקסט">א–</button>
        <span id="a11y-font-label">רגיל</span>
        <button class="a11y-icon-btn" id="a11y-font-inc" aria-label="הגדל טקסט" title="הגדל טקסט">א+</button>
      </div>

      <div class="a11y-group-label">צבע ותצוגה</div>

      <div class="a11y-toggle-row" id="row-highContrast">
        <label for="a11y-hc">🔲 ניגודיות גבוהה</label>
        <div class="a11y-switch">
          <input type="checkbox" id="a11y-hc" role="switch" aria-checked="false" />
          <span class="a11y-switch-track" aria-hidden="true"></span>
        </div>
      </div>

      <div class="a11y-toggle-row" id="row-grayscale">
        <label for="a11y-gs">🩶 גווני אפור</label>
        <div class="a11y-switch">
          <input type="checkbox" id="a11y-gs" role="switch" aria-checked="false" />
          <span class="a11y-switch-track" aria-hidden="true"></span>
        </div>
      </div>

      <div class="a11y-toggle-row" id="row-invert">
        <label for="a11y-inv">🔄 הפיכת צבעים</label>
        <div class="a11y-switch">
          <input type="checkbox" id="a11y-inv" role="switch" aria-checked="false" />
          <span class="a11y-switch-track" aria-hidden="true"></span>
        </div>
      </div>

      <div class="a11y-group-label">קריאה וניווט</div>

      <div class="a11y-toggle-row" id="row-links">
        <label for="a11y-links">🔗 הדגש קישורים</label>
        <div class="a11y-switch">
          <input type="checkbox" id="a11y-links" role="switch" aria-checked="false" />
          <span class="a11y-switch-track" aria-hidden="true"></span>
        </div>
      </div>

      <div class="a11y-toggle-row" id="row-spacing">
        <label for="a11y-spacing">↔ מרווח טקסט מוגדל</label>
        <div class="a11y-switch">
          <input type="checkbox" id="a11y-spacing" role="switch" aria-checked="false" />
          <span class="a11y-switch-track" aria-hidden="true"></span>
        </div>
      </div>

      <div class="a11y-toggle-row" id="row-noAnim">
        <label for="a11y-anim">⏸ עצור אנימציות</label>
        <div class="a11y-switch">
          <input type="checkbox" id="a11y-anim" role="switch" aria-checked="false" />
          <span class="a11y-switch-track" aria-hidden="true"></span>
        </div>
      </div>

      <div class="a11y-toggle-row" id="row-bigCursor">
        <label for="a11y-cursor">🖱 סמן גדול</label>
        <div class="a11y-switch">
          <input type="checkbox" id="a11y-cursor" role="switch" aria-checked="false" />
          <span class="a11y-switch-track" aria-hidden="true"></span>
        </div>
      </div>

      <button class="a11y-reset" id="a11y-reset" aria-label="אפס את כל הגדרות הנגישות">↺ איפוס הכל</button>
    </div>
    <div class="a11y-footer">
      <a href="accessibility.html">הצהרת נגישות</a> &nbsp;|&nbsp;
      <a href="privacy.html">מדיניות פרטיות</a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ── Helpers ───────────────────────────────────────────────
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  const fontClasses = ['a11y-font-lg', 'a11y-font-xl', 'a11y-font-xxl'];
  const fontLabels  = ['רגיל', 'גדול', 'גדול יותר', 'גדול מאוד'];

  function applyAll() {
    // Font size
    fontClasses.forEach(c => HTML.classList.remove(c));
    if (state.fontSize > 0) HTML.classList.add(fontClasses[state.fontSize - 1]);
    document.getElementById('a11y-font-label').textContent = fontLabels[state.fontSize];

    // Toggles
    const map = {
      highContrast: 'a11y-high-contrast',
      grayscale:    'a11y-grayscale',
      invert:       'a11y-invert',
      links:        'a11y-links',
      spacing:      'a11y-spacing',
      noAnim:       'a11y-no-anim',
      bigCursor:    'a11y-big-cursor',
    };

    const cbMap = {
      highContrast: 'a11y-hc',
      grayscale:    'a11y-gs',
      invert:       'a11y-inv',
      links:        'a11y-links',
      spacing:      'a11y-spacing',
      noAnim:       'a11y-anim',
      bigCursor:    'a11y-cursor',
    };

    Object.keys(map).forEach(key => {
      HTML.classList.toggle(map[key], !!state[key]);
      const cb = document.getElementById(cbMap[key]);
      if (cb) {
        cb.checked = !!state[key];
        cb.setAttribute('aria-checked', String(!!state[key]));
      }
    });
  }

  // ── Open / Close ──────────────────────────────────────────
  let lastFocus = null;

  function openPanel() {
    lastFocus = document.activeElement;
    panel.classList.add('a11y-open');
    overlay.classList.add('a11y-open');
    btn.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
    document.getElementById('a11y-close').focus();
    document.addEventListener('keydown', trapFocus);
  }

  function closePanel() {
    panel.classList.remove('a11y-open');
    overlay.classList.remove('a11y-open');
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', trapFocus);
    if (lastFocus) lastFocus.focus();
  }

  function trapFocus(e) {
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key !== 'Tab') return;
    const focusable = panel.querySelectorAll(
      'button:not([disabled]), input, a[href], [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  btn.addEventListener('click', () => {
    panel.classList.contains('a11y-open') ? closePanel() : openPanel();
  });
  document.getElementById('a11y-close').addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  // ── Font size ─────────────────────────────────────────────
  document.getElementById('a11y-font-inc').addEventListener('click', () => {
    if (state.fontSize < 3) { state.fontSize++; applyAll(); save(); }
  });
  document.getElementById('a11y-font-dec').addEventListener('click', () => {
    if (state.fontSize > 0) { state.fontSize--; applyAll(); save(); }
  });

  // ── Toggle switches ───────────────────────────────────────
  const toggleDefs = [
    { cbId: 'a11y-hc',      key: 'highContrast' },
    { cbId: 'a11y-gs',      key: 'grayscale'    },
    { cbId: 'a11y-inv',     key: 'invert'       },
    { cbId: 'a11y-links',   key: 'links'        },
    { cbId: 'a11y-spacing', key: 'spacing'      },
    { cbId: 'a11y-anim',    key: 'noAnim'       },
    { cbId: 'a11y-cursor',  key: 'bigCursor'    },
  ];

  toggleDefs.forEach(({ cbId, key }) => {
    const cb = document.getElementById(cbId);
    if (!cb) return;
    cb.addEventListener('change', () => {
      state[key] = cb.checked;
      applyAll();
      save();
    });
    // Also allow clicking the row label to toggle
    const row = cb.closest('.a11y-toggle-row');
    if (row) {
      row.addEventListener('click', (e) => {
        if (e.target === cb || e.target.tagName === 'LABEL') return;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      });
    }
  });

  // ── Reset ─────────────────────────────────────────────────
  document.getElementById('a11y-reset').addEventListener('click', () => {
    state = Object.assign({}, defaults);
    applyAll();
    save();
  });

  // ── Init ──────────────────────────────────────────────────
  applyAll();

})();
