/* Local HTTP preview for browser OCR: file:// cannot start WebWorkers reliably. */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.wasm':'application/wasm','.gz':'application/octet-stream','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  let route;
  try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}
  catch{res.writeHead(400);res.end('Bad request');return}
  const requested=path.resolve(root,route==='/'?'index.html':route.replace(/^\/+/,''));
  if(!requested.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}
  fs.stat(requested,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);res.end('Not found');return}
    res.writeHead(200,{'Content-Type':mime[path.extname(requested).toLowerCase()]||'application/octet-stream','X-Content-Type-Options':'nosniff'});
    fs.createReadStream(requested).pipe(res);
  });
});
server.listen(0,'127.0.0.1',()=>{
  const url='http://127.0.0.1:'+server.address().port+'/';
  process.stdout.write('ASIA MART Demo lokal gestartet: '+url+'\nZum Beenden dieses Fenster schließen oder Strg+C drücken.\n');
  if(process.platform==='win32'&&!process.argv.includes('--no-open')){
    const child=spawn('cmd.exe',['/d','/s','/c','start "" "'+url+'"'],{windowsHide:true,detached:true,stdio:'ignore'});
    child.unref();
  }
});
