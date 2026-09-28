import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const entries = [
 ['主视觉参考.png','illustrations/map-reference.png'],
 ['旋转木马','illustrations/carousel.png'], ['过山车整体','illustrations/roller-coaster.png'],
 ['摩天轮总体','illustrations/ferris-wheel.png'], ['零食车','illustrations/snack-cart.png'],
 ['電話亭','illustrations/contact-pavilion.png'], ['纪念品商店','illustrations/souvenir-shop.png'],
 ['冰激凌','illustrations/ice-cream.png'], ['可乐','illustrations/soda.png'],
 ['爆米花','illustrations/popcorn.png'], ['热狗','illustrations/hot-dog.png'],
 ['旋转木马顶','layers/carousel-canopy.png'], ['旋转木马马','layers/carousel-horses.png'],
 ['摩天轮部件','layers/ferris-parts.png'], ['过山车轨道','layers/coaster-track.png'],
 ['过山车车厢','layers/coaster-train.png'], ['零食车车体','layers/snack-cart-body.png'],
 ['气球','layers/balloons.png'],
];
const manifest = entries.map(([source, target]) => {
 const destination=path.join('public/assets',target);
 mkdirSync(path.dirname(destination),{recursive:true});
 copyFileSync(path.join('..',source),destination);
 return {source, url:'/assets/'+target, treatment:'Byte-for-byte copy; original pixels and alpha preserved.'};
});
writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2));
console.log(`Copied ${manifest.length} original assets without pixel changes.`);
