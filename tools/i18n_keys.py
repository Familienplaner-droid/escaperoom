"""Sammelt alle deutschen Texte (Schlüssel) für die Übersetzung.
Aufruf: python3 tools/i18n_keys.py  ->  tools/keys_book.json, tools/keys_ui.json
Benötigt: npm i acorn acorn-walk (im Ordner /tmp oder global)."""
import json, subprocess, re
NOISE = re.compile(r'^(<img style=|polygon\(|reveal|scale\(|translate)')
def extract(f):
    subprocess.run(['node','tools/extract.mjs',f,'/tmp/_k.json'],check=True,capture_output=True)
    return [k for k in json.load(open('/tmp/_k.json')) if not NOISE.match(k)]
book = extract('www/books/villa-morgenrot/book.js')
src = open('www/books/villa-morgenrot/book.js').read()
items = re.findall(r"\bn:'([^']+)'", src) + re.findall(r"genre:'([^']+)'", src)
extra = ['November','Mo Di Mi Do Fr Sa So','Elena kommt heim!','Jeden Tag ein Strich. Nur ein Tag ist rot umkreist.',
         '„Hallo, Kapitänin“, sagt Opa Viktor leise.','Der Weg zum Meer – Elena','Tippe Bücher an, um sie herauszuziehen. Nach dem vierten Buch zeigt sich, ob die Reihenfolge stimmt.']
keys = list(dict.fromkeys(book + items + extra))
json.dump(keys, open('tools/keys_book.json','w'), ensure_ascii=False, indent=0)
ui = ['Escape-Bücher','Wähle eine Geschichte. Jede ist ein Rätselabenteuer zum Mitnehmen.','Von vorne beginnen','Weiter','Zur Kapitelübersicht',
 'Schließen','Tresor','Zurück','Öffnen','Hinweis','Abbrechen','Sprache','Zurück zum Bücherregal','Interessante Stellen zeigen','Ton an oder aus',
 'Mit <b>{0}</b> kommst du hier nicht weiter.','<b>{0}</b>? Das passt hier nicht.','Du probierst es mit <b>{0}</b>. Nichts passiert.',
 'Das ergibt keinen Sinn – <b>{0}</b> hilft hier nicht.','<b>{0}</b> ausgewählt. Tippe auf etwas im Raum oder auf einen anderen Gegenstand. Nochmal tippen zum Ansehen.',
 '<b>{0}</b> und <b>{1}</b> lassen sich nicht kombinieren.','Du ruckelst am Schloss. Es bleibt zu.','Hinweis {0} von {1}','{0} (gratis)',
 'Nächster Hinweis','Hinweis ansehen','Ein Hinweis pro Kapitel ist kostenlos.','{0}: kurze Werbung ansehen',
 'Steckst du fest? Hinweise kommen in Stufen: erst ein kleiner Schubs, am Ende die Lösung.','Nein danke',
 'Du hast hier schon alles untersucht. Vielleicht hilft einer deiner Gegenstände weiter?',
 'Tippe auf Dinge im Raum, um sie zu untersuchen. Manches kannst du mitnehmen.',
 'Gefundenes landet hier. Tippe einen Gegenstand an und danach auf eine Stelle im Raum, um ihn dort zu benutzen.',
 'Zwei Gegenstände kombinieren: ersten antippen, dann den zweiten. Denselben zweimal antippen zeigt ihn dir aus der Nähe.',
 'Die Lupe zeigt dir Stellen, die du noch nicht untersucht hast.',
 'Kommst du nicht weiter? Hier gibt es Hinweise – erst einen kleinen Schubs, ganz am Ende die Lösung.','Los geht’s','Willkommen zurück.',
 'Zeit: ca. {0} Min · Hinweise: {1}','Weiter zu {0}','Hier läuft später die Werbung (AdMob)',
 'Abgeschlossen','{0} von {1} Kapiteln','{0} Kapitel','Weitere Geschichten folgen','Bald im Regal','Spiel beginnen','Nochmal von vorne',
 'Weiterspielen – {0}','Noch verschlossen','Geschafft','Bereit','Schließe das vorherige Kapitel ab','Von vorne beginnen?',
 'Dein Fortschritt in diesem Buch wird gelöscht.','Ja, neu beginnen','Kapitel wechseln?','Dein Fortschritt im laufenden Kapitel geht verloren.','Kapitel starten']
json.dump(ui, open('tools/keys_ui.json','w'), ensure_ascii=False, indent=0)
print(len(keys),'Buch-Texte,',len(ui),'UI-Texte')
