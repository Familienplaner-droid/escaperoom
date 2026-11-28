// Das Auge des Jaguars – Buch 2 (Abenteuer)
// Yucatán, 1926. Lou folgt den Zeichnungen ihrer Mentorin Amalia Ortiz bis in die Kammer des Jaguars.
export default function augeDesJaguars(api){
const {tr,tf,lang,S,give,take,has,say,sfx,tone,render,win,openLock,openSafe,openPaper,openPaperHTML,flash,cutStyle,room,dialog,closeDialog}=api;
const A=name=>'books/auge-des-jaguars/img/'+name;
const W=1086, H=1448;
const img=(src,st='')=>`<img src="${A(src)}" alt="" style="${st}">`;


/* ================= STERNBILDER & MAYA-ZAHLEN (SVG) ================= */
const STERNE={
 schildkroete:{n:'Schildkröte',p:[[30,42],[50,32],[70,42],[72,62],[50,72],[28,62],[50,14],[50,52]],l:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,6]]},
 skorpion:{n:'Skorpion',p:[[18,22],[30,28],[40,37],[48,50],[54,63],[62,75],[75,80],[86,71]],l:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]},
 schlange:{n:'Schlange',p:[[14,70],[27,45],[41,66],[55,40],[69,62],[85,36]],l:[[0,1],[1,2],[2,3],[3,4],[4,5]]},
 vogel:{n:'Vogel',p:[[50,18],[50,44],[50,82],[18,36],[82,36]],l:[[0,1],[1,2],[3,1],[1,4]]},
 fledermaus:{n:'Fledermaus',p:[[14,32],[31,66],[50,46],[69,66],[86,32],[50,28]],l:[[0,1],[1,2],[2,3],[3,4],[2,5]]},
 hirsch:{n:'Hirsch',p:[[50,86],[50,56],[35,36],[25,14],[65,36],[75,14],[44,22],[56,22]],l:[[0,1],[1,2],[2,3],[1,4],[4,5],[2,6],[4,7]]}
};
// Sternbild zeichnen: style 'himmel' (leuchtend), 'stein' (eingeritzt), 'blei' (Bleistift)
function stern(k,cx,cy,sz,style='himmel'){
 const c=STERNE[k], f=v=>v/100*sz, X=v=>cx-sz/2+f(v[0]), Y=v=>cy-sz/2+f(v[1]);
 const lc=style==='himmel'?'#cfe0ff':style==='blei'?'#3a3a3a':'#1d1d16', lo=style==='himmel'?.35:.75, lw=style==='himmel'?sz*.012:sz*.03;
 const lines=c.l.map(([a,b])=>`<line x1="${X(c.p[a])}" y1="${Y(c.p[a])}" x2="${X(c.p[b])}" y2="${Y(c.p[b])}" stroke="${lc}" stroke-opacity="${lo}" stroke-width="${lw}" stroke-linecap="round"/>`).join('');
 const dots=c.p.map(v=>style==='himmel'?`<circle cx="${X(v)}" cy="${Y(v)}" r="${sz*.045}" fill="#fff" opacity=".25"/><circle cx="${X(v)}" cy="${Y(v)}" r="${sz*.022}" fill="#fff"/>`
  :`<circle cx="${X(v)}" cy="${Y(v)}" r="${sz*.05}" fill="${lc}" fill-opacity="${style==='blei'?.85:.82}"${style==='stein'?` stroke="#fff" stroke-opacity=".25" stroke-width="${sz*.012}"`:''}/>`).join('');
 return lines+dots;
}
// Maya-Zahl: Punkte oben, Striche darunter
function maya(n,cx,cy,sz,col='#1d1d16',hi=true){
 const bars=Math.floor(n/5), d=n%5, bh=sz*.13, gap=sz*.07, r=sz*.075, rows=bars+(d?1:0), H=rows*bh+(rows-1)*gap; let y=cy-H/2, out='';
 const st=hi?` stroke="#fff" stroke-opacity=".25" stroke-width="${sz*.02}"`:'';
 if(d){ for(let i=0;i<d;i++) out+=`<circle cx="${cx+(i-(d-1)/2)*r*2.9}" cy="${y+bh/2}" r="${r}" fill="${col}" fill-opacity=".85"${st}/>`; y+=bh+gap; }
 for(let i=0;i<bars;i++){ out+=`<rect x="${cx-sz*.4}" y="${y}" width="${sz*.8}" height="${bh}" rx="${bh/2}" fill="${col}" fill-opacity=".85"${st}/>`; y+=bh+gap; }
 return out;
}
const mayaSVG=(n,w=46)=>`<svg viewBox="0 0 100 100" style="width:${w}px;height:${w}px;vertical-align:middle">${maya(n,50,50,90,'#3a2a14',false)}</svg>`;

/* ================= AMALIAS FELDBUCH ================= */
// Das Feldbuch wächst mit: Seiten aus früheren Kapiteln sind schon eingelegt, die aktuelle erst, wenn Lou sie gefunden hat.
const P_NOTIZ='<b>Auf dem Umschlag, in Amalias eiliger Schrift:</b><br><br>Lou, das Auge öffnet sich nur einmal im Jahr. <b>Morgen bei Sonnenaufgang.</b> Ich kann nicht warten, bis der Sturm vorbei ist.<br><br>Folge meinen Zeichnungen, Lou.<br><br>– A.';
const P_PACK='<b>Packliste für Mateos Maultiere</b> (Gewicht in Lot)<div style="display:grid;grid-template-columns:1fr auto;gap:0 14px;font-style:normal;margin-top:6px">'
 +[['Zelt',40],['Funkgerät',22],['Theodolit',14],['Machete',8],['Kochtopf',6],['Fackel',5],['Kalebasse (leer)',3],['Kompass',2],['Lous Federmesser',1]]
   .map(([n,g])=>`<span>${tr(n)}</span><span style="text-align:right">${g}</span>`).join('')+'</div>';
const P_SEITE1=()=>img('seite1_gross.webp','max-width:260px;margin:0 auto 10px')+'<b>Mein Tempel.</b> Drei Stufen, ganz oben der Jaguar. Dort wartet das Auge.<br><br>Die Kiste kennt den Weg dorthin, Lou. Du musst ihn nur auf der Karte finden.';
const P_SEITE2='<b>Lou!</b> Der Sturm hat die Brücke zerrissen, gleich nachdem ich drüben war. Du findest einen Weg hinüber, da bin ich sicher.<br><br>Die Steintür öffnet sich nur, wenn ihre vier <b>Tierköpfe</b> in der richtigen Reihenfolge stehen.<br><br>• Über der Tür stehen vier <b>Zeichen</b>. Die <b>Punkte</b> darunter zählen: ein Punkt = das erste Tier, zwei Punkte = das zweite, und so weiter.<br>• Welches Tier zu welchem Zeichen gehört, verrät das <b>Relief</b> neben der Tür: Unter jedem Tier ist sein Zeichen eingemeißelt.<br>• Dann die Köpfe auf der Tür von links nach rechts einstellen.<br><br>Der Regen hat Schlamm über das Relief gespült – aber darunter ist alles noch da.';
const P_SEITE3=()=>'<b>Lou,</b> das Tor öffnet sich nur für den <b>Tag des Auges</b>. Die Priester haben ihn nicht mit Worten aufgeschrieben, sondern mit dem Himmel:<br><br>Das <b>Zeichen</b> des Tages ist das Sternbild, das vor Sonnenaufgang <b>im Osten</b> über den Bäumen steht. Seine <b>Zahl</b> steht auf der Stele, gleich neben dem Sternbild.<br><br>Die Maya schreiben Zahlen mit Punkten und Strichen:<div style="display:grid;grid-template-columns:repeat(3,auto);gap:4px 10px;justify-content:center;align-items:center;font-style:normal;margin:8px 0">'
 +[1,2,4,5,6,10].map(n=>`<span style="text-align:center">${mayaSVG(n)}<br>${n}</span>`).join('')+'</div>Ein Punkt ist eins, ein Strich ist fünf.';
const P_STERN=()=>'<b>Deine eigene Zeichnung:</b> das Sternbild, das vor Sonnenaufgang im Osten stand.<div style="text-align:center"><svg viewBox="0 0 100 100" style="width:150px;height:150px">'+stern('schildkroete',50,50,86,'blei')+'</svg></div>Zum ersten Mal hast du etwas gezeichnet, das du selbst entdeckt hast.';
const P_SEITE4='<b>Lou,</b> in dieser Halle haben die Priester das Mondlicht eingefangen. Vier Spiegel aus Obsidian lenken es durch den Raum – wenn sie blank sind und richtig stehen.<br><br><b>Das Licht muss den Jaguar wecken.</b> Nicht die Sonne, nicht den Mond. Nur der Jaguar öffnet den Weg.<br><br>Sieh dir den Strahl genau an, bevor du die Spiegel drehst. Man sieht ihn nur, wenn Staub in der Luft liegt.';
const P_SEITE5='<b>Fundliste, 21. März 1926</b><br><br>Jaguarfigur aus grüner Jade, von der Waage am Gitter: <b>15 Lot</b>.<br><br><i>Darunter, krakelig:</i> Lou! Ich habe die Figur von der Waagschale genommen – und das Gitter ist heruntergekracht. Durch die Stäbe passt sie nicht. Leg genau <b>15 Lot</b> in die Schale und zieh den Hebel. Was deine Sachen wiegen, steht in meiner Packliste.';
function feldbuchHTML(){
 const pg=[P_NOTIZ];
 if(S.f.seite5) pg.push(P_SEITE5);
 if(S.room>3||S.f.seite4) pg.push(P_SEITE4);
 if(S.room>2||S.f.sternbild) pg.push(P_STERN());
 if(S.room>2||S.f.seite3) pg.push(P_SEITE3());
 if(S.room>1||S.f.seite2) pg.push(P_SEITE2);
 if(S.room>0||S.f.seite1) pg.push(P_SEITE1());
 pg.push(P_PACK);
 return pg.join('<hr style="border:0;border-top:1px dashed #8a6a35;margin:16px 0">');
}

/* ================= GEGENSTÄNDE ================= */
const ITEMS={
 feldbuch:{n:'Amalias Feldbuch',i:'feldbuch.png',get paper(){ return ['Amalias Feldbuch',feldbuchHTML()]; }},
 federmesser:{n:'Federmesser',i:'federmesser.png',d:'Dein kleines Messer zum Bleistiftspitzen. Die Klinge ist kurz, aber fest.'},
 karbidlampe:{n:'Karbidlampe (leer)',i:'karbidlampe.png',d:'Eine Karbidlampe aus Messing. Unten gehört Karbid hinein, oben Wasser – dann entsteht Gas, und das Funkenrad zündet es. Sie ist leer.'},
 lampeK:{n:'Karbidlampe mit Karbid',i:'karbidlampe.png',d:'Unten steckt jetzt Karbid. Fehlt nur noch Wasser im oberen Fach.'},
 karbidlampeAn:{n:'Brennende Karbidlampe',i:'karbidlampeAn.png',d:'Die Karbidlampe zischt leise und brennt mit heller, weißer Flamme. Für die Hand reicht das, für das ganze Zelt nicht.'},
 dose:{n:'Blechdose',i:'dose.png',d:'Eine kleine Blechdose. Auf dem Deckel steht in Amalias Schrift: „Karbid“. Der Deckel ist festgerostet.'},
 karbid:{n:'Karbid',i:'karbid.png',d:'Graue, kreidige Brocken Karbid. Mit Wasser entsteht daraus brennbares Gas.'},
 becher:{n:'Blechbecher',i:'becher.png',d:'Ein verbeulter Emaillebecher. Leer.'},
 becherW:{n:'Becher mit Regenwasser',i:'becherW.png',d:'Randvoll mit Regenwasser.'},
 seite1:{n:'Amalias Skizze',i:'seite.png',get paper(){ return ['Eine lose Seite',P_SEITE1()]; }},
 roehre:{n:'Funkröhre',i:'roehre.png',d:'Eine Ersatzröhre für das Funkgerät. Heil!'},
 kompass:{n:'Kompass',i:'kompass.png',d:'Amalias Taschenkompass aus Messing. Die Nadel zeigt zuverlässig nach Norden.'},
 seite2:{n:'Amalias Nachricht',i:'seite.png',get paper(){ return ['Eine lose Seite',P_SEITE2]; }},
 machete:{n:'Machete',i:'machete.png',d:'Eine schwere Machete. Die Klinge ist scharf genug für Lianen und Ranken.'},
 liane:{n:'Liane',i:'liane.png',d:'Eine lange, zähe Liane. Hält mehr aus als manches Seil.'},
 planken:{n:'Planken',i:'planken.png',d:'Drei alte, aber feste Holzplanken.'},
 kalebasse:{n:'Kalebasse',i:'kalebasse.png',d:'Eine getrocknete Kürbisschale. Leer.'},
 kalebasseW:{n:'Kalebasse mit Wasser',i:'kalebasseW.png',d:'Randvoll mit klarem Wasser aus dem Cenote.'},
 seite3:{n:'Amalias Seite über den Kalender',i:'seite.png',get paper(){ return ['Eine lose Seite',P_SEITE3()]; }},
 fackel:{n:'Fackel',i:'fackel.png',d:'Eine Fackel, der Kopf mit öligem Tuch umwickelt. Sie ist trocken geblieben.'},
 fackelAn:{n:'Brennende Fackel',i:'fackelAn.png',d:'Die Fackel brennt hell und warm. Sie wird eine Weile halten.'},
 seite4:{n:'Amalias Seite über die Spiegel',i:'seite.png',get paper(){ return ['Eine lose Seite',P_SEITE4]; }},
 spiegelplatte:{n:'Spiegelplatte',i:'spiegelplatte.png',d:'Eine Platte aus schwarzem Obsidian in einem Steinrahmen. Unbeschädigt!'},
 asche:{n:'Asche',i:'asche.png',d:'Eine Handvoll feiner, grauer Asche. Sie staubt bei jeder Bewegung.'},
 linse:{n:'Kristalllinse',i:'linse.png',d:'Eine vollkommen klare Linse aus Kristall, so groß wie deine Handfläche. In ihr glimmt ein weiches Licht. Das Auge des Jaguars.'},
 seite5:{n:'Amalias Fundliste',i:'seite.png',get paper(){ return ['Eine lose Seite',P_SEITE5]; }},
 jadegriff:{n:'Jadegriff',i:'jadegriff.png',d:'Ein Griff aus grüner Jade mit einem eckigen Zapfen am Ende. Er sieht aus, als gehöre er irgendwo hinein.'}
};

/* ================= KAPITEL 1: DAS EXPEDITIONSZELT ================= */
// Karte: Gradnetz mit Minuten, 9 Ruinen. Lösung: drei Stufen + Jaguar bei N 20°43′, W 88°17′ → 4317
const COLS=[[15,20],[29,19],[43,18],[57,17],[71,16],[85,15]], ROWS=[[15,46],[29,45],[43,44],[57,43],[71,42],[85,41]];
const RUINS=[[57,57,3,'J'],[29,29,3,'B'],[71,43,3,'T'],[15,71,2,'J'],[43,85,4,'J'],[85,71,3,'S'],[43,15,1,'T'],[29,57,2,'B'],[71,85,0,'R']];
function pyr(x,y,t,top){
 const ink='#3d240c', fill='#d8b77a'; let s='', w=11.5, yy=y;
 if(t===0) return `<g stroke="${ink}" stroke-width=".35" fill="${fill}"><path d="M${x-5.5} ${y}l2.2-2.6h2.2l.9 1.3 1.5-2.8 1.8 1.5 1.3 2.6z"/></g><circle cx="${x}" cy="${y}" r=".8" fill="${ink}"/>`;
 for(let k=0;k<t;k++){ s+=`<rect x="${x-w/2}" y="${yy-2.2}" width="${w}" height="2.2"/>`; yy-=2.2; w-=2.6; }
 s+=`<path d="M${x-.8} ${y}V${yy}h1.6V${y}" fill="${ink}" opacity=".3" stroke="none"/>`;
 // Tempelhaus mit dunkler Tür
 s+=`<rect x="${x-1.6}" y="${yy-2.6}" width="3.2" height="2.6"/><rect x="${x-.55}" y="${yy-1.6}" width="1.1" height="1.6" fill="${ink}" stroke="none"/>`; yy-=2.6;
 if(top==='J') s+=`<path d="M${x-1.7} ${yy}q0-2.8 1.7-2.8t1.7 2.8z"/><path d="M${x-1.5} ${yy-2}l.2-1.3 1 .9M${x+1.5} ${yy-2}l-.2-1.3-1 .9"/><circle cx="${x-.6}" cy="${yy-1.35}" r=".28" fill="${ink}"/><circle cx="${x+.6}" cy="${yy-1.35}" r=".28" fill="${ink}"/>`;
 if(top==='B') s+=`<circle cx="${x}" cy="${yy-1.2}" r="1.2"/><path d="M${x+1.1} ${yy-1.6}l2.2.5-2.2.5z" fill="${ink}"/>`;
 if(top==='S') s+=`<path d="M${x-1.7} ${yy-.3}q.9-2.2 1.7-1.1t1.7-1.5" fill="none"/>`;
 return `<g stroke="${ink}" stroke-width=".35" fill="${fill}">${s}</g><circle cx="${x}" cy="${y}" r=".8" fill="${ink}"/>`;
}
function openMap(){
 const lab='font-family:Georgia,serif;font-size:3.3px;fill:#3d240c;font-style:italic';
 const grid=COLS.map(([x])=>`<path d="M${x} 9V93"/>`).join('')+ROWS.map(([y])=>`<path d="M9 ${y}H93"/>`).join('');
 const labels=COLS.map(([x,m])=>`<text x="${x}" y="7.5" text-anchor="middle" style="${lab}">${m}′</text>`).join('')
  +ROWS.map(([y,m])=>`<text x="5.2" y="${y+1.1}" text-anchor="middle" style="${lab}">${m}′</text>`).join('');
 const camp=`<g stroke="#3d240c" stroke-width=".4" fill="#efe1bf"><path d="M33 68l3.2-4.4 3.2 4.4z"/><path d="M36.2 63.6v-2.4l1.8.7-1.8.6" fill="#a3221a"/></g>`;
 const body=dialog('Die Karte',`<div class="jMap" style="position:relative;width:min(340px,84vw);aspect-ratio:1;margin:0 auto;border-radius:6px;overflow:hidden;box-shadow:0 8px 24px #000a"><div class="jMapIn" style="position:absolute;inset:0;transition:transform .35s"><img src="${A('karte.jpg')}" alt="" style="display:block;width:100%;height:100%"><svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%"><g stroke="#3d240c" stroke-width=".25" opacity=".55">${grid}</g>${labels}<text x="50" y="97.6" text-anchor="middle" style="${lab};font-size:2.8px">N 20° · W 88°</text>${camp}${RUINS.map(r=>pyr(...r)).join('')}</svg></div></div><p class="small" style="margin:6px 0 0;opacity:.75">Tippe auf die Karte, um sie zu vergrößern.</p><p>Amalias Expeditionskarte. Am Rand: die Minuten der Breite (links) und der Länge (oben). Überall im Dschungel hat sie Ruinen eingezeichnet. Das kleine Zelt mit der roten Fahne ist euer Lager.</p>`);
 const wrap=body.querySelector('.jMap'), inner=body.querySelector('.jMapIn'); let z=false;
 wrap.addEventListener('click',e=>{ const r=wrap.getBoundingClientRect(); z=!z;
  inner.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`; inner.style.transform=z?'scale(2.4)':'none'; });
 sfx('slide');
}
function radioMsg(){
 sfx('music'); tone(220,.25,'sawtooth',.03); tone(180,.2,'sawtooth',.03,.4);
 setTimeout(()=>{ const b=dialog('Das Funkgerät',`<p class="paper" style="font-style:normal">Krrrsch … <b>Lou?</b> … Lou, hörst du mich? … krrr … bin am Tempel … Brücke ist … krrrsch … <b>vor Sonnenaufgang</b> … folge meinen Zeichnungen … krrrrrr …</p><p>Dann nur noch Rauschen. Aber Amalia lebt – und sie braucht dich.</p>`,'Weiter');
  document.getElementById('dClose').addEventListener('click',()=>setTimeout(win,300),{once:true}); },1200);
}
const R1={
 title:'Das Expeditionszelt', chapter:'Kapitel 1', img:A('zelt_dunkel.jpg'), imgFor:f=>A(f.lit?'zelt.jpg':'zelt_dunkel.jpg'), introImg:A('intro1.jpg'),
 intro:['Yucatán, 1926. Ein Gewitter rüttelt am Expeditionslager, als wollte es die Zelte in den Dschungel reißen.','Ein Donnerschlag weckt dich. Die Laterne ist aus. Amalias Feldbett ist leer, ihre Stiefel sind weg.','Auf deinem Kissen liegt ihr Feldbuch. Professorin Amalia Ortiz ist allein in den Sturm hinausgegangen.'],
 onStart(){ give('feldbuch'); },
 firstMsg:'Stockdunkel. Nur die Blitze erhellen das Zelt. Neben dir liegt <b>Amalias Feldbuch</b> – tippe es unten zweimal an, um es zu lesen.',
 comboNo:{'becherW+karbid':'Karbid direkt ins Wasser? Es zischt und stinkt – und das Gas wäre verloren. Das gehört in die Lampe.','becherW+karbidlampe':'Erst muss unten Karbid in die Lampe, dann oben Wasser.','dose+karbidlampe':'Die Dose ist noch zu. Der Deckel ist festgerostet.','becher+karbidlampe':'Der Becher ist leer.','becher+lampeK':'Der Becher ist leer. Woher bekommst du heute Nacht Wasser?','federmesser+karbidlampe':'An der Lampe ist nichts zu schneiden.',
  'feldbuch+karbidlampeAn':'Vorsicht! Amalias Feldbuch willst du nicht anzünden.','kompass+roehre':'Ein Kompass und eine Röhre. Hübsch, aber nutzlos zusammen.'},
 combos:[
  {a:'dose',b:'federmesser',t:()=>{ take('dose'); give('karbid'); return 'Du setzt das Federmesser unter den Rand und hebelst. Knack – der Deckel springt ab. Darin: graue, kreidige Brocken <b>Karbid</b>.'; }},
  {a:'karbid',b:'karbidlampe',t:()=>{ take('karbid'); take('karbidlampe'); give('lampeK'); return 'Du schraubst die Lampe auf und füllst unten Karbid ein. Fehlt noch das <b>Wasser</b>.'; }},
  {a:'lampeK',b:'becherW',t:()=>{ take('lampeK'); take('becherW'); give('karbidlampeAn'); return 'Du gießt das Regenwasser ins obere Fach. Es zischt, Gas strömt aus der Düse – du drehst am Funkenrad, und eine helle, weiße <b>Flamme</b> springt auf!'; }}
 ],
 cuts:[],
 code:'4317',
 onCode(){ S.f.kiste=1; sfx('door'); return 'Klack! Das Schloss springt auf, der Deckel hebt sich. Im Stroh liegen eine <b>Funkröhre</b> und ein <b>Kompass</b>.'; },
 hot:[
  {id:'laterne',r:[515,60,140,290],act:()=>S.f.lit?'Die Sturmlaterne brennt ruhig und warm.':'Die große Sturmlaterne. Petroleum ist noch drin – aber die Streichhölzer daneben sind im Regen <b>völlig aufgeweicht</b>.',
   no:{karbidlampe:'Die Karbidlampe ist kalt und leer. Damit zündest du nichts an.',lampeK:'Die Karbidlampe brennt noch nicht. Es fehlt Wasser.',becherW:'Wasser in die Laterne? Dann brennt sie nie wieder.',federmesser:'Am Docht herumschnitzen hilft nicht. Er braucht eine Flamme.'},
   use:{karbidlampeAn(){ if(S.f.lit) return 'Sie brennt schon.'; S.f.lit=1; sfx('unlock'); return 'Du hältst die Flamme der Karbidlampe an den Docht. Die Sturmlaterne flackert auf – warmes Licht füllt das ganze Zelt!'; }}},
  {id:'leck',r:[830,30,240,340],act:()=>'Durch einen Riss im Zeltdach tropft Regenwasser. Tropf. Tropf. Gefährlich nahe am Funkgerät.',
   no:{karbid:'Karbid in den Regen? Es würde sofort zischen – und wäre verloren.',dose:'Die Dose ist zu. Und Karbid sollte ohnehin nicht nass werden – jedenfalls nicht hier.',karbidlampe:'Die Lampe unter das Leck halten? Erst braucht sie unten Karbid, und Wasser fängst du besser in einem Gefäß auf.',lampeK:'Direkt hineintropfen lassen dauert ewig. Fang das Wasser lieber in etwas auf.',becherW:'Der Becher ist schon voll.'},
   use:{becher(){ take('becher'); give('becherW'); sfx('slide'); return 'Du hältst den Becher unter das Leck. Tropf, tropf, tropf … in dieser Nacht dauert es nicht lange. Ein <b>Becher voll Regenwasser</b>.'; }}},
  {id:'dosen',r:[205,330,180,80],act(){ if(!S.f.dose){ S.f.dose=1; give('dose'); return 'Zwischen Konservendosen steht eine kleine <b>Blechdose</b>. Auf dem Deckel, in Amalias Schrift: „Karbid“.'; } return 'Bohnen, Pfirsiche, Kaffee. Nichts davon hilft dir jetzt.'; }},
  {id:'glaeser',r:[295,420,100,80],act:()=>'Einmachgläser mit getrockneten Bohnen und eingelegten Chilis. Mateo schwört darauf.'},
  {id:'blechkiste',r:[265,615,100,75],act(){ if(!S.f.lampe){ S.f.lampe=1; give('karbidlampe'); return 'In der grünen Blechkiste liegt eine <b>Karbidlampe</b> aus Messing. Leer, aber unbeschädigt.'; } return 'Die grüne Blechkiste ist leer – bis auf ein paar Ersatzdüsen.'; }},
  {id:'hacke',r:[172,480,90,150],act:()=>'Amalias Spitzhacke. Am Stiel hat sie mit Messerspitze jeden Fund eingeritzt – es sind viele Kerben.'},
  {id:'fernglas',r:[256,570,42,44],act:()=>'Ein Feldstecher. Bei diesem Regen siehst du damit nur Wasser.'},
  {id:'seil',r:[300,515,112,85],act:()=>'Ein aufgerolltes Seil. Viel zu schwer zum Mitschleppen – Amalia hat es auch dagelassen.'},
  {id:'bett',r:[0,240,168,410],act:()=>'Amalias Feldbett. Das Moskitonetz hängt schlaff herab. Sie hat die Decke zurückgeschlagen und ist einfach gegangen.'},
  {id:'kissen',r:[15,650,245,250],act(){ if(!S.f.lit) return 'Du tastest über die Decke. Im Dunkeln erkennst du nichts – nur Stoff und Moskitonetz.'; if(!S.f.seite1){ S.f.seite1=1; give('seite1'); return 'Unter Amalias Kissen schaut eine <b>lose Seite</b> hervor. Eine Zeichnung – für dich hinterlassen.'; } return 'Das Kissen riecht nach Rauch und Kaffee. Nach Amalia.'; }},
  {id:'becher',r:[310,765,68,78],vis:()=>!S.f.becher,act(){ S.f.becher=1; give('becher'); return 'Du nimmst den verbeulten <b>Blechbecher</b> vom Tisch. Leer.'; }},
  {id:'karte',r:[380,715,390,150],act(){ if(!S.f.lit) return 'Auf dem Tisch liegt eine große Karte. Im Dunkeln ist sie nur ein heller Fleck.'; openMap(); return 'Amalias Karte, voller Ruinen.'; },
   no:{karbidlampeAn:'Im kleinen Lichtkegel siehst du nur Fetzen der Karte. Du brauchst richtig Licht im Zelt.',becherW:'Wasser auf die Karte? Dann ist sie ruiniert.',kompass:'Du legst den Kompass auf die Karte. Norden ist oben – wie bei jeder ordentlichen Karte.'}},
  {id:'eingang',r:[555,352,240,348],act:()=>'Draußen tobt der Sturm. Irgendwo dort, im Dschungel, ist Amalia. Allein.'},
  {id:'mast',r:[428,360,60,350],act:()=>'Der Zeltmast knarrt bei jeder Böe. Hoffentlich hält er.'},
  {id:'funk',r:[850,440,220,245],act(){ if(S.f.radio){ radioMsg(); return 'Das Funkgerät rauscht.'; } return 'Das Funkgerät der Expedition. Die Rückwand ist offen: In einem Sockel <b>fehlt eine Röhre</b>. Ohne sie bleibt es stumm.'; },
   no:{karbidlampeAn:'Feuer und Elektrik – lieber nicht.',becherW:'Wasser ins Funkgerät? Das wäre sein Ende.',kompass:'Die Kompassnadel zittert neben den Spulen. Sonst passiert nichts.',federmesser:'Mit dem Messer in den Drähten herumstochern? Dann ist es wirklich kaputt.'},
   use:{roehre(){ S.f.radio=1; take('roehre'); sfx('click'); render(); radioMsg(); return 'Du drückst die Röhre in den Sockel. Sie beginnt orange zu glühen …'; }}},
  {id:'vorrat',r:[805,690,280,300],act:()=>'Vorratskisten: Mehl, Bohnen, Kaffee. Mateo hat die Maultiere vor dem Sturm ins Dorf gebracht.'},
  {id:'mappe',r:[760,1020,240,175],act(){ if(!S.f.mappe){ S.f.mappe=1; give('federmesser'); return 'Deine Zeichenmappe. Skizzen von Scherben, Säulen und Glyphen – alles abgezeichnet, nichts selbst entdeckt. Obendrauf: dein <b>Federmesser</b>.'; } return 'Deine Zeichnungen. Eines Tages, hat Amalia gesagt, zeichnest du etwas, das noch niemand gesehen hat.'; }},
  {id:'haengematte',r:[600,1190,470,200],act:()=>'Deine Hängematte. Geschlafen hast du heute Nacht kaum.'},
  {id:'kiste',r:[0,1040,475,408],act(){ const f=S.f;
    if(f.kiste){ if(!f.inhalt){ f.inhalt=1; give('roehre'); give('kompass'); return 'Du nimmst die <b>Funkröhre</b> und den <b>Kompass</b> aus dem Stroh.'; } return 'Nur noch Stroh.'; }
    if(!f.lit) return 'Eine schwere Kiste mit einem Zahlenschloss. Es ist zu dunkel, um die Ziffern zu erkennen.';
    openSafe(); return 'Amalias Kiste. Vier Ziffern. In den Deckel ist eingebrannt: <b>N 20° __′ · W 88° __′</b>'; },
   no:{federmesser:'Mit dem kleinen Messer gegen ein Messingschloss? Keine Chance.',karbidlampeAn:'Im Lichtkegel siehst du vier Ziffernrädchen. Aber welche Zahl?',kompass:'Der Kompass zeigt Norden. Die Kiste bleibt zu.'}}
 ],
 hint(){ const f=S.f;
  if(!f.mappe) return ['Du hast doch immer etwas zum Zeichnen dabei.','Deine Zeichenmappe liegt in der Hängematte rechts.'];
  if(!f.lit){
   if(!f.lampe) return ['Ohne Licht kommst du hier nicht weit. Im Regal liegt eine Lampe.','Schau in die grüne Blechkiste im Regal links.'];
   if(!f.dose) return ['Eine Karbidlampe braucht Karbid.','Oben im Regal stehen Blechdosen.'];
   if(has('dose')) return ['Der Deckel der Dose ist festgerostet.','Hebel ihn mit etwas Schmalem, Festem auf.','Kombiniere die Blechdose mit dem Federmesser.'];
   if(has('karbid')) return ['Das Karbid gehört in die Lampe.','Kombiniere Karbid und Karbidlampe.'];
   if(!has('karbidlampeAn')){
    if(!f.becher) return ['Karbid allein brennt nicht. Es braucht Wasser.','Auf dem Kartentisch steht ein Becher.'];
    if(has('becher')) return ['Wasser gibt es heute Nacht mehr als genug.','Halte den Becher unter das Leck im Zeltdach.'];
    return ['Jetzt fehlt nur noch Wasser in der Lampe.','Kombiniere die Karbidlampe mit dem Becher voll Wasser.']; }
   return ['Die kleine Flamme reicht nicht für das ganze Zelt.','Die große Sturmlaterne hat noch Petroleum – nur die Streichhölzer sind nass.','Benutze die brennende Karbidlampe an der Sturmlaterne.']; }
  if(!f.seite1) return ['Amalia hat dir etwas dagelassen. Wo hat sie geschlafen?','Schau unter das Kissen auf Amalias Feldbett.'];
  if(!f.kiste) return ['Die Kiste will Koordinaten: die Minuten hinter N 20° und W 88°.','Amalias Skizze zeigt, welche Ruine auf der Karte ihr Tempel ist: drei Stufen, oben der Jaguar. Lies am Kartenrand ab, wo sie liegt.','Der Tempel liegt bei N 20° 43′ und W 88° 17′. Der Code ist 4317.'];
  if(!f.inhalt) return ['Die Kiste ist offen.','Nimm, was darin liegt.'];
  return ['Das Funkgerät hat einen leeren Sockel.','Setz die Funkröhre ins Funkgerät.']; },
 end:['Kapitel 1 geschafft','Das Rauschen verstummt. Aber du hast genug gehört: Amalia ist am Tempel, und sie braucht dich vor Sonnenaufgang.<br><br>Du steckst ihr Feldbuch ein, den Kompass, dein Federmesser und die Karbidlampe. Dann trittst du hinaus in den Regen. Zum ersten Mal folgst du nicht nur – du gehst voran.'],
 ov(f){ return [`${f.becher?`<image href="${A('p_becher'+(f.lit?'':'_d')+'.webp')}" x="290" y="745" width="125" height="120"/>`:''}${f.kiste?`<image href="${A((f.inhalt?'p_kiste_leer':'p_kiste')+(f.lit?'':'_d')+'.webp')}" x="0" y="900" width="490" height="548"/>`:''}
 ${f.radio?`<circle cx="952" cy="532" r="28" fill="#ff9a3a" opacity=".35" class="flicker"/><circle cx="985" cy="532" r="24" fill="#ff9a3a" opacity=".3" class="flicker" style="animation-delay:-.7s"/><circle cx="1036" cy="526" r="18" fill="#ffb35a" opacity=".55" class="flicker"/>`:''}`,
 `<defs><radialGradient id="lantG" cx="585" cy="225" r="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd48a" stop-opacity=".35"/><stop offset=".5" stop-color="#ffb35a" stop-opacity=".08"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
  <radialGradient id="handG" cx="543" cy="1010" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff4d8" stop-opacity=".32"/><stop offset="1" stop-color="#fff4d8" stop-opacity="0"/></radialGradient></defs>
 ${f.lit?`<rect width="${W}" height="${H}" fill="url(#lantG)" class="flicker"/>`
  :`<rect width="${W}" height="${H}" fill="#cfe0ff" opacity="0"><animate attributeName="opacity" values="0;0;0;.22;0;.12;0;0;0;0" dur="9s" repeatCount="indefinite"/></rect>${has('karbidlampeAn')?`<rect width="${W}" height="${H}" fill="url(#handG)" class="flicker"/>`:''}`}
 <path d="M951 300v8" stroke="#bcd4ff" stroke-width="3" stroke-linecap="round" opacity=".7"><animate attributeName="transform" attributeType="XML" type="translate" values="0 0;0 70" dur="1.1s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="1.1s" repeatCount="indefinite"/></path>`]; }
};

/* ================= KAPITEL 2: DER PFAD AM CENOTE ================= */
// Erfundene Glyphen (eingeritzt). Relief: Tier → Glyphe. Türsturz: Glyphe + Punkte (Reihenfolge).
// Lösung: Fledermaus, Jaguar, Frosch, Affe
const GLYPH=[
 'M50 50m0-6a6 6 0 1 1-6 6a12 12 0 0 1 12-12a18 18 0 0 1 18 18a24 24 0 0 1-24 24a30 30 0 0 1-30-30',      // 0 Spirale
 'M50 22a9 9 0 1 0 .1 0M28 62a9 9 0 1 0 .1 0M72 62a9 9 0 1 0 .1 0M24 84h52',                                 // 1 drei Kreise
 'M50 18a32 32 0 1 0 .1 0M30 30l40 40M70 30l-40 40',                                                       // 2 Kreuz im Kreis
 'M18 34q8-10 16 0t16 0t16 0t16 0M18 52q8-10 16 0t16 0t16 0t16 0M18 70q8-10 16 0t16 0t16 0t16 0',          // 3 Wellen
 'M18 80h16v-16h16v-16h16v-16h16M18 80v-30h12',                                                            // 4 Stufen
 'M16 50q34-30 68 0q-34 30-68 0M50 50m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M50 14q-14 10 0 20'                // 5 Auge mit Halbmond
];
const TIERE=['jaguar','affe','tukan','schlange','frosch','fledermaus'];
const TIERNAME={jaguar:'Jaguar',affe:'Affe',tukan:'Tukan',schlange:'Schlange',frosch:'Frosch',fledermaus:'Fledermaus'};
const RELIEF_G=[3,0,5,1,4,2];               // Relief-Reihenfolge Jaguar, Affe, Tukan, Schlange, Frosch, Fledermaus
const STURZ=[[4,3],[3,2],[0,4],[2,1]];        // Türsturz links→rechts: [Glyphe, Punkte]
const TUER_LOESUNG=['fledermaus','jaguar','frosch','affe'], TUER_START=['jaguar','tukan','schlange','frosch'];
const glyph=(g,cx,cy,sz)=>{ const k=sz/100, t=`translate(${cx-sz/2} ${cy-sz/2}) scale(${k})`;
 return `<g transform="${t}" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${GLYPH[g]}" stroke="#fff" stroke-opacity=".28" stroke-width="9" transform="translate(1.8 1.8)"/><path d="${GLYPH[g]}" stroke="#1d1d16" stroke-opacity=".82" stroke-width="7"/></g>`; };
const dots=(n,cx,cy,r)=>Array.from({length:n},(_,i)=>`<circle cx="${cx+(i-(n-1)/2)*r*2.8}" cy="${cy}" r="${r}" fill="#1d1d16" fill-opacity=".82" stroke="#fff" stroke-opacity=".25" stroke-width="${r*.25}"/>`).join('');
function openSturz(){
 const X=[430,868,1302,1740];
 dialog('Der Türsturz',`<div style="position:relative;width:100%;margin:0 auto"><img src="${A('tuersturz.jpg')}" alt="" style="display:block;width:100%;border-radius:6px"><svg viewBox="0 0 2172 724" style="position:absolute;inset:0;width:100%;height:100%">${STURZ.map(([g,n],i)=>glyph(g,X[i],350,210)+dots(n,X[i],505,22)).join('')}</svg></div><p>Über der Tür: vier Zeichen, tief in den Stein geschnitten. Unter jedem eine Reihe Punkte – einer, zwei, drei, vier.</p>${S.f.reliefGesehen?'<p><i>Dieselben Zeichen wie unter den Tieren im Relief!</i></p>':'<p><i>Wo hast du diese Zeichen schon einmal gesehen?</i></p>'}`);
 S.f.sturzGesehen=1;
}
function openRelief(){
 const X=[175,465,752,1037,1320,1610];
 dialog('Das Relief',`<div style="position:relative;width:100%;margin:0 auto"><img src="${A('relief.jpg')}" alt="" style="display:block;width:100%;border-radius:6px"><svg viewBox="0 0 1774 887" style="position:absolute;inset:0;width:100%;height:100%">${RELIEF_G.map((g,i)=>glyph(g,X[i],575,165)).join('')}</svg></div><p>Sechs Tiere ziehen über den Stein – und unter jedem ist ein Zeichen eingemeißelt.</p>${S.f.sturzGesehen?'<p><i>Vier dieser Zeichen stehen auch über der Tür!</i></p>':''}`);
 S.f.reliefGesehen=1;
}
function openTierschloss(){
 if(!S.f.tuer) S.f.tuer=TUER_START.slice();
 const t=S.f.tuer;
 const draw=()=>t.map((n,i)=>`<button class="jDisc" data-i="${i}" style="border:0;padding:0;background:none;width:21%;aspect-ratio:1;border-radius:50%;cursor:pointer"><img src="${A('kopf_'+n+'.webp')}" alt="${tr(TIERNAME[n])}" style="width:100%;display:block;border-radius:50%;box-shadow:0 4px 12px #000a"></button>`).join('');
 const body=dialog('Die Steintür',`<div class="jDiscs" style="display:flex;justify-content:space-between;gap:2%;margin:4px 0 14px">${draw()}</div><p>Vier steinerne Scheiben mit Tierköpfen. Tippe auf eine Scheibe, um sie weiterzudrehen. Das erste Tier gehört nach links.</p>${S.f.sturzGesehen?'':'<p><i>Über der Tür, im Türsturz, sind Zeichen eingemeißelt. Die solltest du dir genauer ansehen.</i></p>'}<button class="btn pri" id="jPress" style="margin-top:4px">Gegen die Tür drücken</button>`);
 const box=body.querySelector('.jDiscs');
 box.addEventListener('click',e=>{ const b=e.target.closest('.jDisc'); if(!b) return; const i=+b.dataset.i;
  t[i]=TIERE[(TIERE.indexOf(t[i])+1)%TIERE.length]; sfx('slide'); box.innerHTML=draw(); render(); });
 body.querySelector('#jPress').addEventListener('click',()=>{
  if(t.join()===TUER_LOESUNG.join()){ closeDialog(); S.f.offen=1; sfx('door'); render(); say('Ein tiefes Knirschen. Die Scheiben rasten ein – und die Steintür schwingt nach innen auf. Dahinter: ein dunkler Gang.'); setTimeout(win,2600); }
  else { sfx('no'); closeDialog(); say('Du stemmst dich gegen die Tür. Nichts rührt sich. Die Reihenfolge stimmt wohl nicht.'); }
 });
}
const R2={
 title:'Der Pfad am Cenote', chapter:'Kapitel 2', img:A('cenote.jpg'), introImg:A('intro2.jpg'),
 keep:['feldbuch','federmesser','kompass','karbidlampeAn'],
 intro:['Der Regen hat nachgelassen. Ein voller Mond hängt über dem Dschungel, und der Pfad glänzt silbern.','Am Ende des Pfades öffnet sich die Erde: ein Cenote, ein heiliger Brunnen der Maya, tief und still.','Auf der anderen Seite liegt eine Tempelmauer. Und die Hängebrücke dorthin … ist zerrissen.'],
 firstMsg:'Der Cenote. Drüben die Tempeltür – aber die Brücke ist zerrissen. Neben dem Brückenpfosten lehnt <b>Amalias Rucksack</b>.',
 comboNo:{'kalebasse+machete':'Die Kalebasse zerhacken? Dann hast du gar kein Gefäß mehr.','liane+planken':'Die Planken müssen auf die Brücke, nicht aneinander.','liane+machete':'Die Liane ist lang genug. Nicht kürzen!','kalebasseW+karbidlampeAn':'Lass die Flamme brennen. Du brauchst das Wasser woanders.'},
 combos:[],
 cuts:[],
 hot:[
  {id:'mond',r:[400,20,120,100],act:()=>'Der Vollmond. So hell, dass du fast lesen könntest.'},
  {id:'lianen',r:[190,0,190,500],act:()=>S.f.liane?'Eine Liane fehlt jetzt – sie hängt bald an der Brücke.':'Dicke, zähe Lianen hängen vom Baum herab. Fest wie Seile.',
   no:{federmesser:'Mit dem kleinen Federmesser? Da säbelst du bis Sonnenaufgang.'},
   use:{machete(){ if(S.f.liane) return 'Eine Liane reicht.'; S.f.liane=1; give('liane'); sfx('click'); return 'Zwei kräftige Hiebe – und eine lange <b>Liane</b> fällt dir vor die Füße.'; }}},
  {id:'stumpf',r:[20,880,210,260],act(){ if(!S.f.machete){ S.f.machete=1; give('machete'); sfx('pick'); return 'In dem Baumstumpf steckt eine <b>Machete</b>. Du ruckelst – und ziehst sie heraus.'; } return 'Ein alter Baumstumpf mit einer frischen Kerbe.'; }},
  {id:'rucksack',r:[462,990,150,170],act(){ if(!S.f.seite2){ S.f.seite2=1; give('seite2'); return 'Amalias Rucksack! Ganz oben liegt eine <b>Seite aus ihrem Feldbuch</b> – für dich.'; } return 'Amalias Rucksack. Sie hat ihn hiergelassen, um schneller zu sein.'; }},
  {id:'bruecke',r:[140,540,620,210],act(){ const f=S.f;
    if(f.seil&&f.bretter){ if(!f.drueben){ f.drueben=1; sfx('slide'); return 'Die Brücke schwankt, die Planken knarren – aber sie hält. Schritt für Schritt balancierst du <b>hinüber</b> zur Tempeltür. Jetzt erkennst du auch die <b>Zeichen über der Tür</b> und das verschlammte Relief daneben.'; } return 'Die Brücke hält. Du kannst jederzeit hin und her.'; }
    if(!f.seil&&!f.bretter) return 'Ein Halteseil ist gerissen und hängt ins Wasser, und mittendrin fehlen Planken. So kommst du nicht hinüber.';
    if(!f.seil) return 'Die Lücken sind gestopft, aber das Halteseil fehlt noch. Ohne festhalten wagst du dich nicht hinüber.';
    return 'Das Halteseil ist neu. Aber in der Mitte klaffen noch Lücken zwischen den Brettern.'; },
   no:{machete:'Noch mehr kaputt machen? Lieber nicht.',kalebasse:'Hier kommst du nicht ans Wasser. Es liegt tief unten.'},
   use:{liane(){ take('liane'); S.f.seil=1; sfx('click'); return S.f.bretter?'Du knotest die Liane als neues Halteseil fest. Die Brücke ist <b>wieder ganz</b>!':'Du knotest die Liane als neues <b>Halteseil</b> an die Pfosten. Fehlen noch Bretter.'; },
    planken(){ take('planken'); S.f.bretter=1; sfx('click'); return S.f.seil?'Du legst die Planken in die Lücken. Die Brücke ist <b>wieder ganz</b>!':'Du schiebst die Planken in die Lücken und klemmst sie fest. Fehlt noch ein Halteseil.'; }}},
  {id:'wasser',r:[230,770,520,190],act:()=>'Tief unten glitzert das Wasser des Cenote. Von hier oben kommst du nicht heran.',
   no:{kalebasse:'Zu tief, um von hier oben zu schöpfen. Gibt es irgendwo einen Weg hinunter?',liane:'Die Liane brauchst du für die Brücke.'}},
  {id:'treppe',r:[745,590,195,165],act:()=>'Steinstufen führen an der Wand des Cenote hinab bis zum Wasser.',
   use:{kalebasse(){ take('kalebasse'); give('kalebasseW'); sfx('slide'); return 'Du steigst die Stufen hinab und schöpfst die Kalebasse <b>voll Wasser</b>.'; }},
   no:{kalebasseW:'Die Kalebasse ist schon voll.'}},
  {id:'nische',r:[835,760,230,300],act(){ if(!S.f.kalebasse){ S.f.kalebasse=1; give('kalebasse'); return 'Ein kleiner Opferschrein. Kakaobohnen, drei leere Kürbisschalen. Du nimmst dir eine <b>Kalebasse</b> – mit einer stillen Entschuldigung an die Götter.'; } return 'Kakaobohnen und zwei Kalebassen. Den Rest lässt du lieber liegen.'; }},
  {id:'stapel',r:[620,1090,466,358],vis:()=>!S.f.planken,act:()=>'Ein Stapel alter Planken. Grüne Ranken halten ihn fest umschlungen.',
   no:{federmesser:'Die Ranken sind zäh. Mit dem Federmesser dauert das Stunden.'},
   use:{machete(){ S.f.planken=1; give('planken'); sfx('pick'); return 'Ein paar Hiebe, die Ranken fallen. Du ziehst drei feste <b>Planken</b> heraus.'; }}},
  {id:'tuersturz',r:[528,180,255,75],act(){ if(!S.f.drueben) return 'Über der Tür sind Zeichen. Von hier aus viel zu weit weg, um Einzelheiten zu erkennen.'; openSturz(); return 'Der Türsturz.'; }},
  {id:'tuer',r:[530,255,255,175],act(){ if(S.f.offen) return 'Die Tür steht offen.'; if(!S.f.drueben) return 'Die Steintür liegt auf der anderen Seite. Erst musst du hinüber.'; openTierschloss(); return 'Die Steintür.'; }},
  {id:'relief',r:[850,210,195,200],act(){ if(!S.f.drueben) return 'Neben der Tür: eine Steinplatte voller Schlamm. Zu weit weg.'; if(!S.f.sauber) return 'Das Relief ist dick mit getrocknetem Schlamm überzogen. Darunter erahnst du Formen.'; openRelief(); return 'Das Relief.'; },
   no:{kalebasse:'Die Kalebasse ist leer.',machete:'Mit der Machete kratzen? Dann zerstörst du das Relief.',federmesser:'Kratzen würde die Figuren beschädigen.'},
   use:{kalebasseW(){ if(!S.f.drueben) return 'Zu weit weg. Erst musst du hinüber.'; take('kalebasseW'); give('kalebasse'); S.f.sauber=1; sfx('slide'); return 'Du gießt das Wasser über das Relief. Der Schlamm löst sich in braunen Bächen – darunter kommen <b>Tiere und Zeichen</b> zum Vorschein!'; }}}
 ],
 hint(){ const f=S.f;
  if(!f.seite2) return ['Amalia war hier. Vielleicht hat sie etwas zurückgelassen.','Schau in den Rucksack am Brückenpfosten.'];
  if(!f.seil||!f.bretter){
   if(!f.machete) return ['Hier wächst alles zu. Du brauchst Werkzeug.','Im Baumstumpf links steckt eine Machete.'];
   if(!f.seil&&!has('liane')) return ['Die Brücke braucht ein neues Halteseil.','Die Lianen am Baum sind zäh wie Seile.','Benutze die Machete an den Lianen.'];
   if(!f.bretter&&!has('planken')) return ['In der Brücke fehlen Bretter.','Rechts unten liegt ein Stapel Planken, von Ranken festgehalten.','Benutze die Machete am Plankenstapel.'];
   return ['Jetzt kannst du die Brücke reparieren.','Benutze Liane und Planken an der Brücke.']; }
  if(!f.drueben) return ['Die Brücke ist wieder ganz.','Tippe auf die Brücke, um hinüberzugehen.'];
  if(!f.sauber){
   if(!has('kalebasse')&&!has('kalebasseW')) return ['Das Relief ist voller Schlamm. Mit Wasser ginge er ab.','Du brauchst ein Gefäß. Im Opferschrein stehen Kalebassen.'];
   if(has('kalebasse')) return ['Wasser gibt es im Cenote genug.','Die Steinstufen rechts führen hinunter zum Wasser. Benutze die Kalebasse an der Treppe.'];
   return ['Jetzt das Relief.','Gieß das Wasser über das Relief neben der Tür.']; }
  return ['Über der Tür stehen dieselben Zeichen wie unter den Tieren im Relief.','Nimm das Zeichen mit einem Punkt, such es im Relief: Das Tier darüber kommt nach ganz links. Dann zwei Punkte, drei, vier.','Von links nach rechts: Fledermaus, Jaguar, Frosch, Affe.']; },
 end:['Kapitel 2 geschafft','Der Gang hinter der Tür riecht nach Stein und Jahrhunderten. Du entzündest die Karbidlampe höher und gehst hinein.<br><br>Am Ende des Ganges: Treppen, die hinauf zum Tempel führen. Und am Himmel beginnen die Sterne zu verblassen.'],
 ov(f){ const disc=[[567,333],[628,333],[690,333],[751,333]], t=f.tuer||TUER_START;
  return [`${f.machete?`<image href="${A('p_machete.webp')}" x="50" y="880" width="160" height="240"/>`:''}
  ${f.kalebasse?`<image href="${A('p_kalebasse.webp')}" x="870" y="880" width="170" height="100"/>`:''}
  ${f.planken?`<image href="${A('p_planken.webp')}" x="610" y="1070" width="476" height="378"/>`:''}
  ${f.seil&&f.bretter?`<image href="${A('p_bruecke.webp')}" x="100" y="420" width="880" height="400"/>`:''}
  ${f.sauber?`<image href="${A('p_relief.webp')}" x="838" y="195" width="248" height="230"/>`:''}
  ${f.offen?`<image href="${A('p_tuer.webp')}" x="495" y="235" width="310" height="200"/>`:(t?t.map((n,i)=>`<image href="${A('kopf_'+n+'.webp')}" x="${disc[i][0]-28}" y="${disc[i][1]-28}" width="56" height="56"/><circle cx="${disc[i][0]}" cy="${disc[i][1]}" r="28" fill="#0a1a22" opacity=".28"/>`).join(''):'')}`,
  `<circle cx="120" cy="1010" r="3" fill="#ffe27a" class="flicker"/><circle cx="1040" cy="190" r="3" fill="#ffe27a" class="flicker" style="animation-delay:-1s"/><circle cx="290" cy="790" r="2.5" fill="#ffe27a" class="flicker" style="animation-delay:-.4s"/>`]; }
};

/* ================= KAPITEL 3: DAS TOR DES KALENDERS ================= */
// Lösung: Schildkröte (Sternbild im Osten) + 11 (Stele)
const RING=['schildkroete','skorpion','schlange','vogel','fledermaus','hirsch'];
const STELE=[['vogel',9],['schildkroete',11],['hirsch',6],['skorpion',7],['fledermaus',12],['schlange',4]];
const RAD_LOESUNG=[0,10];   // Ring-Index, Zahl-Index (Zahl = Index+1)
function openStele(){
 const XL=318, XR=708, Y=[268,482,697,912,1125,1338];
 dialog('Die Stele',`<div style="position:relative;width:min(280px,72vw);margin:0 auto"><img src="${A('stele.jpg')}" alt="" style="display:block;width:100%;border-radius:6px"><svg viewBox="0 0 1024 1536" style="position:absolute;inset:0;width:100%;height:100%">${STELE.map(([k,n],i)=>stern(k,XL,Y[i],185,'stein')+maya(n,XR,Y[i],170)).join('')}</svg></div><p>Im Fackelschein: sechs Reihen. Links je ein Sternbild, rechts je eine Zahl aus Punkten und Strichen.</p>`);
}
function openHimmel(){
 const first=!S.f.sternbild; S.f.sternbild=1;
 dialog('Der Himmel',`<div style="position:relative;width:100%;aspect-ratio:1;margin:0 auto;border-radius:6px;overflow:hidden"><img src="${A('himmel.jpg')}" alt="" style="display:block;width:100%;height:100%"><svg viewBox="0 0 1254 1254" style="position:absolute;inset:0;width:100%;height:100%">${stern('schlange',260,470,260)}${stern('vogel',640,250,250)}${stern('schildkroete',990,520,270)}
  <g transform="translate(627 1080)"><circle r="92" fill="#1a1408" fill-opacity=".55" stroke="#c9a46a" stroke-width="5"/><path d="M0-70L12 0L0 70L-12 0z" fill="#c9a46a" opacity=".5"/><path d="M-70 0L0 13L70 0L0-13z" fill="#c9a46a"/><path d="M70 0L44 -16L44 16z" fill="#e05a3a"/><text x="112" y="14" font-size="44" fill="#ffd27a" font-family="Georgia,serif" font-weight="bold">O</text><text x="-148" y="14" font-size="44" fill="#c9a46a" font-family="Georgia,serif">W</text></g>
  <circle cx="990" cy="520" r="175" fill="none" stroke="#ffd27a" stroke-width="5" stroke-dasharray="14 12" opacity=".8"/></svg></div>
  <p>Der Kompass zeigt: <b>Osten liegt rechts</b>, dort, wo der Himmel schon violett schimmert. Und genau dort steht ein Sternbild.</p>${first?'<p><i>Du ziehst den Bleistift hervor und zeichnest es ab, Stern für Stern, in Amalias Feldbuch.</i></p>':''}`);
 sfx('chime');
}
function openRad(){
 if(!S.f.rad) S.f.rad=[2,4];
 const r=S.f.rad, C=400, step2=360/13;
 const outer=RING.map((k,i)=>`<g transform="rotate(${i*60} ${C} ${C})">${stern(k,C,C-284,96,'stein')}</g>`).join('');
 const inner=Array.from({length:13},(_,i)=>`<g transform="rotate(${i*step2} ${C} ${C})">${maya(i+1,C,C-168,64)}</g>`).join('');
 const body=dialog('Das Kalenderrad',`<div style="position:relative;width:100%;aspect-ratio:1;margin:0 auto"><img src="${A('rad.jpg')}" alt="" style="display:block;width:100%;border-radius:50%"><svg viewBox="0 0 800 800" style="position:absolute;inset:0;width:100%;height:100%">
  <circle cx="400" cy="116" r="56" fill="#ffd27a" fill-opacity=".16" stroke="#ffd27a" stroke-opacity=".55" stroke-width="2.5"/><circle cx="400" cy="232" r="38" fill="#ffd27a" fill-opacity=".16" stroke="#ffd27a" stroke-opacity=".55" stroke-width="2.5"/>
  <g id="jOut" style="transition:transform .5s;transform-origin:400px 400px;transform:rotate(${-r[0]*60}deg)">${outer}</g>
  <g id="jIn" style="transition:transform .5s;transform-origin:400px 400px;transform:rotate(${-r[1]*step2}deg)">${inner}</g>
  <circle id="jOutHit" cx="400" cy="400" r="375" fill="transparent"/><circle id="jInHit" cx="400" cy="400" r="240" fill="transparent"/></svg></div>
  <p>Zwei steinerne Ringe. Tippe auf den äußeren oder inneren Ring, um ihn weiterzudrehen. Was oben in den goldenen Kreisen steht, ist eingestellt.</p><button class="btn pri" id="jTurn">Am Jadegriff drehen</button>`);
 body.querySelector('#jOutHit').addEventListener('click',()=>{ r[0]=(r[0]+1)%6; sfx('slide'); body.querySelector('#jOut').style.transform=`rotate(${-r[0]*60}deg)`; });
 body.querySelector('#jInHit').addEventListener('click',()=>{ r[1]=(r[1]+1)%13; sfx('slide'); body.querySelector('#jIn').style.transform=`rotate(${-r[1]*step2}deg)`; });
 body.querySelector('#jTurn').addEventListener('click',()=>{
  closeDialog();
  if(r[0]===RAD_LOESUNG[0]&&r[1]===RAD_LOESUNG[1]){ S.f.offen=1; sfx('door'); render(); say('Du drehst am Jadegriff. Ein tiefes Mahlen geht durch den Stein – das Rad teilt sich, und das Tor schwingt auf. Dahinter führt eine Treppe ins Innere des Tempels.'); setTimeout(win,2800); }
  else { sfx('no'); say('Du drehst am Jadegriff. Es knirscht – dann blockiert das Rad. Dieser Tag ist es nicht.'); }
 });
}
const R3={
 title:'Das Tor des Kalenders', chapter:'Kapitel 3', img:A('tor.jpg'), introImg:A('intro3.jpg'),
 keep:['feldbuch','federmesser','kompass','karbidlampeAn','machete','kalebasse'],
 intro:['Die Treppe hinter der Steintür führt hinauf, durch Wurzeln und Nebel, bis an den Fuß des Tempels.','Der Mond ist untergegangen. Über den Bäumen stehen die Sterne, und ganz im Osten wird der Himmel schon violett.','Vor dir: ein gewaltiges Tor mit einem steinernen Rad. Und deine Karbidlampe beginnt zu flackern.'],
 firstMsg:'Das Tor des Kalenders. Deine Karbidlampe sputtert – das Karbid ist fast verbraucht. Lange hält sie nicht mehr.',
 comboNo:{'fackel+machete':'Die Fackel ist schon handlich genug.','fackelAn+feldbuch':'Vorsicht mit dem Feldbuch!','jadegriff+machete':'Jade ist hart, aber die Machete würde sie nur zerkratzen.','fackel+kalebasse':'Nasses Tuch brennt nicht.'},
 combos:[
  {a:'fackel',b:'karbidlampeAn',t:()=>{ take('fackel'); take('karbidlampeAn'); give('fackelAn'); sfx('unlock'); return 'Du hältst das ölige Tuch an die letzte Flamme der Karbidlampe. Wusch – die <b>Fackel brennt</b>! Im selben Moment erlischt die Karbidlampe. Sie hat ihren Dienst getan.'; }}
 ],
 cuts:[],
 hot:[
  {id:'himmel',r:[215,0,800,250],act(){ if(S.f.sternbild){ openHimmel(); return 'Das Sternbild im Osten.'; } return 'Über den Bäumen funkeln unzählige Sterne. Aber wo genau ist Osten? Ohne das zu wissen, ist es nur Glitzern.'; },
   no:{fackelAn:'Die Fackel blendet. Am Himmel siehst du jetzt noch weniger.',karbidlampeAn:'Die Lampe blendet nur.'},
   use:{kompass(){ openHimmel(); return S.f.seite3?'Osten – dort steht das Sternbild.':'Osten liegt rechts. Ob das wichtig ist?'; }}},
  {id:'pyramide',r:[610,250,270,180],act:()=>'Hoch über dem Tor ragt die Pyramide auf. Irgendwo dort oben wartet das Auge.'},
  {id:'maske',r:[455,320,180,150],act:()=>'Eine steinerne Fratze über dem Tor. Sie grinst, als kenne sie die Lösung.'},
  {id:'stele',r:[0,190,230,880],act(){ const f=S.f;
    if(!f.wurzeln) return 'Hinter dicken Wurzeln verbirgt sich eine Stele. Du erkennst eingeritzte Linien, aber die Wurzeln verdecken fast alles.';
    if(!has('fackelAn')) return 'Die Stele liegt im tiefen Schatten der Bäume. Die Zeichen sind nur dunkle Flecken – du brauchst Licht.';
    openStele(); return 'Die Stele.'; },
   no:{federmesser:'Die Wurzeln sind dick wie Arme. Da hilft das Federmesser nicht.',kalebasse:'Die Stele ist nicht schmutzig – nur zugewachsen.',karbidlampeAn:'Die Karbidlampe flackert zu schwach. Für die Stele brauchst du helleres Licht.',fackel:'Die Fackel brennt ja noch nicht.'},
   use:{machete(){ if(S.f.wurzeln) return 'Die Wurzeln sind schon weg.'; S.f.wurzeln=1; sfx('click'); return 'Hieb um Hieb kappst du die Wurzeln. Dahinter kommt eine <b>Stele</b> zum Vorschein, über und über mit Zeichen bedeckt. Im Schatten der Bäume sind sie aber kaum zu lesen.'; },
    fackelAn(){ if(!S.f.wurzeln) return 'Im Fackelschein siehst du: Hinter den Wurzeln ist eine Stele. Aber sie ist völlig zugewachsen.'; openStele(); return 'Die Stele im Fackelschein.'; }}},
  {id:'halter',r:[232,545,80,210],act(){ if(!S.f.fackel){ S.f.fackel=1; give('fackel'); return 'In dem eisernen Wandhalter steckt eine <b>Fackel</b>. Das ölige Tuch ist trocken geblieben.'; } return 'Ein leerer Fackelhalter.'; }},
  {id:'rad',r:[335,505,420,420],act(){ const f=S.f;
    if(f.offen) return 'Das Tor steht offen.';
    if(!f.griff) return 'Ein steinernes <b>Kalenderrad</b> mit zwei Ringen. In der Mitte ein leeres, eckiges Loch – hier fehlt ein Griff.';
    openRad(); return 'Das Kalenderrad.'; },
   no:{machete:'Mit der Machete das Rad aufhebeln? Das ist Stein. Und Jahrtausende alt.',federmesser:'Das Federmesser passt nicht in das eckige Loch.',fackelAn:'Im Fackelschein siehst du die Ringe genauer. Drehen lassen sie sich so nicht.'},
   use:{jadegriff(){ take('jadegriff'); S.f.griff=1; sfx('click'); render(); return 'Der eckige Zapfen passt genau. Mit einem Klicken sitzt der <b>Jadegriff</b> in der Mitte des Rades.'; }}},
  {id:'schlange',r:[780,440,306,140],act:()=>'Eine gefiederte Schlange aus Stein bewacht die Treppe.'},
  {id:'maul',r:[790,580,260,250],act(){ const f=S.f;
    if(f.jade) return 'Das Maul der Schlange ist leer.';
    if(f.maulHell){ f.jade=1; give('jadegriff'); sfx('pick'); return 'Du greifst tief in das Maul – und ziehst einen <b>Jadegriff</b> heraus.'; }
    return 'Das Maul der Schlange ist pechschwarz. Hineingreifen, ohne zu sehen, was darin ist? Lieber nicht.'; },
   no:{karbidlampeAn:'Die Karbidlampe flackert nur noch – im Maul bleibt es dunkel.',fackel:'Die Fackel brennt ja noch nicht.',machete:'Blind mit der Machete herumstochern? Dann zerbricht vielleicht etwas.'},
   use:{fackelAn(){ if(S.f.jade) return 'Das Maul ist leer.'; S.f.maulHell=1; return 'Du leuchtest in das Maul. Ganz hinten, zwischen den steinernen Zähnen, <b>schimmert etwas Grünes</b>.'; }}},
  {id:'krug',r:[405,1075,240,270],act(){ if(!S.f.seite3){ S.f.seite3=1; give('seite3'); sfx('pick'); return 'Du hebst den Deckel vom Tonkrug. Darin, trocken und sicher: eine <b>Seite aus Amalias Feldbuch</b>.'; } return 'Der Krug ist leer.'; }},
  {id:'treppe',r:[300,950,600,110],act:()=>'Die Stufen sind glatt vom Tau.'}
 ],
 hint(){ const f=S.f;
  if(!has('fackelAn')&&!f.fackelAn){
   if(!f.fackel) return ['Deine Lampe geht gleich aus. Du brauchst ein neues Licht.','Neben dem Tor steckt eine Fackel im Wandhalter.'];
   return ['Die Fackel braucht eine Flamme.','Kombiniere die Fackel mit der Karbidlampe, solange sie noch brennt.']; }
  if(!f.seite3) return ['Amalia hat dir sicher wieder etwas hinterlassen.','Schau in den Tonkrug auf der Treppe.'];
  if(!f.griff){
   if(!f.maulHell) return ['Dem Kalenderrad fehlt der Griff. Irgendwo hier muss er sein.','Das Maul der Steinschlange ist so dunkel …','Leuchte mit der brennenden Fackel in das Maul der Schlange.'];
   if(!f.jade) return ['Im Maul schimmert etwas.','Greif hinein: Tippe auf das Maul.'];
   return ['Der Jadegriff hat einen eckigen Zapfen.','Setz den Jadegriff in die Mitte des Kalenderrads.']; }
  if(!f.wurzeln) return ['Amalia schreibt: Die Zahl steht auf der Stele.','Die Stele links ist von Wurzeln überwuchert.','Benutze die Machete an den Wurzeln.'];
  if(!f.sternbild) return ['Das Zeichen des Tages ist das Sternbild im Osten. Aber wo ist Osten?','Du hast einen Kompass dabei.','Benutze den Kompass am Himmel.'];
  return ['Stell auf dem Rad das Sternbild aus dem Osten ein – und die Zahl, die auf der Stele daneben steht.','Das Sternbild im Osten ist die Schildkröte. Auf der Stele steht neben ihr: zwei Striche und ein Punkt.','Äußerer Ring: Schildkröte. Innerer Ring: 11 (zwei Striche, ein Punkt).']; },
 end:['Kapitel 3 geschafft','Die Treppe hinter dem Tor führt hinab, nicht hinauf. Die Luft wird kühl, die Fackel flackert.<br><br>Unten öffnet sich eine Halle, so dunkel, dass das Licht der Fackel sich darin verliert. Irgendwo über dir fällt ein schmaler Strahl Mondlicht durch den Stein.<br><br>Du nimmst die Fackel mit hinab.'],
 ov(f){ const glow=has('fackelAn')&&!f.offen;
  return [`${f.wurzeln?`<image href="${A('p_stele.webp')}" x="0" y="90" width="245" height="1100"/>`:''}
  ${f.fackel?`<image href="${A('p_halter.webp')}" x="225" y="535" width="100" height="230"/>`:''}
  ${f.seite3?`<image href="${A('p_krug.webp')}" x="395" y="1065" width="360" height="290"/>`:''}
  ${f.offen?`<image href="${A('p_tor.webp')}" x="318" y="465" width="460" height="480"/>`:(f.griff?`<image href="${A('griff_rad.png')}" x="482" y="687" width="130" height="38"/>`:'')}`,
  `<defs><radialGradient id="torchG" cx="543" cy="1150" r="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb35a" stop-opacity=".28"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient></defs>${glow?`<rect width="${W}" height="${H}" fill="url(#torchG)" class="flicker"/>`:''}
  <circle cx="300" cy="60" r="2" fill="#fff" class="flicker"/><circle cx="905" cy="120" r="2" fill="#fff" class="flicker" style="animation-delay:-.8s"/><circle cx="640" cy="40" r="1.6" fill="#fff" class="flicker" style="animation-delay:-1.6s"/>`]; }
};

/* ================= KAPITEL 4: DIE HALLE DER SPIEGEL ================= */
// Draufsicht 4×4. Strahl kommt unten in Spalte 0 herein (nach oben). Altäre oben: Sonne (Sp. 0), Tür (1), Mond (2), Jaguar (3).
// Spiegel: Stellung 0 '/', 1 '\', 2 waagerecht, 3 senkrecht (2/3 schlucken das Licht).
const SPIEGEL=[[2,0],[2,2],[3,2],[3,3]];      // [Zeile, Spalte]
const SPIEGEL_LOESUNG=[0,1,1,0];
function strahl(st){
 let r=4,c=0,dr=-1,dc=0; const pts=[[c,r]];
 for(let n=0;n<40;n++){
  r+=dr; c+=dc;
  if(r<0){ pts.push([c,-0.35]); return {pts,ziel:['sonne','tuer','mond','jaguar'][c]}; }
  if(r>3||c<0||c>3){ pts.push([c,r]); return {pts,ziel:'wand'}; }
  const i=SPIEGEL.findIndex(([a,b])=>a===r&&b===c); if(i<0) continue;
  pts.push([c,r]); const m=st[i];
  if(m>=2) return {pts,ziel:'block'};
  if(m===0) [dr,dc]=[-dc,-dr]; else [dr,dc]=[dc,dr];
 }
 return {pts,ziel:'wand'};
}
function openSpiegel(){
 if(!S.f.spiegel) S.f.spiegel=[2,0,3,2];
 const st=S.f.spiegel, T=200, O=100, P=(c,r)=>[O+c*T+T/2,O+r*T+T/2];
 const ang=[-45,45,0,90];
 const alt=(c,k)=>{ const [x]=P(c,0), y=50;
  if(k==='sonne') return `<circle cx="${x}" cy="${y}" r="22" fill="#e8b04a"/>${Array.from({length:8},(_,i)=>`<line x1="${x}" y1="${y}" x2="${x+38*Math.cos(i*Math.PI/4)}" y2="${y+38*Math.sin(i*Math.PI/4)}" stroke="#e8b04a" stroke-width="6"/>`).join('')}`;
  if(k==='mond') return `<path d="M${x+10} ${y-30}a32 32 0 1 0 0 60a24 24 0 1 1 0-60z" fill="#cfd8e8"/>`;
  if(k==='jaguar') return `<image href="${A('kopf_jaguar.webp')}" x="${x-42}" y="${y-42}" width="84" height="84"/>`;
  return `<rect x="${x-34}" y="${y-36}" width="68" height="72" fill="#120c06" stroke="#6b4a2a" stroke-width="5"/>`; };
 const mirrors=()=>SPIEGEL.map(([r,c],i)=>{ const [x,y]=P(c,r); return `<g class="jM" data-i="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="78" fill="#000" fill-opacity=".001"/><circle cx="${x}" cy="${y}" r="34" fill="#3a2a1a" stroke="#8a6a45" stroke-width="5"/><g transform="rotate(${ang[st[i]]} ${x} ${y})"><rect x="${x-80}" y="${y-11}" width="160" height="22" rx="4" fill="#0d0d12" stroke="#b9c3d6" stroke-width="4"/><rect x="${x-74}" y="${y-6}" width="60" height="5" fill="#fff" opacity=".35"/></g></g>`; }).join('');
 const grid=`<g stroke="#000" stroke-opacity=".25" stroke-width="3">${[1,2,3].map(i=>`<line x1="${O+i*T}" y1="${O}" x2="${O+i*T}" y2="${O+4*T}"/><line x1="${O}" y1="${O+i*T}" x2="${O+4*T}" y2="${O+i*T}"/>`).join('')}</g>`;
 const body=dialog('Die Spiegel',`<div style="position:relative;width:100%;aspect-ratio:1;margin:0 auto"><svg viewBox="0 0 1000 1000" style="display:block;width:100%;height:100%;border-radius:6px;background:#1a120a">
  <image href="${A('boden.jpg')}" x="${O}" y="${O}" width="${4*T}" height="${4*T}"/>${grid}
  <rect x="0" y="0" width="1000" height="${O}" fill="#2a1d10"/>${alt(0,'sonne')}${alt(1,'tuer')}${alt(2,'mond')}${alt(3,'jaguar')}
  <g><rect x="${O+T/2-26}" y="${O+4*T}" width="52" height="${O}" fill="#dfe9ff" opacity=".35"/><circle cx="${O+T/2}" cy="${O+4*T+50}" r="16" fill="#fff"/></g>
  <g id="jBeam"></g><g id="jMs">${mirrors()}</g></svg></div>
  <p>Von oben gesehen: vier Spiegel auf ihren Sockeln. Unten fällt der Mondstrahl herein, oben stehen die drei Altäre und die Tür. Tippe auf einen Spiegel, um ihn zu drehen.</p><button class="btn pri" id="jLicht">Licht durchlassen</button>`);
 const box=body.querySelector('#jMs'), beam=body.querySelector('#jBeam');
 box.addEventListener('click',e=>{ const g=e.target.closest('.jM'); if(!g) return; st[+g.dataset.i]=(st[+g.dataset.i]+1)%4; sfx('slide'); box.innerHTML=mirrors(); beam.innerHTML=''; });
 body.querySelector('#jLicht').addEventListener('click',()=>{
  const res=strahl(st), pts=res.pts.map(([c,r])=>P(c,r));
  const d='M'+pts.map(p=>p.join(' ')).join('L'); let len=0; for(let i=1;i<pts.length;i++) len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
  beam.innerHTML=`<path d="${d}" fill="none" stroke="#dfe9ff" stroke-width="26" stroke-opacity=".25" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len}"><animate attributeName="stroke-dashoffset" to="0" dur="1.2s" fill="freeze"/></path><path d="${d}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len}"><animate attributeName="stroke-dashoffset" to="0" dur="1.2s" fill="freeze"/></path>`;
  sfx('chime');
  setTimeout(()=>{
   if(res.ziel==='jaguar'&&st.join()===SPIEGEL_LOESUNG.join()){ closeDialog(); S.f.licht=1; sfx('door'); render(); say('Der Mondstrahl springt von Spiegel zu Spiegel – und trifft den steinernen Jaguar. Er glüht silbern auf! Ein Knirschen: Am Jaguar-Altar öffnet sich ein kleines <b>Fach</b>, und die schwere Tür gleitet zur Seite.'); }
   else { const t={sonne:'Der Strahl trifft den Sonnen-Altar. Er leuchtet kurz – dann nichts.',mond:'Der Strahl trifft den Mond-Altar. Er schimmert silbern – aber nichts geschieht.',tuer:'Der Strahl trifft die Tür. Stein bleibt Stein.',block:'Ein Spiegel steht quer und schluckt das Licht.',wand:'Der Strahl verliert sich an der Wand.'}[res.ziel]; say(t); }
  },1400);
 });
}
const R4={
 title:'Die Halle der Spiegel', chapter:'Kapitel 4', img:A('halle_dunkel.jpg'), imgFor:f=>A(f.hell?'halle.jpg':'halle_dunkel.jpg'), introImg:A('intro4.jpg'),
 keep:['feldbuch','federmesser','kompass','machete','kalebasse','fackelAn'],
 intro:['Die Treppe endet in einer Halle, so groß, dass das Licht deiner Fackel sich darin verliert.','Von hoch oben fällt ein dünner Strahl Mondlicht durch einen Schacht in der Decke.','Irgendwo in dieser Dunkelheit muss der Weg weitergehen. Amalia ist hier durchgekommen.'],
 firstMsg:'Stockdunkel. Deine Fackel erhellt nur ein paar Schritte. Links an der Wand ertastest du einen leeren <b>Fackelhalter</b>.',
 comboNo:{'asche+kalebasse':'Asche in die Kalebasse? Dann wird sie schmutzig – und die Asche nass.','asche+kalebasseW':'Nasse Asche staubt nicht mehr.','machete+spiegelplatte':'Vorsicht! Obsidian splittert.','kalebasseW+spiegelplatte':'Erst muss die Platte an ihren Platz. Dann putzt du alle zusammen.'},
 combos:[],
 cuts:[],
 hot:[
  {id:'halter',r:[15,170,140,270],act:()=>S.f.hell?'Die Fackel brennt ruhig im Halter und erhellt die ganze Halle.':'Ein eiserner Fackelhalter an der Wand. Leer.',
   use:{fackelAn(){ if(S.f.hell) return 'Sie steckt schon.'; take('fackelAn'); S.f.hell=1; sfx('unlock'); return 'Du steckst die Fackel in den Halter. Hoch oben an der Wand verteilt sich ihr Licht – jetzt siehst du die <b>ganze Halle</b>.'; }},
   no:{fackel:'Die Fackel brennt ja nicht.'}},
  {id:'schacht',r:[545,0,170,90],act:()=>'Ein Schacht in der Decke. Durch ihn fällt das letzte Mondlicht der Nacht.'},
  {id:'strahl',r:[570,90,150,160],act:()=>S.f.staub?'Der Mondstrahl hängt wie ein silberner Faden in der staubigen Luft. Jetzt siehst du, wo er einfällt.':'Ein Strahl Mondlicht – so dünn, dass du ihn kaum siehst. Wohin er fällt, kannst du nur ahnen.',
   no:{kalebasseW:'Wasser in den Strahl? Das glitzert kurz, aber sichtbar wird er davon nicht.',fackelAn:'Die Fackel überstrahlt das Mondlicht nur.',machete:'Licht kann man nicht zerschneiden.'},
   use:{asche(){ take('asche'); S.f.staub=1; sfx('slide'); return 'Du wirfst die Asche in die Luft. Feiner Staub wirbelt hoch – und plötzlich ist der <b>Mondstrahl sichtbar</b>: ein silberner Faden, der schräg durch die Halle fällt.'; }}},
  {id:'sonne',r:[205,250,200,205],act:()=>S.f.hell?'Ein Altar mit einer steinernen <b>Sonne</b>.':'Ein Altar. Im Dunkeln erkennst du nur eine runde Form.'},
  {id:'tuer',r:[455,300,155,155],act:()=>S.f.licht?'Die Tür steht offen. Dahinter führt ein Gang tiefer in den Tempel.':(S.f.hell?'Eine schwere Steintür. Kein Griff, kein Schloss. Sie muss sich anders öffnen lassen.':'Dort ist etwas Großes, Dunkles. Eine Tür?'),
   no:{machete:'Die Machete würde nur abbrechen.'}},
  {id:'mond',r:[615,250,195,205],act:()=>S.f.hell?'Ein Altar mit einer steinernen <b>Mondsichel</b>.':'Ein Altar. Im Dunkeln erkennst du nur eine Sichel.'},
  {id:'jaguar',r:[860,250,215,250],act(){ const f=S.f;
    if(f.licht){ if(!f.linse){ f.linse=1; give('linse'); sfx('pick'); setTimeout(win,2200); return 'In dem Fach liegt, auf rotem Stoff, eine <b>Kristalllinse</b>. Sie glimmt von innen. Das Auge des Jaguars!'; } return 'Das Fach ist leer.'; }
    return f.hell?'Ein Altar mit einem fauchenden <b>Jaguarkopf</b>. Seine Augen sind leere Höhlen.':'Ein Altar. Im Dunkeln glaubst du, Zähne zu sehen.'; }},
  {id:'spiegel',r:[140,455,640,300],act(){ const f=S.f;
    if(!f.hell) return 'Große, dunkle Platten auf steinernen Sockeln. Im Dunkeln erkennst du nicht mehr.';
    if(!f.platte) return 'Drei Spiegel aus Obsidian auf drehbaren Sockeln – der vierte Sockel rechts ist <b>leer</b>.'+(f.sauber?'':' Und alle sind stumpf vor Staub.');
    if(!f.sauber) return 'Vier Spiegel aus Obsidian. Aber sie sind <b>stumpf vor Staub</b> – so spiegeln sie nichts.';
    if(!f.staub) return 'Die Spiegel sind blank. Aber wie sollst du sie ausrichten, wenn du den Mondstrahl kaum siehst?';
    if(f.licht) return 'Die Spiegel stehen richtig.';
    openSpiegel(); return 'Die Spiegel.'; },
   no:{kalebasse:'Die Kalebasse ist leer.',machete:'Kratzen würde den Obsidian zerkratzen.',asche:'Asche auf die Spiegel? Dann sind sie noch stumpfer.'},
   use:{kalebasseW(){ if(!S.f.hell) return 'Im Dunkeln siehst du nicht, was du putzt.'; take('kalebasseW'); give('kalebasse'); S.f.sauber=1; sfx('slide'); return 'Du gießt Wasser über die Spiegel und wischst mit dem Ärmel nach. Der Obsidian wird <b>blank</b> und spiegelt das Fackellicht.'+(S.f.platte?'':' Den vierten Sockel musst du noch bestücken.'); }}},
  {id:'sockel4',r:[905,560,170,350],act:()=>S.f.platte?'Die Spiegelplatte sitzt fest.':(S.f.hell?'Ein leerer Sockel. Hier fehlt eine Spiegelplatte.':'Ein steinerner Sockel.'),
   use:{spiegelplatte(){ take('spiegelplatte'); S.f.platte=1; sfx('click'); return 'Die Platte rastet mit einem satten Klacken in den Sockel ein. <b>Vier Spiegel</b>.'+(S.f.sauber?'':' Aber auch diese ist staubig.'); }},
   no:{kalebasseW:'Hier ist noch gar kein Spiegel.'}},
  {id:'becken',r:[420,895,395,150],act:()=>'Ein flaches Steinbecken, randvoll mit Regenwasser.',
   use:{kalebasse(){ take('kalebasse'); give('kalebasseW'); sfx('slide'); return 'Du füllst die Kalebasse mit Regenwasser.'; }},
   no:{asche:'Nasse Asche staubt nicht mehr.',kalebasseW:'Die Kalebasse ist schon voll.'}},
  {id:'kohle',r:[0,1035,370,360],act(){ if(!S.f.hell) return 'Eine große steinerne Schale. Riecht nach altem Feuer.'; if(!S.f.asche){ S.f.asche=1; give('asche'); return 'Ein steinernes Kohlebecken voller kalter <b>Asche</b>. Du nimmst eine Handvoll.'; } return 'Nur noch ein Rest Asche.'; },
   no:{fackelAn:'Die Asche ist längst kalt. Da brennt nichts mehr.'}},
  {id:'seite',r:[395,1150,230,140],vis:()=>!S.f.seite4,act(){ if(!S.f.hell) return 'Etwas Helles liegt auf dem Boden.'; S.f.seite4=1; give('seite4'); return 'Auf dem Boden liegt eine <b>Seite aus Amalias Feldbuch</b>, mit einem Steinchen beschwert.'; }},
  {id:'schutt',r:[700,1050,386,398],act(){ const f=S.f;
    if(!f.hell) return 'Ein Haufen Steine. Im Dunkeln stolperst du fast darüber.';
    if(!f.platte&&!has('spiegelplatte')) return 'Ein Schutthaufen. Darunter ragt die <b>Kante einer schwarzen Platte</b> hervor. Die Steine sind viel zu schwer, um sie mit bloßen Händen zu bewegen.';
    return 'Nur noch Schutt.'; },
   no:{federmesser:'Das Federmesser würde sofort abbrechen.',kalebasse:'Damit kannst du nicht hebeln.'},
   use:{machete(){ if(!S.f.hell) return 'Im Dunkeln siehst du nicht, wo du ansetzen sollst.'; if(S.f.platte||has('spiegelplatte')) return 'Hier liegt nichts mehr.'; give('spiegelplatte'); S.f.schutt=1; sfx('pick'); return 'Du setzt die Machete als Hebel an. Ein Stein rollt zur Seite – und du ziehst eine <b>Spiegelplatte</b> aus Obsidian hervor. Heil!'; }}}
 ],
 hint(){ const f=S.f;
  if(!f.hell) return ['Mit der Fackel in der Hand siehst du nur ein paar Schritte weit.','Links an der Wand ist ein Fackelhalter.','Steck die brennende Fackel in den Halter.'];
  if(!f.seite4) return ['Amalia war hier.','Auf dem Boden liegt eine Seite aus ihrem Feldbuch.'];
  if(!f.platte){
   if(!has('spiegelplatte')) return ['Einem Sockel fehlt sein Spiegel.','Unter dem Schutt rechts ragt eine schwarze Platte hervor.','Benutze die Machete als Hebel am Schutthaufen.'];
   return ['Die Platte gehört auf den leeren Sockel.','Benutze die Spiegelplatte am leeren Sockel rechts.']; }
  if(!f.sauber){
   if(has('kalebasse')) return ['Die Spiegel sind stumpf vor Staub.','Mit Wasser würden sie blank. Im Becken unter dem Schacht ist Regenwasser.','Fülle die Kalebasse am Becken und gieß sie über die Spiegel.'];
   return ['Jetzt die Spiegel putzen.','Benutze die Kalebasse mit Wasser an den Spiegeln.']; }
  if(!f.staub){
   if(!has('asche')) return ['Amalia schreibt: Den Strahl sieht man nur, wenn Staub in der Luft liegt.','Im Kohlebecken links liegt alte Asche.'];
   return ['Jetzt den Strahl sichtbar machen.','Wirf die Asche in den Mondstrahl unter dem Schacht.']; }
  if(!f.licht) return ['Der Strahl muss den Jaguar treffen – nicht Sonne, nicht Mond.','Der Strahl kommt unten links herein und geht nach oben. Jeder Spiegel lenkt ihn um eine Ecke. Quer stehende Spiegel schlucken ihn.','Von unten links nach oben rechts: Strahl nach rechts, dann nach unten, dann nach rechts, dann hinauf zum Jaguar. Die Spiegel stehen: / \\ \\ /'];
  return ['Der Jaguar-Altar hat sich geöffnet.','Tippe auf das Fach am Jaguar-Altar.']; },
 end:['Kapitel 4 geschafft','Du hältst das Auge des Jaguars in der Hand. Es ist warm, als hätte es auf dich gewartet.<br><br>Du nimmst die Fackel wieder aus dem Halter. Hinter der offenen Tür führt ein Gang nach oben – und von dort hörst du eine Stimme. „Lou? Lou, bist du das?“'],
 ov(f){
  const seite=!f.seite4&&f.hell?`<g transform="rotate(-8 510 1220)"><rect x="440" y="1175" width="140" height="95" rx="4" fill="#efe1bf" stroke="#8a6a35" stroke-width="2"/><path d="M455 1195h100M455 1210h90M455 1225h105M455 1240h70" stroke="#6b5233" stroke-width="3" opacity=".6"/><circle cx="560" cy="1250" r="12" fill="#6b6155"/></g>`:'';
  return [`${f.hell?'':`<rect x="15" y="160" width="140" height="280" fill="#05070b" opacity=".0"/>`}
  ${f.hell&&f.platte&&f.sauber?`<image href="${A('p_spiegel.webp')}" x="135" y="450" width="850" height="300"/>`:''}
  ${f.hell&&f.platte&&!f.sauber?`<g transform="translate(905 465)"><rect x="0" y="0" width="160" height="260" fill="#151517" opacity=".92"/><rect x="6" y="6" width="148" height="248" fill="#3b3d42" opacity=".35"/></g>`:''}
  ${f.hell&&(f.schutt||f.platte)?`<image href="${A('p_schutt.webp')}" x="560" y="890" width="526" height="558"/>`:''}
  ${f.hell&&f.asche?`<image href="${A('p_becken.webp')}" x="0" y="1030" width="375" height="380"/>`:''}
  ${f.licht?`<image href="${A('p_fach.webp')}" x="915" y="375" width="150" height="115"/><image href="${A('p_tuer4.webp')}" x="445" y="285" width="180" height="215"/>`:''}
  ${seite}`,
  `${f.staub?`<defs><linearGradient id="beamG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f0ff" stop-opacity=".55"/><stop offset="1" stop-color="#e8f0ff" stop-opacity=".12"/></linearGradient></defs><path d="M600 70L690 70L700 930L590 930z" fill="url(#beamG)" class="flicker"/>${[[630,200],[660,330],[620,470],[675,600],[640,760],[612,860]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="3" fill="#fff" opacity=".8" class="flicker" style="animation-delay:-${i*.4}s"/>`).join('')}`:''}
  ${!f.hell&&has('fackelAn')?`<defs><radialGradient id="hand4" cx="543" cy="1300" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb35a" stop-opacity=".35"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#hand4)" class="flicker"/>`:''}`]; }
};

/* ================= KAPITEL 5: DIE KAMMER DES JAGUARS ================= */
const GEWICHT={federmesser:1,kompass:2,kalebasse:3,fackelAn:5,machete:8};
// Sternkarte: Schildkröte (Lösung) + andere Sternbilder + Streusterne. Koordinaten 0..1000
const KARTE_BILDER=[['schildkroete',680,600,300],['skorpion',230,280,280],['vogel',560,200,220],['schlange',240,760,260],['hirsch',860,230,220],['fledermaus',500,880,200]];
const KARTE_STREU=[[90,120],[150,520],[380,110],[420,470],[700,90],[930,420],[960,700],[880,900],[120,920],[360,580],[600,400],[80,640],[520,660],[760,800],[980,140],[330,950]];
function karteSterne(){
 const out=[];
 KARTE_BILDER.forEach(([k,cx,cy,sz])=>STERNE[k].p.forEach(([x,y])=>out.push({x:cx-sz/2+x/100*sz,y:cy-sz/2+y/100*sz,k})));
 KARTE_STREU.forEach(([x,y])=>out.push({x,y,k:''}));
 return out;
}
function openAmalia(){
 const f=S.f; let t;
 if(!f.seite5){ f.seite5=1; t='„Lou! Du bist es wirklich!“ Amalia lacht und hustet zugleich. „Mir geht es gut, nur der Knöchel ist verstaucht. Ich war zu gierig, Lou. Ich habe die Jaguarfigur von der Waage genommen – und rums, das Gitter fiel.“<br><br>Sie schiebt dir eine Seite durch die Stäbe. „Hier. Ich habe die Figur gewogen. Leg genau so viel in die Waagschale, dann hebt sich das Gitter. Das Auge – hast du das Auge? Gleich geht die Sonne auf!“'; sfx('pick'); }
 else if(!f.frei) t='„Genau 15 Lot, Lou. Was deine Sachen wiegen, steht in meiner Packliste – vorne im Feldbuch.“';
 else if(!f.auge) t='„Das Auge gehört in die leere Augenhöhle des Jaguars. Schnell!“';
 else if(!f.spalt) t='„Der Spalt in der Ostwand! Ein Stein steckt darin. Die Sonne muss hereinkönnen.“';
 else if(!f.karte) t='„Sieh nur, Lou! Eine Sternkarte! Zeichne sie – find das Sternbild, das heute Nacht im Osten stand.“';
 else t='„Du hast es gezeichnet. Du, Lou.“';
 dialog('Amalia',`<img src="${A('amalia.jpg')}" alt="" style="display:block;width:min(200px,55vw);margin:0 auto 10px;border-radius:8px;box-shadow:0 6px 18px #000a"><p>${t}</p>`);
}
function openWaage(){
 const f=S.f; if(!f.schale) f.schale=[];
 const draw=()=>{ const n=f.schale.length;
  return f.schale.map((k,i)=>`<img class="jPan" data-k="${k}" src="${A(ITEMS[k].i)}" alt="${tr(ITEMS[k].n)}" style="position:absolute;width:15%;left:${18+(i-(n-1)/2)*11}%;top:54%;cursor:pointer;filter:drop-shadow(0 3px 4px #000)">`).join(''); };
 const body=dialog('Die Waage',`<div class="jW" style="position:relative;width:100%;aspect-ratio:1"><img src="${A('waage.jpg')}" alt="" style="display:block;width:100%;border-radius:6px">${draw()}</div><p>${f.schale.length?'In der Schale liegt: '+f.schale.map(k=>tr(ITEMS[k].n)).join(', ')+'. Tippe einen Gegenstand an, um ihn zurückzunehmen.':'Die Waagschale ist leer. Leg Gegenstände aus deinem Gepäck hinein (Gegenstand wählen, dann auf die Schale tippen).'}</p>`);
 body.querySelector('.jW').addEventListener('click',e=>{ const im=e.target.closest('.jPan'); if(!im) return; const k=im.dataset.k; f.schale.splice(f.schale.indexOf(k),1); give(k); sfx('pick'); closeDialog(); render(); openWaage(); });
}
function openKarte(){
 const st=karteSterne(), sel=S.f.sel||(S.f.sel=[]);
 const dots=()=>st.map((p,i)=>`<g class="jSt" data-i="${i}" style="cursor:pointer"><circle cx="${p.x}" cy="${p.y}" r="27" fill="#000" fill-opacity=".001"/><circle cx="${p.x}" cy="${p.y}" r="17" fill="#fff6d8" opacity=".25"/><circle cx="${p.x}" cy="${p.y}" r="8" fill="#fff8e6"/>${sel.includes(i)?`<circle cx="${p.x}" cy="${p.y}" r="22" fill="none" stroke="#3a2a14" stroke-width="5"/>`:''}</g>`).join('');
 const body=dialog('Die Sternkarte',`<div style="position:relative;width:100%;aspect-ratio:1"><img src="${A('sternwand.jpg')}" alt="" style="display:block;width:100%;border-radius:6px"><svg viewBox="0 0 1000 1000" style="position:absolute;inset:0;width:100%;height:100%"><g id="jLines"></g><g id="jDots">${dots()}</g></svg></div><p>Das Auge wirft Lichtpunkte an die Wand – eine ganze Sternkarte. Tippe die Sterne des Sternbilds an, das heute Nacht im Osten stand. Dann zeichne.</p><button class="btn pri" id="jDraw">Zeichnen</button>`);
 const g=body.querySelector('#jDots');
 g.addEventListener('click',e=>{ const d=e.target.closest('.jSt'); if(!d) return; const i=+d.dataset.i, j=sel.indexOf(i); if(j<0) sel.push(i); else sel.splice(j,1); sfx('click'); g.innerHTML=dots(); });
 body.querySelector('#jDraw').addEventListener('click',()=>{
  const want=st.map((p,i)=>p.k==='schildkroete'?i:-1).filter(i=>i>=0);
  if(sel.length===want.length&&want.every(i=>sel.includes(i))){
   const c=STERNE.schildkroete, [k,cx,cy,sz]=KARTE_BILDER[0], X=v=>cx-sz/2+v[0]/100*sz, Y=v=>cy-sz/2+v[1]/100*sz;
   body.querySelector('#jLines').innerHTML=c.l.map(([a,b])=>`<line x1="${X(c.p[a])}" y1="${Y(c.p[a])}" x2="${X(c.p[b])}" y2="${Y(c.p[b])}" stroke="#3a2a14" stroke-width="7" stroke-linecap="round"/>`).join('');
   sfx('chime'); S.f.karte=1;
   setTimeout(()=>{ closeDialog(); render();
    if(S.f.frei){ say('Die Schildkröte. Sie steht genau in der Mitte des Lichts – und um sie herum Sterne, die auf keiner Karte der Welt verzeichnet sind. Amalia legt dir die Hand auf die Schulter.'); setTimeout(win,3000); }
    else say('Die Schildkröte! Hinter dem Gitter drückt Amalia das Gesicht an die Stäbe. „Lou … es ist wunderschön. Und jetzt hol mich bitte hier raus!“');
   },1500);
  } else { sfx('no'); say('Du zeichnest – aber die Linien ergeben kein Sternbild, das du kennst. Welches stand heute Nacht im Osten?'); closeDialog(); }
 });
}
const R5={
 title:'Die Kammer des Jaguars', chapter:'Kapitel 5', img:A('kammer.jpg'), introImg:A('intro5.jpg'), endImg:A('cover.jpg'),
 keep:['feldbuch','federmesser','kompass','machete','kalebasse','fackelAn','linse'],
 intro:['Der Gang führt steil hinauf. Am Ende: warmes Licht – und eine Stimme.','„Lou? Lou, bist du das?“','Du stolperst in eine kleine Kammer. Ein steinerner Jaguar blickt nach Osten. Und hinter einem Gitter aus Stein steht Amalia.'],
 firstMsg:'Amalia! Sie steht hinter einem steinernen Gitter und winkt dir zu. Tippe sie an, um mit ihr zu sprechen.',
 comboNo:{'linse+machete':'Vorsicht mit dem Auge!','fackelAn+linse':'Das Auge braucht Sonnenlicht, nicht Feuer.'},
 combos:[],
 cuts:[],
 hot:[
  {id:'amalia',r:[140,100,300,410],act(){ openAmalia(); return S.f.frei?'Amalia ist frei.':'Amalia hinter dem Gitter.'; },
   no:{linse:'„Behalte das Auge, Lou. Es gehört in den Jaguar, nicht zu mir.“',machete:'„Die Stäbe sind aus Stein, Lou. Da hilft keine Machete. Die Waage!“',fackelAn:'„Danke, ich habe meine Laterne.“',feldbuch:'„Behalte es. Es ist jetzt auch dein Feldbuch.“'}},
  {id:'fackelwand',r:[0,30,135,340],act:()=>'Eine Fackel an der Wand. Amalia muss sie angezündet haben.'},
  {id:'balken',r:[40,520,475,120],act:()=>'Ein steinerner Waagbalken. Links hängt die Schale, rechts führt eine Kette hinauf zum Gitter.'},
  {id:'schale',r:[0,880,285,180],act(){ if(S.f.frei) return 'Die Waagschale hängt jetzt tief. Das Gitter ist eingerastet.'; openWaage(); return 'Die Waagschale.'; },
   use:Object.fromEntries(Object.keys(GEWICHT).map(k=>[k,()=>{ if(S.f.frei) return 'Das Gitter ist schon oben.'; take(k); (S.f.schale||(S.f.schale=[])).push(k); sfx('click'); return `Du legst ${tr(ITEMS[k].n)} in die Schale.`; }])),
   no:{linse:'Das Auge auf die Waage? Niemals – das gehört in den Jaguar.',feldbuch:'Amalias Feldbuch gibst du nicht aus der Hand.',seite5:'Ein Blatt Papier wiegt so gut wie nichts.'}},
  {id:'hebel',r:[90,1070,330,220],act(){ const f=S.f;
    if(f.frei) return 'Der Hebel ist umgelegt.';
    const sum=(f.schale||[]).reduce((a,k)=>a+GEWICHT[k],0);
    if(!sum) return 'Du ziehst am Hebel. Die leere Schale schwingt hoch – nichts geschieht.';
    if(sum===15){ f.frei=1; (f.schale||[]).forEach(k=>give(k)); f.schale=[]; sfx('door'); render();
     if(f.karte) setTimeout(win,3000);
     return 'Du ziehst am Hebel. Die Schale senkt sich, die Kette spannt sich – und mit einem tiefen Grollen hebt sich das <b>Gitter</b>! Es rastet oben ein. Amalia humpelt heraus und schließt dich in die Arme. Du nimmst deine Sachen wieder aus der Schale.'; }
    sfx('no'); return 'Du ziehst am Hebel. Die Waage schwankt, die Kette ruckt – dann sackt alles zurück. Das Gitter bleibt unten.'; }},
  {id:'statue',r:[520,520,400,660],act:()=>'Ein gewaltiger Jaguar aus Stein. Er blickt nach Osten, zum Spalt in der Wand.'},
  {id:'auge',r:[640,300,280,200],act:()=>S.f.auge?'Das Auge sitzt in der Augenhöhle und schimmert.':'Der Kopf des Jaguars. Eine seiner Augenhöhlen ist <b>leer</b> – rund und glatt, als warte sie auf etwas.',
   use:{linse(){ take('linse'); S.f.auge=1; sfx('click'); render(); return sonne('Du setzt die Kristalllinse in die Augenhöhle. Sie passt genau – das <b>Auge des Jaguars</b> ist zurück.'); }},
   no:{machete:'Am Jaguar kratzen? Lieber nicht.',fackelAn:'Das Auge erwacht nicht durch Feuer.'}},
  {id:'spalt',r:[940,200,146,590],act:()=>S.f.spalt?'Durch den Spalt fällt das erste Sonnenlicht.':'Ein schmaler Spalt in der Ostwand. Ein Steinpfropfen steckt fest darin, an den Rändern schimmert rosa Morgenlicht.',
   no:{federmesser:'Der Pfropfen sitzt viel zu fest für das kleine Messer.',fackelAn:'Brennen kann Stein nicht.',kompass:'Ja, das ist Osten. Aber der Stein muss raus.'},
   use:{machete(){ if(S.f.spalt) return 'Der Spalt ist frei.'; S.f.spalt=1; sfx('door'); render(); return sonne('Du setzt die Machete als Hebel an. Ein Ruck – der Steinpfropfen poltert hinaus, und rosa-goldenes <b>Morgenlicht</b> fällt in die Kammer.'); }}},
  {id:'wand',r:[450,60,480,240],act(){ if(S.f.sonnenstrahl){ openKarte(); return 'Die Sternkarte.'; } return 'Eine glatte, dunkle Wand. Völlig leer.'; }}
 ],
 hint(){ const f=S.f;
  if(!f.seite5) return ['Amalia steht hinter dem Gitter.','Sprich mit ihr: Tippe Amalia an.'];
  if(!f.frei){
   const sum=(f.schale||[]).reduce((a,k)=>a+GEWICHT[k],0);
   return ['Das Gitter hebt sich, wenn genau 15 Lot in der Waagschale liegen.','Die Gewichte deiner Sachen stehen in der Packliste im Feldbuch. Welche ergeben zusammen 15?'+(sum?` (In der Schale liegen gerade ${sum} Lot.)`:''),'Leg Machete (8), Fackel (5) und Kompass (2) in die Schale – sonst nichts – und zieh den Hebel.']; }
  if(!f.auge) return ['Das Auge des Jaguars gehört zurück.','Setz die Kristalllinse in die leere Augenhöhle der Statue.'];
  if(!f.spalt) return ['Die Sonne muss den Jaguar erreichen.','Im Spalt der Ostwand steckt ein Steinpfropfen. Hebel ihn mit der Machete heraus.'];
  if(!f.karte) return ['Das Auge wirft eine Sternkarte an die Wand.','Tippe auf die Wand und markiere das Sternbild, das in Kapitel 3 im Osten stand. Deine Zeichnung ist im Feldbuch.','Es ist die Schildkröte: sechs Sterne im Kreis, einer darüber, einer in der Mitte.'];
  return ['Geschafft!','…']; },
 end:['Das Auge des Jaguars','Die Sonne steigt über den Dschungel, und die Sternkarte verblasst langsam an der Wand. Aber sie ist nicht verloren: Sie steht in Amalias Feldbuch – gezeichnet von dir.<br><br>„Weißt du, was das bedeutet, Lou?“, sagt Amalia leise. „Diese Entdeckung trägt deinen Namen. Nicht meinen.“<br><br><b>Ende.</b>'],
 ov(f){
  const pan=(f.schale||[]).map((k,i,a)=>`<image href="${A(ITEMS[k].i)}" x="${100+(i-(a.length-1)/2)*55}" y="880" width="80" height="80"/>`).join('');
  return [`${f.frei?`<image href="${A('p_gitter.webp')}" x="90" y="50" width="470" height="660"/><image href="${A('p_schale.webp')}" x="0" y="860" width="320" height="440"/>`:pan}
  ${f.auge?`<image href="${A('p_auge.webp')}" x="715" y="320" width="160" height="150"/>`:''}
  ${f.spalt?`<image href="${A('p_spalt.webp')}" x="930" y="150" width="156" height="660"/>`:''}`,
  `${f.sonnenstrahl?`<defs><linearGradient id="sunG" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity=".05"/></linearGradient><filter id="sunB"><feGaussianBlur stdDeviation="10"/></filter></defs><path d="M1010 320L1010 580L770 405L770 375z" fill="url(#sunG)" filter="url(#sunB)" class="flicker"/><circle cx="765" cy="390" r="28" fill="#fff" opacity=".6" class="flicker"/>${karteSterne().filter((p,i)=>i%2===0).map(p=>`<circle cx="${470+p.x*.45}" cy="${70+p.y*.22}" r="3.5" fill="#fff8e6" opacity=".9" class="flicker" style="animation-delay:-${(p.x%7)/3}s"/>`).join('')}`:''}`]; }
};
function sonne(t){ const f=S.f; if(f.auge&&f.spalt&&!f.sonnenstrahl){ f.sonnenstrahl=1; render(); sfx('chime'); return t+'<br><br>Ein Sonnenstrahl fällt durch den Spalt und trifft das Auge. Es glüht auf – und an der Wand erscheinen <b>Lichtpunkte</b>. Eine Sternkarte!'; } return t; }

R4.hot.push({...R4.hot.find(h=>h.id==='strahl'),id:'strahl2',r:[570,760,150,130]});
// rechter Teil der Brücke (hinauf zur Tür) verhält sich wie die Brücke
R2.hot.push({...R2.hot.find(h=>h.id==='bruecke'),id:'bruecke2',r:[770,420,200,135]});

return {
 id:'auge-des-jaguars',
 title:'Das Auge des Jaguars',
 genre:'Abenteuer',
 tagline:'Ein Sturm im Dschungel. Eine verschwundene Archäologin. Und ein Tempel, der sein Geheimnis nur einmal im Jahr preisgibt.',
 cover:A('cover.jpg'),
 size:[W,H],
 asset:A,
 items:ITEMS,
 rooms:[R1,R2,R3,R4,R5],
 firstMsg:'Tippe auf Dinge im Zelt, um sie zu untersuchen.'
};
}
