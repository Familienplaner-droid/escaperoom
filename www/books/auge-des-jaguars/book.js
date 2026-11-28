// Das Auge des Jaguars – Buch 2 (Abenteuer)
// Yucatán, 1926. Lou folgt den Zeichnungen ihrer Mentorin Amalia Ortiz bis in die Kammer des Jaguars.
export default function augeDesJaguars(api){
const {tr,tf,lang,S,give,take,has,say,sfx,tone,render,win,openLock,openSafe,openPaper,openPaperHTML,flash,cutStyle,room,dialog,closeDialog}=api;
const A=name=>'books/auge-des-jaguars/img/'+name;
const W=1086, H=1448;
const img=(src,st='')=>`<img src="${A(src)}" alt="" style="${st}">`;

/* ================= AMALIAS FELDBUCH ================= */
// Das Feldbuch wächst mit: Seiten aus früheren Kapiteln sind schon eingelegt, die aktuelle erst, wenn Lou sie gefunden hat.
const P_NOTIZ='<b>Auf dem Umschlag, in Amalias eiliger Schrift:</b><br><br>Lou, das Auge öffnet sich nur einmal im Jahr. <b>Morgen bei Sonnenaufgang.</b> Ich kann nicht warten, bis der Sturm vorbei ist.<br><br>Folge meinen Zeichnungen, Lou.<br><br>– A.';
const P_PACK='<b>Packliste für Mateos Maultiere</b> (Gewicht in Lot)<div style="display:grid;grid-template-columns:1fr auto;gap:0 14px;font-style:normal;margin-top:6px">'
 +[['Zelt',40],['Funkgerät',22],['Theodolit',14],['Machete',8],['Kochtopf',6],['Fackel',5],['Kalebasse (leer)',3],['Kompass',2],['Lous Federmesser',1]]
   .map(([n,g])=>`<span>${tr(n)}</span><span style="text-align:right">${g}</span>`).join('')+'</div>';
const P_SEITE1=()=>img('seite1_gross.webp','max-width:260px;margin:0 auto 10px')+'<b>Mein Tempel.</b> Drei Stufen, ganz oben der Jaguar. Dort wartet das Auge.<br><br>Die Kiste kennt den Weg dorthin, Lou. Du musst ihn nur auf der Karte finden.';
function feldbuchHTML(){
 const pg=[P_NOTIZ];
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
 kompass:{n:'Kompass',i:'kompass.png',d:'Amalias Taschenkompass aus Messing. Die Nadel zeigt zuverlässig nach Norden.'}
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
 soon:'Kapitel 2: Der Pfad am Cenote – bald verfügbar',
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
 end:['Kapitel 1 geschafft','Das Rauschen verstummt. Aber du hast genug gehört: Amalia ist am Tempel, und sie braucht dich vor Sonnenaufgang.<br><br>Du steckst ihr Feldbuch ein, den Kompass, die Karbidlampe. Dann trittst du hinaus in den Regen. Zum ersten Mal folgst du nicht nur – du gehst voran.'],
 ov(f){ return [`${f.becher?`<image href="${A('p_becher'+(f.lit?'':'_d')+'.webp')}" x="290" y="745" width="125" height="120"/>`:''}${f.kiste?`<image href="${A((f.inhalt?'p_kiste_leer':'p_kiste')+(f.lit?'':'_d')+'.webp')}" x="0" y="900" width="490" height="548"/>`:''}
 ${f.radio?`<circle cx="952" cy="532" r="28" fill="#ff9a3a" opacity=".35" class="flicker"/><circle cx="985" cy="532" r="24" fill="#ff9a3a" opacity=".3" class="flicker" style="animation-delay:-.7s"/><circle cx="1036" cy="526" r="18" fill="#ffb35a" opacity=".55" class="flicker"/>`:''}`,
 `<defs><radialGradient id="lantG" cx="585" cy="225" r="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd48a" stop-opacity=".35"/><stop offset=".5" stop-color="#ffb35a" stop-opacity=".08"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
  <radialGradient id="handG" cx="543" cy="1010" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff4d8" stop-opacity=".32"/><stop offset="1" stop-color="#fff4d8" stop-opacity="0"/></radialGradient></defs>
 ${f.lit?`<rect width="${W}" height="${H}" fill="url(#lantG)" class="flicker"/>`
  :`<rect width="${W}" height="${H}" fill="#cfe0ff" opacity="0"><animate attributeName="opacity" values="0;0;0;.22;0;.12;0;0;0;0" dur="9s" repeatCount="indefinite"/></rect>${has('karbidlampeAn')?`<rect width="${W}" height="${H}" fill="url(#handG)" class="flicker"/>`:''}`}
 <path d="M951 300v8" stroke="#bcd4ff" stroke-width="3" stroke-linecap="round" opacity=".7"><animate attributeName="transform" attributeType="XML" type="translate" values="0 0;0 70" dur="1.1s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="1.1s" repeatCount="indefinite"/></path>`]; }
};

return {
 id:'auge-des-jaguars',
 title:'Das Auge des Jaguars',
 genre:'Abenteuer',
 tagline:'Ein Sturm im Dschungel. Eine verschwundene Archäologin. Und ein Tempel, der sein Geheimnis nur einmal im Jahr preisgibt.',
 cover:A('intro1.jpg'),
 size:[W,H],
 asset:A,
 items:ITEMS,
 rooms:[R1],
 firstMsg:'Tippe auf Dinge im Zelt, um sie zu untersuchen.'
};
}
