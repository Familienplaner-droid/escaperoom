// Übersetzungen. Deutsch ist die Ausgangssprache: Jeder deutsche Text ist sein eigener Schlüssel.
// Übersetzungsdateien: www/i18n/<sprache>.json und www/books/<buch>/i18n/<sprache>.json
// Format: { "Deutscher Text": "Übersetzung" }. Platzhalter {0}, {1} für eingesetzte Werte.
export const LANGS = { de: 'Deutsch', en: 'English', fr: 'Français', es: 'Español', pt: 'Português' };

let lang = 'de';
const dict = new Map();
let long = []; // Schlüssel für Teilersetzung (zusammengesetzte Texte), längste zuerst

export const getLang = () => lang;

function pickInitial() {
  try { const s = localStorage.getItem('eb:lang'); if (s && LANGS[s]) return s; } catch (e) {}
  const n = (navigator.language || 'de').slice(0, 2).toLowerCase();
  return LANGS[n] ? n : 'en';
}

async function loadJSON(url) { try { const r = await fetch(url); return r.ok ? await r.json() : {}; } catch (e) { return {}; } }

export async function setLang(l, bookDirs = []) {
  lang = LANGS[l] ? l : 'de';
  try { localStorage.setItem('eb:lang', lang); } catch (e) {}
  dict.clear(); long = [];
  if (lang !== 'de') {
    const files = await Promise.all([loadJSON(`i18n/${lang}.json`), ...bookDirs.map(d => loadJSON(`${d}/i18n/${lang}.json`))]);
    for (const f of files) for (const [k, v] of Object.entries(f)) if (v) dict.set(k, v);
    long = [...dict.keys()].filter(k => k.length >= 8 && !k.includes('{')).sort((a, b) => b.length - a.length);
  }
  document.documentElement.lang = lang;
  applyStatic();
}
export const initLang = dirs => setLang(pickInitial(), dirs);

// Text übersetzen. Unbekannte Texte bleiben deutsch; zusammengesetzte Texte werden stückweise übersetzt.
export function tr(s) {
  if (lang === 'de' || typeof s !== 'string' || !s) return s;
  const hit = dict.get(s); if (hit) return hit;
  let out = s;
  for (const k of long) if (out.includes(k)) out = out.split(k).join(dict.get(k));
  if (window.__trMiss && /[äöüß]|\b(der|die|das|und|nicht|ist)\b/.test(out.replace(/<[^>]*>/g, ' '))) window.__trMiss.add(out);
  return out;
}
// Text mit Platzhaltern: tf('Weiter zu {0}', name)
export const tf = (key, ...a) => tr(key).replace(/\{(\d)\}/g, (_, i) => a[i]);

// Feste Texte im HTML: data-i18n (Textinhalt) und data-i18n-aria (aria-label), Wert = deutscher Text
export function applyStatic() {
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = tr(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', tr(el.dataset.i18nAria)));
}
