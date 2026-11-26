# Escape-Bücher

Rätselabenteuer im Escape-Room-Stil als App. Jede Geschichte ist ein „Buch“ mit mehreren Kapiteln (Räumen). Man untersucht Gegenstände, kombiniert sie im Inventar und knackt Schlösser, um weiterzukommen.

**Erstes Buch:** *Villa Morgenrot* (Mystery, 5 Kapitel)

## Spielen und testen

- **Android-Test-App:** Unter [Actions](../../actions) den neuesten Lauf von „Android-App bauen“ öffnen, unten bei *Artifacts* `escape-buecher-debug-apk` herunterladen, entpacken und die APK auf dem Handy installieren (Installation aus unbekannten Quellen erlauben).
- **Im Browser:** Nach dem Aktivieren von GitHub Pages (Settings → Pages → Source: *GitHub Actions*) läuft das Spiel unter `https://<benutzer>.github.io/escaperoom/`.
- **Lokal:** `npm run serve` und `http://localhost:8080` öffnen.

## Aufbau

```
www/
  index.html            App-Hülle (alle Bildschirme und Dialoge)
  css/app.css           Gestaltung
  js/app.js             Bücherregal, Buchseite, Navigation, Android-Zurück-Taste
  js/engine.js          Spiel-Engine: Raum, Klickflächen, Inventar, Schlösser, Hinweise, Spielstand
  js/audio.js           Töne
  js/ads.js             Werbung für Hinweise (noch Platzhalter, später AdMob)
  books/index.js        Liste aller Bücher
  books/<buch>/book.js  Inhalt eines Buchs: Gegenstände, Kapitel, Rätsel
  books/<buch>/img/     Bilder eines Buchs
```

## Ein neues Buch anlegen

1. Ordner `www/books/<name>/` mit `book.js` und `img/` anlegen (Vorlage: `villa-morgenrot/book.js`).
2. In `www/books/index.js` importieren und in `BOOKS` eintragen.

Die Engine braucht nichts weiter – alle Inhalte stehen im Buch.

## Technik

Web-App (HTML/CSS/JavaScript ohne Build-Schritt), als Android-App verpackt mit [Capacitor](https://capacitorjs.com). GitHub Actions baut die APK automatisch.
