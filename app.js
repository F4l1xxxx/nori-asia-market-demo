/* NORI & CO. — standalone interactive demonstration. No customer transactions. */
(function(){
"use strict";
const categories=[
 {name:"Reis & Nudeln",symbol:"🍜",short:"Die Basis für jedes Gericht",tone:"#f4e7ca",items:
"Jasminreis Premium|1 kg|Thailand|5.49|🍚;Duftreis Extra Langkorn|500 g|Thailand|3.69|🍚;Sushireis Rundkorn|1 kg|Japan|6.49|🍙;Klebreis für Mango Sticky Rice|1 kg|Thailand|6.29|🍚;Roter Naturreis|500 g|Thailand|4.49|🍚;Schwarzer Reis Royal|500 g|China|5.99|🍚;Reisnudeln 3 mm|400 g|Vietnam|3.29|🍜;Reisnudeln 5 mm|400 g|Vietnam|3.49|🍜;Glasnudeln Mungbohne|250 g|China|2.79|🍜;Udon Nudeln Sanuki|200 g|Japan|2.49|🍜;Soba Buchweizennudeln|300 g|Japan|3.99|🍜;Ramen Weizennudeln|300 g|Japan|3.79|🍜;Eiernudeln Wok Style|250 g|China|2.99|🍜;Vermicelli Reisfäden|400 g|Vietnam|3.19|🍜;Pho Reisbandnudeln|400 g|Vietnam|3.49|🍲;Pad Thai Reisbandnudeln|400 g|Thailand|3.39|🍜;Bún Reisnudeln|400 g|Vietnam|3.19|🍜;Mi Goreng Nudeln|250 g|Indonesien|2.89|🍜;Dünne Weizennudeln|400 g|China|2.69|🍜;Süßkartoffel Glasnudeln|300 g|Südkorea|4.29|🍜;Instant Ramen Shoyu|120 g|Japan|2.49|🍜;Instant Ramen Kimchi|120 g|Südkorea|2.59|🍜;Instant Ramen Miso|120 g|Japan|2.69|🍜;Instant Ramen Curry|120 g|Thailand|2.39|🍜;Wok Noodles Original|500 g|China|4.39|🍜"},
 {name:"Saucen & Gewürze",symbol:"🌶️",short:"Aromen, die alles verändern",tone:"#edd6bc",items:
"Sojasauce Mild|250 ml|Japan|3.99|🥢;Sojasauce Dunkel|250 ml|China|3.79|🥢;Tamari Sauce|250 ml|Japan|5.49|🥢;Chili Sauce Sweet|250 ml|Thailand|3.49|🌶️;Sriracha Chili Sauce|250 ml|Thailand|4.29|🌶️;Gochujang Chilipaste|200 g|Südkorea|4.99|🌶️;Sambal Oelek|200 g|Indonesien|2.99|🌶️;Teriyaki Sauce|250 ml|Japan|4.59|🍶;Hoisin Sauce|250 ml|China|3.69|🍶;Austernsauce|250 ml|Thailand|4.39|🦪;Fischsauce|250 ml|Vietnam|3.89|🐟;Sesamöl Geröstet|150 ml|Südkorea|5.99|🫙;Reisessig Mild|300 ml|Japan|3.49|🫙;Mirin Würzsauce|250 ml|Japan|4.99|🍶;Miso Paste Weiß|250 g|Japan|5.79|🫙;Miso Paste Rot|250 g|Japan|5.89|🫙;Rote Currypaste|200 g|Thailand|3.99|🌶️;Grüne Currypaste|200 g|Thailand|3.99|🌶️;Gelbe Currypaste|200 g|Thailand|3.99|🌶️;Panang Currypaste|200 g|Thailand|4.19|🌶️;Fünf Gewürze Mischung|80 g|China|3.39|✨;Furikake Sesam Algen|100 g|Japan|4.49|🌿;Chili Crisp Knusperöl|180 g|China|5.99|🌶️;Ingwer Knoblauch Paste|200 g|Indien|3.69|🫚;Yuzu Pfeffer Paste|100 g|Japan|6.49|🍋"},
 {name:"Snacks & Süßes",symbol:"🍡",short:"Kleine Freuden für zwischendurch",tone:"#f6d8d2",items:
"Mochi Mango|180 g|Taiwan|4.49|🥭;Mochi Matcha|180 g|Japan|4.69|🍵;Mochi Erdbeere|180 g|Taiwan|4.49|🍓;Mochi Kokos|180 g|Thailand|4.39|🥥;Reiscracker Wasabi|100 g|Japan|3.19|🍘;Reiscracker Sesam|100 g|Japan|3.19|🍘;Shrimp Chips|80 g|Thailand|2.79|🍤;Seetang Snack Geröstet|50 g|Südkorea|3.99|🌿;Seetang Snack Chili|50 g|Südkorea|4.09|🌶️;Pocky Matcha Sticks|70 g|Japan|3.29|🍫;Pocky Erdbeere Sticks|70 g|Japan|3.29|🍓;Schoko Sticks Dunkel|70 g|Japan|3.19|🍫;Mango Trockenfrüchte|120 g|Philippinen|4.69|🥭;Kokos Chips Geröstet|100 g|Thailand|3.49|🥥;Jackfruit Chips|100 g|Vietnam|4.59|🍈;Bananen Chips Süß|150 g|Philippinen|3.79|🍌;Tapioka Chips Chili|100 g|Indonesien|2.99|🌶️;Sesambällchen Knusprig|120 g|China|3.39|🍡;Erdnuss Cracker Pikant|150 g|Indonesien|3.19|🥜;Matcha Kekse|120 g|Japan|4.39|🍵;Ube Waffelröllchen|120 g|Philippinen|4.49|🍠;Milchbonbons Melone|100 g|Japan|2.99|🍈;Fruchtgummi Litschi|120 g|Taiwan|3.39|🍬;Kokos Jelly Cups|180 g|Thailand|3.69|🥥;Reisgebäck Honig|100 g|Südkorea|3.59|🍯"},
 {name:"Tiefkühl & Fertiggerichte",symbol:"🥟",short:"Schnell köstlich auf dem Tisch",tone:"#e2eae7",items:
"Gyoza Gemüse|400 g|Japan|6.49|🥟;Gyoza Huhn|400 g|Japan|6.99|🥟;Gyoza Garnelen|400 g|Japan|7.49|🥟;Bao Buns Original|300 g|China|5.79|🥟;Bao Buns Pilze|300 g|China|5.99|🥟;Dim Sum Gemüse|300 g|China|6.29|🥟;Dim Sum Garnelen|300 g|China|7.29|🍤;Frühlingsrollen Gemüse|400 g|Vietnam|5.49|🥢;Frühlingsrollen Huhn|400 g|Vietnam|5.89|🥢;Edamame mit Schale|400 g|China|3.89|🫛;Edamame Geschält|400 g|China|4.49|🫛;Kimchi Dumplings|350 g|Südkorea|6.69|🥟;Mandus Gemüse|400 g|Südkorea|6.39|🥟;Tteokbokki Reissticks|400 g|Südkorea|5.49|🍡;Miso Ramen Bowl|350 g|Japan|5.99|🍜;Thai Basilikum Wok|350 g|Thailand|5.89|🍛;Pad Thai Ready Meal|350 g|Thailand|6.39|🍜;Japanisches Curry mit Reis|350 g|Japan|6.49|🍛;Kokos Curry Gemüse|350 g|Thailand|5.99|🥥;Bibimbap Gemüse|350 g|Südkorea|6.29|🍚;Satay Spieße|300 g|Indonesien|7.49|🍢;Süße Mochi Eisbox|240 g|Japan|7.99|🍨;Mango Sticky Rice Dessert|250 g|Thailand|5.79|🥭;Wonton Suppe|350 g|China|5.99|🍲;Lemongrass Dumplings|350 g|Vietnam|6.59|🥟"},
 {name:"Getränke & Tee",symbol:"🍵",short:"Ein Schluck Fernweh",tone:"#e8e2ca",items:
"Matcha Tee Ceremonial|50 g|Japan|13.99|🍵;Matcha Tee Everyday|100 g|Japan|9.99|🍵;Jasmin Grüntee|100 g|China|5.49|🍵;Genmaicha Rösttee|100 g|Japan|5.79|🍵;Sencha Grüntee|100 g|Japan|6.49|🍵;Hojicha Rösttee|100 g|Japan|6.29|🍵;Oolong Tee|100 g|Taiwan|6.99|🫖;Thai Tea Original|200 g|Thailand|5.99|🧋;Chai Gewürztee|150 g|Indien|4.99|🫖;Yuzu Fruchttee|250 ml|Japan|2.99|🍋;Litschi Saft|330 ml|Vietnam|2.49|🍹;Mango Nektar|330 ml|Philippinen|2.39|🥭;Guaven Nektar|330 ml|Thailand|2.49|🍹;Passionsfrucht Drink|330 ml|Vietnam|2.59|🍹;Aloe Vera Drink|500 ml|Südkorea|2.99|🧃;Kokoswasser Pure|500 ml|Thailand|3.39|🥥;Calamansi Limo|330 ml|Philippinen|2.69|🍋;Ramune Limonade|200 ml|Japan|3.49|🥤;Melonen Soda|330 ml|Japan|2.89|🍈;Milchtee Brown Sugar|330 ml|Taiwan|3.69|🧋;Ube Latte Drink|330 ml|Philippinen|3.99|🍠;Coffee Latte Vietnam|250 ml|Vietnam|2.99|☕;Schwarzer Sesam Drink|250 ml|Taiwan|3.39|🥤;Ingwer Honig Tee|200 g|Südkorea|4.99|🫚;Kombucha Ingwer|330 ml|Südkorea|3.79|🍹"},
 {name:"Basics & Konserven",symbol:"🥥",short:"Dein gut gefüllter Vorrat",tone:"#dce9dc",items:
"Kokosmilch Cremig|400 ml|Thailand|2.79|🥥;Kokoscreme Extra|400 ml|Thailand|3.19|🥥;Bambussprossen Streifen|400 g|China|2.49|🎋;Wasserkastanien Scheiben|400 g|China|2.69|🌰;Mungobohnensprossen|400 g|China|2.39|🌱;Jackfruit in Lake|400 g|Thailand|3.39|🍈;Litschi in Sirup|400 g|China|3.59|🍒;Longan Früchte|400 g|Thailand|3.79|🍇;Mango Püree|400 g|Indien|4.19|🥭;Tamarindenpaste|200 g|Thailand|3.79|🍋;Palmzucker Geraspelt|300 g|Thailand|3.49|🍯;Reispapier Rund|200 g|Vietnam|2.99|🍥;Nori Algenblätter|50 g|Japan|4.49|🌿;Wakame Algen Getrocknet|100 g|Japan|5.29|🌿;Dashi Brühe Basis|100 g|Japan|4.39|🍲;Panko Semmelbrösel|200 g|Japan|3.79|🍞;Tempura Mehl Mix|250 g|Japan|3.49|🍤;Tapiokaperlen Klein|300 g|Taiwan|2.99|🧋;Tapiokaperlen Schwarz|300 g|Taiwan|3.49|🧋;Kichererbsen Geröstet|200 g|Indien|2.69|🫘;Schwarze Bohnen|400 g|China|2.49|🫘;Rote Bohnen Süß|400 g|Japan|3.39|🫘;Sesam Schwarz|200 g|China|3.99|🖤;Erdnüsse Geröstet|300 g|Vietnam|3.79|🥜;Getrocknete Shiitake|100 g|China|6.99|🍄"}
];
const $=s=>document.querySelector(s);
const money=n=>Number(n).toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const colorSets=[["#e7d0a6","#724e35"],["#cfe3d8","#2b644f"],["#ecd6d1","#a45047"],["#d4e5ed","#3e7180"],["#e6dcbb","#6f6244"],["#dbcde6","#685078"],["#f1dbc0","#9c5638"],["#dae4c9","#47694a"]];
const products=[];
categories.forEach((c, ci)=>{
  c.items.split(";").forEach((line,i)=>{
    const [name,size,origin,price,emoji]=line.split("|");
    const num=(size.match(/[\d.,]+/)||["1"])[0].replace(",",".");
    const unit=size.match(/(kg|g|ml|l)\s*$/i);
    const qty=unit?(Number(num)*(unit[1].toLowerCase()==="g"||unit[1].toLowerCase()==="ml"?.001:1)):1;
    const measure=unit&&/ml|l/i.test(unit[1])?"l":"kg";
    products.push({
      id:"n"+String(products.length+1).padStart(3,"0"),
      name, size, origin, price:Number(price), emoji, category:c.name, ci, idx:i,
      brand:["ASIA MART SELECT","KOMORI","HANAMI","MORI MARKET","SORA"][i%5],
      colors:colorSets[(ci*2+i)%colorSets.length],
      unitPrice:money(Number(price)/qty)+"/"+measure,
      featured:[0,2,5,8,11,15,19,22].includes(i),
      description:descriptionFor(name,c.name,origin),
      nutrition:nutritionFor(name,c.name),
      ingredients:ingredientsFor(name,c.name),
      allergens:allergensFor(name,c.name)
    });
  });
});
const byId=id=>products.find(p=>p.id===id);
const storageKey="nori-co-demo-cart-v1";
const favKey="nori-co-demo-favs-v1";
const readStore=(key,fallback)=>{try{const x=JSON.parse(localStorage.getItem(key));return x&&typeof x==="object"?x:fallback}catch{return fallback}};
let cart=readStore(storageKey,{});
let favorites=readStore(favKey,[]);
if(!Array.isArray(favorites))favorites=[];
let cat="Alle",origin="Alle",sort="popular",search="",limit=20,onlyFaves=false,shipping="standard",coupon=false,toastTimer=0,openDialog=null;
const $all=sel=>Array.from(document.querySelectorAll(sel));

function descriptionFor(name,category,origin){
 const leads={
 "Reis & Nudeln":"Die ideale Grundlage für deine Lieblingsgerichte. Von aromatischen Bowls bis zu herzhaften Wok-Kreationen.",
 "Saucen & Gewürze":"Kleine Zutat, großer Unterschied: Verleihe deinen Gerichten Tiefe, Würze und Charakter.",
 "Snacks & Süßes":"Für kleine Genussmomente, zum Teilen oder als überraschende Entdeckung für zwischendurch.",
 "Tiefkühl & Fertiggerichte":"Wenn es schnell gehen soll, ohne dass der Genuss zu kurz kommt. Einfach zubereiten und genießen.",
 "Getränke & Tee":"Ein Schluck Inspiration für deine nächste Auszeit oder als Begleiter zum Essen.",
 "Basics & Konserven":"Ein vielseitiger Vorratsklassiker, den du immer wieder für neue Rezeptideen verwenden kannst."
 };
 return name+" – eine ausgewählte Demo-Spezialität, inspiriert von der Küche aus "+origin+". "+leads[category];
}
function ingredientsFor(name,category){
 const n=name.toLowerCase();
 if(n.includes("sojasauce")||n.includes("tamari"))return "Wasser, SOJABOHNEN, Salz, WEIZEN (je nach Sorte)";
 if(n.includes("miso"))return "SOJABOHNEN, Reis, Salz, Wasser";
 if(n.includes("sesam"))return "SESAM, pflanzliche Zutaten";
 if(n.includes("erdnuss")||n.includes("satay"))return "ERDNÜSSE, Gewürze, pflanzliche Öle";
 if(n.includes("reis")&&!n.includes("nudeln")&&category==="Reis & Nudeln")return "Reis (100 %)";
 if(n.includes("nudeln")||n.includes("ramen")||n.includes("udon")||n.includes("soba"))return "Getreidemehl (teilweise WEIZEN), Wasser, Salz";
 if(n.includes("kokos"))return "Kokosnuss, Wasser, weitere Zutaten je nach Sorte";
 if(n.includes("tee")||n.includes("matcha")||n.includes("sencha"))return "Teeblätter oder Teepulver, sortenabhängige Zutaten";
 if(n.includes("chili")||n.includes("curry"))return "Chili, Gewürze, Wasser, Salz, pflanzliche Zutaten";
 if(category==="Snacks & Süßes")return "Reismehl oder Getreidemehl, Zucker, pflanzliche Öle, Aroma je nach Sorte";
 if(category==="Tiefkühl & Fertiggerichte")return "Gemüse, Teig- oder Reisbestandteile, Gewürze, mögliche allergene Zutaten je nach Sorte";
 if(category==="Getränke & Tee")return "Wasser, Fruchtbestandteile oder Teeextrakt, ggf. Zucker";
 return "Ausgewählte pflanzliche Zutaten, Wasser, Gewürze, ggf. Salz";
}
function allergensFor(name,category){
 const n=name.toLowerCase();
 const a=[];
 if(/soja|miso|edamame|tofu|teriyaki|ramen|gyoza|mandu|bibimbap/.test(n))a.push("Soja");
 if(/weizen|eiernudeln|soba|udon|ramen|panko|tempura|bao|gyoza|wonton|pocky|keks/.test(n))a.push("Glutenhaltiges Getreide");
 if(/sesam|furikake|tahini/.test(n))a.push("Sesam");
 if(/erdnuss|satay/.test(n))a.push("Erdnüsse");
 if(/garnelen|shrimp/.test(n))a.push("Krebstiere");
 if(/fischsauce|dashi/.test(n))a.push("Fisch");
 if(/austernsauce/.test(n))a.push("Weichtiere");
 if(/milch|latte/.test(n))a.push("Milch");
 if(category==="Tiefkühl & Fertiggerichte"&&!a.length)a.push("Rezeptabhängig");
 return a.length?a.join(", "):"Rezeptabhängig – bitte vor Verkauf prüfen";
}
function nutritionFor(name,category){
 const n=name.toLowerCase();
 let kcal=350,fat=1,carbs=76,sugars=1,protein=7,salt=.02;
 if(category==="Saucen & Gewürze"){kcal=135;fat=4;carbs=21;sugars=14;protein=3;salt=4.1;}
 if(category==="Snacks & Süßes"){kcal=430;fat=16;carbs=66;sugars=28;protein=5;salt=.6;}
 if(category==="Tiefkühl & Fertiggerichte"){kcal=205;fat=8;carbs=27;sugars=3;protein=8;salt=1.3;}
 if(category==="Getränke & Tee"){kcal=42;fat=.1;carbs=10;sugars=9;protein=.1;salt=.01;}
 if(category==="Basics & Konserven"){kcal=168;fat=6;carbs=23;sugars=4;protein=4;salt=.7;}
 if(/reis|glasnudeln|vermicelli/.test(n)&&category==="Reis & Nudeln"){kcal=354;fat=1.1;carbs=78;sugars=.7;protein=6.2;salt=.02;}
 if(/matcha|sencha|hojicha|oolong|genmaicha|jasmin grüntee/.test(n)){kcal=0;fat=0;carbs=0;sugars=0;protein=0;salt=0;}
 if(/kokosmilch|kokoscreme/.test(n)){kcal=190;fat=19;carbs=4;sugars=2;protein=2;salt=.08;}
 if(/sojasauce|fischsauce/.test(n)){kcal=65;fat=.1;carbs=7;sugars=3;protein=9;salt=14;}
 return {kcal,kj:Math.round(kcal*4.184),fat,carbs,sugars,protein,salt};
}
function photoFor(p){
 const n=p.name.toLowerCase();
 if(/mochi|eis|jelly|bonbon|dessert|fruchtgummi/.test(n))return "dessert.jpg";
 if(/keks|cracker|chips|pocky|st[iü]cks|schoko|gebäck|waffel/.test(n))return "cookie.jpg";
 if(/matcha|sencha|oolong|tee|genmaicha|hojicha/.test(n))return "tea.jpg";
 if(p.ci===4)return "drinks.jpg";
 if(p.ci===1)return "spices.jpg";
 if(/ramen|nudeln|udon|soba|pho|wok|vermicelli/.test(n))return "noodles.jpg";
 if(p.ci===0)return "friedrice.jpg";
 if(p.ci===3)return "dumplings.jpg";
 if(/reis|nori|algen/.test(n))return "sushi.jpg";
 return "asian.jpg";
}
function pack(p,large){
 const c=p.colors;
 const angle=p.ci===1?"150deg":p.ci===3?"145deg":"125deg";
 return '<div class="pack pack-type-'+p.ci+'" style="background:linear-gradient('+angle+','+c[0]+' 0%,#fff6e1 82%);color:'+c[1]+'">'+
 '<span class="pack-brand">'+safe(p.brand)+'</span>'+
 '<span class="pack-graphic" aria-hidden="true">'+p.emoji+'</span>'+
 '<span class="pack-name">'+safe(p.name)+'</span>'+
 '<span class="pack-size">'+safe(p.size)+'</span></div>';
}
function productCard(p){
 const on=favorites.includes(p.id);
 const flag=p.idx%7===1?"DEMO-ANGEBOT":p.idx%9===0?"NEU":p.idx%6===0?"BELIEBT":"";
 return '<article class="product-card" data-pid="'+p.id+'">'+
 '<div class="product-visual" data-product="'+p.id+'" role="button" tabindex="0" aria-label="Details zu '+safe(p.name)+'">'+
 (flag?'<span class="flag">'+flag+'</span>':"")+
 pack(p)+
 '</div><button class="heart-btn'+(on?" active":"")+'" data-fav="'+p.id+'" aria-label="'+(on?"Aus Merkliste entfernen":"Auf Merkliste setzen")+'">'+(on?"♥":"♡")+'</button>'+
 '<div class="product-body"><span class="product-overline">'+safe(p.category)+' · '+safe(p.origin)+'</span>'+
 '<button class="product-name" data-product="'+p.id+'">'+safe(p.name)+'</button>'+
 '<p class="product-subline">'+safe(p.size)+' · '+safe(p.brand)+'</p>'+
 '<div class="price-row"><div><div class="price">'+money(p.price)+(p.idx%7===1?'<span class="fake-was">'+money(Math.round(p.price*1.15*100)/100)+'</span>':'')+'</div><div class="unit-price">'+safe(p.unitPrice)+'</div></div>'+
 '<button class="add-btn" data-add="'+p.id+'" aria-label="'+safe(p.name)+' zum Warenkorb hinzufügen">+</button></div></div></article>';
}
function initCategories(){
 const container=$("#category-grid");
 if(!container)return;
 container.innerHTML=categories.map((c,i)=>
 '<button class="category-card" data-navcat="'+safe(c.name)+'" style="background:'+c.tone+'">'+
 '<div class="category-image"><span class="cat-emoji" aria-hidden="true">'+c.symbol+'</span></div>'+
 '<strong>'+safe(c.name)+'</strong><small>'+safe(c.short)+'</small><span class="cat-arrow">↗</span></button>'
 ).join("");
 const chip=$("#filter-chips");
 chip.innerHTML=['Alle'].concat(categories.map(x=>x.name)).map(c=>'<button class="chip" data-chip="'+safe(c)+'">'+safe(c)+'</button>').join("");
 const origins=[...new Set(products.map(p=>p.origin))].sort((a,b)=>a.localeCompare(b,"de"));
 $("#origin-filter").innerHTML='<option value="Alle">Alle Länder</option>'+origins.map(o=>'<option value="'+safe(o)+'">'+safe(o)+'</option>').join("");
}
function listProducts(){
 let items=onlyFaves?products.filter(p=>favorites.includes(p.id)):products.slice();
 if(cat!=="Alle")items=items.filter(p=>p.category===cat);
 if(origin!=="Alle")items=items.filter(p=>p.origin===origin);
 const q=search.trim().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("de");
 if(q)items=items.filter(p=>(p.name+" "+p.category+" "+p.origin+" "+p.brand).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("de").includes(q));
 if(sort==="price_asc")items.sort((a,b)=>a.price-b.price);
 if(sort==="price_desc")items.sort((a,b)=>b.price-a.price);
 if(sort==="name")items.sort((a,b)=>a.name.localeCompare(b.name,"de"));
 if(sort==="popular")items.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0)||a.ci-b.ci||a.idx-b.idx);
 return items;
}
function renderCatalog(){
 const items=listProducts();
 const grid=$("#catalog-grid");
 grid.innerHTML=items.length?items.slice(0,limit).map(productCard).join(""):'<div class="no-results"><h3>Da ist noch Luft im Einkaufskorb.</h3><p>Versuche einen anderen Suchbegriff oder entferne einen Filter.</p><button class="btn btn-dark" id="reset-filter">Alle Produkte anzeigen</button></div>';
 $("#catalog-count").textContent=items.length+" von "+products.length+" Artikeln";
 $("#active-filter-line").textContent=(onlyFaves?"Deine Merkliste · ":"")+(search?'Suche: „'+search+'“ · ':'')+(cat!=="Alle"?cat+" · ":"")+(origin!=="Alle"?origin+" · ":"")+"Angezeigt: "+Math.min(items.length,limit)+" Produkte";
 $("#more-button").hidden=items.length<=limit;
 $all("[data-chip]").forEach(b=>{b.classList.toggle("selected",b.dataset.chip===cat);b.setAttribute("aria-pressed",String(b.dataset.chip===cat));});
 if($("#origin-filter").value!==origin)$("#origin-filter").value=origin;
}
function featured(){
 const favorites=products.filter(p=>p.featured&&(p.idx===0||p.idx===8||p.idx===15)).slice(0,8);
 const picks=[products[1],products[27],products[51],products[76],products[101],products[126]];
 $("#featured-grid").innerHTML=picks.map(productCard).join("");
}
function save(){
 try{localStorage.setItem(storageKey,JSON.stringify(cart));localStorage.setItem(favKey,JSON.stringify(favorites));}catch{}
}
function count(){return Object.values(cart).reduce((a,b)=>a+(Number(b)||0),0)}
function subtotal(){return Object.entries(cart).reduce((sum,[id,qty])=>sum+(byId(id)?.price||0)*qty,0)}
function discounted(){return Math.round(subtotal()*(coupon?.95:1)*100)/100}
function shippingPrice(mode){
 if(mode==="pickup")return 0;
 if(mode==="express")return 9.9;
 return discounted()>=49?0:4.9;
}
function toast(msg){
 const el=$("#toast");el.textContent=msg;el.classList.add("show");
 window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.classList.remove("show"),2600);
}
function updateHeader(){
 $("#cart-count").textContent=count();
 $("#fav-count").textContent=favorites.length;
 $("#cart-title-count").textContent="("+count()+")";
}
function add(id,n=1){
 const p=byId(id);if(!p)return;
 cart[id]=Math.max(0,(Number(cart[id])||0)+n);
 if(!cart[id])delete cart[id];
 save();updateHeader();renderCart();
 toast(p.name+(n>0?" wurde hinzugefügt":" wurde aktualisiert"));
}
function setQty(id,amount){
 if(!byId(id))return;
 if(amount<=0)delete cart[id];else cart[id]=Math.min(99,amount);
 save();updateHeader();renderCart();
}
function toggleFav(id){
 if(favorites.includes(id))favorites=favorites.filter(x=>x!==id);else favorites.push(id);
 save();updateHeader();renderCatalog();featured();
 if($("#product-modal").classList.contains("open"))showProduct(id,false);
 toast(favorites.includes(id)?"Auf der Merkliste gespeichert":"Aus der Merkliste entfernt");
}
function recommendation(seed){
 const map={"Reis & Nudeln":"Saucen & Gewürze","Saucen & Gewürze":"Reis & Nudeln","Snacks & Süßes":"Getränke & Tee","Getränke & Tee":"Snacks & Süßes","Tiefkühl & Fertiggerichte":"Saucen & Gewürze","Basics & Konserven":"Reis & Nudeln"};
 const target=seed?map[seed.category]:"Snacks & Süßes";
 return products.find(p=>p.category===target&&!cart[p.id]&&p.idx%7===0)||products.find(p=>!cart[p.id]);
}
function renderCart(){
 const container=$("#cart-content"),footer=$("#cart-footer");
 const entries=Object.entries(cart).filter(([id,qty])=>byId(id)&&qty>0);
 if(!entries.length){
 container.innerHTML='<div class="empty-cart"><span class="empty-icon">🛍️</span><h3>Noch Platz für etwas Gutes.</h3><p>Entdecke Zutaten, die dein nächstes Lieblingsgericht möglich machen.</p><button class="btn btn-dark" data-close>Sortiment entdecken ↗</button></div>';
 footer.innerHTML='<small>Diese Shop-Vorschau verarbeitet keine echten Bestellungen.</small>';return;
 }
 container.innerHTML=entries.map(([id,qty])=>{
 const p=byId(id);
 return '<div class="cart-item"><div class="cart-thumb" aria-hidden="true">'+p.emoji+'</div><div><strong>'+safe(p.name)+'</strong><small>'+safe(p.size)+' · '+safe(p.origin)+'</small><div class="qty-row"><button data-qty="'+id+'" data-n="-1" aria-label="Menge reduzieren">−</button><span>'+qty+'</span><button data-qty="'+id+'" data-n="1" aria-label="Menge erhöhen">+</button></div></div><span class="cart-item-price">'+money(p.price*qty)+'</span></div>';
 }).join("");
 const rec=recommendation(byId(entries[entries.length-1][0]));
 if(rec)container.innerHTML+='<div class="cart-recommendation"><div class="cart-rec-eyebrow">PASST GUT DAZU</div><div class="cart-item"><div class="cart-thumb">'+rec.emoji+'</div><div><strong>'+safe(rec.name)+'</strong><small>'+safe(rec.size)+'</small></div><button class="add-btn" data-add="'+rec.id+'" aria-label="'+safe(rec.name)+' hinzufügen">+</button></div></div>';
 const s=discounted();
 const diff=Math.max(0,49-s);
 footer.innerHTML='<div class="progress-text"><span>'+(diff?("Noch "+money(diff)+" bis zum Demo-Gratisversand"):"Demo-Gratisversand erreicht")+'</span><strong>'+Math.min(100,Math.round(s/49*100))+' %</strong></div>'+
 '<div class="shipping-progress"><div style="width:'+Math.min(100,Math.round(s/49*100))+'%"></div></div>'+
 '<div class="summary-line"><span>Zwischensumme</span><strong>'+money(subtotal())+'</strong></div>'+
 (coupon?'<div class="summary-line"><span>Demo-Willkommenscode (5 %)</span><strong>−'+money(subtotal()-s)+'</strong></div>':"")+
 '<div class="summary-line"><span>Standardversand (Demo)</span><strong>'+(shippingPrice("standard")===0?"Gratis":money(shippingPrice("standard")))+'</strong></div>'+
 '<div class="summary-line total"><span>Beispielsumme</span><strong>'+money(s+shippingPrice("standard"))+'</strong></div>'+
 '<button class="btn btn-dark" data-checkout>Zur Demo-Kasse ↗</button><small>inkl. gesetzlicher MwSt. (Demo) · Keine echte Bestellung oder Zahlung</small>';
}
function overlay(type){
 closeAll(false);
 $("#backdrop").hidden=false;
 document.body.style.overflow="hidden";
 if(type==="cart"){
 $("#cart-drawer").classList.add("open");$("#cart-drawer").setAttribute("aria-hidden","false");openDialog="cart";renderCart();$("#cart-drawer [data-close]")?.focus();
 }else{
 const el=$("#"+type+"-modal");el.classList.add("open");el.setAttribute("aria-hidden","false");openDialog=type;el.querySelector("[data-close]")?.focus();
 }
}
function closeAll(clear=true){
 $("#cart-drawer").classList.remove("open");$("#cart-drawer").setAttribute("aria-hidden","true");
 $all(".modal-shell").forEach(x=>{x.classList.remove("open");x.setAttribute("aria-hidden","true")});
 if(clear){$("#backdrop").hidden=true;document.body.style.overflow="";openDialog=null}
}
function showProduct(id,shouldOpen=true){
 const p=byId(id);if(!p)return;
 const d=p.nutrition;
 const tab=(label,value)=>'<div>'+label+'</div><div>'+value+'</div>';
 const picks=products.filter(x=>x.id!==p.id&&x.category===({"Reis & Nudeln":"Saucen & Gewürze","Saucen & Gewürze":"Reis & Nudeln","Snacks & Süßes":"Getränke & Tee","Tiefkühl & Fertiggerichte":"Saucen & Gewürze","Getränke & Tee":"Snacks & Süßes","Basics & Konserven":"Saucen & Gewürze"}[p.category])).slice(0,3);
 $("#product-modal-content").innerHTML='<div class="product-modal-grid">'+
 '<div class="modal-product-visual">'+pack(p,true)+'</div><div class="product-modal-details">'+
 '<span class="section-kicker">'+safe(p.category)+' · '+safe(p.origin)+'</span>'+
 '<h2>'+safe(p.name)+'</h2><p class="detail-subtitle">'+safe(p.brand)+' · '+safe(p.size)+'</p>'+
 '<p class="detail-description">'+safe(p.description)+'</p>'+
 '<div class="detail-price">'+money(p.price)+'</div><div class="unit-price">'+safe(p.unitPrice)+' · inkl. MwSt. zzgl. ggf. Versand (Demo)</div>'+
 '<button class="btn btn-dark" data-add="'+p.id+'">In den Warenkorb · '+money(p.price)+' ↗</button>'+
 '<div class="detail-info"><h3>Produktinformationen</h3><p><b>Herkunft:</b> '+safe(p.origin)+'</p><p><b>Nettofüllmenge:</b> '+safe(p.size)+'</p>'+
 '<h3>Zutaten – Musterdaten</h3><p>'+safe(p.ingredients)+'</p><h3>Allergene – Musterdaten</h3><p>'+safe(p.allergens)+'</p>'+
 '<h3>Beispiel-Nährwerte je 100 g / 100 ml</h3><div class="nutrition-table">'+
 tab("Energie",d.kj+" kJ / "+d.kcal+" kcal")+tab("Fett",d.fat+" g")+tab("Kohlenhydrate",d.carbs+" g")+tab("davon Zucker",d.sugars+" g")+tab("Eiweiß",d.protein+" g")+tab("Salz",d.salt+" g")+'</div>'+
 '<div class="detail-warning">Nur Präsentationsdaten: Rezepturen, Allergene, Nährwerte, Herkunft und Preise sind fiktiv und vor echtem Verkauf anhand der Herstellerangaben zu prüfen.</div>'+
 '<div class="cross-sell"><h3>Das könnte zu deiner Auswahl passen</h3><div class="cross-sell-list">'+picks.map(x=>'<button class="cross-item" data-add="'+x.id+'"><span class="cross-emoji">'+x.emoji+'</span><span>'+safe(x.name)+'<br><b>'+money(x.price)+' · + hinzufügen</b></span></button>').join("")+'</div></div></div></div>';
 if(shouldOpen)overlay("product");
}
function showCheckout(){
 if(!count()){toast("Dein Warenkorb ist noch leer.");return}
 const sb=discounted(),ship=shippingPrice(shipping);
 $("#checkout-content").innerHTML='<span class="section-kicker">DEMONSTRATION / KASSE</span><h2>Fast bei deinem Genussmoment.</h2>'+
 '<p>So kann der echte Bestellprozess später aussehen. Die Eingaben werden weder gespeichert noch versendet; es werden keine Zahlungen ausgeführt.</p>'+
 '<div class="checkout-demo-note">Sicherer Demo-Modus · keine echte Bestellung · keine Zahlungsdaten</div>'+
 '<form id="checkout-form"><div class="checkout-fields">'+
 '<label>Vorname<input autocomplete="off" name="first" placeholder="Vorname" required minlength="2"></label>'+
 '<label>Nachname<input autocomplete="off" name="last" placeholder="Nachname" required minlength="2"></label>'+
 '<label class="wide">E-Mail für Bestellvorschau<input autocomplete="off" type="email" name="email" placeholder="beispiel@domain.de" required></label>'+
 '<label class="wide">Straße & Hausnummer<input autocomplete="off" name="street" placeholder="Musterstraße 12" required></label>'+
 '<label>Postleitzahl<input autocomplete="off" name="postcode" inputmode="numeric" pattern="[0-9]{5}" placeholder="86150" required></label>'+
 '<label>Ort<input autocomplete="off" name="city" placeholder="Augsburg" required></label>'+
 '<label class="wide">Versandart<select name="shipping" id="checkout-shipping"><option value="standard">Standardversand (Demo) · '+(sb>=49?"Gratis":money(4.9))+'</option><option value="express">Expressversand (Demo) · 9,90 €</option><option value="pickup">Abholung im Markt (Demo) · Gratis</option></select></label>'+
 '<label class="wide">Bezahlmethode – rein visuelle Auswahl<select name="payment" id="checkout-payment"><option>PayPal (nicht angebunden)</option><option>Debit- / Kreditkarte (nicht angebunden)</option><option>SEPA-Überweisung (nicht angebunden)</option><option>Rechnung (nicht angebunden)</option></select></label></div>'+
 '<div class="demo-coupon"><label for="coupon-input">Demo-Aktionscode</label><div><input id="coupon-input" value="'+(coupon?"WILLKOMMEN5":"")+'" placeholder="z. B. WILLKOMMEN5"><button type="button" id="apply-coupon">Anwenden</button></div><small>Code WILLKOMMEN5: 5 % Demo-Nachlass auf den Warenwert. Keine echte Aktion.</small></div>'+
 '<div class="checkout-total"><span>Beispiel-Gesamtsumme</span><span id="checkout-total">'+money(sb+ship)+'</span></div>'+
 '<button class="btn btn-dark" type="submit">Bestellvorschau anzeigen ↗</button><p class="checkout-fineprint">Mit diesem Button wird keine rechtsverbindliche Bestellung ausgelöst. Kein Versand, keine Zahlung, kein Datenversand.</p></form>';
 overlay("checkout");$("#checkout-shipping").value=shipping;
}
function updateCheckoutTotal(){
 $("#checkout-total").textContent=money(discounted()+shippingPrice(shipping));
 const option=$("#checkout-shipping option[value='standard']");
 if(option)option.textContent="Standardversand (Demo) · "+(discounted()>=49?"Gratis":money(4.9));
}
function showSuccess(){
 $("#checkout-content").innerHTML='<div class="success-state"><span class="success-icon">🎉</span><span class="section-kicker">DEMO ERFOLGREICH DURCHGESPIELT</span><h2>So einfach kann Bestellen sein.</h2><p>Du hast eine Bestellvorschau mit '+count()+' Artikeln und einem Beispielwert von '+money(discounted()+shippingPrice(shipping))+' abgeschlossen.</p><p><strong>Wichtig:</strong> Es wurde keine Bestellung erstellt, kein Geld abgebucht und keine E-Mail verschickt.</p><button type="button" class="btn btn-dark" data-close>Weiter entdecken ↗</button></div>';
}
function bundle(kind){
 const ids=kind==="sushi"?["n003","n138","n026","n148"]:["n023","n040","n055","n126"];
 let found=0;ids.forEach(id=>{if(byId(id)){cart[id]=(cart[id]||0)+1;found++}});
 save();updateHeader();renderCart();overlay("cart");toast(found+" passende Demo-Zutaten hinzugefügt");
}
function navigate(catName){
 cat=catName;onlyFaves=false;limit=20;search="";$("#global-search").value="";
 renderCatalog();$("#catalog").scrollIntoView({behavior:"smooth",block:"start"});
}
function initializeEvents(){
 document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-navcat]");if(nav){e.preventDefault();navigate(nav.dataset.navcat);return}
 const land=e.target.closest("[data-orig]");if(land){e.preventDefault();onlyFaves=false;cat="Alle";origin=land.dataset.orig;search="";$("#global-search").value="";limit=20;renderCatalog();$("#catalog").scrollIntoView({behavior:"smooth",block:"start"});return}
 const chip=e.target.closest("[data-chip]");if(chip){cat=chip.dataset.chip;limit=20;onlyFaves=false;renderCatalog();return}
 const bund=e.target.closest("[data-bundle]");if(bund){e.preventDefault();bundle(bund.dataset.bundle);return}
 const fav=e.target.closest("[data-fav]");if(fav){e.preventDefault();toggleFav(fav.dataset.fav);return}
 const addBtn=e.target.closest("[data-add]");if(addBtn){e.preventDefault();add(addBtn.dataset.add);return}
 const product=e.target.closest("[data-product]");if(product){e.preventDefault();showProduct(product.dataset.product);return}
 const quantity=e.target.closest("[data-qty]");if(quantity){setQty(quantity.dataset.qty,(cart[quantity.dataset.qty]||0)+Number(quantity.dataset.n));return}
 if(e.target.closest("[data-close]")||e.target===$("#backdrop")){closeAll();return}
 if(e.target.closest("[data-checkout]")){showCheckout();return}
 if(e.target.closest("#reset-filter")){cat="Alle";origin="Alle";search="";onlyFaves=false;$("#global-search").value="";renderCatalog();return}
 if(e.target.closest("#apply-coupon")){
 const code=($("#coupon-input").value||"").trim().toUpperCase();
 if(code==="WILLKOMMEN5"){coupon=true;toast("Demo-Rabatt: 5 % aktiviert.");renderCart();updateCheckoutTotal();}
 else if(!code){coupon=false;toast("Rabattcode entfernt.");updateCheckoutTotal();}
 else{toast("Dieser Demo-Code ist nicht bekannt.");}
 return;
 }
 });
 $("#cart-button").addEventListener("click",()=>overlay("cart"));
 $("#wishlist-button").addEventListener("click",()=>{onlyFaves=true;cat="Alle";origin="Alle";search="";$("#global-search").value="";renderCatalog();$("#catalog").scrollIntoView({behavior:"smooth",block:"start"});toast(favorites.length?favorites.length+" Artikel auf deiner Merkliste":"Deine Merkliste ist noch leer")});
 $("#global-search").addEventListener("input",e=>{search=e.target.value;onlyFaves=false;cat="Alle";origin="Alle";limit=20;renderCatalog()});
 $("#global-search").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("#catalog").scrollIntoView({behavior:"smooth"})}});
 $("#origin-filter").addEventListener("change",e=>{origin=e.target.value;limit=20;renderCatalog()});
 $("#sort-filter").addEventListener("change",e=>{sort=e.target.value;limit=20;renderCatalog()});
 $("#more-button").addEventListener("click",()=>{limit+=20;renderCatalog()});
 $("#newsletter-form").addEventListener("submit",e=>{e.preventDefault();e.target.reset();toast("Vorschau: Ein echter Newsletter wurde nicht abonniert.")});
 $("#checkout-content").addEventListener("change",e=>{if(e.target.id==="checkout-shipping"){shipping=e.target.value;updateCheckoutTotal()}});
 $("#checkout-content").addEventListener("submit",e=>{if(e.target.id==="checkout-form"){e.preventDefault();showSuccess()}});
 document.addEventListener("keydown",e=>{
 if(e.key==="Escape")closeAll();
 const el=document.activeElement;
 if((e.key==="Enter"||e.key===" ")&&el?.dataset?.product){e.preventDefault();showProduct(el.dataset.product)}
 });
}
initCategories();featured();renderCatalog();renderCart();updateHeader();initializeEvents();
window.NORI_DEMO={productCount:products.length,products,cartContents:()=>({...cart}),filteredCount:()=>listProducts().length,addToCart:add,showCheckout};
})();
