// Escape-Bücher – App-Rahmen: Bücherregal, Buchseite, Navigation, Zurück-Taste.
import { BOOKS } from '../books/index.js';
import { useBook, loadState, startChapter, resume, restartBook, leaveToBook, closeModals, state } from './engine.js';

const $ = id => document.getElementById(id);
let current = null, currentFactory = null, screenNow = 'sLib';

function screen(id) {
  screenNow = id;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
}

const ICON = {
  done: '<svg viewBox="0 0 24 24" fill="none" stroke="#f2b35b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="#a8a08c" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="#efe4cf"><path d="M8 5v14l11-7z"/></svg>'
};

// Buch-Metadaten (Titel, Cover …) ohne die Engine zu starten
const meta = new Map();
function info(factory) {
  if (!meta.has(factory)) meta.set(factory, useBook(factory, hooks));
  return meta.get(factory);
}
const hooks = { screen, onWin() {} };

/* ---------- Bücherregal ---------- */
function renderShelf() {
  $('shelf').innerHTML = BOOKS.map((f, k) => {
    const b = info(f), st = loadState(b.id) || {}, done = st.maxDone || 0, n = b.rooms.length;
    return `<button class="bk" data-k="${k}"><div class="bkCover" style="background-image:url(${b.cover})"><b>${b.title}</b></div>
      <div class="bkMeta">${b.genre} · ${done >= n ? 'Abgeschlossen' : done ? `${done} von ${n} Kapiteln` : `${n} Kapitel`}</div>
      <div class="bkBar"><i style="width:${done / n * 100}%"></i></div></button>`;
  }).join('') + `<div class="bk soon"><div class="bkCover">Weitere Geschichten folgen</div><div class="bkMeta">Bald im Regal</div></div>`;
}
$('shelf').addEventListener('click', e => { const b = e.target.closest('.bk[data-k]'); if (b) openBook(BOOKS[+b.dataset.k]); });

/* ---------- Buchseite ---------- */
function openBook(factory) {
  currentFactory = factory; current = useBook(factory, hooks);
  const b = current, n = b.rooms.length, done = state.maxDone || 0;
  $('bpHero').style.backgroundImage = `url(${b.cover})`;
  $('bpTitle').textContent = b.title; $('bpGenre').textContent = `${b.genre} · ${n} Kapitel`; $('bpTag').textContent = b.tagline;
  const fresh = !state.playing && done === 0;
  $('bPlay').innerHTML = fresh ? 'Spiel beginnen' : done >= n && !state.playing ? 'Nochmal von vorne' : `Weiterspielen – ${b.rooms[state.playing ? state.room : Math.min(done, n - 1)].chapter}`;
  $('bRestart').hidden = fresh || (done >= n && !state.playing);
  $('chapList').innerHTML = b.rooms.map((r, k) => {
    const open = k <= done, isDone = k < done;
    return `<li><button data-c="${k}" ${open ? '' : 'disabled'}><span class="n">${k + 1}</span><span class="t">${open ? r.title : 'Noch verschlossen'}<small>${isDone ? 'Geschafft' : open ? 'Bereit' : 'Schließe das vorherige Kapitel ab'}</small></span>${isDone ? ICON.done : open ? ICON.play : ICON.lock}</button></li>`;
  }).join('');
  screen('sBook');
}
$('bPlay').onclick = () => { const n = current.rooms.length; if ((state.maxDone || 0) >= n && !state.playing) restartBook(); else resume(); };
$('bRestart').onclick = () => confirmBox('Von vorne beginnen?', 'Dein Fortschritt in diesem Buch wird gelöscht.', 'Ja, neu beginnen', restartBook);
$('chapList').addEventListener('click', e => {
  const b = e.target.closest('button[data-c]'); if (!b || b.disabled) return;
  const k = +b.dataset.c;
  if (state.playing && state.room !== k) confirmBox('Kapitel wechseln?', 'Dein Fortschritt im laufenden Kapitel geht verloren.', 'Kapitel starten', () => startChapter(k));
  else if (state.playing) resume(); else startChapter(k);
});
$('bBookBack').onclick = () => { renderShelf(); screen('sLib'); };
$('bGameBack').onclick = () => { leaveToBook(); openBook(currentFactory); };
$('bToBook').onclick = () => openBook(currentFactory);

function confirmBox(title, text, yes, fn) {
  $('cTitle').textContent = title; $('cText').textContent = text; $('cYes').textContent = yes;
  $('cYes').onclick = () => { $('mConfirm').classList.remove('on'); fn(); };
  $('mConfirm').classList.add('on');
}

/* ---------- Android-Zurück-Taste ---------- */
function back() {
  if (closeModals()) return true;
  if (screenNow === 'sGame' || screenNow === 'sIntro' || screenNow === 'sEnd') { leaveToBook(); openBook(currentFactory); return true; }
  if (screenNow === 'sBook') { renderShelf(); screen('sLib'); return true; }
  return false;
}
const App = window.Capacitor?.Plugins?.App;
if (App) App.addListener('backButton', () => { if (!back()) App.exitApp(); });

renderShelf();
