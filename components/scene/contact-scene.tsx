'use client';
import { useId } from 'react';
import { sceneItems } from '@/data/scene';
import { SceneButton, type SceneAction } from './scene-button';

const pavilion='/assets/illustrations/contact-pavilion.png';

export function ContactObject({index,onSelect}:{index:number;onSelect:SceneAction}) {
  const item=sceneItems.contact[index];
  return <SceneButton selection={{facility:'contact',itemId:item.id}} label={item.label} className={`contact-object contact-object-${index+1}`} onSelect={onSelect}>
    {item.id==='resume' && <span className="resume-letter" aria-hidden="true"/>}
  </SceneButton>;
}

export function ContactScene({onSelect}:{onSelect:SceneAction}) {
  const id=useId().replaceAll(':','');
  return <section className="facility facility-contact" aria-label="Contact Pavilion · Contact">
    <svg className="pavilion-illustration" viewBox="0 0 1122 1402" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-body`}><rect y="248" width="1122" height="1154"/></clipPath>
        <clipPath id={`${id}-flag`}><rect width="1122" height="250"/></clipPath>
      </defs>
      <image href={pavilion} width="1122" height="1402" clipPath={`url(#${id}-body)`}/>
      <g className="pavilion-flag-motion"><image href={pavilion} width="1122" height="1402" clipPath={`url(#${id}-flag)`}/></g>
    </svg>
    <SceneButton selection={{facility:'contact'}} label="Contact" className="contact-overview" onSelect={onSelect}/>
    {sceneItems.contact.map((_,index)=><ContactObject key={index} index={index} onSelect={onSelect}/>)}
  </section>;
}
