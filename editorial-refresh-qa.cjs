/* E2E smoke test: genuine photographic assets, quiet catalog presentation,
   product route and shopping basics. Zero network requests to third parties. */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const puppeteer=require('puppeteer-core');
const root=__dirname;
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '')||'index.html';
 const f=path.resolve(root,name);
 if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.stat(f,(err,stat)=>{
  if(err||!stat.isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res);
 });
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port+'/';
 const browser=await puppeteer.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true,args:['--no-sandbox','--disable-cache']});
 const page=await browser.newPage();page.setDefaultTimeout(25000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const photos=fs.readdirSync(path.join(root,'assets','real')).filter(n=>n.endsWith('.jpg'));
  assert.equal(photos.length,18,'All 18 curated Pexels images are present');
  assert.ok(photos.every(n=>fs.statSync(path.join(root,'assets','real',n)).size>8000),'No empty images');
  await page.setViewport({width:1440,height:900});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.product-card .product-photo img');
  const home=await page.evaluate(()=>{
   const api=window.NORI_DEMO,photo=api.products.map(p=>api.productImage(p));
   return {count:api.productCount,categories:document.querySelectorAll('.category-card img').length,
    cards:document.querySelectorAll('.product-card').length,brokenPacks:document.querySelectorAll('.product-card .pack,.hero-grocery-visual .hero-product').length,
    hero:document.querySelector('.hero-editorial-photo')?.getAttribute('src'),
    photoPaths:[...new Set(photo)],cardImages:[...document.querySelectorAll('.product-card .product-photo img')].map(el=>el.getAttribute('src')),
    bodyWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,
    promoEmojiCount:document.querySelectorAll('.side-promo .promo-glyph').length,
    worlds:[...document.querySelectorAll('#worlds .country-card')].map(el=>({
     country:el.dataset.orig,background:getComputedStyle(el).backgroundImage,
     flag:getComputedStyle(el,'::after').backgroundImage,
     text:el.querySelector('strong')?.textContent,height:el.getBoundingClientRect().height,
     ghostVisible:getComputedStyle(el.querySelector('.country-sign')).display!=='none'
    }))};
  });
  assert.equal(home.count,150);assert.equal(home.categories,6);assert.ok(home.cards>=20);
  assert.equal(home.brokenPacks,0);assert.ok(home.hero?.includes('real/'));
  assert.ok(home.photoPaths.length>=12,'All six categories use varied food photos');
  assert.ok(home.photoPaths.every(p=>p.startsWith('./assets/real/')),'Catalog images only from documented photographs');
  assert.ok(home.cardImages.length>=20&&home.cardImages.every(p=>p.startsWith('./assets/real/')));
  assert.equal(home.promoEmojiCount,0);
  assert.equal(home.worlds.length,4,'Four country destinations');
  assert.ok(home.worlds.every(x=>/assets\/real\/.*\.jpg/.test(x.background)&&x.flag.includes('flag-')&&x.height>=260&&!x.ghostVisible),'Country cards show real cuisine photos, small flags, no novelty lettering');
  assert.ok(home.scrollWidth<=home.bodyWidth+1,'No desktop horizontal overflow');
  const statuses=await page.evaluate(async(paths)=>Promise.all(paths.map(async p=>({p,status:(await fetch(p)).status}))),home.photoPaths);
  assert.ok(statuses.every(s=>s.status===200),'Every product image accessible');
  await page.screenshot({path:path.join(root,'editorial-desktop.png'),fullPage:true});
  await page.goto(base+'?produkt=n001',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.editorial-product-image');
  assert.equal(await page.$$eval('.art-pack',nodes=>nodes.length),0);
  assert.match(await page.$eval('.pdp-visual-legend',n=>n.textContent),/Originalverpackung/);
  await page.$eval('#pdp-add',el=>el.click());
  const cart=await page.evaluate(()=>window.NORI_DEMO.cartContents());
  assert.ok(Object.keys(cart).length>=1,'Product can still be added');
  await page.goto(base+'?kategorie=Reis%20%26%20Nudeln',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.shop-tile-photo');
  assert.ok(await page.$$eval('.shop-tile-photo',x=>x.length)>0);
  await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const mobile=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
   photos:document.querySelectorAll('.product-card .product-photo img').length,
   worlds:[...document.querySelectorAll('#worlds .country-card')].map(el=>Math.round(el.getBoundingClientRect().width))}));
  assert.ok(mobile.scroll<=mobile.width+1,'Mobile page without horizontal overflow');
  assert.ok(mobile.photos>=20);
  assert.ok(mobile.worlds.every(w=>w>300),'Mobile destination photos remain legible full-width');
  await page.screenshot({path:path.join(root,'editorial-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({pass:true,home:{count:home.count,categories:home.categories,cards:home.cards,distinctPhotos:home.photoPaths.length,worlds:home.worlds.map(w=>w.country)},productDetail:true,cart:true,mobile,errors},null,2));
 }catch(e){console.error('EDITORIAL_QA_FAIL',e.stack);process.exitCode=1;}
 finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
