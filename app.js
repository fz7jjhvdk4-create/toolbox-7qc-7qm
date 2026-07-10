/* ============================================================
   VERKTYGSLÅDAN 7QC & 7QM – interaktiv lärapp för studenter
   Vanilla JS, inga beroenden. Hash-routing: #/, #/verktyg/<id>,
   #/guide, #/quiz
   ============================================================ */

"use strict";

const app = document.getElementById("app");

/* ---------- Små hjälpfunktioner ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = n => n.toLocaleString("sv-SE", { maximumFractionDigits: 2 });

// Deterministisk slumpgenerator så att demos ser likadana ut vid omritning
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function gauss(rng) {
  // Box–Muller
  const u = Math.max(rng(), 1e-9), v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* ============================================================
   INNEHÅLL – de 14 verktygen
   ============================================================ */

const TOOLS = [
  /* ---------------- 7QC ---------------- */
  {
    id: "datainsamling",
    family: "qc", num: 1,
    icon: "📋",
    name: "Datainsamling",
    aka: "Även kallat: streckdiagram, checklista, check sheet",
    oneliner: "Basera beslut på fakta – samla in data enkelt och systematiskt medan arbetet pågår.",
    facts: { data: "Numerisk (räkna händelser)", anvands: "Först i förbättringsarbetet", svarighet: "★☆☆ Lätt", resultat: "Faktaunderlag" },
    what: `<p><strong>Datainsamling med streckdiagram</strong> är det enklaste av alla kvalitetsverktyg – och kanske det viktigaste. Utan fakta blir förbättringsarbete gissningslek. Ett streckdiagram (checklista) är ett förberett formulär där du drar ett streck varje gång en viss händelse inträffar, till exempel en feltyp.</p>
      <p>Poängen är att göra datainsamlingen <strong>så enkel att den faktiskt blir gjord</strong> – direkt vid källan, medan arbetet pågår. Efteråt ser du direkt vilka fel som är vanligast, och datan kan användas i t.ex. ett <a href="#/verktyg/pareto">paretodiagram</a>.</p>`,
    steps: [
      ["Bestäm vad du vill veta", "Formulera en tydlig fråga, t.ex. \"Vilka feltyper förekommer, och hur ofta?\""],
      ["Definiera kategorierna", "Lista de händelser/feltyper du ska räkna. Ta med en kategori \"Övrigt\"."],
      ["Utforma formuläret", "Gör det så enkelt att ett streck räcker – ingen ska behöva skriva meningar."],
      ["Samla in under en bestämd period", "T.ex. en dag, en vecka eller 100 tillverkade enheter. Anteckna även när och var."],
      ["Summera och analysera", "Räkna strecken. Vilken kategori dominerar? Gå vidare med t.ex. paretodiagram."]
    ],
    demoHint: "Klicka på +1 för att pricka av fel – eller simulera en hel dags produktion.",
    watchouts: [
      "Otydliga kategorier ger otillförlitlig data – definiera exakt vad som räknas som t.ex. \"repa\".",
      "Glöm inte att anteckna <b>när, var och av vem</b> datan samlades in – det behövs för stratifiering senare.",
      "Samla inte in mer än du behöver. En enkel fråga → ett enkelt formulär."
    ],
    check: {
      q: "Varför är streckdiagram ett så bra sätt att samla data på?",
      options: [
        "Det är så enkelt att det faktiskt blir gjort, direkt där händelserna sker",
        "Det ger automatiskt statistisk signifikans",
        "Det ersätter behovet av att analysera datan",
        "Det visar orsakssamband mellan variabler"
      ],
      correct: 0,
      explain: "Precis! Styrkan är enkelheten – ett streck per händelse, vid källan. Analysen (t.ex. pareto) kommer sen."
    }
  },
  {
    id: "histogram",
    family: "qc", num: 2,
    icon: "📊",
    name: "Histogram",
    aka: "Även kallat: stapeldiagram över fördelning, frekvensdiagram",
    oneliner: "Se hur dina mätvärden fördelar sig – var ligger centrum, hur stor är spridningen och har fördelningen en konstig form?",
    facts: { data: "Numerisk (mätvärden)", anvands: "Förstå variation", svarighet: "★★☆ Medel", resultat: "Bild av fördelningen" },
    what: `<p>Ett <strong>histogram</strong> visar hur ofta olika mätvärden förekommer. Mätområdet delas in i klasser (intervall) och en stapel ritas för varje klass – ju högre stapel, desto fler värden i det intervallet.</p>
      <p>Histogrammet svarar på tre frågor: <strong>Var ligger centrum?</strong> (läget), <strong>hur stor är spridningen?</strong> och <strong>vilken form har fördelningen?</strong> Formen avslöjar mycket: en tvåtoppig fördelning tyder ofta på att data från två olika källor blandats – dags att <a href="#/verktyg/stratifiering">stratifiera</a>!</p>`,
    steps: [
      ["Samla minst ~50 mätvärden", "Ju fler värden, desto tydligare bild av fördelningen."],
      ["Dela in i klasser", "Tumregel: antal klasser ≈ √(antal värden). 100 värden → ca 10 klasser, lika breda."],
      ["Räkna värden per klass", "Hur många mätvärden hamnar i varje intervall?"],
      ["Rita staplarna", "En stapel per klass, höjd = antal värden."],
      ["Tolka formen", "Symmetrisk och klockformad? Skev? Tvåtoppig? Avhuggen? Varje form berättar något om processen."]
    ],
    demoHint: "Byt fördelningsform och dra i reglaget för antal klasser – se hur tolkningen förändras.",
    watchouts: [
      "För få klasser döljer detaljer, för många ger ett hackigt och svårläst diagram.",
      "En tvåtoppig fördelning betyder ofta att två processer (maskiner, skift, leverantörer) blandats ihop.",
      "En avhuggen fördelning kan tyda på att någon sorterat bort värden utanför toleransen – datan ljuger!"
    ],
    check: {
      q: "Ditt histogram över borrade hål har två tydliga toppar. Vad är den mest troliga förklaringen?",
      options: [
        "Data från två olika källor (t.ex. två maskiner) har blandats",
        "Processen är helt stabil",
        "Du har använt för få mätvärden",
        "Mätinstrumentet är trasigt"
      ],
      correct: 0,
      explain: "Rätt! Tvåtoppighet är den klassiska signalen om blandade källor. Stratifiera datan – dela upp per maskin, skift eller operatör – så syns det."
    }
  },
  {
    id: "pareto",
    family: "qc", num: 3,
    icon: "📉",
    name: "Paretodiagram",
    aka: "Bygger på 80/20-regeln – \"de vitala få och de triviala många\"",
    oneliner: "Prioritera rätt: några få feltyper står oftast för merparten av alla problem. Hitta dem och börja där.",
    facts: { data: "Numerisk (frekvens/kostnad)", anvands: "Prioritera problem", svarighet: "★☆☆ Lätt", resultat: "Prioriteringsordning" },
    what: `<p>Ett <strong>paretodiagram</strong> är ett stapeldiagram där problemen sorterats i storleksordning, med störst först. Ovanpå ritas en kurva som visar den <strong>ackumulerade andelen</strong> i procent.</p>
      <p>Diagrammet bygger på <strong>Pareto-principen (80/20-regeln)</strong>: en liten andel av feltyperna orsakar oftast en stor andel av problemen. Genom att angripa "de vitala få" först får du maximal effekt av din förbättringsinsats. Tips: rita gärna paretodiagrammet både efter <em>antal</em> fel och efter <em>kostnad</em> – de kan ge olika prioritering!</p>`,
    steps: [
      ["Samla data per feltyp", "Använd t.ex. ett streckdiagram under en bestämd period."],
      ["Sortera fallande", "Störst kategori först. \"Övrigt\" placeras alltid sist, oavsett storlek."],
      ["Rita staplarna", "Vänster y-axel visar antal (eller kostnad)."],
      ["Rita den ackumulerade kurvan", "Höger y-axel visar ackumulerad procent av totalen."],
      ["Identifiera de vitala få", "Vilka 2–3 kategorier står för ~80 %? Angrip dem först – t.ex. med ett ishikawadiagram."]
    ],
    demoHint: "Ändra antalet fel med +/– och se hur diagrammet sorterar om sig. De orange staplarna är \"de vitala få\".",
    watchouts: [
      "Flest fel är inte alltid dyrast – gör gärna ett paretodiagram viktat efter kostnad också.",
      "Kategorin \"Övrigt\" ska stå sist. Om den blir störst av alla är dina kategorier för grova.",
      "Paretodiagrammet säger <b>vad</b> du ska angripa, inte <b>varför</b> felet uppstår – där tar ishikawadiagrammet vid."
    ],
    check: {
      q: "Vad visar den böjda kurvan i ett paretodiagram?",
      options: [
        "Den ackumulerade andelen av totalen, i procent",
        "Trenden över tid",
        "Processens styrgränser",
        "Medelvärdet för varje kategori"
      ],
      correct: 0,
      explain: "Rätt! Kurvan summerar staplarna från vänster till höger och visar t.ex. att de två största feltyperna tillsammans står för 75 % av alla fel."
    }
  },
  {
    id: "ishikawa",
    family: "qc", num: 4,
    icon: "🐟",
    name: "Ishikawadiagram",
    aka: "Även kallat: fiskbensdiagram, orsak-verkan-diagram",
    oneliner: "Kartlägg alla tänkbara orsaker till ett problem – strukturerat efter de sju M:en.",
    facts: { data: "Verbal (idéer om orsaker)", anvands: "Hitta rotorsaker", svarighet: "★★☆ Medel", resultat: "Karta över möjliga orsaker" },
    what: `<p>Ett <strong>ishikawadiagram</strong> ser ut som ett fiskben: problemet skrivs i "huvudet" och de stora "benen" är orsakskategorier. På varje ben fäster du möjliga orsaker – och orsaker till orsakerna, som småben.</p>
      <p>Klassiska kategorier är <strong>de sju M:en</strong>: Människa, Maskin, Metod, Material, Mätning, Miljö och Management (ledning). Diagrammet görs bäst i grupp: brainstorma brett, fråga <strong>"varför?" flera gånger</strong> på varje orsak (5 varför) och gräv djupare tills ni närmar er rotorsaken.</p>`,
    steps: [
      ["Formulera problemet tydligt", "Skriv det i fiskens huvud, t.ex. \"Kaffet i fikarummet smakar illa\"."],
      ["Rita benen", "Använd de sju M:en som kategorier – eller egna kategorier som passar problemet."],
      ["Brainstorma orsaker i grupp", "Alla idéer är välkomna. Placera varje orsak på rätt ben."],
      ["Fråga \"varför?\" på varje orsak", "Gräv djupare: en orsak till en orsak blir ett småben. Upprepa ~5 gånger."],
      ["Ringa in de mest troliga", "Rösta eller diskutera – och verifiera sedan med data innan ni åtgärdar!"]
    ],
    demoHint: "Klicka på ett ben (kategori) för att se exempel på orsaker – och lägg till egna.",
    watchouts: [
      "Diagrammet visar <b>möjliga</b> orsaker – inte bevisade. Verifiera med data innan du åtgärdar.",
      "Sluta inte vid första orsaken. Fråga \"varför?\" tills du når något som går att åtgärda.",
      "Gör det i grupp! En ensam person missar lätt hela kategorier av orsaker."
    ],
    check: {
      q: "Vilket påstående om ishikawadiagrammet är korrekt?",
      options: [
        "Det strukturerar möjliga orsaker – som sedan måste verifieras med data",
        "Det bevisar vilken orsak som är rotorsaken",
        "Det används för att övervaka processen över tid",
        "Det kräver minst 50 numeriska mätvärden"
      ],
      correct: 0,
      explain: "Rätt! Fiskbenet är ett idé- och struktureringsverktyg. Vilken orsak som faktiskt är boven avgörs genom datainsamling och analys."
    }
  },
  {
    id: "stratifiering",
    family: "qc", num: 5,
    icon: "🗂️",
    name: "Uppdelning",
    aka: "Även kallat: stratifiering",
    oneliner: "Dela upp datan efter källa – maskin, skift, operatör – och låt dolda mönster träda fram.",
    facts: { data: "Numerisk (uppdelad i grupper)", anvands: "Avslöja dolda skillnader", svarighet: "★☆☆ Lätt", resultat: "Synliga gruppskillnader" },
    what: `<p><strong>Uppdelning (stratifiering)</strong> innebär att du delar upp din data i grupper efter var den kommer ifrån: olika maskiner, skift, operatörer, leverantörer eller veckodagar. Sedan jämför du grupperna.</p>
      <p>Ofta ser data helt normal ut när allt är hopblandat – men när du delar upp den träder mönstren fram: <em>"Aha, det är bara maskin B som driver!"</em> Stratifiering är inte ett eget diagram utan ett <strong>arbetssätt</strong> som förstärker de andra verktygen: stratifierade histogram, spridningsdiagram och styrdiagram säger mycket mer än ostratifierade.</p>`,
    steps: [
      ["Planera redan vid insamlingen", "Anteckna alltid maskin, skift, operatör, datum m.m. – annars går datan inte att dela upp."],
      ["Välj en uppdelningsgrund", "Vad misstänker du kan skilja? Maskin? Skift? Leverantör?"],
      ["Dela upp och rita om", "Rita samma diagram, men med grupperna markerade i olika färg – eller som separata diagram."],
      ["Jämför grupperna", "Skiljer sig läge, spridning eller trend? Då har du hittat ett spår!"],
      ["Upprepa med nästa grund", "Ingen skillnad per maskin? Prova per skift, per material …"]
    ],
    demoHint: "Datan ser rörig ut … tryck på knappen och stratifiera per maskin – så avslöjas mönstret!",
    watchouts: [
      "Utan bakgrundsinformation (vem, var, när) kan du inte stratifiera – planera insamlingen i förväg.",
      "En skillnad mellan grupper är en ledtråd, inte ett bevis – följ upp med mer analys.",
      "Blandad data kan dölja problem helt: två skeva grupper kan tillsammans se ut som en fin normalfördelning."
    ],
    check: {
      q: "Varför är det viktigt att anteckna maskin, skift och operatör redan när datan samlas in?",
      options: [
        "Utan den informationen går datan inte att dela upp och jämföra i efterhand",
        "Det ökar antalet mätvärden",
        "Det gör histogrammet mer symmetriskt",
        "Det krävs för att beräkna styrgränser"
      ],
      correct: 0,
      explain: "Rätt! Stratifiering kräver att varje mätvärde bär med sig sin bakgrund. Det är billigt att anteckna vid källan – och omöjligt att rekonstruera efteråt."
    }
  },
  {
    id: "samband",
    family: "qc", num: 6,
    icon: "✳️",
    name: "Sambandsdiagram",
    aka: "Även kallat: spridningsdiagram, scatterplot",
    oneliner: "Hänger två variabler ihop? Plotta dem mot varandra och se om det finns ett samband.",
    facts: { data: "Numerisk (par av värden)", anvands: "Undersöka samband", svarighet: "★★☆ Medel", resultat: "Sambandets styrka & riktning" },
    what: `<p>Ett <strong>sambandsdiagram</strong> visar par av mätvärden som punkter: en variabel på x-axeln, en på y-axeln. Exempel: ugnstemperatur mot lackens glans, eller pluggtimmar mot tentaresultat.</p>
      <p>Punktmolnets form avslöjar sambandet: lutar det uppåt finns ett <strong>positivt samband</strong>, nedåt ett <strong>negativt</strong>, och ett runt moln utan riktning betyder <strong>inget samband</strong>. Styrkan kan mätas med korrelationskoefficienten <strong>r</strong> (mellan −1 och +1). Men kom ihåg: <strong>korrelation är inte kausalitet</strong> – att två saker samvarierar bevisar inte att den ena orsakar den andra.</p>`,
    steps: [
      ["Välj två variabler", "En misstänkt orsak (x) och en effekt (y), t.ex. temperatur och glans."],
      ["Samla parvisa mätningar", "Minst ~30 par där båda värdena hör till samma tillfälle/enhet."],
      ["Plotta punkterna", "x-värdet ger läget i sidled, y-värdet i höjdled."],
      ["Bedöm mönstret", "Riktning (upp/ner), styrka (tight/spritt) och form (linjärt/böjt?)."],
      ["Tolka försiktigt", "Samband = ledtråd. Kan en tredje variabel ligga bakom? Verifiera med experiment."]
    ],
    demoHint: "Dra i reglaget och se hur punktmolnet ändrar form när sambandet blir starkare eller svagare.",
    watchouts: [
      "Korrelation ≠ kausalitet! Glassförsäljning och drunkningsolyckor samvarierar – båda beror på sommarvärmen.",
      "En enda extrem punkt (outlier) kan skapa eller dölja ett samband – titta alltid på diagrammet, inte bara på r-värdet.",
      "r mäter bara <b>linjära</b> samband. Ett tydligt U-format samband kan ge r ≈ 0."
    ],
    check: {
      q: "Ett sambandsdiagram visar starkt positivt samband mellan glassförsäljning och drunkningsolyckor. Vad är rimligast?",
      options: [
        "En tredje variabel (sommarvärme) påverkar båda",
        "Glass orsakar drunkning",
        "Drunkningsolyckor ökar glassförsäljningen",
        "Diagrammet måste vara felritat"
      ],
      correct: 0,
      explain: "Rätt! Klassikern. Samvariation kan bero på en bakomliggande variabel – därför bevisar korrelation aldrig orsakssamband."
    }
  },
  {
    id: "styrdiagram",
    family: "qc", num: 7,
    icon: "📈",
    name: "Styrdiagram",
    aka: "Även kallat: kontrolldiagram, control chart",
    oneliner: "Övervaka processen över tid och skilj naturlig slumpvariation från verkliga förändringar.",
    facts: { data: "Numerisk (i tidsordning)", anvands: "Övervaka stabilitet", svarighet: "★★★ Svårare", resultat: "Stabil eller ej?" },
    what: `<p>Ett <strong>styrdiagram</strong> plottar mätvärden i tidsordning tillsammans med tre linjer: centrallinjen (CL, processens medelvärde) samt en övre och undre <strong>styrgräns</strong> (UCL/LCL), vanligen placerade ±3 standardavvikelser från centrallinjen.</p>
      <p>All processdata varierar. Konsten är att skilja på <strong>slumpmässig variation</strong> (naturligt brus som alltid finns) och <strong>urskiljbara orsaker</strong> (något har faktiskt hänt – ett verktyg slits, en ny operatör, nytt materialparti). Punkter utanför styrgränserna, eller tydliga mönster, signalerar urskiljbara orsaker. Då ska man agera – men att "rätta till" en stabil process efter varje slumpavvikelse gör den bara sämre!</p>`,
    steps: [
      ["Mät i tidsordning", "Ta stickprov med jämna mellanrum och plotta värdena i den ordning de uppstår."],
      ["Beräkna centrallinjen", "CL = medelvärdet av de första ~20–25 punkterna (när processen verkar stabil)."],
      ["Beräkna styrgränserna", "UCL/LCL = CL ± 3 standardavvikelser. OBS: detta är inte toleransgränser!"],
      ["Övervaka löpande", "Plotta varje ny punkt. Ligger allt lugnt mellan gränserna utan mönster? Bra – rör inget!"],
      ["Agera på signaler", "Punkt utanför gränserna, 7+ punkter på samma sida om CL, eller tydlig trend → leta urskiljbar orsak."]
    ],
    demoHint: "Processen är stabil … tryck på \"Inför en störning\" och se hur styrdiagrammet avslöjar den.",
    watchouts: [
      "Styrgränser ≠ toleransgränser! Styrgränser beskriver vad processen <b>gör</b>, toleranser vad kunden <b>kräver</b>.",
      "Överstyrning: att justera en stabil process efter varje enskild avvikelse <b>ökar</b> variationen.",
      "Även punkter innanför gränserna kan signalera problem – t.ex. en lång svit på samma sida om centrallinjen."
    ],
    check: {
      q: "En punkt hamnar utanför den övre styrgränsen. Vad betyder det?",
      options: [
        "Sannolikt en urskiljbar orsak – undersök vad som hänt i processen",
        "Ingenting – enstaka punkter får ligga var som helst",
        "Att kundens toleranskrav inte uppfylls",
        "Att man ska justera processen lite varje dag framöver"
      ],
      correct: 0,
      explain: "Rätt! Utanför ±3σ är slumpen en mycket osannolik förklaring. Något har förändrats – hitta orsaken innan du justerar."
    }
  },

  /* ---------------- 7QM ---------------- */
  {
    id: "slaktskap",
    family: "qm", num: 1,
    icon: "🗒️",
    name: "Släktskapsdiagram",
    aka: "Även kallat: affinitetsdiagram, KJ-metoden",
    oneliner: "Skapa ordning i ett kaos av idéer och åsikter – gruppera lappar som hör ihop och sätt rubriker.",
    facts: { data: "Verbal (idéer, åsikter)", anvands: "Strukturera brainstorming", svarighet: "★☆☆ Lätt", resultat: "Grupperade teman" },
    what: `<p>Ett <strong>släktskapsdiagram</strong> används när du har många idéer, åsikter eller kundcitat i en enda röra – t.ex. efter en brainstorming eller kundundersökning. Varje utsaga skrivs på en egen lapp, och lapparna grupperas efter <strong>innehållsligt släktskap</strong>: vilka hör ihop?</p>
      <p>Grupperingen görs helst under tystnad och med magkänsla – låt mönstren växa fram i stället för att tvinga in lapparna i förutbestämda fack. Till sist får varje grupp en rubrik som sammanfattar temat. Resultatet: överblick, teman och en bra startpunkt för t.ex. ett <a href="#/verktyg/relation">relationsdiagram</a>.</p>`,
    steps: [
      ["Formulera frågan", "T.ex. \"Varför blir tentaplugget stressigt?\" Skriv den synligt för alla."],
      ["En idé per lapp", "Brainstorma. Korta, konkreta formuleringar – gärna 20–60 lappar."],
      ["Gruppera under tystnad", "Alla flyttar lappar samtidigt utan att diskutera. Lappar som hör ihop hamnar tillsammans."],
      ["Sätt rubriker", "Ge varje grupp en rubrik som fångar temat. Diskutera nu!"],
      ["Gå vidare", "Rubrikerna blir input till relationsdiagram, träddiagram eller omröstning."]
    ],
    demoHint: "Klicka på en gul lapp och sedan på den grupp där du tycker den hör hemma. Osäker? Visa förslaget!",
    watchouts: [
      "Det finns inget facit – olika grupperingar kan vara lika bra. Poängen är samtalet och överblicken.",
      "Gruppera under tystnad först – annars styr den som pratar mest.",
      "En lapp som inte passar någonstans får bilda en egen grupp. Tvinga inte."
    ],
    check: {
      q: "Vilken typ av data är släktskapsdiagrammet gjort för?",
      options: [
        "Verbal data – idéer, åsikter och utsagor i ord",
        "Numerisk mätdata i tidsordning",
        "Parvisa mätvärden av två variabler",
        "Frekvensdata sorterad i storleksordning"
      ],
      correct: 0,
      explain: "Rätt! Släktskapsdiagrammet är det klassiska första steget när man har mycket ord och lite struktur. Numerisk data hanteras av 7QC-verktygen."
    }
  },
  {
    id: "relation",
    family: "qm", num: 2,
    icon: "🕸️",
    name: "Relationsdiagram",
    aka: "Även kallat: släktskapsdiagrammets analytiska kusin, interrelationship digraph",
    oneliner: "Rita pilar mellan problemen och se vad som driver vad – hitta den drivande rotorsaken.",
    facts: { data: "Verbal (orsakssamband)", anvands: "Förstå komplexa orsaksnät", svarighet: "★★☆ Medel", resultat: "Drivande orsaker utpekade" },
    what: `<p>Ett <strong>relationsdiagram</strong> används när problemen hänger ihop i ett komplext nät – när det inte finns en enkel kedja utan allt tycks påverka allt. Faktorerna skrivs upp, och för varje par frågar man: <em>påverkar A B, eller B A?</em> En pil ritas från orsak till verkan.</p>
      <p>Sedan räknar man pilar: en faktor med <strong>många utgående pilar är en drivande orsak</strong> – en bra kandidat att angripa. En faktor med många inkommande pilar är ett <strong>symptom</strong> – det syns mest, men det är sällan där man ska sätta in åtgärden.</p>`,
    steps: [
      ["Samla faktorerna", "Ofta rubrikerna från ett släktskapsdiagram. 5–15 stycken är lagom."],
      ["Placera dem i en ring", "Skriv varje faktor i en ruta, gärna med problemet i mitten eller till höger."],
      ["Rita orsakspilar", "Jämför faktorerna parvis: vilken påverkar vilken? Pil från orsak till verkan. Bara en riktning per par!"],
      ["Räkna pilar per faktor", "Anteckna antal utgående och inkommande pilar vid varje ruta."],
      ["Identifiera drivare och symptom", "Flest utgående = drivande orsak (angrip!). Flest inkommande = effekt/symptom."]
    ],
    demoHint: "Klicka på en faktor och se dess pilar: orange = påverkar andra, blå = påverkas av andra.",
    watchouts: [
      "Tvinga fram ett val per par – \"de påverkar varandra lika mycket\" leder ingenvart. Välj den starkaste riktningen.",
      "Fler än ~15 faktorer gör diagrammet oläsligt – slå ihop med släktskapsdiagram först.",
      "Symptomet med flest inkommande pilar är sällan rätt ställe att åtgärda – följ pilarna bakåt."
    ],
    check: {
      q: "En faktor i relationsdiagrammet har 4 utgående pilar och 0 inkommande. Vad är den?",
      options: [
        "En drivande orsak – en stark kandidat att åtgärda",
        "Ett symptom som man bör dölja",
        "En faktor som kan strykas ur diagrammet",
        "Processens centrallinje"
      ],
      correct: 0,
      explain: "Rätt! Många utgående pilar betyder att faktorn driver många andra problem. Åtgärdar du den, faller mycket annat på plats."
    }
  },
  {
    id: "trad",
    family: "qm", num: 3,
    icon: "🌳",
    name: "Träddiagram",
    aka: "Även kallat: systematiskt diagram, hur-hur-diagram",
    oneliner: "Bryt ner ett stort mål i mindre och mindre delar – tills du står med konkreta åtgärder.",
    facts: { data: "Verbal (mål & medel)", anvands: "Från mål till handling", svarighet: "★★☆ Medel", resultat: "Konkret åtgärdslista" },
    what: `<p>Ett <strong>träddiagram</strong> bryter systematiskt ner ett mål i delmål och åtgärder. Du börjar med målet längst till vänster och frågar <strong>"HUR uppnår vi detta?"</strong> – svaren blir grenar. På varje gren ställer du frågan igen, tills grenarna är så konkreta att de går att genomföra på måndag morgon.</p>
      <p>Kontrollera sedan trädet baklänges: peka på ett löv och fråga <strong>"VARFÖR gör vi detta?"</strong> – svaret ska vara noden till vänster. Då vet du att inget hänger löst och att helheten täcker målet.</p>`,
    steps: [
      ["Formulera målet", "Tydligt och gärna mätbart, t.ex. \"Halvera kötiden i studentkaféet\"."],
      ["Fråga HUR? – första nivån", "Vilka huvudvägar finns till målet? 2–4 grenar är lagom."],
      ["Fråga HUR? igen", "Bryt ner varje gren tills du har konkreta, genomförbara åtgärder."],
      ["Kontrollera med VARFÖR?", "Läs baklänges från löven: hänger logiken ihop? Täcker grenarna hela målet?"],
      ["Prioritera åtgärderna", "Alla löv kan sällan genomföras – välj med t.ex. ett matrisdiagram."]
    ],
    demoHint: "Klicka på grenarna för att fälla ut trädet – följ hur målet blir till konkreta åtgärder.",
    watchouts: [
      "Sluta inte för tidigt – \"förbättra kommunikationen\" är ingen åtgärd, det är en from förhoppning.",
      "MECE-tänk: grenarna på samma nivå ska inte överlappa, och tillsammans ska de täcka helheten.",
      "Trädet visar den logiska nedbrytningen – tidsplanen görs sedan i t.ex. ett pildiagram."
    ],
    check: {
      q: "Vilken fråga driver nedbrytningen i ett träddiagram?",
      options: [
        "\"Hur uppnår vi detta?\" – upprepad nivå för nivå",
        "\"Vem bär skulden?\"",
        "\"Hur ofta inträffar felet?\"",
        "\"Vad kostar det?\""
      ],
      correct: 0,
      explain: "Rätt! HUR? bryter ner målet framåt, och kontrollfrågan VARFÖR? verifierar logiken baklänges."
    }
  },
  {
    id: "matris",
    family: "qm", num: 4,
    icon: "▦",
    name: "Matrisdiagram",
    aka: "Vanligaste formen: L-matris. Grunden i QFD/kvalitetshuset",
    oneliner: "Korsa två listor – t.ex. kundkrav och åtgärder – och betygsätt sambanden i varje ruta.",
    facts: { data: "Verbal + bedömningar", anvands: "Koppla ihop & prioritera", svarighet: "★★☆ Medel", resultat: "Viktad prioritering" },
    what: `<p>Ett <strong>matrisdiagram</strong> visar hur elementen i två (eller flera) listor hänger ihop. Vanligast är <strong>L-matrisen</strong>: en lista som rader, en som kolumner, och i varje cell markeras sambandets styrka med symbolerna <strong>● starkt (9)</strong>, <strong>○ medel (3)</strong> och <strong>△ svagt (1)</strong>.</p>
      <p>Om raderna dessutom viktas (hur viktigt är varje kundkrav?) kan kolumnpoäng räknas fram: <em>vikt × sambandsstyrka</em>, summerat. Då ser du vilken åtgärd som ger mest kundnytta totalt – exakt så fungerar <strong>kvalitetshuset i QFD</strong>.</p>`,
    steps: [
      ["Välj de två listorna", "T.ex. kundkrav (rader) och möjliga åtgärder (kolumner)."],
      ["Vikta raderna", "Hur viktigt är varje kundkrav? T.ex. skala 1–5."],
      ["Bedöm varje cell", "Hur starkt bidrar åtgärden till kravet? ● = 9, ○ = 3, △ = 1, tomt = 0."],
      ["Räkna kolumnpoäng", "Summera vikt × styrka nedåt i varje kolumn."],
      ["Tolka och prioritera", "Hög poäng = åtgärd med stor total kundnytta. Tom rad = ett krav ingen åtgärd täcker!"]
    ],
    demoHint: "Klicka i cellerna för att växla ● ○ △ – poängen längst ner räknas om direkt.",
    watchouts: [
      "En tom rad är en varningssignal: ett kundkrav som ingen åtgärd adresserar.",
      "Bedömningarna är subjektiva – gör dem i grupp och diskutera oenigheter, det är där lärandet sker.",
      "Sifferpoängen ser exakta ut men bygger på grova skattningar. Använd dem som vägledning, inte facit."
    ],
    check: {
      q: "Vad betyder en helt tom rad i en L-matris med kundkrav som rader?",
      options: [
        "Ett kundkrav som ingen av åtgärderna tillgodoser – en lucka att åtgärda",
        "Att kundkravet är oviktigt och kan strykas",
        "Att matrisen är färdig",
        "Att raden ska få högsta poäng"
      ],
      correct: 0,
      explain: "Rätt! Tomma rader avslöjar luckor: kunden bryr sig, men ingen planerad åtgärd hjälper. Dags att hitta en ny åtgärd."
    }
  },
  {
    id: "matrisdata",
    family: "qm", num: 5,
    icon: "🧭",
    name: "Matrisdataanalys",
    aka: "I praktiken ofta ersatt av en enklare prioriteringsmatris/positioneringskarta",
    oneliner: "Placera alternativen i ett tvådimensionellt diagram och låt positionen tala – vilka sticker ut?",
    facts: { data: "Numerisk matrisdata", anvands: "Jämföra många alternativ", svarighet: "★★★ Svårare", resultat: "Positioneringskarta" },
    what: `<p><strong>Matrisdataanalys</strong> är det enda av de sju ledningsverktygen som är rent numeriskt. I sin fulla form används multivariata metoder (t.ex. principalkomponentanalys) för att koka ner en stor datamatris – många objekt × många egenskaper – till ett fåtal dimensioner som kan ritas i ett diagram.</p>
      <p>I praktiskt förbättringsarbete används oftast den förenklade varianten: en <strong>positioneringskarta</strong> där alternativen placeras efter två viktiga egenskaper, t.ex. pris och upplevd kvalitet. Kvadranterna ger direkt tolkning: prisvärda favoriter, dyra besvikelser, och så vidare.</p>`,
    steps: [
      ["Samla matrisdata", "Bedöm eller mät varje alternativ (rad) på flera egenskaper (kolumner)."],
      ["Välj två nyckeldimensioner", "T.ex. pris och kvalitetsbetyg – eller låt en PCA hitta dimensionerna."],
      ["Plotta alternativen", "Varje alternativ blir en punkt i diagrammet."],
      ["Tolka kvadranterna", "Var finns vinnarna? Var finns förlorarna? Vilka kluster syns?"],
      ["Dra slutsatser", "Positionerna visar konkurrensläge, prioritering eller vägval."]
    ],
    demoHint: "Klicka på ett kaffe i listan för att lysa upp det på kartan. Vilken kvadrant vill du befinna dig i?",
    watchouts: [
      "Kartan är aldrig bättre än bedömningarna bakom den – skräp in, skräp ut.",
      "Två dimensioner fångar inte allt – viktiga skillnader kan gömma sig i en tredje egenskap.",
      "Blanda inte ihop med matrisdiagrammet: matrisdataanalys analyserar <b>numerisk</b> matrisdata."
    ],
    check: {
      q: "Vad skiljer matrisdataanalys från de övriga sex ledningsverktygen?",
      options: [
        "Den arbetar med numerisk data i stället för verbal",
        "Den kräver ingen data alls",
        "Den kan bara användas i tillverkningsindustri",
        "Den ritas alltid som ett fiskben"
      ],
      correct: 0,
      explain: "Rätt! De övriga sex strukturerar verbal information – matrisdataanalysen är undantaget som räknar på siffror."
    }
  },
  {
    id: "pdpc",
    family: "qm", num: 6,
    icon: "🛡️",
    name: "Processbeslutsdiagram",
    aka: "Även kallat: PDPC (Process Decision Program Chart)",
    oneliner: "Tänk efter före: vad kan gå fel i planen – och vad gör vi då? Bygg in motåtgärderna i förväg.",
    facts: { data: "Verbal (risker & åtgärder)", anvands: "Riskplanering", svarighet: "★★☆ Medel", resultat: "Plan B inbyggd i planen" },
    what: `<p>Ett <strong>processbeslutsdiagram (PDPC)</strong> tar en plan – ofta ett träddiagram – och stresstestar den. För varje steg ställs frågan: <strong>"Vad kan gå fel här?"</strong> Varje tänkbart problem ritas in som en gren, och för varje problem tar man fram en <strong>motåtgärd</strong>: förebygg, eller ha en plan B redo.</p>
      <p>Resultatet är en plan som inte spricker vid första motgången. PDPC är särskilt värdefullt när planen är ny och oprövad, när insatserna är höga eller när tidplanen saknar marginaler.</p>`,
    steps: [
      ["Utgå från planen", "Lista huvudstegen – gärna från ett träddiagram."],
      ["Fråga \"vad kan gå fel?\"", "Brainstorma tänkbara problem för varje steg. Var pessimist en stund!"],
      ["Välj de allvarliga", "Alla risker kan inte hanteras – fokusera på sannolika och allvarliga."],
      ["Ta fram motåtgärder", "Förebyggande (minska risken) eller beredskap (plan B om det ändå händer)."],
      ["Bygg in i planen", "Markera vem som gör vad om risken slår in. Uppdatera när ni lär er mer."]
    ],
    demoHint: "Klicka på de röda riskerna för att fälla ut motåtgärderna – planen får en plan B.",
    watchouts: [
      "Fastna inte i att lista hundra risker – välj ut de som är både sannolika och allvarliga.",
      "En motåtgärd utan ansvarig person är bara en önskan – skriv vem som gör vad.",
      "PDPC ersätter inte planen (träddiagrammet) – den förstärker den."
    ],
    check: {
      q: "Vilken fråga är kärnan i ett processbeslutsdiagram?",
      options: [
        "\"Vad kan gå fel – och vad gör vi då?\"",
        "\"Vilken feltyp är vanligast?\"",
        "\"Hur ser fördelningen ut?\"",
        "\"Vilka idéer hör ihop?\""
      ],
      correct: 0,
      explain: "Rätt! PDPC är systematiskt förutseende: identifiera problem i förväg och ha motåtgärderna klara innan de behövs."
    }
  },
  {
    id: "pil",
    family: "qm", num: 7,
    icon: "🏹",
    name: "Pildiagram",
    aka: "Även kallat: aktivitetsnätverk, nätplan. Släkt med CPM/PERT och Gantt",
    oneliner: "Planera projektet som ett nätverk av aktiviteter – och hitta den kritiska linjen som styr sluttiden.",
    facts: { data: "Aktiviteter + tider", anvands: "Tidsplanering", svarighet: "★★★ Svårare", resultat: "Tidplan & kritisk linje" },
    what: `<p>Ett <strong>pildiagram</strong> visar ett projekts aktiviteter som ett nätverk: pilarna anger vad som måste bli klart innan nästa aktivitet kan börja. Med tidsuppskattningar per aktivitet kan du räkna fram projektets kortaste möjliga totaltid.</p>
      <p>Kedjan av aktiviteter som avgör totaltiden kallas den <strong>kritiska linjen</strong>: blir någon av dessa aktiviteter försenad, försenas hela projektet. Aktiviteter utanför kritiska linjen har <strong>slack</strong> – de tål viss försening. Det säger dig exakt var du ska sätta in resurserna när det kniper.</p>`,
    steps: [
      ["Lista aktiviteterna", "Allt som måste göras – lagom stora block."],
      ["Bestäm beroenden", "Vad måste vara klart innan varje aktivitet kan starta?"],
      ["Rita nätverket", "Aktiviteter som rutor, beroenden som pilar. Parallella spår är tillåtna – och önskvärda!"],
      ["Sätt tider och räkna framåt", "Uppskatta varje aktivitets tid. Tidigaste sluttid = längsta vägen genom nätet."],
      ["Hitta kritiska linjen", "Aktiviteter utan slack bildar kritiska linjen – bevaka dem extra noga."]
    ],
    demoHint: "Tryck på knappen så tänds den kritiska linjen – notera vilka aktiviteter som tål försening (slack).",
    watchouts: [
      "En försening på kritiska linjen försenar hela projektet – men slack på andra vägar kan ätas upp fortare än du tror.",
      "Optimistiska tidsuppskattningar är projektplaneringens vanligaste fel – fråga den som ska göra jobbet.",
      "Kritiska linjen kan flytta sig när verkligheten avviker från planen – räkna om löpande."
    ],
    check: {
      q: "En aktivitet ligger på den kritiska linjen. Vad gäller?",
      options: [
        "Försenas den, försenas hela projektet – den har noll slack",
        "Den kan strykas utan att projektet påverkas",
        "Den är alltid dyrast",
        "Den måste alltid utföras först av alla aktiviteter"
      ],
      correct: 0,
      explain: "Rätt! Kritiska linjen är den längsta vägen genom nätverket och bestämmer totaltiden. Noll slack = noll marginal."
    }
  }
];

const toolIndex = Object.fromEntries(TOOLS.map((t, i) => [t.id, i]));

/* ============================================================
   INTERAKTIVA DEMOS – en init-funktion per verktyg
   Varje funktion får demo-lådans innehålls-element.
   ============================================================ */

const DEMOS = {

  /* ---- 1. Datainsamling: klickbart streckdiagram ---- */
  datainsamling(el) {
    const cats = ["Repa i lacken", "Färgavvikelse", "Buckla", "Fel mått", "Smuts", "Övrigt"];
    const counts = cats.map(() => 0);
    const rng = makeRng(7);
    const weights = [0.38, 0.27, 0.14, 0.09, 0.07, 0.05];

    el.innerHTML = `
      <div class="demo-controls">
        <button class="btn small qc" id="simDay">▶ Simulera en dags produktion</button>
        <button class="btn small ghost" id="resetTally">Nollställ</button>
      </div>
      <table class="tally-table">
        <thead><tr><th>Feltyp</th><th></th><th>Avprickning</th><th>Antal</th></tr></thead>
        <tbody>${cats.map((c, i) => `
          <tr data-i="${i}">
            <td>${c}</td>
            <td><button class="tally-btn" data-add="${i}" aria-label="Lägg till ${c}">+1</button></td>
            <td class="marks"></td>
            <td class="tot">0</td>
          </tr>`).join("")}
        </tbody>
        <tfoot><tr><td colspan="3" style="text-align:right;font-weight:700">Totalt:</td><td class="tot" id="tallyTotal">0</td></tr></tfoot>
      </table>
      <div class="demo-note" id="tallyNote"><b>Tips:</b> börja pricka av! Fem streck ritas som fyra med ett tvärstreck – lätt att räkna i femgrupper.</div>`;

    const rows = [...el.querySelectorAll("tbody tr")];
    function tallyMarks(n) {
      const groups = Math.floor(n / 5), rest = n % 5;
      return "卌 ".repeat(groups) + "|".repeat(rest);
    }
    function render() {
      const total = counts.reduce((a, b) => a + b, 0);
      const max = Math.max(...counts);
      rows.forEach((r, i) => {
        r.querySelector(".marks").textContent = tallyMarks(counts[i]);
        r.querySelector(".tot").textContent = counts[i];
        r.classList.toggle("max", counts[i] === max && max > 0);
      });
      el.querySelector("#tallyTotal").textContent = total;
      const note = el.querySelector("#tallyNote");
      if (total >= 15) {
        const iMax = counts.indexOf(max);
        note.innerHTML = `<b>Analys:</b> "${cats[iMax]}" dominerar med ${max} av ${total} fel (${Math.round(100 * max / total)} %). Nästa steg: rita ett <a href="#/verktyg/pareto">paretodiagram</a> och gräv i orsakerna med ett <a href="#/verktyg/ishikawa">ishikawadiagram</a>.`;
      }
    }
    el.addEventListener("click", e => {
      const add = e.target.closest("[data-add]");
      if (add) { counts[+add.dataset.add]++; render(); }
    });
    el.querySelector("#simDay").addEventListener("click", () => {
      for (let k = 0; k < 25; k++) {
        const r = rng();
        let acc = 0;
        for (let i = 0; i < weights.length; i++) { acc += weights[i]; if (r < acc) { counts[i]++; break; } }
      }
      render();
    });
    el.querySelector("#resetTally").addEventListener("click", () => { counts.fill(0); render();
      el.querySelector("#tallyNote").innerHTML = `<b>Tips:</b> börja pricka av! Fem streck ritas som fyra med ett tvärstreck – lätt att räkna i femgrupper.`; });
    render();
  },

  /* ---- 2. Histogram: form + antal klasser ---- */
  histogram(el) {
    let shape = "normal", bins = 9;
    const shapes = {
      normal:  { label: "Normal (klockformad)", text: "En symmetrisk, klockformad fördelning – det man förväntar sig av en stabil process med enbart slumpvariation. Centrum ≈ 50, jämn spridning åt båda håll." },
      skev:    { label: "Skev", text: "En skev fördelning med lång svans åt höger. Vanligt för t.ex. väntetider och ledtider – de kan aldrig bli kortare än noll, men ibland väldigt långa." },
      tvatopp: { label: "Tvåtoppig", text: "Två toppar! Ett klassiskt tecken på att data från <b>två olika källor</b> blandats – kanske två maskiner med olika inställning. Dags att stratifiera!" }
    };
    function genData() {
      const rng = makeRng(42);
      const d = [];
      for (let i = 0; i < 150; i++) {
        if (shape === "normal") d.push(50 + 6 * gauss(rng));
        else if (shape === "skev") d.push(38 + 18 * (-Math.log(Math.max(rng(), 1e-9)) * 0.55));
        else d.push(i % 2 ? 42 + 3.4 * gauss(rng) : 58 + 3.4 * gauss(rng));
      }
      return d;
    }
    el.innerHTML = `
      <div class="demo-controls">
        ${Object.entries(shapes).map(([k, v], i) =>
          `<button class="btn small ${k === shape ? "qc" : "ghost"}" data-shape="${k}">${v.label}</button>`).join("")}
        <label style="margin-left:auto">Antal klasser: <output id="binOut">${bins}</output><br>
          <input type="range" id="binRange" min="3" max="24" value="${bins}"></label>
      </div>
      <div id="histSvg"></div>
      <div class="demo-note" id="histNote"></div>`;

    function draw() {
      const data = genData();
      const lo = Math.min(...data), hi = Math.max(...data);
      const w = (hi - lo) / bins;
      const freq = Array(bins).fill(0);
      data.forEach(v => freq[Math.min(bins - 1, Math.floor((v - lo) / w))]++);
      const W = 640, H = 300, mL = 40, mB = 34, mT = 14, mR = 10;
      const maxF = Math.max(...freq);
      const bw = (W - mL - mR) / bins;
      let bars = "";
      freq.forEach((f, i) => {
        const h = f / maxF * (H - mT - mB);
        bars += `<rect x="${mL + i * bw + 1}" y="${H - mB - h}" width="${bw - 2}" height="${h}" rx="2" fill="var(--qc)" opacity="0.88"><title>${(lo + i * w).toFixed(1)}–${(lo + (i + 1) * w).toFixed(1)}: ${f} st</title></rect>`;
      });
      let ticks = "";
      for (let i = 0; i <= 4; i++) {
        const v = lo + (hi - lo) * i / 4;
        ticks += `<text x="${mL + (W - mL - mR) * i / 4}" y="${H - 12}" font-size="12" text-anchor="middle" fill="var(--ink-soft)">${v.toFixed(0)}</text>`;
      }
      el.querySelector("#histSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Histogram">
          <line x1="${mL}" y1="${H - mB}" x2="${W - mR}" y2="${H - mB}" stroke="var(--ink)" stroke-width="1.5"/>
          <line x1="${mL}" y1="${mT}" x2="${mL}" y2="${H - mB}" stroke="var(--ink)" stroke-width="1.5"/>
          <text x="14" y="${mT + 8}" font-size="12" fill="var(--ink-soft)" transform="rotate(-90 14 ${mT + 8})" text-anchor="end">Antal</text>
          ${bars}${ticks}
          <text x="${(W + mL) / 2}" y="${H - 0}" font-size="12" text-anchor="middle" fill="var(--ink-soft)">Mätvärde</text>
        </svg>`;
      let extra = "";
      if (bins <= 4) extra = " <b>Obs:</b> med så få klasser döljs formen nästan helt!";
      if (bins >= 20) extra = " <b>Obs:</b> med så många klasser blir bilden hackig – formen drunknar i brus.";
      el.querySelector("#histNote").innerHTML = `<b>Tolkning:</b> ${shapes[shape].text}${extra}`;
    }
    el.addEventListener("click", e => {
      const b = e.target.closest("[data-shape]");
      if (b) {
        shape = b.dataset.shape;
        el.querySelectorAll("[data-shape]").forEach(x => x.className = `btn small ${x.dataset.shape === shape ? "qc" : "ghost"}`);
        draw();
      }
    });
    el.querySelector("#binRange").addEventListener("input", e => {
      bins = +e.target.value;
      el.querySelector("#binOut").textContent = bins;
      draw();
    });
    draw();
  },

  /* ---- 3. Pareto: justerbara staplar + ackumulerad kurva ---- */
  pareto(el) {
    const cats = [
      { name: "Repa i lacken", n: 48 }, { name: "Färgavvikelse", n: 31 }, { name: "Buckla", n: 12 },
      { name: "Fel mått", n: 7 }, { name: "Smuts", n: 5 }, { name: "Övrigt", n: 3 }
    ];
    el.innerHTML = `
      <div class="demo-controls" id="pCtrl"></div>
      <div id="pSvg"></div>
      <div class="demo-note" id="pNote"></div>`;

    function draw() {
      const sorted = [...cats].sort((a, b) => (a.name === "Övrigt") - (b.name === "Övrigt") || b.n - a.n);
      const total = sorted.reduce((s, c) => s + c.n, 0) || 1;
      const W = 660, H = 330, mL = 44, mR = 52, mT = 18, mB = 58;
      const bw = (W - mL - mR) / sorted.length;
      const maxN = Math.max(...sorted.map(c => c.n), 1);
      let acc = 0, bars = "", line = "", dots = "", labels = "", vital = [];
      sorted.forEach((c, i) => {
        const h = c.n / maxN * (H - mT - mB);
        const prevAcc = acc;
        acc += c.n;
        const isVital = prevAcc / total < 0.8 && c.name !== "Övrigt";
        if (isVital) vital.push(c.name);
        bars += `<rect x="${mL + i * bw + 6}" y="${H - mB - h}" width="${bw - 12}" height="${Math.max(h, 1)}" rx="3" fill="${isVital ? "var(--qc)" : "#c8bda6"}"><title>${c.name}: ${c.n} fel</title></rect>`;
        const cx = mL + i * bw + bw / 2;
        const cy = mT + (1 - acc / total) * (H - mT - mB);
        line += `${i ? "L" : "M"}${cx},${cy}`;
        dots += `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--ink)"/><text x="${cx}" y="${cy - 9}" font-size="11.5" text-anchor="middle" fill="var(--ink)" font-weight="700">${Math.round(100 * acc / total)}%</text>`;
        labels += `<text x="${cx}" y="${H - mB + 16}" font-size="12" text-anchor="middle" fill="var(--ink)" transform="rotate(-14 ${cx} ${H - mB + 16})">${c.name}</text>
                   <text x="${cx}" y="${H - mB + 33}" font-size="12" text-anchor="middle" fill="var(--ink-soft)">${c.n}</text>`;
      });
      const y80 = mT + 0.2 * (H - mT - mB);
      el.querySelector("#pSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Paretodiagram">
          <line x1="${mL}" y1="${H - mB}" x2="${W - mR}" y2="${H - mB}" stroke="var(--ink)" stroke-width="1.5"/>
          <line x1="${mL}" y1="${mT}" x2="${mL}" y2="${H - mB}" stroke="var(--ink)" stroke-width="1.5"/>
          <line x1="${W - mR}" y1="${mT}" x2="${W - mR}" y2="${H - mB}" stroke="var(--ink-soft)" stroke-width="1"/>
          <line x1="${mL}" y1="${y80}" x2="${W - mR}" y2="${y80}" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="6 5"/>
          <text x="${W - mR - 4}" y="${y80 - 6}" font-size="11.5" text-anchor="end" fill="var(--gold)" font-weight="700">80 %-nivån</text>
          ${bars}
          <path d="${line}" fill="none" stroke="var(--ink)" stroke-width="2"/>
          ${dots}${labels}
          <text x="${W - mR + 38}" y="${(H - mB + mT) / 2}" font-size="12" fill="var(--ink-soft)" transform="rotate(90 ${W - mR + 38} ${(H - mB + mT) / 2})" text-anchor="middle">Ackumulerad %</text>
          <text x="14" y="${(H - mB + mT) / 2}" font-size="12" fill="var(--ink-soft)" transform="rotate(-90 14 ${(H - mB + mT) / 2})" text-anchor="middle">Antal fel</text>
        </svg>`;
      const vitalTxt = vital.length > 1 ? vital.slice(0, -1).join(", ") + " och " + vital[vital.length - 1] : vital.join("");
      el.querySelector("#pNote").innerHTML = `<b>De vitala få:</b> ${vitalTxt} står tillsammans för <b>${Math.round(100 * cats.filter(c => vital.includes(c.name)).reduce((s, c) => s + c.n, 0) / total)} %</b> av alla ${total} fel. Börja där!`;
      el.querySelector("#pCtrl").innerHTML = cats.map((c, i) => `
        <span style="display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--line);border-radius:999px;padding:3px 8px;font-size:13.5px;background:var(--card)">
          ${c.name}
          <button class="tally-btn" style="width:26px;height:26px;font-size:14px" data-d="${i}:-1" aria-label="Minska ${c.name}">–</button>
          <b style="min-width:2ch;text-align:center">${c.n}</b>
          <button class="tally-btn" style="width:26px;height:26px;font-size:14px" data-d="${i}:1" aria-label="Öka ${c.name}">+</button>
        </span>`).join("");
    }
    el.addEventListener("click", e => {
      const b = e.target.closest("[data-d]");
      if (b) {
        const [i, d] = b.dataset.d.split(":").map(Number);
        cats[i].n = Math.max(0, cats[i].n + d * 3);
        draw();
      }
    });
    draw();
  },

  /* ---- 4. Ishikawa: klickbart fiskben ---- */
  ishikawa(el) {
    const problem = "Kaffet i fikarummet smakar illa";
    const bones = [
      { m: "Människa", causes: ["Olika personer doserar olika", "Ingen ansvarar för rengöring"] },
      { m: "Maskin", causes: ["Bryggaren avkalkas aldrig", "Värmeplattan bränner kaffet"] },
      { m: "Metod", causes: ["Kaffet står i timmar innan det dricks", "Fel dosering – inget mått finns"] },
      { m: "Material", causes: ["Billigaste bönorna upphandlade", "Kaffet förvaras öppet och blir gammalt"] },
      { m: "Mätning", causes: ["Ingen mäter mängd kaffe per liter", "Smaken utvärderas aldrig systematiskt"] },
      { m: "Miljö", causes: ["Kalkrikt kranvatten", "Fikarummet är varmt – kaffet förvaras fel"] },
      { m: "Management", causes: ["Ingen budget för underhåll", "Kaffekvalitet är ingens ansvar"] }
    ];
    let sel = 1;
    el.innerHTML = `
      <div class="fishbone-wrap">
        <div id="fishSvg"></div>
        <div class="bone-panel" id="bonePanel"></div>
      </div>`;

    function drawFish() {
      const W = 560, H = 330, headX = 470, spineY = 165;
      const top = bones.filter((_, i) => i % 2 === 0), bot = bones.filter((_, i) => i % 2 === 1);
      function boneSvg(b, idx, isTop, pos, count) {
        const x2 = 90 + pos * ((headX - 130) / count);
        const x1 = x2 + 58, y1 = isTop ? 34 : H - 34;
        const i = bones.indexOf(b);
        const selNow = i === sel;
        const causeTicks = b.causes.slice(0, 3).map((c, k) => {
          const t = (k + 1) / 4;
          const cx = x2 + (x1 - x2) * t, cy = spineY + (y1 - spineY) * t;
          return `<line x1="${cx}" y1="${cy}" x2="${cx - 26}" y2="${cy}" stroke="${selNow ? "var(--qc)" : "#b9ad96"}" stroke-width="1.5"/>`;
        }).join("");
        return `<g class="bone" data-bone="${i}" style="cursor:pointer">
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${spineY}" stroke="${selNow ? "var(--qc)" : "var(--ink)"}" stroke-width="${selNow ? 3.5 : 2}"/>
          ${causeTicks}
          <rect x="${x1 - 46}" y="${y1 - 13}" width="92" height="26" rx="13" fill="${selNow ? "var(--qc)" : "var(--card)"}" stroke="${selNow ? "var(--qc-deep)" : "var(--ink)"}" stroke-width="1.5"/>
          <text x="${x1}" y="${y1 + 4.5}" font-size="12.5" text-anchor="middle" font-weight="700" fill="${selNow ? "#fff" : "var(--ink)"}">${b.m}</text>
        </g>`;
      }
      el.querySelector("#fishSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Ishikawadiagram">
          <line x1="40" y1="${spineY}" x2="${headX}" y2="${spineY}" stroke="var(--ink)" stroke-width="3"/>
          <path d="M${headX},${spineY - 34} L${W - 14},${spineY} L${headX},${spineY + 34} Z" fill="var(--qc-soft)" stroke="var(--qc-deep)" stroke-width="2"/>
          <text x="${headX + 38}" y="${spineY - 42}" font-size="12.5" text-anchor="middle" font-weight="700" fill="var(--qc-deep)">PROBLEM</text>
          <text x="${headX + 38}" y="${spineY + 3}" font-size="11" text-anchor="middle" fill="var(--ink)">${problem.split(" ").slice(0, 2).join(" ")}…</text>
          ${top.map((b, k) => boneSvg(b, k, true, k + 0.5, top.length)).join("")}
          ${bot.map((b, k) => boneSvg(b, k, false, k + 0.5, bot.length)).join("")}
        </svg>`;
    }
    function drawPanel() {
      const b = bones[sel];
      el.querySelector("#bonePanel").innerHTML = `
        <h4>${b.m}</h4>
        <p style="margin:0 0 8px;font-size:13.5px;color:var(--ink-soft)">Möjliga orsaker till: <em>"${problem}"</em></p>
        <ul>${b.causes.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
        <div class="add-row">
          <input type="text" id="causeInput" placeholder="Lägg till egen orsak …" maxlength="60">
          <button class="btn small qc" id="causeAdd">Lägg till</button>
        </div>`;
      const inp = el.querySelector("#causeInput");
      const add = () => {
        if (inp.value.trim()) { b.causes.push(inp.value.trim()); inp.value = ""; drawFish(); drawPanel(); }
      };
      el.querySelector("#causeAdd").addEventListener("click", add);
      inp.addEventListener("keydown", e => { if (e.key === "Enter") add(); });
    }
    el.addEventListener("click", e => {
      const g = e.target.closest("[data-bone]");
      if (g) { sel = +g.dataset.bone; drawFish(); drawPanel(); }
    });
    drawFish(); drawPanel();
  },

  /* ---- 5. Stratifiering: avslöja mönstret ---- */
  stratifiering(el) {
    let strat = false;
    const rng = makeRng(11);
    const pts = [];
    for (let i = 0; i < 30; i++) pts.push({ t: i + 1, y: 10 + 0.25 * gauss(rng), m: "A" });
    for (let i = 0; i < 30; i++) pts.push({ t: i + 1, y: 10.15 + i * 0.035 + 0.22 * gauss(rng), m: "B" });
    el.innerHTML = `
      <div class="demo-controls">
        <button class="btn small qc" id="stratBtn">🔍 Stratifiera per maskin</button>
      </div>
      <div id="stratSvg"></div>
      <div class="demo-note" id="stratNote"><b>Läget:</b> hål-diametern från två maskiner, hopblandad. Datan ser mest ut som brus … eller?</div>`;

    function draw() {
      const W = 640, H = 300, mL = 46, mB = 36, mT = 16, mR = 14;
      const ys = pts.map(p => p.y);
      const lo = Math.min(...ys) - 0.1, hi = Math.max(...ys) + 0.1;
      const X = t => mL + (t - 1) / 29 * (W - mL - mR);
      const Y = v => mT + (1 - (v - lo) / (hi - lo)) * (H - mT - mB);
      const dots = pts.map(p => {
        const fill = !strat ? "#8a8375" : (p.m === "A" ? "var(--qm)" : "var(--qc)");
        return `<circle cx="${X(p.t)}" cy="${Y(p.y)}" r="5" fill="${fill}" opacity="0.85"><title>Maskin ${p.m}, prov ${p.t}: ${p.y.toFixed(2)} mm</title></circle>`;
      }).join("");
      const legend = strat ? `
        <circle cx="${mL + 12}" cy="${mT + 10}" r="5" fill="var(--qm)"/><text x="${mL + 22}" y="${mT + 14}" font-size="12.5" font-weight="700" fill="var(--qm-deep)">Maskin A</text>
        <circle cx="${mL + 104}" cy="${mT + 10}" r="5" fill="var(--qc)"/><text x="${mL + 114}" y="${mT + 14}" font-size="12.5" font-weight="700" fill="var(--qc-deep)">Maskin B</text>` : "";
      el.querySelector("#stratSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Stratifierat spridningsdiagram">
          <line x1="${mL}" y1="${H - mB}" x2="${W - mR}" y2="${H - mB}" stroke="var(--ink)" stroke-width="1.5"/>
          <line x1="${mL}" y1="${mT}" x2="${mL}" y2="${H - mB}" stroke="var(--ink)" stroke-width="1.5"/>
          <text x="${(W + mL) / 2}" y="${H - 6}" font-size="12" text-anchor="middle" fill="var(--ink-soft)">Provnummer (tidsordning)</text>
          <text x="14" y="${(H - mB + mT) / 2}" font-size="12" fill="var(--ink-soft)" transform="rotate(-90 14 ${(H - mB + mT) / 2})" text-anchor="middle">Håldiameter (mm)</text>
          ${dots}${legend}
        </svg>`;
    }
    el.querySelector("#stratBtn").addEventListener("click", function () {
      strat = !strat;
      this.textContent = strat ? "Blanda ihop igen" : "🔍 Stratifiera per maskin";
      this.className = `btn small ${strat ? "ghost" : "qc"}`;
      el.querySelector("#stratNote").innerHTML = strat
        ? `<b>Aha!</b> Maskin A (petrol) är stabil – men maskin B (orange) <b>driver uppåt</b> över tid, troligen verktygsslitage. I den hopblandade datan var detta helt osynligt. Det är kraften i stratifiering!`
        : `<b>Läget:</b> hål-diametern från två maskiner, hopblandad. Datan ser mest ut som brus … eller?`;
      draw();
    });
    draw();
  },

  /* ---- 6. Sambandsdiagram: korrelationsreglage ---- */
  samband(el) {
    let r = 0.8;
    el.innerHTML = `
      <div class="demo-controls">
        <label>Sambandets styrka (r): <output id="rOut">${r.toFixed(1)}</output><br>
        <input type="range" id="rRange" min="-1" max="1" step="0.1" value="${r}" style="width:260px"></label>
      </div>
      <div id="scatSvg"></div>
      <div class="demo-note" id="scatNote"></div>`;

    function draw() {
      const rng = makeRng(99);
      const W = 640, H = 300, m = 42;
      let dots = "";
      for (let i = 0; i < 60; i++) {
        const x = gauss(rng), noise = gauss(rng);
        const y = r * x + Math.sqrt(Math.max(0, 1 - r * r)) * noise;
        const px = m + (x + 3) / 6 * (W - 2 * m);
        const py = H - m - (y + 3) / 6 * (H - 2 * m);
        dots += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5" fill="var(--qc)" opacity="0.65"/>`;
      }
      el.querySelector("#scatSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Sambandsdiagram">
          <line x1="${m}" y1="${H - m}" x2="${W - m}" y2="${H - m}" stroke="var(--ink)" stroke-width="1.5"/>
          <line x1="${m}" y1="${m}" x2="${m}" y2="${H - m}" stroke="var(--ink)" stroke-width="1.5"/>
          <text x="${W / 2}" y="${H - 10}" font-size="12" text-anchor="middle" fill="var(--ink-soft)">Variabel X (t.ex. ugnstemperatur)</text>
          <text x="14" y="${H / 2}" font-size="12" fill="var(--ink-soft)" transform="rotate(-90 14 ${H / 2})" text-anchor="middle">Variabel Y (t.ex. glans)</text>
          ${dots}
        </svg>`;
      const abs = Math.abs(r);
      const styrka = abs >= 0.9 ? "mycket starkt" : abs >= 0.7 ? "starkt" : abs >= 0.4 ? "måttligt" : abs >= 0.2 ? "svagt" : "inget tydligt";
      const rikt = r > 0.15 ? "positivt (båda ökar tillsammans)" : r < -0.15 ? "negativt (när X ökar minskar Y)" : "";
      el.querySelector("#scatNote").innerHTML = abs < 0.2
        ? `<b>Tolkning:</b> ett runt moln utan riktning – <b>inget tydligt samband</b> mellan X och Y.`
        : `<b>Tolkning:</b> ett <b>${styrka} ${rikt}</b> samband. Men kom ihåg: korrelation bevisar inte orsakssamband – kan en tredje variabel ligga bakom?`;
    }
    el.querySelector("#rRange").addEventListener("input", e => {
      r = +e.target.value;
      el.querySelector("#rOut").textContent = r.toFixed(1);
      draw();
    });
    draw();
  },

  /* ---- 7. Styrdiagram: stabil process + störning ---- */
  styrdiagram(el) {
    let disturbed = false, seed = 5;
    el.innerHTML = `
      <div class="demo-controls">
        <button class="btn small qc" id="distBtn">⚡ Inför en störning</button>
        <button class="btn small ghost" id="newBtn">Ny stabil process</button>
      </div>
      <div id="ctrlSvg"></div>
      <div class="demo-note" id="ctrlNote"></div>`;

    function draw() {
      const rng = makeRng(seed);
      const base = [];
      for (let i = 0; i < 30; i++) base.push(20 + 1.6 * gauss(rng));
      if (disturbed) for (let i = 22; i < 30; i++) base[i] += 4.2;
      const ref = base.slice(0, 20);
      const cl = ref.reduce((a, b) => a + b, 0) / ref.length;
      const sd = Math.sqrt(ref.reduce((a, b) => a + (b - cl) ** 2, 0) / (ref.length - 1));
      const ucl = cl + 3 * sd, lcl = cl - 3 * sd;
      const W = 660, H = 320, mL = 46, mR = 64, mT = 18, mB = 36;
      const lo = Math.min(lcl, ...base) - 1, hi = Math.max(ucl, ...base) + 1;
      const X = i => mL + i / 29 * (W - mL - mR);
      const Y = v => mT + (1 - (v - lo) / (hi - lo)) * (H - mT - mB);
      let path = "", dots = "", nOut = 0;
      base.forEach((v, i) => {
        path += `${i ? "L" : "M"}${X(i)},${Y(v)}`;
        const out = v > ucl || v < lcl;
        if (out) nOut++;
        dots += `<circle cx="${X(i)}" cy="${Y(v)}" r="${out ? 6.5 : 4.5}" fill="${out ? "var(--red)" : "var(--qc)"}" stroke="${out ? "#7c1f1f" : "none"}" stroke-width="1.5"><title>Prov ${i + 1}: ${v.toFixed(2)}</title></circle>`;
      });
      const gl = (y, col, lab, dash) => `
        <line x1="${mL}" y1="${Y(y)}" x2="${W - mR}" y2="${Y(y)}" stroke="${col}" stroke-width="1.5" ${dash ? 'stroke-dasharray="7 5"' : ""}/>
        <text x="${W - mR + 6}" y="${Y(y) + 4}" font-size="12" font-weight="700" fill="${col}">${lab}</text>`;
      el.querySelector("#ctrlSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Styrdiagram">
          <line x1="${mL}" y1="${H - mB}" x2="${W - mR}" y2="${H - mB}" stroke="var(--ink)" stroke-width="1.5"/>
          <line x1="${mL}" y1="${mT}" x2="${mL}" y2="${H - mB}" stroke="var(--ink)" stroke-width="1.5"/>
          ${gl(ucl, "var(--red)", "ÖSG", true)}${gl(cl, "var(--green)", "CL", false)}${gl(lcl, "var(--red)", "USG", true)}
          <path d="${path}" fill="none" stroke="var(--qc)" stroke-width="1.5" opacity="0.6"/>
          ${dots}
          <text x="${(W + mL) / 2}" y="${H - 8}" font-size="12" text-anchor="middle" fill="var(--ink-soft)">Prov i tidsordning →</text>
        </svg>`;
      el.querySelector("#ctrlNote").innerHTML = disturbed
        ? (nOut > 0
          ? `<b>Larm!</b> ${nOut} ${nOut === 1 ? "punkt" : "punkter"} utanför styrgränserna – dessutom en tydlig nivåhöjning i slutet. Detta är en <b>urskiljbar orsak</b>: något har hänt (verktygsbyte? nytt materialparti?). Undersök – justera inte i blindo!`
          : `<b>Störning införd</b> – de sista punkterna har lyfts. Notera sviten på samma sida om centrallinjen: även utan punkter utanför gränserna är detta en varningssignal.`)
        : `<b>Stabil process:</b> punkterna varierar slumpmässigt kring centrallinjen (CL), väl innanför styrgränserna (ÖSG/USG = ±3σ). Detta är <b>naturlig slumpvariation</b> – rör inget! Att "justera" nu skulle bara öka variationen.`;
    }
    el.querySelector("#distBtn").addEventListener("click", function () {
      disturbed = !disturbed;
      this.textContent = disturbed ? "Ta bort störningen" : "⚡ Inför en störning";
      draw();
    });
    el.querySelector("#newBtn").addEventListener("click", () => { seed = (seed * 7 + 3) % 1000 + 1; disturbed = false;
      el.querySelector("#distBtn").textContent = "⚡ Inför en störning"; draw(); });
    draw();
  },

  /* ---- 8. Släktskapsdiagram: gruppera lappar ---- */
  slaktskap(el) {
    const notes = [
      { t: "Börjar plugga för sent", g: 0 }, { t: "För många kurser samtidigt", g: 0 }, { t: "Ingen pluggplan", g: 0 },
      { t: "Störande ljud hemma", g: 1 }, { t: "Mobilen lockar hela tiden", g: 1 }, { t: "Ingen bra pluggplats", g: 1 },
      { t: "Otydligt vad tentan täcker", g: 2 }, { t: "Gamla tentor svåra att hitta", g: 2 }, { t: "Föreläsningar matchar inte tentan", g: 2 }
    ];
    const groups = ["Planering", "Studiemiljö", "Otydlig information"];
    let placement = notes.map(() => -1); // -1 = i poolen
    let selected = -1;
    const tilts = notes.map((_, i) => ((i * 37) % 5) - 2);

    el.innerHTML = `
      <p style="margin:0 0 10px;font-size:15px"><b>Frågan:</b> "Varför blir tentaplugget stressigt?" – nio lappar från en brainstorming. Gruppera dem!</p>
      <div class="affinity-board">
        <div class="affinity-pool" id="affPool" aria-label="Osorterade lappar"></div>
        <div class="affinity-groups" id="affGroups"></div>
      </div>
      <div class="demo-controls" style="margin-top:14px">
        <button class="btn small qm" id="affSuggest">💡 Visa ett förslag</button>
        <button class="btn small ghost" id="affReset">Blanda om</button>
      </div>
      <div class="demo-note" id="affNote"><b>Gör så här:</b> klicka på en lapp, klicka sedan på gruppen där den hör hemma. Kom ihåg – det finns inget facit, bara bättre och sämre samtal!</div>`;

    function render() {
      const pool = el.querySelector("#affPool");
      pool.innerHTML = notes.map((n, i) => placement[i] === -1
        ? `<div class="note ${selected === i ? "selected" : ""}" data-note="${i}" style="--tilt:${tilts[i]}deg" tabindex="0">${n.t}</div>` : "").join("")
        || `<span style="color:var(--ink-soft);font-size:14px">Alla lappar grupperade! 🎉</span>`;
      el.querySelector("#affGroups").innerHTML = groups.map((g, gi) => `
        <div class="affinity-group ${selected >= 0 ? "target" : ""}" data-group="${gi}">
          <h4>${g}</h4>
          <div class="slot">${notes.map((n, i) => placement[i] === gi
            ? `<div class="note" data-note="${i}" style="--tilt:${tilts[i]}deg">${n.t}</div>` : "").join("")}</div>
        </div>`).join("");
      if (placement.every(p => p !== -1)) {
        el.querySelector("#affNote").innerHTML = `<b>Snyggt!</b> Nu har röran blivit tre teman. I verkligheten sätter gruppen rubrikerna <i>efter</i> grupperingen. Nästa steg: undersök hur temana påverkar varandra i ett <a href="#/verktyg/relation">relationsdiagram</a>.`;
      }
    }
    el.addEventListener("click", e => {
      const note = e.target.closest("[data-note]");
      const grp = e.target.closest("[data-group]");
      if (note && note.closest("#affPool")) {
        selected = selected === +note.dataset.note ? -1 : +note.dataset.note;
        render();
      } else if (note && !note.closest("#affPool")) {
        placement[+note.dataset.note] = -1; selected = -1; render();
      } else if (grp && selected >= 0) {
        placement[selected] = +grp.dataset.group; selected = -1; render();
      }
    });
    el.querySelector("#affSuggest").addEventListener("click", () => {
      placement = notes.map(n => n.g); selected = -1; render();
      el.querySelector("#affNote").innerHTML = `<b>Ett förslag</b> – men bara ett av flera möjliga! Kanske hör "Mobilen lockar hela tiden" lika mycket hemma under Planering? Sådana diskussioner är själva poängen med verktyget.`;
    });
    el.querySelector("#affReset").addEventListener("click", () => {
      placement = notes.map(() => -1); selected = -1; render();
      el.querySelector("#affNote").innerHTML = `<b>Gör så här:</b> klicka på en lapp, klicka sedan på gruppen där den hör hemma. Kom ihåg – det finns inget facit, bara bättre och sämre samtal!`;
    });
    render();
  },

  /* ---- 9. Relationsdiagram: klickbara noder ---- */
  relation(el) {
    const nodes = ["Börjar plugga sent", "Stress", "Sömnbrist", "Dåliga anteckningar", "Missar föreläsningar", "Svaga tentaresultat"];
    // pilar: [från, till] – en riktning per par!
    const edges = [[0, 1], [0, 5], [1, 2], [2, 4], [4, 3], [3, 5], [1, 5], [4, 5]];
    let sel = -1;
    el.innerHTML = `<div class="fishbone-wrap"><div id="relSvg"></div><div class="bone-panel" id="relPanel"></div></div>`;

    const W = 560, H = 360, cx = W / 2, cy = H / 2, R = 132;
    const pos = nodes.map((_, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / nodes.length;
      return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
    });
    function draw() {
      const arrows = edges.map(([f, t]) => {
        const a = pos[f], b = pos[t];
        const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
        const off = 56;
        const x1 = a.x + dx / L * off, y1 = a.y + dy / L * off;
        const x2 = b.x - dx / L * off, y2 = b.y - dy / L * off;
        let col = "#b9ad96", wdt = 1.5, mk = "arrGrey";
        if (sel === f) { col = "var(--qc)"; wdt = 3; mk = "arrOut"; }
        else if (sel === t) { col = "var(--qm)"; wdt = 3; mk = "arrIn"; }
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${wdt}" marker-end="url(#${mk})"/>`;
      }).join("");
      const outCount = i => edges.filter(e => e[0] === i).length;
      const inCount = i => edges.filter(e => e[1] === i).length;
      const boxes = nodes.map((n, i) => {
        const p = pos[i], selNow = i === sel;
        // Radbryt långa namn till två rader
        let lines = [n];
        if (n.length > 14) {
          const words = n.split(" ");
          const mid = Math.ceil(words.length / 2);
          lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
        }
        const txt = lines.map((L, li) =>
          `<text x="${p.x}" y="${p.y - 8 + li * 12 - (lines.length - 1) * 5}" font-size="11" text-anchor="middle" font-weight="700" fill="${selNow ? "#fff" : "var(--ink)"}">${L}</text>`).join("");
        return `<g data-rel="${i}" style="cursor:pointer">
          <rect x="${p.x - 66}" y="${p.y - 26}" width="132" height="52" rx="10"
            fill="${selNow ? "var(--qm)" : "var(--card)"}" stroke="${selNow ? "var(--qm-deep)" : "var(--ink)"}" stroke-width="${selNow ? 2.5 : 1.5}"/>
          ${txt}
          <text x="${p.x}" y="${p.y + 16}" font-size="10.5" text-anchor="middle" fill="${selNow ? "#dff" : "var(--ink-soft)"}">ut: ${outCount(i)} · in: ${inCount(i)}</text>
        </g>`;
      }).join("");
      el.querySelector("#relSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Relationsdiagram">
          <defs>
            <marker id="arrGrey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10Z" fill="#b9ad96"/></marker>
            <marker id="arrOut" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10Z" fill="var(--qc)"/></marker>
            <marker id="arrIn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10Z" fill="var(--qm)"/></marker>
          </defs>
          ${arrows}${boxes}
        </svg>`;
      const panel = el.querySelector("#relPanel");
      if (sel < 0) {
        panel.innerHTML = `<h4>Fallet: svaga tentaresultat</h4>
          <p style="font-size:14.5px">Sex faktorer, åtta orsakspilar. <b>Klicka på en faktor</b> för att se vad den påverkar (orange pilar ut) och vad den påverkas av (petrolfärgade pilar in).</p>
          <p style="font-size:14.5px;color:var(--ink-soft)">Ledtråd: vilken faktor har flest utgående pilar men inga inkommande?</p>`;
      } else {
        const outs = edges.filter(e => e[0] === sel).map(e => nodes[e[1]]);
        const ins = edges.filter(e => e[1] === sel).map(e => nodes[e[0]]);
        const role = outs.length >= 2 && ins.length === 0 ? `<p style="font-size:14.5px"><b style="color:var(--qc-deep)">→ Drivande orsak!</b> Många utgående pilar, inga inkommande. Här ger en åtgärd störst effekt.</p>`
          : ins.length >= 3 ? `<p style="font-size:14.5px"><b style="color:var(--qm-deep)">→ Symptom/effekt.</b> Många inkommande pilar – det här är resultatet av andra problem, inte grundorsaken.</p>` : "";
        panel.innerHTML = `<h4>${nodes[sel]}</h4>
          <p style="font-size:14px;margin:4px 0"><b style="color:var(--qc-deep)">Påverkar (${outs.length}):</b> ${outs.join(", ") || "–"}</p>
          <p style="font-size:14px;margin:4px 0"><b style="color:var(--qm-deep)">Påverkas av (${ins.length}):</b> ${ins.join(", ") || "–"}</p>
          ${role}`;
      }
    }
    el.addEventListener("click", e => {
      const g = e.target.closest("[data-rel]");
      if (g) { sel = sel === +g.dataset.rel ? -1 : +g.dataset.rel; draw(); }
    });
    draw();
  },

  /* ---- 10. Träddiagram: utfällbart ---- */
  trad(el) {
    const tree = {
      t: "MÅL: Halvera kötiden i studentkaféet", open: true, kids: [
        { t: "Snabbare beställning", kids: [
          { t: "Självbeställning via QR-kod vid borden" },
          { t: "Tydlig meny redan i kön" },
          { t: "Förbeställning i app" }] },
        { t: "Snabbare tillagning", kids: [
          { t: "Förbered de 3 vanligaste dryckerna i rusningstid" },
          { t: "Omplacera maskiner – kortare gångvägar" }] },
        { t: "Jämnare kundflöde", kids: [
          { t: "Rabatt på ej rusningstid (kl. 9–11)" },
          { t: "Visa kötid live på skärm och i schema-appen" }] }
      ]
    };
    el.innerHTML = `<div id="treeWrap"></div>
      <div class="demo-note"><b>Läs framåt:</b> "HUR halverar vi kötiden?" → grenarna. <b>Kontrollera bakåt:</b> peka på ett löv och fråga "VARFÖR gör vi detta?" – svaret ska vara rutan till vänster.</div>`;

    function render() {
      const col1 = `<div class="tree-node open" style="border-color:var(--qm-deep);min-width:170px">${tree.t}</div>`;
      const col2 = tree.kids.map((k, i) =>
        `<div class="tree-node ${k.open ? "open" : ""}" data-tk="${i}">${k.t} <span class="chev">${k.open ? "▾" : "▸ HUR?"}</span></div>`).join("");
      const col3 = tree.kids.map((k, i) => k.open
        ? k.kids.map(l => `<div class="tree-node leaf">✅ ${l.t}</div>`).join("")
        : "").join("");
      el.querySelector("#treeWrap").innerHTML = `
        <div class="tree">
          <div class="tree-col" style="justify-content:center">${col1}</div>
          <div class="tree-col" style="padding-left:22px">${col2}</div>
          <div class="tree-col" style="padding-left:22px">${col3 || '<div style="color:var(--ink-soft);font-size:14px;padding:10px">← Klicka på en gren för att fälla ut åtgärderna</div>'}</div>
        </div>`;
    }
    el.addEventListener("click", e => {
      const n = e.target.closest("[data-tk]");
      if (n) { const k = tree.kids[+n.dataset.tk]; k.open = !k.open; render(); }
    });
    render();
  },

  /* ---- 11. Matrisdiagram: klickbar L-matris ---- */
  matris(el) {
    const rows = [
      { name: "Snabb service", w: 5 }, { name: "Gott kaffe", w: 4 },
      { name: "Lågt pris", w: 3 }, { name: "Trevlig lokal", w: 2 }
    ];
    const cols = ["Fler kassor", "Bättre bönor", "Självservering", "Ny inredning", "Utbilda personal"];
    // 0=tomt, 1=△(1), 2=○(3), 3=●(9)
    const vals = [
      [3, 0, 2, 0, 1],
      [0, 3, 0, 0, 2],
      [0, 1, 2, 0, 0],
      [0, 0, 0, 3, 1]
    ];
    const SYM = ["", "△", "○", "●"], PTS = [0, 1, 3, 9];
    el.innerHTML = `
      <p style="margin:0 0 10px;font-size:15px"><b>Fallet:</b> studentkaféet ska välja åtgärd. Rader = kundkrav (med vikt 1–5), kolumner = möjliga åtgärder.</p>
      <div style="overflow-x:auto"><table class="matrix-table" id="mxTable"></table></div>
      <div class="legend-chips">
        <span>● Starkt samband = 9 p</span><span>○ Medel = 3 p</span><span>△ Svagt = 1 p</span><span>Poäng = vikt × samband</span>
      </div>
      <div class="demo-note" id="mxNote"></div>`;

    function render() {
      const totals = cols.map((_, c) => rows.reduce((s, r, ri) => s + r.w * PTS[vals[ri][c]], 0));
      const maxT = Math.max(...totals);
      el.querySelector("#mxTable").innerHTML = `
        <thead><tr><th class="rowh">Kundkrav ↓ / Åtgärd →</th><th>Vikt</th>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((r, ri) => `
          <tr><th class="rowh">${r.name}</th><td><b>${r.w}</b></td>
            ${cols.map((_, c) => `<td class="matrix-cell" data-mx="${ri}:${c}" title="Klicka för att ändra">${SYM[vals[ri][c]]}</td>`).join("")}
          </tr>`).join("")}
        </tbody>
        <tfoot><tr><td colspan="2" style="text-align:right">Summa poäng:</td>
          ${totals.map(t => `<td class="${t === maxT && t > 0 ? "winner" : ""}">${t}</td>`).join("")}
        </tr></tfoot>`;
      const win = cols[totals.indexOf(maxT)];
      el.querySelector("#mxNote").innerHTML = `<b>Just nu vinner:</b> "${win}" med ${maxT} poäng – den ger mest viktad kundnytta totalt. Klicka i cellerna (tom → △ → ○ → ●) och se hur prioriteringen ändras. Ser du något kundkrav med nästan tom rad?`;
    }
    el.addEventListener("click", e => {
      const c = e.target.closest("[data-mx]");
      if (c) {
        const [r, cc] = c.dataset.mx.split(":").map(Number);
        vals[r][cc] = (vals[r][cc] + 1) % 4;
        render();
      }
    });
    render();
  },

  /* ---- 12. Matrisdataanalys: positioneringskarta ---- */
  matrisdata(el) {
    const items = [
      { n: "Automatkaffet", x: 8, y: 2.1 }, { n: "Kafé Bönan", x: 32, y: 4.4 },
      { n: "Stora kedjan", x: 45, y: 3.6 }, { n: "Studentkaféet", x: 22, y: 3.9 },
      { n: "Bensinmacken", x: 25, y: 2.4 }, { n: "Lyxrosteriet", x: 58, y: 4.7 },
      { n: "Biblioteksfiket", x: 18, y: 3.1 }, { n: "Food trucken", x: 38, y: 4.1 }
    ];
    let sel = -1;
    el.innerHTML = `
      <p style="margin:0 0 10px;font-size:15px"><b>Fallet:</b> åtta kaffeställen på campus, bedömda på pris (kr) och smakbetyg (1–5) av 40 studenter.</p>
      <div class="fishbone-wrap">
        <div id="mdSvg"></div>
        <div class="bone-panel">
          <h4>Kaffeställen</h4>
          <div id="mdList" style="display:flex;flex-direction:column;gap:6px"></div>
        </div>
      </div>
      <div class="demo-note" id="mdNote"><b>Tolka kvadranterna:</b> uppe till vänster = prisvärda favoriter (bra & billigt). Nere till höger = dyra besvikelser. Klicka på ett ställe i listan!</div>`;

    function draw() {
      const W = 560, H = 380, m = 52;
      const X = v => m + (v - 0) / 65 * (W - 2 * m);
      const Y = v => H - m - (v - 1.5) / 3.5 * (H - 2 * m);
      const midX = X(32), midY = Y(3.4);
      const dots = items.map((it, i) => `
        <g data-md="${i}" style="cursor:pointer">
          <circle cx="${X(it.x)}" cy="${Y(it.y)}" r="${sel === i ? 10 : 7}" fill="${sel === i ? "var(--qc)" : "var(--qm)"}" opacity="0.9" stroke="#fff" stroke-width="2"/>
          <text x="${X(it.x)}" y="${Y(it.y) - 13}" font-size="${sel === i ? 12.5 : 11}" text-anchor="middle" font-weight="${sel === i ? 700 : 400}" fill="var(--ink)">${it.n}</text>
        </g>`).join("");
      el.querySelector("#mdSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Positioneringskarta">
          <rect x="${m}" y="${m - 10}" width="${midX - m}" height="${midY - m + 10}" fill="var(--qm-soft)" opacity="0.5"/>
          <rect x="${midX}" y="${midY}" width="${W - m - midX}" height="${H - m - midY}" fill="#f6dede" opacity="0.6"/>
          <text x="${m + 8}" y="${m + 8}" font-size="11.5" font-weight="700" fill="var(--qm-deep)">PRISVÄRDA FAVORITER</text>
          <text x="${W - m - 8}" y="${H - m - 10}" font-size="11.5" font-weight="700" fill="var(--red)" text-anchor="end">DYRA BESVIKELSER</text>
          <line x1="${m}" y1="${H - m}" x2="${W - m}" y2="${H - m}" stroke="var(--ink)" stroke-width="1.5"/>
          <line x1="${m}" y1="${m - 10}" x2="${m}" y2="${H - m}" stroke="var(--ink)" stroke-width="1.5"/>
          <line x1="${midX}" y1="${m - 10}" x2="${midX}" y2="${H - m}" stroke="var(--ink-soft)" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="${m}" y1="${midY}" x2="${W - m}" y2="${midY}" stroke="var(--ink-soft)" stroke-width="1" stroke-dasharray="4 4"/>
          <text x="${W / 2}" y="${H - 14}" font-size="12" text-anchor="middle" fill="var(--ink-soft)">Pris (kr) →</text>
          <text x="16" y="${H / 2}" font-size="12" fill="var(--ink-soft)" transform="rotate(-90 16 ${H / 2})" text-anchor="middle">Smakbetyg (1–5) →</text>
          ${dots}
        </svg>`;
      el.querySelector("#mdList").innerHTML = items.map((it, i) => `
        <button class="qc-opt" data-md="${i}" style="${sel === i ? "border-color:var(--qc);font-weight:700" : ""};padding:7px 12px;font-size:14px">
          ${it.n} <span style="color:var(--ink-soft)">· ${it.x} kr · betyg ${it.y}</span>
        </button>`).join("");
      if (sel >= 0) {
        const it = items[sel];
        const q = (it.x < 32 ? "billig" : "dyr") + " och " + (it.y >= 3.4 ? "omtyckt" : "mindre omtyckt");
        el.querySelector("#mdNote").innerHTML = `<b>${it.n}:</b> ${it.x} kr, betyg ${it.y} – alltså ${q}. ${it.x < 32 && it.y >= 3.4 ? "En prisvärd favorit! ⭐" : it.x >= 32 && it.y < 3.4 ? "Aj – dyrt och svagt betyg. Här finns ett förbättringsbehov!" : "En mellanposition – vad skulle flytta den mot övre vänstra hörnet?"}`;
      }
    }
    el.addEventListener("click", e => {
      const b = e.target.closest("[data-md]");
      if (b) { sel = sel === +b.dataset.md ? -1 : +b.dataset.md; draw(); }
    });
    draw();
  },

  /* ---- 13. PDPC: risker + motåtgärder ---- */
  pdpc(el) {
    const plan = [
      { step: "1. Utforma enkäten", risks: [
        { r: "Frågorna misstolkas", c: "Testa enkäten på 5 personer innan utskick (förebyggande)." },
        { r: "Enkäten blir för lång – folk hoppar av", c: "Max 10 frågor, visa förloppsindikator (förebyggande)." }] },
      { step: "2. Samla in svar på campus", risks: [
        { r: "För få svarar", c: "Bjud på kaffe + QR-kod på bordstält. Plan B: förläng insamlingen 3 dagar." },
        { r: "Bara en studentgrupp svarar (skevt urval)", c: "Samla in på 4 olika platser och tider. Följ upp svarsfördelningen dag 2." }] },
      { step: "3. Analysera resultaten", risks: [
        { r: "Datan är rörig och svår att tolka", c: "Bestäm analysmetod i förväg – släktskapsdiagram för fritextsvar, pareto för avvikelser." }] },
      { step: "4. Presentera för kårstyrelsen", risks: [
        { r: "Tekniken strular vid presentationen", c: "Plan B: PDF på USB + utskrivna exemplar. Testa tekniken 30 min innan." }] }
    ];
    el.innerHTML = `
      <p style="margin:0 0 10px;font-size:15px"><b>Planen:</b> genomföra en enkätundersökning om campusmiljön. Vad kan gå fel – och vad gör vi då?</p>
      <div class="demo-controls"><button class="btn small qm" id="pdpcAll">Fäll ut alla motåtgärder</button></div>
      <div class="pdpc-flow">${plan.map((p, pi) => `
        <div class="pdpc-step">
          <h4>${p.step}</h4>
          <div class="pdpc-risks">${p.risks.map((r, ri) => `
            <div class="pdpc-risk" data-risk="${pi}:${ri}">
              <button type="button">⚠ Vad kan gå fel: ${r.r}</button>
              <div class="pdpc-counter"><b>✔ Motåtgärd:</b> ${r.c}</div>
            </div>`).join("")}
          </div>
        </div>`).join("")}
      </div>
      <div class="demo-note"><b>Notera</b> skillnaden mellan <b>förebyggande</b> åtgärder (minskar risken att det händer) och <b>plan B</b> (beredskap om det ändå händer). En robust plan har båda.</div>`;
    el.addEventListener("click", e => {
      const r = e.target.closest(".pdpc-risk");
      if (r && e.target.closest("button")) r.classList.toggle("open");
    });
    el.querySelector("#pdpcAll").addEventListener("click", () => {
      el.querySelectorAll(".pdpc-risk").forEach(r => r.classList.add("open"));
    });
  },

  /* ---- 14. Pildiagram: kritiska linjen ---- */
  pil(el) {
    // Aktiviteter: id, namn, tid (dagar), beroenden
    const acts = [
      { id: "A", n: "Boka lokal", d: 2, dep: [] },
      { id: "B", n: "Kontakta företag", d: 5, dep: [] },
      { id: "C", n: "Marknadsföring", d: 4, dep: ["A"] },
      { id: "D", n: "Bekräfta utställare", d: 3, dep: ["B"] },
      { id: "E", n: "Planera montrar", d: 2, dep: ["A", "D"] },
      { id: "F", n: "Trycka program", d: 1, dep: ["C", "E"] },
      { id: "G", n: "Genomföra mässan", d: 1, dep: ["F"] }
    ];
    // Framåträkning
    const ES = {}, EF = {};
    acts.forEach(a => { ES[a.id] = Math.max(0, ...a.dep.map(d => EF[d])); EF[a.id] = ES[a.id] + a.d; });
    const total = Math.max(...acts.map(a => EF[a.id]));
    // Bakåträkning
    const LF = {}, LS = {};
    [...acts].reverse().forEach(a => {
      const succ = acts.filter(x => x.dep.includes(a.id));
      LF[a.id] = succ.length ? Math.min(...succ.map(s => LS[s.id])) : total;
      LS[a.id] = LF[a.id] - a.d;
    });
    const slack = a => LS[a.id] - ES[a.id];
    let showCrit = false;

    const layout = { A: [80, 90], B: [80, 250], C: [250, 60], D: [250, 250], E: [400, 170], F: [530, 120], G: [650, 170] };
    el.innerHTML = `
      <p style="margin:0 0 10px;font-size:15px"><b>Projektet:</b> anordna en karriärmässa. Siffran i varje ruta är aktivitetens tid i dagar.</p>
      <div class="demo-controls"><button class="btn small qm" id="critBtn">🔦 Visa kritiska linjen</button></div>
      <div id="pilSvg"></div>
      <div class="demo-note" id="pilNote">Följ pilarna: en aktivitet kan börja först när alla dess föregångare är klara. Hur lång tid tar projektet som kortast?</div>`;

    function draw() {
      const W = 760, H = 330;
      const edgesSvg = acts.flatMap(a => a.dep.map(d => {
        const [x1, y1] = layout[d], [x2, y2] = layout[a.id];
        const crit = showCrit && slack(a) === 0 && slack(acts.find(x => x.id === d)) === 0
          && EF[d] === ES[a.id];
        return `<line x1="${x1 + 60}" y1="${y1}" x2="${x2 - 60}" y2="${y2}" stroke="${crit ? "var(--qc)" : "#b9ad96"}" stroke-width="${crit ? 4 : 2}" marker-end="url(#${crit ? "pArrC" : "pArr"})"/>`;
      })).join("");
      const nodesSvg = acts.map(a => {
        const [x, y] = layout[a.id];
        const crit = showCrit && slack(a) === 0;
        return `<g>
          <rect x="${x - 56}" y="${y - 30}" width="112" height="60" rx="10" fill="${crit ? "var(--qc)" : "var(--card)"}" stroke="${crit ? "var(--qc-deep)" : "var(--qm)"}" stroke-width="2"/>
          <text x="${x}" y="${y - 10}" font-size="11" text-anchor="middle" font-weight="700" fill="${crit ? "#fff" : "var(--ink)"}">${a.id}: ${a.n}</text>
          <text x="${x}" y="${y + 8}" font-size="12" text-anchor="middle" fill="${crit ? "#ffe" : "var(--ink-soft)"}">${a.d} ${a.d === 1 ? "dag" : "dagar"}</text>
          ${showCrit ? `<text x="${x}" y="${y + 24}" font-size="11" text-anchor="middle" font-weight="700" fill="${crit ? "#fff" : "var(--green)"}">${crit ? "KRITISK" : "slack: " + slack(a) + " d"}</text>` : ""}
        </g>`;
      }).join("");
      el.querySelector("#pilSvg").innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Pildiagram">
          <defs>
            <marker id="pArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0L10,5L0,10Z" fill="#b9ad96"/></marker>
            <marker id="pArrC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10Z" fill="var(--qc)"/></marker>
          </defs>
          ${edgesSvg}${nodesSvg}
        </svg>`;
      el.querySelector("#pilNote").innerHTML = showCrit
        ? `<b>Kritiska linjen: B → D → E → F → G = ${total} dagar.</b> Dessa aktiviteter har noll slack – varje förseningsdag där försenar hela mässan. "Boka lokal" och "Marknadsföring" har däremot slack och tål viss försening. Sätt de bästa resurserna på den kritiska linjen!`
        : `Följ pilarna: en aktivitet kan börja först när alla dess föregångare är klara. Hur lång tid tar projektet som kortast?`;
    }
    el.querySelector("#critBtn").addEventListener("click", function () {
      showCrit = !showCrit;
      this.textContent = showCrit ? "Dölj kritiska linjen" : "🔦 Visa kritiska linjen";
      draw();
    });
    draw();
  }
};

/* ============================================================
   QUIZ – Vilket verktyg passar?
   ============================================================ */

const QUIZ = [
  { s: "Ett callcenter har loggat 500 kundklagomål i 12 kategorier och vill veta vilka kategorier de ska angripa först för störst effekt.",
    a: "pareto", d: ["histogram", "styrdiagram", "slaktskap"] },
  { s: "Ett förbättringsteam ska brainstorma kring varför leveranserna blir sena, och vill strukturera möjliga orsaker i kategorier som Människa, Maskin och Metod.",
    a: "ishikawa", d: ["trad", "relation", "pareto"] },
  { s: "En operatör vill enkelt räkna hur ofta olika feltyper dyker upp under sitt skift – direkt vid maskinen, med penna och papper.",
    a: "datainsamling", d: ["histogram", "matris", "styrdiagram"] },
  { s: "Kvalitetschefen vill löpande övervaka fyllnadsvikten i en förpackningslinje och få signal när något i processen faktiskt förändrats.",
    a: "styrdiagram", d: ["histogram", "samband", "pareto"] },
  { s: "Efter en workshop finns 45 post-it-lappar med spridda idéer om hur studiemiljön kan förbättras. Teamet vill hitta teman i röran.",
    a: "slaktskap", d: ["ishikawa", "matris", "trad"] },
  { s: "Ett team misstänker att limmets torktid påverkar hållfastheten och har mätt båda variablerna på 40 detaljer. Finns det ett samband?",
    a: "samband", d: ["histogram", "styrdiagram", "stratifiering"] },
  { s: "Histogrammet över svetstider är konstigt tvåtoppigt. Teamet misstänker att de två skiften arbetar olika och vill dela upp datan för att jämföra.",
    a: "stratifiering", d: ["pareto", "samband", "matrisdata"] },
  { s: "Kårens projektgrupp ska planera en konsert med 15 beroende aktiviteter och vill veta vilka aktiviteter som absolut inte får bli försenade.",
    a: "pil", d: ["trad", "pdpc", "matris"] },
  { s: "Ledningsgruppen har åtta problem som verkar hänga ihop i ett nystan – allt påverkar allt. De vill veta vilket problem som driver de andra.",
    a: "relation", d: ["ishikawa", "slaktskap", "pil"] },
  { s: "Målet 'minska matsvinnet med 30 %' ska brytas ner i delmål och till sist konkreta åtgärder som går att genomföra.",
    a: "trad", d: ["pdpc", "relation", "pareto"] },
  { s: "Teamet har fem förbättringsåtgärder och fyra viktade kundkrav, och vill systematiskt bedöma vilken åtgärd som ger mest total kundnytta.",
    a: "matris", d: ["matrisdata", "pareto", "trad"] },
  { s: "Inför ett kritiskt systembyte vill IT-gruppen i förväg lista allt som kan gå fel vid varje steg – och bestämma motåtgärder innan det händer.",
    a: "pdpc", d: ["pil", "styrdiagram", "ishikawa"] }
];

/* ============================================================
   GUIDE – Vilket verktyg ska jag välja?
   ============================================================ */

const GUIDE = {
  start: {
    q: "Vad har du att jobba med?",
    opts: [
      { emoji: "🔢", b: "Siffror och mätvärden", s: "Mätdata, antal fel, tider, vikter …", next: "num" },
      { emoji: "💬", b: "Ord, idéer och åsikter", s: "Brainstormingidéer, kundcitat, problem som ska planeras bort …", next: "verb" }
    ]
  },
  num: {
    q: "Vad vill du göra med din numeriska data?",
    opts: [
      { emoji: "📋", b: "Samla in data systematiskt", s: "Jag har ingen data än – jag behöver börja räkna händelser", tool: "datainsamling" },
      { emoji: "🥇", b: "Prioritera bland problem", s: "Vilka feltyper ska vi angripa först?", tool: "pareto" },
      { emoji: "🔔", b: "Se fördelningens form", s: "Var ligger centrum? Hur stor är spridningen?", tool: "histogram" },
      { emoji: "⏱️", b: "Övervaka processen över tid", s: "Är processen stabil? Har något förändrats?", tool: "styrdiagram" },
      { emoji: "🔗", b: "Undersöka samband mellan två variabler", s: "Påverkar X verkligen Y?", tool: "samband" },
      { emoji: "🗂️", b: "Jämföra grupper eller källor", s: "Skiljer sig maskinerna? Skiften? Leverantörerna?", tool: "stratifiering" },
      { emoji: "🧮", b: "Analysera en hel datamatris", s: "Många alternativ bedömda på många egenskaper", tool: "matrisdata" }
    ]
  },
  verb: {
    q: "Vad vill du göra med dina idéer och ord?",
    opts: [
      { emoji: "🗒️", b: "Skapa ordning i många idéer", s: "En hög post-it-lappar behöver bli teman", tool: "slaktskap" },
      { emoji: "🐟", b: "Kartlägga orsaker till ETT problem", s: "Varför uppstår felet? Strukturera efter 7M", tool: "ishikawa" },
      { emoji: "🕸️", b: "Reda ut vad som driver vad", s: "Många problem som påverkar varandra kors och tvärs", tool: "relation" },
      { emoji: "🌳", b: "Bryta ner ett mål till åtgärder", s: "Från vision till att-göra-lista", tool: "trad" },
      { emoji: "▦", b: "Koppla ihop och prioritera två listor", s: "T.ex. kundkrav mot åtgärder", tool: "matris" },
      { emoji: "🛡️", b: "Förbereda planen för motgångar", s: "Vad kan gå fel – och vad gör vi då?", tool: "pdpc" },
      { emoji: "🏹", b: "Tidsplanera ett projekt", s: "Aktiviteter, beroenden och deadline", tool: "pil" }
    ]
  }
};

/* ============================================================
   VYER / RENDERING
   ============================================================ */

function toolCard(t) {
  return `<a class="tool-card ${t.family} reveal" href="#/verktyg/${t.id}">
    <span class="num">${t.num}</span>
    <span class="icon">${t.icon}</span>
    <h3>${t.name}</h3>
    <p>${t.oneliner}</p>
  </a>`;
}

function renderHome() {
  const qc = TOOLS.filter(t => t.family === "qc");
  const qm = TOOLS.filter(t => t.family === "qm");
  app.innerHTML = `
    <div class="hero">
      <span class="hero-kicker">14 verktyg · 2 familjer · 100 % interaktivt</span>
      <h1>Kvalitetsverktygen<br><em>7QC</em> &amp; <span class="alt">7QM</span></h1>
      <p class="lead">Lär dig förbättringsarbetets klassiska verktygslåda – med förklaringar du förstår och demos du kan klicka på. Byggd för studenter i kvalitetsutveckling.</p>
      <div class="hero-actions">
        <a class="btn" href="#/guide">🧭 Hjälp mig välja verktyg</a>
        <a class="btn ghost" href="#/quiz">🎯 Testa dina kunskaper</a>
      </div>
    </div>

    <div class="data-split">
      <div class="data-card qc reveal">
        <span class="tagline">7QC · De sju förbättringsverktygen</span>
        <h3>För numerisk data 🔢</h3>
        <p>När du har siffror – mätvärden, antal fel, tider. Verktygen hjälper dig samla in, visualisera och analysera data för att hitta och prioritera problem.</p>
      </div>
      <div class="vs">→ eller →</div>
      <div class="data-card qm reveal">
        <span class="tagline">7QM · De sju ledningsverktygen</span>
        <h3>För verbal data 💬</h3>
        <p>När du har ord – idéer, åsikter, planer och komplexa problem. Verktygen skapar struktur, visar samband och gör planer robusta.</p>
      </div>
    </div>

    <section class="tool-section">
      <div class="section-head"><span class="pill qc">7QC</span><h2>De sju förbättringsverktygen</h2></div>
      <p class="section-sub">Klassikerna från japansk kvalitetsrörelse – enkla, grafiska verktyg som gör fakta synliga. Enligt Ishikawa löser de flesta kvalitetsproblem med just dessa.</p>
      <div class="tool-grid">${qc.map(toolCard).join("")}</div>
    </section>

    <section class="tool-section">
      <div class="section-head"><span class="pill qm">7QM</span><h2>De sju ledningsverktygen</h2></div>
      <p class="section-sub">När problemen är komplexa och informationen består av ord snarare än siffror – för planering, struktur och beslut på ledningsnivå.</p>
      <div class="tool-grid">${qm.map(toolCard).join("")}</div>
    </section>`;
}

function renderTool(id) {
  const idx = toolIndex[id];
  if (idx === undefined) { location.hash = "#/"; return; }
  const t = TOOLS[idx];
  const fam = t.family === "qc" ? "7QC · Förbättringsverktyg" : "7QM · Ledningsverktyg";
  const prev = TOOLS[(idx + TOOLS.length - 1) % TOOLS.length];
  const next = TOOLS[(idx + 1) % TOOLS.length];

  app.innerHTML = `
  <div class="tool-page ${t.family}">
    <p class="crumb"><a href="#/">← Alla verktyg</a></p>

    <div class="tool-hero ${t.family} reveal">
      <span class="big-icon">${t.icon}</span>
      <div class="meta">
        <span class="numchip ${t.family}">${t.num}</span>
        <span class="pill ${t.family}">${fam}</span>
      </div>
      <h1>${t.name}</h1>
      <p class="oneliner">${t.oneliner}</p>
      <p class="aka">${t.aka}</p>
    </div>

    <div class="factbar reveal">
      <div class="fact"><div class="k">Typ av data</div><div class="v">${t.facts.data}</div></div>
      <div class="fact"><div class="k">Används för att</div><div class="v">${t.facts.anvands}</div></div>
      <div class="fact"><div class="k">Svårighetsgrad</div><div class="v">${t.facts.svarighet}</div></div>
      <div class="fact"><div class="k">Du får ut</div><div class="v">${t.facts.resultat}</div></div>
    </div>

    <div class="tool-body">
      <section class="reveal">
        <h2 class="sec-title"><span class="badge">🎯</span>Vad är det – och varför?</h2>
        <div class="prose">${t.what}</div>
      </section>

      <section class="reveal">
        <h2 class="sec-title"><span class="badge">🪜</span>Så gör du – steg för steg</h2>
        <ol class="steps">${t.steps.map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join("")}</ol>
      </section>

      <section class="reveal">
        <h2 class="sec-title"><span class="badge">🧪</span>Testa själv!</h2>
        <div class="demo-box">
          <div class="demo-head"><span class="lab">Interaktiv demo</span><span class="hint">${t.demoHint}</span></div>
          <div class="demo-content" id="demoRoot"></div>
        </div>
      </section>

      <section class="reveal">
        <h2 class="sec-title"><span class="badge">⚠️</span>Tänk på</h2>
        <ul class="watchouts">${t.watchouts.map(w => `<li><span>${w}</span></li>`).join("")}</ul>
      </section>

      <section class="reveal">
        <h2 class="sec-title"><span class="badge">✅</span>Snabbkoll</h2>
        <div class="quickcheck">
          <div class="q">${t.check.q}</div>
          <div class="qc-options" id="qcOpts"></div>
          <div class="qc-explain" id="qcExplain">${t.check.explain}</div>
        </div>
      </section>
    </div>

    <div class="pager">
      <a href="#/verktyg/${prev.id}"><div class="dir">← Föregående</div><div class="t">${prev.icon} ${prev.name}</div></a>
      <a class="next" href="#/verktyg/${next.id}"><div class="dir">Nästa →</div><div class="t">${next.icon} ${next.name}</div></a>
    </div>
  </div>`;

  // Snabbkoll: blanda svarsalternativen
  const order = t.check.options.map((_, i) => i).sort(() => (hashStr(t.id + "x") % 2 ? 1 : -1) * 0.5 - Math.random() + 0.5);
  const optsEl = document.getElementById("qcOpts");
  optsEl.innerHTML = order.map(i => `<button class="qc-opt" data-opt="${i}">${t.check.options[i]}</button>`).join("");
  optsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-opt]");
    if (!b) return;
    const chosen = +b.dataset.opt;
    optsEl.querySelectorAll(".qc-opt").forEach(x => {
      x.disabled = true;
      if (+x.dataset.opt === t.check.correct) x.classList.add("correct");
      else if (+x.dataset.opt === chosen) x.classList.add("wrong");
    });
    document.getElementById("qcExplain").classList.add("show");
  }, { once: true });

  // Starta demo
  const demoRoot = document.getElementById("demoRoot");
  if (DEMOS[t.id]) DEMOS[t.id](demoRoot);
}

function hashStr(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

/* ---------- Quiz ---------- */
let quizState = null;

function renderQuiz() {
  if (!quizState) quizState = { i: 0, score: 0, done: false, order: QUIZ.map((_, i) => i) };
  const st = quizState;

  if (st.done || st.i >= QUIZ.length) {
    const pct = st.score / QUIZ.length;
    const verdict = pct === 1 ? "Perfekt! Du är redo att förbättra världen. 🏆"
      : pct >= 0.75 ? "Starkt jobbat – verktygslådan sitter nästan helt! 💪"
      : pct >= 0.5 ? "Bra början! Kika en extra gång på verktygen du missade. 📚"
      : "Bra att du testade! Gå igenom verktygen och försök igen – repetition är kunskapens moder. 🌱";
    app.innerHTML = `
      <div class="quiz-shell">
        <div class="quiz-card reveal quiz-result">
          <h1 style="font-size:30px">Resultat</h1>
          <div class="quiz-score">${st.score}/${QUIZ.length}</div>
          <p class="quiz-verdict">${verdict}</p>
          <button class="btn" id="qRestart">↺ Kör igen</button>
          <a class="btn ghost" href="#/">Till verktygen</a>
        </div>
      </div>`;
    document.getElementById("qRestart").addEventListener("click", () => { quizState = null; renderQuiz(); });
    return;
  }

  const q = QUIZ[st.order[st.i]];
  const correctTool = TOOLS[toolIndex[q.a]];
  const options = [q.a, ...q.d]
    .map(id => TOOLS[toolIndex[id]])
    .sort(() => Math.random() - 0.5);

  app.innerHTML = `
    <div class="quiz-shell">
      <h1 style="text-align:center;font-size:clamp(26px,4vw,36px)">🎯 Vilket verktyg passar?</h1>
      <p style="text-align:center;color:var(--ink-soft);margin-top:-6px">Fråga ${st.i + 1} av ${QUIZ.length} · Rätt hittills: ${st.score}</p>
      <div class="quiz-progress"><div style="width:${100 * st.i / QUIZ.length}%"></div></div>
      <div class="quiz-card reveal">
        <div class="quiz-scenario">Scenario</div>
        <div class="quiz-q">${q.s}</div>
        <div class="qc-options" id="quizOpts">
          ${options.map(o => `<button class="qc-opt" data-tool="${o.id}">${o.icon} <b>${o.name}</b> <span style="color:var(--ink-soft)">· ${o.family === "qc" ? "7QC" : "7QM"}</span></button>`).join("")}
        </div>
        <div class="qc-explain" id="quizExplain"></div>
        <div style="margin-top:16px;text-align:right;display:none" id="quizNextWrap">
          <button class="btn" id="quizNext">${st.i + 1 === QUIZ.length ? "Se resultat" : "Nästa fråga →"}</button>
        </div>
      </div>
    </div>`;

  document.getElementById("quizOpts").addEventListener("click", e => {
    const b = e.target.closest("[data-tool]");
    if (!b) return;
    const right = b.dataset.tool === q.a;
    if (right) st.score++;
    document.querySelectorAll("#quizOpts .qc-opt").forEach(x => {
      x.disabled = true;
      if (x.dataset.tool === q.a) x.classList.add("correct");
      else if (x === b) x.classList.add("wrong");
    });
    const ex = document.getElementById("quizExplain");
    ex.innerHTML = `${right ? "✅ <b>Rätt!</b>" : "❌ <b>Inte riktigt.</b>"} Rätt svar är <b>${correctTool.name}</b>: ${correctTool.oneliner} <a href="#/verktyg/${correctTool.id}">Läs mer →</a>`;
    ex.classList.add("show");
    document.getElementById("quizNextWrap").style.display = "block";
  }, { once: true });

  document.getElementById("quizNext")?.addEventListener("click", () => { st.i++; renderQuiz(); });
}

/* ---------- Guide ---------- */
function renderGuide(step = "start") {
  const node = GUIDE[step];
  app.innerHTML = `
    <div class="wizard">
      <h1 style="text-align:center;font-size:clamp(26px,4vw,36px)">🧭 Vilket verktyg ska jag välja?</h1>
      <p style="text-align:center;color:var(--ink-soft)">Svara på ${step === "start" ? "en fråga i taget" : "frågan"} så pekar vi ut rätt verktyg.</p>
      <div class="wizard-card reveal">
        <div class="wizard-q">${node.q}</div>
        <div class="wizard-opts">
          ${node.opts.map((o, i) => `
            <button class="wizard-opt" data-opt="${i}">
              <span class="emoji">${o.emoji}</span>
              <span><b>${o.b}</b><small>${o.s}</small></span>
            </button>`).join("")}
        </div>
        ${step !== "start" ? `<p class="wizard-back"><a href="#" id="wBack">← Börja om</a></p>` : ""}
      </div>
    </div>`;
  app.querySelector(".wizard-opts").addEventListener("click", e => {
    const b = e.target.closest("[data-opt]");
    if (!b) return;
    const o = node.opts[+b.dataset.opt];
    if (o.next) renderGuide(o.next);
    else renderGuideResult(o.tool);
  });
  document.getElementById("wBack")?.addEventListener("click", e => { e.preventDefault(); renderGuide("start"); });
}

function renderGuideResult(toolId) {
  const t = TOOLS[toolIndex[toolId]];
  app.innerHTML = `
    <div class="wizard">
      <div class="wizard-card reveal wizard-result">
        <div class="icon">${t.icon}</div>
        <p style="margin:4px 0 2px"><span class="pill ${t.family}">${t.family === "qc" ? "7QC" : "7QM"}</span></p>
        <h1 style="font-size:clamp(28px,4vw,40px)">${t.name}</h1>
        <p style="max-width:480px;margin:0 auto 22px;color:var(--ink-soft);font-size:17px">${t.oneliner}</p>
        <a class="btn ${t.family}" href="#/verktyg/${t.id}">Öppna verktyget →</a>
        <p class="wizard-back"><a href="#/guide" id="wAgain">← Fråga igen</a></p>
      </div>
    </div>`;
}

/* ============================================================
   ROUTER
   ============================================================ */

function route() {
  const h = location.hash || "#/";
  const parts = h.replace(/^#\//, "").split("/");
  document.querySelectorAll(".topnav a").forEach(a => a.classList.remove("active"));
  const mark = k => document.querySelector(`.topnav a[data-nav="${k}"]`)?.classList.add("active");

  if (parts[0] === "verktyg" && parts[1]) { renderTool(parts[1]); }
  else if (parts[0] === "guide") { renderGuide("start"); mark("guide"); }
  else if (parts[0] === "quiz") { quizState = null; renderQuiz(); mark("quiz"); }
  else { renderHome(); mark("hem"); }

  window.scrollTo({ top: 0 });
  app.focus({ preventScroll: true });
}

window.addEventListener("hashchange", route);
route();
