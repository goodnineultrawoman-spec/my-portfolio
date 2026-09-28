'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { carouselChapters, type CarouselChapter } from '@/data/carousel-chapters';
import { CarouselArtwork } from '@/components/carousel-artwork';

type ChapterId = CarouselChapter['id'];

export function CarouselDetailScene() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'next' | 'previous'>('next');
  const [previewId, setPreviewId] = useState<ChapterId | null>(null);
  const [hoveredHorseId, setHoveredHorseId] = useState<ChapterId | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const activeId = activeIndex === null ? null : carouselChapters[activeIndex].id;

  useEffect(() => { headingRef.current?.focus(); }, []);

  const closeChapter = useCallback(() => {
    if (activeIndex === null) return;
    const previousId = carouselChapters[activeIndex].id;
    setActiveIndex(null);
    requestAnimationFrame(() => document.getElementById(`chapter-trigger-${previousId}`)?.focus({ preventScroll: true }));
  }, [activeIndex]);

  const navigate = useCallback((step: -1 | 1) => {
    if (activeIndex === null) return;
    const next = activeIndex + step;
    if (next < 0 || next >= carouselChapters.length) return;
    setDirection(step === 1 ? 'next' : 'previous');
    setActiveIndex(next);
    requestAnimationFrame(() => document.querySelector('.about-detail .detail-directory')?.scrollTo({ top: 0 }));
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeChapter(); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, closeChapter, navigate]);

  function toggleChapter(id: ChapterId, fromHorse = false) {
    const index = carouselChapters.findIndex(chapter => chapter.id === id);
    if (activeIndex === index) { closeChapter(); return; }
    setDirection('next');
    setActiveIndex(index);
    if (fromHorse) {
      requestAnimationFrame(() => {
        const button = document.getElementById(`chapter-trigger-${id}`);
        if (!button) return;
        const rect = button.getBoundingClientRect();
        if (rect.top < 12 || rect.bottom > window.innerHeight - 12) {
          button.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            block: 'center',
          });
        }
        button.focus({ preventScroll: true });
      });
    }
  }

  function handleBlankClick(event: MouseEvent<HTMLElement>) {
    if (activeIndex === null) return;
    const target = event.target as Element;
    if (target.closest('.directory-entry, .horse-hit, .detail-page-arrow, .detail-nav')) return;
    closeChapter();
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    if (activeIndex === null || event.touches.length !== 1) return;
    touchStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || activeIndex === null || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.35) navigate(dx < 0 ? 1 : -1);
  }

  function returnToMap() {
    sessionStorage.setItem('return-to-carousel', '1');
  }

  return <main className="carousel-detail about-detail" onClick={handleBlankClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    <nav className="detail-nav" aria-label="场景导航">
      <Link href="/" onClick={returnToMap} className="return-map">← 返回地图</Link>
      <span className="about-mobile-only">01 / About</span>
    </nav>
    <header className="detail-heading">
      <h1 ref={headingRef} tabIndex={-1} className="type-page-title detail-heading-english">ABOUT ME</h1>
      <p className="detail-heading-chinese">关于我</p>
      <p className="detail-heading-guide">点点木马，认识我一下 →</p>
      <span className="about-mobile-only">四个章节，随时翻阅</span>
    </header>
    <section className="detail-stage" aria-label="旋转木马与关于我的章节">
      <div className="detail-composition">
        <div className="detail-art">
          <CarouselArtwork
            horseClassName={number => {
              const item = carouselChapters.find(chapter => chapter.number === number)!;
              return `${activeId === item.id ? ' is-active' : ''}${previewId === item.id ? ' is-preview' : ''}`;
            }}
            renderHorseControl={number => {
              const item = carouselChapters.find(chapter => chapter.number === number)!;
              return <button
                type="button"
                className="horse-hit"
                aria-label={`查看 ${item.englishTitle}，${item.chineseTitle}`}
                aria-controls={`chapter-panel-${item.id}`}
                aria-expanded={activeId === item.id}
                onMouseEnter={() => { setPreviewId(item.id); setHoveredHorseId(item.id); }}
                onMouseLeave={() => { setPreviewId(null); setHoveredHorseId(null); }}
                onFocus={() => { setPreviewId(item.id); setHoveredHorseId(item.id); }}
                onBlur={() => { setPreviewId(null); setHoveredHorseId(null); }}
                onClick={() => toggleChapter(item.id, true)}
              ><span className="horse-caption" aria-hidden="true">{item.englishTitle}</span></button>;
            }}
          />
          <div className="about-horse-annotations" aria-hidden="true">
            {carouselChapters.map(item => <span
              key={item.id}
              className={`about-horse-annotation about-horse-annotation-${item.number}${hoveredHorseId === item.id ? ' is-visible' : ''}`}
            >{item.englishTitle} <span>→</span></span>)}
          </div>
        </div>
        <aside className={`detail-directory${activeIndex !== null ? ' is-focused' : ''}`} aria-label="关于我的四个章节">
          {carouselChapters.map(item => <section
            key={item.id}
            className={`directory-entry${item.id === 'education' ? ' directory-entry-education' : ''}${activeId === item.id ? ' is-active' : ''}${previewId === item.id ? ' is-preview' : ''}`}
          >
            <button
              id={`chapter-trigger-${item.id}`}
              type="button"
              className="directory-trigger"
              aria-controls={`chapter-panel-${item.id}`}
              aria-expanded={activeId === item.id}
              onMouseEnter={() => setPreviewId(item.id)}
              onMouseLeave={() => setPreviewId(null)}
              onFocus={() => setPreviewId(item.id)}
              onBlur={() => setPreviewId(null)}
              onClick={() => toggleChapter(item.id)}
            >
              <span className="directory-number">{item.number}</span>
              <span className="directory-text">
                <span className="directory-english type-section-title">{item.englishTitle}</span>
                <span className="directory-chinese">{item.chineseTitle}</span>
                {item.summary && <span className="directory-summary">{item.summary}</span>}
              </span>
            </button>
            <div id={`chapter-panel-${item.id}`} key={activeId === item.id ? `${item.id}-${direction}` : item.id} className={`directory-detail is-entering-${direction}`} hidden={activeId !== item.id}>
              {item.education && <div className="education-records">
                {item.education.map(entry => <article className="education-record" key={entry.school}>
                  <img className="education-logo" src={entry.logo.src} alt={entry.logo.alt} />
                  <div className="education-record-copy">
                    <h3 className="type-primary-text">{entry.school}</h3>
                    <p className="education-degree">{entry.degree}</p>
                    <p className="education-period">{entry.period}</p>
                    <p className="education-description">{entry.description}</p>
                    {entry.highlights && <div className="education-highlights">
                      <span>Academic Highlights</span>
                      <ul>{entry.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
                    </div>}
                  </div>
                </article>)}
              </div>}
              {item.languages && <div className="about-languages">
                {item.languages.map(language => <div className="about-language" key={language.name}>
                  <h3 className="type-primary-text">{language.name}</h3>
                  <p className="type-meta-text">{language.level}</p>
                </div>)}
              </div>}
              {item.international && <div className="about-places">
                {item.international.map(place => <article className="about-place" key={place.place}>
                  <h3 className="type-primary-text">{place.place}</h3>
                  <p className="about-place-period type-meta-text">{place.period}</p>
                  <div className="about-place-layout">
                    <div className="about-place-copy">{place.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
                    <img src={place.image.src} alt={place.image.alt} loading="lazy" />
                  </div>
                </article>)}
              </div>}
              {item.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {item.facts && <div className="about-facts" aria-label="关于我的一些小事实">
                {item.facts.map(fact => <span className="about-fact" key={fact}>{fact}</span>)}
              </div>}
              {item.image && <img className="directory-image" src={item.image.src} alt={item.image.alt} />}
              {item.externalLink && <a className="directory-link" href={item.externalLink.href} target="_blank" rel="noopener noreferrer">{item.externalLink.label} ↗</a>}
            </div>
          </section>)}
        </aside>
      </div>
    </section>
    {activeIndex !== null && activeIndex > 0 && <button type="button" className="detail-page-arrow detail-page-arrow-prev" aria-label={`上一个章节：${carouselChapters[activeIndex - 1].englishTitle}`} onClick={() => navigate(-1)}>‹</button>}
    {activeIndex !== null && activeIndex < carouselChapters.length - 1 && <button type="button" className="detail-page-arrow detail-page-arrow-next" aria-label={`下一个章节：${carouselChapters[activeIndex + 1].englishTitle}`} onClick={() => navigate(1)}>›</button>}
  </main>;
}
