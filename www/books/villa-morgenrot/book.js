// Villa Morgenrot – Buch 1
// Jedes Buch ist eine Funktion, die die Engine-Schnittstelle (api) bekommt
// und Gegenstände, Kapitel (rooms) und Metadaten zurückgibt.
export default function villaMorgenrot(api){
const {S,give,take,has,say,sfx,tone,render,win,openLock,openSafe,openPaper,openPaperHTML,flash,cutStyle,room,dialog,closeDialog}=api;
const BASE='books/villa-morgenrot/img/';
const A=name=>BASE+name;
const W=1086, H=1448;
const img=src=>`<img src="${A(src)}" alt="">`;
/* ================= GEGENSTÄNDE ================= */

const ITEMS = {
 zettel1:{n:'Zettel',i:'nachricht.png',paper:['Ein zerknitterter Zettel','Mein liebes Mädchen,<br><br>hab keine Angst. Ich weiß, dass du dich an nichts erinnerst – nicht an dieses Haus und nicht an mich.<br><br>Ich habe dir einen Weg gebaut, Zimmer für Zimmer, so wie die Schatzsuchen, die du früher so geliebt hast. Am Ende wartet jemand auf dich.<br><br>Und denk daran, was ich dir immer gesagt habe: <b>Manche Dinge sieht man erst, wenn das Licht ausgeht.</b><br><br>– V.']},
 schuerhaken:{n:'Schürhaken',i:'poker.png',d:'Ein schwerer eiserner Schürhaken mit Messinggriff. Die Spitze ist gebogen und ziemlich dünn.'},
 lampeLeer:{n:'Taschenlampe (leer)',i:'lampeLeer.png',d:'Eine alte Taschenlampe. Das Batteriefach ist leer.'},
 batterien:{n:'Batterien',i:'batterien.png',d:'Zwei alte Batterien. Hoffentlich ist noch Saft drin.'},
 lampe:{n:'Taschenlampe',i:'lampe.png',d:'Sie leuchtet! Schwach, aber es reicht.'},
 messing:{n:'Messingschlüssel',i:'messing.png',d:'Ein kleiner, zierlicher Schlüssel. Zu klein für eine Tür.'},
 taschenuhr:{n:'Taschenuhr',i:'taschenuhr.png',d:()=>S.f.watch?'Die geöffnete Taschenuhr. Innen ist eingraviert: „Für V. – die Zeit gehört uns.“':'Eine alte, verkratzte Taschenuhr. Sie steht still. Der Rückdeckel klemmt fest – mit bloßen Fingern geht er nicht auf.'},
 zahnrad:{n:'Zahnrad',i:'zahnrad.png',d:'Ein feines Messingzahnrad. Zu groß für die Taschenuhr – es gehört in ein größeres Uhrwerk.'},
 tagebuch:{n:'Tagebuchseite',i:'tagebuch.png',paper:['Tagebuchseite','12. März<br><br>Heute kam meine kleine Elena zur Welt. Ich habe die große Standuhr in genau diesem Augenblick angehalten, ein Zahnrad herausgenommen und in meiner Taschenuhr versteckt. So hält die Uhr den Moment für immer fest – sobald sie wieder läuft, zeigt sie ihn.<br><br>Meinen Tresor habe ich auf genau diese Uhrzeit eingestellt.<br><br>– V.']},
 tuerschluessel:{n:'Türschlüssel',i:'tuerschluessel.png',d:'Ein großer, verschnörkelter Bartschlüssel aus Messing.'},
 foto:{n:'Altes Foto',i:'foto.webp',paper:['Altes Foto',img('foto_gross.webp')+'Der Leuchtturm von Morgenrot, in einer Sturmnacht. Auf der Rückseite, in zittriger Schrift:<br><br><b>„Für Elena. Wenn du das liest, bist du endlich zu Hause. – Opa Viktor“</b>']},
 dame:{n:'Weiße Dame',i:'dame.png',d:'Eine Schachfigur aus Elfenbein, die weiße Dame. Sie hat einen feinen Riss.'},
 rostig:{n:'Rostiger Aufziehschlüssel',i:'rostig.png',d:'Ein kleiner Aufziehschlüssel mit Flügelgriff. Völlig verrostet – der dreht sich keinen Millimeter.'},
 oel:{n:'Ölkännchen',i:'oel.png',d:'Ein Ölkännchen aus Messing. Es ist noch etwas Öl darin.'},
 geoelt:{n:'Geölter Aufziehschlüssel',i:'geoelt.png',d:'Frisch geölt glänzt der Aufziehschlüssel wieder. Jetzt sollte er sich drehen lassen.'},
 vitrinenschluessel:{n:'Vitrinenschlüssel',i:'vitrinenschluessel.png',d:'Ein zierlicher silberner Schlüssel. Auf dem Anhänger steht in Opas Schrift: „Vitrine“.'},
 schnur:{n:'Schnur',i:'schnur.png',d:'Ein Stück alte Hanfschnur, ein paar Meter lang.'},
 magnet:{n:'Hufeisenmagnet',i:'magnet.png',d:'Ein kräftiger Hufeisenmagnet. Er zieht alles aus Eisen an.'},
 magnetangel:{n:'Magnetangel',i:'magnetangel.png',d:'Magnet an einer Schnur. Damit kann man nach Eisen angeln.'},
 kurbel:{n:'Kurbel',i:'kurbel.png',d:'Eine eiserne Kurbel mit zwei Kugelenden, tropfnass. Sie sieht aus, als gehöre sie zu einem Schraubstock.'},
 streich:{n:'Streichhölzer',i:'streich.png',d:'Eine Schachtel Streichhölzer, in Wachspapier gewickelt. Trocken!'},
 korkenzieher:{n:'Korkenzieher',i:'korkenzieher.png',d:'Ein alter Korkenzieher mit Holzgriff.'},
 flasche:{n:'Flaschenpost',i:'flasche.png',d:'Eine grüne Flasche mit einer Papierrolle darin. Der Korken sitzt bombenfest – mit den Fingern geht er nicht heraus.'},
 nachricht:{n:'Opas Nachricht',i:'nachricht.png',paper:['Opas Nachricht','Elena,<br><br>hier unten haben wir jeden Winter an deinem kleinen Boot gebaut. Weißt du noch, wie du es genannt hast?<br><br>Den Weg zum Meer hast du selbst an die Wand gemalt. Aber du hast ihn immer <b>von hinten</b> gelesen – und bist dabei gehüpft wie über die Steine am Strand: <b>ein Zeichen nehmen, eins überspringen.</b> Drei Sprünge, dann warst du am Ziel.<br><br>Opa']},
 bootNah:{n:'Elenas Boot',i:'boot.webp',paper:['Elenas Boot',img('boot.webp').replace('<img','<img style="max-width:220px;margin:0 auto 10px"')+'Auf dem Rumpf steht in krakeliger Kinderschrift: <b>„Leo“</b>.<br><br>Leo … so hieß Opas alter Hund. Und du hast dein Boot nach ihm benannt. Die Erinnerung ist plötzlich da, warm und hell: ein großer, zotteliger Hund, der neben dir am Strand herläuft.']},
 bootshaken:{n:'Bootshaken',i:'bootshaken.png',d:'Eine lange Holzstange mit Messinghaken. Damit reicht man weit.'},
 hammer:{n:'Hammer',i:'hammer.png',d:'Ein alter Klauenhammer. Zum Einschlagen – und zum Herausziehen von Nägeln.'},
 naegel:{n:'Nägel',i:'naegel.png',d:'Eine Dose voller rostiger, aber stabiler Nägel.'},
 kupfer:{n:'Kupferschild',i:'kupfer.png',d:'Ein Kupferschild, etwas verbogen. Groß genug für das Loch im Boot – aber nicht wasserdicht.'},
 pinsel:{n:'Pinsel',i:'pinsel.png',d:'Ein alter Flachpinsel mit sauberen Borsten.'},
 teerpinsel:{n:'Teerpinsel',i:'teerpinsel.png',d:'Der Pinsel tropft vor schwarzem Teer.'},
 teerblech:{n:'Geteertes Blech',i:'teerblech.png',d:'Das Kupferschild, dick mit Teer bestrichen. Ein wasserdichter Flicken.'},
 messer:{n:'Seemannsmesser',i:'messer.png',d:'Ein Klappmesser mit Holzgriff. Die Klinge ist rostig, aber scharf.'},
 feuerzeug:{n:'Sturmfeuerzeug',i:'feuerzeug.png',d:'Opas altes Sturmfeuerzeug. Es funkt, aber es ist leer – kein Brennstoff.'},
 feuerzeugAn:{n:'Brennendes Feuerzeug',i:'feuerzeugAn.png',d:'Das Feuerzeug, frisch mit Petroleum gefüllt. Die Flamme flackert tapfer.'},
 kanister:{n:'Petroleumkanister',i:'kanister.png',d:'Ein schwerer Kanister, noch halb voll Petroleum. Die Öffnung ist breit.'},
 kanisterT:{n:'Kanister mit Trichter',i:'kanisterT.png',d:'Kanister und Trichter – damit kann man auch in kleine Öffnungen gießen.'},
 trichter:{n:'Trichter',i:'trichter.png',d:'Ein alter Blechtrichter mit Aufhängering.'},
 docht:{n:'Docht',i:'docht.png',d:'Ein neuer, breiter Lampendocht aus Baumwolle.'},
 zahnradGross:{n:'Großes Zahnrad',i:'zahnradGross.png',d:'Ein schweres Messingzahnrad mit sechs Speichen.'},
 zahnradKlein:{n:'Kleines Zahnrad',i:'zahnradKlein.png',d:'Ein kleines Stahlzahnrad mit eckigem Loch. Ölig.'},
 brief5:{n:'Opas letzter Brief',i:'brief5.png',paper:['Opas letzter Brief','Meine Elena,<br><br>du hast den ganzen Weg geschafft. Durch das Arbeitszimmer, wo du als Kind unter dem Schreibtisch Höhlen gebaut hast. Durch die Bibliothek, wo ich dir die Schatzinsel vorgelesen habe. Durch den Keller, wo Leo neben dir geschlafen hat, während wir am Boot gebastelt haben.<br><br>Erinnerungen sind wie ein Leuchtfeuer. Manchmal geht es im Sturm aus. Aber man kann es wieder anzünden.<br><br>Die getrocknete Blume ist vom Strand – du hast sie mir mit sechs Jahren geschenkt.<br><br>In Liebe,<br>dein Opa Viktor']},
 brief:{n:'Opas Brief',i:'brief.png',paper:['Opas Brief','Meine liebe Elena,<br><br>wenn du diese Zeilen liest, hat mein Plan funktioniert. Seit deinem Unfall erinnerst du dich an nichts – nicht an mich, nicht an Morgenrot, nicht an unsere Sommer am Leuchtturm.<br><br>Die Ärzte sagen, Erinnerungen kehren über Orte zurück. Also habe ich dir einen Weg gebaut, Zimmer für Zimmer, Rätsel für Rätsel – so wie früher, als du klein warst.<br><br>Hab keine Angst. Ich warte am Leuchtturm.<br><br>Den Weg nach unten kennst du: <b>… dann das Licht, und zuletzt der Turm.</b><br><br>Dein Opa Viktor']}
};
const desc=i=>typeof ITEMS[i].d==='function'?ITEMS[i].d():ITEMS[i].d;

/* ================= KAPITEL 1: ARBEITSZIMMER ================= */
const R1 = {
 title:'Das Arbeitszimmer', chapter:'Kapitel 1', img:A('room.jpg'), imgFor:f=>f.dark?A('room_dunkel.jpg'):A('room.jpg'), introImg:A('intro1.jpg'),
 intro:['Kopfschmerzen. Der Geruch von altem Papier und kaltem Rauch.','Du öffnest die Augen. Ein Arbeitszimmer, das du nie zuvor gesehen hast. Draußen rauscht das Meer.','Du weißt nicht, wie du hierhergekommen bist. Du weißt nicht einmal deinen Namen.','Die Tür ist verschlossen. Aber in deiner Hand steckt ein zerknitterter Zettel.'],
 onStart(){ give('zettel1'); },
 firstMsg:'In deiner Hand: ein <b>Zettel</b>. Tippe ihn unten im Inventar zweimal an, um ihn zu lesen.',
 comboNo:{'batterien+taschenuhr':'Eine mechanische Taschenuhr braucht keine Batterien.','messing+taschenuhr':'Die Uhr hat kein Schlüsselloch – nur einen Deckel, der klemmt.','lampe+taschenuhr':'Im Licht siehst du: Der Deckel ist nicht verschlossen, er klemmt nur.'},
 combos:[
  {a:'lampeLeer',b:'batterien',t:()=>{take('lampeLeer');take('batterien');give('lampe');return 'Du legst die Batterien ein. Klick – die Taschenlampe flackert auf!';}},
  {a:'taschenuhr',b:'schuerhaken',t:()=>{ if(S.f.watch) return 'Die Uhr ist schon offen.'; S.f.watch=1; give('zahnrad'); return 'Vorsichtig hebelst du mit der dünnen Spitze des Schürhakens den Rückdeckel auf. Ein <b>Zahnrad</b> fällt dir in die Hand!';}}
 ],
 cuts:[
  {r:[296,148,294,310],kind:'liftOff',origin:'50% 50%',clip:'polygon(9.5% .6%,99.3% 11.9%,90.5% 99.6%,0 90.6%)',on:f=>f.paint},
  {r:[700,444,43,174],kind:'swing',origin:'50% 0',on:f=>f.clock}
 ],
 code:'0912',
 onCode(){ S.f.safe=1; give('tuerschluessel'); give('foto'); return 'Der Tresor springt auf! Darin: ein <b>Türschlüssel</b> und ein <b>altes Foto</b>.'; },
 hot:[
  {id:'regal',r:[0,60,225,640],act:()=>'Bücher über Seefahrt, Leuchttürme und Navigation. Jemand hier hat das Meer geliebt.'},
  {id:'schiff',r:[82,160,120,85],act:()=>'Ein Buddelschiff. Auf dem winzigen Heck steht: <b>„Morgenrot“</b>.'},
  {id:'muschel',r:[118,268,70,65],act:()=>'Ein Nautilus. Er riecht noch ein bisschen nach Salz.'},
  {id:'sextant',r:[108,340,82,88],act:()=>'Ein Sextant aus Messing. Damit bestimmten Seeleute ihre Position an den Sternen.'},
  {id:'karte',r:[0,432,145,115],act:()=>'Eine alte Seekarte. Eine kleine Insel ist rot umkringelt, daneben ein winziger Leuchtturm.'},
  {id:'fernrohr',r:[55,610,90,60],act:()=>'Ein Fernrohr. Die Linse ist zerkratzt.'},
  {id:'bild',r:[296,148,294,310],vis:()=>!S.f.paint,no:{schuerhaken:'Ein Loch ins Gemälde? Lieber nicht.'},act(){ S.f.paint=1;sfx('slide');return 'Das Gemälde hängt schief. Als du es geraderücken willst, löst es sich vom Haken. Du hebst es ab und stellst es zur Seite – dahinter ist ein <b>Tresor</b>!';}},
  {id:'tresor',r:[340,195,215,235],vis:()=>S.f.paint,no:{schuerhaken:'Der Tresor ist aus dickem Stahl. Keine Chance.',messing:'Der Tresor hat kein Schlüsselloch – nur ein Zahlenschloss.',tagebuch:'Das Tagebuch verrät dir den Code nicht direkt. Aber es sagt dir, wo du suchen musst.'},act(){ if(S.f.safe) return 'Der Tresor ist leer.'; openSafe(); return 'Ein schwerer Tresor mit einem Zahlenschloss. Vier Ziffern.';}},
  {id:'kamin',r:[238,515,372,330],no:{lampeLeer:'Du knipst die Taschenlampe an … nichts. Ohne Batterien bleibt sie dunkel.'},act:()=>'Kalte Asche und verkohlte Scheite. Über der Feuerstelle gähnt der Schornstein, <b>stockdunkel</b>.'+(S.f.keySeen&&!S.f.key?' Oben glänzt der Schlüssel.':''),
    use:{lampe(){ if(S.f.key) return 'Nur Ruß und Spinnweben.'; S.f.keySeen=1;flash();sfx('click');return 'Im Lichtkegel blitzt etwas: Ein <b>Schlüssel</b> hängt an einem Haken im Schornstein. Viel zu hoch zum Greifen.';},
         schuerhaken(){ if(!S.f.keySeen) return 'Du stocherst in der Asche. Nichts. Es ist zu dunkel, um weiter oben etwas zu erkennen.'; if(S.f.key) return 'Da ist nichts mehr.'; S.f.key=1;give('messing');return 'Du angelst mit dem Haken nach oben – klirr! Ein kleiner <b>Messingschlüssel</b> fällt in die Asche.';}}},
  {id:'besteck',r:[558,600,80,245],act(){ if(!S.f.poker){S.f.poker=1;give('schuerhaken');return 'Du ziehst den <b>Schürhaken</b> aus dem Kaminbesteck.';} return 'Schaufel, Zange, Besen. Den Schürhaken hast du schon.';}},
  {id:'uhr',r:[645,212,148,625],no:{batterien:'Die Standuhr ist rein mechanisch. Batterien helfen hier nicht.',schuerhaken:'Im feinen Uhrwerk herumstochern? Dann ist es ganz kaputt.',taschenuhr:'Zwei Uhren – aber keine Antwort. Vielleicht steckt in der kleinen etwas, das der großen fehlt?'},act(){ if(S.f.clock){openClock(false);return 'Die Standuhr tickt wieder. Die Zeiger stehen auf <b>9:12</b>.';} return 'Eine prächtige Standuhr. Das Pendel hängt still, die Zeiger hängen schlaff herab. Durch die Glasscheibe siehst du: Im Uhrwerk <b>fehlt ein Zahnrad</b>.';},
    use:{zahnrad(){ S.f.clock=1;take('zahnrad');sfx('chime');openClock(true);return 'Das Zahnrad rastet ein. Das Pendel beginnt zu schwingen, die Zeiger wirbeln herum … und bleiben auf <b>9:12</b> stehen.';}}},
  {id:'tuer',r:[812,225,274,605],act:()=>'Eine massive Eichentür. <b>Verschlossen.</b> Das Schlüsselloch ist groß und alt.',
    no:{schuerhaken:'Die Tür aufbrechen? Massive Eiche. Da bricht eher der Schürhaken.',messing:'Viel zu klein für dieses große Schloss.',lampe:'Du leuchtest ins Schlüsselloch. Dahinter: nur Dunkelheit.',zettel1:'Du schiebst den Zettel unter der Tür durch … und ziehst ihn schnell wieder zurück. Du brauchst ihn noch.'},
    use:{tuerschluessel(){ S.f.door=1;take('tuerschluessel');sfx('door');setTimeout(win,1800);return 'Der Schlüssel dreht sich schwer im Schloss … die Tür schwingt knarrend auf. Warmes Licht fällt herein.';}}},
  {id:'pflanze',r:[975,450,111,440],act:()=>'Ein vertrockneter Gummibaum. Hier hat seit Monaten niemand mehr gegossen.'},
  {id:'teppich',r:[745,945,341,400],act(){ if(S.f.rug) return 'Ein schwerer Perserteppich. Die Ecke ist umgeschlagen.'; if(!S.f.glow) return 'Ein schwerer Perserteppich. Er riecht nach Staub und Pfeifentabak.'; S.f.rug=1;sfx('slide');return 'Genau dort, wo im Dunkeln das Kreuz geleuchtet hat, schlägst du die Ecke um. Darunter: ein <b>lockeres Dielenbrett</b>.';}},
  {id:'diele',r:[770,1020,95,100],vis:()=>S.f.rug,act:()=>S.f.board?'Ein leeres Loch im Boden.':'Das Brett wackelt, aber mit den Fingern bekommst du es nicht hoch. Du brauchst einen <b>Hebel</b>.',
    use:{schuerhaken(){ if(S.f.board) return 'Da ist nichts mehr.'; S.f.board=1;give('batterien');sfx('slide');return 'Du hebelst das Brett auf. Darunter liegen zwei <b>Batterien</b>!';}}},
  {id:'stuhl',r:[30,1180,500,268],act:()=>'Der Lederstuhl ist noch leicht eingedrückt. Hier hat jemand viele, viele Stunden gesessen.'},
  {id:'lade',r:[262,1084,440,86],act:()=>S.f.drawer?'Die Schublade ist leer.':'Die Schreibtischschublade ist abgeschlossen. Ein <b>kleines Messingschloss</b>.',
    no:{tuerschluessel:'Viel zu groß für das zierliche Schloss.',schuerhaken:'Aufbrechen? Dieses schöne alte Möbelstück? Irgendetwas in dir sträubt sich dagegen.'},
    use:{messing(){ S.f.drawer=1;take('messing');give('tagebuch');give('taschenuhr');sfx('unlock');return 'Klick! Die Schublade gleitet auf. Darin: eine <b>Tagebuchseite</b> und eine <b>Taschenuhr</b>.';}}},
  {id:'lampe',r:[10,700,220,270],act(){ S.f.dark=!S.f.dark;sfx('click'); if(S.f.dark&&!S.f.glow){ S.f.glow=1; return 'Klick. Nur noch Kerzenschein … und plötzlich <b>leuchtet etwas</b> schwach grünlich im Raum. Auf dem Teppich – und auf dem Globus!'; } return S.f.dark?'Klick. Nur noch Kerzenschein. Die grünlichen Zeichen leuchten wieder.':'Klick. Warmes, grünes Licht. Die leuchtenden Zeichen sind verschwunden.';}},
  {id:'grammo',r:[195,705,185,240],act(){ sfx('music');return 'Das Grammophon spielt eine knisternde Melodie. Sie kommt dir seltsam vertraut vor … als hättest du sie als Kind gehört.';}},
  {id:'globus',r:[450,752,132,200],act:()=>S.f.dark?'Auf dem Globus leuchtet eine winzige Insel, mit Leuchtfarbe nachgemalt. Daneben, kaum lesbar: <b>„Morgenrot – hier wohnt Elena im Sommer“</b>.':S.f.glow?'Bei Licht sieht man die Leuchtfarbe kaum – nur eine winzige Insel, sorgfältig umrandet.':'Ein alter Globus. Er dreht sich quietschend. Die Meere sind von Hand nachgezeichnet.'},
  {id:'buch',r:[62,962,198,82],act(){ if(!S.f.book){S.f.book=1;give('lampeLeer');sfx('slide');return 'Ein dickes Buch: „Leuchttürme der Nordsee“. Du schlägst es auf – es ist <b>hohl</b>! Darin liegt eine Taschenlampe.';} return 'Das hohle Buch ist leer.';}}
 ],
 hint(){ const f=S.f;
  if(!f.book) return ['Auf dem Schreibtisch liegt ein Buch, das merkwürdig leicht aussieht.','Tippe auf das dicke Buch vorne links auf dem Schreibtisch.'];
  if(!f.glow) return ['Lies Opas Zettel noch einmal. Was schreibt er über das Licht?','Manche Dinge sieht man erst im Dunkeln. Was spendet hier Licht?','Schalte die Schreibtischlampe aus: Tippe auf die Lampe und schau dich dann um.'];
  if(!f.poker) return ['Neben dem Kamin steht etwas Nützliches.','Nimm den Schürhaken aus dem Kaminbesteck.'];
  if(!f.rug) return ['Im Dunkeln hat etwas auf dem Teppich geleuchtet.','Tippe auf den Teppich, genau dort, wo das Kreuz war.'];
  if(!f.board) return ['Unter dem Teppich wackelt ein Brett.','Du brauchst einen Hebel. Der Schürhaken passt.','Wähle den Schürhaken und tippe auf das Dielenbrett.'];
  if(!has('lampe')&&!f.keySeen) return ['Die Taschenlampe braucht Strom.','Kombiniere Taschenlampe und Batterien im Inventar.'];
  if(!f.keySeen) return ['Wo im Raum ist es so dunkel, dass man eine Lampe braucht?','Leuchte mit der Taschenlampe in den Kamin.'];
  if(!f.key) return ['Der Schlüssel hängt zu hoch für deine Hände.','Etwas Langes mit einem Haken könnte helfen.','Benutze den Schürhaken am Kamin.'];
  if(!f.drawer) return ['Ein kleiner Schlüssel passt zu einem kleinen Schloss.','Die Schublade des Schreibtischs ist abgeschlossen.'];
  if(!f.watch) return ['Der Deckel der Taschenuhr klemmt.','Etwas Dünnes, Festes könnte ihn aufhebeln.','Kombiniere Taschenuhr und Schürhaken im Inventar.'];
  if(!f.clock) return ['Das Zahnrad ist zu groß für die Taschenuhr.','Wo im Raum steht ein großes Uhrwerk?','Benutze das Zahnrad an der Standuhr.'];
  if(!f.paint) return ['Hast du dir die Bilder im Raum genau angesehen?','Das Gemälde über dem Kamin hängt schief.'];
  if(!f.safe) return ['Opa hat den Tresor auf eine besondere Uhrzeit eingestellt.','Lies die Tagebuchseite. Welchen Moment meint Opa? Die Standuhr zeigt ihn dir.','Der Code lautet 0912.'];
  return ['Du hast den Türschlüssel.','Benutze ihn an der Tür.']; },
 end:['Kapitel 1 geschafft','Hinter der Tür liegt ein langer Flur im Kerzenlicht. Irgendwo tickt eine weitere Uhr. Und auf dem Foto stand ein Name, der sich anfühlt wie deiner: <b>Elena</b>. Aber warum hat dich dein Großvater hier eingeschlossen?'],
 ov(f){ return [`<defs>
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f777a"/><stop offset=".5" stop-color="#3f4547"/><stop offset="1" stop-color="#23282a"/></linearGradient>
  <radialGradient id="dial" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#c9b27a"/><stop offset="1" stop-color="#6b5428"/></radialGradient>
  <radialGradient id="face" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#c8b089"/><stop offset="1" stop-color="#a5875e"/></radialGradient>
  <linearGradient id="pendBg" x1="0" x2="1"><stop offset="0" stop-color="#1b1613"/><stop offset=".5" stop-color="#2a221c"/><stop offset="1" stop-color="#16110e"/></linearGradient>
  <radialGradient id="torch" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c0" stop-opacity=".75"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></radialGradient>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
 </defs>
 ${[['poker',f.poker,548,592,100,262],['book',f.book,28,950,275,112],['drawer',f.drawer,268,1066,414,128],['rug',f.rug,732,918,354,446]].filter(p=>p[1]).map(([n,,x,y,w,h])=>`<image href="${A('p_'+n+(f.dark?'_d':'')+'.webp')}" x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}
 ${f.board?`<path d="M783 1036 806 1033 848 1103 810 1109z" fill="#0a0604"/><path d="M783 1036 806 1033 810 1040 787 1043z" fill="#2a1a0e"/>`:''}
 ${f.paint?`<image href="${A((f.safe?'p_safeopen':'p_safe')+(f.dark?'_d':'')+'.webp')}" x="228" y="132" width="376" height="340"/>`:''}
 ${f.clock?`<g style="filter:brightness(${f.dark?.6:1})"><image href="${A('uhr_mini.webp')}" x="678" y="317" width="81" height="81"/>
  <image href="${A('uhr_stunde.webp')}" x="${718.5-3.05}" y="${357.5-22.3}" width="6.1" height="44.6" transform="rotate(276 718.5 357.5)"/>
  <image href="${A('uhr_minute.webp')}" x="${718.5-2.6}" y="${357.5-34.15}" width="5.2" height="68.3" transform="rotate(72 718.5 357.5)"/></g>`:''}
 ${f.keySeen&&!f.key?`<g transform="rotate(20 430 612)"><path d="M430 586v14" stroke="#555" stroke-width="2"/><circle cx="430" cy="606" r="6" fill="none" stroke="#e0b04f" stroke-width="3"/><path d="M430 612v16M430 622h7M430 627h5" stroke="#e0b04f" stroke-width="3"/></g><circle class="glint" cx="436" cy="604" r="5" fill="#fff6d0"/>`:''}
 <ellipse id="gFlash" cx="425" cy="660" rx="120" ry="110" fill="url(#torch)" opacity="0"/>
 `,
 `<defs>
  <radialGradient id="cand"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
  <radialGradient id="lampG" cx="120" cy="800" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd48a" stop-opacity=".22"/><stop offset="1" stop-color="#ffd48a" stop-opacity="0"/></radialGradient>
  <linearGradient id="hall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd890"/><stop offset=".6" stop-color="#c77f35"/><stop offset="1" stop-color="#4a2a12"/></linearGradient>
  <linearGradient id="beamF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".45"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></linearGradient>
 </defs>
 ${f.door?`<path d="M842 272h203v556H842z" fill="url(#hall)"/><path d="M842 272 800 250v600l42-22z" fill="#3a2010"/><path d="M842 828h203l41 172H700z" fill="url(#beamF)"/>`:''}
 ${f.dark?`
  <defs><filter id="glowF" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <g filter="url(#glowF)" stroke="#b8ffcf" stroke-width="5" stroke-linecap="round" fill="none" class="flicker">${f.rug?'':'<path d="M805 972l36 30M841 972l-36 30"/>'}<circle cx="528" cy="846" r="7" fill="#b8ffcf" stroke-width="2"/><circle cx="528" cy="846" r="15" stroke-width="2"/></g>`:`<rect width="${W}" height="${H}" fill="url(#lampG)" class="flicker"/>`}
 <circle cx="279" cy="436" r="46" fill="url(#cand)" class="flicker"/><circle cx="581" cy="436" r="46" fill="url(#cand)" class="flicker" style="animation-delay:-1.3s"/>`]; }
};

/* ================= KAPITEL 2: BIBLIOTHEK ================= */
const BOOKS=[ {t:'Die Insel',r:[340,392,18,98]},{t:'Das Licht',r:[403,398,29,92]},{t:'Der Turm',r:[433,398,29,92]},{t:'Das Meer',r:[463,398,30,92]},{t:'Der Sturm',r:[495,398,33,92]},{t:'Der Hafen',r:[562,392,18,98]} ];
const BOOK_ORDER=['Das Meer','Der Sturm','Das Licht','Der Turm'];
const R2 = {
 title:'Die Bibliothek', chapter:'Kapitel 2', img:A('bibliothek.jpg'), introImg:A('intro2.jpg'), keep:['lampe','foto'],
 intro:['Der Flur endet an einer schweren Doppeltür. Dahinter: eine Bibliothek, so hoch, dass die Regale im Dunkeln verschwinden.','Durch das Fenster siehst du ihn – den Leuchtturm aus dem Gemälde. Dort oben brennt Licht.','Hinter dir fällt die Tür ins Schloss. Natürlich.'],
 comboNo:{'dame+rostig':'Eine Schachfigur und ein Schlüssel. Hübsch, aber nutzlos zusammen.','brief+lampe':'Du leuchtest durch den Umschlag … Lesen geht leichter, wenn du ihn einfach öffnest.'},
 combos:[
  {a:'oel',b:'rostig',t:()=>{ take('oel'); take('rostig'); give('geoelt'); return 'Du träufelst Öl auf den rostigen Schlüssel und reibst ihn ab. Er glänzt wieder!'; }}
 ],
 cuts:[
  {r:[520,920,330,250],kind:'reveal',src:A('bib_zustand.jpg'),on:f=>f.fach},
  {r:[755,555,280,210],kind:'reveal',src:A('bib_zustand.jpg'),on:f=>f.vitrine},
  {r:[285,60,370,880],kind:'reveal slow',src:A('bib_gang.jpg'),on:f=>f.door},
  {r:[958,762,112,165],kind:'puff',origin:'50% 100%',on:f=>f.sing}
 ],
 hot:[
  {id:'regalL',r:[0,0,250,720],act:()=>'Reiseberichte, Seemannsgarn, Schiffsregister. Auf einem Buchrücken steht mit Kinderschrift: „Elenas Buch – Finger weg!“'},
  {id:'oben',r:[0,30,130,120],act:()=>'Das oberste Regal. Viel zu hoch – und völlig im Dunkeln.'},
  {id:'leiter',r:[118,120,205,800],act(){ if(S.f.oel) return 'Oben ist nur noch Staub. Und kleine Fußabdrücke im Staub … wie von Kinderschuhen.'; return 'Du kletterst die Leiter hinauf. Das oberste Regal liegt <b>stockdunkel</b> vor dir – du siehst die Hand vor Augen nicht.';},
    use:{lampe(){ if(S.f.oel) return 'Da oben ist nichts mehr.'; S.f.oel=1; flash(90,95); give('oel'); return 'Du kletterst hinauf und leuchtest ins oberste Regal. Zwischen Spinnweben steht ein kleines <b>Ölkännchen</b>.';}}},
  {id:'buste',r:[358,148,62,85],act:()=>'Eine Büste aus Bronze. Ein strenger Herr mit Locken. Jemand hat ihm einen Schnurrbart aufgemalt – mit Bleistift.'},
  {id:'sphaere',r:[452,152,100,125],act:()=>'Eine Armillarsphäre. Die Ringe zeigen die Bahnen der Sterne. Sie lässt sich drehen, aber nichts passiert.'},
  {id:'goldbuecher',r:[335,388,250,108],no:{lampe:'Im Licht erkennst du die Titel: „Die Insel“, „Das Licht“, „Der Turm“, „Das Meer“, „Der Sturm“, „Der Hafen“.'},vis:()=>!S.f.door,act(){ if(!S.f.vitrine) return 'Vier Bücher mit prächtiger Goldprägung, dazwischen ganz normale. Du versuchst eins herauszuziehen – es sitzt <b>bombenfest</b>, als wäre es von hinten verriegelt.'; openBooks(); return 'Die Bücher lassen sich jetzt ein Stück herausziehen. Aber in welcher Reihenfolge?';}},
  {id:'regalM',r:[292,280,100,100],vis:()=>!S.f.door,act(){ openPaperHTML('Schach für Kapitäne','Zwischen Büchern über Leuchtfeuer steckt ein dünnes Heft. Eine Seite hat ein Eselsohr:<br><br><b>Das Grundreihenmatt</b><br>Ein König, der sich hinter seinen eigenen Bauern versteckt, hat keine Luft zum Atmen. Ein Schach auf seiner letzten Reihe – und es ist vorbei.<br><br>Aber Vorsicht: Bewacht ein Springer oder ein Läufer das Feld, wird deine Dame einfach geschlagen.<br><br><i>Am Rand, mit Bleistift:</i> „Elena hat das mit acht Jahren besser gekonnt als ich. V.“'); return 'Ein Heft über Schach, mit Eselsohr.'; }},
  {id:'globus',r:[302,505,95,115],act:()=>'Ein kleiner Globus. Die Insel Morgenrot ist mit einem Kreuz markiert.'},
  {id:'flaschen',r:[428,565,62,52],act:()=>'Zwei Fläschchen mit Sand. Auf den Etiketten: „Strand, 2009“ und „Strand, 2010“.'},
  {id:'truhe',r:[498,640,90,62],act:()=>'Eine kleine Truhe. Leer – bis auf eine getrocknete Seesternhälfte.'},
  {id:'fenster',r:[700,70,232,410],act:()=>'Draußen tobt das Meer. Auf der Klippe steht der Leuchtturm. Sein Lichtstrahl streicht über das Wasser, immer wieder.'},
  {id:'vorhang',r:[935,0,151,640],act:()=>'Schwere Samtvorhänge. Sie riechen nach Salz und Staub.'},
  {id:'fernrohr',r:[608,470,170,465],act(){ openScope([900,280,110,110],`<g transform="translate(40 100) scale(.55)"><path d="M-3 0v-12a3 3 0 0 1 6 0V0z" fill="#050608"/><circle cy="-15" r="2.4" fill="#050608"/><circle cx="5" cy="-8" r="2" fill="#ffd27a" class="glint"/><circle cx="5" cy="-8" r="6" fill="#ffd27a" opacity=".25" class="glint"/></g>`,'Am Fuß des Leuchtturms steht eine Gestalt mit einer Laterne. Sie schwenkt das Licht – dreimal. Als würde sie dich grüßen.'); return 'Du blickst durchs Fernrohr zum Leuchtturm …'; }},
  {id:'vitrine',r:[757,555,250,380],no:{rostig:'Der Aufziehschlüssel passt nicht in das Schloss der Vitrine.',geoelt:'Der Aufziehschlüssel passt nicht in das Schloss der Vitrine.',lampe:'Du leuchtest hinein: Ganz hinten liegt ein Umschlag mit deinem Namen. „Für Elena“.'},act:()=>S.f.vitrine?'Muscheln, Korallen, ein Ammonit. Den Brief hast du schon.':'Eine Vitrine mit Muscheln, Korallen und Fossilien. Ganz hinten liegt ein <b>Briefumschlag</b>. Die Glastür ist <b>abgeschlossen</b>.',
    use:{vitrinenschluessel(){ S.f.vitrine=1; take('vitrinenschluessel'); give('brief'); sfx('unlock'); return 'Der kleine Schlüssel passt. Die Glastür schwingt auf – du nimmst den <b>Brief</b> heraus. Auf dem Umschlag steht: „Für Elena“. Im selben Moment klickt es im mittleren Bücherregal – als hätte sich ein Riegel gelöst.';}}},
  {id:'kaefig',r:[922,630,164,360],no:{vitrinenschluessel:'Viel zu zierlich für das Aufzieh-Loch.',oel:'Ein paar Tropfen in das Aufzieh-Loch … aber drehen musst du schon selbst. Mit einem Schlüssel.',dame:'Du hältst dem Papagei die Dame hin. Er schaut dich mit Glasaugen an. Keine Reaktion.'},act:()=>S.f.parrot?(sfx('music'),'Der Papagei summt leise … die Melodie vom Grammophon aus dem Arbeitszimmer! Dein Herz klopft. Du kennst sie. Von früher.'):'Ein mechanischer <b>Papagei</b> aus Messing in einem goldenen Käfig. In seinem Rücken ist ein kleines <b>Schlüsselloch zum Aufziehen</b>.',
    use:{rostig(){ sfx('no'); return 'Der Schlüssel passt, aber er ist so verrostet, dass er sich keinen Millimeter drehen lässt.';},
         geoelt(){ S.f.parrot=1; S.f.sing=1; take('geoelt'); sfx('parrot'); setTimeout(()=>{S.f.sing=0;render();},3000);
           setTimeout(()=>{ give('vitrinenschluessel'); },2200);
           return 'Ratsch-ratsch-ratsch. Der Papagei plustert sich auf und krächzt: <b>„Krrrk! Erst das Meer, dann der Sturm … Krrrk!“</b> Dann fällt ihm ein kleiner <b>Schlüssel</b> aus dem Schnabel.';}}},
  {id:'stuhlmeer',r:[690,860,110,80],act:()=>'Mondlicht malt das Fensterkreuz auf den Boden.'},
  {id:'sessel',r:[0,715,450,570],act(){ if(!S.f.sessel){ S.f.sessel=1; give('dame'); return 'Du tastest zwischen die Polster des Ohrensessels … und ziehst eine Schachfigur hervor: die <b>weiße Dame</b>.';} return 'Ein abgewetzter Ohrensessel. Eine Decke liegt darüber, als hätte gerade noch jemand hier gelesen.';}},
  {id:'oellampe',r:[40,820,95,240],act:()=>'Eine Öllampe. Sie brennt – jemand hat sie vor Kurzem angezündet.'},
  {id:'tisch',r:[0,1015,190,385],act:()=>'Auf dem Beistelltisch liegt ein abgegriffenes Buch: „Die Schatzinsel“. Eine Widmung: „Vorlesen, bis sie einschläft. V.“'},
  {id:'schach',r:[463,945,397,395],act(){ if(S.f.fach) return 'Die weiße Dame steht auf e8. Schachmatt. Das Geheimfach steht offen.'; openChess(false); return 'Eine angefangene Schachpartie. Unter dem Brett klemmt ein Zettel: <b>„Weiß zieht und setzt matt. Setz die Dame richtig – dann öffnet sich der Tisch. V.“</b> Die weiße Dame fehlt.'; },
    no:{rostig:'Ein Schlüsselloch suchst du am Schachtisch vergeblich.',lampe:'Im Licht siehst du: Unter der Tischkante ist eine feine Fuge. Da ist ein Fach!'},
    use:{dame(){ if(S.f.fach) return 'Die Dame steht schon.'; openChess(true); return 'Wohin mit der Dame? Opas Zettel: „Weiß zieht und setzt matt.“'; }}}
 ],
 hint(){ const f=S.f;
  if(!f.sessel) return ['Jemand hat hier vor Kurzem gelesen. Vielleicht ist dabei etwas verloren gegangen.','Tippe auf den Ohrensessel und taste zwischen die Polster.'];
  if(!f.fach) return ['Auf dem Schachtisch klemmt ein Zettel. Was verlangt Opa?','Im mittleren Regal steckt ein Heft über Schach. Lies die Seite mit dem Eselsohr.','Der schwarze König steht auf g8, eingesperrt von seinen Bauern. Springer und Läufer bewachen b8, c8, a8 und d8.','Setz die Dame auf e8. Schachmatt.'];
  if(!f.oel) return ['Ganz oben im linken Regal ist es stockdunkel.','Nimm Licht mit auf die Leiter.','Wähle die Taschenlampe und tippe auf die Leiter.'];
  if(has('rostig')) return ['Der Aufziehschlüssel ist völlig verrostet.','Rost löst sich mit Öl.','Kombiniere Ölkännchen und rostigen Schlüssel im Inventar.'];
  if(!f.parrot) return ['Wer hat hier ein Schlüsselloch zum Aufziehen?','Der mechanische Papagei im Käfig.'];
  if(!f.vitrine) return ['Der kleine Schlüssel hat einen Anhänger. Was steht darauf?','Er passt zur Vitrine unter dem Fenster.'];
  return ['Der Papagei kennt den Anfang des Reims, Opas Brief das Ende.','Lies den Brief und erinnere dich an den Papagei. Welche vier Bücher passen dazu?','Zieh im mittleren Regal: Das Meer, Der Sturm, Das Licht, Der Turm.']; },
 end:['Kapitel 2 geschafft','Das Regal schwingt zur Seite. Dahinter windet sich eine steinerne Treppe in die Tiefe. Kalte, salzige Luft steigt herauf – und irgendwo dort unten rauscht das Meer.<br><br>Opa Viktor wartet am Leuchtturm. Und du erinnerst dich: An einen Sommer. An eine Stimme, die vorliest.'],
 ov(f){ return [`<defs>
  <radialGradient id="torch" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c0" stop-opacity=".8"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></radialGradient>
  <radialGradient id="stair" cx=".5" cy=".85" r=".8"><stop offset="0" stop-color="#e09a4a"/><stop offset=".45" stop-color="#4a2a14"/><stop offset="1" stop-color="#090605"/></radialGradient>
 </defs>
 <ellipse id="gFlash" cx="90" cy="95" rx="120" ry="90" fill="url(#torch)" opacity="0"/>`,
 `<defs>
  <radialGradient id="oilG" cx="88" cy="925" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
  <linearGradient id="beamL" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></linearGradient>
  <clipPath id="win"><path d="M712 260q0-180 145-190 145 10 145 190v390H712z"/></clipPath>
 </defs>
 <g clip-path="url(#win)"><path class="beam" d="M967 343 380 270v150z" fill="url(#beamL)"/></g>
 <circle cx="967" cy="343" r="16" fill="#fff6d8" opacity=".7" class="flicker"/>
 <rect width="${W}" height="${H}" fill="url(#oilG)" class="flicker"/>`]; }
};

/* ================= KAPITEL 3: KELLER ================= */
const SYM=['Anker','Stern','Möwe','Fisch','Muschel','Leuchtturm'];
const SYM_SVG={
 Anker:'<circle cx="20" cy="8" r="4"/><path d="M20 12v22M12 17h16M7 24q2 11 13 11 11 0 13-11"/>',
 Stern:'<path d="M20 4l4.7 10 10.8 1.2-8 7.3 2.3 10.7L20 27.8 10.2 33.2l2.3-10.7-8-7.3 10.8-1.2z"/>',
 'Möwe':'<path d="M3 15q9-6 17 7 8-13 17-7"/><path d="M18 22l2 3 2-3"/>',
 Fisch:'<path d="M6 20q10-11 22 0-12 11-22 0zM28 20l8-7v14z"/><circle cx="12" cy="18" r="1.4"/>',
 Muschel:'<path d="M20 34L6 16q14-14 28 0zM20 34V12M20 34l-8-17M20 34l8-17"/>',
 Leuchtturm:'<path d="M15 36l2.5-22h5L25 36zM16 14h8v-5h-8zM20 9V5M24 11l9-4M16 11l-9-4"/>'
};
const symIcon=(s,sz=40)=>`<svg viewBox="0 0 40 40" width="${sz}" height="${sz}" fill="none" stroke="#efe4cf" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${SYM_SVG[s]}</svg>`;
const LOCK_CODE=['Möwe','Stern','Anker'];
const R3 = {
 title:'Der Keller', chapter:'Kapitel 3', img:A('keller.jpg'), keep:['lampe','foto'],
 soon:'Kapitel 4: Das Bootshaus – kommt bald',
 onStart(){ S.inv=S.inv.map(i=>i==='lampe'?'lampeLeer':i); },
 intro:['Die Wendeltreppe führt tief hinab. Es riecht nach Salz, Moos und altem Holz.','Auf der letzten Stufe flackert die Taschenlampe – und erlischt. Die Batterien sind leer.','Nur der Mond scheint durch ein vergittertes Fenster. Irgendwo hinter einem Gittertor rauscht das Meer.'],
 combos:[
  {a:'schnur',b:'magnet',t:()=>{ take('schnur'); take('magnet'); give('magnetangel'); return 'Du knotest die Schnur fest um den Magneten. Fertig ist eine <b>Magnetangel</b>!'; }},
  {a:'flasche',b:'korkenzieher',t:()=>{ take('flasche'); take('korkenzieher'); give('nachricht'); return 'Du drehst den Korkenzieher hinein – plopp! Mit spitzen Fingern ziehst du die Papierrolle aus der Flasche: eine <b>Nachricht von Opa</b>.'; }}
 ],
 cuts:[ {r:[258,392,292,585],kind:'hingeL',origin:'0 50%',on:f=>f.gate} ],
 hot:[
  {id:'treppe',r:[70,30,200,270],act:()=>'Die Wendeltreppe nach oben. Das Regal hat sich hinter dir wieder geschlossen – zurück geht es nicht.'},
  {id:'tor',r:[258,392,292,585],vis:()=>!S.f.gate,act:()=>'Ein schweres Gittertor. Dahinter ein Tunnel, aus dem kalte Meeresluft weht. Ein großes <b>Vorhängeschloss</b> hält es verschlossen.'},
  {id:'schloss',r:[440,655,80,100],vis:()=>!S.f.gate,act(){ if(!S.f.lit) return 'Zu dunkel. Du ertastest <b>drei Drehringe</b> mit eingravierten Zeichen, aber erkennen kannst du nichts.'; openLock({title:'Das Vorhängeschloss',vals:SYM,show:x=>symIcon(x,44),code:LOCK_CODE,start:[3,4,5],ok(){ S.f.gate=1; sfx('door'); say('Klack! Das Schloss springt auf. Das Gittertor schwingt quietschend zur Seite.'); render(); setTimeout(win,2600); }}); return 'Drei Drehringe mit Symbolen. Erst wenn alle richtig stehen, springt das Schloss auf.'; }},
  {id:'fenster',r:[920,45,130,210],act:()=>'Ein kleines vergittertes Fenster. Der Mond steht genau dahinter. Draußen hörst du die Brandung.'},
  {id:'weinregal',r:[0,150,245,530],act:()=>'Staubige Weinflaschen, manche älter als du. Auf einem Etikett: „Für Elenas Hochzeit – nicht vorher öffnen!“'},
  {id:'flasche',r:[48,492,115,60],act(){ if(!S.f.flasche){ S.f.flasche=1; give('flasche'); return 'Eine Flasche liegt anders als die anderen. Darin steckt eine <b>Papierrolle</b>! Du nimmst die <b>Flaschenpost</b>. Der Korken sitzt fest.'; } return 'Leere Fächer, viele Spinnweben.'; }},
  {id:'werkzeug',r:[0,690,200,300],act:()=>'Zangen, Hammer, Säge, Stechbeitel – alles ordentlich an seinem Platz. Opa war gründlich.'},
  {id:'boot',r:[200,808,178,290],act(){
    if(!S.f.vise) return 'Ein kleines Holzboot steckt fest im <b>Schraubstock</b>. Die <b>Kurbel</b> des Schraubstocks fehlt – so bekommst du ihn nicht auf.';
    if(!S.f.streich){ S.f.streich=1; openPaper('bootNah'); give('streich'); return 'Unter dem Rumpf ist ein kleines Fach. Darin, in Wachspapier gewickelt: <b>Streichhölzer</b> – trocken!'; }
    openPaper('bootNah'); return 'Leo. Natürlich.'; },
   use:{kurbel(){ S.f.vise=1; take('kurbel'); sfx('unlock'); return 'Die Kurbel passt! Du drehst den Schraubstock auf und hebst das kleine Boot heraus. Tippe es an, um es dir genauer anzusehen.'; }}},
  {id:'hobel',r:[10,1020,240,120],act:()=>'Ein Hobel, eine Dose mit Nägeln, frische Holzspäne. Als hätte hier gestern noch jemand gearbeitet.'},
  {id:'tuch',r:[0,1140,215,290],act:()=>'Ein altes Leinentuch, voller Farbkleckse in Rot und Blau. Die Farben vom Boot.'},
  {id:'kiste',r:[195,1222,130,226],act(){ if(!S.f.lit) return 'Unter der Werkbank ist es <b>pechschwarz</b>. Du traust dich nicht, blind hineinzugreifen.'; if(!S.f.kork){ S.f.kork=1; give('korkenzieher'); return 'Im Laternenlicht siehst du es: In der Kiste unter der Werkbank liegt ein <b>Korkenzieher</b>.'; } return 'Holzreste und ein paar krumme Nägel.'; }},
  {id:'seil',r:[360,1250,68,135],act:()=>'Ein dickes Schiffstau. Völlig verrottet und viel zu schwer.'},
  {id:'saeule',r:[555,270,175,810],act:()=>'Eine dicke Steinsäule, feucht und kühl. Moos wächst am Sockel.'},
  {id:'laterne',r:[622,300,100,245],act:()=>S.f.lit?'Die Laterne brennt ruhig und warm.':'Eine alte <b>Petroleumlaterne</b>. Es schwappt noch Petroleum darin. Du bräuchtest etwas zum <b>Anzünden</b>.',
   use:{streich(){ S.f.lit=1; take('streich'); sfx('unlock'); return 'Ritsch – das Streichholz flammt auf. Die Laterne fängt Feuer, warmes Licht flutet den Keller. Und an der Wand neben der Säule erscheint etwas: eine <b>Kreidezeichnung</b>!';},
        lampeLeer(){ return 'Die Taschenlampe ist tot. Hier hilft nur Feuer.'; }}},
  {id:'marken',r:[595,545,70,230],act:()=>'Kleine Kerben in der Säule, jede mit Datum: „Elena, 5 J.“ – „6 J.“ – „7 J.“ … die letzte ganz oben: „Elena, 12 J.“ Du legst die Hand darauf. Sie passt genau unter die Kerbe.'},
  {id:'leine',r:[712,368,374,72],vis:()=>!S.f.schnur,act(){ S.f.schnur=1; give('schnur'); return 'Du knotest die Wäscheleine los und wickelst die <b>Schnur</b> auf.'; }},
  {id:'wand',r:[732,440,160,235],act:()=>S.f.lit?'Eine Kinderzeichnung in Kreide: ein Weg aus sechs Zeichen, mit Pfeilen verbunden. Oben <b>Muschel → Anker → Fisch</b>, dann ein Pfeil nach unten, und unten zurück: <b>Stern → Leuchtturm → Möwe</b>. Darunter: „Der Weg zum Meer – von Elena“.':'Die Wand liegt im Schatten.'},
  {id:'glaeser',r:[895,425,191,240],act:()=>'Einmachgläser. Auf einem Etikett in Kinderschrift: „Brombeermarmelade – Elena &amp; Opa“.'},
  {id:'rad',r:[770,680,316,350],act:()=>'Opas altes Fahrrad. Am Lenker klebt ein verblasster Aufkleber: ein Seepferdchen.'},
  {id:'kasten',r:[745,945,175,132],act(){ if(!S.f.magnet){ S.f.magnet=1; give('magnet'); return 'Du klappst die Werkzeugkiste auf. Zwischen Schrauben und Nägeln: ein <b>Hufeisenmagnet</b>. An ihm klebt eine ganze Traube Nägel.'; } return 'Schrauben, Nägel, ein Zollstock.'; }},
  {id:'pfuetze',r:[715,1095,371,280],act:()=>S.f.kurbel?'Dunkles, eiskaltes Wasser. Ganz still.':'In der überfluteten Ecke glänzt <b>etwas Metallisches</b> unter Wasser. Es ist eiskalt und tiefer als gedacht – mit der Hand kommst du nicht heran.',
   use:{magnetangel(){ if(S.f.kurbel) return 'Da unten ist nichts mehr.'; S.f.kurbel=1; take('magnetangel'); give('kurbel'); sfx('slide'); return 'Du lässt die Magnetangel ins Wasser hinab … klack! Etwas bleibt hängen. Du ziehst eine tropfnasse eiserne <b>Kurbel</b> heraus.'; },
        magnet(){ return 'Der Magnet würde es anziehen – aber du müsstest dafür ins eiskalte Wasser greifen. Gäbe es nur eine Möglichkeit, ihn hinabzulassen …'; }}}
 ],
 hint(){ const f=S.f;
  if(!f.schnur||!f.magnet) return !f.schnur?'Die Wäscheleine an der Wand könnte nützlich sein.':'Schau in die Werkzeugkiste.';
  if(!f.kurbel&&!has('magnetangel')) return 'Schnur und Magnet ergeben zusammen ein Werkzeug. Kombiniere sie im Inventar.';
  if(!f.kurbel) return 'In der Pfütze liegt etwas aus Eisen. Angle danach.';
  if(!f.vise) return 'Die Kurbel gehört zum Schraubstock an der Werkbank.';
  if(!f.streich) return 'Sieh dir das kleine Boot genauer an.';
  if(!f.lit) return 'Mit den Streichhölzern kannst du die Laterne an der Säule anzünden.';
  if(!f.kork) return 'Im Licht kannst du endlich unter die Werkbank schauen.';
  if(!has('nachricht')) return 'Öffne die Flaschenpost mit dem Korkenzieher.';
  if(!f.hint3){ f.hint3=1; return 'Folge dem Weg an der Wand rückwärts, so wie Opa es beschreibt: ein Zeichen nehmen, eins überspringen.'; }
  return 'Rückwärts gelesen: Möwe, Leuchtturm, Stern, Fisch, Anker, Muschel. Jedes zweite davon: Möwe, Stern, Anker.'; },
 end:['Kapitel 3 geschafft','Das Schloss springt auf. Quietschend schwingt das Gittertor zur Seite. Der Tunnel führt abwärts, das Rauschen wird lauter – und am Ende schimmert Licht.<br><br>Ein Bootshaus. Und darin, du bist ganz sicher: das große Boot, das ihr damals zusammen bauen wolltet.'],
 ov(f){ return [`<defs><filter id="chalk"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter>
  <radialGradient id="tun" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#ffd890" stop-opacity=".7"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient></defs>
 ${f.gate?`<ellipse cx="405" cy="700" rx="110" ry="160" fill="url(#tun)" class="flicker"/>`:''}
 ${f.schnur?`<image href="${A('k_ohneleine.jpg')}" x="700" y="360" width="386" height="110"/>`:''}
 ${f.kurbel?`<image href="${A('k_ohnezahnrad.jpg')}" x="880" y="1218" width="100" height="100"/>`:''}
 ${f.lit?`<g filter="url(#chalk)" fill="none" stroke="#efe9da" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" opacity=".85">
   ${[['Muschel',740,444],['Anker',792,444],['Fisch',844,444],['Stern',844,524],['Leuchtturm',792,524],['Möwe',740,524]].map(([n,x,y])=>`<g transform="translate(${x} ${y})" stroke-width="2.8">${SYM_SVG[n]}</g>`).join('')}
   <path d="M781 464h9M786 460l4 4-4 4M833 464h9M838 460l4 4-4 4"/>
   <path d="M864 488v28M860 512l4 5 4-5"/>
   <path d="M842 544h-9M837 540l-4 4 4 4M790 544h-9M785 540l-4 4 4 4"/>
   <path d="M742 606q11-8 22 0t22 0 22 0 22 0 22 0 22 0"/>
   <text x="752" y="652" font-family="Comic Sans MS,cursive" font-size="26" fill="#efe9da" stroke="none">ELENA</text></g>`:''}`,
 `<defs>
  <radialGradient id="dk" cx="160" cy="160" r="1100" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#02060c" stop-opacity="0"/><stop offset=".25" stop-color="#02060c" stop-opacity=".35"/><stop offset="1" stop-color="#02060c" stop-opacity=".62"/></radialGradient>
  <radialGradient id="lan" cx="676" cy="470" r="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".5"/><stop offset=".4" stop-color="#ffb35a" stop-opacity=".15"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
 </defs>
 ${f.lit?`<rect width="${W}" height="${H}" fill="#02060c" opacity=".12"/><rect width="${W}" height="${H}" fill="url(#lan)" class="flicker"/><ellipse cx="676" cy="468" rx="14" ry="22" fill="#ffe6a8" opacity=".9" class="flicker"/>`
  :`<rect width="${W}" height="${H}" fill="url(#dk)"/>`}`]; }
};
/* ================= KAPITEL 4: BOOTSHAUS ================= */
const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
const ABC=Object.keys(MORSE);
const R4 = {
 title:'Das Bootshaus', chapter:'Kapitel 4', img:A('bootshaus.jpg'), keep:['foto'],
 soon:'Kapitel 5: Der Leuchtturm – kommt bald',
 intro:['Der Tunnel wird breiter, die Luft salziger. Dann stehst du auf knarrenden Planken: Opas Bootshaus.','Im Wasser schaukelt ein kleines Segelboot. Du weißt es sofort: Das habt ihr zusammen gebaut.','Durchs Fenster siehst du den Leuchtturm. Sein Licht blinkt – aber nicht gleichmäßig. Als würde es dir etwas sagen.'],
 combos:[ {a:'teerpinsel',b:'kupfer',t:()=>{ take('teerpinsel'); take('kupfer'); give('teerblech'); return 'Du streichst das Kupferschild dick mit Teer ein. Jetzt ist es ein wasserdichter Flicken: <b>geteertes Blech</b>.'; }} ],
 cuts:[ {r:[295,340,490,362],kind:'lift',clip:'polygon(0 0,44.2% 0,44.2% 99.8%,50.2% 99.8%,50.2% 0,100% 0,100% 100%,0 100%)',on:f=>f.gate} ],
 hot:[
  {id:'tor',r:[295,340,490,430],act:()=>S.f.gate?'Das Wassertor ist offen. Dahinter: die Bucht, der Mond – und der Leuchtturm.':'Ein riesiges hölzernes Wassertor. Dahinter liegt das offene Meer. Ketten führen von den Torflügeln hinauf zur Decke – und hinüber zur <b>Winde</b>.'},
  {id:'wasser',r:[175,760,180,270],act:()=>'Schwarzes, kaltes Wasser. Es schwappt leise gegen die Planken.'},
  {id:'boot',r:[355,700,345,300],act(){ const f=S.f;
    if(f.leck&&f.gate&&f.cut){ S.f.sail=1; sfx('door'); setTimeout(win,2200); return 'Du steigst ins Boot, stößt dich vom Steg ab … und gleitest hinaus aufs Meer. Richtung Leuchtturm.'; }
    const miss=[]; if(!f.leck) miss.push(f.blech?'Der Flicken liegt nur lose auf dem Loch – er muss noch <b>festgenagelt</b> werden.':'Am Bug klafft ein <b>Loch im Rumpf</b>. So würdest du sinken.');
    if(!f.cut) miss.push('Das Boot ist mit einer dicken Leine am Poller <b>festgemacht</b>.'); if(!f.gate) miss.push('Und das <b>Wassertor</b> ist zu.');
    return 'Euer Boot. Auf der Bank ist ein Herz eingeritzt: „E + Opa“. '+miss.join(' '); },
   use:{ teerblech(){ S.f.blech=1; take('teerblech'); return 'Du drückst das geteerte Blech auf das Loch. Es passt genau – aber es hält noch nicht.'; },
         kupfer(){ return 'Das Blech würde das Loch abdecken – aber es ist nicht wasserdicht. Da fehlt etwas, das abdichtet.'; },
         naegel(){ return S.f.blech?'Nägel hast du – aber womit willst du sie einschlagen?':'Erst brauchst du etwas, das das Loch abdeckt.'; },
         hammer(){ if(!S.f.blech) return 'Mit dem Hammer allein flickst du kein Loch.'; if(!has('naegel')) return 'Du brauchst noch <b>Nägel</b>, um den Flicken festzumachen.'; S.f.leck=1; take('naegel'); sfx('unlock'); return 'Tock, tock, tock – Nagel um Nagel schlägst du den Flicken fest. Das Leck ist dicht!'; } }},
  {id:'balken',r:[495,28,190,85],vis:()=>!S.f.hammer,act:()=>'Oben auf dem Dachbalken liegt ein <b>Hammer</b>. Viel zu hoch zum Greifen.',
   use:{ bootshaken(){ S.f.hammer=1; give('hammer'); sfx('slide'); return 'Du stocherst mit dem Bootshaken nach oben – der Hammer kippt, fällt … und du fängst ihn auf!'; } }},
  {id:'laterneL',r:[170,180,75,140],act:()=>'Eine Petroleumlaterne. Sie brennt – jemand war vor Kurzem hier.'},
  {id:'laterneR',r:[828,180,75,140],act:()=>'Noch eine brennende Laterne. Opa wusste, dass du kommst.'},
  {id:'schild',r:[42,292,175,122],vis:()=>!S.f.schild,act:()=>'Ein altes <b>Kupferschild</b>, an vier Ecken festgenagelt. Die Schrift ist längst verwittert. Mit bloßen Händen bekommst du es nicht ab.',
   use:{ hammer(){ S.f.schild=1; give('kupfer'); sfx('slide'); return 'Mit der Klaue des Hammers hebelst du die Nägel heraus. Das <b>Kupferschild</b> gehört dir.'; } }},
  {id:'netz',r:[0,410,200,230],act:()=>S.f.messer?'Ein altes Fischernetz voller Löcher.':'Ein altes Fischernetz. Weit oben hat sich etwas darin verheddert – es blitzt metallisch. Zu hoch und zu verknotet für deine Hände.',
   use:{ bootshaken(){ if(S.f.messer) return 'Da hängt nichts mehr drin.'; S.f.messer=1; give('messer'); sfx('slide'); return 'Du hakst den Bootshaken ins Netz und ziehst kräftig. Etwas fällt klappernd auf die Planken: ein <b>Seemannsmesser</b>.'; } }},
  {id:'ruder',r:[222,430,85,400],act:()=>'Zwei alte Ruder. Auf einem steht in Kinderschrift: „Kapitänin Elena“.'},
  {id:'tau',r:[185,565,62,230],act:()=>'Aufgerolltes Tauwerk. Sauber aufgeschossen, wie Opa es dir beigebracht hat.'},
  {id:'regal',r:[0,555,185,240],act:()=>'Farbdosen, Lack, Werkzeug. Alles riecht nach Teer und Salz.'},
  {id:'pinsel',r:[84,668,62,108],vis:()=>!S.f.pinsel,act(){ S.f.pinsel=1; give('pinsel'); return 'Du nimmst den <b>Pinsel</b> aus dem Regal. Die Borsten sind trocken und sauber.'; }},
  {id:'naegel',r:[0,722,78,72],act(){ if(!S.f.naegelGenommen){ S.f.naegelGenommen=1; give('naegel'); return 'Eine Dose voller <b>Nägel</b>. Die kannst du brauchen.'; } return 'Die Dose ist leer.'; }},
  {id:'fass',r:[8,820,172,272],act:()=>'Ein Fass voll zähem, schwarzem <b>Teer</b>. Es riecht scharf. Mit den Fingern willst du da nicht hineinfassen.',
   use:{ pinsel(){ take('pinsel'); give('teerpinsel'); return 'Du tauchst den Pinsel tief in den Teer. Jetzt tropft er schwarz und glänzend: ein <b>Teerpinsel</b>.'; },
         kupfer(){ return 'Ins Fass tauchen? Dann klebst du selbst fest. Besser mit etwas auftragen.'; } }},
  {id:'fenster',r:[893,256,175,238],act(){ openScope([960,300,110,110],`<circle class="morse" cx="64" cy="51" r="7" fill="#fff6d0"/><circle class="morse" cx="64" cy="51" r="22" fill="#fff6d0" opacity=".35"/>`,'Das Leuchtfeuer blinkt: kurz und lang, in einem Muster, das sich immer wiederholt. Dazwischen eine lange Pause.','Der Leuchtturm'); return 'Du beobachtest das Licht des Leuchtturms. Kurz … lang … Pause … Es ist ein Muster!'; }},
  {id:'winde',r:[800,505,286,392],act(){ if(S.f.gate) return 'Die Winde steht still. Das Tor ist oben.'; if(!S.f.lock) return 'Eine schwere Seilwinde für das Wassertor. Die Kette ist mit einem <b>Buchstabenschloss</b> gesichert – so lässt sich die Kurbel nicht drehen.'; S.f.gate=1; sfx('door'); return 'Du stemmst dich gegen die Kurbel. Kette um Kette rasselt auf die Trommel … und das Wassertor hebt sich! Kalte Seeluft strömt herein.'; }},
  {id:'schloss',r:[855,715,80,92],vis:()=>!S.f.lock,act(){ openLock({title:'Das Buchstabenschloss',vals:ABC,show:c=>`<span style="font:700 34px/1 Georgia,serif;color:#f2b35b">${c}</span>`,code:['M','U','T'],start:[11,4,14],ok(){ S.f.lock=1; say('Klick! Das Schloss springt auf, die Kette ist frei. Jetzt kannst du die Winde drehen.'); render(); }}); return 'Ein Schloss mit drei Buchstabenringen.'; }},
  {id:'leine',r:[555,850,245,220],act:()=>S.f.cut?'Nur noch ein Stummel hängt am Bug.':'Eine dicke Leine hält das Boot am Poller. Der Knoten ist nass, verquollen und bombenfest.',
   use:{ messer(){ S.f.cut=1; sfx('slide'); return 'Mit ein paar kräftigen Schnitten ist die Leine durch. Das Boot treibt ein Stück vom Steg weg.'; } }},
  {id:'plane',r:[0,1095,650,330],act(){ if(!S.f.plane){ S.f.plane=1; give('bootshaken'); sfx('slide'); return 'Du schlägst die Plane zurück. Darunter liegt ein langer <b>Bootshaken</b>.'; } return 'Eine alte Segeltuchplane. Darunter nur noch Staub.'; }},
  {id:'tisch',r:[835,1090,251,358],act:()=>'Ein wackeliger Hocker-Tisch. Auf der Kante: Kerben, wie die Striche einer Strichliste.'},
  {id:'logbuch',r:[866,962,220,128],act(){ openLog(); return 'Opas Logbuch. Der letzte Eintrag ist von gestern.'; }}
 ],
 hint(){ const f=S.f;
  if(!f.plane) return 'Unter der Plane im Vordergrund liegt etwas Langes.';
  if(!f.hammer) return 'Der Bootshaken reicht bis zum Dachbalken hinauf.';
  if(!f.messer) return 'Im Fischernetz hat sich etwas verheddert. Auch dafür ist der Bootshaken gut.';
  if(!f.schild) return 'Das Kupferschild an der Wand wäre ein guter Flicken. Der Hammer hat eine Klaue.';
  if(!has('teerpinsel')&&!has('teerblech')&&!f.blech) return 'Das Blech muss wasserdicht werden. Tauche den Pinsel ins Teerfass.';
  if(has('teerpinsel')) return 'Kombiniere den Teerpinsel mit dem Kupferschild.';
  if(!f.leck) return f.blech?'Jetzt den Flicken mit Hammer und Nägeln festmachen. Die Nägel stehen im Regal.':'Leg das geteerte Blech auf das Loch im Boot.';
  if(!f.lock){ if(!f.h4){ f.h4=1; return 'Beobachte das Licht des Leuchtturms durchs Fenster. Opas Logbuch hilft beim Übersetzen.'; } return 'Das Licht morst: – –  |  · · –  |  –  … das ergibt M, U, T.'; }
  if(!f.gate) return 'Das Schloss ist offen. Dreh die Winde.';
  if(!f.cut) return 'Die Leine ist zu fest verknotet. Schneide sie durch.';
  return 'Alles bereit. Steig ins Boot!'; },
 end:['Kapitel 4 geschafft','Das kleine Boot gleitet hinaus in die Bucht. Der Mond malt einen silbernen Weg aufs Wasser. Vor dir blinkt der Leuchtturm – und jetzt verstehst du jedes Zeichen: <b>M – U – T</b>.<br><br>Am Fuß des Leuchtturms schwenkt jemand eine Laterne. Du winkst zurück.'],
 ov(f){ return [`<defs>
  <linearGradient id="nightSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1a2e"/><stop offset=".55" stop-color="#1c3550"/><stop offset=".56" stop-color="#0b2233"/><stop offset="1" stop-color="#06131c"/></linearGradient>
  <radialGradient id="moonG"><stop offset="0" stop-color="#fffbe8"/><stop offset="1" stop-color="#fffbe8" stop-opacity="0"/></radialGradient>
 </defs>
 ${f.gate?`<rect x="300" y="345" width="480" height="425" fill="url(#nightSea)"/>
  <circle cx="420" cy="430" r="40" fill="url(#moonG)" opacity=".6"/><circle cx="420" cy="430" r="14" fill="#fffbe8"/>
  <path d="M420 585v180" stroke="#fffbe8" stroke-width="10" stroke-dasharray="6 9" opacity=".35"/>
  <path d="M640 585l20-8 40 2 25 6z" fill="#0a1218"/><path d="M684 580l4-52h8l4 52z" fill="#d9d2c0"/><path d="M685 552h14M686 565h12" stroke="#b33b2e" stroke-width="5"/>
  <circle class="morse" cx="692" cy="524" r="5" fill="#fff6d0"/><circle class="morse" cx="692" cy="524" r="16" fill="#fff6d0" opacity=".35"/>
  ${[[340,380],[372,402],[455,372],[600,395],[640,370],[730,410],[760,388]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.4" fill="#fff" opacity=".7"/>`).join('')}
  <clipPath id="mastClip"><rect x="511" y="340" width="30" height="432"/><path d="M352 775Q378 698 520 694Q664 698 704 775Z"/></clipPath><image href="${A('bootshaus.jpg')}" x="0" y="0" width="${W}" height="${H}" clip-path="url(#mastClip)"/>`:''}
 ${f.hammer?`<image href="${A('b_hammer.jpg')}" x="490" y="25" width="200" height="90"/>`:''}
 ${f.schild?`<image href="${A('b_schild.jpg')}" x="30" y="282" width="200" height="140"/>`:''}
 ${f.plane?`<image href="${A('b_stange.jpg')}" x="525" y="1225" width="130" height="90"/>`:''}
 ${f.cut?`<image href="${A('b_leine.jpg')}" x="530" y="780" width="220" height="260"/>`:''}
 ${f.blech?`<image href="${A('teerblech.png')}" x="446" y="862" width="92" height="46" transform="rotate(-12 492 885)"/>`:''}
 ${f.leck?[[456,876],[528,866],[460,902],[530,892]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#c9b27a"/>`).join(''):''}`,
 `<defs><radialGradient id="lantG"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".45"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient></defs>
 <circle cx="207" cy="262" r="90" fill="url(#lantG)" class="flicker"/><circle cx="866" cy="262" r="90" fill="url(#lantG)" class="flicker" style="animation-delay:-1.1s"/>
 <circle class="morse" cx="1025" cy="352" r="9" fill="#fff6d0"/><circle class="morse" cx="1025" cy="352" r="28" fill="#fff6d0" opacity=".35"/>`]; }
};
/* ================= KAPITEL 5: LEUCHTTURM ================= */
const KAL_CODE=['2','6','1','1'];
function kalender(){
 let g='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;font:600 14px/1 ui-monospace,monospace;font-style:normal;text-align:center">'+['Mo','Di','Mi','Do','Fr','Sa','So'].map(d=>`<span style="opacity:.6">${d}</span>`).join('')+'<span></span><span></span><span></span><span></span><span></span>';
 for(let d=1;d<=30;d++){ g+= d<26?`<span style="position:relative;padding:5px 0;color:#7a6a52">${d}<i style="position:absolute;left:10%;right:10%;top:50%;border-top:2px solid #6b2a1a;transform:rotate(-20deg)"></i></span>`
  : d===26?`<span style="padding:5px 0;color:#a3221a;font-weight:800;outline:2px solid #a3221a;border-radius:50%">${d}</span>`:`<span style="padding:5px 0">${d}</span>`; }
 return g+'</div>';
}
const R5 = {
 title:'Der Leuchtturm', chapter:'Kapitel 5', img:A('leuchtturm.jpg'), keep:['foto'],
 soon:'Ende. Danke fürs Spielen!', endImg:A('finale.jpg'), last:true,
 intro:['Das Boot schrammt gegen die Felsen. Du springst an Land, der Wind reißt an deinen Haaren.','Die Tür des Leuchtturms steht offen. Du steigst die Wendeltreppe hinauf, Stufe um Stufe, bis ganz nach oben.','Doch der Laternenraum ist dunkel. Das Leuchtfeuer ist im Sturm erloschen. Und von Opa keine Spur.'],
 combos:[
  {a:'feuerzeug',b:'kanister',t:()=>{ take('feuerzeug'); give('feuerzeugAn'); return 'Du träufelst etwas Petroleum in das Feuerzeug. Ratsch – eine kleine, tapfere Flamme!'; }},
  {a:'feuerzeug',b:'kanisterT',t:()=>{ take('feuerzeug'); give('feuerzeugAn'); return 'Du füllst etwas Petroleum ins Feuerzeug. Ratsch – es brennt!'; }},
  {a:'kanister',b:'trichter',t:()=>{ take('kanister'); take('trichter'); give('kanisterT'); return 'Du steckst den Trichter auf den Kanister. Jetzt kannst du gießen, ohne zu kleckern.'; }}
 ],
 cuts:[],
 hot:[
  {id:'sturm',r:[780,130,300,320],act:()=>'Draußen tobt der Sturm. Blitze zucken über dem Wasser. Kein Schiff würde heute Nacht ohne Licht sicher heimfinden.'},
  {id:'villa',r:[232,330,110,95],act:()=>'Drüben auf der Klippe: die Villa Morgenrot. In einem einzigen Fenster brennt Licht – im Arbeitszimmer.'},
  {id:'meer',r:[232,430,120,200],act:()=>'Die Wellen schlagen gegen die Felsen. Unten schaukelt euer kleines Boot.'},
  {id:'jacke',r:[0,270,152,560],act(){ if(!S.f.jacke){ S.f.jacke=1; give('feuerzeug'); return 'Opas Seemannsjacke. Sie riecht nach Pfeifentabak und Salz – nach ihm. In der Tasche steckt ein <b>Sturmfeuerzeug</b>.'; } return 'Die Mütze mit dem goldenen Anker. Opa hat sie immer schief getragen.'; }},
  {id:'wandlampe',r:[108,160,135,145],act:()=>S.f.lit?'Die kleine Wandlampe brennt warm und ruhig.':'Eine kleine Wandlampe aus Messing. Sie ist aus. Es ist so dunkel, dass du kaum etwas erkennst.',
   use:{ feuerzeugAn(){ if(S.f.lit) return 'Sie brennt schon.'; S.f.lit=1; sfx('unlock'); return 'Die Wandlampe flammt auf. Warmes Licht fällt in den Raum – und an der Wand daneben hängt ein <b>Kalender</b>.'; },
         feuerzeug(){ sfx('no'); return 'Ratsch, ratsch – nur Funken. Das Feuerzeug ist leer, es braucht Brennstoff.'; } }},
  {id:'wand',r:[150,320,82,180],act(){ if(!S.f.lit) return 'An der Wand hängt etwas Helles. Im Dunkeln kannst du es nicht erkennen.'; openPaperHTML('Opas Kalender','<div style="text-align:center;font:700 20px Georgia,serif;font-style:normal;margin-bottom:8px">November</div>'+kalender()+'<br>Jeden Tag ein Strich. Nur ein Tag ist rot umkreist. Daneben, in Opas Schrift: <b>„Elena kommt heim!“</b>'); return 'Opas Kalender.'; }},
  {id:'kanister',r:[284,760,100,200],vis:()=>!S.f.kan,act(){ S.f.kan=1; give('kanister'); return 'Ein schwerer <b>Petroleumkanister</b>. Er gluckert – noch gut halb voll.'; }},
  {id:'trichter',r:[966,440,100,140],vis:()=>!S.f.tri,act(){ S.f.tri=1; give('trichter'); return 'Du nimmst den <b>Trichter</b> vom Haken.'; }},
  {id:'linse',r:[350,90,440,450],act:()=>S.f.fire?'Das Leuchtfeuer brennt. Die Linse bündelt die Flamme zu einem gewaltigen Strahl.':'Die riesige Linse des Leuchtfeuers. In ihrer Mitte sitzt der Brenner.'},
  {id:'brenner',r:[505,295,130,240],act(){ const f=S.f; if(f.fire) return 'Die Flamme brennt hell und ruhig.'; const m=[]; m.push(f.tank?'Der Tank ist voll.':'Der Tank ist <b>leer</b>.'); m.push(f.wick?'Ein neuer Docht steckt im Brenner.':'Der Docht ist <b>verkohlt</b> und zerfällt bei Berührung.'); return 'Der Brenner des Leuchtfeuers. '+m.join(' '); },
   use:{ kanister(){ return 'Die Einfüllöffnung ist winzig. Ohne Trichter würdest du alles verschütten – und Petroleum neben einer Flamme ist keine gute Idee.'; },
         kanisterT(){ if(S.f.tank) return 'Der Tank ist schon voll.'; S.f.tank=1; sfx('slide'); return 'Gluck, gluck, gluck – durch den Trichter füllst du den Tank bis zum Rand.'; },
         docht(){ if(S.f.wick) return 'Der neue Docht steckt schon.'; S.f.wick=1; take('docht'); return 'Du ziehst den verkohlten Rest heraus und fädelst den <b>neuen Docht</b> ein.'; },
         feuerzeug(){ sfx('no'); return 'Nur Funken. Das Feuerzeug ist leer.'; },
         feuerzeugAn(){ const f=S.f; if(f.fire) return 'Es brennt schon.'; if(!f.tank) return 'Kein Petroleum im Tank. Da brennt nichts.'; if(!f.wick) return 'Der alte Docht ist völlig verkohlt. So hält keine Flamme.'; f.fire=1; sfx('chime'); if(f.rot){ setTimeout(finale,400); return 'Fuhh! Die Flamme schießt hoch, die Linse glüht auf. Der Lichtstrahl dreht sich hinaus über das Meer …'; } return 'Fuhh! Die Flamme schießt hoch, die Linse glüht auf! Aber der Strahl steht still. <b>Ein Leuchtturm, der sich nicht dreht, ist kein Leuchtturm.</b>'; } }},
  {id:'drehwerk',r:[400,650,290,215],act(){ const f=S.f; if(f.rot) return 'Die Zahnräder greifen sauber ineinander und drehen sich gleichmäßig.'; const n=(f.g1?0:1)+(f.g2?0:1); return n?`Das Drehwerk unter der Linse. Auf ${n===2?'zwei Achsen':'einer Achse'} fehlt ein Zahnrad${n===2?' – eine große und eine kleine Achse':''}.`:'Alle Zahnräder sitzen. Jetzt braucht es Kraft – die Kurbel.'; },
   use:{ zahnradGross(){ S.f.g1=1; take('zahnradGross'); sfx('click'); return 'Das große Messingzahnrad passt genau auf die große Achse.'; },
         zahnradKlein(){ S.f.g2=1; take('zahnradKlein'); sfx('click'); return 'Das kleine Zahnrad rutscht mit seinem eckigen Loch auf die Vierkantachse. Klack.'; } }},
  {id:'kurbel',r:[690,705,135,135],act(){ const f=S.f; if(f.rot) return 'Das Drehwerk läuft von allein weiter.'; if(!f.g1||!f.g2){ sfx('no'); return 'Du drehst die Kurbel – sie läuft leer. Im Drehwerk fehlen noch Zahnräder.'; } f.rot=1; sfx('slide'); if(f.fire){ setTimeout(finale,400); return 'Du kurbelst mit aller Kraft. Langsam, dann immer schneller beginnt sich die Linse zu drehen – und mit ihr der Lichtstrahl!'; } return 'Du kurbelst. Die Zahnräder greifen, die Linse beginnt sich zu drehen. Aber noch ist sie dunkel.'; }},
  {id:'kiste',r:[790,665,290,250],act(){ if(S.f.chest) return 'Die Seekiste ist leer – bis auf eine Kinderzeichnung von einem Leuchtturm.'; if(!S.f.lit) return 'Eine Seekiste mit einem Zahlenschloss. Es ist zu dunkel, um die Ziffern zu lesen.'; openLock({title:'Opas Seekiste',vals:['0','1','2','3','4','5','6','7','8','9'],show:c=>`<span style="font:700 34px/1 Georgia,serif;color:#f2b35b">${c}</span>`,code:KAL_CODE,start:[0,0,0,0],ok(){ S.f.chest=1; give('docht'); give('zahnradGross'); give('brief5'); say('Klack! Der Deckel springt auf. Darin: ein neuer <b>Docht</b>, ein großes <b>Zahnrad</b> und ein <b>Brief</b> mit rotem Band.'); render(); }}); return 'Auf dem Deckel ist eingeritzt: <b>„Der Tag, an dem sie heimkommt – TT MM“</b>.'; }},
  {id:'werkzeug',r:[905,850,180,145],act(){ if(!S.f.tool){ S.f.tool=1; give('zahnradKlein'); return 'Im Werkzeugkasten, zwischen Schraubenschlüsseln und Ölkännchen: ein kleines, öliges <b>Zahnrad</b> mit eckigem Loch.'; } return 'Schraubenschlüssel, Zangen, ein Lappen voller Öl.'; }},
  {id:'zettel',r:[885,1045,150,75],act(){ openPaperHTML('Ein Zettel von Opa','Elena,<br><br>den letzten Schritt musst du allein gehen, mein Mädchen. Das Leuchtfeuer ist im Sturm ausgegangen.<br><br><b>Mach das Licht wieder an – dann komme ich.</b><br><br>Opa'); return 'Ein Zettel, in Opas Handschrift.'; }},
  {id:'treppe',r:[0,990,520,458],act:()=>'Die Wendeltreppe hinunter. Unten ist nur das Rauschen des Meeres. Noch nicht.'}
 ],
 hint(){ const f=S.f;
  if(!f.jacke) return 'Opas Jacke hängt an der Wand. Schau in die Taschen.';
  if(!f.kan) return 'Das Feuerzeug braucht Brennstoff. Auf dem Boden steht ein Kanister.';
  if(!f.lit) return has('feuerzeugAn')?'Zünde damit die kleine Wandlampe an.':'Kombiniere Feuerzeug und Kanister im Inventar.';
  if(!f.chest){ if(!f.h5){ f.h5=1; return 'Die Seekiste will ein Datum. Opas Kalender hängt neben der Wandlampe.'; } return 'Der rot umkreiste Tag ist der 26. November: 2 6 1 1.'; }
  if(!f.tool) return 'Ein kleines Zahnrad fehlt noch. Schau in den Werkzeugkasten.';
  if(!f.g1||!f.g2) return 'Setze beide Zahnräder ins Drehwerk unter der Linse.';
  if(!f.tank) return has('kanisterT')?'Füll den Tank des Brenners mit dem Kanister.':'Die Öffnung am Brenner ist winzig. Kombiniere Kanister und Trichter.';
  if(!f.wick) return 'Setze den neuen Docht in den Brenner.';
  if(!f.rot) return 'Dreh die Kurbel am Drehwerk.';
  return 'Zünde den Brenner mit dem Feuerzeug an.'; },
 end:['Zu Hause','Schritte auf der Treppe. Langsam, schwer, vertraut. Dann steht er in der Tür: weißer Bart, die Mütze schief auf dem Kopf.<br><br>„Hallo, Kapitänin“, sagt Opa Viktor leise.<br><br>Und du erinnerst dich. An alles.<br><br>Als der Sturm vorüber ist, steht ihr zusammen oben auf der Galerie. Die Sonne geht über dem Meer auf, und unten in der Bucht schaukelt euer kleines Boot.'],
 ov(f){ return [`<defs>
  <radialGradient id="lensG" cx="575" cy="420" r="260" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff4c0" stop-opacity=".95"/><stop offset=".25" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <linearGradient id="rayG" x1="0" x2="1"><stop offset="0" stop-color="#fff2c0" stop-opacity=".7"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></linearGradient>
 </defs>
 ${f.lit?`<g transform="translate(150 322)"><rect width="78" height="108" rx="2" fill="#e8dcc0"/><rect width="78" height="20" fill="#a3221a"/>${[...Array(20)].map((_,i)=>`<path d="M${6+(i%5)*14} ${30+Math.floor(i/5)*18}l8 -8" stroke="#6b2a1a" stroke-width="1.6"/>`).join('')}<circle cx="27" cy="98" r="7" fill="none" stroke="#a3221a" stroke-width="2"/><circle cx="39" cy="-2" r="3" fill="#333"/></g>`:''}
 ${f.g1?`<image class="${f.rot?'spinR':''}" href="${A('zahnradGross_s.png')}" x="478" y="718" width="96" height="96"/>`:''}
 ${f.g2?`<image class="${f.rot?'spinL':''}" href="${A('zahnradKlein_s.png')}" x="604" y="712" width="48" height="48"/>`:''}
 ${f.kan?`<image href="${A('t_kanister.jpg')}" x="270" y="750" width="130" height="230"/>`:''}
 ${f.tri?`<image href="${A('t_trichter.jpg')}" x="955" y="425" width="120" height="170"/>`:''}
 ${f.wick&&!f.fire?`<rect x="565" y="440" width="12" height="16" fill="#efe4cf"/>`:''}
 ${f.fire?`<circle cx="575" cy="420" r="260" fill="url(#lensG)" class="flicker"/><ellipse cx="572" cy="430" rx="14" ry="30" fill="#fffbe0"/>
  <g class="${f.rot?'raySpin':''}"><path d="M575 420 1086 330v180z" fill="url(#rayG)"/><path d="M575 420 64 330v180z" fill="url(#rayG)" transform="rotate(180 575 420) scale(1 1)" opacity="0"/></g>`:''}`,
 `<defs><radialGradient id="wl" cx="175" cy="255" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".5"/><stop offset=".35" stop-color="#ffb35a" stop-opacity=".15"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient></defs>
 ${f.lit?`<rect width="${W}" height="${H}" fill="url(#wl)" class="flicker"/><ellipse cx="190" cy="262" rx="22" ry="16" fill="#ffe6a8" opacity=".9" class="flicker"/>`:`<rect width="${W}" height="${H}" fill="#02060c" opacity=".55"/>`}
 ${f.fire?`<rect width="${W}" height="${H}" fill="#ffcf7a" opacity=".08"/>`:''}`]; }
};
function finale(){ sfx('door'); setTimeout(()=>{ say('Unten auf der Treppe: Schritte. Langsam. Schwer. Vertraut …'); tone(90,.4,'triangle',.12); tone(90,.4,'triangle',.12,.9); tone(90,.4,'triangle',.12,1.8); setTimeout(win,3400); },1800); }

/* ================= BUCH-EIGENE NAHANSICHTEN ================= */
function openClock(spin){
 const body=dialog('Die Standuhr',`<div class="clockFace"><img src="${A('uhr_zifferblatt.jpg')}" alt=""><img class="hand hH" src="${A('uhr_stunde.webp')}" alt="" style="width:6.4%;height:46.9%"><img class="hand hM" src="${A('uhr_minute.webp')}" alt="" style="width:5.5%;height:71.9%"></div><p class="cTxt"></p>`);
 const txt=body.querySelector('.cTxt'), hH=body.querySelector('.hH'), hM=body.querySelector('.hM');
 const set=(h,m)=>{ hH.style.transform=`translate(-50%,-50%) rotate(${h}deg)`; hM.style.transform=`translate(-50%,-50%) rotate(${m}deg)`; };
 if(!spin){ set(276,72); txt.innerHTML='Die Zeiger stehen auf <b>9:12</b>.'; return; }
 // Zeiger hängen erst schlaff herab, dann rasen sie los und bremsen auf 9:12 ab
 txt.innerHTML='Das Zahnrad greift. Tick … tack …'; set(183,178);
 const t0=performance.now(), D=3200, M0=178, M1=72+1440*2, H0=183, H1=276+360*2;
 const ease=p=>p<.15?0:1-(1-(p-.15)/.85)**3;
 const step=t=>{ const p=Math.min(1,(t-t0)/D), e=ease(p); set(H0+(H1-H0)*e, M0+(M1-M0)*e); if(p<1) requestAnimationFrame(step); else { set(276,72); txt.innerHTML='Dong. Dong. Dong. Die Zeiger bleiben auf <b>9:12</b> stehen.'; } };
 requestAnimationFrame(step);
}
function openScope(r,svg,txt,title){
 dialog(title||'Durchs Fernrohr',`<div class="scope"><div style="position:absolute;inset:0;${cutStyle(room().img,r)};left:0;top:0;width:100%;height:100%;filter:brightness(1.15) contrast(1.05)"></div><svg viewBox="0 0 110 110" style="position:absolute;inset:0;width:100%;height:100%">${svg}</svg></div><p>${txt}</p>`);
 sfx('slide'); morseTick();
}
function openLog(){
 openPaperHTML('Opas Logbuch',img('logbuch.png').replace('<img','<img style="max-width:110px;margin:0 auto 10px"')+'<b>Letzter Eintrag:</b> Elena kommt heute nach Hause. Ich warte am Leuchtturm. Wenn sie im Bootshaus steht, schicke ich ihr mit dem Licht das, was sie jetzt am meisten braucht. Als Kind hat sie das Morsen schneller gelernt als ich.<br><br><b>Morsetafel</b> (· kurz, – lang)<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px 10px;font:600 15px/1.5 ui-monospace,monospace;margin-top:6px;font-style:normal">'+ABC.map(c=>`<span>${c} ${MORSE[c].replace(/\./g,'·').replace(/-/g,'–')}</span>`).join('')+'</div>');
}
/* Morse-Blinken: M U T in Endlosschleife */
const MSG='MUT', UNIT=330; const mSeq=[]; let mOn=false;
[...MSG].forEach((c,ci)=>{ [...MORSE[c]].forEach((d,di)=>{ mSeq.push([1,d==='.'?1:3]); mSeq.push([0,di<MORSE[c].length-1?1:(ci<MSG.length-1?3:10)]); }); });
function morseTick(){ document.querySelectorAll('.morse').forEach(e=>e.style.opacity=mOn?'1':'0'); }
(function loop(i){ const [on,len]=mSeq[i]; mOn=!!on; morseTick(); setTimeout(()=>loop((i+1)%mSeq.length),len*UNIT); })(0);
/* Schach: Matt in einem Zug. Schwarz: Kg8, Bauern f7 g7 h7, Springer c6, Läufer b7. Weiß: Kg1, Bauern f2 g2 h2. */
const CHESS={g8:'♚',f7:'♟',g7:'♟',h7:'♟',c6:'♞',b7:'♝',g1:'♔',f2:'♙',g2:'♙',h2:'♙'};
const CHESS_WHY={d8:'Der schwarze Springer auf c6 springt auf d8 und schlägt deine Dame.',b8:'Der schwarze Springer auf c6 schlägt deine Dame auf b8.',c8:'Der schwarze Läufer auf b7 schlägt deine Dame auf c8.',a8:'Der schwarze Läufer auf b7 schlägt deine Dame auf a8.',f8:'Der schwarze König schlägt die Dame einfach selbst – sie steht direkt neben ihm.'};
let chessLock=0;
// Gemaltes Brett (900×900) mit gemalten Figuren. Ecken des Spielfelds a8, h8, h1, a1:
const BOARD=[[206,185],[703,185],[768,623],[136,623]];
const PIECE={'♚':['bK',103,256],'♟':['bP',80,146],'♞':['bN',100,188],'♝':['bB',91,202],'♔':['wK',104,256],'♙':['wP',79,144],'♕':['wQ',99,219]};
function sqPos(c,r){ // c 0..7 (a..h), r 0..7 (0 = Reihe 8 oben); liefert Mittelpunkt & Feldbreite in Prozent
 const v=(r+.5)/8, u=(c+.5)/8, L=[BOARD[0][0]+(BOARD[3][0]-BOARD[0][0])*v, BOARD[0][1]+(BOARD[3][1]-BOARD[0][1])*v], R=[BOARD[1][0]+(BOARD[2][0]-BOARD[1][0])*v];
 const x=L[0]+(R[0]-L[0])*u, y=L[1], w=(R[0]-L[0])/8, h=(BOARD[3][1]-BOARD[0][1])/8;
 return {x:x/9,y:y/9,w:w/9,h:h/9};
}
function pieceHTML(sym,c,r,extra=''){
 const [n,pw,ph]=PIECE[sym], q=sqPos(c,r), W=q.w*pw/104*.95, Hh=W*ph/pw;
 return `<img class="cp${extra}" src="${A('schach_'+n+'.webp')}" alt="" style="left:${q.x-W/2}%;top:${q.y+q.h*.28-Hh}%;width:${W}%;z-index:${10+r}">`;
}
function openChess(canPlace){
 const files='abcdefgh';
 let pcs='', hit='';
 for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const sq=files[c]+(8-r), q=sqPos(c,r);
  if(CHESS[sq]) pcs+=pieceHTML(CHESS[sq],c,r);
  hit+=`<button class="sqHit" data-sq="${sq}" aria-label="${sq}" style="left:${q.x-q.w/2}%;top:${q.y-q.h/2}%;width:${q.w}%;height:${q.h}%"></button>`; }
 const body=dialog('Opas Schachpartie',`<p class="small" style="margin-top:0">${canPlace?'Tippe auf das Feld, auf das die weiße Dame soll.':'Weiß ist am Zug. Die weiße Dame fehlt.'}</p><div class="cBoard"><img src="${A('schach_brett.jpg')}" alt="">${pcs}<div class="cQ"></div>${hit}</div><p class="cMsg"></p>`,'Zurück');
 if(!canPlace) return;
 const msg=body.querySelector('.cMsg'), qd=body.querySelector('.cQ');
 body.querySelector('.cBoard').addEventListener('click',e=>{
  const b=e.target.closest('.sqHit'); if(!b) return; const sq=b.dataset.sq;
  if(Date.now()<chessLock){ msg.textContent='Der Mechanismus unter dem Brett spannt sich noch … warte einen Moment.'; return; }
  if(CHESS[sq]){ msg.textContent='Da steht schon eine Figur.'; sfx('no'); return; }
  qd.innerHTML=pieceHTML('♕',files.indexOf(sq[0]),8-+sq[1],' drop'); sfx('click');
  if(sq==='e8'){ setTimeout(()=>{ closeDialog(); S.f.fach=1; take('dame'); give('rostig'); sfx('unlock'); say('Schach auf der letzten Reihe – und der König kann nirgends hin. <b>Matt!</b> Klack – an der Tischkante springt ein <b>Geheimfach</b> auf. Darin: ein <b>rostiger Aufziehschlüssel</b>.'); render(); },1100); return; }
  chessLock=Date.now()+4000;
  msg.innerHTML=(CHESS_WHY[sq]||'Kein Schachmatt. Der schwarze König ist nicht einmal bedroht.')+' <i>Die Dame rutscht zurück.</i>';
  setTimeout(()=>{ qd.innerHTML=''; sfx('no'); },1300);
 });
}
function openBooks(){
 let pulled=[];
 const body=dialog('Das mittlere Regal',`<p class="small" style="margin-top:0">Tippe Bücher an, um sie herauszuziehen. Nach dem vierten Buch zeigt sich, ob die Reihenfolge stimmt.</p><div class="books">${BOOKS.map((b,k)=>`<button class="book" data-b="${k}" style="width:calc(var(--bh) * ${(b.r[2]/b.r[3]).toFixed(3)} + 6px)"><div style="${cutStyle(room().img,b.r).replace(/left:[^;]+;top:[^;]+;width:[^;]+;height:[^;]+;/,'')}"></div><span>${b.t}</span></button>`).join('')}</div>`,'Zurück');
 const wrap=body.querySelector('.books');
 wrap.addEventListener('click',e=>{
  const b=e.target.closest('.book'); if(!b||b.classList.contains('out')) return;
  b.classList.add('out'); sfx('slide'); pulled.push(BOOKS[b.dataset.b].t);
  if(pulled.length<4) return;
  if(pulled.join()!==BOOK_ORDER.join()){ setTimeout(()=>{ sfx('no'); wrap.querySelectorAll('.book').forEach(x=>x.classList.remove('out')); pulled=[]; say('Du hast vier Bücher gezogen … nichts passiert. Klack – alle rutschen zurück an ihren Platz.'); },700); return; }
  setTimeout(()=>{ closeDialog(); S.f.door=1; sfx('door'); say('Ein tiefes Grollen … das ganze Regal schwingt zur Seite!'); render(); setTimeout(win,2600); },700);
 });
}

return {
 id:'villa-morgenrot',
 title:'Villa Morgenrot',
 genre:'Mystery',
 tagline:'Ein Haus am Meer. Ein Großvater, der wartet. Und eine Erinnerung, die du dir Zimmer für Zimmer zurückholst.',
 cover:A('bibliothek.jpg'),
 size:[W,H],
 asset:A,
 items:ITEMS,
 rooms:[R1,R2,R3,R4,R5],
 afterRender:morseTick,
 firstMsg:'Wo bin ich? Tippe auf Dinge im Raum, um sie zu untersuchen.'
};
}
