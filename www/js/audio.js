// Töne werden synthetisch erzeugt (kein Download nötig).
// Später: echte Soundeffekte und Musik pro Raum.
export const sound = { on: true };
let ac = null;
export function tone(f, d, type = 'sine', v = .15, delay = 0) {
  if (!sound.on) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d);
  } catch (e) {}
}
export function sfx(k) {
  if (k === 'click') tone(320, .06, 'triangle', .08);
  if (k === 'pick') { tone(660, .12, 'sine', .12); tone(990, .18, 'sine', .1, .09); }
  if (k === 'unlock') { tone(523, .15, 'triangle', .12); tone(784, .2, 'triangle', .12, .12); tone(1046, .4, 'sine', .1, .26); }
  if (k === 'no') tone(120, .18, 'sawtooth', .06);
  if (k === 'slide') tone(90, .25, 'triangle', .12);
  if (k === 'chime') [0, 1, 2].forEach(i => { tone(392, 1.4, 'sine', .14, 1.6 + i * .9); tone(784, 1, 'sine', .05, 1.6 + i * .9); });
  if (k === 'door') { tone(70, .9, 'sawtooth', .05); tone(110, .7, 'triangle', .08, .3); }
  if (k === 'music') [392, 440, 494, 523, 494, 440, 392, 330, 349, 392].forEach((n, i) => tone(n, .45, 'triangle', .07, i * .32));
  if (k === 'parrot') { [0, .12, .24].forEach(d => tone(200, .08, 'square', .05, d)); [1400, 1700, 1300, 1900, 1500].forEach((n, i) => tone(n, .12, 'square', .05, .5 + i * .14)); }
}
