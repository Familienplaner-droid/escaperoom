// Escape-Bücher – Spiel-Engine
// Kümmert sich um Raum, Klickflächen, Inventar, Kombinieren, Schlösser,
// Hinweise, Töne und Spielstand. Inhalte kommen komplett aus den Büchern.
import { sfx, tone, sound } from './audio.js';
import { rewardedAd } from './ads.js';

const $ = id => document.getElementById(id);
const hs = $('hs'), msgEl = $('msg'), invEl = $('inv'), ov = $('ov'), ov2 = $('ov2'), cutsEl = $('cuts');

// Der Spielstand ist EIN Objekt, das nie ersetzt wird – Bücher halten eine Referenz darauf.
const S = { room: 0, f: {}, inv: [], hints: 0, t0: 0, maxDone: 0, playing: false };
let book = null, sel = null, W = 1086, H = 1448;
let ui = { screen() {}, onWin() {} };

const key = () => 'eb:' + book.id;
export function save() { try { localStorage.setItem(key(), JSON.stringify(S)); } catch (e) {} }
export function loadState(id) { try { const v = localStorage.getItem('eb:' + id); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function resetState(v) { for (const k of Object.keys(S)) delete S[k]; Object.assign(S, { room: 0, f: {}, inv: [], hints: 0, t0: 0, maxDone: 0, playing: false }, v || {}); }

const room = () => book.rooms[S.room];
const has = i => S.inv.includes(i);
function give(i) { if (!has(i)) { S.inv.push(i); sfx('pick'); renderInv(i); } }
function take(i) { S.inv = S.inv.filter(x => x !== i); if (sel === i) sel = null; renderInv(); }
function say(t) { msgEl.classList.add('fade'); setTimeout(() => { msgEl.innerHTML = t; msgEl.classList.remove('fade'); }, 120); }
const desc = i => typeof book.items[i].d === 'function' ? book.items[i].d() : book.items[i].d;
const icon = i => `<img src="${book.asset(book.items[i].i)}" alt="">`;

function cutStyle(src, [x, y, w, h]) {
  return `left:${x / W * 100}%;top:${y / H * 100}%;width:${w / W * 100}%;height:${h / H * 100}%;background-image:url(${src});background-size:${W / w * 100}% ${H / h * 100}%;background-position:${x / (W - w) * 100}% ${y / (H - h) * 100}%`;
}

function loadRoom() {
  const r = room();
  $('roomImg').src = r.img; $('roomTitle').textContent = r.title;
  ov.setAttribute('viewBox', `0 0 ${W} ${H}`); ov2.setAttribute('viewBox', `0 0 ${W} ${H}`);
  $('scene').style.aspectRatio = `${W}/${H}`;
  cutsEl.innerHTML = r.cuts.map((c, k) => `<div class="cut ${c.kind}" data-k="${k}" style="${cutStyle(r.img, c.r)};${c.origin ? 'transform-origin:' + c.origin + ';' : ''}${c.clip ? 'clip-path:' + c.clip : ''}"></div>`).join('');
}
function render() {
  const r = room(), [a, b] = r.ov(S.f); ov.innerHTML = a; ov2.innerHTML = b;
  cutsEl.querySelectorAll('.cut').forEach(el => el.classList.toggle('on', !!r.cuts[el.dataset.k].on(S.f)));
  if (book.afterRender) book.afterRender();
  hs.innerHTML = r.hot.filter(h => !h.vis || h.vis()).map(h => `<button class="h" data-id="${h.id}" aria-label="${h.id}" style="left:${h.r[0] / W * 100}%;top:${h.r[1] / H * 100}%;width:${h.r[2] / W * 100}%;height:${h.r[3] / H * 100}%"></button>`).join('');
  save();
}
function renderInv(fresh) {
  const slots = Math.max(8, S.inv.length);
  invEl.innerHTML = [...Array(slots)].map((_, k) => {
    const i = S.inv[k];
    return i ? `<button class="slot${sel === i ? ' sel' : ''}${fresh === i ? ' new' : ''}" data-i="${i}" aria-label="${book.items[i].n}">${icon(i)}</button>` : '<div class="slot empty"></div>';
  }).join('');
  save();
}
function flash() { setTimeout(() => { const g = $('gFlash'); if (!g) return; g.style.transition = 'none'; g.setAttribute('opacity', '1'); setTimeout(() => { g.style.transition = 'opacity 1.4s'; g.setAttribute('opacity', '0'); }, 600); }, 40); }

hs.addEventListener('click', e => {
  const b = e.target.closest('.h'); if (!b) return;
  b.classList.remove('tap'); void b.offsetWidth; b.classList.add('tap');
  const h = room().hot.find(x => x.id === b.dataset.id); let t;
  if (sel) {
    const fn = h.use && h.use[sel];
    if (fn) t = fn(); else { t = `Mit <b>${book.items[sel].n}</b> kommst du hier nicht weiter.`; sfx('no'); }
    sel = null; renderInv();
  } else { t = h.act(); sfx('click'); }
  if (t) say(t); render();
});
invEl.addEventListener('click', e => {
  const b = e.target.closest('.slot[data-i]'); if (!b) return; const i = b.dataset.i;
  if (!sel) { sel = i; renderInv(); say(`<b>${book.items[i].n}</b> ausgewählt. Tippe auf etwas im Raum oder auf einen anderen Gegenstand. Nochmal tippen zum Ansehen.`); sfx('click'); return; }
  if (sel === i) { sel = null; renderInv(); if (book.items[i].paper) openPaper(i); else say(desc(i)); return; }
  const c = room().combos.find(c => (c.a === sel && c.b === i) || (c.b === sel && c.a === i));
  if (c) { sel = null; const t = c.t(); renderInv(); say(t); sfx('unlock'); render(); }
  else { say(`<b>${book.items[sel].n}</b> und <b>${book.items[i].n}</b> lassen sich nicht kombinieren.`); sfx('no'); sel = null; renderInv(); }
});

/* ---------- Dialoge ---------- */
export function closeModals() { let any = false; document.querySelectorAll('.modal.on').forEach(m => { m.classList.remove('on'); any = true; }); return any; }
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('.modal').classList.remove('on'));
function openPaperHTML(t, h) { $('pTitle').textContent = t; $('pText').innerHTML = h; $('mPaper').classList.add('on'); sfx('slide'); }
function openPaper(i) { openPaperHTML(book.items[i].paper[0], book.items[i].paper[1]); }
function dialog(title, html, closeLabel = 'Schließen') { $('dTitle').textContent = title; $('dBody').innerHTML = html; $('dClose').textContent = closeLabel; $('mDlg').classList.add('on'); return $('dBody'); }
function closeDialog() { $('mDlg').classList.remove('on'); }

// Zahlen-Tastenfeld (Tresor): nutzt room().code und room().onCode()
let code = '';
$('pad').innerHTML = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].map(k => `<button data-k="${k}">${k}</button>`).join('');
const drawCode = () => [...$('code').children].forEach((s, k) => s.textContent = code[k] || '');
function openSafe() { code = ''; drawCode(); $('mSafe').classList.add('on'); }
$('pad').addEventListener('click', e => {
  const k = e.target.dataset.k; if (!k) return;
  if (k === '⌫') code = code.slice(0, -1);
  else if (k === 'OK') {
    if (code === room().code) { $('mSafe').classList.remove('on'); const t = room().onCode(); sfx('unlock'); say(t); render(); return; }
    sfx('no'); const c = $('safeCard'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); code = '';
  } else if (code.length < 4) { code += k; sfx('click'); }
  drawCode();
});

// Drehring-Schloss: openLock({title, vals, show, code, start, ok})
let ring = [], LK = null;
const drawRings = () => $('rings').innerHTML = ring.map((v, k) => `<div class="ring"><button data-r="${k}" data-d="-1" aria-label="hoch">▲</button><div class="sy">${LK.show(LK.vals[v])}</div><button data-r="${k}" data-d="1" aria-label="runter">▼</button></div>`).join('');
function openLock(cfg) { LK = cfg; ring = cfg.start.slice(); $('lockTitle').textContent = cfg.title; drawRings(); $('mLock').classList.add('on'); }
$('rings').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const k = +b.dataset.r, n = LK.vals.length; ring[k] = (ring[k] + (+b.dataset.d) + n) % n; sfx('click'); drawRings(); });
$('bLockOpen').onclick = () => {
  if (ring.map(v => LK.vals[v]).join() === LK.code.join()) { $('mLock').classList.remove('on'); sfx('unlock'); LK.ok(); }
  else { sfx('no'); const c = $('lockCard'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); say('Du ruckelst am Schloss. Es bleibt zu.'); }
};

// Hinweise gegen Werbung
$('bHint').onclick = () => {
  $('hintBody').innerHTML = '<p>Steckst du fest? Schau dir eine kurze Werbung an und erhalte einen Hinweis.</p><button class="btn pri" id="bAd">Werbung ansehen</button><br><button class="btn" id="bNo">Nein danke</button>';
  $('mHint').classList.add('on');
  $('bNo').onclick = () => $('mHint').classList.remove('on');
  $('bAd').onclick = async () => {
    const ok = await rewardedAd($('hintBody'));
    if (!ok) { $('mHint').classList.remove('on'); return; }
    S.hints++; save();
    $('hintBody').innerHTML = `<p class="paper">${room().hint()}</p><br><button class="btn pri" id="bOk">Danke</button>`;
    $('bOk').onclick = () => $('mHint').classList.remove('on');
  };
};
$('bLook').onclick = () => { hs.querySelectorAll('.h').forEach(h => h.classList.add('show')); setTimeout(() => hs.querySelectorAll('.h').forEach(h => h.classList.remove('show')), 1400); };
$('bSnd').onclick = () => { sound.on = !sound.on; $('sndW').style.display = sound.on ? '' : 'none'; };

/* ---------- Ablauf ---------- */
let ty = null;
function intro() {
  const r = room(), el = $('introText'); $('introTitle').textContent = `${r.chapter}: ${r.title}`; el.innerHTML = ''; let p = 0, c = 0; clearInterval(ty);
  ui.screen('sIntro');
  ty = setInterval(() => { if (p >= r.intro.length) { clearInterval(ty); return; } if (c === 0) el.insertAdjacentHTML('beforeend', '<p></p>'); el.lastElementChild.textContent = r.intro[p].slice(0, ++c); if (c >= r.intro[p].length) { p++; c = 0; } }, 26);
}
$('bIntro').onclick = () => { clearInterval(ty); enterRoom(book.firstMsg); };
function enterRoom(m) { sel = null; S.playing = true; loadRoom(); render(); renderInv(); ui.screen('sGame'); say(m); }

function win() {
  const r = room(), s = Math.max(1, Math.round((Date.now() - S.t0) / 60000));
  $('endTitle').textContent = r.end[0];
  const ei = $('endImg'); ei.hidden = !r.endImg; if (r.endImg) ei.src = r.endImg;
  $('endText').innerHTML = r.end[1];
  $('endStats').textContent = `Zeit: ca. ${s} Min · Hinweise: ${S.hints}`;
  const next = book.rooms[S.room + 1];
  $('bNext').hidden = !next; $('bNext').textContent = next ? `Weiter zu ${next.chapter}` : '';
  $('endSoon').textContent = next ? '' : (r.soon || '');
  S.maxDone = Math.max(S.maxDone || 0, S.room + 1); S.playing = false; S.f.done = 1; save();
  ui.screen('sEnd'); ui.onWin();
}
$('bNext').onclick = () => startChapter(S.room + 1);

// Kapitel n frisch starten. Gegenstände aus "keep" werden mitgenommen bzw. ergänzt.
export function startChapter(n) {
  const r = book.rooms[n]; S.room = n; S.f = {};
  if (r.keep) { S.inv = S.inv.filter(i => r.keep.includes(i)); r.keep.forEach(i => { if (!has(i)) S.inv.push(i); }); } else S.inv = [];
  if (r.onStart) r.onStart();
  S.t0 = Date.now(); S.hints = 0; S.playing = false; save(); intro();
}
export function resume() { if (S.playing) enterRoom('Willkommen zurück.'); else startChapter(Math.min(S.maxDone || 0, book.rooms.length - 1)); }
export function restartBook() { resetState({}); save(); startChapter(0); }
export function leaveToBook() { clearInterval(ty); save(); }

// Buch laden: die Buch-Funktion bekommt die Engine-Schnittstelle
const api = { S, give, take, has, say, sfx, tone, render, win, openLock, openSafe, openPaper, openPaperHTML, flash, cutStyle, room, dialog, closeDialog };
const cache = new Map();
export function useBook(factory, hooks) {
  if (!cache.has(factory)) cache.set(factory, factory(api));
  ui = hooks; book = cache.get(factory); [W, H] = book.size;
  resetState(loadState(book.id)); return book;
}
export const state = S;
