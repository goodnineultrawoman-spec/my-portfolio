'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { snackInterests } from '@/data/snack-interests';
import { concertPhotos, exhibitionPhotos, newThingsActivities, theaterPhotos, travelPhotos } from '@/data/interests-media';
import { SnackStallArtwork } from '@/components/snack-stall-artwork';

type InterestPhoto = (typeof travelPhotos)[number];
type Direction = 'next' | 'previous';
const pageTransitionMs = 300;

// Both desktop compositions fit their visual area without cropping photographs.
const travelPhotoPositions: CSSProperties[] = [
  { left: '1%', top: '2%', width: '20%' },
  { left: '25%', top: '5%', width: '20%' },
  { left: '50%', top: '68%', width: '22%' },
  { left: '2%', top: '80%', width: '20%' },
  { left: '76%', top: '6%', width: '22%' },
  { left: '50%', top: '25%', width: '20%' },
  { left: '76%', top: '29%', width: '20%' },
  { left: '2%', top: '41%', width: '20%' },
  { left: '26%', top: '43%', width: '20%' },
  { left: '26%', top: '80%', width: '20%' },
  { left: '50%', top: '1%', width: '22%' },
  { left: '76%', top: '61%', width: '22%' },
];

const exhibitionPhotoPositions: CSSProperties[] = [
  { left: '0%', top: '5%', width: '11.6%' },
  { left: '14.5%', top: '0%', width: '12.5%' },
  { left: '29%', top: '7%', width: '11.8%' },
  { left: '43.5%', top: '3%', width: '12.3%' },
  { left: '58%', top: '6%', width: '11.7%' },
  { left: '72.5%', top: '0%', width: '12%' },
  { left: '86%', top: '4%', width: '10.6%' },
  { left: '1.5%', top: '51%', width: '12.1%' },
  { left: '16%', top: '55%', width: '11.4%' },
  { left: '30%', top: '50%', width: '12.4%' },
  { left: '44%', top: '52%', width: '10.5%' },
  { left: '57.5%', top: '56%', width: '12.1%' },
  { left: '72.5%', top: '51%', width: '11.5%' },
  { left: '86.5%', top: '55%', width: '12.1%' },
];

const theaterPhotoPositions: Record<number, CSSProperties> = {
  1: { left: '15%', top: '0%', width: '8.8%' },
  2: { left: '60%', top: '35%', width: '9.5%' },
  3: { left: '16%', top: '71%', width: '12%' },
  4: { left: '42%', top: '1%', width: '11.6%' },
  5: { left: '3%', top: '37%', width: '13%' },
  6: { left: '62%', top: '72%', width: '12%' },
  7: { left: '0%', top: '2%', width: '11.6%' },
  8: { left: '24%', top: '34%', width: '9.5%' },
  9: { left: '70%', top: '0%', width: '11.5%' },
  10: { left: '32%', top: '69%', width: '8.8%' },
  11: { left: '84%', top: '6%', width: '11.8%' },
  12: { left: '0%', top: '72%', width: '12%' },
  13: { left: '27%', top: '5%', width: '11.8%' },
  14: { left: '78%', top: '38%', width: '13%' },
  15: { left: '46%', top: '72%', width: '12%' },
  16: { left: '79%', top: '74%', width: '13%' },
  17: { left: '56%', top: '4%', width: '11.5%' },
  18: { left: '40%', top: '39%', width: '14%' },
};

// Portraits and landscape scenes share similar visual weight across two loose rows.
const concertPhotoPositions: CSSProperties[] = [
  { left: '1%', top: '3%', width: '10%' },
  { left: '38%', top: '8%', width: '10%' },
  { left: '58%', top: '54%', width: '10%' },
  { left: '16%', top: '0%', width: '17%' },
  { left: '36%', top: '59%', width: '17%' },
  { left: '73%', top: '52%', width: '18%' },
  { left: '21%', top: '51%', width: '10%' },
  { left: '52%', top: '2%', width: '17%' },
  { left: '75%', top: '7%', width: '10%' },
  { left: '0%', top: '57%', width: '17%' },
  { left: '87%', top: '10%', width: '13%' },
];

function TravelMap() {
  return <div className="interests-travel-map" onClick={event => event.stopPropagation()}>
    <img src="/assets/interests/handdrawn-world-map-new.png" alt="标有旅行星标的手绘地图" width={1774} height={887} draggable={false}/>
    <div className="interests-travel-places type-meta-text">
      <span>我曾经去过的地方：</span>
      <span>中国（20个省市及地区） · 日本 · 韩国 · 新加坡 · 英国 · 西班牙 · 葡萄牙 · 法国 · 德国 · 捷克 · 奥地利 · 匈牙利 · 意大利 · 荷兰 · 瑞士 · 挪威 · 瑞典 · 冰岛</span>
    </div>
  </div>;
}

function PhotoField({
  kind,
  onOpen,
}: {
  kind: 'travel' | 'exhibitions';
  onOpen: (photo: InterestPhoto, trigger: HTMLButtonElement) => void;
}) {
  const photos = kind === 'travel' ? travelPhotos : exhibitionPhotos;
  return <div className={`interests-photo-field interests-photo-field-${kind}`} aria-label={kind === 'travel' ? '旅行照片' : '看展照片'} onClick={event => event.stopPropagation()}>
    {photos.map((photo, index) => <button
      key={photo.src}
      type="button"
      className={`interests-photo interests-taped-photo interests-photo-${index + 1}`}
      style={kind === 'travel' ? travelPhotoPositions[index] : exhibitionPhotoPositions[index]}
      aria-label={`放大${photo.alt}`}
      onClick={event => onOpen(photo, event.currentTarget)}
    ><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" draggable={false}/></button>)}
  </div>;
}

function TheaterWall({ onOpen }: { onOpen: (photo: InterestPhoto, trigger: HTMLButtonElement) => void }) {
  return <div className="interests-theater-wall" aria-label="看过的剧目照片" onClick={event => event.stopPropagation()}>
    {theaterPhotos.map(photo => <figure
      key={photo.src}
      className={`interests-theater-item interests-theater-item-${photo.id}`}
      style={theaterPhotoPositions[photo.id]}
    >
      <button type="button" className="interests-theater-photo interests-taped-photo" aria-label={`放大${photo.alt}`} onClick={event => onOpen(photo, event.currentTarget)}>
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" draggable={false}/>
      </button>
      <figcaption className="interests-theater-caption type-meta-text"><span className={photo.foreign ? 'is-foreign' : undefined}>{photo.title}</span> / {photo.place}</figcaption>
    </figure>)}
  </div>;
}

function ConcertWall({ onOpen }: { onOpen: (photo: InterestPhoto, trigger: HTMLButtonElement) => void }) {
  return <div className="interests-photo-field-concerts" aria-label="演唱会照片" onClick={event => event.stopPropagation()}>
    {concertPhotos.map((photo, index) => <button
      key={photo.src}
      type="button"
      className="interests-photo interests-taped-photo"
      style={concertPhotoPositions[index]}
      aria-label="放大演唱会照片"
      onClick={event => onOpen(photo, event.currentTarget)}
    ><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" draggable={false}/></button>)}
  </div>;
}

function NewThingsWall({ onOpen }: { onOpen: (photo: InterestPhoto, trigger: HTMLButtonElement) => void }) {
  return <div className="interests-new-things-wall" aria-label="尝试新鲜事的照片" onClick={event => event.stopPropagation()}>
    {newThingsActivities.map(activity => <figure key={activity.id} className={`interests-new-things-group interests-new-things-group-${activity.id}`}>
      {activity.photos.map((photo, index) => <button key={photo.src} type="button" className={`interests-new-things-frame interests-new-things-frame-${activity.id}-${index} interests-taped-photo`} aria-label={`放大${activity.label}照片`} onClick={event => onOpen(photo, event.currentTarget)}>
        <img
          className="interests-new-things-photo"
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          draggable={false}
        />
      </button>)}
      <figcaption className="interests-new-things-label type-meta-text">{activity.label}</figcaption>
    </figure>)}
  </div>;
}

function InterestPage({
  index,
  motion,
  onPhotoOpen,
}: {
  index: number;
  motion: string;
  onPhotoOpen: (photo: InterestPhoto, trigger: HTMLButtonElement) => void;
}) {
  const interest = snackInterests[index];
  const pageEnglishTitle = interest.englishTitle;
  const isLeaving = motion.startsWith('is-leaving');
  return <article
    id={isLeaving ? undefined : 'interest-focused-page'}
    className={`interests-page interests-page-${interest.id} ${motion}`}
    aria-label={`${pageEnglishTitle} · ${interest.chineseTitle}`}
    aria-hidden={isLeaving || undefined}
  >
    <header className="interests-page-heading" onClick={event => event.stopPropagation()}>
      <span className="interests-page-count type-meta-text">{interest.number} / 05</span>
      <h2 className="interests-page-title type-section-title">{pageEnglishTitle}</h2>
      <p className="interests-page-subtitle type-primary-text">{interest.chineseTitle}</p>
    </header>
    {index === 0 && <div className="interests-travel-content">
      <TravelMap/>
      <PhotoField kind="travel" onOpen={onPhotoOpen}/>
    </div>}
    {index === 1 && <PhotoField kind="exhibitions" onOpen={onPhotoOpen}/>}
    {index === 2 && <ConcertWall onOpen={onPhotoOpen}/>}
    {index === 3 && <TheaterWall onOpen={onPhotoOpen}/>}
    {index === 4 && <NewThingsWall onOpen={onPhotoOpen}/>}
    {interest.personalText && <p className="interests-page-personal type-body-text" onClick={event => event.stopPropagation()}>{interest.personalText}</p>}
  </article>;
}

export function InterestsDetailScene() {
  const [activeInterestIndex, setActiveInterestIndex] = useState<number | null>(null);
  const [leavingInterestIndex, setLeavingInterestIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>('next');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<InterestPhoto | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lastPhotoRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const focusBackdropRef = useRef<HTMLElement>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionLockedRef = useRef(false);

  useEffect(() => { headingRef.current?.focus(); }, []);
  useEffect(() => {
    if (activeInterestIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeInterestIndex]);
  useEffect(() => {
    if (lightboxPhoto) requestAnimationFrame(() => lightboxRef.current?.focus({ preventScroll: true }));
  }, [lightboxPhoto]);
  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxPhoto(null);
    requestAnimationFrame(() => lastPhotoRef.current?.focus({ preventScroll: true }));
  }, []);

  const closeInterest = useCallback(() => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionLockedRef.current = false;
    setLeavingInterestIndex(null);
    setActiveInterestIndex(null);
    requestAnimationFrame(() => lastTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  const navigate = useCallback((step: -1 | 1) => {
    if (activeInterestIndex === null || lightboxPhoto || transitionLockedRef.current) return;
    const next = activeInterestIndex + step;
    if (next < 0 || next >= snackInterests.length) return;
    transitionLockedRef.current = true;
    setLeavingInterestIndex(activeInterestIndex);
    setDirection(step === 1 ? 'next' : 'previous');
    setActiveInterestIndex(next);
    if (focusBackdropRef.current) focusBackdropRef.current.scrollTop = 0;
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setLeavingInterestIndex(null);
      transitionLockedRef.current = false;
    }, pageTransitionMs);
  }, [activeInterestIndex, lightboxPhoto]);

  useEffect(() => {
    if (activeInterestIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (lightboxPhoto) closeLightbox();
        else closeInterest();
      } else if (!lightboxPhoto && event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(-1);
      } else if (!lightboxPhoto && event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeInterestIndex, lightboxPhoto, closeLightbox, closeInterest, navigate]);

  function openInterest(index: number, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setLightboxPhoto(null);
    setLeavingInterestIndex(null);
    setDirection('next');
    setActiveInterestIndex(index);
  }

  function openPhoto(photo: InterestPhoto, trigger: HTMLButtonElement) {
    lastPhotoRef.current = trigger;
    setLightboxPhoto(photo);
  }

  function handleFocusBackdropClick(event: MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget || !lightboxPhoto) closeInterest();
  }

  return <main className="carousel-detail interests-detail">
    <nav className="detail-nav" aria-label="场景导航">
      <Link href="/" className="return-map" onClick={() => sessionStorage.setItem('return-to-snack', '1')}>← 返回地图</Link>
      <span>04 / Interests</span>
    </nav>
    <header className="detail-heading">
      <h1 ref={headingRef} tabIndex={-1} className="detail-heading-english">INTERESTS</h1>
      <p className="detail-heading-chinese">兴趣爱好</p>
      <p className="detail-heading-guide">点点气球和零食，看看我喜欢什么 →</p>
    </header>
    <section className="detail-stage" aria-label="零食铺与兴趣目录">
      <div className="detail-composition interests-composition">
        <div className="interests-art" aria-label="手绘零食铺和五个可点击的小物件">
          <SnackStallArtwork emphasizeBalloon={previewIndex === 0 || activeInterestIndex === 0} renderItem={(item, style) => {
            const index = snackInterests.indexOf(item);
            return <button
              key={item.id}
              type="button"
              className={`interests-object interests-object-${item.id}${activeInterestIndex === index ? ' is-active' : ''}${previewIndex === index ? ' is-preview' : ''}`}
              style={style}
              aria-label={`进入 ${item.englishTitle} · ${item.chineseTitle}`}
              aria-controls="interest-focused-page"
              aria-expanded={activeInterestIndex === index}
              onMouseEnter={() => setPreviewIndex(index)}
              onMouseLeave={() => setPreviewIndex(null)}
              onFocus={() => setPreviewIndex(index)}
              onBlur={() => setPreviewIndex(null)}
              onClick={event => openInterest(index, event.currentTarget)}
            >{item.id !== 'balloon' && <img src={item.illustration} alt="" aria-hidden="true" draggable={false}/>}</button>;
          }}/>
        </div>
        <aside className="detail-directory interests-directory" aria-label="兴趣爱好目录">
          {snackInterests.map((item, index) => <section key={item.id} className={`directory-entry${activeInterestIndex === index ? ' is-active' : ''}${previewIndex === index ? ' is-preview' : ''}`}>
            <button
              id={`interest-${item.id}`}
              type="button"
              className="directory-trigger"
              aria-controls="interest-focused-page"
              aria-expanded={activeInterestIndex === index}
              onMouseEnter={() => setPreviewIndex(index)}
              onMouseLeave={() => setPreviewIndex(null)}
              onFocus={() => setPreviewIndex(index)}
              onBlur={() => setPreviewIndex(null)}
              onClick={event => openInterest(index, event.currentTarget)}
            >
              <span className="directory-number">{item.number}</span>
              <span className="directory-text">
                <span className="directory-english">{item.englishTitle}</span>
                <span className="directory-chinese">{item.chineseTitle}</span>
              </span>
            </button>
          </section>)}
        </aside>
      </div>
    </section>
    {activeInterestIndex !== null && <section ref={focusBackdropRef} className="interests-focus-backdrop" aria-label="兴趣内容" onClick={handleFocusBackdropClick}>
      <div className="interests-focus-stage">
        {leavingInterestIndex !== null && <InterestPage
          index={leavingInterestIndex}
          motion={direction === 'next' ? 'is-leaving-left' : 'is-leaving-right'}
          onPhotoOpen={openPhoto}
        />}
        <InterestPage
          key={activeInterestIndex}
          index={activeInterestIndex}
          motion={direction === 'next' ? 'is-entering-right' : 'is-entering-left'}
          onPhotoOpen={openPhoto}
        />
      </div>
      {activeInterestIndex > 0 && <button
        type="button"
        className="interests-page-arrow interests-page-arrow-prev"
        aria-label={`上一个兴趣：${snackInterests[activeInterestIndex - 1].chineseTitle}`}
        onClick={event => { event.stopPropagation(); navigate(-1); }}
      >‹</button>}
      {activeInterestIndex < snackInterests.length - 1 && <button
        type="button"
        className="interests-page-arrow interests-page-arrow-next"
        aria-label={`下一个兴趣：${snackInterests[activeInterestIndex + 1].chineseTitle}`}
        onClick={event => { event.stopPropagation(); navigate(1); }}
      >›</button>}
    </section>}
    {lightboxPhoto && <div
      className="interests-lightbox"
      role="presentation"
      onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) closeLightbox(); }}
    >
      <div ref={lightboxRef} className="interests-lightbox-image" role="dialog" aria-modal="true" aria-label={lightboxPhoto.alt} tabIndex={-1} onClick={event => event.stopPropagation()}>
        <img src={lightboxPhoto.src} alt={lightboxPhoto.alt} width={lightboxPhoto.width} height={lightboxPhoto.height}/>
      </div>
    </div>}
  </main>;
}
