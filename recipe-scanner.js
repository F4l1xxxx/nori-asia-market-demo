/* ASIA MART — local-only recipe screenshot recognition and basket planning.
   Demo products only; no image upload, external AI service, or purchase. */
(()=>{
  "use strict";
  const api=window.NORI_DEMO;
  if(!api||!Array.isArray(api.products))return;
  const $=s=>document.querySelector(s);
  const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm=s=>String(s??"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").toLocaleLowerCase("de").replace(/[^a-z0-9]+/g," ").trim();
  const money=n=>api.formatMoney(Number(n)||0);
  const item=name=>api.products.find(p=>norm(p.name)===norm(name));
  const state={rows:[],busy:false,preview:null,source:"",raw:"",imported:new Set(),expandedVariants:new Set(),scanToken:0,activeWorker:null};
  const patternData=[
    ["Sushireis Rundkorn",/\b(sushi ?reis|sushireis|sushi rice)\b/,"high"],
    ["Klebreis für Mango Sticky Rice",/\b(klebreis|sticky rice|glutinous rice)\b/,"high"],
    ["Reispapier Rund",/\b(reispapier|rice paper|sommerrollen ?papier)\b/,"high"],
    ["Reisnudeln 3 mm",/\b(reis ?nudeln?|rice noodles?)\b/,"high"],
    ["Pad Thai Reisbandnudeln",/\b(pad thai ?(reisband)?nudeln?|pad thai rice noodles?)\b/,"high"],
    ["Vermicelli Reisfäden",/\b(reisfaden|rice vermicelli|bun nudeln?)\b/,"high"],
    ["Vermicelli Reisfäden",/^(vermicelli)$/,"possible"],
    ["Pho Reisbandnudeln",/\b(pho ?(reis)?nudeln?|pho rice noodles?)\b/,"high"],
    ["Glasnudeln Mungbohne",/\b(glas ?nudeln?|glass noodles?)\b/,"high"],
    ["Ramen Weizennudeln",/\b(ramen|rahmen)(?: ?(?:weizen)?nudeln?| ?noodles?)?\b/,"high"],
    ["Udon Nudeln Sanuki",/\b(udon)\b/,"high"],
    ["Soba Buchweizennudeln",/\b(soba|buchweizennudeln?)\b/,"high"],
    ["Jasminreis Premium",/\b(jasmin ?reis|jasmine rice|duft ?reis)\b/,"high"],
    ["Jasminreis Premium",/^(reis|rice)$/, "possible"],
    ["Nori Algenblätter",/\b(nori|sushi ?algen|algen ?blatter|seaweed sheets?)\b/,"high"],
    ["Wakame Algen Getrocknet",/\b(wakame)\b/,"high"],
    ["Kokoscreme Extra",/\b(kokos ?creme|coconut cream)\b/,"high"],
    ["Kokosmilch Cremig",/\b(kokos ?milch|coconut milk)\b/,"high"],
    ["Sojasauce Dunkel",/\b(dunkle? soja ?sauce|dark soy sauce)\b/,"high"],
    ["Tamari Sauce",/\b(tamari(?: sauce)?)\b/,"high"],
    ["Sojasauce Mild",/\b(soja ?sauce|soja ?sosse|soja ?soße|sojasobe|soy sauce|shoyu)\b/,"high"],
    ["Sriracha Chili Sauce",/\b(sriracha|siracha)\b/,"high"],
    ["Chili Sauce Sweet",/\b(sweet chili|suss ?scharfe? chili|sweet chilli)\b/,"high"],
    ["Sambal Oelek",/\b(sambal)\b/,"high"],
    ["Gochujang Chilipaste",/\b(gochujang)\b/,"high"],
    ["Chili Crisp Knusperöl",/\b(chili crisp|chili ?ol|chilli oil|knusper ?ol)\b/,"high"],
    ["Rote Currypaste",/\b(rote? curry ?paste|red curry paste)\b/,"high"],
    ["Grüne Currypaste",/\b(grune? curry ?paste|green curry paste)\b/,"high"],
    ["Gelbe Currypaste",/\b(gelbe? curry ?paste|yellow curry paste)\b/,"high"],
    ["Panang Currypaste",/\b(panang curry|panang paste)\b/,"high"],
    ["Rote Currypaste",/\b(curry ?paste|curry paste)\b/,"possible"],
    ["Miso Paste Weiß",/\b(miso ?paste|white miso|shiro miso|miso)\b/,"high"],
    ["Fischsauce",/\b(fisch ?sauce|fish sauce|nam pla)\b/,"high"],
    ["Austernsauce",/\b(austern ?sauce|oyster sauce)\b/,"high"],
    ["Hoisin Sauce",/\b(hoisin)\b/,"high"],
    ["Teriyaki Sauce",/\b(teriyaki)\b/,"high"],
    ["Sesamöl Geröstet",/\b(sesam ?ol|sesame oil)\b/,"high"],
    ["Sesam Schwarz",/\b(schwarzer? sesam|black sesame)\b/,"high"],
    ["Reisessig Mild",/\b(reis ?essig|rice vinegar)\b/,"high"],
    ["Mirin Würzsauce",/\b(mirin)\b/,"high"],
    ["Tamarindenpaste",/\b(tamarinden ?paste|tamarind paste)\b/,"high"],
    ["Palmzucker Geraspelt",/\b(palm ?zucker|palm sugar)\b/,"high"],
    ["Panko Semmelbrösel",/\b(panko)\b/,"high"],
    ["Tempura Mehl Mix",/\b(tempura ?mehl|tempura flour)\b/,"high"],
    ["Tapiokaperlen Schwarz",/\b(tapioka ?perlen|tapioca pearls|boba pearls)\b/,"possible"],
    ["Dashi Brühe Basis",/\b(dashi)\b/,"high"],
    ["Bambussprossen Streifen",/\b(bambus ?sprossen|bamboo shoots?)\b/,"high"],
    ["Wasserkastanien Scheiben",/\b(wasser ?kastanien|water chestnuts?)\b/,"high"],
    ["Getrocknete Shiitake",/\b(getrocknete? shiitake|dried shiitake)\b/,"high"],
    ["Getrocknete Shiitake",/\b(shiitake)\b/,"possible"],
    ["Edamame Geschält",/\b(edamame)\b/,"high"],
    ["Matcha Tee Everyday",/\b(matcha ?pulver|matcha powder|matcha)\b/,"possible"],
    ["Ingwer Knoblauch Paste",/\b(ingwer ?knoblauch ?paste|ginger garlic paste)\b/,"high"],
    // Ginger-garlic paste must never substitute fresh ginger or garlic silently.
    ["Mango Püree",/\b(mango ?puree|mango puree)\b/,"high"]
  ];
  // A fresh tomato is not the same as a tomato sauce; only explicit aliases may auto-match.
  function matchIngredient(name){
    const text=norm(name);
    const direct=api.products.find(p=>norm(p.name)===text);
    if(direct)return {product:direct,confidence:"high"};
    const result=patternData.find(([,re])=>re.test(text));
    const preferred=result&&item(result[0]);
    // If a preferred brand is removed from the catalogue, use a different
    // stocked brand only when it is the very same ingredient variety.
    const p=preferred||(result&&sameVarietyProducts(name,result[0])[0]);
    return p?{product:p,confidence:result[2]}:{product:null,confidence:"missing"};
  }
  // Families make brands discoverable without treating different recipes or
  // incompatible product types as interchangeable.
  const variantFamilies=[
    {ingredient:/\b(soja ?sauce|soja ?sosse|sojasobe|soy sauce|shoyu|tamari)\b/,product:/\b(soja ?sauce|tamari(?: sauce)?|shoyu sauce)\b/,kind:p=>/\b(dunkel|dark)\b/.test(norm(p.name))?"dunkel":/\btamari\b/.test(norm(p.name))?"tamari":"mild"},
    {ingredient:/\b(kokos ?milch|coconut milk)\b/,product:/\b(kokos ?milch|coconut milk)\b/},
    {ingredient:/\b(sushi ?reis|sushireis|sushi rice)\b/,product:/\b(sushi ?reis|sushireis|sushi rice)\b/},
    {ingredient:/\b(reis ?nudeln?|rice noodles?)\b/,product:/\b(reis ?nudeln?|rice noodles?)\b/,kind:p=>/\b3 mm\b/.test(norm(p.name))?"3mm":/\b5 mm\b/.test(norm(p.name))?"5mm":"andere"},
    {ingredient:/\b(ramen|rahmen)\b/,product:/\b(ramen ?weizennudeln|ramen ?nudeln)\b/},
    {ingredient:/\b(vermicelli|reisfaden|rice vermicelli|bun nudeln?)\b/,product:/\b(vermicelli reisfaden|bun reisnudeln)\b/},
    {ingredient:/\b(pho ?(reis)?nudeln?|pho rice noodles?)\b/,product:/\bpho reisbandnudeln\b/},
    {ingredient:/\b(nori|sushi ?algen)\b/,product:/\b(nori|sushi ?algen)\b/},
    {ingredient:/\b(reis ?essig|rice vinegar)\b/,product:/\b(reis ?essig|rice vinegar)\b/},
    {ingredient:/\b(sesam ?ol|sesame oil)\b/,product:/\b(sesam ?ol|sesame oil)\b/,kind:p=>/\b(gerostet|toasted|roasted)\b/.test(norm(p.name))?"geroestet":"natur"}
  ];
  function sameVarietyProducts(label,productName){
    const family=variantFamilies.find(f=>f.ingredient.test(norm(label))&&f.product.test(norm(productName)));
    if(!family)return [];
    const reference={name:productName};
    const kind=family.kind?.(reference);
    return api.products.filter(p=>family.product.test(norm(p.name))&&(!family.kind||family.kind(p)===kind));
  }
  function alternativesFor(row){
    if(!row.product)return [];
    const family=variantFamilies.find(f=>f.ingredient.test(norm(row.label))&&f.product.test(norm(row.product.name)));
    if(!family)return [{product:row.product,sameType:true}];
    const selectedType=family.kind?.(row.product);
    const others=api.products.filter(p=>p.id!==row.product.id&&family.product.test(norm(p.name))&&(!family.kind||family.kind(p)===selectedType)).map(p=>({
      product:p,sameType:true
    }));
    others.sort((a,b)=>Number((b.product.demoStock??99)>0)-Number((a.product.demoStock??99)>0)||Number(a.product.price)-Number(b.product.price));
    return [{product:row.product,sameType:true},...others];
  }
  function number(s){
    if(!s)return null;
    const x=String(s).trim();
    if(x==="½")return .5;if(x==="¼")return .25;if(x==="¾")return .75;
    if(/^\d+\s*\/\s*\d+$/.test(x)){const [a,b]=x.split("/").map(Number);return b?a/b:null;}
    const v=Number(x.replace(",","."));return Number.isFinite(v)?v:null;
  }
  const unitRx="kg|g|gr|gramm|ml|l|liter|el|tl|tbsp|tsp|stuck|stueck|stucke|dose|dosen|bund|packung|packungen|zehe|zehen|prise|prisen";
  const bareIngredients=/^(salz|zucker|pfeffer|wasser|wasabi ?paste|wasabipaste|lachsfilet|tofu|gurke|karotte|mohre|zwiebel|fruhlingszwiebel|knoblauch|ingwer|koriander|limette|zitrone|chili|ei|eier|honig|mehl|ol|butter|sesam|reisessig|sojasosse|sojasobe|sojasauce)(?: \(.*\))?$/;
  const uiAndRecipeText=/\b(zubereitung|anleitung|schritt|rezeptwelt|entdecken|zubereitungszeit|kochzeit|vorbereitung|in den warenkorb|online bestellen|jetzt kaufen|schwierigkeitsgrad|bewertungen|registrieren|newsletter|zutatenliste anzeigen|mehr anzeigen|das rezept|zum rezept|die zutaten|die zubereitung|nach belieben)\b/;
  const cookingInstructions=/\b(waschen|wasche|schneiden|schneide|braten|braten lassen|kochen|kocheln|erhitzen|vermischen|umruhren|abkuhlen|zugeben|hinzufugen|bestreuen|servieren|abschmecken|aufkochen|quellen lassen|tupfen|formen|verteilen|topf|pfanne|herdplatte)\b/;
  function parseLine(source){
    let line=String(source||"").trim().replace(/^[\s•●▪◦*✓☑☐\-–—]+/,"").replace(/^\d+[.)]\s+(?=\D)/,"").replace(/^zutaten?\s*:\s*/i,"").trim();
    // Tesseract may confuse the lowercase "l" in "ml" with "i" or "1".
    // Only repair the unit directly after a numeric quantity, never ingredient names.
    line=line.replace(/^(\d+(?:[.,]\d+)?)\s*m[i1]\b/i,"$1 ml").replace(/^(\d+(?:[.,]\d+)?)\s*m[l1i]_+\s*/i,"$1 ml ");
    const normalizedLine=norm(line);
    if(!line||line.length>95||uiAndRecipeText.test(normalizedLine)||cookingInstructions.test(normalizedLine)||/^(zutat|ingredient|portion|fur \d+|for \d+|personen|instruction|prep |cook |zeit:|serves|stuck|stueck|stucke)/i.test(normalizedLine))return null;
    let q=null,u="",label=line;
    const m=line.match(new RegExp("^(\\d+(?:[.,]\\d+)?|\\d+\\s*\\/\\s*\\d+|½|¼|¾)\\s*("+unitRx+")?\\b\\s*(.*)$","i"));
    if(m&&m[3]&&/[a-zA-ZäöüÄÖÜ]/.test(m[3])){q=number(m[1]);u=(m[2]||"").toLowerCase();label=m[3].trim();}
    else{
      const tail=line.match(new RegExp("^(.+?)\\s+(\\d+(?:[.,]\\d+)?|\\d+\\/\\d+)\\s*("+unitRx+")$","i"));
      if(tail){q=number(tail[2]);u=tail[3].toLowerCase();label=tail[1].trim();}
    }
    label=label.replace(/^[_:;.,\s]+|[_:;.,\s]+$/g,"").trim();
    if(!/[a-zäöü]/i.test(label)||(q==null&&/^\d/.test(label))||/[.!?;]/.test(label)||norm(label).split(" ").length>7)return null;
    const found=matchIngredient(label);
    if(!found.product&&q!=null&&norm(label).split(" ").length>5)return null;
    // Bare words from an entire webpage are usually navigation or adverts, not ingredients.
    if(!found.product&&q==null&&!bareIngredients.test(norm(label)))return null;
    return {source:line,label,q,unit:u,product:found.product,confidence:found.confidence,baseConfidence:found.confidence,added:false,addedCount:0};
  }
  // OCR's plain-text reading order interleaves the left preparation column with
  // the right ingredient column. TSV word coordinates let us isolate that panel.
  function extractIngredientsFromLayout(data){
    const lines=String(data?.tsv||"").trim().split(/\r?\n/);
    if(lines.length<2)return {focused:false,text:"",reason:"Keine Positionsdaten der Texterkennung"};
    const words=lines.slice(1).map(line=>{
      const c=line.split("\t");
      if(c.length<12||c[0]!=="5")return null;
      return {key:c.slice(1,5).join("/"),left:Number(c[6]),top:Number(c[7]),width:Number(c[8]),height:Number(c[9]),text:c.slice(11).join("\t").trim()};
    }).filter(w=>w&&w.text&&Number.isFinite(w.left)&&Number.isFinite(w.top));
    const headers=words.filter(w=>/^(zutaten|ingredients)$/i.test(norm(w.text)));
    const candidates=[];
    for(const h of headers){
      const left=Math.max(0,h.left-24),from=h.top+h.height+12;
      const selected=words.filter(w=>w.left>=left&&w.top>=from);
      const groups=new Map();
      for(const w of selected){
        if(!groups.has(w.key))groups.set(w.key,[]);
        groups.get(w.key).push(w);
      }
      const ordered=[...groups.values()].sort((a,b)=>Math.min(...a.map(w=>w.top))-Math.min(...b.map(w=>w.top)));
      const ingredients=[];
      for(const lineWords of ordered){
        const row=lineWords.sort((a,b)=>a.left-b.left).map(w=>w.text).join(" ").trim();
        const normalized=norm(row);
        if(/\b(zutaten online bestellen|zutaten bestellen|zum warenkorb|jetzt bestellen|zum rezept)\b/.test(normalized))break;
        if(parseLine(row))ingredients.push(row);
      }
      candidates.push({text:ingredients.join("\n"),focused:ingredients.length>0,count:ingredients.length,headerLeft:h.left});
    }
    candidates.sort((a,b)=>b.count-a.count||b.headerLeft-a.headerLeft);
    return candidates[0]?.focused?candidates[0]:{focused:false,text:"",reason:"Keine eindeutige Zutaten-Spalte erkannt"};
  }
  function packInfo(p){
    const m=String(p.size||"").match(/(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l)\b/i);
    if(!m)return null;
    const num=number(m[1]);return {value:(m[2]==="kg"||m[2]==="l")?num*1000:num,unit:/^(kg|g)$/i.test(m[2])?"g":"ml"};
  }
  function calculate(row){
    const cap=packInfo(row.product||{}),unit=norm(row.unit),n=row.q;
    let count=1,precision="estimate";
    if(n!=null&&n>0&&cap&&["g","gr","gramm","kg","ml","l","liter"].includes(unit)){
      const kind=["g","gr","gramm","kg"].includes(unit)?"g":"ml";
      if(kind===cap.unit){count=Math.ceil(n*(unit==="kg"||unit==="l"||unit==="liter"?1000:1)/cap.value);precision="calculated";}
    }else if(n!=null&&n>0&&["dose","dosen","packung","packungen"].includes(unit)){
      count=Math.ceil(n);precision="unit";
    }
    const stock=row.product?.demoStock??99;
    return {count:Math.min(99,Math.max(1,count)),precision,available:stock>0&&count<=stock,stock};
  }
  function preferAvailableEquivalent(row){
    if(!row.product||calculate(row).available)return row;
    // Change brands or pack sizes, but never flavor, ingredient variety, or
    // prepared-vs-raw product type. Anything else stays out of the shop list.
    const replacement=alternativesFor(row).slice(1).find(v=>v.sameType&&calculate({...row,product:v.product}).available);
    return replacement?{...row,product:replacement.product}:row;
  }
  function analyzeText(input){
    const lines=String(input||"").slice(0,5000).split(/\r?\n/);
    const out=[];
    for(const line of lines){
      if(/^(zubereitung|anleitung|instructions|schritte|method)\b/i.test(norm(line)))break;
      const row=parseLine(line);if(row){const available=preferAvailableEquivalent(row);out.push({...available,...calculate(available)});}
      if(out.length>=30)break;
    }
    return out;
  }
  function setNotice(message,type="info"){
    const el=$("#rs-notice");if(!el)return;
    el.textContent=message;el.dataset.type=type;
  }
  function setBusy(busy,label=""){
    state.busy=busy;
    $("#rs-file").disabled=busy;
    $("#rs-manual").disabled=busy;
    $("#rs-demo").disabled=busy;
    $("#rs-drop").classList.toggle("is-busy",busy);
    $("#rs-progress-wrap").hidden=!busy;
    if(label)setNotice(label);
  }
  function setProgress(value,label){
    const n=Math.max(0,Math.min(100,Math.round(value)));
    $("#rs-progress").style.width=n+"%";
    $("#rs-progress").setAttribute("aria-valuenow",String(n));
    if(label)$("#rs-progress-label").textContent=label;
  }
  function clearUploadedImage(){
    // Invalidate an in-progress OCR run: it must not write its old results back.
    state.scanToken++;
    if(state.activeWorker)state.activeWorker.terminate().catch(()=>{});
    state.activeWorker=null;
    if(state.preview)URL.revokeObjectURL(state.preview);
    state.preview=null;state.raw="";state.rows=[];state.source="";
    state.expandedVariants.clear();
    $("#rs-file").value="";
    $("#rs-preview").removeAttribute("src");
    $("#rs-upload-preview").hidden=true;
    $("#rs-file-name").textContent="";
    $("#rs-text").value="";
    renderRows();setBusy(false);
    setNotice("Bild und erkannte Zutaten entfernt. Bereits übernommene Warenkorbartikel bleiben erhalten; du kannst sie dort ändern.","info");
  }
  function applyRows(rows){
    let added=0,packages=0;
    for(const row of rows){
      if(!row.product||row.added||!row.available)continue;
      const prev=api.cartContents()[row.product.id]||0;
      const canAdd=Math.min(row.count,Math.max(0,(row.stock||99)-prev),99-prev);
      if(canAdd<=0)continue;
      api.addToCart(row.product.id,canAdd);
      row.added=true;row.addedCount=(row.addedCount||0)+canAdd;added++;packages+=canAdd;
    }
    return {added,packages};
  }
  function describeAmount(row){
    return row.q!=null?String(row.q).replace(".",",")+(row.unit?" "+row.unit:""):"Menge nicht genannt";
  }
  function renderVariants(row,index){
    const all=alternativesFor(row).filter(v=>calculate({...row,product:v.product}).available);
    if(all.length<=1)return "";
    // Only identical ingredient varieties; keep the choice quick and calm.
    const visible=all.slice(0,3);
    const extra=all.slice(1).filter(v=>!visible.includes(v));
    const expanded=state.expandedVariants.has(index);
    const option=v=>{
      const p=v.product,plan=calculate({...row,product:p});
      const selected=p.id===row.product.id;
      const unavailable=!plan.available;
      const disabled=unavailable||(row.added&&!row.addedCount);
      return '<label class="rs-variant-option'+(selected?' selected':'')+'">'+
        '<input type="radio" name="rs-product-'+index+'" data-rs-pick="'+index+'" value="'+safe(p.id)+'"'+(selected?' checked':'')+(disabled?' disabled':'')+'>'+
        '<span class="rs-variant-info"><strong>'+safe(p.name)+'</strong><small>'+safe(p.brand?String(p.brand)+' · ':'')+safe(p.size)+' · '+plan.count+' Packung'+(plan.count===1?'':'en')+'</small></span>'+
        '<strong class="rs-variant-price">'+money(Number(p.price)*plan.count)+'</strong></label>';
    };
    return '<fieldset class="rs-variants"><legend>Produkt auswählen</legend>'+visible.map(option).join('')+
      (extra.length?'<div id="rs-extra-'+index+'" class="rs-extra-variants"'+(expanded?'':' hidden')+'>'+extra.map(option).join('')+'</div>'+
       '<button class="rs-more-variants" data-rs-more="'+index+'" aria-controls="rs-extra-'+index+'" aria-expanded="'+expanded+'" type="button">'+(expanded?'Weniger anzeigen ↑':'Weitere Produkte ('+extra.length+') ↓')+'</button>':'')+
      '</fieldset>';
  }
  function renderRows(){
    const slot=$("#rs-results");if(!slot)return;
    if(!state.rows.length){slot.hidden=true;return;}
    const availableRows=state.rows.map((row,index)=>({row,index})).filter(({row})=>row.product&&row.available);
    slot.hidden=false;
    const added=availableRows.filter(({row})=>row.added).length;
    const possible=availableRows.filter(({row})=>row.confidence!=="high").length;
    const omitted=state.rows.length-availableRows.length;
    $("#rs-summary").textContent=availableRows.length+" verfügbare Shopartikel · "+added+" im Warenkorb";
    $("#rs-review-list").innerHTML=availableRows.length?availableRows.map(({row:r,index:i})=>{
      const caution=r.confidence==="possible"?"Ähnlicher Artikel – bitte prüfen":"Passender Artikel";
      const quantity=r.precision==="calculated"?"Packungsgröße berechnet":"1 Packung geschätzt bzw. Stückangabe";
      const stockWarning=!r.available?' · Nicht ausreichend Demo-Bestand':'';
      return '<article class="rs-result'+(r.confidence==="possible"?" possible":"")+(r.added?" added":"")+'" data-rs-index="'+i+'">'+
      '<div class="rs-result-icon" aria-hidden="true">'+safe(r.product.emoji)+'</div><div class="rs-result-main"><strong>'+safe(r.label)+'</strong><small>'+safe(r.product.name)+' · '+safe(r.product.size)+'</small><small>'+safe(describeAmount(r))+' → <b>'+r.count+' × '+safe(r.product.size)+'</b> · '+safe(quantity)+safe(stockWarning)+'</small>'+renderVariants(r,i)+'</div>'+
      '<div class="rs-result-end"><strong>'+money(r.product.price*r.count)+'</strong>'+
      (r.added?'<span class="rs-added">✓ Im Warenkorb</span>':'<label class="rs-select"><input type="checkbox" data-rs-choose="'+i+'" '+((r.confidence==="high"||r.userSelected)&&r.available?'checked':'')+(r.available?'':' disabled')+'> '+safe(caution)+'</label>')+'</div></article>';
    }).join(""):'<p class="rs-empty">Zu diesem Rezept haben wir gerade keine passenden Shopartikel. Es werden keine unpassenden Ersatzprodukte vorgeschlagen.</p>';
    $("#rs-add").disabled=!availableRows.some(({row})=>!row.added);
    $("#rs-summary-note").textContent=(possible?possible+" Treffer bitte vor dem Hinzufügen prüfen. ":"")+(omitted?"Nicht angebotene Zutaten werden ausgeblendet. Bitte das Originalrezept für die vollständige Einkaufsliste prüfen.":"Mengen und Zutaten vor einer echten Bestellung immer prüfen.");
  }
  function chooseVariant(index,id){
    const row=state.rows[index];if(!row||!row.product)return;
    const choice=alternativesFor(row).find(v=>String(v.product.id)===String(id));
    if(!choice||choice.product.id===row.product.id)return;
    const plan=calculate({...row,product:choice.product});
    const existing=api.cartContents()[choice.product.id]||0;
    if(!plan.available||existing+plan.count>plan.stock){setNotice("Diese Variante ist in der benötigten Menge nicht verfügbar.","warn");renderRows();return;}
    if(row.added&&!row.addedCount){setNotice("Bitte bereits übernommene Produkte im Warenkorb ändern.","warn");renderRows();return;}
    if(row.added){
      api.addToCart(row.product.id,-row.addedCount);
      api.addToCart(choice.product.id,plan.count);
      row.addedCount=plan.count;
    }
    row.product=choice.product;
    row.confidence=row.baseConfidence;
    row.userSelected=true;
    Object.assign(row,plan);
    renderRows();
    setNotice(row.added?"Produkt im Warenkorb durch deine Auswahl ersetzt.":"Gleichwertige Produktvariante ausgewählt.","success");
  }
  function runAnalysis(text,fromImage=false,allowAuto=true){
    const previousText=state.raw,previousRows=state.rows;
    state.raw=String(text||"");
    state.expandedVariants.clear();
    $("#rs-text").value=state.raw;
    // Re-checking an unchanged list must not reset a deliberately chosen brand.
    state.rows=previousText===state.raw&&previousRows.length?previousRows:analyzeText(state.raw);
    if(!state.rows.length){renderRows();setNotice("Keine Zutaten erkannt. Prüfe das Bild oder füge die Zutaten als Text ein.","warn");return;}
    const fingerprint=norm(state.raw);
    const alreadyImported=state.imported.has(fingerprint);
    if(alreadyImported){state.rows.filter(r=>r.product&&r.confidence==="high"&&r.available).forEach(r=>r.added=true)}
    const auto=allowAuto&&$("#rs-autofill").checked;
    const done=auto&&!alreadyImported?applyRows(state.rows.filter(r=>r.confidence==="high")): {added:0,packages:0};
    if(done.added)state.imported.add(fingerprint);
    renderRows();
    const message=alreadyImported?"Diese Zutatenliste wurde bereits übernommen. Für Änderungen kannst du den Warenkorb öffnen.":done.added?"✓ "+done.added+" eindeutige Zutaten ("+done.packages+" Packungen) direkt in deinen Demo-Warenkorb gelegt. Weitere Treffer kannst du unten prüfen.":"Zutaten erkannt. Prüfe die Vorschläge und übernimm sie bei Bedarf.";
    setNotice(message,done.added||alreadyImported?"success":"info");
    $("#rs-results").scrollIntoView({block:"start",behavior:fromImage?"smooth":"auto"});
  }
  function loadRuntime(){
    if(window.Tesseract)return Promise.resolve(window.Tesseract);
    if(window.__rsOCRPromise)return window.__rsOCRPromise;
    window.__rsOCRPromise=new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src=new URL("./assets/ocr/tesseract.min.js",location.href).href;
      script.onload=()=>window.Tesseract?resolve(window.Tesseract):reject(new Error("OCR-Bibliothek nicht geladen"));
      script.onerror=()=>reject(new Error("OCR konnte nicht geladen werden"));
      document.head.append(script);
    }).catch(err=>{window.__rsOCRPromise=null;throw err});
    return window.__rsOCRPromise;
  }
  async function processFile(file){
    if(state.busy||!file)return;
    if(!/^image\/(png|jpeg|webp|bmp)$/i.test(file.type)||file.size>10*1024*1024){setNotice("Bitte ein PNG-, JPG-, WEBP- oder BMP-Bild mit maximal 10 MB wählen.","warn");return;}
    const token=++state.scanToken;
    if(state.preview)URL.revokeObjectURL(state.preview);
    state.preview=URL.createObjectURL(file);
    const preview=$("#rs-preview");preview.src=state.preview;preview.hidden=false;
    $("#rs-upload-preview").hidden=false;
    $("#rs-file-name").textContent=file.name+" · "+(file.size/1024/1024).toFixed(1).replace(".",",")+" MB";
    setBusy(true,"Screenshot wird im Browser gelesen – keine Bildübertragung an einen Server.");
    setProgress(3,"Bilderkennung wird vorbereitet …");
    let worker=null;
    try{
      const T=await loadRuntime();
      const root=new URL("./",location.href);
      worker=await T.createWorker(["deu","eng"],1,{
        workerPath:new URL("assets/ocr/worker.min.js",root).href,
        langPath:new URL("assets/ocr/lang",root).href,
        corePath:new URL("assets/ocr/core",root).href,
        workerBlobURL:false,
        logger:m=>{
          const p=Number(m.progress||0);
          const stage=/recognizing/i.test(m.status)?"Zutaten werden erkannt …":"Sprachmodell wird geladen …";
          setProgress(Math.max(5,Math.min(95,p*90)),stage);
        }
      });
      if(token!==state.scanToken)return;
      state.activeWorker=worker;
      setProgress(55,"Text wird aus dem Screenshot gelesen …");
      const data=await worker.recognize(file,{}, {text:true,tsv:true});
      if(token!==state.scanToken)return;
      setProgress(100,"Texterkennung abgeschlossen");
      const focused=extractIngredientsFromLayout(data?.data);
      if(focused.focused){
        runAnalysis(focused.text,true);
        setNotice(focused.count+" Zutatenzeilen gezielt aus dem Zutatenbereich erkannt. Bitte Mengen und Artikel prüfen.","success");
      }else{
        const original=data?.data?.text?.trim()||"";
        $("#rs-text").value=original;
        state.raw=original;state.rows=[];renderRows();
        setNotice("Zutatenbereich nicht sicher gefunden. Bitte Screenshot auf die Zutatenliste zuschneiden oder nur die Zutaten rechts ins Textfeld kopieren. Es wurde nichts in den Warenkorb gelegt.","warn");
      }
    }catch(err){
      if(token===state.scanToken)setNotice("Die automatische Bilderkennung hat hier nicht funktioniert. Du kannst die Zutaten unten als Text einfügen. ("+String(err.message||err).slice(0,110)+")","warn");
    }finally{
      if(worker)await worker.terminate().catch(()=>{});
      if(state.activeWorker===worker)state.activeWorker=null;
      if(token===state.scanToken)setBusy(false);
    }
  }
  function scannerView(){
    $("#home-main").hidden=true;
    const root=$("#route-root");root.hidden=false;
    document.title="Rezept-Scanner & Einkaufsliste | ASIA MART Demo";
    root.innerHTML=`<div class="layout route-inner rs-page">
      <nav class="breadcrumbs"><a href="./">Startseite</a><span>›</span><a href="?seite=kochideen">Kochideen</a><span>›</span><strong>Rezept-Scanner</strong></nav>
      <section class="rs-hero"><div><span class="demo-label">NEU · REZEPT ZU WARENKORB · LOKALE DEMO</span><h1>Du hast das Rezept.<br><em>Wir finden die Zutaten.</em></h1><p>Screenshot hineinziehen, Zutaten erkennen lassen und passende Packungsgrößen direkt im Warenkorb finden. Ohne langes Suchen.</p><div class="rs-steps"><span><b>01</b> Screenshot</span><span><b>02</b> Mengenabgleich</span><span><b>03</b> Warenkorb</span></div></div><div class="rs-hero-art" aria-hidden="true"><span>📷</span><i>→</i><span>🥥</span><i>+</i><span>🍜</span><i>→</i><span>🛒</span></div></section>
      <section class="rs-workspace"><div class="rs-left"><div class="rs-subhead"><span>01 / DEIN REZEPT</span><h2>Screenshot hochladen</h2></div>
        <div id="rs-drop" class="rs-drop" tabindex="0" role="button" aria-label="Rezeptbild auswählen oder hier ablegen"><span class="rs-drop-illustration">📸</span><strong>Bild hier ablegen</strong><p>oder klicke, um einen Screenshot auszuwählen</p><small>PNG, JPG, WEBP oder BMP · bis 10 MB · auch per Strg + V</small><input id="rs-file" type="file" accept="image/png,image/jpeg,image/webp,image/bmp" hidden></div>
        <div id="rs-upload-preview" class="rs-upload-preview" hidden><img id="rs-preview" class="rs-preview" alt="Vorschau deines Rezept-Screenshots" hidden><div class="rs-upload-info"><p id="rs-file-name" class="rs-file-name"></p><button id="rs-remove-preview" class="rs-remove-preview" type="button" aria-label="Hochgeladenes Rezeptbild entfernen">✕ Bild entfernen</button></div></div>
        <label class="rs-autofill"><input id="rs-autofill" type="checkbox" checked><span><strong>Eindeutige Zutaten direkt übernehmen</strong><small>Bei unsicheren Treffern wird erst gefragt. Keine Bestellung wird ausgelöst.</small></span></label>
        <div id="rs-progress-wrap" class="rs-progress-wrap" hidden><div class="rs-progress-track"><div id="rs-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div></div><small id="rs-progress-label" aria-live="polite">Erkennung wird gestartet …</small></div>
      </div><div class="rs-right"><div class="rs-subhead"><span>ALTERNATIVE / KORRIGIEREN</span><h2>Zutaten als Text</h2></div><p>Falls ein Screenshot schlecht lesbar ist, kannst du den erkannten Text korrigieren oder Zutaten direkt einfügen – eine pro Zeile.</p><textarea id="rs-text" rows="9" placeholder="800 ml Kokosmilch&#10;250 g Reisnudeln&#10;2 EL Sojasauce&#10;1 Zwiebel" aria-label="Zutatenliste als Text"></textarea><div class="rs-button-row"><button id="rs-manual" class="market-button" type="button">Zutaten abgleichen ↗</button><button id="rs-demo" class="rs-ghost" type="button">Beispiel ausprobieren</button></div><p class="rs-privacy">🔒 Die Bildanalyse läuft auf deinem Gerät. Screenshot und Zutaten werden nicht hochgeladen oder gespeichert.</p></div></section>
      <p id="rs-notice" class="rs-notice" role="status" aria-live="polite">Bereit für dein Rezept. Nur passende Demoartikel können übernommen werden.</p>
      <section id="rs-results" class="rs-results" hidden><div class="rs-results-top"><div><span class="retail-label">02 / DEINE EINKAUFSLISTE</span><h2>Aus Rezept wird <em>Einkauf.</em></h2><p id="rs-summary"></p></div><button id="rs-cart" class="rs-cart-link" type="button">🛒 Warenkorb öffnen ↗</button></div><div id="rs-review-list" class="rs-review-list"></div><div class="rs-results-footer"><p id="rs-summary-note"></p><button id="rs-add" class="market-button" type="button">Ausgewählte Vorschläge hinzufügen ↗</button></div><p class="rs-disclaimer">Demovorschläge: Mengen werden auf vollständige Verkaufspackungen aufgerundet. Bei EL/TL, fehlenden Angaben oder Alternativprodukten ist die Menge nur geschätzt. Bitte Allergene und tatsächliche Zutaten prüfen.</p></section>
      <section class="rs-more"><div><span class="retail-label">NEUE REZEPTE, NEUE IDEEN</span><h2>Keine Zutatenliste zur Hand?</h2><p>Unsere drei fertigen Einkaufslisten helfen dir bei Sushi, Ramen und Thai-Curry.</p></div><a class="market-button" href="?seite=kochideen">Kochideen entdecken ↗</a></section>
      </div>`;
    $("#rs-drop").addEventListener("click",e=>{if(e.target.id!=="rs-file")$("#rs-file").click()});
    $("#rs-drop").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();$("#rs-file").click()}});
    $("#rs-file").addEventListener("change",e=>processFile(e.target.files?.[0]));
    $("#rs-remove-preview").addEventListener("click",clearUploadedImage);
    $("#rs-drop").addEventListener("dragover",e=>{e.preventDefault();e.dataTransfer.dropEffect="copy";e.currentTarget.classList.add("drag-over")});
    $("#rs-drop").addEventListener("dragleave",e=>{e.currentTarget.classList.remove("drag-over")});
    $("#rs-drop").addEventListener("drop",e=>{e.preventDefault();e.currentTarget.classList.remove("drag-over");processFile([...e.dataTransfer.files].find(f=>f.type.startsWith("image/")))});
    document.addEventListener("paste",e=>{if(e.target.closest("textarea,input"))return;const f=[...(e.clipboardData?.files||[])].find(x=>x.type.startsWith("image/"));if(f){e.preventDefault();processFile(f)}});
    $("#rs-manual").addEventListener("click",()=>runAnalysis($("#rs-text").value));
    $("#rs-demo").addEventListener("click",()=>runAnalysis("Zutaten für 2 Personen\n800 ml Kokosmilch\n250 g Reisnudeln\n2 EL Sojasauce\n1 TL Sesamöl\n1 Zwiebel"));
    $("#rs-cart").addEventListener("click",()=>$("#cart-button").click());
    $("#rs-review-list").addEventListener("click",e=>{
      const btn=e.target.closest("[data-rs-more]");if(!btn)return;
      const index=Number(btn.dataset.rsMore),extra=$("#rs-extra-"+index);
      const expanded=!state.expandedVariants.has(index);
      if(expanded)state.expandedVariants.add(index);else state.expandedVariants.delete(index);
      if(extra)extra.hidden=!expanded;
      btn.setAttribute("aria-expanded",String(expanded));
      btn.textContent=expanded?"Weniger anzeigen ↑":"Weitere Produkte ("+(extra?.children.length||0)+") ↓";
    });
    $("#rs-review-list").addEventListener("change",e=>{
      const input=e.target.closest("[data-rs-pick]");if(input)chooseVariant(Number(input.dataset.rsPick),input.value);
    });
    $("#rs-add").addEventListener("click",()=>{
      const rows=state.rows.filter((r,i)=>!r.added&&$("[data-rs-choose='"+i+"']")?.checked);
      const done=applyRows(rows);if(done.added)state.imported.add(norm(state.raw));renderRows();setNotice(done.added?"✓ "+done.packages+" weitere Packungen in den Demo-Warenkorb gelegt.":"Bitte wähle einen verfügbaren Artikel aus.",done.added?"success":"warn");
    });
    // Recipe cards pass a one-time shopping list in browser-local session state.
    // No ingredient list is sent through URL parameters or to an external server.
    try{
      const saved=sessionStorage.getItem("asia-market-recipe-import-v1");
      if(saved){
        sessionStorage.removeItem("asia-market-recipe-import-v1");
        const data=JSON.parse(saved);
        if(typeof data.text==="string"&&data.text.length<=5000&&Date.now()-Number(data.at||0)<10*60*1000){
          runAnalysis(data.text,false,true);
        }
      }
    }catch{ /* Session storage may be unavailable in strict browser settings. */ }
  }
  function promo(){
    const nav=$(".store-nav .nav-inner");
    if(nav&&!nav.querySelector('[href="?seite=rezeptscanner"]')){
      const a=document.createElement("a");a.href="?seite=rezeptscanner";a.textContent="📸 Rezept-Scanner";a.className="nav-recipe";
      nav.insertBefore(a,nav.querySelector(".nav-ship")||null);
    }
    const nearby=$("#quick-shop");
    if(nearby&&!$("#rs-home-promo")){
      const s=document.createElement("section");s.id="rs-home-promo";s.className="layout rs-home-promo";
      s.innerHTML='<div class="rs-home-copy"><span class="retail-label">NEU · REZEPT-SCANNER</span><h2>Rezept gesehen?<br><em>Zutaten im Warenkorb.</em></h2><p>Screenshot ablegen und automatisch passende Produkte samt benötigter Packungsmenge finden.</p><a class="market-button" href="?seite=rezeptscanner">Screenshot ausprobieren ↗</a><small>Lokale Texterkennung · Demoprodukte · keine Bildübertragung</small></div><div class="rs-home-visual" aria-hidden="true"><span>📸</span><i>→</i><span>🍜</span><i>→</i><span>🛒</span></div>';
      nearby.insertAdjacentElement("afterend",s);
    }
    const foot=$(".market-footer .footer-grid>div:nth-child(2)");
    if(foot&&!foot.querySelector('[href="?seite=rezeptscanner"]')){const a=document.createElement("a");a.href="?seite=rezeptscanner";a.textContent="Rezept-Scanner";foot.append(a)}
    const cartTitle=$("#cart-drawer .drawer-top > div:first-child");
    if(cartTitle&&!cartTitle.querySelector(".rs-cart-entry")){
      const a=document.createElement("a");a.href="?seite=rezeptscanner";a.className="rs-cart-entry";a.textContent="📸 Rezept-Screenshot importieren ↗";cartTitle.append(a);
    }
    const ideas=$(".idea-top");
    if(ideas&&!ideas.querySelector('[href="?seite=rezeptscanner"]')){ideas.insertAdjacentHTML("beforeend",'<a href="?seite=rezeptscanner" class="rs-ideas-link">📸 Eigenes Rezept per Screenshot scannen ↗</a>')}
  }
  document.addEventListener("DOMContentLoaded",()=>{
    promo();
    if(new URLSearchParams(location.search).get("seite")==="rezeptscanner")scannerView();
  });
  window.ASIA_RECIPE_SCANNER={analyzeText,calculate,matchIngredient,alternativesFor,extractIngredientsFromLayout,processFile};
})();
