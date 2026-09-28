import type { DestinationId } from './navigation';

export type SceneSelection = { facility: DestinationId; itemId?: string };

// A visual object always maps to one editable content record. The facility
// overview buttons use no itemId and remain separate from the object buttons.
export const sceneItems = {
  about: [
    { id:'education', label:'Education' },
    { id:'languages', label:'Languages' },
    { id:'international', label:'International Experience' },
    { id:'working-style', label:'Working Style' },
  ],
  experience: [
    { id:'internship-global', label:'Global Marketing' },
    { id:'internship-brand', label:'Brand Strategy' },
    { id:'internship-next', label:'Next Experience' },
  ],
  work: [
    { id:'market-entry', label:'Market Entry' },
    { id:'brand-story', label:'Brand Story' },
    { id:'campaign', label:'Campaign' },
    { id:'research', label:'Research' },
    { id:'launch', label:'Launch' },
  ],
  interests: [
    { id:'travel', label:'Travel' },
    { id:'movies', label:'Movies' },
    { id:'photography', label:'Photography' },
    { id:'food', label:'Food' },
    { id:'curiosity', label:'Curiosity' },
  ],
  contact: [
    { id:'email', label:'Email' },
    { id:'linkedin', label:'Contact Details' },
    { id:'resume', label:'Resume' },
  ],
} as const;

export function getSceneItem(selection: SceneSelection) {
  if (!selection.itemId) return undefined;
  return sceneItems[selection.facility].find(item => item.id === selection.itemId);
}
