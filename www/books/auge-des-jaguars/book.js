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
function feldbuchHTML(){
 const pg=[P_NOTIZ];
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
 soon:'Kapitel 4: Die Halle der Spiegel – bald verfügbar',
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
 end:['Kapitel 3 geschafft','Die Treppe hinter dem Tor führt hinab, nicht hinauf. Die Luft wird kühl, die Fackel flackert.<br><br>Unten öffnet sich eine Halle, so dunkel, dass das Licht der Fackel sich darin verliert. Irgendwo über dir fällt ein schmaler Strahl Mondlicht durch den Stein.'],
 ov(f){ const glow=has('fackelAn')&&!f.offen;
  return [`${f.wurzeln?`<image href="${A('p_stele.webp')}" x="0" y="90" width="245" height="1100"/>`:''}
  ${f.fackel?`<image href="${A('p_halter.webp')}" x="225" y="535" width="100" height="230"/>`:''}
  ${f.seite3?`<image href="${A('p_krug.webp')}" x="395" y="1065" width="360" height="290"/>`:''}
  ${f.offen?`<image href="${A('p_tor.webp')}" x="318" y="465" width="460" height="480"/>`:(f.griff?`<image href="${A('griff_rad.png')}" x="482" y="687" width="130" height="38"/>`:'')}`,
  `<defs><radialGradient id="torchG" cx="543" cy="1150" r="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb35a" stop-opacity=".28"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient></defs>${glow?`<rect width="${W}" height="${H}" fill="url(#torchG)" class="flicker"/>`:''}
  <circle cx="300" cy="60" r="2" fill="#fff" class="flicker"/><circle cx="905" cy="120" r="2" fill="#fff" class="flicker" style="animation-delay:-.8s"/><circle cx="640" cy="40" r="1.6" fill="#fff" class="flicker" style="animation-delay:-1.6s"/>`]; }
};

// rechter Teil der Brücke (hinauf zur Tür) verhält sich wie die Brücke
R2.hot.push({...R2.hot.find(h=>h.id==='bruecke'),id:'bruecke2',r:[770,420,200,135]});

return {
 id:'auge-des-jaguars',
 title:'Das Auge des Jaguars',
 genre:'Abenteuer',
 tagline:'Ein Sturm im Dschungel. Eine verschwundene Archäologin. Und ein Tempel, der sein Geheimnis nur einmal im Jahr preisgibt.',
 cover:A('intro1.jpg'),
 size:[W,H],
 asset:A,
 items:ITEMS,
 rooms:[R1,R2,R3],
 firstMsg:'Tippe auf Dinge im Zelt, um sie zu untersuchen.'
};
}
