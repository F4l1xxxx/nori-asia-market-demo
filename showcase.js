/* ASIA MART showcase pages + illustrative merchant console.
 * No live payments, orders, accounts, customer data, or remote API calls.
 * All edits in merchant console are local browser demonstrations.
 */
(()=>{
"use strict";
const api=window.NORI_DEMO;
if(!api||!Array.isArray(api.products))return;
const items=api.products;
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const eur=n=>Number(n).toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const normalize=s=>String(s||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("de");
const q=new URLSearchParams(location.search),slugProduct=q.get("produkt"),catParam=q.get("kategorie"),countryParam=q.get("land"),queryParam=q.get("suche"),pageParam=q.get("seite");
const inRoute=Boolean(slugProduct||catParam||countryParam||queryParam||pageParam);
const routeRoot=$("#route-root"),homepage=$("#home-main");
const stockKey="asiamart-demo-merchant-v2";
const sampleOrders=[
 {id:"DEMO-1001",label:"Beispielkundin A",date:"12.11.2026",units:3,total:38.40,method:"Standardversand",status:"Neu"},
 {id:"DEMO-1002",label:"Beispielkunde B",date:"11.11.2026",units:7,total:76.10,method:"Abholung",status:"In Bearbeitung"},
 {id:"DEMO-1003",label:"Beispielkundin C",date:"10.11.2026",units:4,total:52.65,method:"Standardversand",status:"Versendet"},
 {id:"DEMO-1004",label:"Beispielkunde D",date:"09.11.2026",units:2,total:22.40,method:"Express",status:"Versendet"},
 {id:"DEMO-1005",label:"Beispielkunde E",date:"08.11.2026",units:5,total:64.80,method:"Standardversand",status:"Abgeschlossen"}
];
let adminData={products:{},orderStatus:{}};
try{const stored=JSON.parse(localStorage.getItem(stockKey)||"{}");if(stored&&typeof stored==="object")adminData={products:stored.products||{},orderStatus:stored.orderStatus||{}}}catch{}
items.forEach((p,i)=>{
 p.originalDemoPrice=p.price;
 p.demoStock=30+(i*17)%85;
 const ov=adminData.products[p.id];
 if(!ov)return;
 if(Number.isFinite(Number(ov.price))&&Number(ov.price)>=.01&&Number(ov.price)<=9999)p.price=Number(ov.price);
 if(Number.isInteger(Number(ov.stock))&&Number(ov.stock)>=0&&Number(ov.stock)<=99999)p.demoStock=Number(ov.stock);
 updateUnit(p);
});
function updateUnit(p){
 const m=p.size.match(/^(\d+(?:[,.]\d+)?)\s*(g|kg|ml|l)$/i);
 if(!m)return;
 const base=Number(m[1].replace(",","."))*((m[2].toLowerCase()==="g"||m[2].toLowerCase()==="ml")?.001:1);
 p.unitPrice=eur(p.price/base)+"/"+(/ml|l/i.test(m[2])?"l":"kg");
}
api.refresh?.();
const catUrl=x=>"?kategorie="+encodeURIComponent(x);
const productUrl=x=>"?produkt="+encodeURIComponent(x);
const pageUrl=x=>"?seite="+encodeURIComponent(x);
const demoNote='<span class="demo-label">PRÄSENTATIONSDEMO · FIKTIVE ANGABEN</span>';
function breadcrumbs(parts){
 return '<nav class="breadcrumbs" aria-label="Brotkrumennavigation"><a href="./">Startseite</a>'+parts.map((p,i)=>'<span>›</span>'+(p.url?'<a href="'+p.url+'">'+esc(p.name)+'</a>':'<strong aria-current="page">'+esc(p.name)+'</strong>')).join("")+'</nav>';
}
function detailPack(p){
 const c=p.colors||["#e8dece","#514a39"];
 return '<div class="showcase-product-art" style="--art-a:'+c[0]+';--art-b:'+c[1]+'">'+
 '<div class="art-shadow"></div><div class="art-pack type-'+p.ci+'"><div class="art-top">'+esc(p.brand)+'</div><div class="art-emoji" aria-hidden="true">'+p.emoji+'</div><strong>'+esc(p.name)+'</strong><small>'+esc(p.size)+'</small></div>'+
 '</div>';
}
function productTile(p){
 return '<article class="shop-tile"><a class="shop-tile-visual" href="'+productUrl(p.id)+'" aria-label="'+esc(p.name)+' ansehen"><span class="tile-emoji" aria-hidden="true">'+p.emoji+'</span><span class="tile-label">ILLUSTRATION</span></a><div class="shop-tile-content"><span>'+esc(p.brand)+' · '+esc(p.origin)+'</span><a class="shop-tile-name" href="'+productUrl(p.id)+'">'+esc(p.name)+'</a><small>'+esc(p.size)+' · '+esc(p.unitPrice)+'</small><div class="shop-tile-bottom"><strong>'+eur(p.price)+'</strong><button class="tile-add" data-add="'+p.id+'"'+(p.demoStock===0?' disabled':'')+' aria-label="'+esc(p.name)+' in den Warenkorb">'+(p.demoStock===0?'Nicht verfügbar':'+ Hinzufügen')+'</button></div></div></article>';
}
function productView(p){
 const d=p.nutrition;
 const similar=api.complementaryProducts(p);
 const table=(label,v)=>'<tr><th scope="row">'+label+'</th><td>'+v+'</td></tr>';
 const note="Alle Produkt- und Nährwertangaben sind Demo-Muster. Vor dem Liveverkauf müssen die Originaletiketten verifiziert werden.";
 return '<div class="layout route-inner">'+breadcrumbs([{name:p.category,url:catUrl(p.category)},{name:p.name}])+
 '<div class="pdp-grid"><div class="pdp-visual-block">'+detailPack(p)+'<div class="pdp-visual-legend"><span>Eigene Verpackungsillustration</span><span>Originalfoto folgt nach Händlerfreigabe</span></div></div>'+
 '<div class="pdp-data">'+demoNote+'<div class="pdp-brand">'+esc(p.brand)+' · '+esc(p.origin)+'</div><h1>'+esc(p.name)+'</h1><p class="pdp-description">'+esc(p.description)+'</p>'+
 '<div class="pdp-tags"><span>'+esc(p.size)+'</span><span>Artikel-Nr. DEMO-'+esc(p.id.toUpperCase())+'</span><span>'+esc(p.category)+'</span></div>'+
 '<div class="pdp-shipping-tag'+(p.category==="Tiefkühl & Fertiggerichte"?" cold":"")+'">'+(p.category==="Tiefkühl & Fertiggerichte"?"❄️ ":"📦 ")+esc(window.ASIA_SHOP_FEATURES.storageOf(p))+'</div>'+
 '<div class="pdp-buy"><span class="pdp-price">'+eur(p.price)+'</span><span class="pdp-unit">'+esc(p.unitPrice)+' · Beispielpreis inkl. MwSt.</span>'+
 '<p class="pdp-stock"><i class="'+(p.demoStock===0?'out':'')+'"></i>'+(p.demoStock===0?'Demo-Bestand: nicht verfügbar':'Demo-Bestand: '+p.demoStock+' Stück')+'</p>'+
 '<div class="pdp-buyrow"><label>Menge <input type="number" id="pdp-qty" min="1" max="'+Math.max(p.demoStock,1)+'" value="1" inputmode="numeric"></label><button type="button" class="market-button" id="pdp-add" data-pdp-add="'+p.id+'" '+(p.demoStock===0?'disabled':'')+'>In den Warenkorb <span>↗</span></button></div>'+
 '<button class="copy-link" id="copy-link"><span>↗</span> Produktlink kopieren</button></div>'+
 '<div class="pdp-advantages"><span>✓ Gastbestellung als Demo</span><span>✓ Transparentes Versandbeispiel</span><span>✓ Rückfragen vor Kauf klären</span></div>'+
 '<div class="pdp-notice"><strong>Hinweis zur Vorschau:</strong> '+note+'</div></div></div>'+
 '<div class="pdp-information"><div class="pdp-info-left"><div class="retail-label">PRODUKTINFORMATIONEN</div><h2>Alles Wichtige zum Artikel</h2>'+
 '<section><h3>Beschreibung</h3><p>'+esc(p.description)+'</p></section>'+
 '<section><h3>Zutaten (Musterdaten)</h3><p>'+esc(p.ingredients)+'</p></section>'+
 '<section><h3>Allergene (Musterdaten)</h3><p>'+esc(p.allergens)+'</p></section>'+
 '<section><h3>Herkunft & Artikel</h3><p>Herkunft (Demo): '+esc(p.origin)+' · Marke (Demo): '+esc(p.brand)+' · Nettofüllmenge: '+esc(p.size)+'</p></section></div>'+
 '<div class="pdp-info-right"><h3>Nährwerte pro 100 g / 100 ml (Beispiel)</h3><table class="pdp-nutrition">'+
 table("Energie",d.kj+" kJ / "+d.kcal+" kcal")+table("Fett",d.fat+" g")+table("davon gesättigte Fettsäuren",(Math.round(d.fat*.32*10)/10)+" g")+
 table("Kohlenhydrate",d.carbs+" g")+table("davon Zucker",d.sugars+" g")+table("Eiweiß",d.protein+" g")+table("Salz",d.salt+" g")+
 '</table><p class="pdp-smallnote">'+note+'</p><a class="service-link-card" href="'+pageUrl("versand")+'"><span>🚚</span><span><strong>Versand & Lieferung</strong><small>Beispieloptionen und Antworten ansehen</small></span><b>↗</b></a></div></div>'+
 '<div class="route-heading"><div><span class="retail-label">PASST GUT DAZU</span><h2>Das ergänzt deinen Einkauf</h2><p>Bewusst ausgewählte, zum Artikel passende Zutaten oder Snacks. Alles freiwillig und einzeln bepreist.</p></div><a href="'+catUrl(p.category)+'">Alle '+esc(p.category)+' ↗</a></div><div class="shop-tile-grid">'+similar.map(productTile).join("")+'</div></div>';
}
let listing={category:catParam||"Alle",country:countryParam||"Alle",text:queryParam||"",subtype:q.get("typ")||"Alle",brands:new Set(),priceCap:"Alle",sort:"recommended",visible:24};
function setRouteContent(html,title){homepage.hidden=true;routeRoot.hidden=false;routeRoot.innerHTML=html;document.title=title+" | ASIA MART Demo";window.scrollTo(0,0);}
function listingBase(){
 const uniqueBrands=[...new Set(items.map(p=>p.brand))].sort((a,b)=>a.localeCompare(b,"de"));
 const uniqueCountries=[...new Set(items.map(p=>p.origin))].sort((a,b)=>a.localeCompare(b,"de"));
 const categoryName=listing.category!=="Alle"?listing.category:listing.country!=="Alle"?"Produkte aus "+listing.country:listing.text?"Suche: "+listing.text:"Alle Produkte";
 const chips='<div class="listing-tags">'+
 (listing.category!=="Alle"?'<button data-filter-clear="category">'+esc(listing.category)+' ×</button>':'')+
 (listing.country!=="Alle"?'<button data-filter-clear="country">'+esc(listing.country)+' ×</button>':'')+
 (listing.text?'<button data-filter-clear="text">Suche: '+esc(listing.text)+' ×</button>':'')+
 '<span id="listing-active-tags"></span></div>';
 const check=(type,name)=>'<label class="listing-check"><input type="checkbox" data-facet="'+type+'" value="'+esc(name)+'" '+(type==="brand"&&listing.brands.has(name)?'checked':'')+'><span>'+esc(name)+'</span></label>';
 const brands=uniqueBrands.map(x=>check("brand",x)).join("");
 const countries=uniqueCountries.map(x=>'<option value="'+esc(x)+'"'+(listing.country===x?' selected':'')+'>'+esc(x)+'</option>').join("");
 const subgroups=listing.category==="Alle"?[]:window.ASIA_SHOP_FEATURES.groupsFor(listing.category);
 const suboptions='<option value="Alle">Alle Unterkategorien</option>'+subgroups.map(g=>'<option value="'+esc(g.name)+'"'+(listing.subtype===g.name?' selected':'')+'>'+esc(g.name)+' ('+g.count+')</option>').join("");
 const subtypePills=listing.category==="Alle"?"":'<div class="listing-subtype-pills"><a class="'+(listing.subtype==="Alle"?"selected":"")+'" href="?kategorie='+encodeURIComponent(listing.category)+'">Alles</a>'+subgroups.map(g=>'<a class="'+(listing.subtype===g.name?"selected":"")+'" href="?kategorie='+encodeURIComponent(listing.category)+'&typ='+encodeURIComponent(g.name)+'">'+esc(g.name)+' · '+g.count+'</a>').join("")+'</div>';
 return '<div class="layout route-inner">'+breadcrumbs([{name:"Sortiment"}])+
 '<div class="listing-header">'+demoNote+'<h1>'+esc(categoryName)+'</h1><p>150 Produkte im Demo-Katalog. Wähle Marken, Herkunft und Preise – alle Angaben sind Muster.</p></div>'+
 '<div class="listing-toolbar"><button id="open-mobile-filters" class="filter-toggle">☷ Filter & Sortierung</button><div id="listing-result-info" aria-live="polite"></div><label>Sortieren <select id="listing-sort"><option value="recommended">Unsere Auswahl</option><option value="price-low">Preis aufsteigend</option><option value="price-high">Preis absteigend</option><option value="name">Name A–Z</option></select></label></div>'+
 chips+subtypePills+'<div class="listing-layout"><aside id="listing-filters" class="listing-filters" aria-label="Produktfilter"><div class="listing-filter-heading"><strong>Produkte filtern</strong><button id="close-mobile-filters" aria-label="Filter schließen">×</button></div>'+
 '<fieldset><legend>Warengruppe</legend><select id="listing-category"><option value="Alle">Alle Kategorien</option>'+[...new Set(items.map(p=>p.category))].map(x=>'<option value="'+esc(x)+'"'+(listing.category===x?' selected':'')+'>'+esc(x)+'</option>').join("")+'</select></fieldset>'+
 '<fieldset><legend>Unterkategorie</legend><select id="listing-subtype" '+(listing.category==="Alle"?"disabled":"")+'>'+suboptions+'</select></fieldset>'+
 '<fieldset><legend>Marken</legend>'+brands+'</fieldset>'+
 '<fieldset><legend>Herkunft</legend><select id="listing-country"><option value="Alle">Alle Länder</option>'+countries+'</select></fieldset>'+
 '<fieldset><legend>Preisbereich</legend><select id="listing-max"><option value="Alle">Jeder Preis</option><option value="3">Bis 3 €</option><option value="5">Bis 5 €</option><option value="10">Bis 10 €</option><option value="20">Bis 20 €</option></select></fieldset>'+
 '<button id="listing-reset" class="filter-reset">Filter zurücksetzen</button><button id="listing-apply" class="market-button">Produkte anzeigen ↗</button></aside>'+
 '<div><div id="listing-grid" class="shop-tile-grid listing-products"></div><div class="listing-more"><button id="listing-more" class="btn btn-outline-dark">Mehr Produkte laden ↓</button></div></div></div></div>';
}
function filteredList(){
 let all=items.filter(p=>(listing.category==="Alle"||p.category===listing.category)&&(listing.country==="Alle"||p.origin===listing.country)&&(!listing.brands.size||listing.brands.has(p.brand)));
 if(listing.subtype!=="Alle")all=all.filter(p=>window.ASIA_SHOP_FEATURES.subtypeOf(p)===listing.subtype);
 if(listing.text.trim()){
  const found=new Set(api.searchResults(listing.text).map(p=>p.id));
  all=all.filter(p=>found.has(p.id));
 }
 if(listing.priceCap!=="Alle")all=all.filter(p=>p.price<=Number(listing.priceCap));
 if(listing.sort==="price-low")all.sort((a,b)=>a.price-b.price);
 else if(listing.sort==="price-high")all.sort((a,b)=>b.price-a.price);
 else if(listing.sort==="name")all.sort((a,b)=>a.name.localeCompare(b.name,"de"));
 return all;
}
function renderListing(){
 const all=filteredList();
 $("#listing-grid").innerHTML=all.length?all.slice(0,listing.visible).map(productTile).join(""):'<div class="listing-nohits"><h2>Keine passenden Artikel</h2><p>Entferne einen Filter oder starte eine neue Suche.</p><button id="listing-nohits-reset" class="market-button">Filter zurücksetzen</button></div>';
 $("#listing-result-info").textContent=all.length+" Produkte gefunden · "+Math.min(all.length,listing.visible)+" angezeigt";
 $("#listing-more").hidden=listing.visible>=all.length;
 const active=[...listing.brands].map(x=>'<button data-remove-brand="'+esc(x)+'">'+esc(x)+' ×</button>').join("");
 $("#listing-active-tags").innerHTML=active+(listing.priceCap!=="Alle"?'<button data-clear-price>Bis '+esc(listing.priceCap)+' € ×</button>':'');
}
function openListing(){
 setRouteContent(listingBase(),"Sortiment");
 $("#listing-sort").value=listing.sort;
 renderListing();
}
function saveAdmin(){try{localStorage.setItem(stockKey,JSON.stringify(adminData))}catch{}}
let adminTab="dashboard",adminQuery="",adminShown=15;
const salesSamples=[25,40,35,58,48,73,60];
function dashboard(){
 const totalStock=items.reduce((n,p)=>n+p.demoStock,0);
 return '<div class="demo-dashboard-head"><strong>DEMO-DATENSATZ · KEINE ECHTEN VERKÄUFE</strong><p>Diese Oberfläche demonstriert, wie der spätere Händler Produkte, Bestände und Bestellstatus verwalten könnte. Keine echte Anbindung, keine Kundendaten.</p></div>'+
 '<div class="merchant-metrics"><div><span>Demo-Artikel</span><strong>'+items.length+'</strong><small>Vorhandene Beispielprodukte</small></div><div><span>Demo-Lagerbestand</span><strong>'+totalStock.toLocaleString("de-DE")+'</strong><small>Fiktive Stückzahlen</small></div><div><span>Musterbestellungen</span><strong>5</strong><small>Erfundene Beispielaufträge</small></div><div><span>Echter Online-Umsatz</span><strong>0,00 €</strong><small>Kein Verkauf angebunden</small></div></div>'+
 '<div class="merchant-panel"><h2>So sähe ein Händler-Dashboard aus</h2><p>Der Balkenverlauf zeigt ausschließlich erfundene Beispieldaten, keine gemessenen Umsätze.</p><div class="merchant-bars">'+salesSamples.map((n,i)=>'<div><span style="height:'+n*1.5+'px"></span><small>'+["Mo","Di","Mi","Do","Fr","Sa","So"][i]+'</small></div>').join("")+'</div></div>'+
 '<div class="merchant-guidance"><h3>Was die fertige Lösung später benötigt</h3><p>Produktimport · Rechteverwaltung · echte Lager- und Bestell-Synchronisation · Rechnungen · Versandlabel · Payment-Anbindung · Händler-spezifisches Reporting.</p><button data-admin-tab="products" class="market-button">Demo-Katalog bearbeiten ↗</button></div>';
}
function adminProducts(){
 const matches=items.filter(p=>normalize(p.name+" "+p.brand+" "+p.id+" "+p.category).includes(normalize(adminQuery)));
 return '<div class="merchant-actions"><label>Demo-Artikel suchen<input id="admin-product-search" type="search" value="'+esc(adminQuery)+'" placeholder="z.B. Ramen, Reis, n001"></label><button id="admin-export">CSV-Beispieldaten exportieren ↓</button><button id="admin-reset">Demo-Daten zurücksetzen ↺</button></div>'+
 '<p class="merchant-filtercount">'+matches.length+' Artikel · Eingaben verändern ausschließlich die lokalen Demo-Werte in diesem Browser.</p>'+
 '<div class="merchant-table-scroll"><table class="merchant-table"><thead><tr><th>Artikel</th><th>Demo-Preis</th><th>Demo-Bestand</th><th>Aktion</th></tr></thead><tbody>'+
 matches.slice(0,adminShown).map(p=>'<tr data-admin-row="'+p.id+'"><td><a href="'+productUrl(p.id)+'"><strong>'+esc(p.name)+'</strong><small>'+esc(p.brand)+' · '+esc(p.id.toUpperCase())+'</small></a></td>'+
 '<td><label class="sr-only" for="price-'+p.id+'">Preis '+esc(p.name)+'</label><input id="price-'+p.id+'" data-edit-price="'+p.id+'" type="number" inputmode="decimal" step=".01" min=".01" max="9999" value="'+p.price.toFixed(2)+'"></td>'+
 '<td><label class="sr-only" for="stock-'+p.id+'">Bestand '+esc(p.name)+'</label><input id="stock-'+p.id+'" data-edit-stock="'+p.id+'" type="number" inputmode="numeric" step="1" min="0" max="99999" value="'+p.demoStock+'"></td>'+
 '<td><button data-save-product="'+p.id+'" class="save-product">Speichern</button></td></tr>').join("")+
 '</tbody></table></div>'+(adminShown<matches.length?'<button id="admin-more" class="btn btn-outline-dark">Weitere Demo-Artikel anzeigen ↓</button>':'');
}
function adminOrders(){
 return '<div class="demo-dashboard-head"><strong>FÜNF FREI ERFUNDENE MUSTERAUFTRÄGE</strong><p>Hier werden keine echten Personen, Aufträge oder Lieferdaten erfasst. Statusänderungen sind nur lokale Demo-Interaktionen.</p></div>'+
 '<div class="merchant-table-scroll"><table class="merchant-table"><thead><tr><th>Beispielauftrag</th><th>Artikel</th><th>Wert</th><th>Versand</th><th>Demostatus</th></tr></thead><tbody>'+
 sampleOrders.map(o=>'<tr><td><strong>'+o.id+'</strong><small>'+o.date+' · '+o.label+'</small></td><td>'+o.units+'</td><td>'+eur(o.total)+'</td><td>'+o.method+'</td><td><select data-order-status="'+o.id+'">'+["Neu","In Bearbeitung","Versendet","Abgeschlossen"].map(s=>'<option value="'+s+'"'+((adminData.orderStatus[o.id]||o.status)===s?' selected':'')+'>'+s+'</option>').join("")+'</select></td></tr>').join("")+
 '</tbody></table></div>';
}
function renderAdmin(){
 const root=$("#merchant-content");root.innerHTML=adminTab==="dashboard"?dashboard():adminTab==="products"?adminProducts():adminOrders();
 document.querySelectorAll("[data-admin-tab]").forEach(x=>{x.classList.toggle("active",x.dataset.adminTab===adminTab);x.setAttribute("aria-pressed",String(x.dataset.adminTab===adminTab))});
}
function merchantView(){
 setRouteContent('<div class="layout route-inner">'+breadcrumbs([{name:"Händler-Demo"}])+
 '<div class="merchant-hero">'+demoNote+'<h1>So einfach kann die Verwaltung sein.</h1><p>Eigene Shop-Administration als klickbare Konzeptvorschau. Diese öffentliche Demo hat bewusst kein Login, keine echten Aufträge und keine Backend-Anbindung.</p>'+
 '<div class="merchant-tabs"><button data-admin-tab="dashboard">Übersicht</button><button data-admin-tab="products">Produkte bearbeiten</button><button data-admin-tab="orders">Beispielaufträge</button></div></div><div id="merchant-content"></div></div>',"Händler-Demo");
 renderAdmin();
}
const faqSections=[
 {q:"Wie kann ich Produkte suchen und bestellen?",a:"Die Suche schlägt konkrete Artikel vor. Über Produktseiten kannst du Menge und Artikel in den Demo-Warenkorb legen. Eine echte Bestellung wird nicht ausgelöst."},
 {q:"Welche Versandarten kann ich auswählen?",a:"Standardversand, Express und Marktabholung sind als Beispiel sichtbar. Preise und tatsächliche Liefergebiete werden erst mit dem späteren Händler festgelegt."},
 {q:"Was kostet der Versand?",a:"Die Vorschau zeigt 4,90 € Standard, 9,90 € Express und Beispiel-Gratisversand ab 49 €. Diese Konditionen sind noch keine verbindlichen Händlerangebote."},
 {q:"Kann ich mit PayPal oder Kreditkarte zahlen?",a:"Die Auswahl wird im Demo-Checkout dargestellt; es ist kein Zahlungsdienstleister verbunden und es findet keine Abbuchung statt."},
 {q:"Was ist mit Tiefkühlprodukten?",a:"Ein echter Onlineshop muss passende Liefergebiete, Versandpartner und die Kühlkette nachweisbar sicherstellen. Dies ist noch nicht eingebaut."},
 {q:"Wo finde ich Zutaten und Allergene?",a:"Auf jeder Produktseite sind diese Angaben als Muster vorhanden. Für den späteren Verkauf werden geprüfte Originaldaten von den Verpackungen benötigt."},
 {q:"Kann ich Artikel zurückgeben?",a:"Retouren- und Widerrufsregeln hängen unter anderem von der Ware und den gesetzlichen Vorgaben ab. Nach der Händlerbeauftragung werden dafür geprüfte Prozesse und verbindliche Informationen eingerichtet."},
 {q:"Wie kontaktiere ich den Händler?",a:"Das ist eine fiktive Shop-Demo. Echte Kontaktinformationen und Filialdaten werden erst nach Zustimmung des Auftraggebers hinterlegt."}
];
function faqView(){
 setRouteContent('<div class="layout route-inner">'+breadcrumbs([{name:"Hilfe & FAQ"}])+'<div class="help-intro">'+demoNote+'<h1>Wobei können wir helfen?</h1><p>Alle wichtigen Fragen zur Bestellung, Lieferung und Nutzung der aktuellen Vorschau – ohne erfundene Serviceversprechen.</p></div>'+
 '<div class="help-top-links"><a href="'+pageUrl("versand")+'">🚚 <strong>Versand & Abholung</strong><span>Alle Beispieloptionen ↗</span></a><a href="'+pageUrl("kontakt")+'">✉️ <strong>Kontakt & Filialen</strong><span>So wird der Service später eingebunden ↗</span></a><a href="'+pageUrl("verwaltung")+'">▤ <strong>Händler-Demo</strong><span>Backend-Ansicht testen ↗</span></a></div>'+
 '<div class="faq-columns"><div><span class="retail-label">HÄUFIGE FRAGEN</span><h2>Kurz erklärt.</h2><p>Die Details werden beim echten Händlerangebot individuell bestimmt.</p></div><div class="faq-questions">'+faqSections.map((f,i)=>'<details'+(i===0?' open':'')+'><summary>'+esc(f.q)+'</summary><p>'+esc(f.a)+'</p></details>').join("")+'</div></div></div>',"Hilfe & FAQ");
}
function shippingView(){
 setRouteContent('<div class="layout route-inner">'+breadcrumbs([{name:"Versand & Abholung"}])+'<div class="help-intro">'+demoNote+'<h1>Versand & Lieferung</h1><p>Hier wird später transparent über Liefergebiet, Kosten, Versanddauer und Abholung informiert. Die aktuellen Werte dienen ausschließlich dem Vorführen.</p></div>'+
 '<div class="shipping-example-grid"><article><span>🚚</span><h2>Standardversand</h2><strong>4,90 €</strong><p>Demo-Preis. Ab 49 € Beispiel-Warenwert kostenfrei.</p></article><article><span>⚡</span><h2>Express</h2><strong>9,90 €</strong><p>Demo-Preis. Noch keine Laufzeit oder Spedition vereinbart.</p></article><article><span>🏬</span><h2>Marktabholung</h2><strong>0,00 €</strong><p>Beispieloption. Abholort und Termine sind noch nicht hinterlegt.</p></article></div>'+
 '<div class="shipping-advice"><h2>So wird daraus ein echter Versandprozess</h2><p>Für die spätere Abnahme werden Versanddienstleister, Versandetiketten, Nachverfolgung, Lieferregionen, Versandkosten je Warenkorb, sichere Verpackung sowie Kühl-/Tiefkühltransport mit dem Händler abgestimmt und getestet.</p><a class="market-button" href="'+pageUrl("hilfe")+'">Häufige Fragen ansehen ↗</a></div></div>',"Versand & Abholung");
}
function contactView(){
 setRouteContent('<div class="layout route-inner">'+breadcrumbs([{name:"Kontakt"}])+'<div class="help-intro">'+demoNote+'<h1>Kontakt & Filialen</h1><p>Ein guter Asia-Supermarkt muss online genauso erreichbar sein wie vor Ort. Die Kontaktdaten dürfen erst mit dem tatsächlichen Auftraggeber eingetragen werden.</p></div>'+
 '<div class="contact-placeholder"><div><span>☎</span><h2>Kundenservice</h2><p>E-Mail, Telefonnummer und Servicezeiten: nach Händlerfreigabe.</p></div><div><span>⌂</span><h2>Filialen & Abholung</h2><p>Standorte, Öffnungszeiten, Karte und Abholfenster: nach Händlerfreigabe.</p></div><div><span>↶</span><h2>Reklamationen & Rückgaben</h2><p>Individueller Serviceprozess mit nachvollziehbaren Bestellnummern und rechtlich korrekten Informationen.</p></div></div></div>',"Kontakt & Filialen");
}
function aboutView(){
 setRouteContent('<div class="layout route-inner">'+breadcrumbs([{name:"Über das Konzept"}])+'<div class="help-intro">'+demoNote+'<h1>Ein Asia-Supermarkt. Alle Möglichkeiten online.</h1><p>ASIA MART ist eine eigenständige Konzeptmarke für die Kundenvorstellung – ohne Verbindung zu bestehenden Einzelhandelsunternehmen.</p></div>'+
 '<div class="about-split"><div><h2>Für Kundinnen und Kunden</h2><p>Artikel finden, Produkte vergleichen, Informationen vor dem Kauf lesen und mit wenigen Schritten einen Warenkorb zusammenstellen. Alles auch auf dem Smartphone.</p></div><div><h2>Für den Händler</h2><p>Bestände, Preise und Angebote künftig eigenständig pflegen. Bestellungen strukturiert abwickeln, Kundenservice verbessern und Sortimentserweiterungen schneller online veröffentlichen.</p><a href="'+pageUrl("verwaltung")+'" class="market-button">Händleransicht demonstrieren ↗</a></div></div></div>',"Über ASIA MART");
}
function storeCSV(){
 const cols=["Artikelnr.","Produktname","Marke","Herkunft","Warengruppe","Preis_EUR","Demo_Bestand"];
 const rows=items.map(p=>[p.id,p.name,p.brand,p.origin,p.category,p.price.toFixed(2),String(p.demoStock)]);
 const csv=[cols,...rows].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\r\n");
 const blob=new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");
 a.href=url;a.download="ASIA_MART_Beispielkatalog.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function adminSave(id){
 const p=items.find(x=>x.id===id);
 const row=document.querySelector('[data-admin-row="'+id+'"]');
 if(!p||!row)return;
 const price=Number(row.querySelector("[data-edit-price]").value);
 const stock=Number(row.querySelector("[data-edit-stock]").value);
 if(!Number.isFinite(price)||price<.01||price>9999||!Number.isInteger(stock)||stock<0||stock>99999){
  alert("Bitte einen gültigen Demo-Preis (0,01–9.999 €) und eine ganzzahlige Bestandsmenge eingeben.");return;
 }
 p.price=Math.round(price*100)/100;p.demoStock=stock;updateUnit(p);
 adminData.products[id]={price:p.price,stock};
 saveAdmin();api.refresh?.();renderAdmin();
 const note=$("#merchant-message");if(note)note.textContent=p.name+" – Demo-Werte lokal gespeichert. Die Produktseite zeigt diese Werte ebenfalls.";
}
document.addEventListener("click",e=>{
 const mobileCart=e.target.closest("#mobile-cart-button");if(mobileCart){e.preventDefault();e.stopImmediatePropagation();$("#cart-button")?.click();return}
 const nav=e.target.closest("[data-navcat]");if(nav){e.preventDefault();e.stopImmediatePropagation();location.href=nav.dataset.navcat==="Alle"?pageUrl("sortiment"):catUrl(nav.dataset.navcat);return}
 const land=e.target.closest("[data-orig]");if(land){e.preventDefault();e.stopImmediatePropagation();location.href="?land="+encodeURIComponent(land.dataset.orig);return}
 const suggestAll=e.target.closest("[data-search-all]");if(suggestAll){e.preventDefault();e.stopImmediatePropagation();const v=$("#global-search")?.value.trim();if(v)location.href="?suche="+encodeURIComponent(v);return}
 const suggestion=e.target.closest("[data-search-product]");if(suggestion){e.preventDefault();e.stopImmediatePropagation();location.href=productUrl(suggestion.dataset.searchProduct);return}
 if(!inRoute)return;
 const fragment=e.target.closest("a[href^='#']");if(fragment){e.preventDefault();e.stopImmediatePropagation();location.href="./"+fragment.getAttribute("href");return}
 const add=e.target.closest("[data-pdp-add]");if(add){e.preventDefault();const qty=Math.max(1,Math.min(99,Math.round(Number($("#pdp-qty")?.value||1))));api.addToCart(add.dataset.pdpAdd,qty);return}
 if(e.target.closest("#copy-link")){e.preventDefault();navigator.clipboard?.writeText(location.href).then(()=>{e.target.textContent="✓ Link kopiert"}).catch(()=>{e.target.textContent=location.href});return}
 const tab=e.target.closest("[data-admin-tab]");if(tab){adminTab=tab.dataset.adminTab;adminShown=15;renderAdmin();return}
 const save=e.target.closest("[data-save-product]");if(save){adminSave(save.dataset.saveProduct);return}
 const more=e.target.closest("#admin-more");if(more){adminShown+=20;renderAdmin();return}
 if(e.target.closest("#admin-export")){storeCSV();return}
 if(e.target.closest("#admin-reset")){if(confirm("Nur die lokal gespeicherten Demo-Änderungen zurücksetzen?")){adminData={products:{},orderStatus:{}};saveAdmin();location.reload()}return}
 const lm=e.target.closest("#listing-more");if(lm){listing.visible+=24;renderListing();return}
 const reset=e.target.closest("#listing-reset")||e.target.closest("#listing-nohits-reset");
 if(reset){listing={category:"Alle",country:"Alle",text:"",subtype:"Alle",brands:new Set(),priceCap:"Alle",sort:"recommended",visible:24};openListing();return}
 const remove=e.target.closest("[data-remove-brand]");if(remove){listing.brands.delete(remove.dataset.removeBrand);renderListing();$("#listing-filters").querySelectorAll('[data-facet=brand]').forEach(i=>{i.checked=listing.brands.has(i.value)});return}
 const clear=e.target.closest("[data-filter-clear]");if(clear){listing[clear.dataset.filterClear==="text"?"text":clear.dataset.filterClear]="Alle";if(clear.dataset.filterClear==="text")listing.text="";openListing();return}
 if(e.target.closest("[data-clear-price]")){listing.priceCap="Alle";$("#listing-max").value="Alle";renderListing();return}
 if(e.target.closest("#open-mobile-filters")){$("#listing-filters").classList.add("open");return}
 if(e.target.closest("#close-mobile-filters")||e.target.closest("#listing-apply")){$("#listing-filters").classList.remove("open");return}
},true);
document.addEventListener("change",e=>{
 const element=e.target;
 if(element.matches('[data-facet="brand"]')){if(element.checked)listing.brands.add(element.value);else listing.brands.delete(element.value);listing.visible=24;renderListing()}
 if(element.id==="listing-category"){listing.category=element.value;listing.subtype="Alle";listing.visible=24;openListing()}
 if(element.id==="listing-subtype"){listing.subtype=element.value;listing.visible=24;renderListing()}
 if(element.id==="listing-country"){listing.country=element.value;listing.visible=24;renderListing()}
 if(element.id==="listing-max"){listing.priceCap=element.value;listing.visible=24;renderListing()}
 if(element.id==="listing-sort"){listing.sort=element.value;listing.visible=24;renderListing()}
 if(element.matches("[data-order-status]")){adminData.orderStatus[element.dataset.orderStatus]=element.value;saveAdmin()}
},true);
document.addEventListener("input",e=>{
 if(e.target.id==="admin-product-search"){adminQuery=e.target.value;adminShown=15;const pos=e.target.selectionStart;renderAdmin();const next=$("#admin-product-search");next?.focus();next?.setSelectionRange(pos,pos)}
},true);
if(inRoute){
 const skip=$(".skip-to-content");if(skip)skip.setAttribute("href","#route-root");
 const p=items.find(x=>x.id===slugProduct);
 if(slugProduct){if(p)setRouteContent(productView(p),p.name);else setRouteContent('<div class="layout route-inner missing-page"><h1>Produkt nicht gefunden</h1><a href="'+pageUrl("sortiment")+'">Zurück zum Sortiment ↗</a></div>',"Produkt nicht gefunden")}
 else if(catParam||countryParam||queryParam||pageParam==="sortiment")openListing();
 else if(pageParam==="verwaltung")merchantView();
 else if(pageParam==="hilfe")faqView();
 else if(pageParam==="versand")shippingView();
 else if(pageParam==="kontakt")contactView();
 else if(pageParam==="ueber-uns")aboutView();
 else setRouteContent('<div class="layout route-inner missing-page"><h1>Seite nicht gefunden</h1><a href="./">Zur Startseite ↗</a></div>',"Nicht gefunden");
}
window.ASIAMART_SHOWCASE={activeRoute:inRoute,source:"demo",productCount:items.length,adminData,listingCount:()=>filteredList().length};
})();