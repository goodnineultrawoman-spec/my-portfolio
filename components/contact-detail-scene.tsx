'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { contactHotspots, contactMethods } from '@/data/contact-sections';

type ContactId = (typeof contactHotspots)[number]['id'];
type ContactMethodId = (typeof contactMethods)[number]['id'];

export function ContactDetailScene() {
  const [hoveredHotspot, setHoveredHotspot] = useState<ContactId | null>(null);
  const [copiedId, setCopiedId] = useState<ContactMethodId | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { headingRef.current?.focus(); }, []);
  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  async function copyContact(id: ContactMethodId, value: string) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch {
      const helper = document.createElement('textarea');
      helper.value = value;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      copied = document.execCommand('copy');
      helper.remove();
    }
    if (!copied) return;
    setCopiedId(id);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedId(null), 1800);
  }

  return <main className="carousel-detail contact-detail">
    <nav className="detail-nav" aria-label="场景导航">
      <Link href="/" className="return-map" onClick={() => sessionStorage.setItem('return-to-contact', '1')}>← 返回地图</Link>
      <span>05 / Contact</span>
    </nav>
    <header className="detail-heading">
      <h1 ref={headingRef} tabIndex={-1} className="detail-heading-english">CONTACT</h1>
      <p className="detail-heading-chinese">联系我</p>
      <p className="detail-heading-guide">点点电话和邮筒，来联系我 →</p>
    </header>
    <section className="detail-stage" aria-label="联系亭与联系方式">
      <div className="detail-composition contact-composition">
        <div className="contact-art" aria-label="手绘联系亭，电话和邮筒可以点击">
          <img src="/assets/illustrations/contact-pavilion.png" alt="水彩联系亭，左侧有电话，右侧有邮筒" draggable={false}/>
          {contactHotspots.map(hotspot => <a
            key={hotspot.id}
            href={hotspot.href}
            className={`contact-hotspot contact-hotspot-${hotspot.id}`}
            aria-label={hotspot.actionLabel}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            onFocus={() => setHoveredHotspot(hotspot.id)}
            onBlur={() => setHoveredHotspot(null)}
          ><span className="contact-hotspot-glow" aria-hidden="true"/></a>)}
        </div>
        <aside id="contact-information" className="contact-information" aria-label="联系信息">
          <dl className="contact-fields">
            {contactMethods.map(method => {
              const isHighlighted = hoveredHotspot === 'phone'
                ? method.id === 'phone' || method.id === 'wechat'
                : hoveredHotspot === 'mailbox' && method.id === 'email';
              return <div id={`contact-entry-${method.id}`} className={`contact-entry${isHighlighted ? ' is-highlighted' : ''}`} key={method.id}>
                <dt>{method.label}</dt>
                <dd className="contact-value-row">
                  {method.href ? <a href={method.href}>{method.value}</a> : <span className="contact-value">{method.value}</span>}
                  <button type="button" className="contact-copy" aria-label={method.copyLabel} onClick={() => copyContact(method.id, method.value)}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
                      <rect x="6.5" y="6.5" width="9.5" height="10" rx=".6"/>
                      <path d="M13.5 6.5V3.5H4V13h2.5"/>
                    </svg>
                  </button>
                  <span className="contact-copy-feedback" role="status">{copiedId === method.id ? '已复制' : ''}</span>
                </dd>
              </div>;
            })}
          </dl>
        </aside>
      </div>
    </section>
  </main>;
}
