/* Smart Gated Industrial Community — overview + drill-down system pages. All values are simulated (see data.js). */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG_W = 1536, IMG_H = 1024;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n, d = 0) => (n == null || Number.isNaN(+n)) ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const u = (n, unit, d = 0) => `${fmt(n, d)}<small>${unit}</small>`;
const pct = (n, d = 1) => u(n, '%', d);
const pad2 = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const C = { cyan: '#2fd6ff', blue: '#3b8bff', purple: '#a98bff', green: '#2fd27f', orange: '#ff8a1f', amber: '#ffc44d', red: '#ff3d3d', info: '#5aa8ff', mute: '#c3d1f7', pink: '#ff7ad9', teal: '#2ff0c8' };
const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
const toneColor = { teal: '#5ff5e0',  purple: '#b394ff', blue: '#6cb8ff', cyan: '#55e6ff', green: '#6ff3a8', orange: '#ffb46e', red: '#ff7a7a' };
const HOURS = Array.from({ length: 24 }, (_, h) => pad2(h));

/* ---------- icons ---------- */
const I = {
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l8-8"/>',
  growth: '<path d="M4 20h16"/><path d="M6 17v-3M10 17v-5M14 17v-4M18 17v-7"/><path d="M5 10l5-4 4 3 6-5"/><path d="M16 4h4v4"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/><path d="M6 12l3-3 3 2 4-4"/>',
  infra: '<path d="M4 21V9l5-3v15M9 21V4l6 3v14M15 21v-9l5 2v7"/><path d="M2 21h20"/><path d="M11.5 9v1M11.5 13v1M6.5 12v1M17.5 16v1"/>',
  truck: '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.4"/>',
  factory: '<path d="M3 21V11l5 3v-3l5 3v-3l5 3V4h3v17z"/><path d="M7 18h2M12 18h2"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.3"/><path d="M16.5 14c2.8.2 4.5 2.2 4.5 5"/>',
  cloud: '<path d="M7 18a4 4 0 010-8 5.5 5.5 0 0110.6-1.5A4 4 0 0117 18z"/><path d="M12 18v3M9 21h6"/>',
  costdown: '<circle cx="12" cy="12" r="8"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2.1-.5-2.6-1.5M12 6.5V8M12 16v1.5"/>',
  env: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M9 15c2-3 4-5 7-7"/>',
  work: '<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M7 20c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5M1.5 18c0-2 1.5-3.6 3.5-3.6M22.5 18c0-2-1.5-3.6-3.5-3.6"/>',
  bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>',
  car: '<path d="M3 16v-4l2-5h14l2 5v4z"/><path d="M3 12h18"/><circle cx="7" cy="16.5" r="1.8"/><circle cx="17" cy="16.5" r="1.8"/>',
  gate: '<path d="M3 21V5M21 21V5"/><path d="M3 8h18"/><path d="M6 8l3 4M10 8l3 4M14 8l3 4"/><path d="M3 21h18"/>',
  camera: '<rect x="3" y="7" width="13" height="9" rx="1.5"/><path d="M16 10l5-3v9l-5-3"/><path d="M6 20l3-4"/>',
  scan: '<path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"/><path d="M7 12h10"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>',
  fire: '<path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 005 5L13 18a2.1 2.1 0 01-3-3z"/><path d="M14.5 6.5L17 4l3 3-2.5 2.5"/><path d="M4 20l5-5"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  map: '<path d="M9 4l6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14M15 6v14"/>',
  wifi: '<path d="M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0"/><circle cx="12" cy="19" r="1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  hvac: '<circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 3-6 5-4s-1 5-5 4M14 12c4 0 6 3 4 5s-5-1-4-5M12 14c0 4-3 6-5 4s1-5 5-4M10 12c-4 0-6-3-4-5s5 1 4 5"/>',
  light: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
};
I.doc = '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h7M9 15h7M9 18h4"/>';
I.download = '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 20h16"/>';
I.sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
I.moon = '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>';
I.gauge = '<path d="M4 16a8 8 0 1116 0"/><path d="M12 16l4-5"/><circle cx="12" cy="16" r="1.5"/>';
I.fsEnter = '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>';
I.fsExit = '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>';
const icon = k => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[k] || ''}</svg>`;
const ring = (k, size) => `<div class="ring" ${size ? `style="width:${size}px;height:${size}px"` : ''}><svg viewBox="0 0 24 24">${I[k] || ''}</svg></div>`;

/* ---------- Chart.js theme ---------- */
const HAS_CHART = !!window.Chart;
/* ---------- theme (dark default, light optional) ---------- */
const THEME_KEY = 'gic-theme';
const isLight = () => document.documentElement.dataset.theme === 'light';
const REF = () => isLight() ? '#13204a' : '#ffffff';      // reference / target lines and gauge text
const SLICE = () => isLight() ? '#ffffff' : '#0a1a52';    // doughnut slice separators
(() => { let t = 'dark'; try { t = localStorage.getItem(THEME_KEY) || 'dark'; } catch { } document.documentElement.dataset.theme = t; })();
if (HAS_CHART) {
  Chart.defaults.color = isLight() ? '#45517c' : '#c3d1f7';
  Chart.defaults.font.family = 'Barlow, "Segoe UI", system-ui, sans-serif';
  Chart.defaults.font.size = 11;
  Chart.defaults.borderColor = isLight() ? 'rgba(19,32,74,.10)' : 'rgba(255,255,255,.08)';
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.animation.duration = reduce ? 0 : 450;
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.boxHeight = 10;
  Object.assign(Chart.defaults.plugins.tooltip, { backgroundColor: 'rgba(7,22,80,.96)', borderColor: 'rgba(47,214,255,.7)', borderWidth: 1, padding: 8, titleFont: { weight: '600' } });
}
let CH = [], DCH = [];
function mkChart(id, cfg, inDrawer) {
  const el = document.getElementById(id); if (!el) return null;
  if (!HAS_CHART) { el.parentElement.innerHTML = '<p class="note">Charts need the Chart.js library, which did not load.</p>'; return null; }
  const c = new Chart(el, cfg); (inDrawer ? DCH : CH).push(c); return c;
}
const areaFill = col => ctx => { const ch = ctx.chart, a = ch.chartArea; if (!a) return hexA(col, .2); const g = ch.ctx.createLinearGradient(0, a.top, 0, a.bottom); g.addColorStop(0, hexA(col, .42)); g.addColorStop(1, hexA(col, 0)); return g; };
function lineCfg(labels, sets, o = {}) {
  return { type: 'line', data: { labels, datasets: sets.map(s => ({ label: s.label, data: s.data, borderColor: s.color, backgroundColor: s.fill ? areaFill(s.color) : s.color, fill: s.fill ? (s.fillTo || 'origin') : false,
      tension: .35, pointRadius: s.points ? 2.5 : 0, pointHoverRadius: 4, borderWidth: s.w || 2, borderDash: s.dash || [], spanGaps: true, stack: s.stack })) },
    options: { interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: sets.length > 1, position: 'top', align: 'end' } },
      scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: o.xt || 12, autoSkip: true, maxRotation: 0 } },
        y: { beginAtZero: !!o.zero, min: o.min, max: o.max, stacked: !!o.stacked, title: { display: !!o.yTitle, text: o.yTitle }, ticks: { maxTicksLimit: 5 } } } } };
}
function barCfg(labels, sets, o = {}) {
  return { type: 'bar', data: { labels, datasets: sets.map(s => s.type === 'line'
      ? { type: 'line', label: s.label, data: s.data, borderColor: s.color, backgroundColor: s.color, borderWidth: 2, pointRadius: 0, borderDash: s.dash || [], tension: .3, order: 0 }
      : { label: s.label, data: s.data, backgroundColor: s.colors || hexA(s.color, .85), borderRadius: 4, maxBarThickness: o.thick || 26, order: 1 }) },
    options: { indexAxis: o.h ? 'y' : 'x', interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: sets.length > 1, position: 'top', align: 'end' } },
      scales: { x: { stacked: !!o.stacked, grid: { display: !!o.h }, max: o.xmax, beginAtZero: true, ticks: { maxTicksLimit: o.xt || 24, maxRotation: 0, autoSkip: true } },
        y: { stacked: !!o.stacked, beginAtZero: true, grid: { display: !o.h }, max: o.ymax, title: { display: !!o.yTitle, text: o.yTitle }, ticks: { maxTicksLimit: o.h ? 20 : 5, autoSkip: false } } },
      onClick: o.onClick, onHover: o.onClick ? (e, els) => { e.native.target.style.cursor = els.length ? 'pointer' : 'default'; } : undefined } };
}
const donutCfg = (labels, data, colors, o = {}) => ({ type: 'doughnut', data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: SLICE(), borderWidth: 2 }] },
  options: { cutout: '62%', plugins: { legend: { position: o.legend || 'right' } }, onClick: o.onClick } });
const rankHTML = (rows, max) => `<div class="rank">${rows.map((r, i) => `<div class="rr" ${r.go ? act(r.go) : ''}><span class="no">${i + 1}</span><span>${r.l}${r.flag ? ` <span class="pill warn">${r.flag}</span>` : ''}</span><span class="tr"><i style="width:${Math.min(100, r.v / max * 100)}%;--bc:${r.c}"></i></span><span class="n">${r.t}</span></div>`).join('')}</div>`;
const gauge = (v, max, label, col) => { const f = Math.max(0, Math.min(1, v / max)), a = Math.PI * (1 - f), x = 60 + 46 * Math.cos(a), y = 58 - 46 * Math.sin(a);
  return `<div class="gauge"><svg viewBox="0 0 120 72" role="img" aria-label="${label} ${fmt(v, 1)}%"><path d="M14 58 A46 46 0 0 1 106 58" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="9" stroke-linecap="round"/><path d="M14 58 A46 46 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round"/><text x="60" y="54" text-anchor="middle" fill="${REF()}" font-family="Saira, sans-serif" font-weight="700" font-size="18">${fmt(v, 1)}%</text></svg>${label}</div>`; };
const canvas = (id, h = 210) => `<div class="ch" style="--h:${h}px"><canvas id="${id}"></canvas></div>`;

/* ---------- clickable registry ---------- */
const ACTS = new Map(); let actN = 0;
const reg = fn => { const id = 'a' + (++actN); ACTS.set(id, fn); return id; };
const act = fn => `data-act="${reg(fn)}" tabindex="0" role="button"`;
const stageEl = $('#stage');
stageEl.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (el && ACTS.has(el.dataset.act)) ACTS.get(el.dataset.act)(el, e); });
stageEl.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest('[data-act]'); if (!el || el.tagName === 'BUTTON' || el !== e.target) return;
  e.preventDefault(); ACTS.get(el.dataset.act)?.(el, e);
});

/* ---------- UI helpers ---------- */
let LV = {};   // live value renderers on the current page
let lvN = 0;
const live = fn => { const k = 'lv' + (++lvN); LV[k] = fn; return `data-live="${k}"`; };
const tile = t => { const v = typeof t.v === 'function' ? t.v : null; return `<div class="tile ${t.st || ''}" ${t.go ? act(t.go) : ''}><div class="l">${t.l}</div><div class="v" ${v ? live(v) : ''}>${v ? v() : t.v}</div>${t.s ? `<div class="s">${t.s}</div>` : ''}</div>`; };
const tiles = (arr, n) => `<div class="tiles" style="--n:${n}">${arr.map(tile).join('')}</div>`;
const card = (title, icon, body, cls = 's12', hx = '', id = '') => `<section class="card ${cls}" ${id ? `id="${id}"` : ''}><h3>${icon ? ring(icon) : ''}<span>${title}</span>${hx ? `<span class="hx">${hx}</span>` : ''}</h3>${body}</section>`;
const pill = (st, t) => `<span class="pill ${st === 'ok' ? '' : st}">${t}</span>`;
const lamp = (st, t) => `<span class="lamp ${st}">${t}</span>`;
const table = (cols, rows, o = {}) => `<div class="tscroll" style="--mh:${o.mh || 320}px"><table class="dt"><thead><tr>${cols.map(c => `<th class="${c.num ? 'num' : ''}">${c.h || c}</th>`).join('')}</tr></thead>
  <tbody ${o.id ? `id="${o.id}"` : ''}>${rows.map(r => rowHTML(cols, r)).join('')}</tbody></table></div>`;
const rowHTML = (cols, r, cls = '') => `<tr class="${cls}" ${r.go ? act(r.go) : ''}>${r.c.map((x, i) => `<td class="${cols[i] && cols[i].num ? 'num' : ''}">${x}</td>`).join('')}</tr>`;
const bar = (v, max, col) => `<span style="display:inline-block;width:70px;height:7px;border-radius:9px;background:rgba(255,255,255,.12);vertical-align:middle;margin-right:6px;overflow:hidden"><i style="display:block;height:100%;width:${Math.min(100, v / max * 100)}%;background:${col}"></i></span>`;
const hBar = v => v >= 90 ? C.green : v >= 70 ? C.amber : C.red;
let toastT;
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); };

/* ---------- crop helpers (reference photo) ---------- */
function cropTo(el, [x, y, w, h]) {
  const bw = el.clientWidth, bh = el.clientHeight; if (!bw || !bh) return null;
  const s = Math.max(bw / w, bh / h), ox = -(x * s + (w * s - bw) / 2), oy = -(y * s + (h * s - bh) / 2);
  el.style.backgroundSize = `${IMG_W * s}px ${IMG_H * s}px`;
  el.style.backgroundPosition = `${ox}px ${oy}px`;
  return (ix, iy) => [ix * s + ox, iy * s + oy];
}

/* ---------- date range ---------- */
const RANGES = [['today', 'Today'], ['yesterday', 'Yesterday'], ['7d', '7 Days'], ['30d', '30 Days'], ['custom', 'Custom']];
let range = { key: 'today', days: 1 };
const rKey = () => range.key + range.days + (range.from ? +range.from : '');
const rl = () => ({ today: 'today', yesterday: 'yesterday', '7d': 'last 7 days', '30d': 'last 30 days' }[range.key] || `${D.dShort(range.from)} – ${D.dShort(range.to)}`);
const rEnd = () => range.key === 'yesterday' ? D.addDays(D.today(), -1) : range.key === 'custom' ? range.to : D.today();
function per(full, now, key, dec = 0) {
  if (range.key === 'today') return now;
  const r = D.rng(key + rKey()); let t = 0; const end = rEnd();
  for (let i = 0; i < range.days; i++) { const dt = D.addDays(end, -i); t += full * (D.isWeekend(dt) ? .45 : 1) * (.92 + r() * .16); }
  return +t.toFixed(dec);
}
const dayAxis = (min = 14) => D.dayLabels(rEnd(), Math.max(min, range.days));

/* ======================================================================
   LIVE STATE (overview)
   ====================================================================== */
const S = {
  employees: 2318, contractors: 412, visitorsOn: 116, visitorsToday: 214, unauth: 6,
  sysOnline: 98.7, assets: 1284, comms: 99.96, incidents: 3,
  infraAvail: 99.4, load: 6.87, water: 412, pumpsRun: 11, hvac: 97.8, lights: 98.9,
  solar: 2.14, peak: 7.42, co2: 18.6, waterToday: 3912,
  active: 118, wait: 6.4, yard: 72, parking: 81, turn: 47,
  fire: 0, gas: 1, emerg: 0, resp: 4.2, fireSys: 99.8, hse: 0,
  prod: 94.2, oee: 81.4, avail: 96.1, down: 38, backlog: 23, health: 88,
  m7t: 42, m7v: 2.8, m7a: 118, c12v: 7.4, attendance: 94.6, ppe: 98.1, turnIn: 1206,
};
const energyToday = () => { const hf = D.hourNow(); let e = 0; for (let h = 0; h < hf; h += .25) e += D.loadAt(h) * .25; return e; };
const gatesOn = () => D.GATES.filter(g => g.status !== 'OFFLINE').length;
const people = () => S.employees + S.contractors + S.visitorsOn;
const plates = () => D.ANPR[0];

/* ======================================================================
   OVERVIEW
   ====================================================================== */
const N = {
  ops: { x: 833, y: 360, name: 'Operations Center', sub: 'Unified command & digital twin', page: 'ops' },
  gate: { x: 302, y: 497, name: 'Gate 01 · Main North', sub: 'ANPR · barriers · CCTV', page: 'access' },
  queue: { x: 469, y: 542, name: 'Gate 02 · Truck & Weighbridge', sub: 'Inbound truck lane', page: 'logistics' },
  ware: { x: 492, y: 405, name: 'Logistics Warehouses', sub: 'Yard & dock management', page: 'logistics' },
  subst: { x: 1130, y: 366, name: 'Substation SS-2', sub: '22/11 kV · 2 × 10 MVA', page: 'infra' },
  solar: { x: 1271, y: 349, name: 'Rooftop Solar Field', sub: '3.2 MWp installed', page: 'energy' },
  water: { x: 1292, y: 540, name: 'Water & Wastewater Plant', sub: 'Treatment & reuse', page: 'infra' },
  factory: { x: 1047, y: 488, name: 'Factories B & C', sub: 'Food processing · steel fabrication', page: 'production' },
  emerg: { x: 755, y: 495, name: 'Fire & Emergency Station', sub: '2 engines · 1 ambulance · 1 rescue', page: 'safety' },
  parking: { x: 802, y: 533, name: 'Staff Parking P2', sub: 'Smart parking sensors', page: 'logistics' },
  admin: { x: 1385, y: 450, name: 'Admin & Workforce Hub', sub: 'Turnstiles · attendance', page: 'workforce' },
};
const SECTIONS = [
  { id: 'perim', page: 'access', title: 'Perimeter & Access Control', tone: 'purple', icon: 'shield', nodes: ['gate'], box: [26, 94, 298, 212], crop: [58, 280, 302, 76],
    tags: ['Gate automation', 'ANPR', 'CCTV', 'Visitors'],
    kpis: () => { const vs = D.vehStats(); return [
      ['Gates Online', `${gatesOn()}/8`, gatesOn() < 8 ? 'crit' : 'good', ['access', { focus: 'sec-gates' }]], ['People Inside', fmt(people()), '', ['workforce']],
      ['Vehicles Inside', fmt(vs.inside), '', ['vehicles', { loc: 'Inside', status: 'Active' }]], ['Visitors Today', fmt(S.visitorsToday), '', ['workforce', { focus: 'sec-visitors' }]],
      ['Authorized Veh.', fmt(vs.authorized), '', ['vehicles', { status: 'Active' }]], ['Unauthorized', pad2(S.unauth), 'warn', ['vehicles', { focus: 'sec-anpr', anpr: 'Unauthorized' }]]]; },
    live: () => { const e = plates(); return `ANPR · ${e.plate} · ${e.gate.replace('G', 'Gate ')} · ${e.status}`; },
    state: () => gatesOn() < 8 ? ['crit', 'Gate 04 offline'] : ['ok', 'Secure'] },
  { id: 'ops', page: 'ops', title: 'Centralized Operations Center', tone: 'blue', icon: 'monitor', nodes: ['ops'], box: [340, 94, 298, 212], crop: [452, 272, 282, 78],
    tags: ['Unified dashboard', 'Real-time monitoring', 'Alarms', 'Incidents'],
    kpis: () => { const a = D.alarmCounts(); return [
      ['Systems Online', pct(S.sysOnline), 'good', ['ops']], ['Active Alarms', pad2(a.crit + a.warn), 'warn', ['alarms']], ['Critical Events', pad2(a.crit), a.crit ? 'crit' : '', ['alarms', { pri: 'crit' }]],
      ['Connected Assets', fmt(S.assets), '', ['ops', { focus: 'sec-systems' }]], ['Comms Avail.', pct(S.comms, 2), '', ['ops', { focus: 'sec-comms' }]], ['Open Incidents', pad2(S.incidents), '', ['ops', { focus: 'sec-incidents' }]]]; },
    live: () => `Digital twin · ${fmt(S.assets)} assets synced · ${fmt(S.sysOnline, 1)}% online`,
    state: () => { const a = D.alarmCounts(); return a.crit ? ['crit', `${a.crit} critical`] : ['ok', 'Normal']; } },
  { id: 'infra', page: 'infra', title: 'Smart Infrastructure Management', tone: 'cyan', icon: 'infra', nodes: ['subst'], box: [654, 94, 298, 212], crop: [860, 270, 300, 76],
    tags: ['Substations', 'Water network', 'HVAC', 'Street lighting'],
    kpis: () => [
      ['Infra Avail.', pct(S.infraAvail), 'good', ['infra']], ['Electrical Load', u(S.load, 'MW', 2), '', ['infra', { focus: 'sec-load' }]], ['Water Flow', u(S.water, 'm³/h'), '', ['infra', { focus: 'sec-water' }]],
      ['Pumps Running', `${S.pumpsRun}/12`, S.pumpsRun < 12 ? 'warn' : '', ['infra', { focus: 'sec-pumps' }]], ['HVAC Avail.', pct(S.hvac), '', ['infra', { focus: 'sec-hvac' }]], ['Street Lighting', pct(S.lights), '', ['infra', { focus: 'sec-lights' }]]],
    live: () => `Substation SS-2 · 11 kV bus · ${fmt(S.load, 2)} MW · Normal`,
    state: () => ['warn', '1 pump trip'] },
  { id: 'utl', page: 'utilities', title: 'Utilities', tone: 'teal', icon: 'drop', nodes: ['water'], box: [968, 94, 298, 212], crop: [945, 270, 145, 76],
    tags: ['Electricity', 'Water', 'Gas', 'Per-factory consumption'],
    kpis: () => { const top = [...D.FACTORIES].sort((a, b) => b.mw - a.mw)[0]; return [
      ['Demand', u(S.load, 'MW', 2), '', ['utilities']], ['Energy Today', u(energyToday(), 'MWh', 1), '', ['utilities']], ['Water Today', u(S.waterToday, 'm³'), '', ['utilities']],
      ['Natural Gas', u(NG_TOTAL, 'Sm³/h'), '', ['utilities', { view: 'gas' }]], ['Top Consumer', top.name.replace('Factory ', 'Fac. '), '', ['utilities', { scope: top.id }]], ['Above Normal', '2', 'warn', ['utilities']]]; },
    live: () => 'Factory B energy +18% · Factory D water +16% above normal',
    state: () => ['warn', '2 above normal'] },
  { id: 'energy', page: 'energy', title: 'Energy & Sustainability', tone: 'green', icon: 'leaf', nodes: ['solar'], box: [1282, 94, 298, 212], crop: [1227, 282, 278, 80],
    tags: ['Solar', 'Energy monitoring', 'Water conservation'],
    kpis: () => [
      ['Current Load', u(S.load, 'MW', 2), '', ['energy']], ['Solar Gen.', u(S.solar, 'MW', 2), 'good', ['energy', { focus: 'sec-solar' }]], ['Renewable', pct(S.solar / S.load * 100), 'good', ['energy', { focus: 'sec-mix' }]],
      ['Energy Today', u(energyToday(), 'MWh', 1), '', ['energy', { focus: 'sec-24h' }]], ['CO₂ Reduction', pct(S.co2), 'good', ['energy', { focus: 'sec-co2' }]], ['Water Today', u(S.waterToday, 'm³'), '', ['infra', { focus: 'sec-water' }]]],
    live: () => `Solar yield ${fmt(S.solar, 2)} MW · ${fmt(energyToday(), 1)} MWh used today`,
    state: () => ['ok', 'On target'] },
  { id: 'logi', page: 'logistics', title: 'Smart Transportation & Logistics', tone: 'blue', icon: 'truck', nodes: ['queue', 'ware'], box: [26, 576, 388, 218], crop: [45, 760, 330, 88],
    tags: ['Fleet tracking', 'GPS', 'Gate queues', 'Weighbridge'],
    kpis: () => [
      ['Trucks Today', fmt(Math.round(D.traffic().entries * .34)), '', ['logistics']], ['Active Vehicles', fmt(S.active), '', ['logistics', { focus: 'sec-track' }]], ['Gate Wait', u(S.wait, 'min', 1), S.wait > 8 ? 'warn' : '', ['logistics', { focus: 'sec-queues' }]],
      ['Yard Occupancy', pct(S.yard, 0), '', ['logistics', { focus: 'sec-parking' }]], ['Parking Occ.', pct(S.parking, 0), '', ['logistics', { focus: 'sec-parking' }]], ['Avg Turnaround', u(S.turn, 'min'), '', ['logistics', { focus: 'sec-deliv' }]]],
    live: () => `Live tracking · ${S.active} vehicles · Gate 02 queue ${D.GATES[1].waiting} trucks`,
    state: () => ['warn', 'Gate 03 busy'] },
  { id: 'safety', page: 'safety', title: 'Safety & Emergency Management', tone: 'orange', icon: 'warn', nodes: ['emerg'], box: [452, 590, 362, 204], crop: [455, 770, 305, 86],
    tags: ['Fire detection', 'Gas detection', 'Emergency response', 'HSE'],
    kpis: () => [
      ['Fire Alarms', pad2(S.fire), S.fire ? 'crit' : 'good', ['safety', { focus: 'sec-fire' }]], ['Gas Alarms', pad2(S.gas), S.gas ? 'warn' : '', ['alarms', { system: 'Fire & Gas' }]], ['Emergencies', pad2(S.emerg), S.emerg ? 'crit' : 'good', ['safety', { focus: 'sec-emap' }]],
      ['Response Time', u(S.resp, 'min', 1), '', ['safety', { focus: 'sec-resp' }]], ['Fire System', pct(S.fireSys), '', ['safety', { focus: 'sec-fire' }]], ['HSE Incidents', pad2(S.hse), 'good', ['safety', { focus: 'sec-hist' }]]],
    live: () => 'Gas detector GD-14 · 18% LEL · Warning · crew notified',
    state: () => S.emerg ? ['crit', 'Emergency'] : ['warn', '1 gas warning'] },
  { id: 'veh', page: 'vehicles', title: 'Vehicle Access', tone: 'purple', icon: 'key', nodes: ['factory'], box: [856, 586, 368, 208], crop: [160, 280, 122, 75],
    tags: ['Authorized vehicles', 'Entry capacity', 'ANPR', 'Approvals'],
    kpis: () => { const vs = D.vehStats(); return [
      ['Authorized', fmt(vs.authorized), '', ['vehicles', { status: 'Active' }]], ['Inside', fmt(vs.inside), '', ['vehicles', { status: 'Active', loc: 'Inside' }]], ['Entry Capacity', fmt(vs.authorized - vs.inside), 'good', ['vehicles', { status: 'Active', loc: 'Outside' }]],
      ['Pending', fmt(vs.pending), '', ['vehicles', { status: 'Pending' }]], ['Expired', fmt(vs.expired), 'warn', ['vehicles', { status: 'Expired' }]], ['Blocked', fmt(vs.blocked), 'crit', ['vehicles', { status: 'Blocked' }]]]; },
    live: () => { const s2 = D.facStats(D.fac('B')); return `Factory B · ${s2.inside} / ${s2.authorized} inside · ${fmt(s2.inside / s2.authorized * 100, 0)}% of allowance`; },
    state: () => ['warn', `${D.vehStats().pending} pending`] },
  { id: 'work', page: 'workforce', title: 'People & Workforce Management', tone: 'cyan', icon: 'people', nodes: ['admin', 'parking'], box: [1272, 592, 308, 202], crop: [1240, 772, 268, 88],
    tags: ['Employee access', 'Attendance', 'Visitors', 'Contractors'],
    kpis: () => [
      ['Employees', fmt(S.employees), '', ['workforce']], ['Contractors', fmt(S.contractors), '', ['workforce', { focus: 'sec-contr' }]], ['Visitors', fmt(S.visitorsOn), '', ['workforce', { focus: 'sec-visitors' }]],
      ['Attendance', pct(S.attendance), 'good', ['workforce', { focus: 'sec-att' }]], ['Parking', pct(S.parking, 0), '', ['logistics', { focus: 'sec-parking' }]], ['PPE Compliance', pct(S.ppe), '', ['safety']]],
    live: () => `Turnstiles · ${fmt(S.turnIn)} entries since 07:00`,
    state: () => ['ok', 'Normal'] },
];

/* header pillars & footer benefits */
const pillars = [['shield', 'Security &amp; Access Control', 'Safe people, assets &amp; operations', 'sec', 'access'], ['gear', 'Operational Efficiency', 'Optimized resources, less downtime', 'eff', 'ops'],
  ['leaf', 'Sustainability', 'Greener operations, lower footprint', 'sus', 'energy'], ['growth', 'Growth &amp; Investment', 'More factories, more value', 'grw', 'ops']];
$('#pillars').innerHTML = pillars.map(([ic, h, p, k]) => `<button class="pillar" type="button" data-page="${pillars.find(x => x[3] === k)[4]}">${ring(ic)}<div><h4>${h}</h4><p>${p} <em id="pl-${k}"></em></p></div></button>`).join('');
$$('.pillar').forEach(b => b.addEventListener('click', () => openPage(b.dataset.page)));
$('#benefits').innerHTML = [['shield', 'Enhanced Security', '0 breaches · 90 days'], ['gear', 'Higher Productivity', 'OEE 81.4% · +6 pts YoY'], ['costdown', 'Lower Operational Costs', '−14% O&amp;M cost YoY'],
  ['env', 'Environmental Responsibility', '−18.6% CO₂ vs baseline'], ['work', 'Better Work Environment', '212 days without LTI'], ['growth', 'Long-Term Sustainable Growth', '94% of plots leased']]
  .map(([ic, h, p]) => `<div class="benefit">${ring(ic)}<div><h5>${h}</h5><p>${p}</p></div></div>`).join('');
$('#chipVeh').addEventListener('click', () => openPage('vehicles'));
$('#chipAlm').addEventListener('click', () => openPage('alarms'));
$('#chipUtl').addEventListener('click', () => openPage('utilities'));
$('#chipFin').addEventListener('click', () => openPage('finance'));
[['A', 312, 372, 'ok'], ['B', 1086, 530, 'warn'], ['C', 930, 440, 'ok'], ['D', 1229, 414, 'warn'], ['E', 640, 432, 'ok'], ['F', 1442, 420, 'warn']].forEach(([id, x, y, st]) => {
  const f = D.fac(id), b = document.createElement('button'); b.type = 'button'; b.className = 'ftag';
  b.style.cssText = `left:${x}px;top:${y}px;--pc:${st === 'ok' ? C.green : C.amber}`; b.innerHTML = `<i></i>${f.name}`; b.setAttribute('aria-label', `${f.name} · ${f.tenant} · open details`);
  b.addEventListener('click', () => factoryDrawer(id)); $('#nodes').appendChild(b);
});

/* overview panels */
SECTIONS.forEach(s => {
  const [l, t, w, h] = s.box;
  const el = document.createElement('div');
  el.className = `panel t-${s.tone}`; el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-label', `Open ${s.title}`);
  el.style.cssText = `left:${l}px;top:${t}px;width:${w}px;height:${h}px`;
  el.innerHTML = `<div class="ph">${ring(s.icon)}<div class="ttl"><h3>${s.title}</h3><div class="tags">${s.tags.join(' · ')}</div></div></div>
    <div class="kpis"></div><div class="strip"><span class="state"></span><span class="live"></span></div>`;
  $('#panels').appendChild(el);
  el.addEventListener('click', e => { const k = e.target.closest('.kpi[data-go]'); if (k) { const g = s.kpis()[+k.dataset.go][3]; openPage(g[0], g[1] || {}); } else openPage(s.page); });
  el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); openPage(s.page); } else if (e.key === 'Enter' && e.target.matches('.kpi')) { e.target.click(); } });
  el.addEventListener('mouseenter', () => hot(s.id, true)); el.addEventListener('mouseleave', () => hot(s.id, false));
  s.el = el;
});
function renderPanel(s) {
  s.el.querySelector('.kpis').innerHTML = s.kpis().map(([l, v, c], i) => `<div class="kpi ${c || ''}" data-go="${i}" tabindex="0" title="Open ${l.replace(/<[^>]+>/g, '')}"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('');
  const lv = s.el.querySelector('.live'); lv.textContent = s.live(); lv.classList.toggle('crit', s.id === 'prod');
  const [st, txt] = s.state(); const se = s.el.querySelector('.state'); se.className = 'state ' + (st === 'ok' ? '' : st); se.textContent = txt;
}

/* network */
const svgNS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs, parent) => { const e = document.createElementNS(svgNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
const curve = (a, b, bend = .18) => { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y; return `M${a.x},${a.y} Q${mx - dy * bend},${my + dx * bend} ${b.x},${b.y}`; };
[['gate', 'ware'], ['ware', 'emerg'], ['emerg', 'parking'], ['parking', 'factory'], ['factory', 'subst'], ['subst', 'solar'], ['solar', 'admin'], ['admin', 'water'], ['water', 'factory'], ['gate', 'queue'], ['queue', 'emerg']]
  .forEach(([a, b]) => mk('path', { d: curve(N[a], N[b], .08), fill: 'none', stroke: '#7fe6ff', 'stroke-opacity': .45, 'stroke-width': 1.3, class: 'spoke' }, $('#mesh')));
Object.keys(N).filter(k => k !== 'ops').forEach((k, i) => {
  const d = curve(N.ops, N[k], i % 2 ? .12 : -.12);
  mk('path', { d, fill: 'none', stroke: '#2fd6ff', 'stroke-width': 1.8, 'stroke-opacity': .9, filter: 'url(#glow)', class: 'flow' }, $('#spokes'));
  if (!reduce) { const c = mk('circle', { r: 3, fill: '#e9fbff', filter: 'url(#glow)' }, $('#packets')); mk('animateMotion', { dur: (3 + i * .37).toFixed(2) + 's', repeatCount: 'indefinite', path: d, begin: (i * .4).toFixed(1) + 's' }, c); }
});
SECTIONS.forEach(s => {
  const [l, t, w, h] = s.box, upper = t < 400;
  s.nodes.forEach((nk, i) => {
    const n = N[nk], ax = Math.min(l + w - 40, Math.max(l + 40, n.x + (s.nodes.length > 1 ? (i ? 30 : -30) : 0))), a = { x: ax, y: upper ? t + h : t };
    const col = s.id === 'prod' ? '#c9a8ff' : toneColor[s.tone];
    mk('path', { d: curve(a, n, .1), fill: 'none', stroke: col, 'stroke-width': 2.2, filter: 'url(#glow)', class: 'flow lead', 'data-s': s.id }, $('#leads'));
    mk('circle', { cx: a.x, cy: a.y, r: 4, fill: col, filter: 'url(#glow)' }, $('#leads'));
  });
});
function hot(id, on) { $$(`#leads [data-s="${id}"]`).forEach(p => p.classList.toggle('hot', on)); SECTIONS.find(s => s.id === id).el.classList.toggle('hot', on); }
const tip = $('#tip'), nodeOwner = {}; SECTIONS.forEach(s => s.nodes.forEach(n => nodeOwner[n] = s));
const nodeReading = {
  gate: () => `${fmt(D.vehStats().inside)} vehicles inside · ${gatesOn()}/8 gates online`, queue: () => `Queue ${D.GATES[1].waiting} trucks · wait ${fmt(S.wait, 1)} min`,
  ware: () => `Yard occupancy ${S.yard}%`, ops: () => `${fmt(S.sysOnline, 1)}% systems online · ${D.alarmCounts().crit + D.alarmCounts().warn} active alarms`,
  subst: () => `${fmt(S.load, 2)} MW load · TX-3 71%`, solar: () => `${fmt(S.solar, 2)} MW now · ${fmt(S.solar / S.load * 100, 1)}% renewable`,
  water: () => `${fmt(S.water)} m³/h · pump P-04 tripped`, factory: () => `Compressor C-12 vibration ${fmt(S.c12v, 1)} mm/s`,
  emerg: () => `Ready · response ${fmt(S.resp, 1)} min`, parking: () => `Occupancy ${S.parking}%`, admin: () => `${fmt(S.employees)} employees · ${fmt(S.attendance, 1)}% attendance`,
};
Object.entries(N).forEach(([k, n]) => {
  if (k === 'ops') {
    const h = document.createElement('div'); h.className = 'hub'; h.style.cssText = `left:${n.x}px;top:${n.y}px`;
    h.innerHTML = `<div class="spin"></div><div class="core">${ring('cloud', 52)}</div>`; h.querySelector('.ring').style.background = 'radial-gradient(circle,#1d5be0,#0a2170)';
    $('#nodes').appendChild(h);
  }
  const s = nodeOwner[k], el = document.createElement('div');
  el.className = 'node' + (k === 'factory' ? ' crit' : ''); el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-label', `${n.name} details`);
  const c = k === 'emerg' ? 'var(--orange)' : (s ? toneColor[s.tone] : 'var(--cyan)');
  el.style.cssText = `left:${n.x}px;top:${n.y}px;--c:${c}` + (k === 'ops' ? ';z-index:10' : '');
  el.innerHTML = '<i></i>';
  const show = () => { tip.innerHTML = `<b>${n.name}</b><span>${n.sub}</span><br>${nodeReading[k]()}<br><span>Click to open</span>`; tip.style.left = n.x + 'px'; tip.style.top = n.y + 'px';
    tip.style.setProperty('--c', k === 'factory' ? 'var(--red)' : c); tip.hidden = false; s && hot(s.id, true); };
  const hide = () => { tip.hidden = true; s && hot(s.id, false); };
  el.addEventListener('mouseenter', show); el.addEventListener('mouseleave', hide); el.addEventListener('focus', show); el.addEventListener('blur', hide);
  const go = () => { hide(); k === 'gate' ? openPage('access', { focus: 'sec-gates' }) : k === 'factory' ? factoryDrawer('C') : openPage(n.page); };
  el.addEventListener('click', go); el.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  $('#nodes').appendChild(el);
});
const co = document.createElement('div'); co.className = 'callout'; co.style.cssText = `left:${N.factory.x}px;top:${N.factory.y}px`;
co.innerHTML = 'CRITICAL · Compressor C-12<small id="coV">Vibration 7.4 mm/s · limit 4.5</small>'; $('#nodes').appendChild(co);

function renderOverview() {
  SECTIONS.forEach(renderPanel);
  const a = D.alarmCounts(), vs = D.vehStats();
  $('#aC').textContent = pad2(a.crit); $('#aW').textContent = pad2(a.warn); $('#aI').textContent = pad2(a.info);
  $('#chipVehN').textContent = `${fmt(vs.inside)} / ${fmt(vs.authorized)} inside`;
  $('#chipUtlN').textContent = `${fmt(S.load, 2)} MW · ${fmt(S.waterToday)} m³`;
  { const fs = fSummary(); $('#chipFinN').textContent = `${egpS(fs.billed).replace('EGP ', '')} · ${fs.rate == null ? 'running' : fmt(fs.rate, 0) + '%'}`; }
  $('#netState').textContent = `${fmt(S.assets)} assets connected`;
  $('#coV').textContent = `Vibration ${fmt(S.c12v, 1)} mm/s · limit 4.5`;
  $('#pl-sec').textContent = `${gatesOn()}/8 gates`; $('#pl-eff').textContent = `OEE ${fmt(S.oee, 1)}%`;
  $('#pl-sus').textContent = `${fmt(S.solar / S.load * 100, 1)}% solar`; $('#pl-grw').textContent = '94% leased';
}

/* ======================================================================
   PAGE SHELL
   ====================================================================== */
const PAGES = {};
const ORDER = ['access', 'vehicles', 'ops', 'alarms', 'infra', 'utilities', 'finance', 'energy', 'logistics', 'safety', 'workforce', 'reports'];
let cur = null, curOpts = {};
const pageEl = $('#page'), pbody = $('#pbody');
pbody.style.position = 'relative';
pbody.classList.add('fit');

$('#rangeSeg').innerHTML = RANGES.map(([k, l]) => `<button type="button" data-r="${k}" class="${k === 'today' ? 'on' : ''}">${l}</button>`).join('');
(() => { const t = D.today(); const iso = d => d.toISOString().slice(0, 10); $('#dTo').value = iso(t); $('#dFrom').value = iso(D.addDays(t, -13)); $('#dTo').max = iso(t); $('#dFrom').max = iso(t); })();
$('#rangeSeg').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#rangeSeg button').forEach(x => x.classList.toggle('on', x === b));
  const k = b.dataset.r; $('#customBox').hidden = k !== 'custom';
  if (k === 'custom') { applyCustom(); return; }
  range = { key: k, days: { today: 1, yesterday: 1, '7d': 7, '30d': 30 }[k] };
  renderBody(true);
});
function applyCustom() {
  const f = new Date($('#dFrom').value + 'T00:00:00Z'), t = new Date($('#dTo').value + 'T00:00:00Z');
  if (isNaN(f) || isNaN(t) || f > t) { toast('Pick a start date on or before the end date.'); return; }
  range = { key: 'custom', days: Math.round((t - f) / 864e5) + 1, from: f, to: t };
  renderBody(true);
}
$('#dApply').addEventListener('click', applyCustom);

function renderRail() {
  const a = D.alarmCounts();
  $('#rail').innerHTML = `<div class="mini">Smart Gated Industrial Communities<span>Management platform</span></div>` +
    ORDER.map(id => { const p = PAGES[id]; const badge = id === 'alarms' ? `<span class="bdg">${a.crit + a.warn}</span>` : id === 'vehicles' ? `<span class="bdg" style="background:#5530d6">${D.vehStats().pending}</span>` : '';
      return `${id === 'ops' || id === 'infra' ? '<div class="sep"></div>' : ''}<button type="button" class="navb t-${p.tone} ${id === cur ? 'on' : ''}" data-nav="${id}">${ring(p.icon)}<span>${p.nav}</span>${badge}</button>`; }).join('') +
    `<div class="rlogos"><img src="logo-we.png" alt="WE"></div><button type="button" class="navb back" data-nav="overview">${ring('map')}<span>Back to overview</span></button>`;
}
$('#rail').addEventListener('click', e => { const b = e.target.closest('[data-nav]'); if (!b) return; b.dataset.nav === 'overview' ? closePage() : openPage(b.dataset.nav); });

function openPage(id, opts = {}) {
  if (!PAGES[id]) return;
  cur = id; curOpts = opts; closeDrawer();
  pageEl.hidden = false; tip.hidden = true;
  const p = PAGES[id];
  $('#pIcon').innerHTML = ring(p.icon); $('#pTitle').textContent = p.title; $('#pSub').textContent = typeof p.sub === 'function' ? p.sub() : p.sub;
  if (opts.scope) p.onScope && p.onScope(opts.scope);
  if (opts.view) UV = opts.view;
  $('#pScope').innerHTML = p.scope ? p.scope() : '';
  $('#rangeSeg').hidden = !!p.noRange; $('#customBox').hidden = !!p.noRange || range.key !== 'custom';
  $('.ptop').className = `ptop t-${p.tone}`;
  renderRail(); renderBody(false);
  $(`[data-nav="${id}"]`)?.focus({ preventScroll: true });
}
$('#pScope').addEventListener('change', e => { const p = PAGES[cur]; if (!p || !p.onScope || e.target.type === 'date') return; p.onScope(e.target.value, e.target); if (p.rescope) $('#pScope').innerHTML = p.scope(); $('#pSub').textContent = typeof p.sub === 'function' ? p.sub() : p.sub; renderBody(true); });
function closePage() { cur = null; closeDrawer(); destroyCharts(); pageEl.hidden = true; pbody.innerHTML = ''; renderOverview(); }
function destroyCharts() { CH.forEach(c => c.destroy()); CH = []; }
function renderBody(keepScroll) {
  const st = keepScroll ? pbody.scrollTop : 0;
  destroyCharts(); ACTS.clear(); LV = {};
  const p = PAGES[cur];
  pbody.innerHTML = p.render(curOpts);
  p.after && p.after(curOpts);
  if (!keepScroll && curOpts.focus) { const el = document.getElementById(curOpts.focus); pbody.scrollTop = el ? el.offsetTop - 8 : 0; }
  else pbody.scrollTop = st;
  curOpts = {};   // drill-down options apply once; later re-renders keep the page's own filter state
}
const refreshLive = () => { $$('[data-live]', pbody).forEach(el => { const f = LV[el.dataset.live]; if (f) el.innerHTML = f(); }); };

/* drawer */
const dscrim = $('#dscrim'), drawerEl = $('#drawer');
function drawer(html, tone = 'cyan') { drawerEl.classList.remove('wide');
  DCH.forEach(c => c.destroy()); DCH = [];
  drawerEl.style.setProperty('--c', toneColor[tone] || C.cyan);
  drawerEl.innerHTML = html; dscrim.hidden = false; drawerEl.scrollTop = 0;
  drawerEl.querySelector('.close')?.focus();
}
function closeDrawer() { DCH.forEach(c => c.destroy()); DCH = []; dscrim.hidden = true; drawerEl.innerHTML = ''; }
dscrim.addEventListener('click', e => { if (e.target === dscrim) closeDrawer(); });
addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (!dscrim.hidden) closeDrawer(); else if (cur) closePage(); });
const dHead = (icon, title, sub) => `<div class="dh">${ring(icon)}<div><h3>${title}</h3><p>${sub}</p></div><button class="close" type="button" aria-label="Close" data-act="${reg(closeDrawer)}">✕</button></div>`;
const box = (title, body) => `<div class="box"><h4>${title}</h4>${body}</div>`;
const kv = pairs => `<dl class="kv">${pairs.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
const refreshAll = () => { renderOverview(); if (cur) { renderRail(); renderBody(true); } };

/* ======================================================================
   SHARED DRILL-DOWNS
   ====================================================================== */
const vehStatusPill = v => v.status === 'Active' ? pill('ok', 'ACTIVE') : v.status === 'Pending' ? pill('info', 'PENDING') : v.status === 'Expired' ? pill('warn', 'EXPIRED') : pill('crit', 'BLOCKED');
const anprPill = s => s === 'Authorized' ? pill('ok', 'Authorized') : s === 'Unknown' ? pill('info', 'Unknown') : s === 'Blacklisted' ? pill('crit', 'Blacklisted') : pill('warn', 'Unauthorized');
const gateName = id => (D.GATES.find(g => g.id === id) || { name: id }).name.split(' · ')[0];

function vehicleDrawer(plate) {
  const v = D.VEH.find(x => x.plate === plate);
  const ev = D.ANPR.filter(e => e.plate === plate).slice(0, 6);
  if (!v) {
    drawer(dHead('car', plate, 'Not in the vehicle register') + box('ANPR reads', ev.length ? table(['Time', 'Gate', 'Direction', 'Status'], ev.map(e => ({ c: [e.time, gateName(e.gate), e.dir, anprPill(e.status)] })), { mh: 220 }) : '<p class="note">No reads.</p>') +
      box('What happens next', '<p class="note">Unregistered vehicles are held at the barrier. The guard can issue a visitor pass or refuse entry.</p>') +
      `<div class="actions"><button class="btn" type="button" data-act="${reg(() => toast(`Visitor pass request sent for ${plate} (demo)`))}">Issue visitor pass</button><button class="btn red" type="button" data-act="${reg(() => toast(`${plate} added to watch list (demo)`))}">Add to watch list</button></div>`, 'purple');
    return;
  }
  const f = D.fac(v.factory);
  const hist = [...ev.map(e => [e.time + ' today', gateName(e.gate), e.dir, anprPill(e.status)])];
  const r = D.rng(plate);
  for (let i = hist.length; i < 6; i++) { const dt = D.addDays(D.today(), -1 - Math.floor(r() * 6)); hist.push([`${D.hm(6 + Math.floor(r() * 12), Math.floor(r() * 60))} ${D.dShort(dt)}`, gateName(v.gate), r() < .5 ? 'In' : 'Out', v.status === 'Active' ? anprPill('Authorized') : anprPill('Unauthorized')]); }
  const btns = [];
  const change = (fn, msg) => () => { fn(); toast(msg); refreshAll(); vehicleDrawer(plate); };
  if (v.status === 'Pending') btns.push(`<button class="btn green" type="button" data-act="${reg(change(() => { v.status = 'Active'; v.expiry = D.addDays(D.today(), 365); }, `${plate} approved for ${f.name}`))}">Approve</button>`,
    `<button class="btn red" type="button" data-act="${reg(change(() => { v.status = 'Blocked'; v.reason = 'Request rejected'; v.expiry = null; }, `${plate} request rejected`))}">Reject</button>`);
  if (v.status === 'Active') btns.push(`<button class="btn" type="button" data-act="${reg(change(() => { v.expiry = D.addDays(v.expiry || D.today(), 30); }, `${plate} extended by 30 days`))}">Extend 30 days</button>`,
    `<button class="btn red" type="button" data-act="${reg(change(() => { v.status = 'Blocked'; v.reason = 'Blocked by operator'; v.inside = false; v.location = 'Outside'; }, `${plate} blocked`))}">Block vehicle</button>`);
  if (v.status === 'Expired') btns.push(`<button class="btn green" type="button" data-act="${reg(change(() => { v.status = 'Active'; v.expiry = D.addDays(D.today(), 365); }, `${plate} renewed for 12 months`))}">Renew 12 months</button>`);
  if (v.status === 'Blocked') btns.push(`<button class="btn" type="button" data-act="${reg(change(() => { v.status = 'Active'; v.reason = null; v.expiry = v.expiry || D.addDays(D.today(), 90); }, `${plate} unblocked`))}">Unblock</button>`);
  drawer(dHead('car', `${v.plate} · ${v.type}`, `${v.company} · ${f.name}`) +
    `<div class="tiles" style="--n:3">${tile({ l: 'Status', v: v.status, st: v.status === 'Active' ? 'good' : v.status === 'Blocked' ? 'crit' : 'warn' })}${tile({ l: 'Location', v: v.inside ? 'Inside' : 'Outside', s: v.location })}${tile({ l: 'Expiry', v: v.expiry ? D.dmy(v.expiry) : '—', s: v.auth })}</div>` +
    box('Authorization record', kv([['Plate number', v.plate], ['Vehicle type', v.type], ['Company', v.company], ['Factory', `${f.name} · ${f.tenant}`], ['Driver', v.driver], ['Authorization', v.auth], ['Expiry', v.expiry ? D.dmy(v.expiry) : 'Awaiting approval'],
      ['Status', vehStatusPill(v)], ['Current location', v.location], ['Usual gate', gateName(v.gate)], ['Last seen', v.lastSeen], ...(v.reason ? [['Block reason', v.reason]] : []), ...(v.requested ? [['Requested', D.dmy(v.requested)]] : [])])) +
    box('Recent access', table(['Time', 'Gate', 'Direction', 'Result'], hist.map(c => ({ c })), { mh: 230 })) +
    `<div class="actions">${btns.join('')}<button class="btn ghost" type="button" data-act="${reg(() => factoryDrawer(v.factory))}">Open ${f.name}</button></div>`, 'purple');
}

function factoryDrawer(fid) {
  const f = D.fac(fid), fs = D.facStats(f), al = D.activeAlarms().filter(a => a.facility.startsWith(f.name));
  drawer(dHead('factory', `${f.name} · ${f.tenant}`, `${f.sector} · live monitoring`) +
    `<div class="big3">
      <div class="bign auth" ${act(() => openPage('vehicles', { factory: fid, status: 'Active' }))}><div class="l">Authorized vehicles</div><div class="v">${fmt(fs.authorized)}</div><div class="s">registered for ${f.name}</div></div>
      <div class="bign in" ${act(() => openPage('vehicles', { factory: fid, status: 'Active', loc: 'Inside' }))}><div class="l">Currently inside</div><div class="v">${fmt(fs.inside)}</div><div class="s">${fmt(fs.inside / fs.authorized * 100, 0)}% of allowance</div></div>
      <div class="bign rem"><div class="l">Available slots</div><div class="v">${fmt(fs.slots)}</div><div class="s">can still enter</div></div></div>` +
    `<div class="tiles" style="--n:4">${tile({ l: 'Employees', v: fmt(f.emp) })}${tile({ l: 'Contractors', v: fmt(f.con) })}${tile({ l: 'Power now', v: u(f.mw * S.load / 6.87, 'MW', 2) })}${tile({ l: 'Energy today', v: u(f.mw * energyToday() / 6.87, 'MWh', 1) })}</div>` +
    (FIN_TENANTS.includes(fid) ? fFactorySummary(fid) : '') +
    box('Active alarms', al.length ? table(['Time', 'Priority', 'Asset', 'Alarm'], al.map(a => ({ c: [a.time, priPill(a.pri), a.asset, a.alarm], go: () => alarmDrawer(a.id) })), { mh: 200 }) : '<p class="note">No active alarms.</p>') +
    `<div class="actions"><button class="btn" type="button" data-act="${reg(() => openPage('vehicles', { factory: fid }))}">Vehicle list</button><button class="btn ghost" type="button" data-act="${reg(() => openPage('energy', { focus: 'sec-byfac' }))}">Energy analytics</button></div>`, 'purple');
}

const priPill = p => p === 'crit' ? pill('crit', 'CRITICAL') : p === 'warn' ? pill('warn', 'WARNING') : pill('info', 'INFO');
const machPill = s => s === 'crit' ? pill('crit', 'Critical') : s === 'warn' ? pill('warn', 'Watch') : pill('ok', 'Running');
const statusPill = (s, p) => s === 'Cleared' ? pill('off', 'Cleared') : s.endsWith('Unack') ? pill(p === 'crit' ? 'crit' : p === 'warn' ? 'warn' : 'info', 'Active · Unack') : pill('off', 'Active · Ack');

function alarmDrawer(id) {
  const a = D.ALARMS.find(x => x.id === id); if (!a) return;
  const sysPage = { 'Access Control': 'access', Security: 'access', Power: 'infra', Water: 'infra', HVAC: 'infra', Lighting: 'infra', 'Fire & Gas': 'safety', Logistics: 'logistics', Energy: 'energy', Environment: 'energy', Network: 'ops', Workforce: 'workforce' }[a.system] || 'ops';
  const num = parseFloat(a.value), lim = parseFloat(a.limit), r = D.rng(id);
  const btn = [];
  if (a.status.endsWith('Unack')) btn.push(`<button class="btn" type="button" data-act="${reg(() => { a.status = 'Active · Ack'; a.ackBy = 'Op. You (this console)'; toast(`${a.id} acknowledged`); refreshAll(); alarmDrawer(id); })}">Acknowledge</button>`);
  if (a.status !== 'Cleared') btn.push(`<button class="btn green" type="button" data-act="${reg(() => { a.status = 'Cleared'; if (a.ackBy === '—') a.ackBy = 'Op. You (this console)'; toast(`${a.id} cleared`); refreshAll(); alarmDrawer(id); })}">Clear alarm</button>`);
  btn.push(`<button class="btn ghost" type="button" data-act="${reg(() => toast(`Work order WO-${8800 + Math.floor(r() * 199)} created for ${a.asset} (demo)`))}">Create work order</button>`);
  btn.push(`<button class="btn ghost" type="button" data-act="${reg(() => openPage(sysPage))}">Open ${PAGES[sysPage].nav}</button>`);
  const tone = a.pri === 'crit' ? 'red' : a.pri === 'warn' ? 'orange' : 'blue';
  drawer(dHead('bell', a.alarm, `${a.id} · ${a.system} · ${a.facility}`) +
    `<div class="tiles" style="--n:3">${tile({ l: 'Priority', v: a.pri === 'crit' ? 'Critical' : a.pri === 'warn' ? 'Warning' : 'Info', st: a.pri === 'crit' ? 'crit' : a.pri === 'warn' ? 'warn' : 'info' })}${tile({ l: 'Value', v: a.value })}${tile({ l: 'Limit', v: a.limit })}</div>` +
    box('Details', kv([['Time', `${a.time} · ${D.dmy(a.date)}`], ['System', a.system], ['Facility', a.facility], ['Asset', a.asset], ['Status', statusPill(a.status, a.pri)], ['Acknowledged by', a.ackBy]])) +
    (!isNaN(num) && !isNaN(lim) ? box('Last 2 hours', canvas('dch-al', 170)) : '') +
    box('Recommended action', `<p class="note" style="font-size:13px;color:#fff">${a.action || 'Monitor. No action required unless the condition repeats.'}</p>`) +
    `<div class="actions">${btn.join('')}</div>`, tone);
  if (!isNaN(num) && !isNaN(lim)) {
    const n = 24, start = num < lim ? num * 1.15 : lim * .7, data = [];
    for (let i = 0; i < n; i++) data.push(+(start + (num - start) * Math.pow(i / (n - 1), 2) + (r() - .5) * Math.abs(num) * .04).toFixed(2));
    const labels = Array.from({ length: n }, (_, i) => D.clockAgo((n - 1 - i) * 300));
    mkChart('dch-al', lineCfg(labels, [{ label: 'Value', data, color: a.pri === 'crit' ? C.red : a.pri === 'warn' ? C.amber : C.cyan, fill: true }, { label: 'Limit', data: labels.map(() => lim), color: REF(), dash: [5, 4], w: 1.5 }], { xt: 6 }), true);
  }
}

function machineDrawer(mid) {
  const m = D.MACHINES.find(x => x.id === mid), f = D.fac(m.f), r = D.rng(mid);
  const labels = HOURS.map(h => h + ':00');
  const vib = HOURS.map((_, i) => +(m.vib * (m.st === 'crit' ? .55 + .45 * Math.pow(i / 23, 1.6) : .9 + r() * .2)).toFixed(2));
  const tmp = HOURS.map((_, i) => +(m.temp * (m.st === 'crit' ? .85 + .15 * i / 23 : .95 + r() * .08)).toFixed(1));
  drawer(dHead('wrench', m.name, `${f.name} · ${f.tenant} · ${m.type}`) +
    `<div class="tiles" style="--n:4">${tile({ l: 'Health', v: pct(m.health, 0), st: m.health < 50 ? 'crit' : m.health < 75 ? 'warn' : 'good' })}${tile({ l: 'Remaining life', v: u(m.rul, 'days'), st: m.rul < 10 ? 'crit' : '' })}${tile({ l: 'Runtime', v: u(m.run, 'h') })}${tile({ l: 'Status', v: m.st === 'crit' ? 'Critical' : m.st === 'warn' ? 'Watch' : 'Running', st: m.st === 'crit' ? 'crit' : m.st === 'warn' ? 'warn' : 'good' })}</div>` +
    box('Live readings', kv([['Temperature', `${m.temp} °C`], ['Vibration (RMS)', `${m.vib} mm/s ${m.vib > 4.5 ? pill('crit', '> 4.5 limit') : m.vib > 3.5 ? pill('warn', '> 3.5 warning') : ''}`], ['Motor current', `${m.amp} A`], ['Pressure', m.pres == null ? '—' : `${m.pres} bar`], ['Runtime since overhaul', `${fmt(m.run)} h`]])) +
    box('Vibration & temperature · 24 h', canvas('dch-m', 190)) +
    box('Predictive maintenance', `<p class="note" style="font-size:13px;color:#fff">${m.st === 'crit' ? 'Bearing defect frequency rising since 06:00. Failure likely within 6 days at current load. Replace drive-end bearing at the next stop; reduce load to 60% until then.' : m.st === 'warn' ? 'Vibration trending up 4% per week. Inspect alignment and screw wear at the next planned stop.' : 'All indicators inside normal bands. Next planned service in ' + Math.round(m.rul * .6) + ' days.'}</p>`) +
    `<div class="actions"><button class="btn" type="button" data-act="${reg(() => toast(`Work order created for ${m.name} (demo)`))}">Create work order</button><button class="btn ghost" type="button" data-act="${reg(() => factoryDrawer(m.f))}">Open ${f.name}</button></div>`, m.st === 'crit' ? 'red' : 'purple');
  const cfg = lineCfg(labels, [{ label: 'Vibration mm/s', data: vib, color: m.st === 'crit' ? C.red : C.purple, fill: true }, { label: 'Temperature °C', data: tmp, color: C.amber }], { xt: 8 });
  cfg.data.datasets[1].yAxisID = 'y2'; cfg.options.scales.y2 = { position: 'right', grid: { display: false }, ticks: { maxTicksLimit: 5 } };
  mkChart('dch-m', cfg, true);
}

function gateDrawer(gid) {
  const g = D.GATES.find(x => x.id === gid), t = D.traffic();
  const ent = Math.round(t.entries * g.inShare), ext = Math.round(t.exits * g.outShare);
  const ev = D.ANPR.filter(e => e.gate === gid).slice(0, 8);
  const hf = D.hourNow();
  const hin = D.PROF_IN.map((w, h) => h <= hf ? Math.round(D.DAY_TOTAL * g.inShare * w / D.sum(D.PROF_IN) * (h + 1 > hf ? hf - h : 1)) : null);
  const hout = D.PROF_OUT.map((w, h) => h <= hf ? Math.round(D.DAY_TOTAL * g.outShare * w / D.sum(D.PROF_OUT) * (h + 1 > hf ? hf - h : 1)) : null);
  const st = g.status === 'OFFLINE' ? 'crit' : g.status === 'BUSY' ? 'warn' : g.status === 'STANDBY' ? 'off' : 'ok';
  drawer(dHead('gate', g.name, `${g.use} · ${g.lanes} lane${g.lanes > 1 ? 's' : ''}`) +
    `<div class="tiles" style="--n:4">${tile({ l: 'Status', v: g.status, st: st === 'ok' ? 'good' : st === 'off' ? '' : st })}${tile({ l: 'Entries today', v: fmt(ent) })}${tile({ l: 'Exits today', v: fmt(ext) })}${tile({ l: 'Waiting', v: fmt(g.waiting), s: `avg ${fmt(g.wait, 1)} min`, st: g.waiting > 8 ? 'warn' : '' })}</div>` +
    (g.note ? `<div class="box" style="border-color:var(--red)"><h4 style="color:#ffb3b3">Fault</h4><p class="note" style="color:#fff;font-size:13px">${g.note}</p></div>` : '') +
    box('Equipment', kv([['ANPR camera', g.anpr === 'Online' ? pill('ok', 'Online') : pill('crit', 'Offline')], ['Barrier', g.barrier === 'OK' ? pill('ok', 'OK') : g.barrier === 'Closed' ? pill('off', 'Closed') : pill('crit', 'Fault')],
      ['CCTV cameras', g.cams[0] === g.cams[1] ? pill('ok', `${g.cams[0]}/${g.cams[1]} online`) : pill('warn', `${g.cams[0]}/${g.cams[1]} online`)], ['Average waiting time', `${fmt(g.wait, 1)} min`], ['Lanes', g.lanes]])) +
    box('Traffic by hour · today', canvas('dch-g', 170)) +
    box('Latest ANPR reads', ev.length ? table(['Time', 'Plate', 'Type', 'Dir', 'Status'], ev.map(e => ({ c: [e.time, `<b>${e.plate}</b>`, e.type, e.dir, anprPill(e.status)], go: () => vehicleDrawer(e.plate) })), { mh: 240 }) : '<p class="note">No reads at this gate today.</p>') +
    `<div class="actions"><button class="btn" type="button" ${g.status === 'OFFLINE' ? 'disabled' : ''} data-act="${reg(() => toast(`Open command sent to ${g.name.split(' · ')[0]} barrier (demo)`))}">Open barrier</button><button class="btn ghost" type="button" data-act="${reg(() => toast(`Calling guard post at ${g.name.split(' · ')[0]} (demo)`))}">Call guard post</button><button class="btn ghost" type="button" data-act="${reg(() => toast('Live CCTV opens in the video management system (demo)'))}">View cameras</button></div>`,
  st === 'crit' ? 'red' : 'purple');
  mkChart('dch-g', barCfg(HOURS, [{ label: 'Entries', data: hin, color: C.cyan }, { label: 'Exits', data: hout, color: C.purple }], { thick: 10 }), true);
}

/* ======================================================================
   PAGE LAYOUT: every system page is a one-screen summary.
   Row 1 = KPI strip, rows 2–3 = cards that fill the screen. Long lists and secondary charts open in the side drawer.
   ====================================================================== */
const hb = (label, fn, cls = 'ghost') => `<button class="btn sm ${cls}" type="button" data-act="${reg(fn)}">${label}</button>`;
const infoDrawer = (icon, title, sub, html, tone) => drawer(dHead(icon, title, sub) + html, tone);
const jump = () => {};
const listHTML = items => `<div class="list">${items.map(([n, d, s, t]) => `<div class="li" style="grid-template-columns:1fr auto"><div>${n}<small>${d}</small></div>${pill(s, t)}</div>`).join('')}</div>`;
const logHTML = items => `<div class="list">${items.map(([t, a, b]) => `<div class="li"><time>${t}</time><div>${a}<small>${b}</small></div><span></span></div>`).join('')}</div>`;

/* ======================================================================
   1. PERIMETER & ACCESS CONTROL
   ====================================================================== */
let accessFac = 'A', anprFilter = 'all';
const gateCards = () => { const t = D.traffic(); return `<div class="gates">${D.GATES.map(g => {
  const e = Math.round(t.entries * g.inShare), x = Math.round(t.exits * g.outShare);
  return `<div class="gate ${g.status}" ${act(() => gateDrawer(g.id))}><div class="gh"><b>${g.id.replace('G', 'Gate ')}</b>${lamp(g.status, g.status)}</div><div class="gn">${g.name.split(' · ')[1]} · ${g.use}</div>
    <dl><dt>In / out</dt><dd>${fmt(e)} / ${fmt(x)}</dd><dt>Waiting</dt><dd>${g.waiting} · ${g.status === 'OFFLINE' || g.status === 'STANDBY' ? '—' : fmt(g.wait, 1) + ' min'}</dd></dl>
    <div class="eq"><span class="tag ${g.anpr === 'Online' ? '' : 'bad'}">ANPR</span><span class="tag ${g.barrier === 'OK' ? '' : g.barrier === 'Closed' ? 'mid' : 'bad'}">Barrier</span><span class="tag ${g.cams[0] === g.cams[1] ? '' : 'mid'}">Cam ${g.cams[0]}/${g.cams[1]}</span></div></div>`; }).join('')}</div>`; };
PAGES.access = { title: 'Perimeter & Access Control', nav: 'Access Control', tone: 'purple', icon: 'shield', sub: 'Gates · CCTV · access control system online (61/64 devices)',
  render() {
    const vs = D.vehStats(), P = rl(), multi = range.days > 1;
    let h = tiles([
      { l: 'Gates online', v: `${gatesOn()}<small>/8</small>`, st: gatesOn() < 8 ? 'warn' : 'good', s: 'Gate 04 offline', go: () => gateDrawer('G04') },
      { l: 'Cars inside', v: () => fmt(D.vehStats().inside), s: 'Authorized, on site', go: () => openPage('vehicles', { status: 'Active', loc: 'Inside' }) },
      { l: 'Cars outside', v: fmt(D.VEH.length - vs.inside), s: 'Registered, all statuses', go: () => openPage('vehicles', { loc: 'Outside' }) },
      { l: 'Allowed cars', v: fmt(vs.authorized), s: 'Active authorizations', go: () => openPage('vehicles', { status: 'Active' }) },
      { l: 'Remaining allowed', v: fmt(vs.authorized - vs.inside), st: 'good', s: 'Can still enter', go: () => openPage('vehicles', { status: 'Active', loc: 'Outside' }) },
      { l: `Entries · ${P}`, v: () => fmt(per(D.DAY_TOTAL, D.traffic().entries, 'ent')), s: 'All gates' },
      { l: `Exits · ${P}`, v: () => fmt(per(D.DAY_TOTAL * .99, D.traffic().exits, 'ext')), s: 'All gates' },
      { l: 'Unauthorized', v: fmt(per(9, S.unauth, 'ua')), st: 'warn', s: `Attempts · ${P}`, go: () => openPage('vehicles', { anpr: 'Unauthorized' }) },
      { l: 'ANPR accuracy', v: pct(98.6), st: 'good', s: '14 cameras · 2 offline', go: () => openPage('vehicles') },
      { l: 'CCTV online', v: '142<small>/146</small>', st: 'warn', s: '4 under repair', go: () => openPage('ops') },
    ], 10);
    h += card('Gates · access control status', 'gate', gateCards(), 's8 tone-purple', 'Click a gate for details', 'sec-gates');
    h += card(`Entries & exits by hour${multi ? ' · avg' : ''}`, 'chart', canvas('c-hour'), 's4 tone-purple', '', 'sec-analytics');
    h += card('Authorized vs unauthorized', 'scan', canvas('c-auth'), 's4 tone-purple', hb('Plate reads', () => openPage('vehicles')));
    h += card('Vehicle mix', 'car', canvas('c-mix'), 's4 tone-purple');
    h += card('Gate utilization', 'gate', canvas('c-util'), 's4 tone-purple', hb('Waiting time & trend', accessMore));
    return h;
  },
  after() {
    const r = D.rng('acc' + rKey()), multi = range.days > 1, hf = range.key === 'today' ? D.hourNow() : 24;
    const scale = range.key === 'today' ? 1 : (multi ? .84 : .95 + r() * .1);
    const hr = prof => prof.map((w, h) => h <= hf ? Math.round(D.DAY_TOTAL * scale * w / D.sum(prof) * (h + 1 > hf ? hf - h : 1) * (.9 + r() * .2)) : null);
    mkChart('c-hour', barCfg(HOURS, [{ label: 'Entries', data: hr(D.PROF_IN), color: C.cyan }, { label: 'Exits', data: hr(D.PROF_OUT), color: C.purple }], { thick: 8, xt: 8 }));
    const tot = per(D.DAY_TOTAL, D.traffic().entries, 'ent'), ua = per(9, S.unauth, 'ua'), un = Math.round(tot * .011), bl = per(1.6, 2, 'bl');
    mkChart('c-auth', donutCfg(['Authorized', 'Unauthorized', 'Unknown', 'Blacklisted'], [tot - ua - un - bl, ua, un, bl], [C.green, C.amber, C.info, C.red]));
    mkChart('c-mix', donutCfg(['Cars', 'Trucks', 'Vans', 'Buses'], [Math.round(tot * .47), Math.round(tot * .34), Math.round(tot * .15), Math.round(tot * .04)], [C.cyan, C.purple, C.blue, C.teal]));
    const gs = D.GATES.filter(g => g.id !== 'G08');
    mkChart('c-util', barCfg(gs.map(g => g.id.replace('G', 'Gate ')), [{ label: 'Utilization %', data: gs.map(g => g.status === 'OFFLINE' ? 0 : Math.round(g.inShare * 260 + 18 + r() * 8)), colors: gs.map(g => g.status === 'OFFLINE' ? C.red : g.status === 'BUSY' ? C.amber : hexA(C.cyan, .85)) }],
      { h: true, xmax: 100, thick: 12, onClick: (e, els) => { if (els.length) gateDrawer(gs[els[0].index].id); } }));
  },
};
function accessMore() {
  infoDrawer('chart', 'Access analytics', `Waiting time and daily traffic · ${rl()}`, box('Average waiting time by hour', canvas('dch-wait', 190)) + box('Daily traffic trend', canvas('dch-trend', 230)), 'purple');
  const r = D.rng('accm' + rKey()), hf = range.key === 'today' ? D.hourNow() : 24;
  mkChart('dch-wait', lineCfg(HOURS, [{ label: 'Avg wait (min)', data: HOURS.map((_, h) => h <= hf ? +(1.2 + D.PROF_IN[h] / 26 * 7.5 * (.85 + r() * .3)).toFixed(1) : null), color: C.amber, fill: true }], { zero: true, xt: 12 }), true);
  const days = dayAxis(14), de = days.map(d => Math.round(D.DAY_TOTAL * (D.isWeekend(d) ? .45 : 1) * (.92 + r() * .16)));
  mkChart('dch-trend', lineCfg(days.map(D.dShort), [{ label: 'Entries', data: de, color: C.cyan, fill: true, points: true }, { label: 'Exits', data: de.map(v => Math.round(v * (.97 + r() * .05))), color: C.purple, points: true }], { zero: true, xt: 8 }), true);
}

/* ======================================================================
   VEHICLE ACCESS (ANPR + authorization register)
   ====================================================================== */
const VF0 = () => ({ factory: 'all', company: 'all', type: 'all', status: 'all', loc: 'all', q: '', page: 0 });
const VF = VF0();
const PER_PAGE = 6;
const vfSet = p => { Object.assign(VF, VF0(), p); renderBody(true); };
const pickFac = id => { accessFac = id; $$('.fpick button').forEach(b => b.classList.toggle('on', b.dataset.f === id)); $('#fcard').innerHTML = facCard(id); };
function facCard(fid) {
  const f = D.fac(fid), fs = D.facStats(f), p = fs.inside / fs.authorized * 100;
  return `<div class="fcard"><h4>${f.name}</h4><div class="tn">${f.tenant} · ${f.sector}</div>
    <div class="row3"><div><b style="color:#cdb8ff">${fmt(fs.authorized)}</b><span>Authorized</span></div><div><b style="color:var(--cyan)">${fmt(fs.inside)}</b><span>Inside</span></div><div><b style="color:#8dffbf">${fmt(fs.slots)}</b><span>Available slots</span></div></div>
    <div class="capbar"><i style="width:${p}%;${p > 75 ? 'background:linear-gradient(90deg,#ffc44d,#ff8a1f)' : ''}"></i></div><div class="caplegend"><span>${fmt(p, 0)}% of allowance in use</span><span>${p > 75 ? 'Approaching limit' : 'Within limit'}</span></div>
    <div class="actions" style="margin-top:10px"><button class="btn sm" type="button" data-act="${reg(() => factoryDrawer(fid))}">${f.name} monitoring</button><button class="btn sm ghost" type="button" data-act="${reg(() => vfSet({ factory: fid }))}">Show its vehicles</button></div></div>
    <div class="mini-bars" style="margin-top:10px">${D.FACTORIES.map(x => { const s = D.facStats(x), q = s.inside / s.authorized * 100;
      return `<div class="mbar" ${act(() => pickFac(x.id))}><span>${x.id === 'S' ? 'Services' : x.name}</span><span class="tr"><i style="width:${q}%;--bc:${q > 75 ? C.amber : C.cyan}"></i></span><span class="n">${s.inside} / ${s.authorized}</span></div>`; }).join('')}</div>`;
}
const ANPR_COLS = ['Time', 'Plate', 'Vehicle type', 'Gate', 'Direction', 'Confidence', 'Status'];
function renderAnpr(isNew) {
  const tb = $('#anprBody'); if (!tb) return;
  const rows = D.ANPR.filter(e => anprFilter === 'all' || e.status === anprFilter).slice(0, 40);
  tb.innerHTML = rows.length ? rows.map((e, i) => rowHTML(ANPR_COLS, { c: [e.time, `<b>${e.plate}</b>`, e.type, gateName(e.gate), e.dir, `${e.conf}%`, anprPill(e.status)], go: () => vehicleDrawer(e.plate) }, isNew && i === 0 && rows[0] === D.ANPR[0] ? 'new' : '')).join('')
    : `<tr><td colspan="7" style="color:var(--mute)">No ${anprFilter.toLowerCase()} events in the feed.</td></tr>`;
}
PAGES.vehicles = { title: 'Vehicle Access', nav: 'Vehicle Access', tone: 'purple', icon: 'key', sub: 'Live plate recognition, authorized vehicles and entry capacity in one place',
  render(o) {
    if (o.factory || o.status || o.loc || o.type) Object.assign(VF, VF0(), o.factory ? { factory: o.factory } : {}, o.status ? { status: o.status } : {}, o.loc ? { loc: o.loc } : {}, o.type ? { type: o.type } : {});
    if (o.anpr) anprFilter = o.anpr;
    if (o.factory) accessFac = o.factory;
    const vs = D.vehStats(), P = rl();
    const entN = () => per(D.DAY_TOTAL, D.traffic().entries, 'ent'), extN = () => per(D.DAY_TOTAL * .99, D.traffic().exits, 'ext');
    const det = Math.round((entN() + extN()) * 1.04);
    let h = tiles([
      { l: 'Authorized vehicles', v: fmt(vs.authorized), s: 'Allowed to enter', go: () => vfSet({ status: 'Active' }) },
      { l: 'Currently inside', v: () => fmt(D.vehStats().inside), st: 'info', s: `${fmt(vs.inside / vs.authorized * 100, 1)}% of authorized`, go: () => vfSet({ status: 'Active', loc: 'Inside' }) },
      { l: 'Remaining capacity', v: fmt(vs.authorized - vs.inside), st: 'good', s: 'Can still enter', go: () => vfSet({ status: 'Active', loc: 'Outside' }) },
      { l: `Entries · ${P}`, v: () => fmt(entN()), s: 'All gates' },
      { l: `Exits · ${P}`, v: () => fmt(extN()), s: 'All gates' },
      { l: 'Pending approval', v: fmt(vs.pending), st: 'info', s: 'Security review', go: () => vfSet({ status: 'Pending' }) },
      { l: 'Expired', v: fmt(vs.expired), st: 'warn', s: 'Denied until renewed', go: () => vfSet({ status: 'Expired' }) },
      { l: 'Blocked', v: fmt(vs.blocked), st: 'crit', s: 'Blacklisted', go: () => vfSet({ status: 'Blocked' }) },
    ], 8);
    h += card('Entry capacity by factory', 'factory', `<div class="fpick" role="group" aria-label="Select factory">${D.FACTORIES.map(f => `<button type="button" class="${f.id === accessFac ? 'on' : ''}" data-f="${f.id}" data-act="${reg(() => pickFac(f.id))}">${f.id === 'S' ? 'Services' : f.id}</button>`).join('')}</div>
      <div id="fcard" class="fill">${facCard(accessFac)}</div>`, 's4 r2 tone-purple', '', 'sec-vauth');
    h += card('Live gate reads · ANPR', 'scan', `<div class="filters"><select class="fld" id="anprF" aria-label="Filter plate reads">${['all', 'Authorized', 'Unauthorized', 'Unknown', 'Blacklisted'].map(x => `<option value="${x}" ${x === anprFilter ? 'selected' : ''}>${x === 'all' ? 'All reads' : x}</option>`).join('')}</select>
      <span class="note">${fmt(det)} reads ${P} · 98.6% accuracy · ${fmt(per(9, S.unauth, 'ua'))} unauthorized · ${fmt(Math.round(det * .011))} unknown · ${fmt(per(1.6, 2, 'bl'))} blacklisted</span></div>` +
      table(ANPR_COLS, [], { id: 'anprBody' }), 's8 tone-purple', 'Each plate is checked against the register', 'sec-anpr');
    const sel = (id, all, vals, cur) => `<select class="fld" id="${id}" aria-label="${all}"><option value="all">${all}</option>${vals.map(([v, t]) => `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
    const companies = [...new Set(D.VEH.map(v => v.company))].sort();
    h += card('Vehicle register', 'car', `<div class="filters">
        ${sel('vfF', 'All factories', D.FACTORIES.map(f => [f.id, f.id === 'S' ? 'Community Services' : f.name]), VF.factory)}
        ${sel('vfC', 'All companies', companies.map(c => [c, c]), VF.company)}
        ${sel('vfT', 'All types', ['Car', 'Truck', 'Van', 'Bus'].map(x => [x, x]), VF.type)}
        ${sel('vfS', 'All statuses', ['Active', 'Pending', 'Expired', 'Blocked'].map(x => [x, x]), VF.status)}
        ${sel('vfL', 'Inside & outside', [['Inside', 'Inside'], ['Outside', 'Outside']], VF.loc)}
        <input class="fld" id="vfQ" type="search" placeholder="Plate or driver" aria-label="Search plate or driver" value="${esc(VF.q)}" style="width:130px">
        <button class="btn sm ghost" type="button" id="vfX">Reset</button></div>` +
      table(['Plate', 'Type', 'Company', 'Factory', 'Driver', 'Expiry', 'Status', 'Location'], [], { id: 'vBody' }) + '<div class="pager" id="vPager"></div>',
      's8 tone-purple', hb('Authorization types', vehTypesDrawer) + hb('Expiring soon', expiringDrawer), 'sec-vtable');
    return h;
  },
  after() {
    const bind = (id, key) => $('#' + id).addEventListener('change', e => { VF[key] = e.target.value; VF.page = 0; renderVeh(); });
    bind('vfF', 'factory'); bind('vfC', 'company'); bind('vfT', 'type'); bind('vfS', 'status'); bind('vfL', 'loc');
    $('#vfQ').addEventListener('input', e => { VF.q = e.target.value; VF.page = 0; renderVeh(); });
    $('#vfX').addEventListener('click', () => { Object.assign(VF, VF0()); renderBody(true); });
    renderVeh(); renderAnpr();
    $('#anprF').addEventListener('change', e => { anprFilter = e.target.value; renderAnpr(); });
  },
  tick() { if (Math.random() < .55) { D.pushEvent(); renderAnpr(true); } },
};
function vehTypesDrawer() {
  const act2 = D.VEH.filter(v => v.status === 'Active'), types = ['Permanent', 'Annual', 'Contractor', 'Temporary'];
  infoDrawer('list', 'Authorization types', `${fmt(act2.length)} active authorizations`, box('By type', canvas('dch-at', 240)) +
    box('By factory', table(['Factory', ...types], D.FACTORIES.map(f => ({ c: [f.id === 'S' ? 'Services' : f.name, ...types.map(t => act2.filter(v => v.factory === f.id && v.auth === t).length)] })), { mh: 300 })), 'purple');
  mkChart('dch-at', donutCfg(types, types.map(t => act2.filter(v => v.auth === t).length), [C.purple, C.cyan, C.amber, C.blue]), true);
}
function expiringDrawer() {
  const soon = D.VEH.filter(v => v.status === 'Active' && v.expiry && (v.expiry - D.today()) / 864e5 <= 14).sort((a, b) => a.expiry - b.expiry);
  infoDrawer('clock', 'Expiring within 14 days', `${soon.length} active authorizations need renewal`, table(['Plate', 'Type', 'Company', 'Factory', 'Expiry'], soon.map(v => ({ c: [`<b>${v.plate}</b>`, v.type, v.company, D.fac(v.factory).name, D.dmy(v.expiry)], go: () => vehicleDrawer(v.plate) })), { mh: 760 }), 'purple');
}
const VCOLS = ['Plate', 'Type', 'Company', 'Factory', 'Driver', 'Expiry', 'Status', 'Location'];
function renderVeh() {
  const q = VF.q.trim().toLowerCase();
  const rows = D.VEH.filter(v => (VF.factory === 'all' || v.factory === VF.factory) && (VF.company === 'all' || v.company === VF.company) && (VF.type === 'all' || v.type === VF.type) &&
    (VF.status === 'all' || v.status === VF.status) && (VF.loc === 'all' || (VF.loc === 'Inside') === v.inside) && (!q || v.plate.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q)));
  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE)); VF.page = Math.min(VF.page, pages - 1);
  const slice = rows.slice(VF.page * PER_PAGE, (VF.page + 1) * PER_PAGE);
  $('#vBody').innerHTML = slice.length ? slice.map(v => rowHTML(VCOLS, { c: [`<b>${v.plate}</b>`, v.type, v.company, v.factory === 'S' ? 'Services' : D.fac(v.factory).name, v.driver, v.expiry ? D.dmy(v.expiry) : '—', vehStatusPill(v),
    v.inside ? `${lamp('ok', '')} ${v.location}` : `${lamp('off', '')}<span style="color:var(--mute)">Outside</span>`], go: () => vehicleDrawer(v.plate) })).join('')
    : '<tr><td colspan="8" style="color:var(--mute)">No vehicles match these filters. Press Reset to see the full register.</td></tr>';
  $('#vPager').innerHTML = `<span>${fmt(rows.length)} vehicles · page ${VF.page + 1} of ${pages}</span><button class="btn sm ghost" type="button" ${VF.page ? '' : 'disabled'} data-act="${reg(() => { VF.page--; renderVeh(); })}">Previous</button><button class="btn sm ghost" type="button" ${VF.page < pages - 1 ? '' : 'disabled'} data-act="${reg(() => { VF.page++; renderVeh(); })}">Next</button>`;
}

/* ======================================================================
   2. OPERATIONS CENTER
   ====================================================================== */
const INCIDENTS = [
  ['INC-0418', 'Compressor C-12 high vibration', 'Factory C', 'crit', 'Eng. Hany Fathy', '11:47', 'Working'],
  ['INC-0417', 'Gate 04 controller offline', 'Gate 04 · East', 'crit', 'Eng. Karim Nabil', '09:13', 'On site'],
  ['INC-0416', 'Gas warning GD-14 paint shop', 'Factory F', 'warn', 'Safety Off. Mona Adel', '11:59', 'Restricted'],
  ['INC-0415', 'Pump P-04 tripped', 'Water plant', 'warn', 'Op. Youssef Adel', '11:22', 'On standby'],
  ['INC-0414', 'Truck queue at Gate 03', 'Gate 03 · Logistics West', 'warn', 'Op. Sara Mahmoud', '11:53', 'Mitigated'],
  ['INC-0411', 'CCTV cam 112 offline', 'Factory B', 'info', 'Op. Youssef Adel', '08:05', 'Resolved'],
  ['INC-0409', 'Tailgating at Gate 04', 'Gate 04 · East', 'warn', 'Op. Sara Mahmoud', '07:41', 'Resolved'],
];
const incAlarm = i => D.ALARMS.find(a => a.status !== 'Cleared' && i[1].toLowerCase().includes(a.asset.toLowerCase().split(' ').pop()));
const sysPageOf = sys => ({ Security: 'access', 'Access Control': 'access', Power: 'infra', Water: 'infra', HVAC: 'infra', Lighting: 'infra', 'Fire & Gas': 'safety', Logistics: 'logistics', Energy: 'energy', Network: 'ops' }[sys] || 'ops');
PAGES.ops = { title: 'Centralized Operations Center', nav: 'Operations Center', tone: 'blue', icon: 'monitor', sub: 'Unified monitoring, alarms, incidents and system health',
  render() {
    const a = D.alarmCounts(), off = D.sum(D.SYSTEMS.map(s => s.off)), P = rl(), openInc = INCIDENTS.filter(i => i[6] !== 'Resolved').length;
    let h = tiles([
      { l: 'Connected assets', v: fmt(S.assets), s: '13 integrated systems' },
      { l: 'Systems online', v: () => pct((S.assets - off) / S.assets * 100), st: 'good', s: `${fmt(S.assets - off)} devices` },
      { l: 'Systems offline', v: fmt(off), st: 'warn', s: 'Not reporting' },
      { l: 'Active alarms', v: fmt(a.crit + a.warn), st: 'warn', s: 'Critical + warning', go: () => openPage('alarms') },
      { l: 'Critical alarms', v: pad2(a.crit), st: a.crit ? 'crit' : 'good', go: () => openPage('alarms', { pri: 'crit' }) },
      { l: 'Warning alarms', v: pad2(a.warn), st: 'warn', go: () => openPage('alarms', { pri: 'warn' }) },
      { l: 'Active incidents', v: fmt(openInc), st: 'warn', s: `${fmt(per(4.6, 2, 'res'))} resolved · ${P}` },
      { l: 'Open work orders', v: fmt(S.backlog), s: '4 high priority' },
      { l: 'Comms availability', v: () => pct(S.comms, 2), st: 'good', s: 'Fiber ring + LTE backup' },
      { l: 'Avg response', v: () => u(S.resp, 'min', 1), s: 'Alarm → acknowledged' },
    ], 10);
    h += card('Live system status', 'list', table(['System', 'Online', 'Availability', 'Status'], D.SYSTEMS.map(s => ({
      c: [`<b>${s.name}</b>`, `${fmt(s.online)}/${fmt(s.total)}`, `${bar(s.avail, 100, hBar(s.avail))}${fmt(s.avail, 1)}%`, s.off === 0 ? pill('ok', 'Online') : s.avail < 90 ? pill('crit', `${s.off} offline`) : pill('warn', `${s.off} offline`)],
      go: () => openPage(sysPageOf(s.sys)) }))), 's5 r2 tone-blue', 'Click to open the system', 'sec-systems');
    h += card(`Alarm timeline · ${P}`, 'bell', canvas('c-altl'), 's4 tone-blue', hb('Alarm management', () => openPage('alarms'), ''), 'sec-timeline');
    h += card('Communication status', 'wifi', `<div class="fill">${listHTML([['Fiber ring · path A', '10 Gb/s · 0.4 ms', 'ok', 'Active'], ['Fiber ring · path B', '10 Gb/s', 'ok', 'Standby'], ['LTE backup router', '−71 dBm', 'ok', 'Ready'],
      ['LoRaWAN gateways', '12 / 12', 'ok', 'Online'], ['Wi-Fi access points', '96 / 98', 'warn', '2 offline'], ['TETRA radio', '4 talk groups', 'ok', 'Online']])}</div>`, 's3 tone-blue', '', 'sec-comms');
    h += card('Incident management', 'warn', table(['Incident', 'Title', 'Priority', 'Status'], INCIDENTS.map(i => ({
      c: [`<b>${i[0]}</b>`, i[1], priPill(i[3]), i[6] === 'Resolved' ? pill('off', 'Resolved') : pill(i[3] === 'crit' ? 'crit' : 'warn', i[6])],
      go: () => { const al = incAlarm(i); al ? alarmDrawer(al.id) : toast(`${i[0]} · ${i[6]}`); } }))), 's4 tone-blue', hb('Facilities', facilitiesDrawer) + hb('Operator log', operatorDrawer), 'sec-incidents');
    h += card('System availability', 'chart', canvas('c-avail'), 's3 tone-blue');
    return h;
  },
  after() {
    const r = D.rng('ops' + rKey());
    if (range.days === 1) {
      const isToday = range.key === 'today', hf = isToday ? D.hourNow() : 24;
      const by = p => HOURS.map((_, h) => h > hf ? null : (isToday ? D.ALARMS.filter(a => a.date === D.ALARMS[0].date && a.pri === p && +a.time.slice(0, 2) === h).length : Math.round(r() * (p === 'info' ? 2.2 : p === 'warn' ? 1 : .3))));
      mkChart('c-altl', barCfg(HOURS, [{ label: 'Critical', data: by('crit'), color: C.red }, { label: 'Warning', data: by('warn'), color: C.orange }, { label: 'Info', data: by('info'), color: C.info }], { stacked: true, thick: 10, xt: 8 }));
    } else {
      const days = dayAxis(range.days), cnt = p => days.map(d => D.ALARMS.filter(a => a.pri === p && +a.date === +d).length + Math.round(r() * (p === 'info' ? 6 : p === 'warn' ? 2 : .4)));
      mkChart('c-altl', barCfg(days.map(D.dShort), [{ label: 'Critical', data: cnt('crit'), color: C.red }, { label: 'Warning', data: cnt('warn'), color: C.orange }, { label: 'Info', data: cnt('info'), color: C.info }], { stacked: true, thick: 12, xt: 8 }));
    }
    const days = dayAxis(14);
    mkChart('c-avail', lineCfg(days.map(D.dShort), [{ label: 'Systems', data: days.map(() => +(98.2 + r() * 1.3).toFixed(2)), color: C.cyan, fill: true }, { label: 'Target', data: days.map(() => 98.5), color: REF(), dash: [5, 4], w: 1.2 }], { min: 97, max: 100, xt: 5 }));
  },
};
function facilitiesDrawer() {
  infoDrawer('factory', 'Facility status', 'Click a facility for its monitoring panel', `<div class="zones" style="grid-template-columns:repeat(2,1fr)">${D.FACTORIES.map(f => { const n = D.activeAlarms().filter(a => a.facility.startsWith(f.name) && a.pri !== 'info');
    const worst = n.some(a => a.pri === 'crit') ? 'crit' : n.length ? 'warn' : 'ok';
    return `<div class="zone" ${act(() => factoryDrawer(f.id))}><div style="display:flex;justify-content:space-between;align-items:center"><b>${f.id === 'S' ? 'Community Services' : f.name}</b>${lamp(worst, worst === 'ok' ? 'NORMAL' : worst === 'crit' ? 'CRITICAL' : 'WARNING')}</div>
      <div style="color:var(--mute);margin:2px 0 6px">${f.tenant}</div><div style="display:flex;gap:5px;flex-wrap:wrap"><span class="tag">Power</span><span class="tag ${f.id === 'F' ? 'mid' : ''}">Fire &amp; gas</span><span class="tag">Water</span><span class="tag">Access</span></div></div>`; }).join('')}</div>`, 'blue');
}
function operatorDrawer() {
  infoDrawer('user', 'Operator activity', 'Shift A · today', logHTML([['12:02', 'Opened lane 3B at Gate 03', 'Op. Sara Mahmoud'], ['11:59', 'Acknowledged GD-14 gas warning', 'Safety Off. Mona Adel'], ['11:48', 'Created WO-8812 for C-12', 'Eng. Hany Fathy'],
    ['11:23', 'Started standby pump P-05', 'Op. Youssef Adel'], ['10:35', 'Acknowledged TX-5 temperature', 'Eng. Hany Fathy'], ['09:14', 'Dispatched technician to Gate 04', 'Eng. Karim Nabil'], ['06:30', 'Shift handover completed · 4 open items', 'Shift B → Shift A']]), 'blue');
}

/* ======================================================================
   9. ALARM MANAGEMENT
   ====================================================================== */
const AF = { pri: 'all', system: 'all', facility: 'all', status: 'active', q: '' };
const inRange = a => { if (a.status !== 'Cleared') return true; const end = rEnd(), start = D.addDays(end, -(range.days - 1)); return a.date >= start && a.date <= end; };
const filteredAlarms = () => { const q = AF.q.trim().toLowerCase(); return D.ALARMS.filter(a => inRange(a) && (AF.pri === 'all' || a.pri === AF.pri) && (AF.system === 'all' || a.system === AF.system) && (AF.facility === 'all' || a.facility === AF.facility) &&
  (AF.status === 'all' || (AF.status === 'active' ? a.status !== 'Cleared' : a.status === AF.status)) && (!q || (a.asset + ' ' + a.alarm).toLowerCase().includes(q)))
  .sort((x, y) => (y.date - x.date) || ({ crit: 0, warn: 1, info: 2 }[x.pri] - { crit: 0, warn: 1, info: 2 }[y.pri]) || y.time.localeCompare(x.time)); };
const ACOLS = ['Time', 'Priority', 'System', 'Facility', 'Asset', 'Alarm', 'Value', 'Status', 'Ack by'];
function renderAlarms() {
  const rows = filteredAlarms();
  $('#aBody').innerHTML = rows.length ? rows.map(a => rowHTML(ACOLS, { c: [`${a.time}${+a.date !== +D.today() ? ` <span style="color:var(--dim)">${D.dShort(a.date)}</span>` : ''}`, priPill(a.pri), a.system, a.facility, `<b>${a.asset}</b>`, a.alarm, a.value, statusPill(a.status, a.pri), a.ackBy], go: () => alarmDrawer(a.id) })).join('')
    : '<tr><td colspan="9" style="color:var(--mute)">No alarms match these filters.</td></tr>';
  $('#aCount').textContent = `${rows.length} alarms`;
}
PAGES.alarms = { title: 'Alarm Management', nav: 'Alarm Management', tone: 'red', icon: 'bell', sub: 'All alarms across the community · filter, acknowledge, clear and dispatch',
  render(o) {
    if (o.pri || o.system) Object.assign(AF, { pri: o.pri || 'all', system: o.system || 'all', facility: 'all', status: 'active', q: '' });
    const a = D.alarmCounts();
    const sb = (p, n, l, c) => `<button type="button" class="sumbtn ${AF.pri === p ? 'on' : ''}" style="--c:${c}" data-act="${reg(() => { AF.pri = AF.pri === p ? 'all' : p; renderBody(true); })}"><i></i><div><b>${pad2(n)}</b><br><span>${l}</span></div></button>`;
    const opts = (vals, curv) => vals.map(v => `<option value="${esc(v)}" ${v === curv ? 'selected' : ''}>${v}</option>`).join('');
    const systems = [...new Set(D.ALARMS.map(x => x.system))].sort(), facs = [...new Set(D.ALARMS.map(x => x.facility))].sort();
    let h = `<div class="sumrow" style="grid-column:1/-1;margin:0">${sb('crit', a.crit, 'Critical', C.red)}${sb('warn', a.warn, 'Warning', C.orange)}${sb('info', a.info, 'Information', C.info)}
      <button type="button" class="sumbtn" style="--c:${C.green}" data-act="${reg(() => { AF.status = 'Cleared'; AF.pri = 'all'; renderBody(true); })}"><i></i><div><b>${pad2(D.ALARMS.filter(x => x.status === 'Cleared' && inRange(x)).length)}</b><br><span>Cleared · ${rl()}</span></div></button></div>`;
    h += card('Alarm list', 'bell', `<div class="filters">
        <select class="fld" id="afP" aria-label="Priority"><option value="all">All priorities</option><option value="crit" ${AF.pri === 'crit' ? 'selected' : ''}>Critical</option><option value="warn" ${AF.pri === 'warn' ? 'selected' : ''}>Warning</option><option value="info" ${AF.pri === 'info' ? 'selected' : ''}>Information</option></select>
        <select class="fld" id="afS" aria-label="System"><option value="all">All systems</option>${opts(systems, AF.system)}</select>
        <select class="fld" id="afF" aria-label="Facility"><option value="all">All facilities</option>${opts(facs, AF.facility)}</select>
        <select class="fld" id="afT" aria-label="Status"><option value="active" ${AF.status === 'active' ? 'selected' : ''}>Active (all)</option><option value="Active · Unack" ${AF.status === 'Active · Unack' ? 'selected' : ''}>Unacknowledged</option><option value="Active · Ack" ${AF.status === 'Active · Ack' ? 'selected' : ''}>Acknowledged</option><option value="Cleared" ${AF.status === 'Cleared' ? 'selected' : ''}>Cleared</option><option value="all" ${AF.status === 'all' ? 'selected' : ''}>All</option></select>
        <input class="fld" id="afQ" type="search" placeholder="Asset, e.g. C-12" aria-label="Asset" value="${esc(AF.q)}" style="width:140px">
        <button class="btn sm ghost" type="button" id="afX">Reset</button>
        <button class="btn sm" type="button" id="afAck">Acknowledge visible</button>
        <span class="note" id="aCount" style="margin-left:auto"></span></div>
      ${table(ACOLS, [], { id: 'aBody' })}`, 's9 r2 tone-red', 'Click an alarm for details');
    h += card(`Alarms by system · ${rl()}`, 'chart', canvas('c-asys'), 's3 tone-red');
    h += card('Response performance', 'clock', kv([['Mean time to acknowledge', `${fmt(S.resp, 1)} min`], ['Mean time to clear', '38 min'], ['Unacknowledged > 15 min', fmt(D.activeAlarms().filter(x => x.status.endsWith('Unack') && x.pri !== 'info').length)]]) + canvas('c-aresp'), 's3 tone-red');
    return h;
  },
  after() {
    const bind = (id, k) => $('#' + id).addEventListener('change', e => { AF[k] = e.target.value; renderAlarms(); $$('.sumbtn').forEach(b => b.classList.remove('on')); });
    bind('afP', 'pri'); bind('afS', 'system'); bind('afF', 'facility'); bind('afT', 'status');
    $('#afQ').addEventListener('input', e => { AF.q = e.target.value; renderAlarms(); });
    $('#afX').addEventListener('click', () => { Object.assign(AF, { pri: 'all', system: 'all', facility: 'all', status: 'active', q: '' }); renderBody(true); });
    $('#afAck').addEventListener('click', () => { const n = filteredAlarms().filter(a => a.status === 'Active · Unack'); n.forEach(a => { a.status = 'Active · Ack'; a.ackBy = 'Op. You (this console)'; }); toast(n.length ? `${n.length} alarms acknowledged` : 'Nothing to acknowledge in this view'); refreshAll(); });
    renderAlarms();
    const list = D.ALARMS.filter(inRange), systems = [...new Set(list.map(x => x.system))];
    mkChart('c-asys', barCfg(systems, ['crit', 'warn', 'info'].map(p => ({ label: { crit: 'Critical', warn: 'Warning', info: 'Info' }[p], data: systems.map(s => list.filter(x => x.system === s && x.pri === p).length), color: { crit: C.red, warn: C.orange, info: C.info }[p] })),
      { stacked: true, h: true, thick: 12, onClick: (e, els) => { if (els.length) { AF.system = systems[els[0].index]; AF.status = 'all'; renderBody(true); } } }));
    const r = D.rng('resp' + rKey()), days = dayAxis(14);
    mkChart('c-aresp', lineCfg(days.map(D.dShort), [{ label: 'Minutes to acknowledge', data: days.map(() => +(3.4 + r() * 1.8).toFixed(1)), color: C.amber, fill: true }, { label: 'Target 5 min', data: days.map(() => 5), color: REF(), dash: [5, 4], w: 1.2 }], { zero: true, xt: 5 }));
  },
};

/* ======================================================================
   3. INFRASTRUCTURE
   ====================================================================== */
const PUMPS = Array.from({ length: 12 }, (_, i) => { const id = `P-${pad2(i + 1)}`; const r = D.rng(id); return { id, site: i < 5 ? 'Water plant' : i < 8 ? 'Booster BS-1' : i < 10 ? 'Lift station LS-2' : 'Fire water', flow: i === 3 ? 0 : Math.round(60 + r() * 60), pres: i === 3 ? 0 : +(3.8 + r() * 1.2).toFixed(1), st: i === 3 ? 'Tripped' : i === 4 ? 'Running' : i >= 10 ? 'Standby' : 'Running' }; });
PAGES.infra = { title: 'Smart Infrastructure Management', nav: 'Infrastructure', tone: 'cyan', icon: 'infra', sub: 'Electrical network · water network · pumps · HVAC · street lighting',
  render() {
    const P = rl();
    let h = tiles([
      { l: 'Substations online', v: '3<small>/3</small>', st: 'good' }, { l: 'Transformers online', v: '8<small>/8</small>', st: 'good', s: 'TX-5 warm' },
      { l: 'Electrical load', v: () => u(S.load, 'MW', 2), s: '41% of firm capacity' }, { l: `Water used · ${P}`, v: () => u(per(8150, S.waterToday, 'wc'), 'm³') },
      { l: 'Water pressure', v: '4.6<small>bar</small>', s: 'Setpoint 4.5 bar' }, { l: 'Tank level', v: pct(59, 0), st: 'warn', s: 'T-2 low at 34%' },
      { l: 'Pump availability', v: () => pct(S.pumpsRun / 12 * 100), st: 'warn', s: 'P-04 tripped' }, { l: 'HVAC availability', v: () => pct(S.hvac) },
      { l: 'Street lighting', v: () => pct(S.lights), s: '1,836 / 1,856 lights' }, { l: 'Utility availability', v: () => pct(S.infraAvail), st: 'good', s: 'By utility, 30 days', go: utilDrawer },
    ], 10);
    h += card('Electrical load · 24 h', 'bolt', canvas('c-load'), 's5 tone-cyan', '', 'sec-load');
    h += card('Water network', 'drop', `<div class="mini-bars">${[['Tank T-1 · potable', 78], ['Tank T-2 · potable', 34], ['Tank T-3 · process', 66], ['Fire water reserve', 96]].map(([n, v]) =>
      `<div class="mbar" style="grid-template-columns:120px 1fr 40px"><span>${n}</span><span class="tr"><i style="width:${v}%;--bc:${v < 35 ? C.red : v < 45 ? C.amber : C.cyan}"></i></span><span class="n">${v}%</span></div>`).join('')}</div>` + canvas('c-wp'), 's4 tone-cyan', '', 'sec-water');
    h += card('Substations & transformers', 'infra', table(['Asset', 'Load', 'Status'], [
      ['SS-1 · 66/22 kV', 58, 'ok'], ['SS-2 · 22/11 kV', 71, 'ok'], ['SS-3 · 22/11 kV', 64, 'ok'],
      ['TX-1 · 10 MVA', 58, 'ok'], ['TX-2 · 10 MVA', 51, 'ok'], ['TX-3 · 2.5 MVA', 71, 'ok'], ['TX-4 · 2.5 MVA', 62, 'ok'], ['TX-5 · 84 °C', 79, 'warn'], ['TX-6 · 2.5 MVA', 55, 'ok'], ['TX-7 · 1.6 MVA', 48, 'ok'], ['TX-8 · 1.6 MVA', 44, 'ok']]
      .map(([a, l, s]) => ({ c: [`<b>${a}</b>`, `${l}%`, s === 'ok' ? pill('ok', 'Normal') : pill('warn', 'Warm')], go: s === 'warn' ? () => alarmDrawer(D.ALARMS.find(x => x.asset === 'Transformer TX-5').id) : null }))), 's3 tone-cyan', '', 'sec-subs');
    h += card('Pumps', 'drop', table(['Pump', 'Site', 'Flow', 'Pressure', 'Status'], PUMPS.map(p => ({ c: [`<b>${p.id}</b>`, p.site, `${p.flow} m³/h`, `${p.pres} bar`, p.st === 'Tripped' ? pill('crit', 'Tripped') : p.st === 'Standby' ? pill('off', 'Standby') : pill('ok', p.st)],
      go: p.st === 'Tripped' ? () => alarmDrawer(D.ALARMS.find(x => x.asset === 'Pump P-04').id) : null }))), 's4 tone-cyan', '', 'sec-pumps');
    h += card('HVAC systems', 'hvac', table(['Unit', 'Serves', 'Supply', 'Status'], [
      ['Chiller CH-1', 'Admin & ops center', '6.9 °C', 'ok'], ['Chiller CH-2', 'Admin & ops center', '6.8 °C', 'ok'], ['Chiller CH-3', 'Factory D clean rooms', '7.1 °C', 'ok'],
      ['AHU-07', 'Factory D', '14.2 °C', 'warn'], ['AHU-11', 'Factory B cold store', '2.1 °C', 'ok'], ['AHU-14', 'Data room', '18.0 °C', 'ok'], ['VRF block 2', 'Workforce hub', '—', 'off']]
      .map(([a, b, c, s]) => ({ c: [`<b>${a}</b>`, b, c, s === 'ok' ? pill('ok', 'Running') : s === 'warn' ? pill('warn', 'Filter ΔP high') : pill('off', '3 units fault')] }))), 's4 tone-cyan', '', 'sec-hvac');
    h += card('Street lighting', 'light', `<div class="zones fill" style="grid-template-columns:repeat(2,1fr)">${[['North', 412, 410], ['South', 398, 391], ['East', 356, 353], ['West', 344, 342], ['Ring road', 226, 224], ['Truck yards', 120, 116]].map(([z, t, o]) =>
      `<div class="zone"><b>${z}</b><div class="tr"><i style="width:${o / t * 100}%;--bc:${o / t < .98 ? C.amber : C.green}"></i></div>${o}/${t} · ${t - o} faults</div>`).join('')}</div>`, 's4 tone-cyan', 'Dimming 30% after 23:00', 'sec-lights');
    return h;
  },
  after() {
    const hf = range.key === 'today' ? D.hourNow() : 24, r = D.rng('inf' + rKey());
    mkChart('c-load', lineCfg(HOURS.map(h => h + ':00'), [{ label: 'Load MW', data: HOURS.map((_, h) => h <= hf ? +(D.loadAt(h) * (.97 + r() * .06)).toFixed(2) : null), color: C.cyan, fill: true }, { label: 'Contract demand', data: HOURS.map(() => 9), color: C.amber, dash: [3, 3], w: 1.2 }], { zero: true, xt: 8 }));
    mkChart('c-wp', lineCfg(HOURS, [{ label: 'Network pressure (bar)', data: HOURS.map((_, h) => h <= hf ? +(4.4 + r() * .4 - (h === 11 ? .3 : 0)).toFixed(2) : null), color: C.cyan, fill: true }], { min: 3.5, max: 5.2, xt: 8 }));
  },
};
function utilDrawer() {
  const ut = ['Power', 'Water', 'Wastewater', 'HVAC', 'Lighting', 'Comms'], v = [99.98, 99.2, 99.6, 97.8, 98.9, 99.96];
  infoDrawer('chart', 'Utility availability', 'Last 30 days · target 99%', box('Availability by utility', canvas('dch-ut', 260)), 'cyan');
  const c = mkChart('dch-ut', barCfg(ut, [{ label: 'Availability %', data: v, colors: v.map(x => x < 98.5 ? C.amber : hexA(C.cyan, .85)) }, { type: 'line', label: 'Target 99%', data: ut.map(() => 99), color: REF(), dash: [5, 4] }], { thick: 30 }), true);
  if (c) { c.options.scales.y.min = 95; c.options.scales.y.beginAtZero = false; c.update(); }
}

/* ======================================================================
   UTILITIES · consumption per factory and park total (billing & benchmarking)
   ====================================================================== */
/* ---------- industrial gases: types, users and supply ---------- */
const GASES = {
  ng:     { name: 'Natural gas', formula: 'CH₄ · methane', unit: 'Sm³', color: '#ffc44d', get tariff() { return TF.gas; }, supply: 'Pipeline · city gate station' },
  lpg:    { name: 'LPG', formula: 'C₃H₈ / C₄H₁₀ · propane–butane', unit: 'kg', color: '#ff7ad9', tariff: 18, supply: 'Bullet tank · road tanker' },
  butene: { name: 'Butene-1', formula: 'C₄H₈ · butylene', unit: 'kg', color: '#a98bff', tariff: 42, supply: 'Pressurised storage · ISO tank' },
  n2:     { name: 'Nitrogen', formula: 'N₂', unit: 'Nm³', color: '#2fd6ff', tariff: 3.1, supply: 'Liquid tank (LIN) · vaporiser' },
  o2:     { name: 'Oxygen', formula: 'O₂', unit: 'Nm³', color: '#3b8bff', tariff: 3.6, supply: 'Liquid tank (LOX) · vaporiser' },
  ar:     { name: 'Argon', formula: 'Ar', unit: 'Nm³', color: '#9cc9ff', tariff: 9.5, supply: 'Liquid tank (LAR)' },
  co2:    { name: 'Carbon dioxide', formula: 'CO₂', unit: 'kg', color: '#2ff0c8', tariff: 6.5, supply: 'Liquid CO₂ tank' },
  c2h2:   { name: 'Acetylene', formula: 'C₂H₂', unit: 'kg', color: '#ff8a1f', tariff: 95, supply: 'Cylinder bundles' },
};
/* hourly use per factory (unit per hour) and what it is used for */
const GAS_USE = {
  A: { ng: [140, 'Boilers & dyeing'] },
  B: { ng: [260, 'Steam boilers'], co2: [85, 'Beverage carbonation'], n2: [40, 'Food packaging (MAP)'] },
  C: { ng: [420, 'Reheat furnaces'], o2: [180, 'Oxy-fuel cutting'], ar: [25, 'Welding shield gas'], c2h2: [12, 'Cutting & brazing'] },
  D: { ng: [90, 'Steam & sterilisation'], n2: [60, 'Inerting & blanketing'], co2: [10, 'Cold chain'] },
  E: { ng: [180, 'Process heaters'], butene: [140, 'Polyethylene comonomer'], n2: [35, 'Purging & conveying'] },
  F: { ng: [60, 'Paint ovens'], lpg: [25, 'Heat treatment & forklifts'], ar: [30, 'MIG welding'], co2: [18, 'MAG welding'] },
  S: { lpg: [6, 'Canteen kitchens'] },
};
const GAS_NORMAL = { C: { ng: 380 } };   // C natural gas runs ~10% above its normal
const gasRate = (fid, g) => (GAS_USE[fid] && GAS_USE[fid][g]) ? GAS_USE[fid][g][0] : 0;
const gasTotal = g => D.FACTORIES.reduce((s, f) => s + gasRate(f.id, g), 0);
const NG_TOTAL = gasTotal('ng');
const gasHours = () => Math.min(18, Math.max(0, D.hourNow() - 6));       // gas-using shifts run 06:00–24:00
const gasPeriod = (rate, key) => per(rate * 18, rate * gasHours(), key);
const GAS_TANKS = [['LPG bullet tank · Factory F', 'lpg', 62, 9], ['Butene-1 storage · Factory E', 'butene', 41, 4], ['Liquid nitrogen (LIN) · East hub', 'n2', 71, 12],
  ['Liquid oxygen (LOX) · Factory C', 'o2', 33, 3], ['Liquid argon (LAR) · Factories C & F', 'ar', 64, 10], ['Liquid CO₂ · Factory B', 'co2', 55, 7], ['Acetylene bundles · Factory C', 'c2h2', 60, 6]];
let UV = 'ew';   // utilities view: 'ew' electricity & water, 'gas'

let UF = 'all';
const ufC = () => UF === 'all' ? null : D.fac(UF);
const ufName = () => ufC() ? ufC().name : 'Park total';
const fKW = f => f.mw * 1000 * S.load / 6.87;
const fWater = f => f.water * S.waterToday / 3912;
const dpct = v => `${v >= 0 ? '+' : '−'}${fmt(Math.abs(v), 1)}%`;
PAGES.utilities = { title: 'Utilities', nav: 'Utilities', tone: 'cyan', icon: 'drop',
  sub: () => `Consumption for billing & benchmarking · ${ufName()}`,
  scope: () => `<div class="seg mini" role="group" aria-label="Utility view"><button type="button" data-uv="ew" class="${UV === 'ew' ? 'on' : ''}">Electricity &amp; water</button><button type="button" data-uv="gas" class="${UV === 'gas' ? 'on' : ''}">Gas</button></div><label class="custom" for="ufSel">Viewing <select class="fld" id="ufSel"><option value="all" ${UF === 'all' ? 'selected' : ''}>Park total</option>${D.FACTORIES.map(f => `<option value="${f.id}" ${UF === f.id ? 'selected' : ''}>${f.name}${f.id === 'S' ? '' : ` · ${f.tenant}`}</option>`).join('')}</select></label>`,
  onScope: v => { UF = v; },
  render() { return UV === 'gas' ? gasView() : this.renderEW(); },
  after() { return UV === 'gas' ? gasAfter() : this.afterEW(); },
  renderEW() {
    const c = ufC(), P = rl();
    const eToday = () => c ? energyToday() * c.mw / 6.87 : energyToday();
    const eP = () => per(c ? 165 * c.mw / 6.87 : 165, eToday(), 'ue' + UF, 1);
    const wP = () => per(c ? c.water * 1.85 : 8150, c ? fWater(c) : S.waterToday, 'uw' + UF);
    const gasH = c ? gasRate(c.id, 'ng') : NG_TOTAL, gP = () => gasPeriod(gasH, 'ug' + UF);
    const cost = () => (eP() * 1000 * TF.elec + wP() * TF.water + gP() * TF.gas) / 1000;
    const dE = c ? (c.mw / c.mwBase - 1) * 100 : 2.1, dW = c ? (c.water / c.wbase - 1) * 100 : 6.2;
    let h = tiles([
      { l: 'Electrical demand', v: () => c ? u(fKW(c), 'kW') : u(S.load, 'MW', 2), st: dE > 10 ? 'warn' : 'good', s: `${dpct(dE)} vs normal` },
      { l: `Energy · ${P}`, v: () => u(eP(), 'MWh', 1), s: c ? `${fmt(c.mw / 6.87 * 100, 1)}% of park` : 'All factories & services' },
      { l: `Water · ${P}`, v: () => u(wP(), 'm³'), st: dW > 10 ? 'warn' : '', s: `${dpct(dW)} vs normal` },
      { l: 'Water flow', v: () => u(c ? S.water * c.water / 3912 : S.water, 'm³/h', c ? 1 : 0) },
      { l: `Natural gas · ${P}`, v: () => gasH ? u(gP(), 'Sm³') : '—', s: gasH ? `${fmt(gasH)} Sm³/h now` : 'Not connected' },
      { l: 'Cooling demand', v: c ? '—' : u(1520, 'RT'), s: c ? 'Plot not on district cooling' : '3 of 4 chillers' },
      { l: `Utility cost · ${P}`, v: () => `EGP ${fmt(cost(), 0)}<small>k</small>`, s: 'Electricity + water + gas' },
      { l: 'Utility availability', v: () => pct(S.infraAvail), st: 'good', s: 'Target 99.0%', go: () => openPage('infra') },
    ], 8);
    const eMax = Math.max(...D.FACTORIES.map(fKW)), wMax = Math.max(...D.FACTORIES.map(fWater));
    const eRows = [...D.FACTORIES].sort((a, b) => b.mw - a.mw).map(f => { const d = (f.mw / f.mwBase - 1) * 100; return { l: f.name, v: fKW(f), t: `${fmt(fKW(f))} kW`, c: f.id === UF ? C.cyan : d > 10 ? C.amber : C.green, flag: d > 10 ? `+${fmt(d, 0)}% vs normal` : '', go: () => factoryDrawer(f.id) }; });
    const wRows = [...D.FACTORIES].sort((a, b) => b.water - a.water).map(f => { const d = (f.water / f.wbase - 1) * 100; return { l: f.name, v: fWater(f), t: `${fmt(fWater(f))} m³`, c: f.id === UF ? C.cyan : d > 10 ? C.amber : C.blue, flag: d > 10 ? `+${fmt(d, 0)}% vs normal` : '', go: () => factoryDrawer(f.id) }; });
    h += card('Energy consumption by factory · now', 'bolt', `<div class="fill">${rankHTML(eRows, eMax)}</div>`, 's6 tone-cyan', c ? `${c.name} highlighted` : 'Click a factory for details');
    h += card('Water consumption by factory · today', 'drop', `<div class="fill">${rankHTML(wRows, wMax)}</div>`, 's6 tone-cyan', 'Amber = above normal');
    h += card(`Daily energy · ${ufName()}`, 'chart', canvas('c-ude'), 's4 tone-cyan');
    h += card(`Daily water · ${ufName()}`, 'chart', canvas('c-udw'), 's4 tone-cyan');
    if (c) {
      h += card(`Billing estimate · ${P}`, 'costdown', `<div class="fill">${kv([['Electricity', `${fmt(eP() * 1000)} kWh · EGP ${fmt(eP() * TF.elec, 1)}k`], ['Water', `${fmt(wP())} m³ · EGP ${fmt(wP() * TF.water / 1000, 1)}k`], ['Natural gas', gasH ? `${fmt(gP())} Sm³ · EGP ${fmt(gP() * TF.gas / 1000, 1)}k` : '—'], ['Total', `<b>EGP ${fmt(cost(), 1)}k</b>`]])}
        <div class="gauges" style="--n:2;margin-top:10px">${gauge(c.mw / 6.87 * 100, 40, 'Share of park energy', C.cyan)}${gauge(c.water / 3904 * 100, 40, 'Share of park water', C.blue)}</div></div>`, 's4 tone-cyan', `Tariffs: ${TF.elec} EGP/kWh · ${TF.water} EGP/m³`);
    } else {
      h += card(`Utility cost split · ${P}`, 'costdown', canvas('c-ucs'), 's4 tone-cyan', 'Estimated');
    }
    return h;
  },
  afterEW() {
    const c = ufC(), r = D.rng('util' + rKey() + UF), days = dayAxis(14);
    const eDay = c ? 165 * c.mw / 6.87 : 165, wDay = c ? c.water * 1.85 : 8150;
    mkChart('c-ude', barCfg(days.map(D.dShort), [{ label: 'MWh', data: days.map(d => +(eDay * (D.isWeekend(d) ? .62 : 1) * (.94 + r() * .1)).toFixed(1)), color: C.cyan }, { type: 'line', label: 'Normal', data: days.map(d => +(eDay / (c ? c.mw / c.mwBase : 1.021) * (D.isWeekend(d) ? .62 : 1)).toFixed(1)), color: REF(), dash: [5, 4] }], { thick: 12, xt: 7 }));
    mkChart('c-udw', barCfg(days.map(D.dShort), [{ label: 'm³', data: days.map(d => Math.round(wDay * (D.isWeekend(d) ? .6 : 1) * (.93 + r() * .12))), color: C.blue }, { type: 'line', label: 'Normal', data: days.map(d => Math.round(wDay / (c ? c.water / c.wbase : 1.062) * (D.isWeekend(d) ? .6 : 1))), color: REF(), dash: [5, 4] }], { thick: 12, xt: 7 }));
    if (!c) {
      const e = per(165, energyToday(), 'ue' + UF, 1) * 1000 * TF.elec, w = per(8150, S.waterToday, 'uw' + UF) * TF.water, g = gasPeriod(NG_TOTAL, 'ug' + UF) * TF.gas;
      mkChart('c-ucs', donutCfg(['Electricity', 'Water', 'Natural gas'], [Math.round(e / 1000), Math.round(w / 1000), Math.round(g / 1000)], [C.cyan, C.blue, C.amber], { legend: 'bottom' }));
    }
  },
};

/* ---------- Utilities · gas view ---------- */
$('#pScope').addEventListener('click', e => { const b = e.target.closest('[data-uv]'); if (!b || cur !== 'utilities') return; UV = b.dataset.uv; $('#pScope').innerHTML = PAGES.utilities.scope(); renderBody(true); });
const gasFactories = () => { const c = ufC(); return c ? [c] : D.FACTORIES; };
function gasView() {
  const c = ufC(), P = rl(), fl = gasFactories();
  const rate = g => fl.reduce((s, f) => s + gasRate(f.id, g), 0);
  const per1 = g => gasPeriod(rate(g), 'g' + g + UF);
  const used = Object.keys(GASES).filter(g => rate(g) > 0);
  const cost = () => used.reduce((s, g) => s + per1(g) * GASES[g].tariff, 0) / 1000;
  const indN = () => per1('n2') + per1('o2') + per1('ar');
  const ngN = c && GAS_NORMAL[c.id] ? GAS_NORMAL[c.id].ng : 0, dNG = c ? (ngN ? (gasRate(c.id, 'ng') / ngN - 1) * 100 : 0) : 3.2;
  let h = tiles([
    { l: 'Natural gas flow', v: rate('ng') ? u(rate('ng'), 'Sm³/h') : '—', st: dNG > 10 ? 'warn' : rate('ng') ? 'good' : '', s: rate('ng') ? `CH₄ · ${dpct(dNG)} vs normal` : 'Not connected' },
    { l: `Natural gas · ${P}`, v: () => rate('ng') ? u(per1('ng'), 'Sm³') : '—', s: c ? `${fmt(rate('ng') / NG_TOTAL * 100, 1)}% of park` : `${D.FACTORIES.filter(f => gasRate(f.id, 'ng')).length} factories on pipeline` },
    { l: `LPG · ${P}`, v: () => rate('lpg') ? u(per1('lpg'), 'kg') : '—', s: 'Propane–butane' },
    { l: `Butene-1 · ${P}`, v: () => rate('butene') ? u(per1('butene'), 'kg') : '—', s: 'C₄H₈ · plastics' },
    { l: `N₂ · O₂ · Ar · ${P}`, v: () => indN() ? u(indN(), 'Nm³') : '—', s: 'Industrial gases' },
    { l: `CO₂ · ${P}`, v: () => rate('co2') ? u(per1('co2'), 'kg') : '—', s: 'Food & welding' },
    { l: `Gas cost · ${P}`, v: () => `EGP ${fmt(cost(), 0)}<small>k</small>`, s: `${used.length} gas types` },
    { l: 'Gas network', v: '4.0<small>bar</small>', st: 'warn', s: '164/164 detectors · 1 warning', go: () => openPage('safety') },
  ], 8);
  // by factory: natural gas bar + chips for the other gases
  const ngMax = Math.max(...D.FACTORIES.map(f => gasRate(f.id, 'ng'))) || 1;
  const rows = [...D.FACTORIES].sort((a, b) => gasRate(b.id, 'ng') - gasRate(a.id, 'ng')).map(f => {
    const ng = gasRate(f.id, 'ng'), nN = GAS_NORMAL[f.id] && GAS_NORMAL[f.id].ng, d = nN ? (ng / nN - 1) * 100 : 0;
    const chips = Object.keys(GAS_USE[f.id] || {}).filter(g => g !== 'ng').map(g => `<span class="gchip" style="--gc:${GASES[g].color}" title="${GASES[g].name} · ${GAS_USE[f.id][g][1]}">${GASES[g].formula.split(' ')[0]} ${fmt(GAS_USE[f.id][g][0])} ${GASES[g].unit}/h</span>`).join('');
    return `<div class="grow ${f.id === UF ? 'sel' : ''}" ${act(() => factoryDrawer(f.id))}><span class="gname">${f.name}${d > 10 ? ` <span class="pill warn">+${fmt(d, 0)}% vs normal</span>` : ''}</span>
      <span class="tr"><i style="width:${ng / ngMax * 100}%;--bc:${d > 10 ? C.amber : GASES.ng.color}"></i></span><span class="n">${ng ? `${fmt(ng)} Sm³/h` : '—'}</span><span class="gchips">${chips || '<span class="note">No other gases</span>'}</span></div>`; }).join('');
  h += card('Gas use by factory', 'factory', `<div class="gtable fill"><div class="ghead"><span>Factory</span><span>Natural gas (CH₄)</span><span></span><span>Other gases</span></div>${rows}</div>`, 's7 tone-cyan', 'Click a factory');
  // gas types present
  const types = used.map(g => { const users = fl.filter(f => gasRate(f.id, g)); return `<div class="gtype" style="--gc:${GASES[g].color}"><i></i><div><b>${GASES[g].name}</b> <span class="frm">${GASES[g].formula}</span>
    <small>${users.map(f => `${f.name.replace('Factory ', 'F-').replace('Community Services', 'Services')}: ${GAS_USE[f.id][g][1]}`).join(' · ')}</small></div><span class="n">${fmt(rate(g))} ${GASES[g].unit}/h</span></div>`; }).join('');
  h += card(`Gas types${c ? ` · ${c.name}` : ' in the park'}`, 'list', `<div class="fill">${types || '<p class="note">This factory uses no piped or bulk gases.</p>'}</div>`, 's5 tone-cyan', `${used.length} types`);
  h += card(`Natural gas flow · 24 h · ${ufName()}`, 'chart', canvas('c-g24'), 's4 tone-cyan');
  const tanks = GAS_TANKS.filter(([n, g]) => !c || gasRate(c.id, g));
  h += card('Gas storage & supply', 'drop', `<div class="mini-bars fill">${tanks.length ? tanks.map(([n, g, lv, dys]) => `<div class="mbar" style="grid-template-columns:1fr 90px 92px"><span><i class="gdot" style="--gc:${GASES[g].color}"></i>${n}</span><span class="tr"><i style="width:${lv}%;--bc:${lv < 35 ? C.red : lv < 45 ? C.amber : GASES[g].color}"></i></span><span class="n">${lv}% · ${dys} d left</span></div>`).join('') : '<p class="note">No gas storage for this factory. Natural gas comes by pipeline.</p>'}</div>`, 's4 tone-cyan', 'Reorder below 45%');
  h += card('Gas network & safety', 'warn', `<div class="fill">${kv([['City gate inlet / outlet', '7.0 / 4.0 bar'], ['Pipeline natural gas now', `${fmt(NG_TOTAL)} Sm³/h`], ['Odorant level (THT)', '78%'], ['Gas leak detectors', '164 / 164 online'], ['Emergency shut-off valves', '12 / 12 tested'], ['Active warning', 'GD-14 · Factory F paint shop · 18% LEL'], ['Last leak survey', '28 Sep · no leaks']])}</div>`, 's4 tone-cyan', 'Pipeline & bulk gases');
  return h;
}
function gasAfter() {
  const c = ufC(), r = D.rng('gas' + rKey() + UF), hf = range.key === 'today' ? D.hourNow() : 24, base = c ? gasRate(c.id, 'ng') : NG_TOTAL;
  const prof = h => h < 6 ? .08 : h < 8 ? .7 : h < 22 ? 1 - .15 * Math.abs(h - 13) / 9 : .4;
  mkChart('c-g24', lineCfg(HOURS.map(h => h + ':00'), [{ label: 'Sm³/h', data: HOURS.map((_, h) => h <= hf ? Math.round(base * prof(h) * (.94 + r() * .12)) : null), color: GASES.ng.color, fill: true },
    ...(c && GAS_NORMAL[c.id] ? [{ label: 'Normal', data: HOURS.map((_, h) => Math.round(GAS_NORMAL[c.id].ng * prof(h))), color: REF(), dash: [5, 4], w: 1.2 }] : [])], { zero: true, xt: 8 }));
}

/* ======================================================================
   4. ENERGY & SUSTAINABILITY
   ====================================================================== */
const solarToday = () => { const hf = D.hourNow(); let e = 0; for (let h = 0; h < hf; h += .25) e += D.solarAt(h) * .25; return e; };
PAGES.energy = { title: 'Energy & Sustainability', nav: 'Energy & Sustainability', tone: 'green', icon: 'leaf', sub: 'Power · solar · energy cost · carbon · water',
  render() {
    const P = rl(), e = () => per(165, energyToday(), 'en', 1), solarE = () => per(14.6, solarToday(), 'so', 1);
    let h = tiles([
      { l: 'Current power', v: () => u(S.load, 'MW', 2) }, { l: `Energy · ${P}`, v: () => u(e(), 'MWh', 1) },
      { l: 'Monthly energy', v: () => u(165 * (D.cairo().d - 1) + energyToday(), 'MWh'), s: 'Month to date' }, { l: 'Peak demand', v: u(S.peak, 'MW', 2), s: 'Today 13:15' },
      { l: 'Solar generation', v: () => u(S.solar, 'MW', 2), st: 'good', s: '3.2 MWp installed' }, { l: 'Renewable share', v: () => pct(solarE() / e() * 100), st: 'good', s: `Instant ${fmt(S.solar / S.load * 100, 1)}%` },
      { l: `Energy cost · ${P}`, v: () => `EGP ${fmt((e() - solarE()) * TF.elec, 0)}k`, s: `EGP ${TF.elec}/kWh` }, { l: 'CO₂ reduction', v: pct(S.co2), st: 'good', s: 'vs 2023 · trend', go: co2Drawer },
    ], 8);
    h += card('24-hour power consumption', 'bolt', canvas('c-24'), 's8 tone-green', '', 'sec-24h');
    h += card(`Energy by factory · ${P}`, 'factory', canvas('c-fac'), 's4 tone-green', 'Click a bar', 'sec-byfac');
    h += card('Solar generation', 'sun', canvas('c-sol'), 's3 tone-green', '', 'sec-solar');
    h += card('Renewable vs grid', 'chart', canvas('c-mix2'), 's3 tone-green', '', 'sec-mix');
    h += card('Monthly energy', 'chart', canvas('c-mon'), 's3 tone-green', '', 'sec-month');
    h += card('Sustainability', 'env', `<div class="fill">${kv([['Energy intensity', '148 kWh/t'], [`CO₂ emissions · ${P}`, `${fmt((e() - solarE()) * .47, 1)} t`], [`Water · ${P}`, `${fmt(per(8150, S.waterToday, 'wc'))} m³`], ['Treated water reused', '1,184 m³'],
      ['Power factor', '0.96'], ['Waste recycled', '71%'], ['PM10', `68 µg/m³ ${pill('warn', 'Near limit')}`], ['EV charging', '18 points']])}</div>`, 's3 tone-green', hb('CO₂ trend', co2Drawer), 'sec-co2');
    return h;
  },
  after() {
    const hf = range.key === 'today' ? D.hourNow() : 24, r = D.rng('en' + rKey());
    const load = HOURS.map((_, h) => h <= hf ? +(D.loadAt(h) * (.97 + r() * .06)).toFixed(2) : null), sol = HOURS.map((_, h) => h <= hf ? +(D.solarAt(h + .5) * (range.key === 'today' ? 1 : .95 + r() * .1)).toFixed(2) : null);
    mkChart('c-24', lineCfg(HOURS.map(h => h + ':00'), [{ label: 'Total load', data: load, color: C.cyan, fill: true }, { label: 'Solar', data: sol, color: C.green, fill: true }, { label: 'Grid import', data: load.map((v, i) => v == null ? null : +(v - sol[i]).toFixed(2)), color: C.amber, dash: [4, 3] }], { zero: true, yTitle: 'MW', xt: 12 }));
    const e = per(165, energyToday(), 'en', 1);
    mkChart('c-fac', barCfg(D.FACTORIES.map(f => f.id === 'S' ? 'Services' : f.name), [{ label: 'MWh', data: D.FACTORIES.map(f => +(e * f.mw / 6.87).toFixed(1)), colors: D.FACTORIES.map(() => hexA(C.green, .85)) }], { h: true, thick: 14, onClick: (ev, els) => { if (els.length) factoryDrawer(D.FACTORIES[els[0].index].id); } }));
    const days = dayAxis(14), solD = days.map(() => +(14.6 * (.85 + r() * .25)).toFixed(1)), totD = days.map(d => +(165 * (D.isWeekend(d) ? .62 : 1) * (.94 + r() * .1)).toFixed(0));
    mkChart('c-sol', barCfg(days.map(D.dShort), [{ label: 'Solar MWh', data: solD, color: C.green }], { thick: 10, xt: 5 }));
    mkChart('c-mix2', barCfg(days.map(D.dShort), [{ label: 'Solar', data: solD, color: C.green }, { label: 'Grid', data: totD.map((t, i) => +(t - solD[i]).toFixed(0)), color: C.blue }], { stacked: true, thick: 10, xt: 5 }));
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], mon = [4380, 4210, 4120, 4050, 4390, 4610, 4980, 5260, 5480, 5520, 5140, 4950];
    mkChart('c-mon', barCfg(months, [{ label: 'MWh', data: mon, colors: mon.map((_, i) => hexA(i === 11 ? C.cyan : C.blue, .85)) }], { thick: 14, xt: 6 }));
  },
};
function co2Drawer() {
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  infoDrawer('env', 'CO₂ reduction trend', 'Reduction vs 2023 baseline · 12 months', box('Monthly reduction', canvas('dch-co2', 260)) + box('How it is achieved', kv([['Rooftop solar', '−11.2 pts'], ['LED street lighting', '−2.6 pts'], ['Chiller optimization', '−2.9 pts'], ['Compressed air leak program', '−1.9 pts']])), 'green');
  mkChart('dch-co2', lineCfg(months, [{ label: 'CO₂ reduction %', data: [9.8, 10.6, 11.2, 12.1, 13.0, 14.2, 15.1, 15.9, 16.8, 17.4, 18.1, 18.6], color: C.green, fill: true, points: true }, { label: '2027 target 25%', data: months.map(() => 25), color: REF(), dash: [5, 4], w: 1.2 }], { zero: true }), true);
}

/* ======================================================================
   5. LOGISTICS
   ====================================================================== */
const MAP_CROP = [240, 362, 720, 282], SAFE_CROP = [480, 360, 720, 282];
const DELIV = (() => { const r = D.rng('deliv'); const st = ['At gate', 'Weighing', 'Unloading', 'Loading', 'In transit to dock', 'Completed', 'Completed', 'Waiting dock']; const items = ['Steel coils', 'Raw cotton', 'Packaging film', 'Flour', 'Chemicals (non-haz)', 'Pallets', 'Auto parts', 'PET resin'];
  return Array.from({ length: 16 }, (_, i) => { const v = D.VEH.filter(x => x.type === 'Truck' && x.status === 'Active')[i * 7]; const s = st[Math.floor(r() * st.length)];
    return { id: `DLV-${5520 + i}`, plate: v.plate, carrier: v.company, f: v.factory, item: items[Math.floor(r() * items.length)], st: s, eta: s === 'Completed' ? D.hm(7 + Math.floor(r() * 4), Math.floor(r() * 60)) : `${5 + Math.floor(r() * 40)} min` }; }); })();
const mapMarks = (el, pr, marks) => marks.forEach(([n, x, y, c]) => { const [px, py] = pr(x, y); const m = document.createElement('div'); m.className = 'mk'; m.style.cssText = `left:${px}px;top:${py}px${c ? `;--c:${c}` : ''}`; m.innerHTML = `<i></i><span>${n}</span>`; el.appendChild(m); });
PAGES.logistics = { title: 'Smart Transportation & Logistics', nav: 'Logistics', tone: 'blue', icon: 'truck', sub: 'Fleet tracking · gate queues · parking · yard · deliveries',
  render() {
    const vs = D.vehStats(), P = rl(), ent = () => per(D.DAY_TOTAL, D.traffic().entries, 'ent');
    let h = tiles([
      { l: 'Vehicles inside', v: () => fmt(D.vehStats().inside), go: () => openPage('vehicles', { status: 'Active', loc: 'Inside' }) }, { l: 'Trucks inside', v: fmt(vs.trucksInside), go: () => openPage('vehicles', { status: 'Active', loc: 'Inside', type: 'Truck' }) },
      { l: `Vehicles · ${P}`, v: () => fmt(ent()), s: 'Gate entries' }, { l: `Trucks · ${P}`, v: () => fmt(Math.round(ent() * .34)), s: '34% of entries' },
      { l: 'Avg gate wait', v: () => u(S.wait, 'min', 1) }, { l: 'Truck turnaround', v: () => u(S.turn, 'min'), s: 'Gate in → out' },
      { l: 'Parking occupancy', v: () => pct(S.parking, 0) }, { l: 'Yard occupancy', v: () => pct(S.yard, 0) },
      { l: 'Active deliveries', v: fmt(DELIV.filter(d => d.st !== 'Completed').length + 26), st: 'info' }, { l: `Completed · ${P}`, v: fmt(per(196, 104, 'dl')), st: 'good', s: 'Deliveries' },
    ], 10);
    h += card('Live vehicle tracking', 'map', `<div class="mapbox" id="lmap"></div>`, 's7 tone-blue', `${S.active} GPS-tracked vehicles`, 'sec-track');
    h += card('Parking & yard', 'car', `<div class="zones fill">${[['P1 · Visitor', 60, 41], ['P2 · Staff north', 420, 386], ['P3 · Staff south', 300, 228], ['P4 · Factory C', 120, 97], ['T1 · Truck parking', 60, 52], ['T2 · Truck holding', 40, 18], ['Container yard A', 200, 144], ['Bus bay B1', 24, 19]].map(([z, t, o]) => { const q = o / t * 100;
      return `<div class="zone"><b>${z}</b><div class="tr"><i style="width:${q}%;--bc:${q > 90 ? C.red : q > 80 ? C.amber : C.green}"></i></div>${o}/${t} · ${t - o} free</div>`; }).join('')}</div>`, 's5 tone-blue', '', 'sec-parking');
    h += card('Gate queues', 'gate', `<div class="mini-bars">${D.GATES.filter(g => g.status !== 'STANDBY').map(g => `<div class="mbar" style="grid-template-columns:62px 1fr 92px" ${act(() => gateDrawer(g.id))}><span>${g.id.replace('G', 'Gate ')}</span><span class="tr"><i style="width:${g.waiting / 10 * 100}%;--bc:${g.waiting > 8 ? C.red : g.waiting > 4 ? C.amber : C.cyan}"></i></span><span class="n">${g.status === 'OFFLINE' ? 'offline' : `${g.waiting} · ${fmt(g.wait, 1)} min`}</span></div>`).join('')}</div>`, 's3 tone-blue', '', 'sec-queues');
    h += card('Truck routes', 'truck', table(['Route', 'Trucks', 'Avg', 'Status'], [['R1 · Gate 02 → Factory C', 9, '14 min', 'ok'], ['R2 · Gate 03 → Warehouses', 7, '11 min', 'warn'], ['R3 · Yard → Weighbridge', 4, '6 min', 'ok'], ['R4 · Factory B → Gate 02', 5, '12 min', 'ok']]
      .map(([a, b, c, s]) => ({ c: [`<b>${a}</b>`, b, c, s === 'ok' ? pill('ok', 'Flowing') : pill('warn', 'Slow')] }))), 's4 tone-blue');
    h += card('Delivery status', 'list', table(['Delivery', 'Truck', 'Factory', 'Status', 'ETA'], DELIV.map(d => ({
      c: [`<b>${d.id}</b>`, d.plate, D.fac(d.f).name, d.st === 'Completed' ? pill('off', 'Completed') : d.st === 'At gate' || d.st === 'Waiting dock' ? pill('warn', d.st) : pill('info', d.st), d.eta], go: () => vehicleDrawer(d.plate) }))), 's5 tone-blue', hb('Timeline', logiTimeline), 'sec-deliv');
    return h;
  },
  after() {
    const el = $('#lmap'), pr = cropTo(el, MAP_CROP); if (!pr) return;
    const routes = [[[290, 555], [450, 600], [600, 565], [760, 525], [905, 520]], [[230, 505], [300, 470], [460, 470], [600, 450]], [[450, 600], [560, 630], [700, 612]], [[1000, 560], [860, 580], [700, 600], [455, 602]]];
    const cols = [C.cyan, C.amber, C.green, C.purple];
    const svg = mk('svg', { viewBox: `0 0 ${el.clientWidth} ${el.clientHeight}` }, el);
    routes.forEach((rt, i) => {
      const d = 'M' + rt.map(p => pr(...p).map(n => n.toFixed(1)).join(',')).join(' L');
      mk('path', { d, fill: 'none', stroke: cols[i], 'stroke-width': 4, class: 'flow', filter: 'url(#glow)' }, svg);
      for (let k = 0; k < 3; k++) { const c = mk('circle', { r: 6.5, fill: '#fff', stroke: cols[i], 'stroke-width': 3 }, svg); if (!reduce) mk('animateMotion', { dur: (9 + i * 2) + 's', begin: (k * 3.1 + i) + 's', repeatCount: 'indefinite', path: d }, c); else { const [x, y] = pr(...rt[k % rt.length]); c.setAttribute('cx', x); c.setAttribute('cy', y); } }
    });
    mapMarks(el, pr, [['Gate 02', 450, 600], ['Gate 01', 290, 555], ['Gate 03', 230, 505], ['Weighbridge', 700, 612], ['Warehouses', 600, 450], ['Factory C docks', 905, 520], ['Factory B', 1000, 560]]);
  },
};
function logiTimeline() {
  infoDrawer('clock', 'Logistics timeline', 'Today', logHTML([['12:03', 'DLV-5527 weighed at WB-1', '38.4 t · within limit'], ['11:58', 'Lane 3B opened at Gate 03', 'Queue 9 → 6 trucks'], ['11:46', 'EG-4827 arrived Factory A dock 2', 'Raw cotton · 22 t'], ['11:30', 'Container yard A reshuffle', '14 moves · RTG-2'],
    ['11:12', 'Truck parking T1 87% full', 'Overflow to T2 enabled'], ['10:50', 'DLV-5521 completed', 'Turnaround 41 min'], ['09:40', 'Weighbridge calibration check', 'Passed ±0.1%'], ['07:05', 'Morning truck wave started', '42 trucks in 30 min']]), 'blue');
}

/* ======================================================================
   6. SAFETY
   ====================================================================== */
PAGES.safety = { title: 'Safety & Emergency Management', nav: 'Safety & Emergency', tone: 'orange', icon: 'warn', sub: 'Fire and gas detection · emergency response · HSE',
  render() {
    const P = rl();
    let h = tiles([
      { l: 'Fire alarms', v: () => pad2(S.fire), st: S.fire ? 'crit' : 'good', s: '1,920 detectors' }, { l: 'Gas alarms', v: () => pad2(S.gas), st: S.gas ? 'warn' : 'good', s: 'GD-14 · 18% LEL', go: () => openPage('alarms', { system: 'Fire & Gas' }) },
      { l: `Emergency events · ${P}`, v: fmt(per(.12, S.emerg, 'em')), st: 'good' }, { l: 'Fire system availability', v: () => pct(S.fireSys), st: 'good' },
      { l: 'Emergency equipment', v: pct(98.9), s: '2 extinguishers due' }, { l: `HSE incidents · ${P}`, v: fmt(per(.08, S.hse, 'hse')), st: 'good', s: '212 days without LTI', go: incidentHistory },
      { l: 'Avg response time', v: () => u(S.resp, 'min', 1), s: 'Target 5 min' }, { l: 'Emergency vehicles', v: '4<small>/4</small>', st: 'good', s: 'All available' },
    ], 8);
    h += card('Emergency map', 'map', `<div class="mapbox" id="emap"></div>`, 's7 tone-orange', '', 'sec-emap');
    h += card('Fire station FS-1', 'fire', `<div class="fill">${listHTML([['Engine 1', 'Pumper · 4,000 L', 'ok', 'Available'], ['Engine 2', 'Foam tender · 6,000 L', 'ok', 'Available'], ['Ambulance A-1', 'ALS · paramedic on duty', 'ok', 'Available'], ['Rescue R-1', 'Hazmat & confined space', 'ok', 'Available']])}
      <div style="margin-top:10px">${kv([['Crew on shift', '14 firefighters · 2 paramedics'], ['Last drill', '28 Sep · Factory C evacuation'], ['Next drill', '12 Oct · gas release, Factory F']])}</div></div>`, 's5 tone-orange', '', 'sec-station');
    h += card('Fire detection', 'fire', table(['Zone', 'Detectors', 'Faults', 'Status'], D.FACTORIES.map((f, i) => ({ c: [`<b>${f.id === 'S' ? 'Services' : f.name}</b>`, fmt([260, 240, 420, 330, 230, 210, 230][i]), i === 2 ? 1 : 0, i === 2 ? pill('warn', '1 fault') : pill('ok', 'Normal')] }))), 's4 tone-orange', '', 'sec-fire');
    h += card('Gas detection', 'warn', table(['Detector', 'Location', 'Reading', 'Status'], [['GD-14', 'Factory F paint shop', 18, 1], ['GD-09', 'Factory F paint store', 6, 1], ['GD-31', 'Factory C furnace', 12, 0], ['GD-02', 'Factory B boiler', 2, 1], ['GD-44', 'Factory D solvent store', 4, 1], ['GD-51', 'Water plant (Cl₂)', 0.1, 0], ['GD-60', 'Factory E', 1, 1]]
      .map(([a, b, v, lel]) => ({ c: [`<b>${a}</b>`, b, lel ? `${v}% LEL` : `${v} ppm`, lel && v >= 10 ? pill('warn', 'Warning') : pill('ok', 'Normal')], go: a === 'GD-14' ? () => alarmDrawer(D.ALARMS.find(x => x.asset === 'Gas detector GD-14').id) : null }))), 's4 tone-orange', 'Warn 10% · trip 20% LEL', 'sec-gas');
    h += card('Emergency response times', 'clock', canvas('c-resp'), 's4 tone-orange', hb('Incident history', incidentHistory), 'sec-resp');
    return h;
  },
  after() {
    const el = $('#emap'), pr = cropTo(el, SAFE_CROP);
    if (pr) {
      const svg = mk('svg', { viewBox: `0 0 ${el.clientWidth} ${el.clientHeight}` }, el), [fx, fy] = pr(725, 555);
      [[1150, 470], [600, 450], [1150, 600], [560, 600]].forEach(([x, y]) => { const [px, py] = pr(x, y); mk('path', { d: `M${fx},${fy} L${px},${py}`, stroke: C.orange, 'stroke-width': 2, 'stroke-dasharray': '6 6', class: 'flow', fill: 'none' }, svg); });
      mapMarks(el, pr, [['Fire station FS-1', 725, 555, C.orange], ['GD-14 · Factory F', 1150, 470, C.amber], ['Assembly point A1', 600, 450, C.green], ['Assembly point A2', 1150, 600, C.green], ['Emergency gate 08', 1010, 622, C.cyan], ['Hydrant ring', 560, 600, C.info]]);
    }
    const v = [4.8, 3.2, 3.9, 2.8, 4.4, 3.1, +S.resp.toFixed(1)];
    mkChart('c-resp', barCfg(['02 Sep', '09 Sep', '16 Sep', '21 Sep', '28 Sep', '04 Oct', 'Today'], [{ label: 'Minutes', data: v, colors: v.map(x => x > 5 ? C.red : hexA(C.orange, .85)) }, { type: 'line', label: 'Target 5 min', data: Array(7).fill(5), color: REF(), dash: [5, 4] }], { thick: 22 }));
  },
};
function incidentHistory() {
  infoDrawer('list', 'Incident history', 'Last 30 days', table(['Date', 'Type', 'Location', 'Response', 'Outcome'], [['04 Oct', 'Gas warning', 'Factory F', '3.1 min', 'Ventilation restored'], ['28 Sep', 'Evacuation drill', 'Factory C', '4.4 min', '612 people out in 6 min'], ['21 Sep', 'Small fire (bin)', 'Factory C', '2.8 min', 'Extinguished · no injuries'],
    ['16 Sep', 'First aid', 'Truck yard T1', '3.9 min', 'Minor cut · treated'], ['09 Sep', 'Fire alarm (false)', 'Factory B', '3.2 min', 'Steam from cleaning'], ['02 Sep', 'Chemical spill drill', 'Factory D', '4.8 min', 'Contained in 11 min']].map(c => ({ c })), { mh: 600 }), 'orange');
}

/* ======================================================================
   8. WORKFORCE
   ====================================================================== */
const CONTRACTORS = [['Horus Facility Services', 96, 96, 'S'], ['Al-Amal Contracting', 74, 72, 'C'], ['Nile Electro-Mech', 58, 58, 'C'], ['Delta Safety Co.', 22, 22, 'S'], ['Sphinx Steel Erectors', 41, 39, 'C'],
  ['Green Oasis Landscaping', 34, 34, 'S'], ['Red Sea Automation', 18, 18, 'E'], ['Cairo Lift Services', 12, 12, 'C'], ['Pharos Pest Control', 8, 8, 'B'], ['Memphis IT Services', 15, 15, 'S'], ['Karnak Painting', 21, 19, 'F'], ['Aswan Cleanroom Tech', 13, 13, 'D']];
const WLOG = [];
const wr = D.rng('wlog');
const mkW = sec => { const f = D.FACTORIES[Math.floor(wr() * 7)], t = wr(); const type = t < .78 ? 'Employee' : t < .93 ? 'Contractor' : 'Visitor';
  return { time: D.clockAgo(sec), name: `${D.pick(wr, ['Ahmed', 'Mona', 'Youssef', 'Salma', 'Omar', 'Nour', 'Karim', 'Heba', 'Mahmoud', 'Dina', 'Tarek', 'Rania', 'Islam', 'Yasmin'])} ${D.pick(wr, ['Hassan', 'Ali', 'Saleh', 'Farouk', 'Adel', 'Nabil', 'Fathy', 'Mansour', 'Zaki', 'Gamal'])}`,
    type, f: f.id, point: D.pick(wr, ['Gate 05 · T-5', 'Gate 01 · T-1', `${f.name} · D-1`, 'Workforce hub · T-9']), dir: wr() < .6 ? 'In' : 'Out', ok: wr() > .03 }; };
for (let i = 30; i > 0; i--) WLOG.unshift(mkW(i * 25));
const WCOLS = ['Time', 'Name', 'Type', 'Factory', 'Access point', 'Dir', 'Result'];
const wRow = (w, cls) => rowHTML(WCOLS, { c: [w.time, `<b>${w.name}</b>`, w.type, w.f === 'S' ? 'Services' : D.fac(w.f).name, w.point, w.dir, w.ok ? pill('ok', 'Granted') : pill('crit', 'Denied')] }, cls);
PAGES.workforce = { title: 'People & Workforce Management', nav: 'People & Workforce', tone: 'cyan', icon: 'people', sub: 'Who is on site · attendance · visitors · contractors · access activity',
  render() {
    const P = rl(), entered = () => per(2620, Math.round(2620 * Math.min(1, D.hourNow() / 9)), 'ein');
    let h = tiles([
      { l: 'Employees inside', v: () => fmt(S.employees) }, { l: 'Contractors inside', v: () => fmt(S.contractors), s: '12 firms' },
      { l: 'Visitors inside', v: () => fmt(S.visitorsOn), s: `${fmt(S.visitorsToday)} today` }, { l: 'Total on site', v: () => fmt(people()), st: 'info' },
      { l: 'Attendance', v: () => pct(S.attendance), st: 'good', s: 'Shift A vs roster' }, { l: `Employees in · ${P}`, v: () => fmt(entered()) },
      { l: `Employees out · ${P}`, v: () => fmt(per(2590, Math.max(0, Math.round(2620 * Math.min(1, D.hourNow() / 9)) - S.employees), 'eout')) }, { l: 'Parking occupancy', v: () => pct(S.parking, 0), go: () => openPage('logistics') },
    ], 8);
    h += card('Workforce distribution', 'factory', canvas('c-dist'), 's5 tone-cyan', 'Click a factory', 'sec-dist');
    h += card('Attendance trend', 'chart', canvas('c-att'), 's4 tone-cyan', '', 'sec-att');
    h += card('Visitors by purpose', 'user', canvas('c-vis'), 's3 tone-cyan', 'Avg visit 2 h 14 min', 'sec-visitors');
    h += card('Contractors on site', 'wrench', table(['Firm', 'Workers', 'Permits', 'Status'], CONTRACTORS.map(([n, w, p]) => ({ c: [`<b>${n}</b>`, w, `${p}/${w}`, p < w ? pill('warn', `${w - p} expiring`) : pill('ok', 'Compliant')] }))), 's5 tone-cyan', '', 'sec-contr');
    h += card('Access activity · live', 'key', table(WCOLS, [], { id: 'wBody' }), 's7 tone-cyan', '', 'sec-log');
    return h;
  },
  after() {
    $('#wBody').innerHTML = WLOG.map(w => wRow(w)).join('');
    const fs = D.FACTORIES;
    mkChart('c-dist', barCfg(fs.map(f => f.id === 'S' ? 'Services' : f.id), [{ label: 'Employees', data: fs.map(f => f.emp), color: C.cyan }, { label: 'Contractors', data: fs.map(f => f.con), color: C.amber }, { label: 'Visitors', data: fs.map(f => f.vis), color: C.purple }],
      { stacked: true, thick: 30, onClick: (e, els) => { if (els.length) factoryDrawer(fs[els[0].index].id); } }));
    const r = D.rng('att' + rKey()), days = dayAxis(14);
    mkChart('c-att', lineCfg(days.map(D.dShort), [{ label: 'Attendance %', data: days.map(d => D.isWeekend(d) ? null : +(92.5 + r() * 4).toFixed(1)), color: C.cyan, fill: true, points: true }, { label: 'Target 95%', data: days.map(() => 95), color: REF(), dash: [5, 4], w: 1.2 }], { min: 85, max: 100, xt: 7 }));
    mkChart('c-vis', donutCfg(['Meeting', 'Supplier', 'Audit', 'Interview', 'Other'], [86, 64, 28, 21, 15], [C.cyan, C.purple, C.amber, C.green, C.blue], { legend: 'bottom' }));
  },
  tick() { const w = mkW(0); WLOG.unshift(w); if (WLOG.length > 60) WLOG.pop(); const tb = $('#wBody'); if (tb) { tb.insertAdjacentHTML('afterbegin', wRow(w, 'new')); if (tb.children.length > 60) tb.lastElementChild.remove(); } },
};

/* ======================================================================
   EXPORT REPORT · one-screen executive summary, downloadable as a one-page PDF
   ====================================================================== */
const rLabel = () => ({ today: 'Today', yesterday: 'Yesterday', '7d': 'Last 7 days', '30d': 'Last 30 days' }[range.key] || `${D.dmy(range.from)} – ${D.dmy(range.to)}`);
function buildReport() {
  const P = rLabel(), a = D.alarmCounts(), vs = D.vehStats(), t = D.traffic();
  const ent = per(D.DAY_TOTAL, t.entries, 'ent'), ext = per(D.DAY_TOTAL * .99, t.exits, 'ext'), ua = per(9, S.unauth, 'ua');
  const e = per(165, energyToday(), 'en', 1), sol = per(14.6, solarToday(), 'so', 1), w = per(8150, S.waterToday, 'wc');
  const cost = (e * 1000 * TF.elec + w * TF.water) / 1000;
  const topE = [...D.FACTORIES].sort((x, y) => y.mw - x.mw)[0];
  const sections = [
    { t: 'Park status', tone: 'blue', rows: [['Gates online', `${gatesOn()} / 8`], ['People inside', fmt(people())], ['Vehicles inside', fmt(vs.inside)], ['Active alarms', `${a.crit + a.warn} (${a.crit} critical)`], ['Systems online', `${fmt(S.sysOnline, 1)}%`], ['Infrastructure availability', `${fmt(S.infraAvail, 1)}%`]] },
    { t: 'Access & vehicles', tone: 'purple', rows: [['Vehicle entries', fmt(ent)], ['Vehicle exits', fmt(ext)], ['Authorized vehicles', fmt(vs.authorized)], ['Currently inside', fmt(vs.inside)], ['Remaining entry capacity', fmt(vs.authorized - vs.inside)], ['Unauthorized attempts', fmt(ua)], ['Pending · expired · blocked', `${vs.pending} · ${vs.expired} · ${vs.blocked}`]] },
    { t: 'Alarms & operations', tone: 'red', rows: [['Critical alarms', pad2(a.crit)], ['Warning alarms', pad2(a.warn)], ['Information', pad2(a.info)], ['Open incidents', fmt(INCIDENTS.filter(i => i[6] !== 'Resolved').length)], ['Avg response time', `${fmt(S.resp, 1)} min`], ['Comms availability', `${fmt(S.comms, 2)}%`]] },
    { t: 'Infrastructure & utilities', tone: 'cyan', rows: [['Electrical load', `${fmt(S.load, 2)} MW`], ['Water consumption', `${fmt(w)} m³`], ['Pumps running', `${S.pumpsRun} / 12`], ['HVAC availability', `${fmt(S.hvac, 1)}%`], ['Street lighting', `${fmt(S.lights, 1)}%`], ['Utility cost (est.)', `EGP ${fmt(cost, 0)}k`]] },
    { t: 'Energy & sustainability', tone: 'green', rows: [['Energy consumption', `${fmt(e, 1)} MWh`], ['Peak demand', `${fmt(S.peak, 2)} MW`], ['Solar generation', `${fmt(sol, 1)} MWh`], ['Renewable share', `${fmt(sol / e * 100, 1)}%`], ['CO2 reduction', `${fmt(S.co2, 1)}%`], ['Top consumer', `${topE.name} · ${fmt(topE.mw * 1000)} kW`]] },
    { t: 'Logistics', tone: 'blue', rows: [['Vehicles in', fmt(ent)], ['Trucks in', fmt(Math.round(ent * .34))], ['Active vehicles (GPS)', fmt(S.active)], ['Avg gate waiting', `${fmt(S.wait, 1)} min`], ['Parking occupancy', `${S.parking}%`], ['Yard occupancy', `${S.yard}%`]] },
    { t: 'Safety & emergency', tone: 'orange', rows: [['Fire alarms', pad2(S.fire)], ['Gas alarms', pad2(S.gas)], ['Emergencies', pad2(S.emerg)], ['Response time', `${fmt(S.resp, 1)} min`], ['Fire system availability', `${fmt(S.fireSys, 1)}%`], ['HSE incidents', pad2(S.hse)]] },
    { t: 'Workforce', tone: 'cyan', rows: [['Employees inside', fmt(S.employees)], ['Contractors inside', fmt(S.contractors)], ['Visitors inside', fmt(S.visitorsOn)], ['Visitors today', fmt(S.visitorsToday)], ['Attendance', `${fmt(S.attendance, 1)}%`], ['PPE compliance', `${fmt(S.ppe, 1)}%`]] },
  ];
  const insights = [
    `Two critical alarms are open: Gate 04 controller offline since 09:12 and Compressor C-12 high vibration (${fmt(S.c12v, 1)} mm/s).`,
    `${topE.name} (${topE.tenant}) is the largest energy user; Factory B runs 18% above its normal energy use and Factory D 16% above normal water use.`,
    `${fmt(vs.inside)} of ${fmt(vs.authorized)} authorized vehicles are inside (${fmt(vs.inside / vs.authorized * 100, 0)}%); ${fmt(ua)} unauthorized attempts were stopped at the gates.`,
    `Gate 01 handled the most traffic; Gate 03 has the longest queue at 9.2 min and needs a second lane.`,
    `Solar covered ${fmt(sol / e * 100, 1)}% of energy ${rl()}; CO2 is ${fmt(S.co2, 1)}% below the 2023 baseline.`,
  ];
  return { P, generated: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Cairo', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), sections, insights };
}
let RV = 'exec';   // report view: 'exec' executive summary, 'fin' financial & billing by factory
const RPER = [['cur', 'Current month'], ['prev', 'Previous month'], ['q', 'Quarter (Q3)'], ['y', 'Year 2026']];
/* per-factory consumption of every utility + every bill line, for the report page, PDF page 2 and Excel */
function fReportRows() {
  const s = fSummary(), p = s.p;
  const rows = s.bills.map(b => {
    const g = k => b.lines.find(l => l.k === k) || { cons: 0, amount: 0 }, inv = s.inv.filter(i => i.t === b.t);
    const billed = inv.reduce((a, i) => a + i.total, 0), paid = inv.reduce((a, i) => a + i.paid, 0);
    return { t: b.t, f: D.fac(b.t), g, b, svc: b.other[0].amount, veh: b.other[1].amount, veh_n: fVehicles(b.t), paid, bal: billed - paid, status: fTenantStatus(b.t),
      invNo: !p.invoiced ? 'Draft · running' : inv.length === 1 ? inv[0].no : inv.length ? `${inv.length} invoices` : 'Not invoiced', due: inv.length ? inv[inv.length - 1].dueDate : '—' };
  });
  const sum = f => rows.reduce((a, r) => a + f(r), 0);
  const tot = { cons: k => sum(r => r.g(k).cons), amt: k => sum(r => r.g(k).amount), util: sum(r => r.b.util), svc: sum(r => r.svc), veh: sum(r => r.veh), fee: sum(r => r.b.fee), fixed: sum(r => r.b.fixed), tax: sum(r => r.b.tax), total: sum(r => r.b.total), paid: sum(r => r.paid), bal: sum(r => r.bal) };
  return { s, p, rows, tot };
}
const RCOLS = [['Electricity', 'kWh', 'elec'], ['Water', 'm³', 'water'], ['Wastewater', 'm³', 'ww'], ['Cooling', 'RT-h', 'cool'], ['Natural gas', 'Sm³', 'gas']];
function repFinance() {
  const F = fReportRows(), { s, p, tot } = F, inv = p.invoiced, nz = (v, d = 0) => v ? fmt(v, d) : '—';
  let h = tiles([
    { l: 'Total billed', v: egpS(tot.total), st: 'info', s: inv ? `${s.inv.length} invoices · 6 factories` : 'Running estimate' },
    { l: 'Utility charges', v: egpS(tot.util), s: `${fmt(tot.cons('elec') / 1000, 0)} MWh · ${fmt(tot.cons('water'))} m³ water` },
    { l: 'Services & passes', v: egpS(tot.svc + tot.veh), s: 'Common areas + vehicle passes' },
    { l: 'Fees & fixed charges', v: egpS(tot.fee + tot.fixed), s: `${TF.servicePct}% fee + EGP ${fmt(TF.fixed)}/month` },
    { l: `Tax ${TF.taxPct}%`, v: egpS(tot.tax) },
    { l: 'Paid', v: inv ? egpS(tot.paid) : '—', st: 'good', s: inv ? `${s.paidCount} of ${s.inv.length} invoices fully paid` : 'Not invoiced yet' },
    { l: 'Outstanding', v: inv ? egpS(tot.bal) : '—', st: tot.bal > 1 ? 'warn' : 'good', s: `${egpS(s.overdueAmt)} overdue (all periods)` },
    { l: 'Collection rate', v: s.rate == null ? '—' : pct(s.rate), st: s.rate == null ? '' : s.rate >= 90 ? 'good' : 'warn', s: 'Target 95%' },
  ], 8);
  const th = (a, b) => ({ h: `${a}<br><small>${b}</small>`, num: 1 });
  const c1 = [{ h: 'Factory · tenant' }, ...RCOLS.flatMap(([n, un]) => [th(n, un), th(n, 'EGP')]), th('Utilities', 'EGP')];
  const r1 = F.rows.map(r => ({ c: [`<b>${r.f.name}</b> · ${r.f.tenant}`, ...RCOLS.flatMap(([, , k]) => [nz(r.g(k).cons), nz(r.g(k).amount)]), `<b>${fmt(r.b.util)}</b>`], go: () => tenantProfile(r.t) }));
  r1.push({ c: ['<b>Park total</b>', ...RCOLS.flatMap(([, , k]) => [`<b>${fmt(tot.cons(k))}</b>`, `<b>${fmt(tot.amt(k))}</b>`]), `<b>${fmt(tot.util)}</b>`] });
  h += card(`Consumption & utility charges by factory · ${p.label}`, 'grid', table(c1, r1), 's12 tone-cyan',
    `${hb(`${icon('download')} PDF`, exportPDF, '')} ${hb('Excel', repFinXLSX)} <span class="note">${RCOLS.map(([n, un, k]) => `${n} ${TF[FUTIL[k].tf]}/${un}`).join(' · ')} EGP</span>`);
  const c2 = [{ h: 'Factory' }, th('Utilities', 'EGP'), th('Common services', 'EGP'), th('Vehicle passes', 'EGP'), th(`Service fee ${TF.servicePct}%`, 'EGP'), th('Fixed charge', 'EGP'), th(`Tax ${TF.taxPct}%`, 'EGP'), th('Total bill', 'EGP'), th('Paid', 'EGP'), th('Balance', 'EGP'), { h: 'Status' }, { h: 'Invoice' }, { h: 'Due date' }];
  const r2 = F.rows.map(r => ({ c: [`<b>${r.f.name}</b>`, fmt(r.b.util), fmt(r.svc), `${fmt(r.veh)} <small>(${r.veh_n})</small>`, fmt(r.b.fee), fmt(r.b.fixed), fmt(r.b.tax), `<b>${fmt(r.b.total)}</b>`, inv ? fmt(r.paid) : '—', inv ? fmt(r.bal) : '—', fStatusPill(r.status), r.invNo, r.due], go: () => tenantProfile(r.t) }));
  r2.push({ c: ['<b>Park total</b>', ...[tot.util, tot.svc, tot.veh, tot.fee, tot.fixed, tot.tax, tot.total].map(v => `<b>${fmt(v)}</b>`), inv ? `<b>${fmt(tot.paid)}</b>` : '—', inv ? `<b>${fmt(tot.bal)}</b>` : '—', '', '', ''] });
  h += card(`Billing details by factory · ${p.range}`, 'costdown', table(c2, r2), 's12 tone-purple', 'Click a factory for its invoices and payments');
  return h;
}
PAGES.reports = { title: 'Export Report', nav: 'Export Report', tone: 'purple', icon: 'doc', rescope: true,
  get noRange() { return RV === 'fin'; },
  sub: () => RV === 'fin' ? `Financial & billing by factory · ${fPeriod().label} · ${fPeriod().range}` : 'Executive summary of the most important park data · PDF includes a financial & billing page',
  scope: () => `<div class="seg mini" role="group" aria-label="Report views">${[['exec', 'Executive summary'], ['fin', 'Financial & billing']].map(([k, l]) => `<button type="button" data-rv="${k}" class="${RV === k ? 'on' : ''}">${l}</button>`).join('')}</div>` +
    (RV === 'fin' ? `<label class="custom" for="rpSel">Billing period <select class="fld" id="rpSel">${[...RPER, ...(FP === 'custom' ? [['custom', 'Custom range']] : [])].map(([v, l]) => `<option value="${v}" ${FP === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>` : ''),
  onScope: (v, el) => { if (el && el.id === 'rpSel') FP = v; },
  render() {
    if (RV === 'fin') return repFinance();
    const R = buildReport();
    let h = `<div class="repbar"><div class="insights"><h3>${ring('chart', 26)}Key insights · ${R.P}</h3><ul>${R.insights.map(i => `<li>${i}</li>`).join('')}</ul></div>
      <div class="xbox"><button class="btn big" type="button" data-act="${reg(exportPDF)}">${icon('download')} Download PDF · 2 pages</button>
      <span class="note">A4 landscape · ${R.P} · generated ${R.generated}</span><span class="note">Page 2: consumption &amp; billing of every factory · ${fPeriod().label}</span></div></div>`;
    R.sections.forEach((s, i) => { h += card(s.t, ['map', 'key', 'bell', 'infra', 'leaf', 'truck', 'warn', 'people'][i], `<div class="rep fill">${kv(s.rows)}</div>${i === 4 ? canvas('c-rp-e') : ''}`, `s3 tone-${s.tone}`); });
    return h;
  },
  after() {
    if (RV === 'fin') return;
    const tp = [...D.FACTORIES].filter(f => f.id !== 'S').sort((a, b) => b.mw - a.mw);
    mkChart('c-rp-e', barCfg(tp.map(f => f.name.replace('Factory ', 'F-')), [{ label: 'kW now', data: tp.map(f => Math.round(f.mw * 1000 * S.load / 6.87)), colors: tp.map(f => hexA(f.mw / f.mwBase > 1.1 ? C.amber : C.green, .85)) }], { thick: 14 }));
  },
};
$('#pScope').addEventListener('click', e => {
  if (cur !== 'reports') return;
  const b = e.target.closest('[data-rv]'); if (!b || RV === b.dataset.rv) return;
  RV = b.dataset.rv; const p = PAGES.reports;
  $('#pScope').innerHTML = p.scope(); $('#pSub').textContent = p.sub();
  $('#rangeSeg').hidden = p.noRange; $('#customBox').hidden = p.noRange || range.key !== 'custom';
  renderBody(false);
});
async function repFinXLSX() {
  try { await lazyXLSX(); } catch { toast('The Excel library could not load.'); return; }
  const F = fReportRows(), wb = XLSX.utils.book_new(), R0 = Math.round;
  const cons = [['Factory', 'Tenant', ...RCOLS.flatMap(([n, un]) => [`${n} ${un}`, `${n} EGP`]), 'Utilities EGP'],
    ...F.rows.map(r => [r.f.name, r.f.tenant, ...RCOLS.flatMap(([, , k]) => [R0(r.g(k).cons), R0(r.g(k).amount)]), R0(r.b.util)]),
    ['Park total', '', ...RCOLS.flatMap(([, , k]) => [R0(F.tot.cons(k)), R0(F.tot.amt(k))]), R0(F.tot.util)]];
  const bill = [['Factory', 'Tenant', 'Utilities EGP', 'Common services EGP', 'Vehicle passes EGP', 'Vehicles', `Service fee ${TF.servicePct}% EGP`, 'Fixed charge EGP', `Tax ${TF.taxPct}% EGP`, 'Total bill EGP', 'Paid EGP', 'Balance EGP', 'Status', 'Invoice', 'Due date'],
    ...F.rows.map(r => [r.f.name, r.f.tenant, R0(r.b.util), R0(r.svc), R0(r.veh), r.veh_n, R0(r.b.fee), R0(r.b.fixed), R0(r.b.tax), R0(r.b.total), R0(r.paid), R0(r.bal), r.status, r.invNo, r.due]),
    ['Park total', '', ...[F.tot.util, F.tot.svc, F.tot.veh].map(R0), '', ...[F.tot.fee, F.tot.fixed, F.tot.tax, F.tot.total, F.tot.paid, F.tot.bal].map(R0)]];
  const tf = [['Utility', 'Tariff EGP', 'Unit'], ...RCOLS.map(([n, un, k]) => [n, TF[FUTIL[k].tf], un]), ['Service fee %', TF.servicePct, '% of utilities'], ['Fixed charge', TF.fixed, 'EGP / month'], ['Vehicle pass', TF.vehPass, 'EGP / vehicle / month'], ['Tax %', TF.taxPct, '%']];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([[`Smart Gated Industrial Community · ${F.p.label} (${F.p.range})`], [], ...cons]), 'Consumption by factory');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bill), 'Billing by factory');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tf), 'Tariffs');
  saveFile(`park-report-financial-${slug(F.p.label)}.xlsx`, new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' })), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
/* PDF page 2: every factory's consumption of every utility and its full bill */
function pdfFinancePage(doc) {
  const F = fReportRows(), W = 297, M = 10, n = v => Math.round(v).toLocaleString('en-US'), nz = v => v ? n(v) : '-', inv = F.p.invoiced;
  doc.addPage();
  doc.setFillColor(10, 26, 82); doc.rect(0, 0, W, 24, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text('Financial & Billing - Consumption and Bills by Factory', M, 11);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(150, 225, 255); doc.text(ascii(`Billing period: ${F.p.label} (${F.p.range})   |   Demo tariffs   |   Amounts in EGP`), M, 18.5);
  const k = [['Total billed', n(F.tot.total)], ['Utility charges', n(F.tot.util)], ['Services & passes', n(F.tot.svc + F.tot.veh)], ['Fees & fixed', n(F.tot.fee + F.tot.fixed)], [`Tax ${TF.taxPct}%`, n(F.tot.tax)], ['Paid', inv ? n(F.tot.paid) : '-'], ['Outstanding', inv ? n(F.tot.bal) : '-'], ['Collection rate', F.s.rate == null ? '-' : `${F.s.rate.toFixed(1)}%`]];
  const kw = (W - 2 * M - 7 * 3) / 8;
  k.forEach(([l, v], i) => { const x = M + i * (kw + 3); doc.setDrawColor(85, 48, 214); doc.setFillColor(246, 248, 255); doc.roundedRect(x, 28, kw, 14, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(70, 80, 120); doc.text(ascii(l).toUpperCase(), x + 2.5, 32.5);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(15, 25, 70); doc.text(v, x + 2.5, 39.5); });
  const st = { fontSize: 7.6, cellPadding: 1.4, halign: 'right' }, foot = { fillColor: [230, 236, 250], textColor: [15, 25, 70], fontStyle: 'bold', halign: 'right' };
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(20, 30, 70); doc.text('Consumption & utility charges', M, 49);
  doc.autoTable({ startY: 51, margin: { left: M, right: M }, theme: 'striped', styles: st, headStyles: { fillColor: [20, 120, 170], halign: 'right', fontSize: 7.4 }, footStyles: foot, columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
    head: [['Factory', ...RCOLS.flatMap(([nm, un]) => [ascii(`${nm} ${un}`), ascii(`${nm} EGP`)]), 'Utilities EGP']],
    body: F.rows.map(r => [ascii(`${r.f.name} - ${r.f.tenant}`), ...RCOLS.flatMap(([, , c]) => [nz(r.g(c).cons), nz(r.g(c).amount)]), n(r.b.util)]),
    foot: [['Park total', ...RCOLS.flatMap(([, , c]) => [n(F.tot.cons(c)), n(F.tot.amt(c))]), n(F.tot.util)]] });
  const y2 = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(20, 30, 70); doc.text('Billing details', M, y2 - 2);
  doc.autoTable({ startY: y2, margin: { left: M, right: M }, theme: 'striped', styles: st, headStyles: { fillColor: [85, 48, 214], halign: 'right', fontSize: 7.4 }, footStyles: foot, columnStyles: { 0: { halign: 'left', fontStyle: 'bold' }, 10: { halign: 'left' }, 11: { halign: 'left' }, 12: { halign: 'left' } },
    head: [['Factory', 'Utilities', 'Common services', 'Vehicle passes', `Service fee ${TF.servicePct}%`, 'Fixed charge', `Tax ${TF.taxPct}%`, 'Total bill', 'Paid', 'Balance', 'Status', 'Invoice', 'Due date']],
    body: F.rows.map(r => [r.f.name, n(r.b.util), n(r.svc), `${n(r.veh)} (${r.veh_n})`, n(r.b.fee), n(r.b.fixed), n(r.b.tax), n(r.b.total), inv ? n(r.paid) : '-', inv ? n(r.bal) : '-', r.status, ascii(r.invNo), r.due]),
    foot: [['Park total', ...[F.tot.util, F.tot.svc, F.tot.veh, F.tot.fee, F.tot.fixed, F.tot.tax, F.tot.total].map(n), inv ? n(F.tot.paid) : '-', inv ? n(F.tot.bal) : '-', '', '', '']] });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.8); doc.setTextColor(70, 80, 120);
  doc.text(doc.splitTextToSize(ascii(`Tariffs (demo values): ${RCOLS.map(([nm, un, c]) => `${nm} ${TF[FUTIL[c].tf]} EGP/${un}`).join(' · ')} · service fee ${TF.servicePct}% of utilities · fixed charge EGP ${n(TF.fixed)}/month · vehicle pass EGP ${TF.vehPass}/vehicle/month · tax ${TF.taxPct}% · payment terms ${TF.terms} days.`), W - 2 * M), M, doc.lastAutoTable.finalY + 6);
}
const loadScript = src => new Promise((res, rej) => { if ([...document.scripts].some(s => s.src === src)) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load')); document.head.appendChild(s); });
const ascii = s => String(s).replace(/₂/g, '2').replace(/³/g, '3').replace(/–|—/g, '-').replace(/−/g, '-').replace(/·/g, '|').replace(/→/g, 'to').replace(/×/g, 'x');
async function exportPDF() {
  toast('Preparing the PDF…');
  try { await lazyPDF(); }
  catch { toast('The PDF library could not load. Check the connection and try again.'); return; }
  const R = buildReport(), doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210, M = 10, TONE = { blue: [59, 139, 255], purple: [140, 100, 255], red: [230, 60, 60], cyan: [20, 170, 210], green: [34, 170, 100], orange: [235, 120, 30] };
  doc.setFillColor(10, 26, 82); doc.rect(0, 0, W, 24, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text('Smart Gated Industrial Community - Executive Report', M, 11);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(150, 225, 255); doc.text(ascii(`Period: ${R.P}   |   Generated ${R.generated} (Cairo)   |   Simulated demo data`), M, 18.5);
  const logo = id => { const im = document.querySelector(`.hlogos img[alt="${id}"]`); if (!im || !im.naturalWidth) return null; const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); return [c.toDataURL('image/png'), im.naturalWidth / im.naturalHeight]; };
  try { const we = logo('WE'); let x = W - M; if (we) { x -= 13; doc.addImage(we[0], 'PNG', x, 4.5, 13, 13); } } catch { /* logos are optional */ }
  doc.setTextColor(20, 30, 70); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('Key insights', M, 32);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.6); let y = 37;
  R.insights.forEach(t => { const l = doc.splitTextToSize('- ' + ascii(t), W - 2 * M); doc.text(l, M, y); y += l.length * 3.8 + .6; });
  const cols = 4, gap = 4, bw = (W - 2 * M - gap * (cols - 1)) / cols, top = y + 2, bh = (H - M - top - gap) / 2;
  const chart = $('#c-rp-e');
  R.sections.forEach((s, i) => {
    const cx = M + (i % cols) * (bw + gap), cy = top + Math.floor(i / cols) * (bh + gap), col = TONE[s.tone];
    doc.setDrawColor(...col); doc.setLineWidth(.4); doc.setFillColor(246, 248, 255); doc.roundedRect(cx, cy, bw, bh, 2, 2, 'FD');
    doc.setFillColor(...col); doc.roundedRect(cx, cy, bw, 7, 2, 2, 'F'); doc.rect(cx, cy + 4, bw, 3, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(s.t.toUpperCase(), cx + 3, cy + 4.9);
    doc.setFontSize(8.2); let ry = cy + 12;
    const rows = i === 4 && chart ? s.rows.slice(0, 4) : s.rows;
    rows.forEach(([k, v]) => { doc.setFont('helvetica', 'normal'); doc.setTextColor(70, 80, 120); doc.text(ascii(k), cx + 3, ry); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 25, 70); doc.text(ascii(v), cx + bw - 3, ry, { align: 'right' }); ry += 4.6; });
    if (i === 4 && chart) { const ih = Math.max(10, cy + bh - ry - 1); isLight() ? doc.setFillColor(255, 255, 255) : doc.setFillColor(10, 26, 82); doc.roundedRect(cx + 2, ry - 2, bw - 4, ih, 1.5, 1.5, 'F'); doc.addImage(chart.toDataURL('image/png'), 'PNG', cx + 3, ry - 1, bw - 6, ih - 2); }
  });
  pdfFinancePage(doc);  let dl = null; try { dl = await window.claude?.use?.('downloads'); } catch { dl = null; }
  const name = `park-report-${R.P.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  if (!dl) {   // running outside claude.ai (e.g. localhost): normal browser download
    const url = URL.createObjectURL(new Blob([doc.output('arraybuffer')], { type: 'application/pdf' }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000); toast(`${name} downloaded`); return;
  }
  try { await dl.save({ filename: name, data: doc.output('arraybuffer') }); toast(`${name} is ready`); }
  catch (e) { const c = e && e.code; toast(c === 'declined' ? 'Download cancelled' : c === 'rate_limited' ? 'A download prompt is already open' : `Download failed (${c || 'error'}). Try again.`); }
}

/* ======================================================================
   FINANCIAL & BILLING · metering → consumption → tariff → cost → tenant bill → payment
   All tariffs are DEMO values and can be changed in the Tariffs view (stored in this browser only).
   ====================================================================== */
const FIN_TENANTS = ['A', 'B', 'C', 'D', 'E', 'F'];
const FMON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const FMON_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
const FDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31];
const FUTIL = {
  elec: { name: 'Electricity', unit: 'kWh', icon: 'bolt', meter: 'EM', color: '#2fd6ff', tf: 'elec' },
  water: { name: 'Water', unit: 'm³', icon: 'drop', meter: 'WM', color: '#3b8bff', tf: 'water' },
  ww: { name: 'Wastewater', unit: 'm³', icon: 'drop', meter: 'WW', color: '#2ff0c8', tf: 'ww' },
  cool: { name: 'District cooling', unit: 'RT-h', icon: 'hvac', meter: 'CM', color: '#a98bff', tf: 'cool' },
  gas: { name: 'Natural gas', unit: 'Sm³', icon: 'fire', meter: 'GM', color: '#ffc44d', tf: 'gas' },
};
const FU_KEYS = ['elec', 'water', 'ww', 'cool', 'gas'];
/* September 2026 (last closed month) consumption per tenant — the reference month */
const FBASE = {
  A: { elec: 482650, water: 12480, cool: 18240, gas: 75600 },
  B: { elec: 550850, water: 19930, cool: 12420, gas: 140400 },
  C: { elec: 1211750, water: 8320, cool: 0, gas: 226800 },
  D: { elec: 388190, water: 16120, cool: 24600, gas: 48600 },
  E: { elec: 435410, water: 10570, cool: 6300, gas: 97200 },
  F: { elec: 325260, water: 6760, cool: 9800, gas: 32400 },
};
FIN_TENANTS.forEach(t => { FBASE[t].ww = Math.round(FBASE[t].water * .8); });
const FSERVICE = { A: 45000, B: 52000, C: 78000, D: 38000, E: 36000, F: 31000 };   // common-area service charge (EGP / month)
const FABN = { B: { elec: 1.184 }, D: { water: 1.272, ww: 1.272 }, F: { water: 1.315, ww: 1.315 }, C: { gas: 1.105 } };   // Sep vs normal
const FSEAS = {
  elec: [.88, .86, .9, .94, .98, 1.03, 1.04, 1, 1, .97], water: [.9, .88, .92, .96, 1, 1.04, 1.05, 1, 1, .96], ww: [.9, .88, .92, .96, 1, 1.04, 1.05, 1, 1, .96],
  cool: [.45, .45, .6, .8, 1.05, 1.25, 1.32, 1.3, 1, .85], gas: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};
const TF_DEFAULT = { elec: 3.25, water: 32, ww: 18, cool: 6.5, gas: 4.2, servicePct: 2.5, fixed: 12000, taxPct: 14, vehPass: 150, terms: 14 };
const TF = Object.assign({}, TF_DEFAULT);
try { Object.assign(TF, JSON.parse(localStorage.getItem('gic-tariffs') || '{}')); } catch { }
const finNoise = D.rng('fin-noise');
const FNOISE = {}; FIN_TENANTS.forEach(t => { FNOISE[t] = {}; FU_KEYS.forEach(k => { FNOISE[t][k] = FMON.map(() => .97 + finNoise() * .06); }); });
const fMonthVal = (t, k, m) => {   // full-month consumption for month index m (0 = Jan)
  const b = FBASE[t][k]; if (!b) return 0;
  const abn = (FABN[t] && FABN[t][k]) || 1, s = FSEAS[k][m] / FSEAS[k][8];
  if (m === 8) return b;
  if (m === 9) return b * s;                       // October continues at September's level (abnormal use persists)
  return b / abn * s * (abn > 1 ? 1 : FNOISE[t][k][m]);
};
const fToday = () => D.cairo().d;
/* billing periods */
let FP = 'prev', FPC = null, FV = 'overview', FT = 'A', FRANK = 'cost';
const fPeriod = () => {
  const d = fToday();
  if (FP === 'cur') return { label: `October 2026 · month to date`, range: `01 Oct → ${String(d).padStart(2, '0')} Oct 2026`, seg: [[9, d / 31]], invoiced: false };
  if (FP === 'prev') return { label: 'September 2026', range: '01 Sep → 30 Sep 2026', seg: [[8, 1]], invoiced: true };
  if (FP === 'q') return { label: 'Q3 2026 · Jul–Sep', range: '01 Jul → 30 Sep 2026', seg: [[6, 1], [7, 1], [8, 1]], invoiced: true };
  if (FP === 'y') return { label: '2026 year to date', range: `01 Jan → ${String(d).padStart(2, '0')} Oct 2026`, seg: [...FMON.slice(0, 9).map((_, i) => [i, 1]), [9, d / 31]], invoiced: true };
  const f = FPC ? FPC[0] : new Date(Date.UTC(2026, 8, 1)), to = FPC ? FPC[1] : new Date(Date.UTC(2026, 8, 30)), seg = {};
  for (let x = new Date(f); x <= to; x = new Date(x.getTime() + 864e5)) { if (x.getUTCFullYear() !== 2026) continue; const m = x.getUTCMonth(); if (m > 9 || (m === 9 && x.getUTCDate() > d)) continue; seg[m] = (seg[m] || 0) + 1 / FDAYS[m]; }
  return { label: 'Custom range', range: `${D.dmy(f)} → ${D.dmy(to)}`, seg: Object.entries(seg).map(([m, v]) => [+m, Math.min(1, v)]), invoiced: true };
};
const fCons = (t, k, per0) => (per0 || fPeriod()).seg.reduce((s, [m, f]) => s + fMonthVal(t, k, m) * f, 0);
const fVehicles = t => D.facStats(D.fac(t)).authorized;
/* bill for one tenant over a list of month segments */
function fBill(t, per0) {
  const p = per0 || fPeriod(), months = p.seg.reduce((s, [, f]) => s + f, 0);
  const lines = FU_KEYS.filter(k => FBASE[t][k]).map(k => { const cons = fCons(t, k, p); return { k, cons, tariff: TF[FUTIL[k].tf], amount: cons * TF[FUTIL[k].tf] }; });
  const other = [{ name: 'Common-area services (security, roads, landscaping, waste)', amount: FSERVICE[t] * months }, { name: `Vehicle access passes · ${fVehicles(t)} vehicles × EGP ${fmt(TF.vehPass)}`, amount: fVehicles(t) * TF.vehPass * months }];
  const util = lines.reduce((s, l) => s + l.amount, 0), oth = other.reduce((s, o) => s + o.amount, 0);
  const fee = util * TF.servicePct / 100, fixed = TF.fixed * months, sub = util + oth, tax = (sub + fee + fixed) * TF.taxPct / 100;
  return { t, lines, other, util, oth, sub, fee, fixed, tax, total: sub + fee + fixed + tax, months };
}
const fMonthBill = (t, m) => fBill(t, { seg: [[m, 1]] });
/* invoices Jan–Sep with payment status */
const FPAY = { // [status, paid fraction or fixed outstanding]
  8: { A: ['PARTIALLY PAID', { out: 640000 }], B: ['PAID'], C: ['UNPAID'], D: ['PAID'], E: ['UNPAID'], F: ['PARTIALLY PAID', { frac: .5 }] },
  7: { C: ['OVERDUE'] },
};
function fInvoice(t, m) {
  const b = fMonthBill(t, m), st = (FPAY[m] && FPAY[m][t]) || ['PAID'];
  let paid = b.total;
  if (st[0] === 'UNPAID' || st[0] === 'OVERDUE') paid = 0;
  if (st[0] === 'PARTIALLY PAID') paid = st[1].out ? b.total - st[1].out : b.total * st[1].frac;
  const no = `INV-2026-${String(m + 1).padStart(2, '0')}-${t}${String(101 + FIN_TENANTS.indexOf(t))}`;
  return { t, m, no, total: b.total, paid, due: b.total - paid, status: st[0], issue: `01 ${FMON[(m + 1) % 12] || 'Nov'} 2026`, dueDate: `${String(1 + TF.terms).padStart(2, '0')} ${FMON[(m + 1) % 12] || 'Nov'} 2026`, bill: b };
}
const fInvoicesIn = (per0) => { const p = per0 || fPeriod(); return p.seg.filter(([m, f]) => f >= .999 && m <= 8).flatMap(([m]) => FIN_TENANTS.map(t => fInvoice(t, m))); };
const fOpenAll = () => FMON.slice(0, 9).flatMap((_, m) => FIN_TENANTS.map(t => fInvoice(t, m))).filter(i => i.due > 1);
const fStatusPill = s => s === 'PAID' ? pill('ok', 'PAID') : s === 'PARTIALLY PAID' ? pill('warn', 'PARTIALLY PAID') : s === 'OVERDUE' ? pill('crit', 'OVERDUE') : s === 'RUNNING' ? pill('off', 'RUNNING') : pill('info', 'UNPAID');
const egp = (v, d = 0) => `EGP ${fmt(v, d)}`;
const egpS = v => v >= 1e6 ? `EGP ${fmt(v / 1e6, 2)}M` : v >= 1e3 ? `EGP ${fmt(v / 1e3, 0)}K` : `EGP ${fmt(v, 0)}`;
const fTenantStatus = t => { const p = fPeriod(); if (!p.invoiced) return 'RUNNING'; const inv = fInvoicesIn().filter(i => i.t === t); if (!inv.length) return 'RUNNING';
  if (inv.some(i => i.status === 'OVERDUE')) return 'OVERDUE'; if (inv.every(i => i.status === 'PAID')) return 'PAID'; if (inv.some(i => i.paid > 0)) return 'PARTIALLY PAID'; return 'UNPAID'; };
/* summary for the current period */
function fSummary() {
  const p = fPeriod(), bills = FIN_TENANTS.map(t => fBill(t, p)), inv = fInvoicesIn(p);
  const by = k => bills.reduce((s, b) => s + (b.lines.find(l => l.k === k) || { amount: 0 }).amount, 0);
  const cons = k => bills.reduce((s, b) => s + (b.lines.find(l => l.k === k) || { cons: 0 }).cons, 0);
  const total = bills.reduce((s, b) => s + b.total, 0), paid = p.invoiced ? inv.reduce((s, i) => s + i.paid, 0) : 0;
  const billed = p.invoiced ? inv.reduce((s, i) => s + i.total, 0) : total;
  const open = fOpenAll(), overdue = open.filter(i => i.status === 'OVERDUE');
  return { p, bills, inv, total, billed, paid, unpaid: billed - paid, elec: by('elec'), water: by('water'), ww: by('ww'), cool: by('cool'), gas: by('gas'),
    other: bills.reduce((s, b) => s + b.oth + b.fee + b.fixed, 0), tax: bills.reduce((s, b) => s + b.tax, 0), cons,
    open, openAmt: open.reduce((s, i) => s + i.due, 0), overdueAmt: overdue.reduce((s, i) => s + i.due, 0), paidCount: inv.filter(i => i.status === 'PAID').length, rate: p.invoiced && billed ? paid / billed * 100 : null };
}
/* meters */
const FMETERS = (() => { const r = D.rng('meters'), list = [];
  FIN_TENANTS.forEach((t, ti) => FU_KEYS.filter(k => FBASE[t][k]).forEach(k => {
    const id = `${FUTIL[k].meter}-${String(ti * 5 + FU_KEYS.indexOf(k) + 1).padStart(3, '0')}`;
    let st = 'Normal', note = 'Readings normal';
    if (t === 'F' && (k === 'water' || k === 'ww')) { st = 'Anomaly'; note = 'Night flow 4× normal · possible leak'; }
    if (t === 'E' && k === 'cool') { st = 'Offline'; note = 'No data since 05 Oct 22:10 · bill estimated'; }
    if (t === 'B' && k === 'elec') { st = 'Anomaly'; note = '+18.4% vs previous month'; }
    const start = t === 'A' && k === 'elec' ? 1248420 - fMonthVal('A', 'elec', 0) * 0 : 0;
    list.push({ id, t, k, st, note, base: t === 'A' && k === 'elec' ? null : Math.round(80000 + r() * 2.4e6), comm: st === 'Offline' ? 'Lost' : r() < .1 ? 'Weak signal' : 'OK' });
  }));
  return list; })();
const fReadingAtMonthStart = (mt, m) => {   // cumulative reading at the start of month m
  if (mt.base === null) { // Factory A electricity: anchored so that 01 Sep reading = 1,248,420 kWh
    let s = 1248420; for (let i = 8; i > m; i--) s -= fMonthVal(mt.t, mt.k, i - 1); for (let i = 8; i < m; i++) s += fMonthVal(mt.t, mt.k, i); return s; }
  let s = mt.base; for (let i = 0; i < m; i++) s += fMonthVal(mt.t, mt.k, i); return s;
};
const fMeterRead = (mt, p) => { const first = p.seg[0][0], prev = fReadingAtMonthStart(mt, first); const cons = fCons(mt.t, mt.k, p); return { prev, cur: prev + cons, cons }; };
const fMeterPill = s => s === 'Offline' ? pill('crit', '● OFFLINE') : s === 'Anomaly' ? pill('warn', '● ANOMALY') : pill('ok', '● NORMAL');
/* consumption alerts */
const fAlerts = () => [
  ['warn', 'B', 'Electricity consumption', '+18.4% above previous month', 'Refrigeration plant running on weekends; check power factor and schedule.'],
  ['warn', 'D', 'Water consumption', '+27.2% above normal', 'New clean-room wash cycle; confirm with Pharaoh Pharma facility team.'],
  ['crit', 'F', 'Water consumption anomaly', 'Possible leakage · +31.5%', 'Night flow 4× normal on WM-027 since 12 Sep. Dispatch leak survey.'],
  ['warn', 'C', 'Natural gas consumption', '+10.5% above normal', 'Reheat furnace burner tuning due.'],
  ['warn', 'E', 'Cooling meter CM-024 offline', 'Bill estimated', 'Communication lost 05 Oct 22:10. Technician scheduled.'],
];

/* ---------------- page ---------------- */
const FVIEWS = [['overview', 'Overview'], ['tenants', 'Tenant bills'], ['calc', 'Bill calculation'], ['meters', 'Meters'], ['analytics', 'Analytics'], ['tariffs', 'Tariffs'], ['report', 'Report']];
PAGES.finance = { title: 'Financial & Billing', nav: 'Financial & Billing', tone: 'purple', icon: 'costdown', noRange: true, rescope: true,
  sub: () => `${fPeriod().label} · ${fPeriod().range}`,
  scope: () => `<div class="seg mini" role="group" aria-label="Billing views">${FVIEWS.map(([k, l]) => `<button type="button" data-fv="${k}" class="${FV === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <label class="custom" for="fpSel">Billing period <select class="fld" id="fpSel">${[['cur', 'Current month'], ['prev', 'Previous month'], ['q', 'Quarter (Q3)'], ['y', 'Year 2026'], ['custom', 'Custom range']].map(([v, l]) => `<option value="${v}" ${FP === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    ${FP === 'custom' ? `<input type="date" class="fld" id="fFrom" aria-label="From" min="2026-01-01" value="${(FPC ? FPC[0] : new Date(Date.UTC(2026, 8, 1))).toISOString().slice(0, 10)}"><input type="date" class="fld" id="fTo" aria-label="To" value="${(FPC ? FPC[1] : new Date(Date.UTC(2026, 8, 30))).toISOString().slice(0, 10)}"><button class="btn sm" type="button" id="fApply">Apply</button>` : ''}`,
  onScope: (v, el) => { if (el && el.id === 'fpSel') FP = v; },
  open(o) { if (o.fv) FV = o.fv; if (o.tenant) FT = o.tenant; },
  render() { return ({ overview: finOverview, tenants: finTenants, calc: finCalc, meters: finMeters, analytics: finAnalytics, tariffs: finTariffs, report: finReport })[FV](); },
  after() { const f = ({ overview: finOverviewAfter, analytics: finAnalyticsAfter, calc: finCalcAfter, tariffs: finTariffsAfter, report: finReportAfter })[FV]; f && f(); },
};
$('#pScope').addEventListener('click', e => {
  if (cur !== 'finance') return;
  const b = e.target.closest('[data-fv]');
  if (b) { FV = b.dataset.fv; $('#pScope').innerHTML = PAGES.finance.scope(); renderBody(false); return; }
  if (e.target.id === 'fApply') { const f = new Date($('#fFrom').value + 'T00:00:00Z'), t = new Date($('#fTo').value + 'T00:00:00Z'); if (isNaN(f) || isNaN(t) || f > t) { toast('Pick a start date on or before the end date.'); return; } FPC = [f, t]; $('#pSub').textContent = PAGES.finance.sub(); renderBody(true); }
});
const finKpis = () => { const s = fSummary(), elecKwh = s.cons('elec'), mwh = elecKwh / 1000;
  return tiles([
    { l: `Total utility revenue`, v: egpS(s.billed), st: 'info', s: s.p.invoiced ? `${s.inv.length} invoices` : 'Running estimate' },
    { l: 'Energy cost', v: egpS(s.elec), s: `${fmt(mwh, 0)} MWh × ${TF.elec}` },
    { l: 'Water cost', v: egpS(s.water), s: `${fmt(s.cons('water'))} m³ × ${TF.water}` },
    { l: 'Cooling / HVAC cost', v: egpS(s.cool), s: `${fmt(s.cons('cool'))} RT-h` },
    { l: 'Wastewater cost', v: egpS(s.ww), s: `${fmt(s.cons('ww'))} m³` },
    { l: 'Total consumption', v: `${fmt(mwh, 0)}<small>MWh</small>`, s: `+ ${fmt(s.cons('water'))} m³ water` },
    { l: 'Outstanding bills', v: `${s.open.length}`, st: 'warn', s: `${egpS(s.openAmt)} open`, go: () => { FV = 'tenants'; $('#pScope').innerHTML = PAGES.finance.scope(); renderBody(); } },
    { l: 'Paid bills', v: s.p.invoiced ? `${s.paidCount}<small>/${s.inv.length}</small>` : '—', st: 'good', s: s.p.label },
    { l: 'Unpaid amount', v: s.p.invoiced ? egpS(s.unpaid) : '—', st: s.unpaid > 0 ? 'warn' : 'good', s: `${egpS(s.overdueAmt)} overdue` },
    { l: 'Collection rate', v: s.rate == null ? '—' : pct(s.rate), st: s.rate == null ? '' : s.rate >= 90 ? 'good' : 'warn', s: 'Target 95%' },
  ], 10); };

/* overview */
function finOverview() {
  const s = fSummary();
  let h = finKpis();
  const rev = [['Electricity', s.elec, FUTIL.elec.color], ['Water', s.water, FUTIL.water.color], ['District cooling', s.cool, FUTIL.cool.color], ['Wastewater', s.ww, FUTIL.ww.color], ['Natural gas', s.gas, FUTIL.gas.color], ['Other services, fees & tax', s.other + s.tax, '#ff7ad9']];
  const mx = Math.max(...rev.map(r => r[1]));
  h += card('Park revenue', 'costdown', `<div class="mini-bars fill">${rev.map(([n, v, c]) => `<div class="mbar" style="grid-template-columns:150px 1fr 100px"><span><i class="gdot" style="--gc:${c}"></i>${n}</span><span class="tr"><i style="width:${v / mx * 100}%;--bc:${c}"></i></span><span class="n">${egpS(v)}</span></div>`).join('')}
    <div class="ftotal"><span>Total revenue</span><b>${egp(s.total)}</b></div></div>`, 's4 tone-purple', s.p.label);
  h += card('Collection status', 'chart', canvas('c-fcol'), 's3 tone-purple', s.p.invoiced ? `${fmt(s.rate, 1)}% collected` : 'All open invoices');
  h += card('Utility consumption alerts', 'warn', `<div class="list fill">${fAlerts().map(([st, t, what, val, note]) => `<div class="li falert ${st}" style="grid-template-columns:1fr auto" ${act(() => tenantProfile(t))}><div><b>${st === 'crit' ? '🔴' : '⚠'} ${D.fac(t).name}</b> · ${what}<small>${note}</small></div>${pill(st, val)}</div>`).join('')}</div>`, 's5 tone-orange', 'Act before it becomes expensive');
  h += card('Tenant ranking', 'growth', `<div class="seg mini" style="margin-bottom:8px;align-self:flex-start">${[['cost', 'Cost'], ['cons', 'Consumption'], ['elec', 'Energy'], ['water', 'Water']].map(([k, l]) => `<button type="button" class="${FRANK === k ? 'on' : ''}" data-act="${reg(() => { FRANK = k; renderBody(true); })}">${l}</button>`).join('')}</div><div class="fill">${finRank(s)}</div>`, 's4 tone-purple');
  h += card('Monthly billing trend', 'chart', canvas('c-ftrend'), 's5 tone-purple', 'Jan–Oct 2026 · by utility');
  h += card('How a bill is built', 'list', `<div class="pipe fill">${[['gauge', 'Metering', `${FMETERS.length} smart meters · ${FMETERS.filter(m => m.st !== 'Offline').length} online`], ['chart', 'Consumption', `${fmt(s.cons('elec') / 1000, 0)} MWh · ${fmt(s.cons('water'))} m³`], ['key', 'Tariff', `${TF.elec} EGP/kWh · ${TF.water} EGP/m³`], ['costdown', 'Cost', egpS(s.elec + s.water + s.ww + s.cool + s.gas)], ['doc', 'Tenant bill', `${FIN_TENANTS.length} invoices · ${egpS(s.total)}`], ['shield', 'Payment', s.rate == null ? 'Running month' : `${fmt(s.rate, 1)}% collected`]]
      .map(([ic, a, b], i) => `<div class="pstep" ${act(() => { FV = ['meters', 'analytics', 'tariffs', 'calc', 'tenants', 'report'][i]; $('#pScope').innerHTML = PAGES.finance.scope(); renderBody(); })}><span class="pn">${i + 1}</span><div><b>${a}</b><small>${b}</small></div></div>`).join('')}</div>`, 's3 tone-cyan', 'Click a step');
  return h;
}
function finRank(s) {
  const rows = FIN_TENANTS.map(t => { const b = s.bills.find(x => x.t === t), g = k => (b.lines.find(l => l.k === k) || { cons: 0 }).cons;
    const v = FRANK === 'cost' ? b.total : FRANK === 'elec' ? g('elec') : FRANK === 'water' ? g('water') : g('elec') / 1000 + g('water') / 100 + g('gas') / 100;
    const txt = FRANK === 'cost' ? egpS(b.total) : FRANK === 'elec' ? `${fmt(g('elec') / 1000, 0)} MWh` : FRANK === 'water' ? `${fmt(g('water'))} m³` : `${fmt(v, 0)} pts`;
    return { t, v, txt }; }).sort((a, b) => b.v - a.v), mx = rows[0].v;
  return `<div class="rank">${rows.map((r, i) => `<div class="rr" ${act(() => tenantProfile(r.t))}><span class="no">${i + 1}</span><span>${D.fac(r.t).name}</span><span class="tr"><i style="width:${r.v / mx * 100}%;--bc:${['#b394ff', '#2fd6ff', '#3b8bff', '#2ff0c8', '#ffc44d', '#ff7ad9'][i]}"></i></span><span class="n">${r.txt}</span></div>`).join('')}</div>
    ${FRANK === 'cons' ? '<p class="note" style="margin-top:6px">Consumption score = MWh + water m³/100 + gas Sm³/100</p>' : ''}`;
}
function finOverviewAfter() {
  const open = fOpenAll(), s = fSummary();
  const paid = s.p.invoiced ? s.paid : 0, pend = open.filter(i => i.status !== 'OVERDUE').reduce((a, i) => a + i.due, 0), od = s.overdueAmt;
  mkChart('c-fcol', donutCfg(['Paid', 'Pending', 'Overdue'], [Math.round(paid / 1000), Math.round(pend / 1000), Math.round(od / 1000)], [C.green, C.amber, C.red], { legend: 'bottom' }));
  const sets = [['elec', 'Electricity'], ['water', 'Water'], ['cool', 'Cooling'], ['ww', 'Wastewater'], ['gas', 'Gas']].map(([k, n]) => ({ label: n, data: FMON.map((_, m) => Math.round(FIN_TENANTS.reduce((s2, t) => s2 + fMonthVal(t, k, m) * TF[FUTIL[k].tf], 0) * (m === 9 ? fToday() / 31 : 1) / 1000)), color: FUTIL[k].color }));
  const c = mkChart('c-ftrend', barCfg(FMON.map((m, i) => i === 9 ? 'Oct (MTD)' : m), sets, { stacked: true, thick: 22, yTitle: 'EGP k' }));
}

/* tenant bills */
function finTenants() {
  const s = fSummary(), p = s.p;
  let h = finKpis();
  const cols = [{ h: 'Tenant' }, { h: 'Factory' }, { h: 'Electricity', num: 1 }, { h: 'Water', num: 1 }, { h: 'Cooling', num: 1 }, { h: 'Wastewater', num: 1 }, { h: 'Gas', num: 1 }, { h: 'Other', num: 1 }, { h: 'Total bill', num: 1 }, { h: 'Status' }];
  const rows = s.bills.map(b => { const g = k => (b.lines.find(l => l.k === k) || { cons: 0 }).cons, f = D.fac(b.t);
    return { c: [`<b>${f.tenant}</b>`, f.name, `${fmt(g('elec'))} kWh`, `${fmt(g('water'))} m³`, g('cool') ? `${fmt(g('cool'))} RT-h` : '—', `${fmt(g('ww'))} m³`, g('gas') ? `${fmt(g('gas'))} Sm³` : '—', egp(b.oth + b.fee + b.fixed), `<b>${egp(b.total)}</b>`, fStatusPill(fTenantStatus(b.t))], go: () => tenantProfile(b.t) }; });
  h += card(`Tenant billing · ${p.label}`, 'doc', table(cols, rows) + `<p class="note" style="margin-top:8px">Totals include service fee ${TF.servicePct}%, fixed charge ${egp(TF.fixed)} per month and tax ${TF.taxPct}% (demo values, change them in Tariffs). Click a tenant for its financial profile.</p>`, 's8 r2 tone-purple', `${egp(s.total)} total`);
  h += card('Generate bill', 'doc', `<div class="fpick" role="group" aria-label="Tenant">${FIN_TENANTS.map(t => `<button type="button" class="${FT === t ? 'on' : ''}" data-act="${reg(() => { FT = t; renderBody(true); })}">${D.fac(t).name}</button>`).join('')}</div>
    ${(() => { const b = fBill(FT); return `<div class="fcard"><h4>${D.fac(FT).tenant}</h4><div class="tn">${D.fac(FT).name} · ${p.label}</div>${kv([['Utilities', egp(b.util)], ['Other services', egp(b.oth)], ['Service fee & fixed', egp(b.fee + b.fixed)], ['Tax', egp(b.tax)], ['Total due', `<b>${egp(b.total)}</b>`]])}</div>`; })()}
    <div class="actions" style="margin-top:10px">${hb('Generate bill', () => invoicePreview(FT), '')}${hb('Bill calculation', () => { FV = 'calc'; $('#pScope').innerHTML = PAGES.finance.scope(); renderBody(); })}</div>`, 's4 tone-cyan', 'Invoice preview');
  h += card('Open invoices (all periods)', 'clock', table(['Invoice', 'Tenant', 'Due', 'Balance', 'Status'], s.open.map(i => ({ c: [i.no, D.fac(i.t).name, i.dueDate, egpS(i.due), fStatusPill(i.status)], go: () => invoicePreview(i.t, i.m) }))), 's4 tone-orange', egpS(s.openAmt));
  return h;
}

/* calculation */
function finCalc() {
  const p = fPeriod(), b = fBill(FT), f = D.fac(FT);
  let h = `<div class="tiles" style="--n:6">${FIN_TENANTS.map(t => { const bb = fBill(t); return `<div class="tile ${t === FT ? 'info' : ''}" ${act(() => { FT = t; renderBody(true); })}><div class="l">${D.fac(t).name}</div><div class="v">${egpS(bb.total)}</div><div class="m">${D.fac(t).tenant}</div></div>`; }).join('')}</div>`;
  const chain = b.lines.map(l => { const mt = FMETERS.find(m => m.t === FT && m.k === l.k), rd = fMeterRead(mt, p), U = FUTIL[l.k];
    return `<div class="calc" style="--gc:${U.color}"><div class="cu">${ring(U.icon)}<div><b>${U.name}</b><small>${mt.id} · ${fMeterPill(mt.st)}</small></div></div>
      <div class="cs"><span>Previous reading</span><b>${fmt(rd.prev)}</b></div><span class="op">→</span><div class="cs"><span>Current reading</span><b>${fmt(rd.cur)}</b></div><span class="op">=</span>
      <div class="cs"><span>Consumption</span><b>${fmt(l.cons)} ${U.unit}</b></div><span class="op">×</span><div class="cs"><span>Tariff</span><b>${l.tariff} EGP/${U.unit}</b></div><span class="op">=</span><div class="cs res"><span>Cost</span><b>${egp(l.amount, 2)}</b></div></div>`; }).join('');
  h += card(`${f.name} · ${f.tenant} · consumption → bill`, 'list', `<div class="fill">${chain}
    <div class="calc" style="--gc:#ff7ad9"><div class="cu">${ring('gear')}<div><b>Other park services</b><small>Service charge + vehicle passes</small></div></div><div class="cs" style="grid-column:2 / -2"><span>${b.other.map(o => o.name).join(' + ')}</span></div><div class="cs res"><span>Amount</span><b>${egp(b.oth, 2)}</b></div></div>
    <div class="ctotal">
      <div><span>Total before fees & taxes</span><b>${egp(b.sub, 2)}</b></div><span class="op">+</span>
      <div><span>Service fee ${TF.servicePct}% + fixed charge</span><b>${egp(b.fee + b.fixed, 2)}</b></div><span class="op">+</span>
      <div><span>Tax ${TF.taxPct}%</span><b>${egp(b.tax, 2)}</b></div><span class="op">=</span>
      <div class="res"><span>TOTAL BILL · ${p.label}</span><b>${egp(b.total, 2)}</b></div></div></div>`, 's8 r2 tone-purple', p.range);
  h += card('Tariffs applied', 'key', `<div class="fill">${kv([['Electricity', `${TF.elec} EGP/kWh`], ['Water', `${TF.water} EGP/m³`], ['Wastewater', `${TF.ww} EGP/m³`], ['District cooling', `${TF.cool} EGP/RT-h`], ['Natural gas', `${TF.gas} EGP/Sm³`], ['Service fee', `${TF.servicePct}% of utilities`], ['Fixed charge', `${egp(TF.fixed)} / month`], ['Tax', `${TF.taxPct}%`]])}
    <p class="note" style="margin-top:8px">Demonstration values, not official tariffs.</p></div>`, 's4 tone-cyan', hb('Edit tariffs', () => { FV = 'tariffs'; $('#pScope').innerHTML = PAGES.finance.scope(); renderBody(); }));
  h += card('Previous period comparison', 'chart', canvas('c-fcmp'), 's4 tone-purple', hb('Generate bill', () => invoicePreview(FT), ''));
  return h;
}
const fPrevPeriod = () => { const p = fPeriod(); return { seg: p.seg.map(([m, f]) => [Math.max(0, m - p.seg.length), f]) }; };
function finCalcAfter() {
  const b = fBill(FT), pb = fBill(FT, fPrevPeriod());
  const keys = b.lines.map(l => l.k);
  mkChart('c-fcmp', barCfg(keys.map(k => FUTIL[k].name.replace('District ', '')), [{ label: 'Previous', data: keys.map(k => Math.round((pb.lines.find(l => l.k === k) || { amount: 0 }).amount / 1000)), color: '#8ea3dc' }, { label: 'This period', data: keys.map(k => Math.round(b.lines.find(l => l.k === k).amount / 1000)), color: C.purple }], { thick: 14, yTitle: 'EGP k' }));
}

/* meters */
function finMeters() {
  const p = fPeriod(), on = FMETERS.filter(m => m.st !== 'Offline').length;
  let h = tiles([
    { l: 'Utility meters', v: fmt(FMETERS.length), s: `${FIN_TENANTS.length} tenants` }, { l: 'Online', v: fmt(on), st: 'good', s: `${fmt(on / FMETERS.length * 100, 1)}%` },
    { l: 'Offline', v: fmt(FMETERS.length - on), st: 'crit', s: 'Bill estimated' }, { l: 'Reading anomalies', v: fmt(FMETERS.filter(m => m.st === 'Anomaly').length), st: 'warn', s: 'Check before billing' },
    { l: 'Last sync', v: D.clockAgo(40), s: 'Every 15 min · AMR' }, { l: 'Billing period', v: p.label.split(' · ')[0], s: p.range },
  ], 6);
  const rows = FMETERS.map(mt => { const rd = fMeterRead(mt, p), U = FUTIL[mt.k];
    return { c: [`<b>${mt.id}</b>`, D.fac(mt.t).name, U.name, fMeterPill(mt.st), fmt(rd.prev), fmt(rd.cur), `<b>${fmt(rd.cons)}</b>`, U.unit, mt.st === 'Offline' ? '05 Oct 22:10' : FP === 'cur' || FP === 'y' ? `${D.clockAgo(40)} today` : `${p.range.split('→ ')[1]} 23:45`, mt.comm === 'Lost' ? pill('crit', 'Lost') : mt.comm === 'OK' ? pill('ok', 'OK') : pill('warn', mt.comm)], go: () => tenantProfile(mt.t) }; });
  h += card('Meter management', 'gauge', table([{ h: 'Meter' }, { h: 'Tenant' }, { h: 'Utility' }, { h: 'Status' }, { h: 'Previous reading', num: 1 }, { h: 'Current reading', num: 1 }, { h: 'Consumption', num: 1 }, { h: 'Unit' }, { h: 'Read at' }, { h: 'Comms' }], rows), 's8 r2 tone-cyan', p.range);
  h += card('Meter attention', 'warn', `<div class="list fill">${FMETERS.filter(m => m.st !== 'Normal').map(m => `<div class="li" style="grid-template-columns:1fr auto" ${act(() => tenantProfile(m.t))}><div><b>${m.id}</b> · ${D.fac(m.t).name} · ${FUTIL[m.k].name}<small>${m.note}</small></div>${fMeterPill(m.st)}</div>`).join('')}</div>`, 's4 tone-orange');
  h += card('Legend', 'list', `<div class="list">${[['🔴 Meter offline', 'No data received; consumption estimated from history', 'crit', 'OFFLINE'], ['🟠 Reading anomaly', 'Unusual consumption or night flow; verify before invoicing', 'warn', 'ANOMALY'], ['🟢 Meter normal', 'Readings received and within expected range', 'ok', 'NORMAL']].map(([a, b, s2, t]) => `<div class="li" style="grid-template-columns:1fr auto"><div>${a}<small>${b}</small></div>${pill(s2, t)}</div>`).join('')}</div>`, 's4 tone-cyan');
  return h;
}

/* analytics */
function finAnalytics() {
  const s = fSummary(), top = [...s.bills].sort((a, b) => b.total - a.total)[0], big = [...s.bills].sort((a, b) => b.lines[0].cons - a.lines[0].cons)[0];
  let h = tiles([
    { l: 'Avg cost per kWh (all-in)', v: `${fmt(s.total / s.cons('elec'), 2)}<small>EGP</small>`, s: `Tariff ${TF.elec}` }, { l: 'Water + wastewater per m³', v: `${fmt((s.water + s.ww) / s.cons('water'), 1)}<small>EGP</small>` },
    { l: 'Highest bill', v: D.fac(top.t).name, s: egpS(top.total) }, { l: 'Highest energy user', v: D.fac(big.t).name, s: `${fmt(big.lines[0].cons / 1000, 0)} MWh` },
    { l: 'Revenue per tenant', v: egpS(s.total / FIN_TENANTS.length) }, { l: 'Most expensive utility', v: 'Electricity', s: `${fmt(s.elec / (s.total - s.tax) * 100, 0)}% of bills` },
  ], 6);
  [['c-fa1', 'Energy consumption by factory', 's3'], ['c-fa2', 'Water consumption by factory', 's3'], ['c-fa3', 'Utility cost by factory', 's3'], ['c-fa4', 'Monthly billing trend', 's3'],
   ['c-fa5', 'Paid vs unpaid', 's3'], ['c-fa6', 'Energy & water cost vs previous month', 's3'], ['c-fa7', 'Top tenants · cost vs consumption', 's3'], ['c-fa8', 'Park total utility consumption', 's3']]
    .forEach(([id, t, sz]) => { h += card(t, 'chart', canvas(id), `${sz} tone-purple`); });
  return h;
}
function finAnalyticsAfter() {
  const s = fSummary(), lab = FIN_TENANTS.map(t => D.fac(t).name.replace('Factory ', 'F-')), g = (b, k) => (b.lines.find(l => l.k === k) || { cons: 0, amount: 0 });
  mkChart('c-fa1', barCfg(lab, [{ label: 'MWh', data: s.bills.map(b => Math.round(g(b, 'elec').cons / 1000)), color: C.cyan }], { thick: 18 }));
  mkChart('c-fa2', barCfg(lab, [{ label: 'm³', data: s.bills.map(b => Math.round(g(b, 'water').cons)), colors: s.bills.map(b => hexA(['D', 'F'].includes(b.t) ? C.amber : C.blue, .85)) }], { thick: 18 }));
  mkChart('c-fa3', barCfg(lab, FU_KEYS.map(k => ({ label: FUTIL[k].name.replace('District ', ''), data: s.bills.map(b => Math.round(g(b, k).amount / 1000)), color: FUTIL[k].color })), { stacked: true, thick: 20, yTitle: 'EGP k' }));
  mkChart('c-fa4', lineCfg(FMON.map((m, i) => i === 9 ? 'Oct*' : m), [{ label: 'Billing EGP M', data: FMON.map((_, m) => +(FIN_TENANTS.reduce((a, t) => a + fMonthBill(t, m).total, 0) * (m === 9 ? fToday() / 31 : 1) / 1e6).toFixed(2)), color: C.purple, fill: true, points: true }], { zero: true, xt: 10 }));
  const open = fOpenAll(), paidAll = FMON.slice(0, 9).flatMap((_, m) => FIN_TENANTS.map(t => fInvoice(t, m))).reduce((a, i) => a + i.paid, 0);
  mkChart('c-fa5', donutCfg(['Paid', 'Unpaid / partial', 'Overdue'], [Math.round(paidAll / 1e6 * 10) / 10, Math.round(open.filter(i => i.status !== 'OVERDUE').reduce((a, i) => a + i.due, 0) / 1e6 * 10) / 10, Math.round(open.filter(i => i.status === 'OVERDUE').reduce((a, i) => a + i.due, 0) / 1e6 * 10) / 10], [C.green, C.amber, C.red], { legend: 'bottom' }));
  const pb = FIN_TENANTS.map(t => fBill(t, fPrevPeriod()));
  mkChart('c-fa6', barCfg(lab, [{ label: 'Energy prev', data: pb.map(b => Math.round(g(b, 'elec').amount / 1000)), color: '#5d6fa8' }, { label: 'Energy now', data: s.bills.map(b => Math.round(g(b, 'elec').amount / 1000)), color: C.cyan }, { label: 'Water prev', data: pb.map(b => Math.round(g(b, 'water').amount / 1000)), color: '#8ea3dc' }, { label: 'Water now', data: s.bills.map(b => Math.round(g(b, 'water').amount / 1000)), color: C.blue }], { thick: 8, yTitle: 'EGP k' }));
  const srt = [...s.bills].sort((a, b) => b.total - a.total);
  const c7 = mkChart('c-fa7', barCfg(srt.map(b => D.fac(b.t).name.replace('Factory ', 'F-')), [{ label: 'Bill EGP M', data: srt.map(b => +(b.total / 1e6).toFixed(2)), color: C.purple }, { label: 'Energy GWh', data: srt.map(b => +(g(b, 'elec').cons / 1e6).toFixed(2)), color: C.cyan }], { thick: 14 }));
  mkChart('c-fa8', barCfg(FMON.map((m, i) => i === 9 ? 'Oct*' : m), [{ label: 'Electricity MWh', data: FMON.map((_, m) => Math.round(FIN_TENANTS.reduce((a, t) => a + fMonthVal(t, 'elec', m), 0) * (m === 9 ? fToday() / 31 : 1) / 1000)), color: C.cyan }, { type: 'line', label: 'Water ×10 m³', data: FMON.map((_, m) => Math.round(FIN_TENANTS.reduce((a, t) => a + fMonthVal(t, 'water', m), 0) * (m === 9 ? fToday() / 31 : 1) / 10)), color: C.amber }], { thick: 16 }));
}

/* tariffs (admin) */
const TF_FIELDS = [['elec', 'Electricity', 'EGP / kWh', .01], ['water', 'Water', 'EGP / m³', .1], ['ww', 'Wastewater', 'EGP / m³', .1], ['cool', 'District cooling', 'EGP / RT-h', .1], ['gas', 'Natural gas', 'EGP / Sm³', .01],
  ['servicePct', 'Service fee', '% of utilities', .1], ['fixed', 'Fixed charge', 'EGP / tenant / month', 100], ['taxPct', 'Tax', '%', .5], ['vehPass', 'Vehicle access pass', 'EGP / vehicle / month', 5], ['terms', 'Payment terms', 'days', 1]];
function finTariffs() {
  let h = `<div class="tbanner"><span>🔒</span><div><b>Tariff management · administrator</b><small>Signed in as Park Admin. These are DEMONSTRATION values, not official Egyptian tariffs. Changes apply to every bill, the Utilities page and the reports, and are saved in this browser.</small></div></div>`;
  h += card('Utility tariffs & charges', 'key', `<form id="tfForm" class="tform fill" autocomplete="off">${TF_FIELDS.map(([k, n, unit, st]) => `<label for="tf-${k}"><span>${n}</span><input class="fld" type="number" min="0" step="${st}" id="tf-${k}" name="${k}" value="${TF[k]}"><em>${unit}</em><small>Demo default ${TF_DEFAULT[k]}</small></label>`).join('')}</form>
    <div class="actions" style="margin-top:10px"><button class="btn" type="button" id="tfSave">Save tariffs</button><button class="btn ghost" type="button" id="tfReset">Reset to demo defaults</button><span class="note" id="tfMsg"></span></div>`, 's8 r2 tone-purple');
  h += card('Impact preview · Factory A', 'chart', `<div class="fill" id="tfPrev"></div>`, 's4 r2 tone-cyan', 'Updates as you type');
  return h;
}
function finTariffsAfter() {
  const read = () => { const o = {}; TF_FIELDS.forEach(([k]) => { const v = parseFloat($('#tf-' + k).value); o[k] = isNaN(v) || v < 0 ? TF[k] : v; }); return o; };
  const preview = () => { const old = Object.assign({}, TF), nw = read(); const b0 = fBill('A'); Object.assign(TF, nw); const b1 = fBill('A'), park = FIN_TENANTS.reduce((s, t) => s + fBill(t).total, 0); Object.assign(TF, old); const park0 = FIN_TENANTS.reduce((s, t) => s + fBill(t).total, 0);
    $('#tfPrev').innerHTML = kv([['Electricity', egp(b1.lines[0].amount)], ['Water', egp(b1.lines.find(l => l.k === 'water').amount)], ['Total bill now', egp(b0.total)], ['Total with new tariffs', `<b>${egp(b1.total)}</b>`], ['Change', `${dpct((b1.total / b0.total - 1) * 100)}`], ['Park revenue change', `${dpct((park / park0 - 1) * 100)} · ${egpS(park)}`]]) + `<p class="note" style="margin-top:8px">${fPeriod().label}</p>`; };
  $('#tfForm').addEventListener('input', preview); preview();
  $('#tfSave').addEventListener('click', () => { Object.assign(TF, read()); try { localStorage.setItem('gic-tariffs', JSON.stringify(TF)); } catch { } toast('Tariffs saved · all bills recalculated'); renderBody(true); });
  $('#tfReset').addEventListener('click', () => { Object.assign(TF, TF_DEFAULT); try { localStorage.removeItem('gic-tariffs'); } catch { } toast('Demo tariffs restored'); renderBody(true); });
}

/* report */
function finReport() {
  const s = fSummary(), p = s.p;
  let h = tiles([
    { l: 'Total consumption', v: `${fmt(s.cons('elec') / 1000, 0)}<small>MWh</small>`, s: `${fmt(s.cons('water'))} m³ water · ${fmt(s.cons('gas'))} Sm³ gas` },
    { l: 'Total revenue', v: egpS(s.billed), st: 'info' }, { l: 'Total paid', v: p.invoiced ? egpS(s.paid) : '—', st: 'good' },
    { l: 'Total outstanding', v: p.invoiced ? egpS(s.unpaid) : '—', st: 'warn' }, { l: 'Total overdue', v: egpS(s.overdueAmt), st: s.overdueAmt ? 'crit' : 'good', s: 'All periods' },
    { l: 'Collection rate', v: s.rate == null ? '—' : pct(s.rate), s: p.label },
  ], 6);
  h += card(`By utility · ${p.label}`, 'grid', table([{ h: 'Utility' }, { h: 'Consumption', num: 1 }, { h: 'Tariff', num: 1 }, { h: 'Amount', num: 1 }], [...FU_KEYS.map(k => ({ c: [FUTIL[k].name, `${fmt(s.cons(k))} ${FUTIL[k].unit}`, `${TF[FUTIL[k].tf]} EGP/${FUTIL[k].unit}`, egp(s[k])] })), { c: ['Other services, fees & tax', '—', '—', egp(s.other + s.tax)] }, { c: ['<b>Total</b>', '', '', `<b>${egp(s.total)}</b>`] }]), 's5 tone-purple');
  h += card('Revenue split', 'chart', canvas('c-frs'), 's3 tone-purple');
  h += card('Export monthly financial report', 'download', `<div class="fill" style="display:flex;flex-direction:column;gap:8px;justify-content:center">
    <button class="btn big" type="button" data-act="${reg(finExportPDF)}">${icon('download')} Export PDF</button>${hb('Export Excel', finExportXLSX, '')}${hb('Export CSV', finExportCSV, '')}
    <span class="note">${p.label} · ${p.range}</span></div>`, 's4 tone-cyan');
  h += card(`By tenant · ${p.label}`, 'doc', table([{ h: 'Factory' }, { h: 'Tenant' }, { h: 'Electricity', num: 1 }, { h: 'Water', num: 1 }, { h: 'Bill', num: 1 }, { h: 'Paid', num: 1 }, { h: 'Status' }],
    s.bills.map(b => { const inv = s.inv.filter(i => i.t === b.t); return { c: [D.fac(b.t).name, D.fac(b.t).tenant, `${fmt(b.lines[0].cons)} kWh`, `${fmt(b.lines.find(l => l.k === 'water').cons)} m³`, `<b>${egp(b.total)}</b>`, p.invoiced ? egp(inv.reduce((a, i) => a + i.paid, 0)) : '—', fStatusPill(fTenantStatus(b.t))], go: () => tenantProfile(b.t) }; })), 's12 tone-purple');
  return h;
}
function finReportAfter() { const s = fSummary(); mkChart('c-frs', donutCfg(['Electricity', 'Water', 'Cooling', 'Wastewater', 'Gas', 'Other & tax'], [s.elec, s.water, s.cool, s.ww, s.gas, s.other + s.tax].map(v => Math.round(v / 1000)), [FUTIL.elec.color, FUTIL.water.color, FUTIL.cool.color, FUTIL.ww.color, FUTIL.gas.color, '#ff7ad9'], { legend: 'bottom' })); }

/* ---------------- tenant financial profile (drawer) ---------------- */
function tenantProfile(t) {
  const f = D.fac(t), p = fPeriod(), b = fBill(t), pb = fBill(t, fPrevPeriod()), inv = FMON.slice(0, 9).map((_, m) => fInvoice(t, m)).reverse();
  const open = inv.filter(i => i.due > 1), out = open.reduce((a, i) => a + i.due, 0), g = (bb, k) => (bb.lines.find(l => l.k === k) || { cons: 0, amount: 0 });
  const pays = inv.filter(i => i.paid > 0).map(i => [i.m === 8 ? '03 Oct 2026' : `${String(8 + (i.m % 5)).padStart(2, '0')} ${FMON[(i.m + 1) % 12]} 2026`, egp(i.paid), i.t === 'C' ? 'Cheque' : 'Bank transfer', `PAY-${String(i.m + 1).padStart(2, '0')}${t}-${4100 + i.m * 7}`]);
  drawer(dHead('costdown', `${f.tenant}`, `${f.name} · ${f.sector} · tenant financial profile`) +
    `<div class="tiles" style="--n:3">${tile({ l: `Current bill · ${p.label.split(' · ')[0]}`, v: egpS(b.total), st: 'info' })}${tile({ l: 'Outstanding balance', v: egpS(out), st: out ? 'warn' : 'good', s: `${open.length} open invoice${open.length === 1 ? '' : 's'}` })}${tile({ l: 'Payment status', v: fTenantStatus(t).replace('PARTIALLY PAID', 'PARTIAL'), st: { PAID: 'good', OVERDUE: 'crit', RUNNING: '' }[fTenantStatus(t)] || 'warn' })}</div>` +
    `<div class="tiles" style="--n:3">${tile({ l: 'Electricity', v: u(g(b, 'elec').cons, 'kWh'), s: `${dpct((g(b, 'elec').cons / (g(pb, 'elec').cons || 1) - 1) * 100)} vs previous` })}${tile({ l: 'Water', v: u(g(b, 'water').cons, 'm³'), s: `${dpct((g(b, 'water').cons / (g(pb, 'water').cons || 1) - 1) * 100)} vs previous` })}${tile({ l: 'Cooling', v: g(b, 'cool').cons ? u(g(b, 'cool').cons, 'RT-h') : '—', s: g(b, 'cool').cons ? `${dpct((g(b, 'cool').cons / (g(pb, 'cool').cons || 1) - 1) * 100)} vs previous` : 'Not connected' })}</div>` +
    box('Previous period comparison', canvas('dch-fp', 170)) +
    box('Bills', table(['Invoice', 'Month', 'Total', 'Paid', 'Status'], inv.map(i => ({ c: [i.no, FMON_LONG[i.m], egp(i.total), egp(i.paid), fStatusPill(i.status)], go: () => invoicePreview(t, i.m) })), { mh: 230 })) +
    box('Payment history', pays.length ? table(['Date', 'Amount', 'Method', 'Reference'], pays.map(c => ({ c })), { mh: 200 }) : '<p class="note">No payments yet.</p>') +
    box('Tariffs applied', kv(b.lines.map(l => [FUTIL[l.k].name, `${l.tariff} EGP/${FUTIL[l.k].unit}`]).concat([['Service fee', `${TF.servicePct}%`], ['Tax', `${TF.taxPct}%`]]))) +
    `<div class="actions">${hb('Generate bill', () => invoicePreview(t), '')}${hb('Bill calculation', () => { FT = t; FV = 'calc'; openPage('finance'); })}${hb('Utilities view', () => openPage('utilities', { scope: t }))}</div>`, 'purple');
  const keys = b.lines.map(l => l.k);
  mkChart('dch-fp', barCfg(keys.map(k => FUTIL[k].name.replace('District ', '')), [{ label: 'Previous', data: keys.map(k => Math.round(g(pb, k).amount / 1000)), color: '#8ea3dc' }, { label: 'This period', data: keys.map(k => Math.round(g(b, k).amount / 1000)), color: C.purple }], { thick: 14, yTitle: 'EGP k' }), true);
}

/* ---------------- invoice ---------------- */
function invoiceData(t, m) {
  const p = m == null ? fPeriod() : { label: FMON_LONG[m] + ' 2026', range: `01 ${FMON[m]} → ${FDAYS[m]} ${FMON[m]} 2026`, seg: [[m, 1]], invoiced: true };
  const b = fBill(t, p), f = D.fac(t), mi = m == null ? (p.seg.length === 1 ? p.seg[0][0] : 8) : m;
  const inv = p.invoiced && p.seg.length === 1 && mi <= 8 ? fInvoice(t, mi) : null;
  const no = inv ? inv.no : `INV-2026-${String(mi + 1).padStart(2, '0')}-${t}${String(101 + FIN_TENANTS.indexOf(t))}-D`;
  return { t, f, p, b, no, issue: inv ? inv.issue : D.dmy(D.today()), due: inv ? inv.dueDate : D.dmy(D.addDays(D.today(), TF.terms)), status: inv ? inv.status : p.invoiced ? 'UNPAID' : 'RUNNING', paid: inv ? inv.paid : 0 };
}
function invoiceHTML(I, forPrint) {
  const rows = I.b.lines.map(l => `<tr><td>${FUTIL[l.k].name}</td><td class="r">${fmt(l.cons)} ${FUTIL[l.k].unit}</td><td class="r">${l.tariff} EGP/${FUTIL[l.k].unit}</td><td class="r">${fmt(l.amount, 2)}</td></tr>`).join('') +
    I.b.other.map(o => `<tr><td>${o.name}</td><td class="r">—</td><td class="r">—</td><td class="r">${fmt(o.amount, 2)}</td></tr>`).join('');
  return `<div class="inv${forPrint ? ' print' : ''}"><div class="ih"><div><b>SMART GATED INDUSTRIAL COMMUNITY</b><span>Park Management Company · Utility Billing</span></div><div class="ino"><b>${I.no}</b><span>Utility invoice</span></div></div>
    <div class="ig"><div><span>Tenant / company</span><b>${I.f.tenant}</b></div><div><span>Factory</span><b>${I.f.name}</b></div><div><span>Billing period</span><b>${I.p.label}</b><small>${I.p.range}</small></div>
    <div><span>Issue date</span><b>${I.issue}</b></div><div><span>Due date</span><b>${I.due}</b></div><div><span>Payment status</span><b>${I.status}</b></div></div>
    <table><thead><tr><th>Utility breakdown</th><th class="r">Consumption</th><th class="r">Unit price</th><th class="r">Amount (EGP)</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="it">${[['Subtotal', I.b.sub], [`Service fee ${TF.servicePct}% + fixed charge`, I.b.fee + I.b.fixed], [`Taxes ${TF.taxPct}%`, I.b.tax]].map(([a, v]) => `<div><span>${a}</span><b>${fmt(v, 2)}</b></div>`).join('')}<div class="due"><span>TOTAL DUE</span><b>EGP ${fmt(I.b.total, 2)}</b></div>${I.paid ? `<div><span>Paid</span><b>${fmt(I.paid, 2)}</b></div><div><span>Balance</span><b>${fmt(I.b.total - I.paid, 2)}</b></div>` : ''}</div>
    <p class="ifoot">Tariffs are demonstration values. Pay by bank transfer quoting ${I.no}. Generated by the Smart Gated Industrial Community platform.</p></div>`;
}
function invoicePreview(t, m) {
  const I = invoiceData(t, m);
  drawer(dHead('doc', `Invoice ${I.no}`, `${I.f.tenant} · ${I.p.label}`) + invoiceHTML(I) +
    `<div class="actions">${hb('Generate bill', () => toast(`Bill ${I.no} generated · ${egp(I.b.total)}`), '')}${hb('Export PDF', () => invoicePDF(I), '')}${hb('Export Excel', () => invoiceXLSX(I))}${hb('Print', () => invoicePrint(I))}${hb('Send to tenant', () => toast(`${I.no} queued to billing@${I.f.tenant.toLowerCase().replace(/[^a-z]+/g, '')}.eg (demo)`))}</div>`, 'purple');
  drawerEl.classList.add('wide');
}

/* ---------------- downloads ---------------- */
async function saveFile(name, data, mime) {
  let dl = null; try { dl = await window.claude?.use?.('downloads'); } catch { dl = null; }
  if (dl) { try { await dl.save({ filename: name, data }); toast(`${name} is ready`); } catch (e) { toast(e && e.code === 'declined' ? 'Download cancelled' : 'Download failed. Try again.'); } return; }
  const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type: mime })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast(`${name} downloaded`);
}
const lazyXLSX = () => loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
const lazyPDF = async () => { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'); };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
async function invoicePDF(I) {
  toast('Preparing invoice PDF…'); try { await lazyPDF(); } catch { toast('The PDF library could not load.'); return; }
  const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210;
  doc.setFillColor(10, 26, 82); doc.rect(0, 0, W, 30, 'F'); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text('SMART GATED INDUSTRIAL COMMUNITY', 12, 13);
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(150, 225, 255); doc.text('Park Management Company - Utility Billing', 12, 20); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text(I.no, W - 12, 13, { align: 'right' }); doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.text('Utility invoice', W - 12, 20, { align: 'right' });
  doc.setTextColor(20, 30, 70); doc.setFontSize(9.5);
  [['Tenant / company', I.f.tenant], ['Factory', I.f.name], ['Billing period', `${ascii(I.p.label)} (${ascii(I.p.range)})`], ['Issue date', I.issue], ['Due date', I.due], ['Payment status', I.status]].forEach(([a, b], i) => { const x = 12 + (i % 2) * 96, y = 40 + Math.floor(i / 2) * 9; doc.setFont('helvetica', 'normal'); doc.setTextColor(90, 100, 140); doc.text(a, x, y); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 25, 70); doc.text(String(b), x, y + 4.5); });
  doc.autoTable({ startY: 70, head: [['Utility', 'Consumption', 'Unit price', 'Amount (EGP)']], body: [...I.b.lines.map(l => [FUTIL[l.k].name, `${fmt(l.cons)} ${ascii(FUTIL[l.k].unit)}`, `${l.tariff} EGP/${ascii(FUTIL[l.k].unit)}`, fmt(l.amount, 2)]), ...I.b.other.map(o => [ascii(o.name), '-', '-', fmt(o.amount, 2)])],
    theme: 'grid', styles: { fontSize: 9, cellPadding: 2 }, headStyles: { fillColor: [10, 26, 82] }, columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } }, margin: { left: 12, right: 12 } });
  let y = doc.lastAutoTable.finalY + 6;
  [['Subtotal', I.b.sub], [`Service fee ${TF.servicePct}% + fixed charge`, I.b.fee + I.b.fixed], [`Taxes ${TF.taxPct}%`, I.b.tax]].forEach(([a, v]) => { doc.setFont('helvetica', 'normal'); doc.text(a, 120, y); doc.text(fmt(v, 2), W - 12, y, { align: 'right' }); y += 6; });
  doc.setFillColor(85, 48, 214); doc.roundedRect(116, y - 3, W - 128, 11, 2, 2, 'F'); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('TOTAL DUE', 120, y + 4.3); doc.text(`EGP ${fmt(I.b.total, 2)}`, W - 14, y + 4.3, { align: 'right' });
  doc.setTextColor(90, 100, 140); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text(`Tariffs are demonstration values. Pay by bank transfer quoting ${I.no}.`, 12, 285);
  saveFile(`${I.no}.pdf`, doc.output('arraybuffer'), 'application/pdf');
}
async function invoiceXLSX(I) {
  try { await lazyXLSX(); } catch { toast('The Excel library could not load.'); return; }
  const wb = XLSX.utils.book_new(), rows = [['SMART GATED INDUSTRIAL COMMUNITY · Utility invoice'], ['Invoice', I.no], ['Tenant', I.f.tenant], ['Factory', I.f.name], ['Period', `${I.p.label} (${I.p.range})`], ['Issue date', I.issue], ['Due date', I.due], ['Status', I.status], [],
    ['Utility', 'Consumption', 'Unit', 'Unit price EGP', 'Amount EGP'], ...I.b.lines.map(l => [FUTIL[l.k].name, Math.round(l.cons), FUTIL[l.k].unit, l.tariff, +l.amount.toFixed(2)]), ...I.b.other.map(o => [o.name, '', '', '', +o.amount.toFixed(2)]), [],
    ['Subtotal', '', '', '', +I.b.sub.toFixed(2)], ['Service fee + fixed charge', '', '', '', +(I.b.fee + I.b.fixed).toFixed(2)], [`Tax ${TF.taxPct}%`, '', '', '', +I.b.tax.toFixed(2)], ['TOTAL DUE', '', '', '', +I.b.total.toFixed(2)]];
  const ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = [{ wch: 52 }, { wch: 14 }, { wch: 8 }, { wch: 14 }, { wch: 16 }]; XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
  saveFile(`${I.no}.xlsx`, new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' })), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
function invoicePrint(I) {
  const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n').match(/\/\* invoice \*\/[\s\S]*?\/\* end invoice \*\//);
  const fr = document.createElement('iframe'); fr.style.cssText = 'position:fixed;width:0;height:0;border:0;right:0;bottom:0'; document.body.appendChild(fr);
  fr.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><title>${I.no}</title><style>body{font-family:Barlow,Segoe UI,Arial,sans-serif;margin:18mm;color:#13204a}${css ? css[0] : ''}</style></head><body>${invoiceHTML(I, true)}</body></html>`;
  fr.onload = () => { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch { toast('Printing is not available here.'); } setTimeout(() => fr.remove(), 60000); };
}
function finRows() {
  const s = fSummary(), p = s.p;
  return { s, p, util: [['Utility', 'Consumption', 'Unit', 'Tariff EGP', 'Amount EGP'], ...FU_KEYS.map(k => [FUTIL[k].name, Math.round(s.cons(k)), FUTIL[k].unit, TF[FUTIL[k].tf], Math.round(s[k])]), ['Other services, fees & tax', '', '', '', Math.round(s.other + s.tax)], ['Total', '', '', '', Math.round(s.total)]],
    ten: [['Factory', 'Tenant', 'Electricity kWh', 'Water m3', 'Cooling RT-h', 'Gas Sm3', 'Bill EGP', 'Paid EGP', 'Status'], ...s.bills.map(b => { const g = k => Math.round((b.lines.find(l => l.k === k) || { cons: 0 }).cons), inv = s.inv.filter(i => i.t === b.t);
      return [D.fac(b.t).name, D.fac(b.t).tenant, g('elec'), g('water'), g('cool'), g('gas'), Math.round(b.total), Math.round(inv.reduce((a, i) => a + i.paid, 0)), fTenantStatus(b.t)]; })],
    sum: [['Period', `${p.label} (${p.range})`], ['Total revenue EGP', Math.round(s.billed)], ['Total paid EGP', Math.round(s.paid)], ['Total outstanding EGP', Math.round(s.unpaid)], ['Total overdue EGP (all periods)', Math.round(s.overdueAmt)], ['Collection rate %', s.rate == null ? '' : +s.rate.toFixed(1)], ['Electricity kWh', Math.round(s.cons('elec'))], ['Water m3', Math.round(s.cons('water'))]] };
}
function finExportCSV() { const R = finRows(), q = x => { const v = String(x ?? ''); return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
  const lines = [['Smart Gated Industrial Community · financial report'], ...R.sum, [], ...R.util, [], ...R.ten]; saveFile(`financial-report-${slug(R.p.label)}.csv`, '﻿' + lines.map(l => l.map(q).join(',')).join('\r\n'), 'text/csv'); }
async function finExportXLSX() { try { await lazyXLSX(); } catch { toast('The Excel library could not load.'); return; } const R = finRows(), wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Smart Gated Industrial Community · financial report'], ...R.sum]), 'Summary'); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(R.util), 'By utility'); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(R.ten), 'By tenant');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Invoice', 'Tenant', 'Month', 'Total EGP', 'Paid EGP', 'Balance EGP', 'Status'], ...FMON.slice(0, 9).flatMap((_, m) => FIN_TENANTS.map(t => fInvoice(t, m))).map(i => [i.no, D.fac(i.t).name, FMON_LONG[i.m], Math.round(i.total), Math.round(i.paid), Math.round(i.due), i.status])]), 'Invoices');
  saveFile(`financial-report-${slug(R.p.label)}.xlsx`, new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' })), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
async function finExportPDF() { toast('Preparing the financial report…'); try { await lazyPDF(); } catch { toast('The PDF library could not load.'); return; }
  const R = finRows(), doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' }), W = 297;
  doc.setFillColor(10, 26, 82); doc.rect(0, 0, W, 24, 'F'); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text('Smart Gated Industrial Community - Monthly Financial Report', 10, 11);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(150, 225, 255); doc.text(ascii(`${R.p.label}  |  ${R.p.range}  |  Demo tariffs  |  Generated ${D.dmy(D.today())}`), 10, 18.5);
  doc.autoTable({ startY: 30, head: [['Total park billing', 'Value']], body: R.sum.map(r => [ascii(r[0]), typeof r[1] === 'number' ? r[1].toLocaleString('en-US') : ascii(r[1])]), theme: 'grid', styles: { fontSize: 8.5, cellPadding: 1.6 }, headStyles: { fillColor: [85, 48, 214] }, margin: { left: 10 }, tableWidth: 88 });
  doc.autoTable({ startY: 30, head: [R.util[0].map(ascii)], body: R.util.slice(1).map(r => r.map(x => typeof x === 'number' ? x.toLocaleString('en-US') : ascii(x))), theme: 'grid', styles: { fontSize: 8.5, cellPadding: 1.6 }, headStyles: { fillColor: [10, 26, 82] }, margin: { left: 104 }, tableWidth: 183 });
  doc.autoTable({ startY: Math.max(doc.lastAutoTable.finalY, 100) + 6, head: [R.ten[0].map(ascii)], body: R.ten.slice(1).map(r => r.map(x => typeof x === 'number' ? x.toLocaleString('en-US') : ascii(x))), theme: 'striped', styles: { fontSize: 8.5, cellPadding: 1.6 }, headStyles: { fillColor: [10, 26, 82] }, margin: { left: 10, right: 10 } });
  saveFile(`financial-report-${slug(R.p.label)}.pdf`, doc.output('arraybuffer'), 'application/pdf'); }
const fFactorySummary = t => { const p = fPeriod(), b = fBill(t), g = k => (b.lines.find(l => l.k === k) || { cons: 0 }).cons, open = FMON.slice(0, 9).map((_, m) => fInvoice(t, m)).filter(i => i.due > 1), out = open.reduce((a, i) => a + i.due, 0);
  return box(`Financial summary · ${p.label}`, kv([['Energy', `${fmt(g('elec'))} kWh`], ['Water', `${fmt(g('water'))} m³`], ['Cooling', g('cool') ? `${fmt(g('cool'))} RT-h` : '—'], ['Current bill', `<b>${egp(b.total)}</b>`], ['Outstanding', egp(out)], ['Payment status', fStatusPill(fTenantStatus(t))]]) +
    `<div class="actions" style="margin-top:8px">${hb('View financial details', () => tenantProfile(t), '')}${hb('Generate bill', () => invoicePreview(t))}</div>`); };


/* ======================================================================
   TICK & BOOT
   ====================================================================== */
const j = (v, amt, lo, hi) => Math.min(hi, Math.max(lo, v + (Math.random() * 2 - 1) * amt));
function tick() {
  S.employees = Math.round(j(S.employees, 6, 2280, 2360)); S.visitorsOn = Math.round(j(S.visitorsOn, 3, 95, 140));
  S.sysOnline = j(S.sysOnline, .08, 98.3, 99.1);
  S.load = j(S.load, .06, 6.6, 7.2); S.water = Math.round(j(S.water, 6, 385, 440)); S.solar = Math.max(0, j(S.solar, .04, 1.95, 2.3));
  S.waterToday += Math.round(S.water * 2.5 / 3600);
  S.active = Math.round(j(S.active, 2, 105, 130)); S.wait = j(S.wait, .25, 4.8, 8.2); S.yard = Math.round(j(S.yard, .6, 68, 77));
  S.parking = Math.round(j(S.parking, .6, 76, 86)); S.resp = j(S.resp, .05, 3.9, 4.6);
  S.oee = j(S.oee, .15, 80.2, 82.6); S.prod = j(S.prod, .2, 92.5, 95.8);
  S.m7t = Math.round(j(S.m7t, .6, 40, 45)); S.m7v = j(S.m7v, .12, 2.4, 3.2); S.m7a = Math.round(j(S.m7a, 2, 112, 124));
  S.c12v = j(S.c12v, .15, 6.9, 7.9); S.turnIn += Math.round(Math.random() * 3);
  if (!cur) { if (Math.random() < .5) D.pushEvent(); renderOverview(); }
  else { PAGES[cur].tick?.(); refreshLive(); }
}
function clock() {
  const t = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
  $('#clock').textContent = `LIVE · ${t} · Cairo`; $('#pClock').textContent = `${t} · Cairo`;
}
/* Fill the whole window: scale each axis to the window, allowing up to 15% stretch before falling back to bands. */
function fit() {
  const W = innerWidth, H = innerHeight;
  let sx = W / 1600, sy = H / 900;
  const k = sx / sy, lim = 1.15;
  if (k > lim) sx = sy * lim; else if (k < 1 / lim) sy = sx * lim;
  stageEl.style.transform = `translate(${(W - 1600 * sx) / 2}px,${(H - 900 * sy) / 2}px) scale(${sx},${sy})`;
}
addEventListener('resize', fit); fit();
const fsBtn = $('#fsBtn');
const fsSync = () => { const on = !!document.fullscreenElement; fsBtn.setAttribute('aria-pressed', on); fsBtn.title = on ? 'Exit full screen' : 'Full screen'; fsBtn.innerHTML = icon(on ? 'fsExit' : 'fsEnter'); };
fsBtn.addEventListener('click', async () => {
  try { document.fullscreenElement ? await document.exitFullscreen() : await document.documentElement.requestFullscreen(); }
  catch { toast('Full screen is not available here. Open the page in its own browser tab and press F11.'); }
});
document.addEventListener('fullscreenchange', () => { fsSync(); fit(); });
fsSync();
const thBtn = $('#themeBtn');
const thSync = () => { const l = isLight(); thBtn.innerHTML = icon(l ? 'moon' : 'sun'); thBtn.title = l ? 'Switch to dark mode' : 'Switch to light mode'; thBtn.setAttribute('aria-label', thBtn.title); };
thBtn.addEventListener('click', () => {
  const t = isLight() ? 'dark' : 'light';
  document.documentElement.dataset.theme = t; try { localStorage.setItem(THEME_KEY, t); } catch { }
  if (window.Chart) { Chart.defaults.color = isLight() ? '#45517c' : '#c3d1f7'; Chart.defaults.borderColor = isLight() ? 'rgba(19,32,74,.10)' : 'rgba(255,255,255,.08)'; }
  closeDrawer(); if (cur) renderBody(true);
  thSync();
});
thSync();
renderOverview();
SECTIONS.forEach(s => cropTo(s.el.querySelector('.strip'), s.crop));
clock(); setInterval(clock, 1000); setInterval(tick, 2500);
const h0 = location.hash.slice(1); if (h0 === 'reports-fin') { RV = 'fin'; openPage('reports'); } else if (PAGES[h0]) openPage(h0);
})();
