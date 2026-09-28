'use client';

import { useEffect, useRef } from 'react';

const assetRoot = '/assets/coaster-detail';

export function CoasterTrainArtwork({ className = 'experience-motion-svg', loop = false, playing = true }: { className?: string; loop?: boolean; playing?: boolean }) {
  const trainRef = useRef<SVGGElement>(null);
  const trainPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const train = trainRef.current;
    const path = trainPathRef.current;
    if (!train || !path) return;

    const length = path.getTotalLength();
    const placeTrain = (progress: number) => {
      const distance = length * progress;
      const position = path.getPointAtLength(distance);
      const before = path.getPointAtLength(Math.max(0, distance - 1));
      const after = path.getPointAtLength(Math.min(length, distance + 1));
      const tangent = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
      train.setAttribute('transform', `translate(${position.x} ${position.y}) rotate(${tangent - 38} 630 248)`);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      placeTrain(1);
      return;
    }

    if (!playing) {
      placeTrain(0);
      train.style.opacity = '1';
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const duration = 2600;
    const hold = 1100;
    const fade = 260;
    const cycle = duration + hold + fade * 2;
    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = loop ? (now - start) % cycle : Math.min(now - start, duration);
      if (elapsed < duration) {
        const fraction = elapsed / duration;
        placeTrain(.5 - Math.cos(Math.PI * fraction) / 2);
        train.style.opacity = '1';
      } else if (elapsed < duration + hold) {
        placeTrain(1);
        train.style.opacity = '1';
      } else if (elapsed < duration + hold + fade) {
        placeTrain(1);
        train.style.opacity = String(1 - (elapsed - duration - hold) / fade);
      } else {
        placeTrain(0);
        train.style.opacity = String((elapsed - duration - hold - fade) / fade);
      }
      if (loop || now - start < duration) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loop, playing]);

  return <svg className={className} viewBox="0 0 1448 1086" preserveAspectRatio="none" role="img" aria-label="水彩过山车轨道与行驶的小火车">
    <g transform="translate(90 40) scale(0.94)">
      <image href={`${assetRoot}/coaster-track-motion.png`} x="0" y="0" width="1448" height="1086"/>
      <path ref={trainPathRef} d="M 0 0 C 20 15 50 43 70 60" fill="none" stroke="none"/>
      <g ref={trainRef}>
        <image href={`${assetRoot}/coaster-train-motion.png`} x="459" y="108" width="341" height="281"/>
      </g>
    </g>
  </svg>;
}
