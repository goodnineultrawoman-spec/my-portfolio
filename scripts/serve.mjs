import http from 'node:http';
import path from 'node:path';
import {statSync,createReadStream} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../out');
const types={'.html':'text/html; charset=utf-8','.txt':'text/plain; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.json':'application/json','.mp3':'audio/mpeg','.mp4':'video/mp4'};
function sendFile(file,res,range){
 const stream=createReadStream(file,range);
 stream.on('error',()=>res.destroy());
 stream.pipe(res);
}
http.createServer((req,res)=>{
 let file,size;
 try {file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==root&&!file.startsWith(root+path.sep))throw new Error();if(statSync(file).isDirectory())file=path.join(file,'index.html');const stats=statSync(file);if(!stats.isFile())throw new Error();size=stats.size;}
 catch {res.writeHead(404);res.end('Not found');return;}
 const contentType=types[path.extname(file)]||'application/octet-stream';
 if(path.extname(file)==='.mp3'||path.extname(file)==='.mp4'){
  const range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
  if(range){
   const start=Number(range[1]);
   const end=range[2]?Math.min(Number(range[2]),size-1):size-1;
   if(start<=end&&start<size){
    res.writeHead(206,{'Content-Type':contentType,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1,'Accept-Ranges':'bytes'});
    if(req.method==='HEAD'){res.end();return;}
    sendFile(file,res,{start,end});return;
   }
  }
 }
 res.writeHead(200,{'Content-Type':contentType,'Content-Length':size,...(path.extname(file)==='.mp3'||path.extname(file)==='.mp4'?{'Accept-Ranges':'bytes'}:{})});
 if(req.method==='HEAD'){res.end();return;}
 sendFile(file,res);
}).listen(5173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:5173'));
