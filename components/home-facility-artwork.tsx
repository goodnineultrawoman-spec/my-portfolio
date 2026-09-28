import { CarouselArtwork } from '@/components/carousel-artwork';
import { CoasterTrainArtwork } from '@/components/coaster-train-artwork';
import { FerrisWheelArtwork } from '@/components/ferris-wheel-artwork';
import { SnackStallArtwork } from '@/components/snack-stall-artwork';

export function HomeFacilityArtwork({ id, src, living }: { id: string; src: string; living: boolean }) {
  return <>
    <img className="map-facility-original" src={src} alt="" draggable={false}/>
    {id !== 'contact' && <div className={`map-facility-animated home-${id}-art${id === 'snack' ? ' interests-art' : ''}`} aria-hidden="true">
      {id === 'carousel' && <CarouselArtwork/>}
      {id === 'coaster' && <CoasterTrainArtwork className="home-coaster-svg" loop playing={living}/>}
      {id === 'ferris' && <FerrisWheelArtwork/>}
      {id === 'snack' && <SnackStallArtwork/>}
    </div>}
  </>;
}
