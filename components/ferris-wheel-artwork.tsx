import type { ReactNode } from 'react';

const cabinAngles = [0, 60, 120, 180, 240, 300];
const assetRoot = '/assets/ferris-detail';

export function FerrisWheelArtwork({ renderCabin }: { renderCabin?: (index: number, src: string) => ReactNode }) {
  return <div className="ferris-visual">
    <img className="ferris-static" src={`${assetRoot}/ferris-static-base-clear.png`} alt="" aria-hidden="true" draggable={false}/>
    <div className="ferris-rotor">
      <img className="ferris-wheel-image" src={`${assetRoot}/ferris-wheel-rotor-clear.png`} alt="" aria-hidden="true" draggable={false}/>
      {cabinAngles.map((angle, index) => {
        const src = `${assetRoot}/ferris-cabin-${String(index + 1).padStart(2, '0')}-clear.png`;
        return <div key={index} className="ferris-cabin-position" style={{ transform: `rotate(${angle}deg) translateY(-31.625cqw) rotate(${-angle}deg)` }}>
          <div className="ferris-cabin-counterturn">
            {renderCabin?.(index, src) ?? <img className="ferris-cabin-decoration" src={src} alt="" aria-hidden="true" draggable={false}/>}
          </div>
        </div>;
      })}
    </div>
  </div>;
}
