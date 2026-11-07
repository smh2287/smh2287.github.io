// Comments drawer for project pages (fullscreen swiper layouts).
// Usage: <script src="/assets/pf-comments-drawer.js" defer></script>
// Optional: data-project="id" (default: derived from the URL path, e.g. /projects/iac2022kia/tess/ -> iac2022kia-tess)
//           data-api="https://..." (comments backend origin)
(() => {
  const script = document.currentScript;
  const API = (script.dataset.api || 'https://s-home.catfish-teeth.ts.net').replace(/\/$/, '');
  const project = script.dataset.project || location.pathname
    .replace(/^\/projects\//, '').replace(/\/(index\.html)?$/, '').replace(/\.html$/, '')
    .toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64) || 'home';

  const css = `
  .pfd-btn { position: fixed; right: 20px; bottom: 20px; z-index: 10040; height: 42px; padding: 0 16px;
    border: 1px solid rgba(255,255,255,.18); background: rgba(18,20,22,.78); color: #eef3f5; cursor: pointer;
    font: 400 13px/1 'Montserrat', sans-serif; letter-spacing: .8px; display: flex; align-items: center; gap: 8px;
    backdrop-filter: blur(6px); transition: border-color .2s, opacity .2s; }
  .pfd-btn:hover { border-color: var(--accent, #1FFFE0); }
  .pfd-btn[hidden] { display: none; }
  .pfd-count { color: var(--accent, #1FFFE0); }
  .pfd-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.42); opacity: 0; pointer-events: none;
    transition: opacity .28s; z-index: 10050; }
  .pfd-panel { position: fixed; top: 0; right: 0; bottom: 0; width: min(460px, 92vw); z-index: 10060;
    background: #16191c; border-left: 1px solid rgba(255,255,255,.12); transform: translateX(102%);
    transition: transform .32s; overflow-y: auto; overscroll-behavior: contain; padding: 22px 24px 40px; }
  body.pfd-open .pfd-backdrop { opacity: 1; pointer-events: auto; }
  body.pfd-open .pfd-panel { transform: none; }
  body.pfd-open .pfd-btn { opacity: 0; pointer-events: none; }
  .pfd-close { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border: 0; background: none;
    color: #bfc8cc; font-size: 22px; cursor: pointer; }
  .pfd-close:hover { color: #fff; }
  .pfd-panel .pfc { --pfc-fg: #e8eff1; --pfc-muted: #8d989c; --pfc-line: rgba(255,255,255,.12);
    --pfc-accent: var(--accent, #1FFFE0); --pfc-bg: #1d2125; --pfc-font: 'Montserrat', sans-serif; }
  .pfd-panel .pfc-btn.primary { color: #111; }
  .pfd-panel .pfc-headline { color: #bfc8cc; }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  const btn = document.createElement('button');
  btn.className = 'pfd-btn';
  btn.type = 'button';
  btn.innerHTML = 'Comments <span class="pfd-count"></span>';
  const backdrop = document.createElement('div');
  backdrop.className = 'pfd-backdrop';
  const panel = document.createElement('aside');
  panel.className = 'pfd-panel';
  panel.setAttribute('aria-label', 'Comments');
  panel.innerHTML = '<button class="pfd-close" type="button" aria-label="Close">×</button>';
  const section = document.createElement('section');
  section.dataset.pfComments = project;
  panel.append(section);

  const open = () => document.body.classList.add('pfd-open');
  const close = () => document.body.classList.remove('pfd-open');
  btn.addEventListener('click', open);
  backdrop.addEventListener('click', close);
  panel.querySelector('.pfd-close').addEventListener('click', close);
  // Keep page keyboard/swipe navigation from reacting while the panel is used.
  for (const type of ['keydown', 'wheel', 'touchstart', 'touchmove']) {
    panel.addEventListener(type, e => {
      if (type === 'keydown' && e.key === 'Escape') close();
      e.stopPropagation();
    }, { passive: true });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Count badge: reflects visible comments rendered by the widget.
  new MutationObserver(() => {
    const n = section.querySelector('h3 span')?.textContent;
    btn.querySelector('.pfd-count').textContent = n && n !== '0' ? n : '';
  }).observe(section, { childList: true, subtree: true });

  function mountAll() {
    document.body.append(btn, backdrop, panel);
    // Password-gated pages: show the button only after unlock.
    const gated = document.getElementById('portfolio-screen');
    if (gated && document.getElementById('password-screen')) {
      const sync = () => { btn.hidden = !gated.classList.contains('visible'); };
      sync();
      new MutationObserver(sync).observe(gated, { attributes: true, attributeFilter: ['class'] });
    }
    const w = document.createElement('script');
    w.src = `${API}/widget.js`;
    w.defer = true;
    document.head.append(w);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', mountAll) : mountAll();
})();
