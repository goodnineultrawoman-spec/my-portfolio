import type { ReactNode } from 'react';

const horseNumbers = ['01', '02', '03', '04'] as const;

export function CarouselArtwork({
  horseClassName,
  renderHorseControl,
}: {
  horseClassName?: (number: typeof horseNumbers[number]) => string;
  renderHorseControl?: (number: typeof horseNumbers[number]) => ReactNode;
}) {
  return <>
    <img className="carousel-static" src="/assets/carousel-detail/carousel-static-base.png" alt="" aria-hidden="true" draggable={false}/>
    <img className="carousel-front-poles" src="/assets/carousel-detail/carousel-front-poles.png" alt="" aria-hidden="true" draggable={false}/>
    {horseNumbers.map(number => <div key={number} className={`horse-track horse-track-${number}${horseClassName?.(number) ?? ''}`}>
      <div className="horse-moving">
        <img className="horse-illustration" src={`/assets/carousel-detail/horse-front-${number}.png`} alt="" aria-hidden="true" draggable={false}/>
        {renderHorseControl?.(number)}
      </div>
    </div>)}
    <img className="carousel-canopy" src="/assets/carousel-detail/carousel-canopy-clean.png" alt="" aria-hidden="true" draggable={false}/>
  </>;
}
