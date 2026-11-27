# Ein neues Buch für Questory bauen

Dieses Dokument ist die Arbeitsanleitung für einen neuen Chat, der ein weiteres Buch entwickelt.
Erst ganz lesen, dann `CLAUDE.md`, dann das Buch-Konzept unter `docs/buecher/`.
Das fertige Vorbild ist **Villa Morgenrot** (`www/books/villa-morgenrot/book.js`) – bei jeder Frage
„wie macht man X?“ zuerst dort nachsehen.

---

## 1. Rollen und Arbeitsweise

- **Claude** schreibt den gesamten Code, alle Spieltexte (zuerst Deutsch), alle Bild-Prompts und
  später die Übersetzungen (EN, FR, ES, PT-BR).
- **Der Nutzer** erzeugt die Bilder mit ChatGPT und lädt sie im Chat hoch. Musik kommt später (Suno).
- Der Nutzer spielt auf dem Handy und gibt Rückmeldung. Er spricht Deutsch, ist kein Programmierer
  und schätzt klare, kurze Antworten.
- **Für jedes Bild und jeden Gegenstand einen eigenen Prompt** in einem eigenen Codeblock (leichter zu kopieren).
  Bei jedem Prompt dazuschreiben, **ob ein Referenzbild mitgeschickt werden muss** und welches.
- Qualitätsanspruch: **veröffentlichungsreif**. Lieber ein Kapitel richtig als drei halb.

### Ablauf pro Buch
1. **Konzept** – Geschichte, Figuren, 5 Kapitel, pro Kapitel die vollständige Rätselkette (siehe 3.)
   und Gegenstandsliste. Dem Nutzer kurz vorstellen und Freigabe holen.
2. **Kapitel für Kapitel**:
   a) Bild-Prompts für das Kapitel liefern (Raum, Intro-Bild, Zustandsbilder, Gegenstände, Nahansichten).
   b) Nutzer lädt Bilder hoch → Bilder zuschneiden/optimieren und einbauen.
   c) Kapitel programmieren, mit Playwright komplett durchspielen, Bildschirmfotos ansehen.
   d) Committen, pushen, auf den Android-Build warten, Nutzer zum Testen auffordern.
   e) Rückmeldung einarbeiten, dann nächstes Kapitel.
3. **Abschluss** – Cover, Finale-Bild, Übersetzungen, kompletter Durchlauf in allen 5 Sprachen,
   Buch im Regal freischalten.

---

## 2. Technik in Kürze

- Kein Build-Schritt: `www/` wird direkt ausgeliefert (ES-Module). Testen über
  `cd www && python3 -m http.server 8765`.
- Android: GitHub Actions baut bei jedem Push auf `main` die Test-APK und hängt sie an das Release `test`:
  `https://github.com/Familienplaner-droid/escaperoom/releases/download/test/escape-buecher-test.apk`
  (Status: `gh run list -L 3`; nur REST-API von `gh` funktioniert, kein GraphQL).
- Commits auf Deutsch. **Vor jedem Push `git pull --rebase`** (es können mehrere Chats an verschiedenen
  Büchern arbeiten), dann `git -c push.negotiate=true push`.
- Nur die Dateien des eigenen Buchs ändern. Änderungen an Engine/App (`www/js/`, `www/css/`) nur, wenn
  wirklich nötig, buchneutral, und Villa Morgenrot danach mit `tools/playtest.py` erneut durchspielen.
- **Stand festhalten:** Im Konzept-Dokument `docs/buecher/<nr>-<buch>.md` den Abschnitt „Stand“ nach jedem
  Kapitel aktualisieren (fertig / offen / bekannte Probleme / fehlende Bilder). Wird der Chat zu lang,
  kann ein neuer Chat dort weitermachen.

### Dateien eines Buchs
```
www/books/<buch-id>/
  book.js            alle Kapitel, Gegenstände, Texte, Rätsel-Logik
  img/               Raumbilder (.jpg), Gegenstands-Icons (.png), Overlays (.webp)
  img/big/           Nahansichten der Gegenstände (.webp, bis 480 px)
  i18n/<lang>.json   Übersetzungen (en, fr, es, pt) – Deutsch ist der Schlüssel
  i18n_extra.json    optional: Texte, die der Extraktor nicht findet
```
Anmelden in `www/books/index.js` an **beiden** Stellen (`BOOKS` und `BOOK_DIRS`), sobald Kapitel 1
spielbar ist. Noch fehlende Kapitel einfach weglassen; das letzte vorhandene Kapitel bekommt
`soon:'Kapitel 2: … – bald verfügbar'`.

### Aufbau von `book.js`
Ein Buch ist eine Funktion, die die Engine-Schnittstelle bekommt:
```js
export default function meinBuch(api){
const {tr,tf,lang,S,give,take,has,say,sfx,tone,render,win,openLock,openSafe,openPaper,openPaperHTML,flash,cutStyle,room,dialog,closeDialog}=api;
const A=name=>'books/mein-buch/img/'+name;
const W=1086, H=1448;               // Pixelmaße des Raumbilds = Koordinatensystem
const ITEMS={ ... }; const R1={ ... }; ...
return { id:'mein-buch', title:'…', genre:'…', tagline:'…', cover:A('cover.jpg'),
         size:[W,H], asset:A, items:ITEMS, rooms:[R1,R2,R3,R4,R5],
         firstMsg:'…', afterRender:optional, onEnter:optional };
}
```
- **Spielstand** `S`: `S.f` = Flags des Kapitels (frei benennbar, z. B. `S.f.safe=1`), `S.inv` = Inventar.
  `S` nie ersetzen, nur verändern.
- **API**: `give(id)`/`take(id)`/`has(id)` Inventar · `say(html)` Meldung · `sfx('click'|'pick'|'unlock'|'no'|'slide'|'chime'|'door'|'music')`
  · `render()` neu zeichnen · `win()` Kapitel geschafft · `openSafe()` 4-stelliges Tastenfeld (nutzt `room.code` und `room.onCode()`)
  · `openLock({title, skin, vals, show, code, start, ok})` Drehring-Schloss · `openPaperHTML(titel, html)` Brief/Zettel
  · `dialog(titel, html, knopf)` freier Dialog (gibt das Body-Element zurück) · `flash()` Lichtblitz im Overlay
  · `tr(text)`/`tf(text, ...werte)` Übersetzen – **jeder Text, der per `innerHTML`/`textContent` direkt gesetzt
  wird, muss durch `tr()`**. `say`, `dialog`, `openPaperHTML`, Hinweise und Item-Namen übersetzt die Engine selbst.

### Gegenstände
```js
schluessel:{n:'Name', i:'schluessel.png', d:'Beschreibung'}          // d darf eine Funktion sein (zustandsabhängig)
brief:{n:'Brief', i:'brief.png', paper:['Titel','Text mit <b>HTML</b>']} // öffnet sich als Papier
```
Nahansicht: `img/big/<icon-name>.webp`. Fehlt sie, wird das Icon groß gezeigt.

### Kapitel (Raum)
| Feld | Zweck |
|---|---|
| `title`, `chapter` | Raumname, „Kapitel 1“ |
| `img` / `imgFor(f)` | Raumbild bzw. Bild je nach Zustand (z. B. Licht an/aus) |
| `introImg`, `intro:[…]` | Bild und Textzeilen der Einleitung |
| `onStart()`, `firstMsg`, `keep:[…]` | Startgegenstände, erste Meldung, Gegenstände aus dem Vorkapitel |
| `hot:[…]` | Klickflächen, siehe unten |
| `combos:[{a,b,t}]` | Kombinationen im Inventar, `t()` liefert Meldung |
| `comboNo:{'a+b':'Text'}` | eigene Antwort für sinnlose Kombis (Schlüssel alphabetisch sortiert) |
| `cuts:[{r,kind,on,src,origin,clip}]` | Bildausschnitt, der animiert wird: `reveal`, `slow`, `hingeL`, `slide`, `swing`, `liftOff`, `puff` |
| `ov(f)` | gibt `[svgUnten, svgOben]` zurück – Overlays (Zustandsbilder als `<image>`, Leuchten, Zeiger …) |
| `code`, `onCode()` | Code für `openSafe()` |
| `hint()` | `[Schubs, Tipp, Lösung]` je nach Fortschritt (erster Eintrag ist die Kennung der Stufe) |
| `end:[titel, text]`, `endImg`, `soon` | Kapitelende |

Klickfläche:
```js
{id:'tuer', r:[x,y,w,h], vis:()=>!S.f.offen,
 act:()=>'Text beim Antippen',
 use:{schluessel(){ S.f.offen=1; take('schluessel'); sfx('door'); setTimeout(win,1800); return 'Die Tür geht auf.'; }},
 no:{hammer:'Eigene Antwort, wenn der Hammer hier benutzt wird.'}}
```
Koordinaten = Pixel im Raumbild (1086 × 1448). Zum Bestimmen: Bild mit Raster/Markierungen
in Python zeichnen und ansehen, nicht schätzen.

### Zustandsänderungen sichtbar machen
- **Ganzes Bild tauschen** (`imgFor`): wenn sich viel ändert (Licht aus, Regal offen).
- **Ausschnitt-Overlay** (`ov` + `.webp`): ChatGPT malt den Raum mit der Änderung (Referenzbild: Original-Raum).
  Danach den geänderten Bereich ausschneiden und als `p_<name>.webp` über das Original legen. Vorher
  Original und Variante deckungsgleich ausrichten (Größe, Versatz prüfen).
- **Cut-Animation** (`cuts`): Bildteil klappt/schwingt/hebt ab (Gemälde abnehmen, Tür auf).

### Übersetzen (am Ende des Buchs)
```
python3 tools/buch_i18n.py keys <buch-id>            # tools/tr/<buch-id>/de.txt mit "Nummer|Text"
# tools/tr/<buch-id>/en.txt usw. schreiben: "Nummer|Übersetzung"
python3 tools/buch_i18n.py build <buch-id> en fr es pt   # muss 0 fehlend, 0 Tag-Abweichungen melden
```
Danach jede Sprache komplett durchspielen und sichtbare deutsche Reste suchen
(`window.__trMiss = new Set()` vor dem Spielen setzen; die Engine sammelt dort Texte, die noch deutsch aussehen).
Rätsel mit Sprache (Wörter, Buchstaben, Wochentage) müssen pro Sprache funktionieren –
Vorbild: das Morsewort in Villa Morgenrot (`WORD = {de:'MUT', en:'HOPE', …}` über `lang()`).
Portugiesisch = brasilianisch.

### Durchspiel-Test
`tools/playtest.py` spielt Villa Morgenrot komplett durch (Playwright). Für das neue Buch ein eigenes
Skript nach diesem Muster schreiben und nach jedem Kapitel laufen lassen: keine JS-Fehler, alle Wege
schaffbar, Bildschirmfotos prüfen (Texte lesbar, nichts verdeckt, Klickflächen sitzen).

---

## 3. Rätsel-Design – die Regeln

Diese Regeln stammen aus echten Tests des Nutzers. Er hat Abkürzungen mehrfach gefunden und will sie nicht.

1. **Jede Lösung braucht mindestens zwei Hinweise aus dem Raum** (z. B. Tagebuch sagt *welcher Moment*,
   die Uhr zeigt *welche Uhrzeit*). Ein einzelner Fund darf die Lösung nie direkt verraten.
2. **Nichts ist erratbar.** Kein Schloss, bei dem man Ziffern einzeln ausprobieren kann; Rückmeldung erst,
   wenn die ganze Eingabe fertig ist (z. B. erst nach dem vierten gezogenen Buch).
3. **Jeder Gegenstand wird gebraucht.** Vor dem Programmieren die Abhängigkeitskette aufschreiben und prüfen:
   Kann man das Kapitel schaffen, ohne Gegenstand X zu benutzen? Dann ist X Deko oder die Kette ist falsch.
4. **Zwischenschritte sind logisch erzwungen**, nicht nur erlaubt (Code-Hinweis liegt erst hinter dem Schritt).
5. **Abwechslung pro Kapitel**: Kombinieren, Licht/Dunkel, Zahlencode, Symbol-/Buchstabenschloss,
   ein Spezialrätsel mit eigener Oberfläche (Schachbrett, Bücherregal, Kalender …).
6. **Gestufte Hinweise** für jeden Zustand: erst Richtung, dann konkret, zuletzt die Lösung.
7. **Falsche Benutzung bekommt eigene, oft witzige Antworten** (`no`, `comboNo`) – mindestens für
   alle naheliegenden Versuche.
8. Ungefähr **8–14 Schritte pro Kapitel**, 10–20 Minuten Spielzeit. Kapitel 1 etwas leichter.
9. Jedes Kapitel endet mit einem **Erzähl-Moment** (`end`), der die Geschichte weitertreibt.

---

## 4. Bilder

Alle Bücher teilen sich denselben **gemalten Stil**, damit das Regal einheitlich wirkt.
Jedes Buch bekommt aber eine eigene Farbstimmung (steht im Buch-Konzept).

**Stil-Block** (an jeden Raum-Prompt anhängen, Farbstimmung anpassen):
```
Painterly digital illustration, richly detailed, slightly stylized realism like a high-end point-and-click
adventure game. Atmospheric lighting with warm light sources against deep cool shadows. No people, no text,
no letters, no UI. Portrait format 3:4.
```

| Bild | Format | Hinweise |
|---|---|---|
| Raum | 1086 × 1448 (3:4 hoch), `.jpg` | Alle wichtigen Objekte gut sichtbar und nicht zu klein; Ränder ruhig (Bildschirm-Ränder schneiden ab). Im Prompt jedes Rätsel-Objekt mit Position nennen („on the left wall …“). |
| Zustandsvariante | wie Raum | **Referenzbild: Original-Raum.** „Keep everything identical, only change …“ |
| Intro | ca. 600 × 800, `.jpg` | Stimmungsbild zum Kapitelanfang |
| Gegenstand (Icon) | quadratisch, `.png` mit transparentem Hintergrund, auf 192 px verkleinern | „single object, centered, transparent background, no shadow, no text“. ChatGPT malt oft ein **Karomuster** statt Transparenz – dann selbst freistellen (Flood-Fill der grauen/weißen, unbunten Pixel vom Rand aus). |
| Nahansicht | bis 480 px, `.webp` | Gleicher Gegenstand größer, ggf. mit Details (Gravur, Text auf Papier) |
| Spezialrätsel | je nach Oberfläche | z. B. Schachbrett schräg von oben, Regalfach frontal |
| Cover | 1086 × 1448 | Wird im Regal und auf der Buchseite gezeigt |
| Finale | ca. 724 × 965 | Schlussbild der Geschichte |

Texte, die im Bild lesbar sein müssen (Zahlen, Wörter, Symbole), **nicht** von der KI malen lassen,
sondern als SVG/HTML darüberlegen – sonst stimmen sie nicht und lassen sich nicht übersetzen.

---

## 5. Checkliste vor „Kapitel fertig“
- [ ] Rätselkette aufgeschrieben, jeder Gegenstand nötig, jede Lösung hat ≥ 2 Hinweise
- [ ] Hinweise für jeden Zustand, eigene `no`/`comboNo`-Texte
- [ ] Alle Zustände sichtbar im Bild (Overlay/Variante/Animation)
- [ ] Durchspiel-Skript läuft fehlerfrei, Bildschirmfotos geprüft (auch kleines Handy 360 × 640)
- [ ] Bilder optimiert (Raum-JPG ≲ 400 KB, Icons 192 px)
- [ ] Commit + Push, Android-Build grün, Nutzer informiert (APK-Link)
