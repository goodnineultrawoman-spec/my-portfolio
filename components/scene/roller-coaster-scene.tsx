import { sceneItems } from '@/data/scene';
import { AssetCrop, SceneButton, type SceneAction } from './scene-button';

export function ExperienceStation({index,onSelect}:{index:number;onSelect:SceneAction}) {
  const item=sceneItems.experience[index];
  return <SceneButton selection={{facility:'experience',itemId:item.id}} label={item.label} className={`coaster-station coaster-station-${index+1}`} onSelect={onSelect}/>;
}

export function RollerCoasterScene({onSelect}:{onSelect:SceneAction}) {
  return <section className="facility facility-coaster" aria-label="Roller Coaster · Experience">
    <img className="coaster-track" src="/assets/layers/coaster-track.png" alt="" draggable="false"/>
    <SceneButton selection={{facility:'experience'}} label="Experience" className="coaster-train" onSelect={onSelect}>
      <AssetCrop src="/assets/layers/coaster-train.png" viewBox="365 245 760 500" sourceWidth={1448} sourceHeight={1086}/>
    </SceneButton>
    {sceneItems.experience.map((_,index)=><ExperienceStation key={index} index={index} onSelect={onSelect}/>)}
  </section>;
}
