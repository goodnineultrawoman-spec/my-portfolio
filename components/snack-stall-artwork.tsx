import type { CSSProperties, ReactNode } from 'react';
import { snackInterests, type SnackInterest } from '@/data/snack-interests';

type InterestId = SnackInterest['id'];
type CounterItemId = Exclude<InterestId, 'balloon'>;

const stallCanvas = { width: 1122, height: 1402 };
const counterLine = { from: { x: 390, y: 861 }, to: { x: 800, y: 847 } };
const counterAnchors: Record<CounterItemId, { x: number; image: [number, number]; contact: [number, number] }> = {
  popcorn: { x: 390, image: [1254, 1254], contact: [651, 1142] },
  soda: { x: 525, image: [1254, 1254], contact: [627, 1157] },
  'ice-cream': { x: 635, image: [1254, 1254], contact: [649, 1188] },
  hotdog: { x: 800, image: [1448, 1086], contact: [924, 950] },
};

function counterStyle(id: InterestId): CSSProperties | undefined {
  if (id === 'balloon') return undefined;
  const anchor = counterAnchors[id];
  const slope = (counterLine.to.y - counterLine.from.y) / (counterLine.to.x - counterLine.from.x);
  const y = counterLine.from.y + (anchor.x - counterLine.from.x) * slope;
  return {
    '--anchor-x': `${anchor.x / stallCanvas.width * 100}%`,
    '--anchor-y': `${y / stallCanvas.height * 100}%`,
    '--origin-x': `${-anchor.contact[0] / anchor.image[0] * 100}%`,
    '--origin-y': `${-anchor.contact[1] / anchor.image[1] * 100}%`,
  } as CSSProperties;
}

export function SnackStallArtwork({
  renderItem,
  emphasizeBalloon = false,
}: {
  renderItem?: (item: SnackInterest, style?: CSSProperties) => ReactNode;
  emphasizeBalloon?: boolean;
}) {
  return <>
    <img className="interests-cart interests-stall-back" src="/assets/snack-detail/snack-stall-base.png" alt="" aria-hidden="true" draggable={false}/>
    <img className="interests-cart interests-stall-lower" src="/assets/snack-detail/snack-stall-base.png" alt="" aria-hidden="true" draggable={false}/>
    {snackInterests.map(item => renderItem
      ? <span key={item.id} className="snack-artwork-item-slot">{renderItem(item, counterStyle(item.id))}</span>
      : item.id === 'balloon' ? null : <span key={item.id} className={`interests-object interests-object-${item.id}`} style={counterStyle(item.id)}>
        <img src={item.illustration} alt="" aria-hidden="true" draggable={false}/>
      </span>)}
    <img className="interests-cart interests-stall-front" src="/assets/snack-detail/snack-stall-base.png" alt="" aria-hidden="true" draggable={false}/>
    <div className={`interests-balloons-placement${emphasizeBalloon ? ' is-emphasized' : ''}`} aria-hidden="true">
      <img className="interests-balloons-layer" src="/assets/snack-detail/snack-balloons.png" alt="" draggable={false}/>
    </div>
    <div className="interests-flag-placement" aria-hidden="true">
      <img className="interests-flag-layer" src="/assets/snack-detail/snack-flag.png" alt="" draggable={false}/>
    </div>
  </>;
}
