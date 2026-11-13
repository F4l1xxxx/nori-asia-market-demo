/* ASIA MART — original recipe ideas and opt-in, attributed demo API search.
   Search text leaves the browser only after an explicit online-search action. */
(()=>{
  "use strict";
  const $=sel=>document.querySelector(sel);
  const safe=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm=value=>String(value??"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").toLocaleLowerCase("de").trim();
  const ideas=[
    {id:"green-curry",name:"Grünes Thai-Curry mit Gemüse",area:"Thailand",emoji:"🍛",photo:"asian.jpg",tag:"Grünes Thai Curry Green Curry",time:"ca. 35 Min.",about:"Aromatisch, cremig und mild bis scharf – du bestimmst die Pastenmenge.",ingredients:["180 g Jasminreis","400 ml Kokosmilch","40 g Grüne Currypaste","200 g Tofu","1 Paprika","1/2 Zucchini","1 Handvoll Thai-Basilikum","1 TL Sojasauce"],steps:["Reis nach Packungsanweisung garen.","Currypaste in etwas Öl vorsichtig anrösten, Kokosmilch einrühren.","Gemüse und Tofu in Stücke schneiden, in der Sauce etwa 10–15 Minuten garen.","Mit Sojasauce abschmecken und mit Thai-Basilikum und Reis servieren."]},
    {id:"sushi",name:"Maki-Sushi mit Gurke & Avocado",area:"Japan",emoji:"🍣",photo:"sushi.jpg",tag:"Sushi Maki Rollen japanisch",time:"ca. 55 Min.",about:"Ein unkomplizierter Sushi-Abend mit den wichtigsten Zutaten.",ingredients:["200 g Sushireis","3 Stück Nori Algenblätter","25 ml Reisessig","10 g Zucker","1/2 TL Salz","1/2 Gurke","1 Avocado","30 ml Sojasauce"],steps:["Sushireis nach Packungsangabe kochen und auskühlen lassen.","Reisessig, Zucker und Salz verrühren und unter den Reis mischen.","Nori auf eine Bambusmatte legen, dünn mit Reis bestreichen, Gurke und Avocado auflegen.","Fest aufrollen, mit einem scharfen feuchten Messer schneiden und mit Sojasauce servieren."]},
    {id:"ramen",name:"Shoyu-Ramen mit Ei",area:"Japan",emoji:"🍜",photo:"noodles.jpg",tag:"Ramen Nudelsuppe Shoyu",time:"ca. 30 Min.",about:"Herzhafte Nudelsuppe mit Soja-Brühe und frischem Gemüse.",ingredients:["200 g Ramen Weizennudeln","700 ml Gemüsebrühe","2 EL Sojasauce","1 EL Mirin","2 Eier","2 Frühlingszwiebeln","100 g Pilze","1 TL Sesamöl"],steps:["Eier nach Wunsch kochen und halbieren; Frühlingszwiebeln fein schneiden.","Gemüsebrühe mit Sojasauce und Mirin erwärmen, Pilze darin garen.","Ramen-Nudeln separat nach Packungsangabe garen und in Schalen verteilen.","Brühe zugießen, Eier und Frühlingszwiebeln darauf anrichten, wenig Sesamöl zugeben."]},
    {id:"pad-thai",name:"Pad Thai mit Tofu",area:"Thailand",emoji:"🥢",photo:"noodles.jpg",tag:"Pad Thai Reisnudeln Thai",time:"ca. 30 Min.",about:"Gebratene Reisnudeln mit Tamarinde, Limette und Erdnüssen.",ingredients:["180 g Pad Thai Reisbandnudeln","200 g Tofu","100 g Mungobohnensprossen","1 EL Tamarindenpaste","1 EL Fischsauce","1 EL Palmzucker","40 g Erdnüsse Geröstet","2 Frühlingszwiebeln","1 Limette"],steps:["Reisnudeln nach Packungsanweisung einweichen oder vorgaren.","Tamarindenpaste, Fischsauce, Palmzucker und wenig Wasser verrühren.","Tofu anbraten, Nudeln und Sauce zugeben und kurz durchschwenken.","Sprossen und Frühlingszwiebeln kurz mitgaren, mit Erdnüssen und Limette servieren."]},
    {id:"pho",name:"Pho-Nudelsuppe mit Gemüse",area:"Vietnam",emoji:"🍲",photo:"pho.jpg",tag:"Pho vietnamesische Reisnudelsuppe",time:"ca. 40 Min.",about:"Wärmende Reisbandnudeln in einer würzigen Gemüsebrühe.",ingredients:["200 g Pho Reisbandnudeln","900 ml Gemüsebrühe","30 g Ingwer","1 Zwiebel","2 Stück Sternanis","100 g Pilze","1 Limette","1 Handvoll Koriander"],steps:["Zwiebel und Ingwer kurz trocken anrösten, mit Brühe und Sternanis aufkochen.","Brühe etwa 20 Minuten sanft ziehen lassen, Sternanis anschließend entfernen.","Pilze darin garen und Reisnudeln separat nach Packungsangabe vorbereiten.","Nudeln und Brühe in Schalen geben, mit Koriander und Limette servieren."]},
    {id:"bibimbap",name:"Bibimbap mit Gemüse",area:"Korea",emoji:"🥗",photo:"bowls.jpg",tag:"Bibimbap Koreanische Reisschale",time:"ca. 35 Min.",about:"Bunte Reisschale mit Gemüse und scharfer Würzpaste.",ingredients:["180 g Sushireis","1 Karotte","1/2 Gurke","100 g Spinat","2 Eier","1 EL Gochujang","2 TL Sesamöl","1 TL Sojasauce"],steps:["Reis nach Packungsangabe zubereiten.","Karotte, Gurke und Spinat getrennt vorbereiten; Karotte und Spinat kurz anbraten.","Eier nach Wunsch braten; Gochujang mit Sojasauce und wenig Wasser verrühren.","Alles auf dem Reis anrichten, Sauce und Sesamöl erst beim Servieren hinzufügen."]},
    {id:"sticky-rice",name:"Mango Sticky Rice",area:"Thailand",emoji:"🥭",photo:"dessert.jpg",tag:"Mango Klebreis Kokos Dessert",time:"ca. 50 Min. + Einweichen",about:"Klebreis, frische Mango und eine cremige Kokossauce.",ingredients:["200 g Klebreis","300 ml Kokosmilch","50 g Palmzucker","1 Mango","1 Prise Salz"],steps:["Klebreis je nach Packungsangabe mehrere Stunden einweichen und anschließend dämpfen.","Kokosmilch mit Palmzucker und einer Prise Salz schonend erwärmen, nicht stark kochen.","Einen Teil der warmen Kokosmilch unter den gegarten Reis heben und ziehen lassen.","Mango schneiden und mit Klebreis und übriger Kokossauce servieren."]},
    {id:"tteokbokki",name:"Tteokbokki – würzige Reiskuchen",area:"Korea",emoji:"🌶️",photo:"asian.jpg",tag:"Tteokbokki Koreanisch Gochujang Reissticks",time:"ca. 20 Min.",about:"Süß-scharfe Reiskuchen mit Gochujang.",ingredients:["400 g Tteokbokki Reissticks","2 EL Gochujang","300 ml Wasser","1 EL Zucker","1 TL Sojasauce","2 Frühlingszwiebeln"],steps:["Reissticks nach Packungsangabe vorbereiten, falls nötig einweichen.","Wasser mit Gochujang, Zucker und Sojasauce in einer Pfanne verrühren.","Reissticks zugeben und bei mittlerer Hitze garen, bis die Sauce eindickt.","Mit geschnittenen Frühlingszwiebeln servieren."]},
    {id:"nasi-goreng",name:"Nasi Goreng mit Gemüse",area:"Indonesien",emoji:"🍚",photo:"friedrice.jpg",tag:"Nasi Goreng gebratener Reis Indonesisch",time:"ca. 25 Min. + Reis abkühlen",about:"Würziger Bratreis mit Gemüse, Ei und etwas Sambal.",ingredients:["200 g Jasminreis","2 Eier","1 Zwiebel","1 Karotte","2 Knoblauchzehen","1 EL Sojasauce","1 TL Sambal Oelek","1 Frühlingszwiebel"],steps:["Reis vorkochen, rasch abkühlen lassen und bis zum Braten gekühlt lagern.","Zwiebel, Knoblauch und Karotte in etwas Öl anbraten.","Eier stocken lassen, kalten Reis hinzufügen und gründlich durcherhitzen.","Mit Sojasauce und Sambal würzen, mit Frühlingszwiebel servieren."]},
    {id:"miso-soup",name:"Miso-Suppe mit Tofu",area:"Japan",emoji:"🥣",photo:"asian.jpg",tag:"Miso Suppe Tofu Wakame Japan",time:"ca. 15 Min.",about:"Leichte Brühe mit Miso, Wakame und Tofu.",ingredients:["500 ml Dashi Brühe","2 EL Miso Paste Weiß","10 g Wakame","150 g Tofu","1 Frühlingszwiebel"],steps:["Wakame nach Packungsangabe einweichen, Tofu würfeln.","Dashi-Brühe erwärmen und Tofu und Wakame kurz darin ziehen lassen.","Etwas warme Brühe mit Miso verrühren und wieder in den Topf geben.","Nicht mehr sprudelnd kochen lassen; mit Frühlingszwiebel servieren."]},
    {id:"gyoza",name:"Gyoza mit schneller Dip-Sauce",area:"Japan",emoji:"🥟",photo:"dumplings.jpg",tag:"Gyoza Teigtaschen Dip",time:"ca. 15 Min.",about:"Knusprig gedämpfte Teigtaschen mit einem einfachen Dip.",ingredients:["400 g Gyoza Gemüse","2 EL Sojasauce","1 EL Reisessig","1 TL Sesamöl"],steps:["Gyoza nach Packungsanweisung in einer Pfanne anbraten.","Bei geeigneter Pfanne etwas Wasser zugeben, abdecken und nach Packungsangabe dämpfen.","Sojasauce, Reisessig und Sesamöl zu einem Dip verrühren.","Gyoza heiß mit Dip servieren und TK-Hinweise beachten."]},
    {id:"red-curry",name:"Rotes Thai-Curry mit Hähnchen",area:"Thailand",emoji:"🍛",photo:"asian.jpg",tag:"Rotes Thai Curry Red Curry",time:"ca. 35 Min.",about:"Aromatisches rotes Curry mit Gemüse und Jasminreis.",ingredients:["180 g Jasminreis","400 ml Kokosmilch","40 g Rote Currypaste","250 g Hähnchenbrust","1 Paprika","1/2 Zucchini","1 TL Fischsauce"],steps:["Jasminreis nach Packungsanweisung garen.","Currypaste in wenig Öl kurz anrösten, Kokosmilch einrühren.","Hähnchen und Gemüse würfeln, in die Sauce geben und vollständig durchgaren.","Mit Fischsauce abschmecken und mit Reis servieren."]}
  ];
  const searchAliases=[
    [/grun(?:es|e)? ?thai ?curry|green ?thai ?curry|green ?curry/,"Thai Green Curry"],
    [/rot(?:es|e)? ?thai ?curry|red ?thai ?curry|red ?curry/,"Thai Red Curry"],
    [/miso ?suppe/,"Miso Soup"],
    [/ramen|rahmen/,"Ramen"],
    [/pad ?thai/,"Pad Thai"],
    [/sushi|maki/,"Sushi"],
    [/pho/,"Pho"],
    [/nasi ?goreng/,"Nasi Goreng"],
    [/bibimbap/,"Bibimbap"],
    [/mango ?sticky ?rice|klebreis ?mango/,"Mango Sticky Rice"],
    [/tteokbokki/,"Tteokbokki"],
    [/gyoza/,"Gyoza"]
  ];
  const ingredientAliases={
    "coconut milk":"Kokosmilch","green curry paste":"Grüne Currypaste","red curry paste":"Rote Currypaste",
    "soy sauce":"Sojasauce","dark soy sauce":"Dunkle Sojasauce","rice vinegar":"Reisessig",
    "sushi rice":"Sushireis","ramen noodles":"Ramen Weizennudeln","rice noodles":"Reisnudeln",
    "fish sauce":"Fischsauce","oyster sauce":"Austernsauce","sesame oil":"Sesamöl",
    "nori":"Nori Algenblätter","tamarind paste":"Tamarindenpaste","palm sugar":"Palmzucker",
    "glutinous rice":"Klebreis","sticky rice":"Klebreis","mirin":"Mirin",
    "miso paste":"Miso Paste Weiß","gochujang":"Gochujang","sriracha":"Sriracha"
  };
  const state={online:[],loading:false,searchNo:0,showAll:false};
  const photo=path=>"./assets/"+path;
  function localMatches(query){
    const term=norm(query);
    if(!term)return ideas;
    const tokens=term.split(/\s+/).filter(Boolean);
    return ideas.filter(idea=>tokens.every(word=>norm(idea.name+" "+idea.area+" "+idea.tag+" "+idea.about).includes(word)));
  }
  function renderLocal(){
    const query=$("#recipe-idea-query")?.value||"";
    const matches=localMatches(query);
    const shown=query||state.showAll?matches:matches.slice(0,6);
    $("#recipe-local-count").textContent=query?matches.length+" passende Kochideen":ideas.length+" einfache Kochideen";
    $("#recipe-local-grid").innerHTML=shown.map(idea=>'<article class="recipe-card">'+
      '<img loading="lazy" src="'+photo(idea.photo)+'" alt="" class="recipe-card-photo">'+
      '<div class="recipe-card-body"><span class="recipe-region">'+safe(idea.area)+' · '+safe(idea.time)+'</span><h4>'+safe(idea.name)+'</h4><p>'+safe(idea.about)+'</p>'+ 
      '<button class="recipe-card-button" type="button" data-recipe-local="'+idea.id+'">Rezept ansehen ↗</button></div></article>').join("")||'<p class="recipe-no-results">Hier ist noch keine passende Kochidee hinterlegt. Du kannst online nach deinem Wunschgericht suchen.</p>';
    $("#recipe-more-local").hidden=Boolean(query)||state.showAll||ideas.length<=6;
  }
  function safeHttpUrl(input,allowHosts){
    try{const url=new URL(String(input));return url.protocol==="https:"&&(!allowHosts||allowHosts.includes(url.hostname))?url.href:null;}catch{return null;}
  }
  function remoteResults(meals){
    const slot=$("#recipe-online-results");
    if(!meals.length){slot.innerHTML='<p class="recipe-no-results">In der Online-Rezeptdatenbank wurde dazu kein Treffer gefunden. Probiere einen kürzeren Begriff.</p>';return;}
    slot.innerHTML=meals.map(meal=>{
      const url=safeHttpUrl(meal.strMealThumb,["www.themealdb.com","themealdb.com"]);
      return '<article class="recipe-online-card">'+
        (url?'<img loading="lazy" src="'+safe(url+'/small')+'" alt="">':'<span aria-hidden="true">🍜</span>')+
        '<div><small>'+safe(meal.strArea||"Internationale Küche")+' · TheMealDB</small><h4>'+safe(meal.strMeal||"Rezept")+'</h4><button type="button" data-recipe-online="'+safe(meal.idMeal)+'">Rezept & Zutaten ansehen ↗</button></div></article>';
    }).join("");
  }
  function showDetail(title,area,ingredients,steps,{source=null,id=null,localId=null,english=false}={}){
    const detail=$("#recipe-detail-panel");
    const lines=ingredients.filter(x=>x&&String(x).trim());
    const content='<div class="recipe-detail-heading"><div><span class="retail-label">'+(source?'ONLINE-REZEPT · THEMEALDB':'KOCHIDEE AUS UNSERER DEMO')+'</span><h3>'+safe(title)+'</h3><p>'+safe(area||"")+(english?' · Anleitung im Original auf Englisch':'')+'</p></div><button type="button" class="recipe-detail-close" data-recipe-close aria-label="Rezept schließen">✕</button></div>'+ 
      '<div class="recipe-detail-cols"><div><h4>Zutaten</h4><ul>'+lines.map(line=>'<li>'+safe(line)+'</li>').join("")+'</ul></div>'+ 
      '<div><h4>Zubereitung</h4><ol>'+steps.map(step=>'<li>'+safe(step)+'</li>').join("")+'</ol></div></div>'+ 
      '<div class="recipe-detail-actions"><button class="market-button" type="button" data-recipe-shop="'+safe(localId||id||"")+'">Passende Shopzutaten übernehmen ↗</button>'+ 
      (source?'<a href="'+safe(source)+'" target="_blank" rel="noopener noreferrer">Originalrezept bei TheMealDB ↗</a>':'')+'</div>'+ 
      '<p class="recipe-detail-disclaimer">Nicht jede Rezeptzutat wird im Demo-Sortiment verkauft. Mengen und Allergene bitte prüfen; fehlende Produkte werden im Scanner nicht durch unpassende Waren ersetzt.</p>';
    detail.innerHTML=content;detail.hidden=false;
    detail.scrollIntoView({block:"start",behavior:"smooth"});
  }
  async function showRemoteRecipe(id){
    const meal=state.online.find(m=>String(m.idMeal)===String(id));if(!meal)return;
    const requestId=++state.searchNo;
    $("#recipe-online-status").textContent="Rezeptdetails werden geladen …";
    try{
      const response=await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+encodeURIComponent(id));
      if(!response.ok)throw Error("Online-Dienst nicht erreichbar");
      const data=await response.json();
      if(requestId!==state.searchNo)return;
      const full=data?.meals?.find(m=>String(m.idMeal)===String(id));
      if(!full)throw Error("Keine vollständigen Rezeptdaten");
      const ingredientLines=[];
      for(let i=1;i<=20;i++){
        const ingredient=String(full["strIngredient"+i]||"").trim(),amount=String(full["strMeasure"+i]||"").trim();
        if(ingredient)ingredientLines.push((amount?amount+" ":"")+ingredient);
      }
      const steps=String(full.strInstructions||"").split(/\n+/).map(x=>x.trim()).filter(Boolean);
      const origin="https://www.themealdb.com/meal/"+encodeURIComponent(id);
      state.selectedOnline={id:String(id),ingredients:ingredientLines,cartIngredients:ingredientLines.map(line=>{
        // Translate only explicit ingredient names, not measures or recipe steps.
        let translated=line;
        for(const [english,german] of Object.entries(ingredientAliases)){
          const at=norm(line).lastIndexOf(english);
          if(at>=0&&norm(line).slice(at)===english){translated=line.slice(0,line.length-english.length)+german;break;}
        }
        return translated;
      })};
      showDetail(full.strMeal,full.strArea,ingredientLines,steps,{source:origin,id:String(id),english:true});
      $("#recipe-online-status").textContent="Originalrezept von TheMealDB geöffnet.";
    }catch(err){if(requestId===state.searchNo)$("#recipe-online-status").textContent="Details konnten nicht geladen werden. Bitte erneut versuchen oder ein anderes Rezept wählen.";}
  }
  function importToScanner(lines){
    try{
      sessionStorage.setItem("asia-market-recipe-import-v1",JSON.stringify({text:lines.join("\n"),at:Date.now()}));
      location.href="?seite=rezeptscanner";
    }catch{$("#recipe-online-status").textContent="Die Einkaufsliste konnte in diesem Browser nicht übernommen werden.";}
  }
  async function searchOnline(query){
    const searchText=query.trim();if(!searchText)return;
    const no=++state.searchNo;
    const translated=searchAliases.find(([re])=>re.test(norm(searchText)))?.[1]||searchText;
    const controller=new AbortController();
    // A separate deadline also settles the UI if the browser does not reject
    // an aborted network request promptly (e.g. while resolving a host).
    let timer;
    const deadline=new Promise((_,reject)=>{
      timer=setTimeout(()=>{controller.abort();reject(Error("Online-Suche zu langsam"));},9000);
    });
    $("#recipe-online-section").hidden=false;
    $("#recipe-online-results").innerHTML="";
    $("#recipe-online-status").textContent="Suche im Internet läuft …";
    $("#recipe-online-button").disabled=true;
    try{
      const url="https://www.themealdb.com/api/json/v1/1/search.php?s="+encodeURIComponent(translated.slice(0,90));
      const response=await Promise.race([fetch(url,{headers:{Accept:"application/json"},signal:controller.signal}),deadline]);
      if(!response.ok)throw Error("API-Status "+response.status);
      const data=await response.json();
      if(no!==state.searchNo)return;
      state.online=Array.isArray(data?.meals)?data.meals.slice(0,6):[];
      remoteResults(state.online);
      $("#recipe-online-status").textContent=state.online.length?state.online.length+" Rezept"+(state.online.length===1?"":"e")+" im Internet gefunden.":"Kein Treffer für diese Suche – lokale Kochideen bleiben verfügbar.";
    }catch{
      if(no===state.searchNo){state.online=[];$("#recipe-online-results").innerHTML="";$("#recipe-online-status").textContent="Online-Suche gerade nicht verfügbar. Unsere Kochideen funktionieren weiterhin ohne Internet.";}
    }finally{clearTimeout(timer);if(no===state.searchNo)$("#recipe-online-button").disabled=false;}
  }
  function mount(){
    if(new URLSearchParams(location.search).get("seite")!=="kochideen"||!$(".idea-top")||$("#recipe-discovery"))return;
    const section=document.createElement("section");section.id="recipe-discovery";section.className="recipe-discovery";
    section.innerHTML='<div class="recipe-find"><div class="recipe-find-copy"><span class="retail-label">REZEPTFINDER · NEU</span><h2>Was stellst du dir <em>für heute vor?</em></h2><p>Ein Gericht im Kopf reicht. Wir helfen dir, das Rezept und die passenden Shopzutaten zu finden.</p></div>'+ 
      '<form id="recipe-search-form" class="recipe-search-form" role="search"><label for="recipe-idea-query">Dein Wunschgericht</label><div><input id="recipe-idea-query" type="search" maxlength="90" autocomplete="off" placeholder="z. B. Grünes Thai-Curry" aria-label="Nach Rezept oder Gericht suchen"><button id="recipe-online-button" type="submit" class="market-button">Im Internet suchen ↗</button></div></form>'+ 
      '<div class="recipe-quick"><span>Oder direkt:</span><button type="button" data-recipe-query="Grünes Thai-Curry">Grünes Thai-Curry</button><button type="button" data-recipe-query="Sushi">Sushi</button><button type="button" data-recipe-query="Ramen">Ramen</button><button type="button" data-recipe-query="Pad Thai">Pad Thai</button></div>'+ 
      '<p class="recipe-online-notice">Unsere Kochideen funktionieren ohne Internet. Erst wenn du die Online-Suche startest, wird dein Suchbegriff an <a href="https://www.themealdb.com" target="_blank" rel="noopener noreferrer">TheMealDB</a> übertragen (kostenlose Entwicklungsanbindung).</p></div>'+ 
      '<section id="recipe-detail-panel" class="recipe-detail-panel" hidden tabindex="-1"></section>'+ 
      '<section id="recipe-online-section" class="recipe-online-section" hidden><div class="recipe-section-heading"><h3>Rezepte aus dem Internet</h3><p id="recipe-online-status" role="status" aria-live="polite"></p></div><div id="recipe-online-results" class="recipe-online-grid"></div><small>Rezeptdaten und Bilder: <a href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer">TheMealDB</a> · Originalrezept vor dem Nachkochen prüfen.</small></section>'+ 
      '<section class="recipe-local-section"><div class="recipe-section-heading"><div><span class="retail-label">SCHNELL & INSPIRIEREND</span><h3>Mehr Rezepte für deinen Asia-Abend</h3></div><small id="recipe-local-count"></small></div><div id="recipe-local-grid" class="recipe-local-grid"></div><button id="recipe-more-local" class="recipe-more-local" type="button">Weitere Rezepte entdecken ↓</button></section>';
    $(".idea-top").insertAdjacentElement("afterend",section);
    renderLocal();
    $("#recipe-idea-query").addEventListener("input",()=>{state.showAll=false;renderLocal();});
    $("#recipe-search-form").addEventListener("submit",e=>{e.preventDefault();const q=$("#recipe-idea-query").value;renderLocal();searchOnline(q);});
    section.addEventListener("click",e=>{
      const query=e.target.closest("[data-recipe-query]");
      if(query){$("#recipe-idea-query").value=query.dataset.recipeQuery;state.showAll=false;renderLocal();searchOnline(query.dataset.recipeQuery);return;}
      const more=e.target.closest("#recipe-more-local");if(more){state.showAll=true;renderLocal();return;}
      const local=e.target.closest("[data-recipe-local]");
      if(local){const idea=ideas.find(x=>x.id===local.dataset.recipeLocal);if(idea)showDetail(idea.name,idea.area,idea.ingredients,idea.steps,{localId:idea.id});return;}
      const online=e.target.closest("[data-recipe-online]");if(online){showRemoteRecipe(online.dataset.recipeOnline);return;}
      if(e.target.closest("[data-recipe-close]")){$("#recipe-detail-panel").hidden=true;return;}
      const add=e.target.closest("[data-recipe-shop]");
      if(add){const idea=ideas.find(x=>x.id===add.dataset.recipeShop);
        if(idea)importToScanner(idea.ingredients);
        else if(state.selectedOnline&&state.selectedOnline.id===add.dataset.recipeShop)importToScanner(state.selectedOnline.cartIngredients);
      }
    });
  }
  document.addEventListener("DOMContentLoaded",mount);
  window.ASIA_RECIPE_DISCOVERY={ideas,localMatches,searchAliases};
})();
