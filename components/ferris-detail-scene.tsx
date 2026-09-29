'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { ferrisProjects, photographyAlbums, type FerrisProjectId, type PhotographyAlbumId } from '@/data/ferris-projects';
import { FerrisWheelArtwork } from '@/components/ferris-wheel-artwork';

export function FerrisDetailScene() {
  const [activeId, setActiveId] = useState<FerrisProjectId | null>(null);
  const [closingId, setClosingId] = useState<FerrisProjectId | null>(null);
  const [previewId, setPreviewId] = useState<FerrisProjectId | null>(null);
  const [gallery, setGallery] = useState<PhotographyAlbumId | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [galleryPhotoLoaded, setGalleryPhotoLoaded] = useState(false);
  const [switchDirection, setSwitchDirection] = useState<'next' | 'previous' | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusedRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const adjacentPhotosRef = useRef(new Map<string, HTMLImageElement>());

  const closeProject = useCallback(() => {
    if (!activeId) return;
    const previousId = activeId;
    setActiveId(null);
    setClosingId(previousId);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setClosingId(null), 260);
    requestAnimationFrame(() => document.getElementById('ferris-project-' + previousId)?.focus());
  }, [activeId]);

  const closeGallery = useCallback(() => {
    if (!gallery) return;
    const previousGallery = gallery;
    setGallery(null);
    adjacentPhotosRef.current.clear();
    requestAnimationFrame(() => document.getElementById('work-album-' + previousGallery)?.focus());
  }, [gallery]);

  useEffect(() => { headingRef.current?.focus(); }, []);
  useEffect(() => {
    if (activeId) requestAnimationFrame(() => focusedRef.current?.focus({ preventScroll: true }));
  }, [activeId]);
  useEffect(() => {
    if (gallery) requestAnimationFrame(() => galleryRef.current?.focus({ preventScroll: true }));
  }, [gallery]);
  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const album = gallery ? photographyAlbums[gallery] : null;
  const preloadAdjacentPhotos = useCallback(() => {
    if (!gallery) return;
    const photos = photographyAlbums[gallery].images;
    const neighbors = [photos[(photoIndex - 1 + photos.length) % photos.length], photos[(photoIndex + 1) % photos.length]];
    const keep = new Set(neighbors);
    const cache = adjacentPhotosRef.current;
    for (const src of cache.keys()) if (!keep.has(src)) cache.delete(src);
    for (const src of neighbors) {
      if (cache.has(src)) continue;
      const image = new window.Image();
      image.decoding = 'async';
      image.src = src;
      cache.set(src, image);
      void image.decode().catch(() => {});
    }
  }, [gallery, photoIndex]);
  const advancePhoto = useCallback((step: number) => {
    if (!gallery) return;
    const count = photographyAlbums[gallery].images.length;
    setGalleryPhotoLoaded(false);
    setPhotoIndex(current => (current + step + count) % count);
  }, [gallery]);

  const activeIndex = ferrisProjects.findIndex(project => project.id === activeId);
  const navigateProject = useCallback((step: -1 | 1) => {
    if (!activeId || gallery) return;
    const index = ferrisProjects.findIndex(project => project.id === activeId);
    const next = index + step;
    if (next < 0 || next >= ferrisProjects.length) return;
    setSwitchDirection(step === 1 ? 'next' : 'previous');
    setActiveId(ferrisProjects[next].id);
  }, [activeId, gallery]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (gallery) {
          event.preventDefault();
          closeGallery();
        } else if (activeId) {
          event.preventDefault();
          closeProject();
        }
      } else if (gallery && event.key === 'ArrowLeft') {
        event.preventDefault();
        advancePhoto(-1);
      } else if (gallery && event.key === 'ArrowRight') {
        event.preventDefault();
        advancePhoto(1);
      } else if (activeId && !gallery && event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateProject(-1);
      } else if (activeId && !gallery && event.key === 'ArrowRight') {
        event.preventDefault();
        navigateProject(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeId, gallery, closeProject, closeGallery, advancePhoto, navigateProject]);

  function openProject(id: FerrisProjectId) {
    if (activeId === id) {
      closeProject();
      return;
    }
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setClosingId(null);
    setGallery(null);
    setSwitchDirection(null);
    setActiveId(id);
  }

  function openGallery(id: PhotographyAlbumId) {
    adjacentPhotosRef.current.clear();
    setGalleryPhotoLoaded(false);
    setPhotoIndex(0);
    setGallery(id);
  }

  function handleBlankClick(event: MouseEvent<HTMLElement>) {
    if (!activeId || gallery) return;
    const target = event.target as Element;
    if (target.closest('.ferris-focused-panel, .ferris-cabin-hit, .directory-trigger, .detail-nav, .detail-page-arrow')) return;
    closeProject();
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    if (!activeId || gallery || event.touches.length !== 1 || (event.target as Element).closest('video, button, a')) return;
    touchStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || !activeId || gallery || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.35) navigateProject(dx < 0 ? 1 : -1);
  }

  function returnToMap() {
    sessionStorage.setItem('return-to-ferris', '1');
  }

  const displayedProject = ferrisProjects.find(project => project.id === (activeId ?? closingId));

  return <main className="carousel-detail ferris-detail" onClick={handleBlankClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    <nav className="detail-nav" aria-label="场景导航">
      <Link href="/" onClick={returnToMap} className="return-map">← 返回地图</Link>
      <span>03 / MY WORK</span>
    </nav>
    <header className="detail-heading">
      <h1 ref={headingRef} tabIndex={-1} className="detail-heading-english">MY WORK</h1>
      <p className="detail-heading-chinese">我的作品</p>
      <p className="detail-heading-guide">点开轿厢，看看我的作品 →</p>
    </header>
    <section className="detail-stage" aria-label="摩天轮与我的作品目录" onClick={handleBlankClick}>
      <div className="detail-composition" onClick={handleBlankClick}>
        <div className={'ferris-art' + (activeId ? ' is-focused' : '')} onClick={handleBlankClick}>
          <FerrisWheelArtwork renderCabin={(index, src) => {
            const project = ferrisProjects.find(item => item.cabinIndex === index);
            return project ? <button
              type="button"
              className={'ferris-cabin-hit' + (activeId === project.id ? ' is-active' : '') + (previewId === project.id ? ' is-preview' : '')}
              aria-label={'查看 ' + project.overviewTitle}
              aria-controls="ferris-focus-stage"
              aria-expanded={activeId === project.id}
              onMouseEnter={() => setPreviewId(project.id)}
              onMouseLeave={() => setPreviewId(null)}
              onFocus={() => setPreviewId(project.id)}
              onBlur={() => setPreviewId(null)}
              onClick={() => openProject(project.id)}
            >
              <img src={src} alt="" aria-hidden="true" draggable={false}/>
              <span className="ferris-cabin-caption" aria-hidden="true">{project.overviewTitle}</span>
            </button> : <div className="ferris-cabin-soon" aria-label="Coming soon...">
              <img className="ferris-cabin-decoration" src={src} alt="" aria-hidden="true" draggable={false}/>
              <span className="ferris-cabin-caption" aria-hidden="true">Coming soon...</span>
            </div>;
          }}/>
        </div>
        <aside id="ferris-focus-stage" className={'detail-directory ferris-work-stage' + (activeId ? ' is-expanded' : '')} aria-label="我的作品" onClick={handleBlankClick}>
          {!activeId && <div className="ferris-overview">
            {ferrisProjects.map(project => <section key={project.id} className={'directory-entry' + (previewId === project.id ? ' is-preview' : '')}>
              <button
                id={'ferris-project-' + project.id}
                type="button"
                className="directory-trigger"
                aria-controls="ferris-focus-stage"
                aria-expanded={false}
                onMouseEnter={() => setPreviewId(project.id)}
                onMouseLeave={() => setPreviewId(null)}
                onFocus={() => setPreviewId(project.id)}
                onBlur={() => setPreviewId(null)}
                onClick={() => openProject(project.id)}
              >
                <span className="directory-number">{project.number}</span>
                <span className="directory-text">
                  <span className="directory-english">{project.overviewTitle}</span>
                  <span className="directory-meta type-meta-text">{project.overviewSkills}</span>
                  <span className="directory-year type-meta-text">{project.overviewYear}</span>
                </span>
              </button>
            </section>)}
          </div>}
          {displayedProject && <article
            key={displayedProject.id}
            ref={focusedRef}
            tabIndex={-1}
            className={'ferris-focused-panel' + (!activeId ? ' is-closing' : '') + (activeId && switchDirection ? ' is-switching-' + switchDirection : '') + ' ferris-focused-' + displayedProject.id}
            aria-label={displayedProject.overviewTitle}
            onClick={event => event.stopPropagation()}
          >
            <div className="ferris-focused-layout">
              {displayedProject.image && <figure className="ferris-project-media">
                <img src={displayedProject.image.src} alt={displayedProject.image.alt} loading="lazy"/>
              </figure>}
              {displayedProject.video && <div className="ferris-project-media ferris-video-frame">
                <video controls playsInline preload="metadata" poster={displayedProject.video.poster} aria-label="无穷鹌鹑蛋竖屏广告">
                  <source src={displayedProject.video.src} type="video/mp4"/>
                  您的浏览器暂不支持视频播放。
                </video>
              </div>}
              <div className="ferris-project-copy">
                <span className="ferris-project-number">{displayedProject.number}</span>
                <h2>{displayedProject.title}</h2>
                {displayedProject.subtitle && <p className="ferris-project-subtitle">{displayedProject.subtitle}</p>}
                {displayedProject.tagline && <p className="ferris-project-tagline">{displayedProject.tagline}</p>}
                <div className="ferris-project-body">
                  {displayedProject.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
                {displayedProject.id === 'photography' && <div className="ferris-albums" aria-label="摄影作品集">
                  {(Object.keys(photographyAlbums) as PhotographyAlbumId[]).map((id, index) => <button
                    key={id}
                    id={'work-album-' + id}
                    type="button"
                    className={'ferris-album ferris-album-' + id}
                    onClick={() => openGallery(id)}
                    aria-label={'打开' + photographyAlbums[id].chinese + '摄影作品集'}
                  >
                    <span className="ferris-album-leaf" aria-hidden="true"/>
                    <span className="ferris-album-number">0{index + 1}</span>
                    <span className="ferris-album-english">{photographyAlbums[id].english}</span>
                    <span className="ferris-album-chinese">{photographyAlbums[id].chinese}</span>
                  </button>)}
                </div>}
              </div>
            </div>
          </article>}
        </aside>
      </div>
    </section>
    {activeIndex > 0 && !gallery && <button type="button" className="detail-page-arrow detail-page-arrow-prev" aria-label={`上一个项目：${ferrisProjects[activeIndex - 1].overviewTitle}`} onClick={() => navigateProject(-1)}>‹</button>}
    {activeIndex >= 0 && activeIndex < ferrisProjects.length - 1 && !gallery && <button type="button" className="detail-page-arrow detail-page-arrow-next" aria-label={`下一个项目：${ferrisProjects[activeIndex + 1].overviewTitle}`} onClick={() => navigateProject(1)}>›</button>}
    {gallery && album && <div className="work-gallery-backdrop" onClick={event => {
      event.stopPropagation();
      if (event.target === event.currentTarget) closeGallery();
    }}>
      <div ref={galleryRef} role="dialog" aria-modal="true" aria-label={album.chinese + '摄影作品集'} tabIndex={-1} className="work-gallery-shell" onClick={event => event.stopPropagation()}>
        <div className="work-gallery-heading">
          <span>{album.english} <small>{album.chinese}</small></span>
          <span>{String(photoIndex + 1).padStart(2, '0')} / {String(album.images.length).padStart(2, '0')}</span>
        </div>
        <div className="work-gallery-view">
          <button type="button" className="work-gallery-arrow" aria-label="上一张" onClick={() => advancePhoto(-1)}>←</button>
          <div
            className="work-gallery-image-hit"
            role="button"
            tabIndex={0}
            aria-label="点击照片左半边看上一张，右半边看下一张"
            onClick={event => {
              const rect = event.currentTarget.getBoundingClientRect();
              advancePhoto(event.clientX < rect.left + rect.width / 2 ? -1 : 1);
            }}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                advancePhoto(1);
              }
            }}
          >
            {!galleryPhotoLoaded && <span className="work-gallery-loading" role="status">照片加载中…</span>}
            <img
              key={album.images[photoIndex]}
              className={galleryPhotoLoaded ? 'is-loaded' : undefined}
              src={album.images[photoIndex]}
              alt={album.chinese + '摄影作品 ' + String(photoIndex + 1)}
              fetchPriority="high"
              decoding="async"
              onLoad={() => { setGalleryPhotoLoaded(true); preloadAdjacentPhotos(); }}
              onError={() => setGalleryPhotoLoaded(true)}
              draggable={false}
            />
          </div>
          <button type="button" className="work-gallery-arrow" aria-label="下一张" onClick={() => advancePhoto(1)}>→</button>
        </div>
      </div>
    </div>}
  </main>;
}
