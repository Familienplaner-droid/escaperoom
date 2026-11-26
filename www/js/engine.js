// Escape-Bücher – Spiel-Engine
// Kümmert sich um Raum, Klickflächen, Inventar, Kombinieren, Schlösser,
// Hinweise, Töne und Spielstand. Inhalte kommen komplett aus den Büchern.
import { sfx, tone, sound } from './audio.js';
import { rewardedAd } from './ads.js';

const $ = id => document.getElementById(id);
const hs = $('hs'), msgEl = $('msg'), invEl = $('inv'), ov = $('ov'), ov2 = $('ov2'), cutsEl = $('cuts');

// Der Spielstand ist EIN Objekt, das nie ersetzt wird – Bücher halten eine Referenz darauf.
const FRESH = () => ({ room: 0, f: {}, inv: [], hints: 0, t0: 0, maxDone: 0, playing: false, seen: [], hintLv: {}, freeHint: true });
const S = FRESH();
let book = null, sel = null, W = 1086, H = 1448;
let ui = { screen() {}, onWin() {} };

const key = () => 'eb:' + book.id;
export function save() { try { localStorage.setItem(key(), JSON.stringify(S)); } catch (e) {} }
export function loadState(id) { try { const v = localStorage.getItem('eb:' + id); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function resetState(v) { for (const k of Object.keys(S)) delete S[k]; Object.assign(S, FRESH(), v || {}); }

const room = () => book.rooms[S.room];
const has = i => S.inv.includes(i);
function give(i) { if (!has(i)) { S.inv.push(i); sfx('pick'); renderInv(i); } }
function take(i) { S.inv = S.inv.filter(x => x !== i); if (sel === i) sel = null; renderInv(); }
function say(t) { msgEl.classList.add('fade'); setTimeout(() => { msgEl.innerHTML = t; msgEl.classList.remove('fade'); }, 120); }
const desc = i => typeof book.items[i].d === 'function' ? book.items[i].d() : book.items[i].d;
const icon = i => `<img src="${book.asset(book.items[i].i)}" alt="">`;

const NOPE = [
  n => `Mit <b>${n}</b> kommst du hier nicht weiter.`,
  n => `<b>${n}</b>? Das passt hier nicht.`,
  n => `Du probierst es mit <b>${n}</b>. Nichts passiert.`,
  n => `Das ergibt keinen Sinn – <b>${n}</b> hilft hier nicht.`
];
let nopeK = 0;
const nope = n => NOPE[nopeK++ % NOPE.length](n);
const pick = v => typeof v === 'function' ? v() : v;

function cutStyle(src, [x, y, w, h]) {
  return `left:${x / W * 100}%;top:${y / H * 100}%;width:${w / W * 100}%;height:${h / H * 100}%;background-image:url(${src});background-size:${W / w * 100}% ${H / h * 100}%;background-position:${x / (W - w) * 100}% ${y / (H - h) * 100}%`;
}

let curImg = '';
const imgOf = r => r.imgFor ? r.imgFor(S.f) : r.img;
function loadRoom() {
  const r = room(); curImg = imgOf(r);
  $('roomImg').src = curImg; $('roomTitle').textContent = r.title;
  ov.setAttribute('viewBox', `0 0 ${W} ${H}`); ov2.setAttribute('viewBox', `0 0 ${W} ${H}`);
  $('scene').style.aspectRatio = `${W}/${H}`;
  cutsEl.innerHTML = r.cuts.map((c, k) => `<div class="cut ${c.kind}" data-k="${k}" style="${cutStyle(curImg, c.r)};${c.origin ? 'transform-origin:' + c.origin + ';' : ''}${c.clip ? 'clip-path:' + c.clip : ''}"></div>`).join('');
}
function render() {
  const r = room(), src = imgOf(r);
  if (src !== curImg) { curImg = src; $('roomImg').src = src; cutsEl.querySelectorAll('.cut').forEach(el => el.style.backgroundImage = `url(${src})`); }
  const [a, b] = r.ov(S.f); ov.innerHTML = a; ov2.innerHTML = b;
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
  if (!S.seen.includes(h.id)) S.seen.push(h.id);
  if (sel) {
    const fn = h.use && h.use[sel];
    if (fn) t = fn();
    else { t = pick(h.no && h.no[sel]) || (room().noUse && room().noUse(sel, h.id)) || nope(book.items[sel].n); sfx('no'); }
    sel = null; renderInv();
  } else { t = h.act(); sfx('click'); }
  if (t) say(t); render();
});
invEl.addEventListener('click', e => {
  const b = e.target.closest('.slot[data-i]'); if (!b) return; const i = b.dataset.i;
  if (!sel) { sel = i; renderInv(); say(`<b>${book.items[i].n}</b> ausgewählt. Tippe auf etwas im Raum oder auf einen anderen Gegenstand. Nochmal tippen zum Ansehen.`); sfx('click'); return; }
  if (sel === i) { sel = null; renderInv(); if (book.items[i].paper) openPaper(i); else closeUp(i); return; }
  const c = room().combos.find(c => (c.a === sel && c.b === i) || (c.b === sel && c.a === i));
  if (c) { sel = null; const t = c.t(); renderInv(); say(t); sfx('unlock'); render(); }
  else {
    const k = [sel, i].sort().join('+'), r = room();
    say(pick(r.comboNo && r.comboNo[k]) || `<b>${book.items[sel].n}</b> und <b>${book.items[i].n}</b> lassen sich nicht kombinieren.`);
    sfx('no'); sel = null; renderInv();
  }
});

/* ---------- Dialoge ---------- */
export function closeModals() { let any = false; document.querySelectorAll('.modal.on').forEach(m => { m.classList.remove('on'); any = true; }); return any; }
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('.modal').classList.remove('on'));
function openPaperHTML(t, h) { $('pTitle').textContent = t; $('pText').innerHTML = h; $('mPaper').classList.add('on'); sfx('slide'); }
function openPaper(i) { openPaperHTML(book.items[i].paper[0], book.items[i].paper[1]); }
function closeUp(i) {
  const it = book.items[i], big = book.asset('big/' + it.i.replace(/\.\w+$/, '.webp'));
  dialog(it.n, `<div class="closeUp"><img src="${big}" alt="" onerror="this.onerror=null;this.src='${book.asset(it.i)}'"></div><p>${desc(i)}</p>`);
  sfx('slide');
}
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

// Hinweise: room().hint() liefert einen Text ODER eine Liste [Schubs, Tipp, Lösung].
// Bereits gelesene Stufen bleiben gratis sichtbar. Pro Kapitel ist ein Hinweis gratis.
function hintSteps() { const h = room().hint(); return Array.isArray(h) ? h : [h]; }
function showHints() {
  const steps = hintSteps(), id = steps[0], lv = S.hintLv[id] || 0, more = lv < steps.length;
  const read = steps.slice(0, lv).map((t, k) => `<p class="paper" style="margin:0 0 8px"><small style="display:block;font-style:normal;opacity:.7">Hinweis ${k + 1} von ${steps.length}</small>${t}</p>`).join('');
  const btn = !more ? '' : S.freeHint
    ? `<button class="btn pri" id="bHintGo">${lv ? 'Nächster Hinweis' : 'Hinweis ansehen'} (gratis)</button><p class="small">Ein Hinweis pro Kapitel ist kostenlos.</p>`
    : `<button class="btn pri" id="bHintGo">${lv ? 'Nächster Hinweis' : 'Hinweis'}: kurze Werbung ansehen</button>`;
  $('hintBody').innerHTML = (read || '<p>Steckst du fest? Hinweise kommen in Stufen: erst ein kleiner Schubs, am Ende die Lösung.</p>') + btn + '<br><button class="btn" id="bNo">' + (read ? 'Schließen' : 'Nein danke') + '</button>';
  $('bNo').onclick = () => $('mHint').classList.remove('on');
  const go = $('bHintGo'); if (!go) return;
  go.onclick = async () => {
    if (S.freeHint) S.freeHint = false;
    else if (!(await rewardedAd($('hintBody')))) { $('mHint').classList.remove('on'); return; }
    S.hintLv[id] = lv + 1; S.hints++; save(); showHints();
  };
}
$('bHint').onclick = () => { showHints(); $('mHint').classList.add('on'); };
// Lupe: zeigt nur Stellen, die noch nicht untersucht wurden
$('bLook').onclick = () => {
  const fresh = [...hs.querySelectorAll('.h')].filter(h => !S.seen.includes(h.dataset.id));
  if (!fresh.length) { say('Du hast hier schon alles untersucht. Vielleicht hilft einer deiner Gegenstände weiter?'); return; }
  fresh.forEach(h => h.classList.add('show')); setTimeout(() => fresh.forEach(h => h.classList.remove('show')), 1400);
};
$('bSnd').onclick = () => { sound.on = !sound.on; $('sndW').style.display = sound.on ? '' : 'none'; };

/* ---------- Einführung (einmalig) ---------- */
const TUT = [
  ['#scene', 'Tippe auf Dinge im Raum, um sie zu untersuchen. Manches kannst du mitnehmen.'],
  ['#inv', 'Gefundenes landet hier. Tippe einen Gegenstand an und danach auf eine Stelle im Raum, um ihn dort zu benutzen.'],
  ['#inv', 'Zwei Gegenstände kombinieren: ersten antippen, dann den zweiten. Denselben zweimal antippen zeigt ihn dir aus der Nähe.'],
  ['#bLook', 'Die Lupe zeigt dir Stellen, die du noch nicht untersucht hast.'],
  ['#bHint', 'Kommst du nicht weiter? Hier gibt es Hinweise – erst einen kleinen Schubs, ganz am Ende die Lösung.']
];
function tutorial(force) {
  let done = false; try { done = localStorage.getItem('eb:tutorial') === '1'; } catch (e) {}
  if (done && !force) return;
  let k = 0; const box = $('tut'), hole = $('tutHole'), txt = $('tutText');
  const step = () => {
    if (k >= TUT.length) { box.classList.remove('on'); try { localStorage.setItem('eb:tutorial', '1'); } catch (e) {} return; }
    const [sel, t] = TUT[k], r = document.querySelector(sel).getBoundingClientRect(), pad = 6;
    Object.assign(hole.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
    $('tutMsg').innerHTML = `<b>${k + 1} / ${TUT.length}</b> ${t}`;
    const below = r.top + r.height / 2 < innerHeight / 2;
    txt.style.top = below ? Math.min(r.bottom + 18, innerHeight - 170) + 'px' : ''; txt.style.bottom = below ? '' : Math.max(innerHeight - r.top + 18, 16) + 'px';
    $('tutNext').textContent = k === TUT.length - 1 ? 'Los geht’s' : 'Weiter';
  };
  $('tutNext').onclick = () => { k++; step(); };
  box.classList.add('on'); requestAnimationFrame(step);
}
export const showTutorial = () => tutorial(true);

/* ---------- Ablauf ---------- */
let ty = null;
function intro() {
  const r = room(), el = $('introText'); $('introTitle').textContent = `${r.chapter}: ${r.title}`;
  const ii = $('introImg'); ii.hidden = !r.introImg; if (r.introImg) ii.src = r.introImg; el.innerHTML = ''; let p = 0, c = 0; clearInterval(ty);
  ui.screen('sIntro');
  ty = setInterval(() => { if (p >= r.intro.length) { clearInterval(ty); return; } if (c === 0) el.insertAdjacentHTML('beforeend', '<p></p>'); el.lastElementChild.textContent = r.intro[p].slice(0, ++c); if (c >= r.intro[p].length) { p++; c = 0; } }, 26);
}
$('bIntro').onclick = () => { clearInterval(ty); enterRoom(room().firstMsg || book.firstMsg); };
function enterRoom(m) { sel = null; S.playing = true; loadRoom(); render(); renderInv(); ui.screen('sGame'); say(m); if (book.onEnter) book.onEnter(); tutorial(); }

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
  S.t0 = Date.now(); S.hints = 0; S.seen = []; S.hintLv = {}; S.freeHint = true; S.playing = false; save(); intro();
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
