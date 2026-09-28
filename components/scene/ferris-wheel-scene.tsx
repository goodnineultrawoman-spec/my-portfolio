'use client';
import { useId } from 'react';
import { sceneItems } from '@/data/scene';
import { AssetCrop, SceneButton, type SceneAction } from './scene-button';

const parts='/assets/layers/ferris-parts.png';
const cabins=[
  {x:1212,y:187,w:155,h:190},
  {x:1371,y:187,w:155,h:190},
  {x:1212,y:384,w:155,h:190},
  {x:1371,y:384,w:155,h:190},
  {x:1212,y:580,w:155,h:190},
];

export function FerrisCabin({index,onSelect}:{index:number;onSelect:SceneAction}) {
  const item=sceneItems.work[index];
  const image=cabins[index];
  return <SceneButton selection={{facility:'work',itemId:item.id}} label={item.label} className={`ferris-cabin ferris-cabin-${index+1}`} onSelect={onSelect}>
    <span className="cabin-upright"><AssetCrop src={parts} viewBox={`${image.x} ${image.y} ${image.w} ${image.h}`} sourceWidth={1536} sourceHeight={1024}/></span>
  </SceneButton>;
}

export function FerrisWheelScene({onSelect}:{onSelect:SceneAction}) {
  const id=useId().replaceAll(':','');
  return <section className="facility facility-ferris" aria-label="Ferris Wheel · MY WORK">
    <svg className="ferris-support" viewBox="600 120 630 780" aria-hidden="true" focusable="false">
      <defs><clipPath id={`${id}-support`}><path d="M893 446H927L1084 850H1013L910 505L809 850H739Z"/></clipPath></defs>
      <image href={parts} width="1536" height="1024" clipPath={`url(#${id}-support)`}/>
    </svg>
    <div className="ferris-rotor">
      <svg className="ferris-disc" viewBox="650 195 520 535" aria-hidden="true" focusable="false">
        <defs><clipPath id={`${id}-disc`}><ellipse cx="909" cy="459" rx="258" ry="266"/></clipPath></defs>
        <image href={parts} width="1536" height="1024" clipPath={`url(#${id}-disc)`}/>
      </svg>
      {sceneItems.work.map((_,index)=><FerrisCabin key={index} index={index} onSelect={onSelect}/>)}
    </div>
    <SceneButton selection={{facility:'work'}} label="MY WORK" className="ferris-overview" onSelect={onSelect}/>
  </section>;
}
