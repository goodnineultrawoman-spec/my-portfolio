import { sceneItems } from '@/data/scene';
import { SceneButton, type SceneAction } from './scene-button';

const art=[
  '/assets/layers/balloons.png',
  '/assets/illustrations/popcorn.png',
  '/assets/illustrations/soda.png',
  '/assets/illustrations/ice-cream.png',
  '/assets/illustrations/hot-dog.png',
] as const;

export function SnackItem({index,onSelect}:{index:number;onSelect:SceneAction}) {
  const item=sceneItems.interests[index];
  return <SceneButton selection={{facility:'interests',itemId:item.id}} label={item.label} className={`snack-item snack-item-${index+1}`} onSelect={onSelect}>
    <img src={art[index]} alt="" draggable="false"/>
  </SceneButton>;
}

export function SnackStallScene({onSelect}:{onSelect:SceneAction}) {
  return <section className="facility facility-snack" aria-label="Snack Stall · Interests">
    <img className="snack-stall-body" src="/assets/layers/snack-cart-body.png" alt="" draggable="false"/>
    <SceneButton selection={{facility:'interests'}} label="Interests" className="snack-overview" onSelect={onSelect}/>
    {sceneItems.interests.map((_,index)=><SnackItem key={index} index={index} onSelect={onSelect}/>)}
  </section>;
}
