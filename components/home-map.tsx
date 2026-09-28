'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import layout from '@/data/homepage-layout.json';
import { HomeFacilityArtwork } from '@/components/home-facility-artwork';

type Facility = {
  id: string;
  source: string;
  english: string;
  chinese: string;
  number: string;
  noteXY: [number, number];
  lineStart: [number, number];
  targetRatio: [number, number];
};

const composition = { width: 1900, height: 1320 };
const mapOrigin = { x: 150, y: 180 };
// Three equal paper leaves collapse onto the center leaf during the intro.
const foldEdges = [0, 1 / 3, 2 / 3, 1];

const facilities: Facility[] = [
  { id: 'carousel', source: '旋转木马', english: 'ABOUT ME', chinese: '关于我', number: '01', noteXY: [34, 945], lineStart: [140, 990], targetRatio: [.52, .9] },
  { id: 'coaster', source: '过山车', english: 'EXPERIENCE', chinese: '实习经历', number: '02', noteXY: [925, 65], lineStart: [982, 165], targetRatio: [.3, .12] },
  { id: 'ferris', source: '摩天轮', english: 'MY WORK', chinese: '我的作品', number: '03', noteXY: [1690, 425], lineStart: [1687, 525], targetRatio: [.82, .55] },
  { id: 'snack', source: '零食铺', english: 'INTERESTS', chinese: '兴趣爱好', number: '04', noteXY: [915, 1210], lineStart: [985, 1195], targetRatio: [.53, .93] },
  { id: 'contact', source: '联系亭', english: 'CONTACT', chinese: '联系方式', number: '05', noteXY: [1690, 1200], lineStart: [1688, 1187], targetRatio: [.53, .7] },
];

const facilityBySource = Object.fromEntries(facilities.map(facility => [facility.source, facility])) as Record<string, Facility>;
const facilityHref: Record<string, string> = {
  carousel: '/carousel', coaster: '/experience', ferris: '/ferris-wheel', snack: '/interests', contact: '/contact',
};

export function HomeMap() {
  const router = useRouter();
  const [activeFacility, setActiveFacility] = useState<string | null>(null);
  const [approachingFacility, setApproachingFacility] = useState<string | null>(null);
  const [living, setLiving] = useState(false);
  const [introPhase, setIntroPhase] = useState<'folding' | 'awakening' | 'ready'>('folding');
  const [showWelcome, setShowWelcome] = useState(true);
  const mapScrollRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLAnchorElement>(null);
  const coasterRef = useRef<HTMLAnchorElement>(null);
  const ferrisRef = useRef<HTMLAnchorElement>(null);
  const snackRef = useRef<HTMLAnchorElement>(null);
  const contactRef = useRef<HTMLAnchorElement>(null);
  const introVisitRef = useRef(false);
  const approachTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const approachingRef = useRef(false);

  useLayoutEffect(() => {
    const root = document.documentElement;
    let hasPlayedOpening = false;
    try { hasPlayedOpening = sessionStorage.getItem('openingPlayed') === 'true'; } catch { /* Session storage may be unavailable. */ }
    if (hasPlayedOpening) {
      introVisitRef.current = false;
      root.classList.remove('homepage-intro-play');
    } else if (root.classList.contains('homepage-intro-play')) {
      introVisitRef.current = true;
    }
    if (introVisitRef.current) root.classList.add('homepage-intro-play');

    let cancelled = false;
    let foldFallback: ReturnType<typeof setTimeout> | undefined;
    let awakeningFallback: ReturnType<typeof setTimeout> | undefined;
    let welcomeFallback: ReturnType<typeof setTimeout> | undefined;
    const foldPanel = mapScrollRef.current?.querySelector('.map-fold-panel-3');
    const lastAwakening = mapScrollRef.current?.querySelector('.map-fold-facility-contact .map-fold-facility-art');

    if (window.matchMedia('(min-width: 701px)').matches) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (introVisitRef.current && !reducedMotion) {
        welcomeFallback = setTimeout(() => {
          if (!cancelled) setShowWelcome(false);
        }, 1550);
        // The folded leaves remain the final visual layer; decode their artwork before motion starts.
        const sources = new Set(Array.from(mapScrollRef.current?.querySelectorAll('img[src], image[href]') ?? [])
          .map(image => image.getAttribute('src') ?? image.getAttribute('href'))
          .filter((src): src is string => Boolean(src)));
        const resourcesReady = Promise.allSettled([
          ...Array.from(sources, src => { const image = new Image(); image.src = src; return image.decode(); }),
          document.fonts.ready,
        ]);
        let foldFinished = false;
        let awakeningFinished = false;
        const finishAwakening = () => {
          if (cancelled || awakeningFinished) return;
          awakeningFinished = true;
          if (awakeningFallback) clearTimeout(awakeningFallback);
          setIntroPhase('ready');
          setLiving(true);
          try { sessionStorage.setItem('openingPlayed', 'true'); } catch { /* Keep the map usable without storage. */ }
        };
        const onAwakeningEnd = (event: Event) => {
          if (event.target === lastAwakening && (event as AnimationEvent).animationName === 'map-facility-awaken') finishAwakening();
        };
        lastAwakening?.addEventListener('animationend', onAwakeningEnd);
        const finishFold = () => {
          if (foldFinished) return;
          foldFinished = true;
          if (foldFallback) clearTimeout(foldFallback);
          void resourcesReady.then(() => {
            if (cancelled) return;
            setIntroPhase('awakening');
            awakeningFallback = setTimeout(finishAwakening, 1850);
          });
        };
        const onFoldEnd = (event: Event) => {
          if (event.target === foldPanel && (event as AnimationEvent).animationName === 'map-right-leaf') finishFold();
        };
        foldPanel?.addEventListener('animationend', onFoldEnd);
        // The animation event may have fired before hydration on a slow device.
        foldFallback = setTimeout(finishFold, 4300);
        return () => {
          cancelled = true;
          root.classList.remove('homepage-intro-play');
          foldPanel?.removeEventListener('animationend', onFoldEnd);
          lastAwakening?.removeEventListener('animationend', onAwakeningEnd);
          if (foldFallback) clearTimeout(foldFallback);
          if (awakeningFallback) clearTimeout(awakeningFallback);
          if (welcomeFallback) clearTimeout(welcomeFallback);
          if (approachTimerRef.current) clearTimeout(approachTimerRef.current);
        };
      }
      if (reducedMotion && introVisitRef.current) {
        root.classList.remove('homepage-intro-play');
        try { sessionStorage.setItem('openingPlayed', 'true'); } catch { /* Keep the map usable without storage. */ }
      }
      setShowWelcome(false);
      setIntroPhase('ready');
      setLiving(true);
    } else {
      setShowWelcome(false);
      setIntroPhase('ready');
    }

    return () => {
      cancelled = true;
      root.classList.remove('homepage-intro-play');
      if (welcomeFallback) clearTimeout(welcomeFallback);
      if (approachTimerRef.current) clearTimeout(approachTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => document.documentElement.classList.toggle('homepage-hidden', document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      document.documentElement.classList.remove('homepage-hidden');
    };
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('return-to-carousel') === '1') {
      sessionStorage.removeItem('return-to-carousel');
      requestAnimationFrame(() => carouselRef.current?.focus());
    }
    if (sessionStorage.getItem('return-to-ferris') === '1') {
      sessionStorage.removeItem('return-to-ferris');
      requestAnimationFrame(() => ferrisRef.current?.focus());
    }
    if (sessionStorage.getItem('return-to-coaster') === '1') {
      sessionStorage.removeItem('return-to-coaster');
      requestAnimationFrame(() => coasterRef.current?.focus());
    }
    if (sessionStorage.getItem('return-to-snack') === '1') {
      sessionStorage.removeItem('return-to-snack');
      requestAnimationFrame(() => snackRef.current?.focus());
    }
    if (sessionStorage.getItem('return-to-contact') === '1') {
      sessionStorage.removeItem('return-to-contact');
      requestAnimationFrame(() => contactRef.current?.focus());
    }
  }, []);

  function approach(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!window.matchMedia('(min-width: 701px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (approachingRef.current) return;
    approachingRef.current = true;
    setApproachingFacility(id);
    setActiveFacility(id);
    approachTimerRef.current = setTimeout(() => router.push(facilityHref[id]), 460);
  }

  const interaction = (id: string) => ({
    onMouseEnter: () => setActiveFacility(id),
    onMouseLeave: () => setActiveFacility(current => current === id ? null : current),
    onFocus: () => setActiveFacility(id),
    onBlur: () => setActiveFacility(current => current === id ? null : current),
    onClick: (event: MouseEvent<HTMLAnchorElement>) => approach(event, id),
  });

  return <main className={`map-home${living ? ' is-living' : ''}${approachingFacility ? ' is-approaching' : ''} is-intro-${introPhase}`}>
    {showWelcome && <div className="welcome-intro" aria-hidden="true">
      <div className="welcome-intro-group">
        <span className="welcome-intro-line"/>
        <p>Welcome to my little wonderland.</p>
        <span className="welcome-intro-line"/>
      </div>
    </div>}
    <header className="map-home-header">
      <img className="map-home-portrait" src="/assets/homepage/portrait-watermark.png" alt="" aria-hidden="true" draggable={false}/>
      <h1><span className="map-home-name-desktop"><span className="map-home-name-english">Violeta Hao</span><span className="map-home-name-chinese">郝天娇</span></span><span className="map-home-name-mobile">Tianjiao Hao</span></h1>
      <p className="map-home-cover-subtitle">My little wonderland — made of things I’ve created, places I’ve been, and things I love.</p>
      <p className="map-home-mobile-role">Global Marketing · Brand · GTM</p>
      <div className="map-home-corner">
        <span id="home-music-control" className="map-home-music-slot"/>
        <p className="map-home-hint"><span className="map-home-hint-mobile">在地图里，选一处慢慢逛</span></p>
      </div>
    </header>
    <div className="map-composition">
      <div className="map-scroll" ref={mapScrollRef}>
        <div className="map-canvas" id="park-map" aria-label="手绘游园地图，五个设施分别为独立图层">
          <img className="map-environment" src="/assets/homepage/environment-base.png" alt="游园地图的水面、小桥、树木和小径" draggable={false}/>
          {layout.layers_bottom_to_top.map(layer => {
            const facility = facilityBySource[layer.name];
            const style = {
              left: `${layer.destination_xy[0] / layout.canvas.width * 100}%`,
              top: `${layer.destination_xy[1] / layout.canvas.height * 100}%`,
              width: `${layer.destination_size[0] / layout.canvas.width * 100}%`,
              height: `${layer.destination_size[1] / layout.canvas.height * 100}%`,
            };
            const image = <img className="map-facility-original" src={`/assets/homepage/${layer.file.split('/').at(-1)}`} alt="" draggable={false}/>;
            const className = `map-facility map-facility-${facility.id}${activeFacility === facility.id || approachingFacility === facility.id ? ' is-active' : ''}${approachingFacility === facility.id ? ' is-approaching' : ''}`;
            if (facility.id === 'carousel') return <Link key={facility.id} ref={carouselRef} href="/carousel" className={className} style={style} aria-label="进入旋转木马 · About" {...interaction(facility.id)}>{image}</Link>;
            if (facility.id === 'coaster') return <Link key={facility.id} ref={coasterRef} href="/experience" className={className} style={style} aria-label="进入过山车 · Experience" {...interaction(facility.id)}>{image}</Link>;
            if (facility.id === 'ferris') return <Link key={facility.id} ref={ferrisRef} href="/ferris-wheel" className={className} style={style} aria-label="进入摩天轮 · MY WORK" {...interaction(facility.id)}>{image}</Link>;
            if (facility.id === 'snack') return <Link key={facility.id} ref={snackRef} href="/interests" className={className} style={style} aria-label="进入零食铺 · Interests" {...interaction(facility.id)}>{image}</Link>;
            return <Link key={facility.id} ref={contactRef} href="/contact" className={className} style={style} aria-label="进入联系亭 · Contact" {...interaction(facility.id)}>{image}</Link>;
          })}
        </div>
        <div className="map-fold-intro" aria-hidden="true">
          {foldEdges.slice(0, -1).map((from, index) => {
            const width = foldEdges[index + 1] - from;
            return <div key={index} className={`map-fold-panel map-fold-panel-${index + 1}`} style={{ left: `${from * 100}%`, width: `${width * 100}%` }}>
              <div className="map-fold-printed-face">
                <div className="map-fold-print" style={{ left: `${-from / width * 100}%`, width: `${100 / width}%` }}>
                  <img className="map-fold-environment" src="/assets/homepage/environment-base.png" alt="" draggable={false}/>
                  {layout.layers_bottom_to_top.filter(layer => {
                    const left = layer.destination_xy[0] / layout.canvas.width;
                    const right = (layer.destination_xy[0] + layer.destination_size[0]) / layout.canvas.width;
                    return left < from + width && right > from;
                  }).map(layer => {
                    const facility = facilityBySource[layer.name];
                    return <span key={facility.id} className={`map-fold-facility map-facility-${facility.id}${activeFacility === facility.id || approachingFacility === facility.id ? ' is-active' : ''}${approachingFacility === facility.id ? ' is-approaching' : ''}`} style={{
                      left: `${layer.destination_xy[0] / layout.canvas.width * 100}%`,
                      top: `${layer.destination_xy[1] / layout.canvas.height * 100}%`,
                      width: `${layer.destination_size[0] / layout.canvas.width * 100}%`,
                      height: `${layer.destination_size[1] / layout.canvas.height * 100}%`,
                    }}><span className="map-fold-facility-art"><HomeFacilityArtwork id={facility.id} src={`/assets/homepage/${layer.file.split('/').at(-1)}`} living={living}/></span></span>;
                  })}
                </div>
              </div>
              <div className="map-fold-paper-back"/>
            </div>;
          })}
        </div>
      </div>
      <svg className="map-connectors" viewBox={`0 0 ${composition.width} ${composition.height}`} preserveAspectRatio="none" aria-hidden="true">
        {facilities.map(facility => {
          const layer = layout.layers_bottom_to_top.find(layer => layer.name === facility.source)!;
          const targetX = mapOrigin.x + layer.destination_xy[0] + layer.destination_size[0] * facility.targetRatio[0];
          const targetY = mapOrigin.y + layer.destination_xy[1] + layer.destination_size[1] * facility.targetRatio[1];
          return <g key={facility.id} className={`map-connector${activeFacility === facility.id || approachingFacility === facility.id ? ' is-active' : ''}`}>
            <path d={`M ${facility.lineStart[0]} ${facility.lineStart[1]} L ${targetX} ${targetY}`}/>
            <circle cx={targetX} cy={targetY} r="3.5"/>
          </g>;
        })}
      </svg>
      <nav className="map-notes" aria-label="地图章节">
        {facilities.map(facility => {
          const style = {
            left: `${facility.noteXY[0] / composition.width * 100}%`,
            top: `${facility.noteXY[1] / composition.height * 100}%`,
          };
          const className = `map-note map-note-${facility.id}${activeFacility === facility.id || approachingFacility === facility.id ? ' is-active' : ''}`;
          const content = <>
            <span className="map-note-number">{facility.number}</span>
            <span className="map-note-copy">
              <span className="map-note-title">{facility.english}</span>
              <span className="map-note-rule" aria-hidden="true"/>
              <span className="map-note-subtitle">{facility.chinese}</span>
            </span>
          </>;
          return <Link key={facility.id} href={facilityHref[facility.id]} className={className} style={style} aria-label={`进入${facility.source} · ${facility.english} · ${facility.chinese}`} {...interaction(facility.id)}>{content}</Link>;
        })}
      </nav>
    </div>
  </main>;
}
