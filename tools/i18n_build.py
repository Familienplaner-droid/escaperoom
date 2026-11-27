"""Baut die Übersetzungsdateien aus tools/tr/<sprache>.txt.
Zeilenformat:  <Nummer aus keys_ref.json>|Übersetzung   (Buchtexte)
               @<deutscher Text>|Übersetzung            (weitere Buchtexte)
               #<deutscher Text>|Übersetzung            (App-Oberfläche)
Aufruf: python3 tools/i18n_build.py en fr es pt"""
import json, sys, os
ref = json.load(open('tools/keys_ref.json'))
kb = json.load(open('tools/keys_book.json')); ku = json.load(open('tools/keys_ui.json'))
for lang in sys.argv[1:]:
    book, ui = {}, {}
    for line in open(f'tools/tr/{lang}.txt', encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip(): continue
        k, v = line.split('|', 1)
        if k[0] == '@': book[k[1:]] = v
        elif k[0] == '#': ui[k[1:]] = v
        else: book[ref[int(k)]] = v
    miss_b = [k for k in kb if k not in book]; miss_u = [k for k in ku if k not in ui]
    os.makedirs('www/books/villa-morgenrot/i18n', exist_ok=True); os.makedirs('www/i18n', exist_ok=True)
    json.dump(book, open(f'www/books/villa-morgenrot/i18n/{lang}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    json.dump(ui, open(f'www/i18n/{lang}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    # Platzhalter und HTML-Tags müssen erhalten bleiben
    bad = [k for k, v in {**book, **ui}.items() if sorted(__import__('re').findall(r'\{\d\}|</?[a-z]+', k)) != sorted(__import__('re').findall(r'\{\d\}|</?[a-z]+', v))]
    print(f'{lang}: {len(book)} Buch, {len(ui)} UI · fehlt: {len(miss_b)}+{len(miss_u)} · Tag-Abweichungen: {len(bad)}')
    for k in (miss_b + miss_u)[:10]: print('   FEHLT', k[:80])
    for k in bad[:10]: print('   TAGS ', k[:80])
