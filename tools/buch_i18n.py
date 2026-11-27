"""Übersetzungen für ein beliebiges Buch.

1) Schlüssel sammeln (nach jeder Textänderung im Buch erneut ausführen):
     python3 tools/buch_i18n.py keys <buch-ordner>
   -> tools/tr/<buch>/keys.json   (nummerierte Liste aller deutschen Texte; neue Texte kommen hinten dazu,
                                   bestehende Nummern bleiben gleich)
   -> tools/tr/<buch>/de.txt      (Vorlage zum Übersetzen: "Nummer|deutscher Text")

2) Übersetzen: tools/tr/<buch>/<sprache>.txt anlegen, Zeilenformat "Nummer|Übersetzung".
   Zeilen ohne Übersetzung weglassen. Kommentarzeilen beginnen mit "//".

3) Bauen und prüfen:
     python3 tools/buch_i18n.py build <buch-ordner> en fr es pt
   -> www/books/<buch>/i18n/<sprache>.json
   Meldet fehlende Texte und Abweichungen bei HTML-Tags oder Platzhaltern {0}.

Texte, die der Extraktor nicht findet (z. B. aus zusammengesetzten Strings), in
www/books/<buch>/i18n_extra.json als Liste eintragen. Voraussetzung: npm install (acorn).
"""
import json, os, re, subprocess, sys

NOISE = re.compile(r'^(<img style=|polygon\(|reveal|scale\(|translate)')
TAGS = re.compile(r'\{\d\}|</?[a-z]+')


def collect(buch):
    src_file = f'www/books/{buch}/book.js'
    subprocess.run(['node', 'tools/extract.mjs', src_file, '/tmp/_k.json'], check=True, capture_output=True)
    keys = [k for k in json.load(open('/tmp/_k.json')) if not NOISE.match(k)]
    src = open(src_file, encoding='utf-8').read()
    keys += re.findall(r"\bn:'([^']+)'", src) + re.findall(r"genre:'([^']+)'", src)
    extra = f'www/books/{buch}/i18n_extra.json'
    if os.path.exists(extra): keys += json.load(open(extra, encoding='utf-8'))
    return list(dict.fromkeys(keys))


def cmd_keys(buch):
    d = f'tools/tr/{buch}'; os.makedirs(d, exist_ok=True)
    path = f'{d}/keys.json'
    old = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else []
    new = [k for k in collect(buch) if k not in old]
    keys = old + new
    json.dump(keys, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    with open(f'{d}/de.txt', 'w', encoding='utf-8') as f:
        for i, k in enumerate(keys): f.write(f'{i}|{k}\n')
    print(f'{len(keys)} Texte ({len(new)} neu) -> {path}')


def cmd_build(buch, langs):
    keys = json.load(open(f'tools/tr/{buch}/keys.json', encoding='utf-8'))
    current = set(collect(buch))
    os.makedirs(f'www/books/{buch}/i18n', exist_ok=True)
    for lang in langs:
        out = {}
        for line in open(f'tools/tr/{buch}/{lang}.txt', encoding='utf-8'):
            line = line.rstrip('\n')
            if not line.strip() or line.startswith('//'): continue
            n, v = line.split('|', 1)
            out[keys[int(n)]] = v
        json.dump(out, open(f'www/books/{buch}/i18n/{lang}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        miss = [k for k in current if k not in out]
        bad = [k for k, v in out.items() if sorted(TAGS.findall(k)) != sorted(TAGS.findall(v))]
        print(f'{lang}: {len(out)} Texte · fehlt: {len(miss)} · Tag-Abweichungen: {len(bad)}')
        for k in miss[:15]: print('   FEHLT', keys.index(k), k[:90])
        for k in bad[:15]: print('   TAGS ', keys.index(k), k[:90])


if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] not in ('keys', 'build'): sys.exit(__doc__)
    cmd_keys(sys.argv[2]) if sys.argv[1] == 'keys' else cmd_build(sys.argv[2], sys.argv[3:])
