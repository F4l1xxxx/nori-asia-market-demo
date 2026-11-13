/* End-to-end local QA for the self-hosted screenshot scanner. */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const puppeteer=require('puppeteer-core');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.wasm':'application/wasm','.gz':'application/octet-stream'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname).replace(/^\/+/, '');
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.stat(file,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);res.end('not found');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  });
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port+'/';
  const browser=await puppeteer.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true,args:['--no-sandbox','--disable-cache']});
  const page=await browser.newPage();page.setDefaultTimeout(90000);
  const errors=[],external=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('request',r=>{const url=r.url();if(!url.startsWith(base)&&!url.startsWith('blob:')&&!url.startsWith('data:'))external.push(url)});
  const load=q=>page.goto(base+q,{waitUntil:'networkidle2'});
  try{
    await page.setViewport({width:1440,height:1000});
    await load('?seite=rezeptscanner');
    assert.ok(await page.$('#rs-drop'));
    assert.ok(await page.$('#cart-drawer .rs-cart-entry'));
    let checks=await page.evaluate(()=>{
      const rows=window.ASIA_RECIPE_SCANNER.analyzeText('Zutaten für 2 Personen\n800 ml Kokosmilch\n250 g Reisnudeln\n2 EL Sojasauce\n1 Zwiebel');
      return rows.map(x=>({label:x.label,name:x.product?.name||null,packs:x.count,confidence:x.confidence,precision:x.precision}));
    });
    assert.equal(checks.length,4);
    assert.equal(checks[0].packs,2,'800 ml coconut milk means two 400 ml cans');
    assert.equal(checks[0].confidence,'high');
    assert.equal(checks[1].name,'Reisnudeln 3 mm');
    assert.equal(checks[2].name,'Sojasauce Mild');
    assert.equal(checks[3].confidence,'missing','Onions are not in this demo catalog');
    const naming=await page.evaluate(()=>{
      const scan=window.ASIA_RECIPE_SCANNER;
      return ['Ramen','Rahmen','Ramen Nudeln','Pho Nudeln','Vermicelli','Tamari','Sojasoße','Basmati Reis','Pilze','Ingwer','Sesam','Salz'].map(label=>[label,scan.matchIngredient(label).product?.name||null]);
    });
    assert.deepEqual(naming.slice(0,7).map(r=>r[1]),[
      'Ramen Weizennudeln','Ramen Weizennudeln','Ramen Weizennudeln','Pho Reisbandnudeln',
      'Vermicelli Reisfäden','Tamari Sauce','Sojasauce Mild'
    ],'Ingredient names resolve to the right catalogue type');
    assert.ok(naming.slice(7).every(r=>r[1]===null),'No taste-changing replacements for unrelated ingredients');
    const layout=await page.evaluate(()=>{
      const words=[
        [1,1,1,50,100,'Zubereitung'],[1,1,2,780,100,'Zutaten'],
        [2,1,1,55,240,'Schritt'],[2,1,2,112,240,'1'],
        [3,1,1,780,240,'150'],[3,1,2,819,240,'g'],[3,1,3,840,240,'Sushi-Reis'],
        [4,1,1,55,300,'Reis'],[4,1,2,100,300,'waschen'],[4,1,3,180,300,'und'],
        [4,1,4,780,300,'20'],[4,1,5,808,300,'ml'],[4,1,6,840,300,'Reisessig'],
        [5,1,1,780,360,'Salz'],
        [6,1,1,780,430,'Zutaten'],[6,1,2,853,430,'online'],[6,1,3,920,430,'bestellen'],
        [7,1,1,780,470,'Rezeptwelt']
      ];
      const tsv='level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext\n'+words.map(([b,l,word,left,top,txt])=>['5','1',b,'1',l,word,left,top,60,18,95,txt].join('\t')).join('\n');
      const data=window.ASIA_RECIPE_SCANNER.extractIngredientsFromLayout({tsv});
      return {focused:data.focused,items:window.ASIA_RECIPE_SCANNER.analyzeText(data.text).map(r=>r.label)};
    });
    assert.equal(layout.focused,true,'OCR isolates ingredient column');
    assert.deepEqual(layout.items,['Sushi-Reis','Reisessig','Salz'],'No preparation, navigation or CTA leakage');
    await page.click('#rs-demo');
    const info=await page.evaluate(()=>({rows:[...document.querySelectorAll('#rs-review-list .rs-result')].length,
      count:document.querySelector('#cart-count').textContent,
      products:window.NORI_DEMO.products.filter(p=>window.NORI_DEMO.cartContents()[p.id]).map(p=>[p.name,window.NORI_DEMO.cartContents()[p.id]])}));
    assert.equal(info.rows,4,'Unavailable onion is not displayed');assert.equal(info.count,'5');
    assert.ok(info.products.some(([name,count])=>name==='Kokosmilch Cremig'&&count===2));
    const choiceUI=await page.evaluate(()=>{
      const card=[...document.querySelectorAll('.rs-result')].find(e=>e.querySelector('.rs-result-main>strong')?.textContent==='Sojasauce');
      return {count:card?.querySelectorAll('.rs-variant-option').length||0,
        visible:[...(card?.querySelectorAll('.rs-variant-option')||[])].filter(e=>!e.closest('[hidden]')).length,
        more:card?.querySelector('.rs-more-variants')?.textContent||''};
    });
    assert.equal(choiceUI.count,0,'Dark soy sauce and tamari are not treated as equivalent to mild soy sauce');
    assert.equal(choiceUI.more,'','No extra-options button for incompatible sauces');
    const brandTest=await page.evaluate(()=>{
      const arr=window.NORI_DEMO.products;
      const base=arr.find(p=>p.name==='Sojasauce Mild');
      const extra=[1,2,3,4].map(i=>({...base,id:'qa-soy-brand-'+i,name:'Marke '+i+' Sojasauce Mild',brand:'Marke '+i,price:2.99+i/10}));
      arr.push(...extra);
      const row=window.ASIA_RECIPE_SCANNER.analyzeText('2 EL Sojasauce')[0];
      const candidates=window.ASIA_RECIPE_SCANNER.alternativesFor(row);
      const formerStock=base.demoStock;
      base.demoStock=0;
      const fallback=window.ASIA_RECIPE_SCANNER.analyzeText('2 EL Sojasauce')[0].product?.id;
      base.demoStock=formerStock;
      const baseIndex=arr.indexOf(base);
      arr.splice(baseIndex,1);
      const renamedBrand=window.ASIA_RECIPE_SCANNER.matchIngredient('Sojasauce').product?.id;
      arr.splice(baseIndex,0,base);
      document.querySelector('#rs-manual').click();
      return {matchingBrands:candidates.length,fallback,renamedBrand};
    });
    assert.equal(brandTest.matchingBrands,5,'Only five mild soy sauce brands; dark and tamari excluded');
    assert.match(brandTest.fallback,/qa-soy-brand/,'A different brand replaces an unavailable default without changing flavor');
    assert.match(brandTest.renamedBrand,/qa-soy-brand/,'Ingredient matches a renamed catalogue product');
    const collapsed=await page.evaluate(()=>{
      const card=[...document.querySelectorAll('.rs-result')].find(e=>e.querySelector('.rs-result-main>strong')?.textContent==='Sojasauce');
      return {shown:[...card.querySelectorAll('.rs-variant-option')].filter(e=>!e.closest('[hidden]')).length,
        count:card.querySelector('.rs-more-variants')?.textContent};
    });
    assert.equal(collapsed.shown,3,'Only three same-variety brands initially visible');
    assert.match(collapsed.count,/Weitere Produkte \(2\)/);
    await page.evaluate(()=>{
      const card=[...document.querySelectorAll('.rs-result')].find(e=>e.querySelector('.rs-result-main>strong')?.textContent==='Sojasauce');
      card.querySelector('.rs-more-variants').click();
    });
    const expanded=await page.evaluate(()=>{
      const card=[...document.querySelectorAll('.rs-result')].find(e=>e.querySelector('.rs-result-main>strong')?.textContent==='Sojasauce');
      return {visible:[...card.querySelectorAll('.rs-variant-option')].filter(e=>!e.closest('[hidden]')).length,
        expanded:card.querySelector('.rs-more-variants').getAttribute('aria-expanded')};
    });
    assert.equal(expanded.visible,5,'Only genuine equivalent brands expanded');
    assert.equal(expanded.expanded,'true');
    await page.evaluate(()=>{
      const card=[...document.querySelectorAll('.rs-result')].find(e=>e.querySelector('.rs-result-main>strong')?.textContent==='Sojasauce');
      const radio=card.querySelector('input[data-rs-pick][value="qa-soy-brand-4"]');
      radio.click();
    });
    const swapped=await page.evaluate(()=>{
      const cart=window.NORI_DEMO.cartContents(),products=window.NORI_DEMO.products;
      return {mild:cart[products.find(p=>p.name==='Sojasauce Mild').id]||0,
        replacement:cart['qa-soy-brand-4']||0,
        total:document.querySelector('#cart-count').textContent};
    });
    assert.equal(swapped.mild,0,'Old variant removed from cart');
    assert.equal(swapped.replacement,1,'Equivalent brand replaces it');
    assert.equal(swapped.total,'5','Cart quantity is stable after replacing a variant');
    await page.evaluate(()=>{
      const mild=window.NORI_DEMO.products.find(p=>p.name==='Sojasauce Mild');
      const card=[...document.querySelectorAll('.rs-result')].find(e=>e.querySelector('.rs-result-main>strong')?.textContent==='Sojasauce');
      card.querySelector('input[data-rs-pick][value="'+mild.id+'"]').click();
      const arr=window.NORI_DEMO.products;
      for(let i=arr.length-1;i>=0;i--)if(String(arr[i].id).startsWith('qa-soy-brand-'))arr.splice(i,1);
    });
    await page.click('#rs-manual');
    assert.equal(await page.$eval('#cart-count',e=>e.textContent),'5','Repeat analysis does not double-add items');
    await page.evaluate(()=>{
      document.querySelector('#rs-text').value='150 g Sushi-Reis\n20 ml Reisessig\nSalz\nZucker\n100 g Lachsfilet (roh)\nWasabipaste\n2 EL Sojasoße';
      document.querySelector('#rs-manual').click();
    });
    const focusedList=await page.evaluate(()=>({
      items:[...document.querySelectorAll('#rs-review-list .rs-result-main > strong')].map(e=>e.textContent),
      notice:document.querySelector('#rs-summary-note').textContent
    }));
    assert.deepEqual(focusedList.items,['Sushi-Reis','Reisessig','Sojasoße'],'Only items carried in the shop are shown');
    assert.match(focusedList.notice,/ausgeblendet/);
    await page.screenshot({path:path.join(root,'recipe-scanner-desktop.png'),fullPage:true});
    await load('?seite=kochideen');
    assert.ok(await page.$('.rs-ideas-link'));
    await load('');
    assert.ok(await page.$('#rs-home-promo'));
    await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
    await load('?seite=rezeptscanner');
    const dims=await page.evaluate(()=>({w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(dims.scroll<=dims.w+1,'Mobile no overflow: '+JSON.stringify(dims));
    await page.click('#rs-demo');
    await page.evaluate(()=>{
      const arr=window.NORI_DEMO.products;
      const base=arr.find(p=>p.name==='Sojasauce Mild');
      arr.push(...[1,2,3,4].map(i=>({...base,id:'qa-mobile-soy-'+i,name:'Mobile Marke '+i+' Sojasauce Mild',brand:'Mobile Marke '+i})));
      document.querySelector('#rs-manual').click();
      const card=[...document.querySelectorAll('.rs-result')].find(e=>e.querySelector('.rs-result-main>strong')?.textContent==='Sojasauce');
      card.querySelector('.rs-more-variants').click();
    });
    const mobileVariants=await page.evaluate(()=>({w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(mobileVariants.scroll<=mobileVariants.w+1,'Expanded mobile options do not overflow');
    await page.screenshot({path:path.join(root,'recipe-scanner-mobile.png'),fullPage:true});
    await page.setViewport({width:1440,height:960});
    await load('?seite=rezeptscanner');
    const ocr=await page.evaluate(async()=>{
      const canvas=document.createElement('canvas');canvas.width=940;canvas.height=425;
      const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,940,425);
      ctx.fillStyle='#101010';ctx.font='bold 45px Arial';
      ['ZUTATEN','800 ml Kokosmilch','200 g Reisnudeln','2 EL Sojasauce'].forEach((text,i)=>ctx.fillText(text,52,75+i*97));
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      const file=new File([blob],'test-rezept.png',{type:'image/png'});
      await window.ASIA_RECIPE_SCANNER.processFile(file);
      const text=document.querySelector('#rs-text').value;
      const parsed=window.ASIA_RECIPE_SCANNER.analyzeText(text);
      return {text,notice:document.querySelector('#rs-notice').textContent,
        rows:[...document.querySelectorAll('#rs-review-list .rs-result')].length,
        coconutPacks:parsed.find(r=>/kokosmilch/i.test(r.label))?.count,
        cart:window.NORI_DEMO.cartContents()};
    });
    assert.match(ocr.text,/Kokosmilch/i,'Actual OCR recognizes coconut milk');
    assert.match(ocr.text,/Reisnudeln/i,'Actual OCR recognizes rice noodles');
    assert.ok(ocr.rows>=2,'Actual OCR parsed more than one ingredient');
    assert.equal(ocr.coconutPacks,2,'OCR unit confusion mi/ml must still plan 2 cans');
    assert.deepEqual(errors,[]);
    assert.deepEqual(external,[],'No external requests: OCR runs self-hosted');
    console.log(JSON.stringify({pass:true,checks,cart:info.products,mobile:dims,ocr:{recognized:ocr.text,rows:ocr.rows,notice:ocr.notice},errors,external},null,2));
  }catch(e){console.error('RECIPE_SCANNER_QA_FAIL',e.stack);process.exitCode=1;}
  finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
