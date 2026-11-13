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
    await page.click('#rs-demo');
    const info=await page.evaluate(()=>({rows:[...document.querySelectorAll('#rs-review-list .rs-result')].length,
      count:document.querySelector('#cart-count').textContent,
      products:window.NORI_DEMO.products.filter(p=>window.NORI_DEMO.cartContents()[p.id]).map(p=>[p.name,window.NORI_DEMO.cartContents()[p.id]])}));
    assert.equal(info.rows,5);assert.equal(info.count,'5');
    assert.ok(info.products.some(([name,count])=>name==='Kokosmilch Cremig'&&count===2));
    await page.click('#rs-manual');
    assert.equal(await page.$eval('#cart-count',e=>e.textContent),'5','Repeat analysis does not double-add items');
    await page.screenshot({path:path.join(root,'recipe-scanner-desktop.png'),fullPage:true});
    await load('?seite=kochideen');
    assert.ok(await page.$('.rs-ideas-link'));
    await load('');
    assert.ok(await page.$('#rs-home-promo'));
    await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
    await load('?seite=rezeptscanner');
    const dims=await page.evaluate(()=>({w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(dims.scroll<=dims.w+1,'Mobile no overflow: '+JSON.stringify(dims));
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
