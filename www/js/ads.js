// Werbung für Hinweise ("Rewarded Ad").
// Platzhalter: zeigt 3 Sekunden einen Demo-Kasten. Später wird hier das
// AdMob-Plugin von Capacitor angebunden – der Rest des Spiels bleibt gleich.
import { tr } from './i18n.js';
export function rewardedAd(container) {
  return new Promise(resolve => {
    let n = 3;
    container.innerHTML = `<div class="ad">${tr('Hier läuft später die Werbung (AdMob)')}<br><span>${n}</span></div>`;
    const span = container.querySelector('span');
    const iv = setInterval(() => { n--; span.textContent = n; if (n <= 0) { clearInterval(iv); resolve(true); } }, 1000);
  });
}
