# Spielt „Das Auge des Jaguars“ durch und macht Bildschirmfotos.
# Aufruf: im Zielordner  python3 tools/playtest_jaguar.py http://localhost:8765/ [de|en|fr|es|pt] [breite höhe]
from playwright.sync_api import sync_playwright
import sys
url=sys.argv[1]; LANG=sys.argv[2] if len(sys.argv)>2 else 'de'
VW,VH=(int(sys.argv[3]),int(sys.argv[4])) if len(sys.argv)>4 else (360,640)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':VW,'height':VH},device_scale_factor=3)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('response',lambda r: errs.append('404 '+r.url) if r.status==404 else None)
    pg.goto(url); pg.evaluate(f"localStorage.clear();localStorage.setItem('eb:lang','{LANG}');localStorage.setItem('eb:tutorial','1')"); pg.reload(); pg.evaluate('window.__trMiss=new Set()'); pg.wait_for_timeout(800)
    pg.screenshot(path='j_lib.png')
    pg.click('.bk[data-k="1"]'); pg.wait_for_timeout(300); pg.screenshot(path='j_book.png')
    pg.click('#bPlay'); pg.wait_for_timeout(2500); pg.screenshot(path='j_intro.png'); pg.click('#bIntro'); pg.wait_for_timeout(500)
    def hot(i): pg.click(f'.h[data-id="{i}"]', force=True); pg.wait_for_timeout(150)
    def item(i): pg.click(f'.slot[data-i="{i}"]'); pg.wait_for_timeout(60)
    def close():
        for m in pg.query_selector_all('.modal.on [data-close]'): m.click()
        pg.wait_for_timeout(150)
    def msg(t=''): print(t, pg.inner_text('#msg').replace('\n',' ')[:110])
    pg.screenshot(path='j_k1_dunkel.png')
    item('feldbuch'); item('feldbuch'); pg.wait_for_timeout(300); pg.screenshot(path='j_feldbuch.png'); close()
    # Abkürzungen prüfen
    hot('kiste'); msg('Kiste dunkel:'); hot('karte'); msg('Karte dunkel:'); hot('kissen'); msg('Kissen dunkel:')
    hot('mappe'); hot('blechkiste'); hot('dosen'); hot('becher')
    item('dose'); item('karbidlampe'); msg('Kombi-nein:')
    item('dose'); item('federmesser'); item('karbid'); item('karbidlampe')
    item('lampeK'); hot('leck'); msg('Lampe am Leck:')
    item('becher'); hot('leck'); item('lampeK'); item('becherW'); msg('Lampe:')
    pg.wait_for_timeout(300); pg.screenshot(path='j_k1_handlicht.png')
    item('karbidlampeAn'); hot('karte'); msg('Karte Handlicht:')
    item('karbidlampeAn'); hot('laterne'); pg.wait_for_timeout(400); pg.screenshot(path='j_k1_hell.png')
    hot('kissen'); item('seite1'); item('seite1'); pg.wait_for_timeout(300); pg.screenshot(path='j_seite1.png'); close()
    hot('karte'); pg.wait_for_timeout(400); pg.screenshot(path='j_karte.png'); close()
    hot('kiste'); pg.wait_for_timeout(200)
    for k in '1234': pg.click(f'#pad [data-k="{k}"]')
    pg.click('#pad [data-k="OK"]'); pg.wait_for_timeout(300); print('falscher Code, Tresor offen?', pg.is_visible('#mSafe.on'))
    for k in '4317': pg.click(f'#pad [data-k="{k}"]')
    pg.click('#pad [data-k="OK"]'); pg.wait_for_timeout(400); msg('Code:'); pg.screenshot(path='j_k1_kiste.png')
    hot('kiste'); msg('Inhalt:')
    pg.click('#bHint'); pg.wait_for_timeout(200); pg.click('#bHintGo'); pg.wait_for_timeout(200); pg.screenshot(path='j_hint.png'); pg.click('#bNo')
    item('feldbuch'); item('feldbuch'); pg.wait_for_timeout(200); close()
    item('roehre'); hot('funk'); pg.wait_for_timeout(1800); pg.screenshot(path='j_funk.png'); pg.click('#dClose'); pg.wait_for_timeout(900)
    print('ENDE:', pg.inner_text('#endTitle')); pg.screenshot(path='j_end.png')
    pg.click('#bNext'); pg.wait_for_timeout(2500); pg.screenshot(path='j_intro2.png')
    for _ in range(8):
        if pg.is_visible('.h[data-id="tuer"]'): break
        try: pg.click('#bIntro',timeout=1500)
        except Exception: pass
        pg.wait_for_timeout(500)
    # ===== Kapitel 2 =====
    pg.screenshot(path='j_k2_start.png')
    hot('tuer'); msg('Tür vorher:'); hot('relief'); msg('Relief vorher:')
    hot('rucksack'); hot('stumpf'); item('machete'); hot('lianen'); item('machete'); hot('stapel')
    item('kalebasse') if False else None
    hot('bruecke'); msg('Brücke kaputt:')
    item('liane'); hot('bruecke'); msg('Liane:'); hot('bruecke'); msg('Halb:')
    item('planken'); hot('bruecke2'); msg('Planken:')
    hot('nische'); item('kalebasse'); hot('wasser'); msg('Wasser oben:')
    item('kalebasse'); hot('treppe')
    item('kalebasseW'); hot('relief'); msg('Relief zu weit:')
    hot('bruecke'); msg('Rüber:'); pg.wait_for_timeout(300); pg.screenshot(path='j_k2_bruecke.png')
    item('kalebasseW'); hot('relief'); msg('Relief:')
    hot('relief'); pg.wait_for_timeout(300); pg.screenshot(path='j_relief.png'); close()
    hot('tuersturz'); pg.wait_for_timeout(300); pg.screenshot(path='j_sturz.png'); close()
    hot('tuer'); pg.wait_for_timeout(300); pg.screenshot(path='j_schloss.png')
    pg.click('#jPress'); pg.wait_for_timeout(300); msg('Falsch:')
    want=['fledermaus','jaguar','frosch','affe']; order=['jaguar','affe','tukan','schlange','frosch','fledermaus']
    hot('tuer'); pg.wait_for_timeout(200)
    for i,w in enumerate(want):
        for _ in range(6):
            cur=pg.get_attribute(f'.jDisc[data-i="{i}"] img','src').split('kopf_')[1].split('.')[0]
            if cur==w: break
            pg.click(f'.jDisc[data-i="{i}"]'); pg.wait_for_timeout(40)
    pg.screenshot(path='j_schloss2.png'); pg.click('#jPress'); pg.wait_for_timeout(700); msg('Tür:'); pg.screenshot(path='j_k2_offen.png')
    pg.wait_for_timeout(3000)
    print('ENDE2:', pg.inner_text('#endTitle'), '|', pg.inner_text('#endSoon')); pg.screenshot(path='j_end2.png')
    miss=pg.evaluate("[...(window.__trMiss||[])]"); print('UNEXACT',len(miss)); [print('  ',m.replace(chr(10),' ')[:150]) for m in miss[:20]]
    print('ERR',errs); b.close()
