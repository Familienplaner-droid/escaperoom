# Spielt Villa Morgenrot komplett durch und macht dabei Bildschirmfotos (1080×1920).
# Aufruf: im Zielordner  python3 tools/playtest.py http://localhost:8765/ <de|en|fr|es|pt>
from playwright.sync_api import sync_playwright
import sys
url=sys.argv[1]
LANG=sys.argv[2] if len(sys.argv)>2 else 'de'
BOOKS={'de':['Das Meer','Der Sturm','Das Licht','Der Turm'],'en':['The Sea','The Storm','The Light','The Tower'],'fr':['La Mer','La Tempête','La Lumière','La Tour'],'es':['El Mar','La Tormenta','La Luz','La Torre'],'pt':['O Mar','A Tempestade','A Luz','A Torre']}
WORD={'de':'MUT','en':'HOPE','fr':'FOI','es':'AMOR','pt':'AMOR'}[LANG]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':360,'height':640},device_scale_factor=3)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'fonts' not in m.text else None)
    pg.goto(url); pg.evaluate(f"localStorage.clear();localStorage.setItem('eb:lang','{LANG}')"); pg.reload(); pg.evaluate('window.__trMiss=new Set()'); pg.wait_for_timeout(800); pg.screenshot(path='f_lib.png')
    pg.click('.bk[data-k="0"]'); pg.wait_for_timeout(300); pg.screenshot(path='f_book.png')
    pg.click('#bPlay'); pg.wait_for_timeout(200); pg.screenshot(path='f_intro.png'); pg.click('#bIntro'); pg.wait_for_timeout(400)
    pg.screenshot(path='f_tut1.png')
    for k in range(5): pg.click('#tutNext'); pg.wait_for_timeout(350); pg.screenshot(path=f'f_tut{k+2}.png') if k in (0,3) else None
    pg.click('#bHint'); pg.wait_for_timeout(200); pg.click('#bHintGo'); pg.wait_for_timeout(200); pg.screenshot(path='f_hint.png'); pg.click('#bHintGo'); pg.wait_for_timeout(4200); pg.screenshot(path='f_hint2.png'); pg.click('#bNo')
    pg.click('.slot[data-i="zettel1"]'); pg.click('.slot[data-i="zettel1"]'); pg.wait_for_timeout(200); pg.screenshot(path='f_zettel.png')
    for m in pg.query_selector_all('.modal.on [data-close]'): m.click()
    def hot(i): pg.click(f'.h[data-id="{i}"]', force=True); pg.wait_for_timeout(120)
    def item(i): pg.click(f'.slot[data-i="{i}"]')
    def close():
        for m in pg.query_selector_all('.modal.on [data-close]'): m.click()
    def rings(moves):
        for k,n in moves:
            for _ in range(n): pg.click(f'#rings button[data-r="{k}"][data-d="1"]')
        pg.click('#bLockOpen'); pg.wait_for_timeout(300)
    R=[0]
    def nxt(): pg.wait_for_timeout(300); print(pg.inner_text('#endTitle')); pg.click('#bNext'); pg.wait_for_timeout(200); pg.click('#bIntro'); pg.wait_for_timeout(900); R[0]+=1; pg.screenshot(path=f'f_room{R[0]+1}.png')
    # K1
    hot('teppich'); print('RUG before glow:', pg.inner_text('#msg')[:40]); hot('buch'); hot('besteck'); hot('lampe'); pg.wait_for_timeout(200); pg.screenshot(path='f_dark.png'); hot('lampe'); hot('teppich'); item('schuerhaken'); hot('tuer'); print('NO:',pg.inner_text('#msg')); item('schuerhaken'); hot('diele')
    hot('globus'); hot('fernrohr'); pg.click('#bLook'); pg.wait_for_timeout(300); pg.screenshot(path='f_lupe.png')
    item('lampeLeer'); item('batterien'); item('lampe'); hot('kamin'); item('schuerhaken'); hot('kamin')
    item('messing'); hot('lade'); item('taschenuhr'); item('taschenuhr'); pg.wait_for_timeout(300); pg.screenshot(path='f_close.png'); close(); item('taschenuhr'); item('schuerhaken'); item('zahnrad'); hot('uhr'); pg.wait_for_timeout(300); close()
    hot('bild'); hot('tresor')
    for k in '0912': pg.click(f'#pad [data-k="{k}"]')
    pg.click('#pad [data-k="OK"]'); pg.wait_for_timeout(300)
    item('tuerschluessel'); hot('tuer'); pg.wait_for_timeout(2200); nxt()
    # K2
    hot('sessel'); hot('regalM'); pg.wait_for_timeout(200); close(); item('dame'); hot('schach'); pg.wait_for_timeout(200); pg.click('.sqHit[data-sq="d8"]'); pg.wait_for_timeout(1000); pg.screenshot(path='f_chess.png'); print('WHY:',pg.inner_text('.cMsg')); pg.wait_for_timeout(3200); pg.click('.sqHit[data-sq="e8"]'); pg.wait_for_timeout(1000); hot('leiter'); item('lampe'); hot('leiter')
    item('oel'); item('rostig'); item('geoelt'); hot('kaefig'); pg.wait_for_timeout(2600)
    item('vitrinenschluessel'); hot('vitrine'); hot('fernrohr'); pg.wait_for_timeout(200); close()
    hot('goldbuecher'); pg.wait_for_timeout(200)
    for t in BOOKS[LANG]: pg.click(f'.sBook[aria-label="{t}"]'); pg.wait_for_timeout(120)
    pg.wait_for_timeout(3600); nxt()
    # K3
    hot('leine'); hot('kasten'); item('schnur'); item('magnet'); item('magnetangel'); hot('pfuetze')
    item('kurbel'); hot('boot'); hot('boot'); pg.wait_for_timeout(200); close()
    hot('flasche'); item('streich'); hot('laterne'); hot('kiste'); item('flasche'); item('korkenzieher')
    hot('schloss'); pg.wait_for_timeout(200); 
    for k,n in [(0,1),(1,3),(2,5)]:
        for _ in range(n): pg.click(f'#rings button[data-r="{k}"][data-d="-1"]')
    pg.click('#bLockOpen'); pg.wait_for_timeout(3000); nxt()
    # K4
    hot('plane'); item('bootshaken'); hot('balken'); item('bootshaken'); hot('netz')
    item('hammer'); hot('schild'); hot('pinsel'); item('pinsel'); hot('fass'); item('teerpinsel'); item('kupfer')
    hot('naegel'); item('teerblech'); hot('boot'); item('hammer'); hot('boot'); hot('logbuch'); pg.wait_for_timeout(200); close()
    hot('schloss'); start=[11,4,14,18]; rings([(k,(ord(c)-65-start[k])%26) for k,c in enumerate(WORD)]); hot('winde'); pg.wait_for_timeout(300)
    item('messer'); hot('leine'); hot('boot'); pg.wait_for_timeout(2600); nxt()
    # K5
    hot('jacke'); hot('kanister'); item('feuerzeug'); item('kanister'); item('feuerzeugAn'); hot('wandlampe'); hot('wand'); pg.wait_for_timeout(300); pg.screenshot(path='f_kal.png'); close()
    hot('kiste'); pg.wait_for_timeout(300); pg.screenshot(path='f_kiste.png'); rings([(0,2),(1,6),(2,1),(3,1)])
    hot('werkzeug'); hot('trichter'); item('kanister'); item('trichter')
    item('zahnradGross'); hot('drehwerk'); item('zahnradKlein'); hot('drehwerk'); pg.wait_for_timeout(1300); pg.screenshot(path='f_zahn.png')
    item('kanisterT'); hot('brenner'); item('docht'); hot('brenner'); item('feuerzeugAn'); hot('brenner')
    hot('kurbel'); pg.wait_for_timeout(5600); pg.screenshot(path='f_opa.png'); pg.click('#dClose'); pg.wait_for_timeout(700)
    print(pg.inner_text('#endTitle'), '|', pg.inner_text('#endSoon')); pg.screenshot(path='f_end.png')
    pg.click('#bToBook'); pg.wait_for_timeout(300); pg.screenshot(path='f_book2.png')
    pg.click('#bBookBack'); pg.wait_for_timeout(300); pg.screenshot(path='f_lib2.png')
    miss=pg.evaluate("[...(window.__trMiss||[])]"); print('UNEXACT',len(miss)); [print('  ',m.replace(chr(10),' ')[:150]) for m in miss]; print('ERR',errs); b.close()
