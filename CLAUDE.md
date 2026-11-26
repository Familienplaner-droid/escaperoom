# Escape-Bücher – Hinweise für die Arbeit an diesem Repo

- Sprache im Spiel und in Commits: Deutsch.
- Kein Build-Schritt: `www/` wird direkt ausgeliefert (ES-Module). Testen mit einem lokalen HTTP-Server (Module laden nicht über `file://`).
- Engine (`www/js/engine.js`) bleibt buchneutral. Alles Geschichtenspezifische gehört in `www/books/<buch>/book.js`.
- Das Spielstand-Objekt `S` wird nie ersetzt, nur verändert – Bücher halten eine Referenz darauf.
- Raum-Koordinaten (Klickflächen, Overlays) sind Bildpixel des Raumbilds (Villa Morgenrot: 1086 × 1448).
- Rätsel-Design-Regel: Jeder Code / jede Lösung braucht mindestens zwei Hinweise aus dem Raum. Keine Abkürzungen, kein Erraten durch Rückmeldung nach einzelnen Schritten.
- Android-Projekt (`android/`) wird in CI erzeugt und ist nicht eingecheckt.
