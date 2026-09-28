import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
const dir='public/fonts';mkdirSync(dir,{recursive:true});
const base='https://cn-font.claude-code-best.win/packages/XiaoheSimplify/dist/XiaoheSimplifySerif-VF/';
const css=readFileSync('font-source.css','utf8');
function readTree(p){return readdirSync(p,{withFileTypes:true}).map(e=>e.isDirectory()?readTree(p+'/'+e.name):/\.(tsx?|css)$/.test(e.name)?readFileSync(p+'/'+e.name,'utf8'):'').join('');}
const chars=new Set(Array.from(readTree('data')+readTree('components')+readTree('app')).map(c=>c.codePointAt(0)));
const blocks=css.match(/@font-face\{[^}]+\}/g);
const headers={'Referer':'http://localhost:5173/','Sec-Fetch-Dest':'font','User-Agent':'Mozilla/5.0'};
async function download(url,name){const r=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});if(!r.ok)throw new Error(`${r.status}: ${url}`);writeFileSync(dir+'/'+name,Buffer.from(await r.arrayBuffer()));}
const jobs=[];
const output=blocks.map(block=>{
 const name=block.match(/url\("\.\/([^\"]+)"\)/)[1];
 const ranges=block.match(/unicode-range:([^;]+)/)[1].split(',').map(v=>{const[a,b]=v.replace('U+','').split('-').map(x=>parseInt(x,16));return[a,b??a];});
 const needed=[...chars].some(c=>ranges.some(([a,b])=>c>=a&&c<=b));
 if(needed)jobs.push(()=>download(base+name,name));
 return block.replace('./'+name,needed?'./'+name:base+name);
});
let finished=0;
await Promise.all(Array.from({length:5},async()=>{while(jobs.length){await jobs.shift()();finished++;}}));
writeFileSync(dir+'/xiaohe.css',css.slice(0,css.indexOf('@font-face'))+'\n'+output.join('\n'));
console.log(`Cached ${finished} original Xiaohe font subsets locally.`);
const latin='https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf';
await download(latin,'cormorant-garamond.ttf');
writeFileSync(dir+'/cormorant.css',"@font-face{font-family:'Cormorant Garamond';src:url('./cormorant-garamond.ttf') format('truetype');font-weight:300 700;font-display:swap;}\n");
console.log('Cached Cormorant Garamond locally.');
