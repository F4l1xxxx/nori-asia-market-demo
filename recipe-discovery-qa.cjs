/* Local end-to-end checks for contextual cart recommendations, recipe ideas,
   explicit online search, recipe-to-cart flow, and removable screenshots. */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const puppeteer=require('puppeteer-core');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.wasm':'application/wasm','.gz':'application/octet-stream'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const rel=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname).replace(/^\/+/, '');
  const filename=path.resolve(root,rel);
  if(!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.stat(filename,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);res.end('not found');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(filename).pipe(res);
  });
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port+'/';
  const browser=await puppeteer.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true,args:['--no-sandbox','--disable-cache']});
  const page=await browser.newPage();page.setDefaultTimeout(55000);
  const errors=[],requests=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('request',r=>{if(r.url().startsWith('https://'))requests.push(r.url());});
  const load=fragment=>page.goto(base+fragment,{waitUntil:'networkidle2'});
  try{
    await page.setViewport({width:1400,height:1000});
    await load('?seite=kochideen');
    assert.ok(await page.$('#recipe-discovery'),'Recipe finder displayed');
    assert.equal(await page.$$eval('.recipe-card',cards=>cards.length),6,'Only six concise recipes visible initially');
    assert.equal(await page.evaluate(()=>window.ASIA_RECIPE_DISCOVERY.ideas.length),12,'Twelve original curated recipes available');
    assert.deepEqual(requests,[],'No third-party requests before explicit search');
    await page.click('#recipe-idea-query');
    await page.type('#recipe-idea-query','Grünes Thai Curry');
    assert.equal(await page.$$eval('.recipe-card',cards=>cards.length),1,'Local search narrows recipes without internet');
    await page.click('[data-recipe-local="green-curry"]');
    const localDetail=await page.$eval('#recipe-detail-panel',el=>el.textContent);
    assert.match(localDetail,/Grüne Currypaste/);
    assert.match(localDetail,/Kokosmilch/);
    // The detail panel scrolls smoothly; DOM click avoids a flaky test
    // coordinate while that scroll animation is still in progress.
    await page.$eval('#recipe-online-button',button=>button.click());
    await page.waitForFunction(()=>/gefunden|gerade nicht verfügbar|kein Treffer/i.test(document.querySelector('#recipe-online-status')?.textContent||''),{timeout:28000});
    const online=await page.evaluate(()=>({status:document.querySelector('#recipe-online-status').textContent,
      count:document.querySelectorAll('[data-recipe-online]').length}));
    assert.ok(online.count>=1,'Browser live search returns TheMealDB Thai Green Curry; '+online.status);
    assert.ok(requests.some(u=>/themealdb\.com\/api\/json\/v1\/1\/search/.test(u)),'Online request only after explicit search');
    await page.click('[data-recipe-online]');
    await page.waitForFunction(()=>document.querySelector('#recipe-detail-panel')?.textContent.includes('Originalrezept bei TheMealDB'),{timeout:28000});
    const remote=await page.evaluate(()=>({ingredients:document.querySelectorAll('#recipe-detail-panel li').length,
      button:document.querySelector('[data-recipe-shop]')?.textContent,source:document.querySelector('#recipe-detail-panel a[href^="https://www.themealdb.com/meal/"]')?.href}));
    assert.ok(remote.ingredients>=4,'Full online recipe ingredients provided');
    assert.match(remote.button,/Shopzutaten/);
    assert.ok(remote.source,'Original recipe attribution link');
    await page.screenshot({path:path.join(root,'recipe-finder-desktop.png'),fullPage:true});
    // A curated German recipe should import more predictable catalogue aliases.
    await page.click('[data-recipe-local="green-curry"]');
    await page.click('#recipe-detail-panel [data-recipe-shop]');
    await page.waitForFunction(()=>new URL(location.href).searchParams.get('seite')==='rezeptscanner');
    const imported=await page.evaluate(()=>({text:document.querySelector('#rs-text').value,
      products:[...document.querySelectorAll('#rs-review-list .rs-result-main>strong')].map(x=>x.textContent),
      cart:window.NORI_DEMO.cartContents()}));
    assert.match(imported.text,/Grüne Currypaste/);
    assert.ok(imported.products.includes('Kokosmilch'));
    assert.ok(imported.products.includes('Jasminreis'));
    assert.ok(imported.products.includes('Grüne Currypaste'));
    assert.ok(Object.keys(imported.cart).length>=3,'Recipe ingredients added to demo cart');
    // Simulate an uploaded mistaken image, then remove it and its OCR UI.
    await page.evaluate(async()=>{
      const canvas=document.createElement('canvas');canvas.width=400;canvas.height=170;
      const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,400,170);ctx.fillStyle='black';ctx.font='24px Arial';ctx.fillText('ZUTATEN',18,50);ctx.fillText('200 g Ramen',18,110);
      const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
      await window.ASIA_RECIPE_SCANNER.processFile(new File([blob],'falsches-rezept.png',{type:'image/png'}));
    });
    assert.equal(await page.$eval('#rs-upload-preview',e=>e.hidden),false,'Image preview is visible');
    const before=await page.evaluate(()=>window.NORI_DEMO.cartContents());
    await page.$eval('#rs-remove-preview',button=>button.click());
    const cleared=await page.evaluate(()=>({previewHidden:document.querySelector('#rs-upload-preview').hidden,
      filename:document.querySelector('#rs-file-name').textContent,
      text:document.querySelector('#rs-text').value,
      resultsHidden:document.querySelector('#rs-results').hidden,
      cart:window.NORI_DEMO.cartContents()}));
    assert.equal(cleared.previewHidden,true);
    assert.equal(cleared.filename,'');assert.equal(cleared.text,'');
    assert.equal(cleared.resultsHidden,true);
    assert.deepEqual(cleared.cart,before,'Removing image cannot silently remove existing purchases');
    await page.screenshot({path:path.join(root,'recipe-finder-scanner-flow.png'),fullPage:true});
    // Verify the exact complaint: sushi basket never recommends coconut milk.
    await page.evaluate(()=>localStorage.removeItem('nori-co-demo-cart-v1'));
    await load('');
    const sushi=await page.evaluate(()=>{
      const api=window.NORI_DEMO;
      for(const name of ['Sushireis Rundkorn','Nori Algenblätter','Sojasauce Mild','Reisessig Mild','Sesam Schwarz']){
        const p=api.products.find(item=>item.name===name);api.addToCart(p.id,1);
      }
      document.querySelector('#cart-button').click();
      return {text:document.querySelector('#cart-content').textContent,
        suggestion:document.querySelector('.cart-recommendation')?.textContent||null};
    });
    assert.equal(sushi.suggestion,null,'Full sushi basket does not get a random dessert/coconut suggestion');
    assert.doesNotMatch(sushi.text,/Kokosmilch/);
    await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
    await load('?seite=kochideen');
    const mobile=await page.evaluate(()=>({width:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth}));
    assert.ok(mobile.scroll<=mobile.width+1,'Recipe finder fits mobile width: '+JSON.stringify(mobile));
    await page.screenshot({path:path.join(root,'recipe-finder-mobile.png'),fullPage:true});
    // A failed external service must never block local browsing or leave a spinner.
    await page.setRequestInterception(true);
    page.on('request',request=>/themealdb\.com/.test(request.url())?request.abort():request.continue());
    await page.type('#recipe-idea-query','Grünes Thai Curry');
    await page.$eval('#recipe-online-button',button=>button.click());
    await page.waitForFunction(()=>document.querySelector('#recipe-online-status')?.textContent.includes('gerade nicht verfügbar'));
    assert.equal(await page.$$eval('.recipe-card',cards=>cards.length),1,'Local recipes survive online failure');
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({pass:true,curated:12,online,remote,imported:imported.products,removed:true,sushiRelevant:true,mobile,errors},null,2));
  }catch(err){
    const debug=await page.evaluate(()=>({url:location.href,ready:document.readyState,
      status:document.querySelector('#recipe-online-status')?.textContent,
      buttonDisabled:document.querySelector('#recipe-online-button')?.disabled,
      query:document.querySelector('#recipe-idea-query')?.value,
      onlineHidden:document.querySelector('#recipe-online-section')?.hidden,
      discovered:Boolean(document.querySelector('#recipe-discovery'))})).catch(e=>({evalError:String(e)}));
    console.error('RECIPE_DISCOVERY_QA_FAIL',err.stack,JSON.stringify({debug,errors,requests}));process.exitCode=1;
  }
  finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(err=>{console.error(err);server.close();process.exitCode=1;});
