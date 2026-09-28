import type { SceneAction } from './scene-button';
import { CarouselScene } from './carousel-scene';
import { RollerCoasterScene } from './roller-coaster-scene';
import { FerrisWheelScene } from './ferris-wheel-scene';
import { SnackStallScene } from './snack-stall-scene';
import { ContactScene } from './contact-scene';

function BackgroundLayer() {
  return <div className="scene-paper" aria-hidden="true"><span/><span/><span/></div>;
}

function LandscapeAccentLayer() {
  return <svg className="scene-landscape" viewBox="0 0 1536 1024" aria-hidden="true" focusable="false">
    <defs><filter id="wash-soften"><feGaussianBlur stdDeviation="9"/></filter></defs>
    <g filter="url(#wash-soften)" opacity=".46" fill="#aebfc1">
      <path d="M622 446c69-25 132-22 199-8 53 11 84 33 120 61-71 27-170 46-259 29-59-11-106-37-60-82Z" opacity=".26"/>
      <path d="M970 584c55-36 109-43 165-16 54 26 109 20 176 13-24 47-81 76-162 78-84 2-161-24-179-75Z" opacity=".37"/>
      <path d="M690 754c84-25 153-12 211 16-49 23-120 40-196 29-51-8-84-30-15-45Z" opacity=".16"/>
    </g>
    <g fill="none" strokeLinecap="round" opacity=".33">
      <path d="M656 489c58-17 105-11 147 4m-132 16c58-12 106-4 159 7m153 90c60-16 130-8 197 3m-144 21c62-5 125-1 180-13" stroke="#9fb6bc" strokeWidth="2"/>
      <path d="M1000 557c36-23 80-25 111-10m-449-93c47-13 93-13 126-4" stroke="#b9c5bf" strokeWidth="1.5"/>
    </g>
  </svg>;
}

function LandscapeCutouts() {
  return <div className="landscape-cutouts" aria-hidden="true">
    <span className="landscape-patch patch-carousel-ground"><img src="/assets/illustrations/carousel.png" alt="" draggable="false"/></span>
    <span className="landscape-patch patch-ferris-ground"><img src="/assets/layers/ferris-parts.png" alt="" draggable="false"/></span>
  </div>;
}

function PathLayer() {
  return <svg className="scene-paths" viewBox="0 0 1536 1024" aria-hidden="true" focusable="false">
    <path d="M387 667 C476 651 523 587 584 491 C627 421 709 401 780 410"/>
    <path d="M778 447 C751 541 786 591 873 599 C989 613 1054 555 1121 503 C1182 455 1246 478 1305 510"/>
    <path d="M598 641 C646 698 712 711 785 713 C923 715 983 774 1053 826 C1126 880 1208 866 1317 823"/>
    <path className="path-fine" d="M258 744 C369 783 461 766 535 716 M1065 677 C1161 691 1254 674 1322 633"/>
  </svg>;
}

function VegetationAccentLayer() {
  return <svg className="scene-vegetation" viewBox="0 0 1536 1024" aria-hidden="true" focusable="false">
    <g fill="none" stroke="#9da994" strokeLinecap="round" strokeLinejoin="round" opacity=".32">
      <path d="M193 582c-8-30-22-50-37-62m37 62c4-40 13-62 30-81m-43 54c-19-6-31-15-43-28m74 16c15-12 25-27 29-48" strokeWidth="3"/>
      <path d="M519 403c-6-28-14-45-26-64m26 64c10-34 21-53 35-68m-43 51c-13-5-22-14-31-23" strokeWidth="2.7"/>
      <path d="M1022 741c-10-38-25-60-45-76m45 76c7-48 21-76 42-96m-61 71c-20-8-34-21-47-40" strokeWidth="3"/>
      <path d="M1327 766c-5-31-16-48-31-65m31 65c5-37 17-58 32-77" strokeWidth="2.3"/>
      <path d="M630 825c-11-31-24-47-38-59m38 59c7-37 21-53 33-67" strokeWidth="2"/>
    </g>
    <g fill="#a3ad9c" opacity=".16">
      <ellipse cx="153" cy="521" rx="21" ry="9" transform="rotate(27 153 521)"/>
      <ellipse cx="222" cy="504" rx="17" ry="8" transform="rotate(-34 222 504)"/>
      <ellipse cx="490" cy="354" rx="19" ry="7" transform="rotate(38 490 354)"/>
      <ellipse cx="1065" cy="648" rx="25" ry="9" transform="rotate(-31 1065 648)"/>
      <ellipse cx="970" cy="669" rx="23" ry="8" transform="rotate(31 970 669)"/>
      <ellipse cx="1310" cy="704" rx="18" ry="7" transform="rotate(41 1310 704)"/>
    </g>
  </svg>;
}

export function SceneRoot({onSelect}:{onSelect:SceneAction}) {
  return <div className="map-viewport"><div className="park-map scene-root" id="park-scene" tabIndex={-1} aria-label="个人作品集手绘游园地图，探索设施中的物件">
    <BackgroundLayer/>
    <LandscapeAccentLayer/>
    <LandscapeCutouts/>
    <PathLayer/>
    <svg className="scene-paths-mobile" viewBox="0 0 390 1650" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M111 361 C292 387 338 454 247 538 C143 633 109 650 244 757 C345 837 292 912 184 1005 C82 1092 130 1165 245 1248 C321 1305 325 1381 269 1458"/></svg>
    <CarouselScene onSelect={onSelect}/>
    <RollerCoasterScene onSelect={onSelect}/>
    <FerrisWheelScene onSelect={onSelect}/>
    <SnackStallScene onSelect={onSelect}/>
    <ContactScene onSelect={onSelect}/>
    <VegetationAccentLayer/>
    <header className="site-header"><h1>Tianjiao Hao</h1><p>Global Marketing <span>·</span> Brand <span>·</span> GTM</p></header>
  </div></div>;
}
