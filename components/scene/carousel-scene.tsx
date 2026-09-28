'use client';
import { useId } from 'react';
import { sceneItems } from '@/data/scene';
import { SceneButton, type SceneAction } from './scene-button';

const carousel = '/assets/illustrations/carousel.png';
const horses = '/assets/layers/carousel-horses.png';
const canopy = '/assets/layers/carousel-canopy.png';

export function CarouselHorse({index,onSelect}:{index:number;onSelect:SceneAction}) {
  const item=sceneItems.about[index];
  return <SceneButton selection={{facility:'about',itemId:item.id}} label={item.label} className={`horse-hit horse-hit-${index+1}`} onSelect={onSelect}/>;
}

export function CarouselScene({onSelect}:{onSelect:SceneAction}) {
  const id=useId().replaceAll(':','');
  return <section className="facility facility-carousel" aria-label="Carousel · About">
    <svg className="carousel-illustration" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-base`}><path d="M0 590H185V935H1065V590H1254V1254H0Z"/></clipPath>
        <clipPath id={`${id}-structure`}><path d="M457 385H796V1000H457Z"/></clipPath>
        <clipPath id={`${id}-horses`}><path d="M218 485H457V1010H218Z M796 485H1040V1010H796Z M457 775H796V1010H457Z"/></clipPath>
        <clipPath id={`${id}-canopy`}><rect x="0" y="154" width="1254" height="1100"/></clipPath>
        <clipPath id={`${id}-flag`}><rect x="575" width="225" height="161"/></clipPath>
      </defs>
      <image href={carousel} width="1254" height="1254" clipPath={`url(#${id}-base)`}/>
      <g className="carousel-body-motion"><image href={horses} x="218" y="330" width="812" height="812" clipPath={`url(#${id}-structure)`}/></g>
      <g className="carousel-horses-motion"><image href={horses} x="218" y="330" width="812" height="812" clipPath={`url(#${id}-horses)`}/></g>
      <g className="carousel-canopy-motion"><image href={canopy} x="204" y="-20" width="846" height="846" clipPath={`url(#${id}-canopy)`}/></g>
      <g className="carousel-flag-motion"><image href={canopy} x="204" y="-20" width="846" height="846" clipPath={`url(#${id}-flag)`}/></g>
    </svg>
    <SceneButton selection={{facility:'about'}} label="About" className="carousel-overview" onSelect={onSelect}/>
    {sceneItems.about.map((_,index)=><CarouselHorse key={index} index={index} onSelect={onSelect}/>)}
  </section>;
}
