'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { coasterExperiences, type CoasterExperience } from '@/data/coaster-experiences';
import { CoasterTrainArtwork } from '@/components/coaster-train-artwork';

type ExperienceId = CoasterExperience['id'];
const illustration = { width: 1448, height: 1086 };
const notePosition: Record<ExperienceId, { x: number; y: number }> = {
  baidu: { x: 160, y: 10 },
  'pixel-punk': { x: 1070, y: 150 },
};

export function ExperienceDetailScene() {
  const [activeId, setActiveId] = useState<ExperienceId | null>(null);
  const [previewId, setPreviewId] = useState<ExperienceId | null>(null);
  const [lineStarts, setLineStarts] = useState<Record<ExperienceId, { x: number; y: number }> | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<Record<ExperienceId, HTMLButtonElement | null>>({ baidu: null, 'pixel-punk': null });
  const detailRefs = useRef<Record<ExperienceId, HTMLElement | null>>({ baidu: null, 'pixel-punk': null });
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => { headingRef.current?.focus(); }, []);

  useEffect(() => {
    const art = artRef.current;
    if (!art) return;
    const observer = new ResizeObserver(() => {
      if (!art.clientWidth || !art.clientHeight) return;
      const starts = {} as Record<ExperienceId, { x: number; y: number }>;
      for (const item of coasterExperiences) {
        const note = noteRefs.current[item.id];
        const copy = note?.querySelector<HTMLElement>('.experience-note-copy');
        if (!note || !copy) return;
        const x = note.offsetLeft + copy.offsetLeft + (item.id === 'baidu' ? copy.offsetWidth + 4 : copy.offsetWidth / 2);
        const y = note.offsetTop + copy.offsetTop + copy.offsetHeight + 4;
        starts[item.id] = {
          x: x / art.clientWidth * illustration.width,
          y: y / art.clientHeight * illustration.height,
        };
      }
      setLineStarts(starts);
    });
    observer.observe(art);
    for (const item of coasterExperiences) {
      const note = noteRefs.current[item.id];
      const copy = note?.querySelector('.experience-note-copy');
      if (note) observer.observe(note);
      if (copy) observer.observe(copy);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setActiveId(null);
      requestAnimationFrame(() => {
        lastTriggerRef.current?.focus({ preventScroll: true });
        if (window.matchMedia('(min-width: 851px)').matches) {
          document.querySelector('.experience-stage')?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            block: 'start',
          });
        }
      });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeId]);

  function toggle(id: ExperienceId, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    const isDesktop = window.matchMedia('(min-width: 851px)').matches;
    const nextId = isDesktop ? id : activeId === id ? null : id;
    setActiveId(nextId);
    if (nextId) requestAnimationFrame(() => {
      const detail = detailRefs.current[nextId];
      detail?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: isDesktop ? 'start' : 'nearest',
      });
      if (isDesktop) detail?.focus({ preventScroll: true });
    });
  }

  function returnToOverview() {
    setActiveId(null);
    requestAnimationFrame(() => {
      lastTriggerRef.current?.focus({ preventScroll: true });
      document.querySelector('.experience-stage')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
      });
    });
  }

  function renderEmphasis(text: string, phrases: string[], keyPrefix: string) {
    const parts: (string | React.ReactElement)[] = [];
    let cursor = 0;
    const matches = phrases
      .map((phrase, index) => ({ phrase, index, start: text.indexOf(phrase) }))
      .filter(match => match.start >= 0)
      .sort((a, b) => a.start - b.start);
    matches.forEach(match => {
      if (match.start < cursor) return;
      parts.push(text.slice(cursor, match.start));
      parts.push(<strong className="type-emphasis" key={`${keyPrefix}-${match.index}`}>{match.phrase}</strong>);
      cursor = match.start + match.phrase.length;
    });
    parts.push(text.slice(cursor));
    return parts;
  }

  const pointStyle = (point: { x: number; y: number }) => ({
    left: `${point.x / illustration.width * 100}%`,
    top: `${point.y / illustration.height * 100}%`,
  });

  return <main className="carousel-detail experience-detail">
    <nav className="detail-nav" aria-label="场景导航">
      <Link href="/" onClick={() => sessionStorage.setItem('return-to-coaster', '1')} className="return-map">← 返回地图</Link>
      <span className="experience-mobile-only">02 / Experience</span>
    </nav>
    <header className="detail-heading">
      <h1 ref={headingRef} tabIndex={-1} className="type-page-title detail-heading-english">EXPERIENCE</h1>
      <p className="detail-heading-chinese">实习经历</p>
      <p className="detail-heading-guide">沿着轨道，看看我的经历 →</p>
      <span className="experience-mobile-only">Along the way</span>
    </header>

    <section className={`experience-stage${activeId ? ' is-detail-open' : ''}`} aria-label="过山车与两段实习经历">
      <div className="experience-overview">
      <div className="experience-art" ref={artRef}>
        <CoasterTrainArtwork loop/>
        <svg className="experience-connectors" viewBox="0 0 1448 1086" aria-hidden="true">
          {coasterExperiences.map(item => <g key={item.id} className={`experience-connector${activeId === item.id ? ' is-active' : ''}${previewId === item.id ? ' is-preview' : ''}`}>
            {lineStarts && <path d={`M ${lineStarts[item.id].x} ${lineStarts[item.id].y} L ${item.point.x} ${item.point.y}`}/>}
            <circle cx={item.point.x} cy={item.point.y} r="3"/>
          </g>)}
        </svg>
        {coasterExperiences.map(item => <button
          key={`point-${item.id}`}
          type="button"
          className={`experience-node${activeId === item.id ? ' is-active' : ''}${previewId === item.id ? ' is-preview' : ''}`}
          style={pointStyle(item.point)}
          aria-label={`查看 ${item.company} 详细经历`}
          aria-controls={`experience-${item.id}`}
          aria-pressed={activeId === item.id}
          onMouseEnter={() => setPreviewId(item.id)}
          onMouseLeave={() => setPreviewId(null)}
          onFocus={() => setPreviewId(item.id)}
          onBlur={() => setPreviewId(null)}
          onClick={event => toggle(item.id, event.currentTarget)}
        ><span aria-hidden="true"/></button>)}
        {coasterExperiences.map(item => <button
          key={`note-${item.id}`}
          type="button"
          className={`experience-note experience-note-${item.id}${activeId === item.id ? ' is-active' : ''}${previewId === item.id ? ' is-preview' : ''}`}
          ref={element => { noteRefs.current[item.id] = element; }}
          style={pointStyle(notePosition[item.id])}
          aria-controls={`experience-${item.id}`}
          aria-pressed={activeId === item.id}
          onMouseEnter={() => setPreviewId(item.id)}
          onMouseLeave={() => setPreviewId(null)}
          onFocus={() => setPreviewId(item.id)}
          onBlur={() => setPreviewId(null)}
          onClick={event => toggle(item.id, event.currentTarget)}
        >
          <span className="experience-note-number">{item.number}</span>
          <span className="experience-note-copy">
            <span className="experience-note-company type-section-title">{item.company}</span>
            <span className="experience-note-role">{item.role}</span>
            <span className="experience-note-meta">{item.period}</span>
          </span>
        </button>)}
      </div>
      <div className="experience-mobile-list" aria-label="实习经历目录">
        {coasterExperiences.map(item => <button
          key={`mobile-${item.id}`}
          type="button"
          className={`experience-mobile-entry${activeId === item.id ? ' is-active' : ''}`}
          aria-controls={`experience-${item.id}`}
          aria-expanded={activeId === item.id}
          onClick={event => toggle(item.id, event.currentTarget)}
        >
          <span className="experience-note-number">{item.number}</span>
          <span className="experience-note-copy"><span className="experience-note-company">{item.company}</span><span className="experience-note-meta">{item.role} · {item.period}</span><span className="experience-note-summary">{renderEmphasis(item.summary, item.summaryEmphasis, `${item.id}-summary`)}</span></span>
        </button>)}
      </div>
      </div>
      {activeId && <button type="button" className="experience-focus-backdrop" aria-label="返回 Experience 总览" onClick={returnToOverview}/>}
      <div className="experience-detail-list">
        {coasterExperiences.map(item => <section
          id={`experience-${item.id}`}
          key={item.id}
          ref={element => { detailRefs.current[item.id] = element; }}
          className={`experience-expanded experience-detail-article${activeId === item.id ? ' is-active' : ''}`}
          tabIndex={-1}
          aria-labelledby={`experience-title-${item.id}`}
        >
          {activeId === item.id && <button type="button" className="experience-return" onClick={returnToOverview}>← 返回 Experience</button>}
          <p className="experience-expanded-number">{item.number} / Experience</p>
          <h2 id={`experience-title-${item.id}`} className="type-section-title">{item.company}</h2>
          <p className="experience-expanded-meta">{item.role}｜{item.period}</p>
          <p className="experience-introduction type-body-text">{item.introduction}</p>
          <div className="experience-detail-sections">
            {item.sections.map(section => <article className="experience-detail-section" key={section.number}>
              <header className="experience-detail-section-heading">
                <span className="experience-detail-section-number">{section.number}</span>
                <h3 className="type-primary-text">{section.title}</h3>
              </header>
              {section.paragraphs?.map((paragraph, index) => <p className="type-body-text" key={index}>{renderEmphasis(paragraph, section.emphasis ?? [], `${item.id}-${section.number}-${index}`)}</p>)}
              {section.links && <div className="experience-links">{section.links.map(link => <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.href}>{link.label} ↗</a>)}</div>}
            </article>)}
          </div>
        </section>)}
      </div>
    </section>
  </main>;
}
