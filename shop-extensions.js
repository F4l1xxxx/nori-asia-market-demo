/* ASIA MART: Original shopping-intent discovery features, no data collection.
   Competitor-inspired information architecture, never imported assets or claims.
   All products, prices, storage tags and collection suggestions are fictional. */
(()=>{
"use strict";
const api=window.NORI_DEMO;if(!api)return;
const products=api.products;
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=x=>Number(x).toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const norm=s=>String(s||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("de");
const rules={
"Reis & Nudeln":[
 ["Reissorten",p=>/reis/.test(norm(p.name))&&!/nudel|bandnudel|faden|vermicelli/.test(norm(p.name))],
 ["Reis- & Glasnudeln",p=>/reisnudel|bandnudel|glasnudel|vermicelli|pho|bun /.test(norm(p.name))],
 ["Ramen & Instantnudeln",p=>/ramen|instant/.test(norm(p.name))],
 ["Udon, Soba & Wok",p=>/udon|soba|wok|weizen|eiernudel|mi goreng/.test(norm(p.name))]
],
"Saucen & Gewürze":[
 ["Soja- & Würzsaucen",p=>/soja|tamari|teriyaki|hoisin|austern|fischsauce/.test(norm(p.name))],
 ["Chili & Scharfes",p=>/chili|sriracha|sambal|gochujang/.test(norm(p.name))],
 ["Currys, Miso & Pasten",p=>/curry|miso|paste|gewurze/.test(norm(p.name))],
 ["Öle & Essig",p=>/ol|essig|mirin/.test(norm(p.name))]
],
"Snacks & Süßes":[
 ["Mochi & Reiskuchen",p=>/mochi|reiskuchen/.test(norm(p.name))],
 ["Chips & Cracker",p=>/chips|cracker|snack|seaweed/.test(norm(p.name))],
 ["Kekse & Süßigkeiten",p=>/pocky|keks|waffel|bonbon|schoko|fruchtgummi|jelly/.test(norm(p.name))]
],
"Tiefkühl & Fertiggerichte":[
 ["Gyoza & Dumplings",p=>/gyoza|dumpling|mandu|wonton/.test(norm(p.name))],
 ["Bao & Dim Sum",p=>/bao|dim sum/.test(norm(p.name))],
 ["Fertiggerichte",p=>/reis|ramen|curry|gericht|suppe|pfanne|bibimbap/.test(norm(p.name))]
],
"Getränke & Tee":[
 ["Tee & Matcha",p=>/tee|matcha|sencha|hojicha|genmaicha|oolong|chai/.test(norm(p.name))],
 ["Limonaden & Softdrinks",p=>/limo|soda|ramune|drink|kombucha/.test(norm(p.name))],
 ["Säfte & Nektare",p=>/saft|nektar/.test(norm(p.name))],
 ["Kaffee & Milchtee",p=>/kaffee|coffee|milchtee|latte/.test(norm(p.name))]
],
"Basics & Konserven":[
 ["Kokos & Süße",p=>/kokos|palmzucker|tamarinde/.test(norm(p.name))],
 ["Algen & Brühen",p=>/nori|wakame|dashi/.test(norm(p.name))],
 ["Mehle & Backzutaten",p=>/mehl|panko|tempura|tapioka/.test(norm(p.name))],
 ["Gemüse & Konserven",p=>/bohnen|sprossen|jackfruit|wasser|bambus|shiitake|frucht|mango|litschi|longan/.test(norm(p.name))]
]};
function subtypeOf(p){
 const groups=rules[p.category]||[];
 return (groups.find(([,f])=>f(p))||["Weitere Spezialitäten"])[0];
}
function groupsFor(category){
 const pool=products.filter(p=>p.category===category);
 return [...new Set(pool.map(subtypeOf))].map(name=>({name,count:pool.filter(p=>subtypeOf(p)===name).length})).filter(x=>x.count>0);
}
function storageOf(p){return p.category==="Tiefkühl & Fertiggerichte"?"Tiefkühlware · Transport nur mit gesicherter Kühlkette":"Lagerung nach Herstellerangabe";}
const lists=[
 {id:"sushi",label:"Sushi-Starter",icon:"🍣",tag:"Japan entdecken",headline:"Dein erster Sushi-Abend",desc:"Die Grundlage für selbst gemachte Sushi-Rollen – frei zusammengestellt ohne Set-Rabatt.",steps:["Sushireis nach Packungsangabe garen und würzen.","Mit Nori und Zutaten deiner Wahl Rollen formen.","Mit Sauce nach Geschmack servieren."],names:["Sushireis Rundkorn","Nori Algenblätter","Reisessig Mild","Sojasauce Mild"]},
 {id:"ramen",label:"Ramen-Küche",icon:"🍜",tag:"Wärmende Klassiker",headline:"Ramen zum Selbermachen",desc:"Nudeln, Würzbasis und Toppings in einem freiwilligen Einkaufsvorschlag.",steps:["Würzbasis nach eigener Rezeptur vorbereiten.","Nudeln nach Packungsangabe kochen.","Mit weiteren Zutaten und Chiliöl ergänzen."],names:["Ramen Weizennudeln","Miso Paste Weiß","Sojasauce Mild","Sesamöl Geröstet","Chili Crisp Knusperöl"]},
 {id:"curry",label:"Thai-Curry",icon:"🍛",tag:"Thailand entdecken",headline:"Thai-Curry-Basics",desc:"Aromatische Grundzutaten für ein Curry-Gericht – ohne unerwünschte Artikel im Warenkorb.",steps:["Currypaste nach gewünschter Intensität anrösten.","Kokosmilch und weitere Zutaten nach eigener Rezeptur ergänzen.","Mit Reis servieren."],names:["Jasminreis Premium","Rote Currypaste","Kokosmilch Cremig","Fischsauce"]}
];
function selectedProducts(list){return list.names.map(name=>products.find(p=>p.name===name)).filter(Boolean);}
function narrowHomeSection(){
 const marker=$("#categories");
 if(!marker||$("#discovery-shortcuts"))return;
 const cards=[
 ["Ramen & Instantnudeln","Reis & Nudeln","Ramen & Instantnudeln","🍜"],
 ["Reissorten","Reis & Nudeln","Reissorten","🍚"],
 ["Chili & Scharfes","Saucen & Gewürze","Chili & Scharfes","🌶️"],
 ["Mochi & Reiskuchen","Snacks & Süßes","Mochi & Reiskuchen","🍡"],
 ["Tee & Matcha","Getränke & Tee","Tee & Matcha","🍵"],
 ["Gyoza & Dumplings","Tiefkühl & Fertiggerichte","Gyoza & Dumplings","🥟"]
 ].map(([label,cat,sub,emoji])=>{
 const g=groupsFor(cat).find(x=>x.name===sub);
 return '<a class="discovery-chip" href="?kategorie='+encodeURIComponent(cat)+'&typ='+encodeURIComponent(sub)+'"><span aria-hidden="true">'+emoji+'</span><strong>'+esc(label)+'</strong><small>'+(g?.count||0)+' Demoartikel</small></a>';
 }).join("");
 const section=document.createElement("section");
 section.id="discovery-shortcuts";section.className="layout discovery-shortcuts";
 section.innerHTML='<div class="section-heading retail-heading"><div><span class="retail-label">SCHNELLER ZUM LIEBLINGSPRODUKT</span><h2>Was suchst du <em>heute?</em></h2><p>Unterkategorien wie im echten Supermarkt – ohne langes Durchscrollen.</p></div><a class="shop-all-link" href="?seite=sortiment">Gesamtes Sortiment ↗</a></div><div class="discovery-shortcut-grid">'+cards+'</div>';
 marker.insertAdjacentElement("afterend",section);
 const other=document.createElement("section");
 other.id="discovery-worlds";other.className="layout discovery-worlds";
 other.innerHTML='<div class="discovery-world-copy"><span class="retail-label">INSPIRATION STATT ENDLOSER SUCHEREI</span><h2>Du hast das Gericht.<br><em>Wir zeigen die Zutaten.</em></h2><p>Entdecke drei einfache Einkaufslisten für Sushi, Ramen oder Thai-Curry – Produkte und Preise bleiben vollständig transparent.</p><a href="?seite=kochideen" class="market-button">Kochideen & Einkaufslisten ↗</a></div><div class="discovery-world-icons" aria-hidden="true"><span>🍣</span><span>🍜</span><span>🍛</span></div>';
 const highlights=$("#highlights");if(highlights)highlights.insertAdjacentElement("beforebegin",other);
 const nav=$(".store-nav .nav-inner");
 if(nav&&!nav.querySelector('[href="?seite=kochideen"]')){
  const link=document.createElement("a");link.href="?seite=kochideen";link.textContent="Kochideen";link.className="nav-discovery";
  const shipping=nav.querySelector(".nav-ship");nav.insertBefore(link,shipping||null);
 }
 const footer=$(".market-footer .footer-grid>div:nth-child(2)");
 if(footer){const a=document.createElement("a");a.href="?seite=kochideen";a.textContent="Kochideen & Sets";footer.append(a);}
 const footService=$(".market-footer .footer-grid>div:nth-child(3)");
 if(footService){const a=document.createElement("a");a.href="?seite=frische";a.textContent="Frische & Kühlversand (Konzept)";footService.append(a);}
}
function renderInspirations(){
 const home=$("#home-main"),root=$("#route-root");if(!root)return;
 home.hidden=true;root.hidden=false;
 const intro='<div class="layout route-inner"><nav class="breadcrumbs"><a href="./">Startseite</a><span>›</span><strong>Kochideen & Einkaufslisten</strong></nav><div class="idea-top"><span class="demo-label">NUR KAUFINSPIRATION · KEINE VERBINDLICHEN SETPREISE</span><h1>Alles für deinen nächsten Asia-Abend.</h1><p>Entdecke kombinierte Zutatenlisten. Jede Position ist freiwillig auswählbar und wird nur bei Klick in den Demo-Warenkorb gelegt.</p><p id="ideas-status" role="status" aria-live="polite" class="ideas-status"></p></div>';
 const cards=lists.map((list,i)=>{
 const arr=selectedProducts(list);
 return '<article class="idea-card" id="idee-'+list.id+'"><div class="idea-head idea-color-'+i+'"><span>'+list.icon+'</span><div><small>'+esc(list.tag)+'</small><h2>'+esc(list.headline)+'</h2><p>'+esc(list.desc)+'</p></div></div>'+
 '<div class="idea-content"><h3>Deine Einkaufsliste</h3><div class="idea-selection" data-idea="'+list.id+'">'+arr.map(p=>'<label class="idea-line"><input type="checkbox" data-idea-item value="'+esc(p.id)+'" '+(p.demoStock===0?'disabled':'checked')+'><span class="idea-line-icon">'+p.emoji+'</span><span class="idea-line-detail"><strong>'+esc(p.name)+'</strong><small>'+esc(p.size)+' · '+esc(p.unitPrice)+'</small></span><b>'+money(p.price)+'</b><a href="?produkt='+encodeURIComponent(p.id)+'" aria-label="Produktdetails '+esc(p.name)+'">Details ↗</a></label>').join("")+'</div>'+
 '<div class="idea-total"><span>Ausgewählte Artikel</span><strong data-idea-total="'+list.id+'"></strong></div><button class="market-button" data-idea-add="'+list.id+'">Auswahl in den Demo-Warenkorb ↗</button><small class="idea-disclaimer">Keine Paketpreise, kein automatisch angewendeter Rabatt. Zutaten und Zubereitung sind reine Ideen.</small>'+
 '<details class="idea-steps"><summary>So könnte dein Gericht entstehen</summary><ol>'+list.steps.map(s=>'<li>'+esc(s)+'</li>').join("")+'</ol></details></div></article>';
 }).join("");
 root.innerHTML=intro+'<div class="idea-grid">'+cards+'</div><div class="ideas-closer"><h2>Lieber einzeln stöbern?</h2><p>Du kannst alle 150 Demoartikel unabhängig von den Einkaufslisten auswählen.</p><a class="market-button" href="?seite=sortiment">Zum Sortiment ↗</a></div></div>';
 document.title="Kochideen & Einkaufslisten | ASIA MART Demo";
 updateTotals();
}
function renderFreshness(){
 const root=$("#route-root");if(!root)return;
 $("#home-main").hidden=true;root.hidden=false;
 root.innerHTML='<div class="layout route-inner"><nav class="breadcrumbs"><a href="./">Startseite</a><span>›</span><strong>Frische & Lieferung</strong></nav><div class="idea-top"><span class="demo-label">VERSAND- UND FRISCHEKONZEPT · KEINE LIEFERZUSAGE</span><h1>Lebensmittel brauchen den passenden Versand.</h1><p>So kann ein Asia-Onlineshop Frische, Lagerung und Lieferoptionen transparent kommunizieren. Ohne echte Logistikdaten sind diese Optionen noch nicht buchbar.</p></div>'+
 '<div class="freshness-grid"><article><span>📦</span><h2>Haltbare Lebensmittel</h2><p>Reis, trockene Nudeln und Konserven lassen sich bei geeigneter Verpackung typischerweise unkomplizierter versenden. Im Live-Shop gelten die geprüften Herstellerhinweise.</p><a href="?kategorie=Reis%20%26%20Nudeln">Demo-Artikel ansehen ↗</a></article>'+
 '<article><span>🥬</span><h2>Frischwaren</h2><p>Temperaturanforderungen, kürzere Lieferwege und eine Filialabholung müssen zunächst mit dem Händler und dessen Sortiment geklärt werden.</p><small>Noch keine Frischprodukte oder Abholstandorte hinterlegt.</small></article>'+
 '<article><span>❄️</span><h2>Tiefkühlware</h2><p>Ein normaler Paketversand kann für TK-Waren ungeeignet sein. Die spätere Lösung muss Kühlkette, Gebiete, Verpackung, Zustellung und Kosten verbindlich prüfen.</p><a href="?kategorie='+encodeURIComponent("Tiefkühl & Fertiggerichte")+'">Tiefkühl-Demoartikel ↗</a></article></div>'+
 '<div class="freshness-important"><h2>Was bedeutet das für die Demo-Kasse?</h2><p>Die jetzige Kasse zeigt nur Muster-Versandarten. Sie prüft weder Postleitzahlen noch Kühlketten, Sendungsverfolgung oder reale Lieferzeiten. Für den späteren Live-Shop werden Versandregeln nach Warenkorb, Zielgebiet und Temperaturzone benötigt.</p><a class="market-button" href="?seite=versand">Demo-Versandoptionen ansehen ↗</a></div></div>';
 document.title="Frische & Kühlversand | ASIA MART Demo";
}
function updateTotals(){
 document.querySelectorAll("[data-idea]").forEach(node=>{
  const list=lists.find(x=>x.id===node.dataset.idea);if(!list)return;
  const selected=[...node.querySelectorAll("[data-idea-item]:checked")].map(x=>products.find(p=>p.id===x.value)).filter(Boolean);
  const el=document.querySelector('[data-idea-total="'+list.id+'"]');if(el)el.textContent=selected.length+" Artikel · "+money(selected.reduce((sum,p)=>sum+p.price,0));
 });
}
document.addEventListener("change",e=>{if(e.target.matches("[data-idea-item]"))updateTotals()});
document.addEventListener("click",e=>{
 const btn=e.target.closest("[data-idea-add]");if(!btn)return;
 e.preventDefault();
 const list=lists.find(x=>x.id===btn.dataset.ideaAdd);
 if(!list)return;
 const el=document.querySelector('[data-idea="'+list.id+'"]');if(!el)return;
 const chosen=[...el.querySelectorAll("[data-idea-item]:checked")].map(x=>products.find(p=>p.id===x.value)).filter(Boolean);
 if(!chosen.length){const msg=document.querySelector("#ideas-status");if(msg)msg.textContent="Bitte wähle mindestens einen Artikel.";return}
 let count=0;
 for(const p of chosen){if(p.demoStock>0){api.addToCart(p.id,1);count++;}}
 const status=document.querySelector("#ideas-status");if(status)status.textContent=count+" Demoartikel hinzugefügt. Du kannst den Warenkorb oben öffnen.";
 btn.textContent="✓ "+count+" Artikel hinzugefügt – weitere wählen";
});
document.addEventListener("DOMContentLoaded",()=>{
 narrowHomeSection();
 const route=new URLSearchParams(location.search).get("seite");
 if(route==="kochideen")renderInspirations();
 if(route==="frische")renderFreshness();
});
window.ASIA_SHOP_FEATURES={subtypeOf,groupsFor,storageOf,lists};
})();