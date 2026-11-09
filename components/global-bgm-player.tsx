'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import './global-bgm-player.css';

const targetVolume = 0.15;

export function GlobalBgmPlayer() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const toggleRef = useRef<(() => void) | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [homeControlHost, setHomeControlHost] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setHomeControlHost(pathname === '/' ? document.getElementById('home-music-control') : null);
  }, [pathname]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowHint(false), 5000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let disposed = false;
    let wantsPlayback = false;
    let fadeFrame = 0;
    let playVersion = 0;

    const fadeTo = (volume: number, duration: number, onComplete?: () => void) => {
      cancelAnimationFrame(fadeFrame);
      const initial = audio.volume;
      const started = performance.now();
      const step = (now: number) => {
        if (disposed) return;
        const progress = Math.min((now - started) / duration, 1);
        const eased = progress * progress * (3 - 2 * progress);
        audio.volume = initial + (volume - initial) * eased;
        if (progress < 1) fadeFrame = requestAnimationFrame(step);
        else onComplete?.();
      };
      fadeFrame = requestAnimationFrame(step);
    };

    const toggle = async () => {
      const version = ++playVersion;
      if (wantsPlayback) {
        wantsPlayback = false;
        setIsPlaying(false);
        fadeTo(0, 750, () => audio.pause());
        return;
      }

      wantsPlayback = true;
      cancelAnimationFrame(fadeFrame);
      audio.volume = 0;
      try {
        await audio.play();
        if (disposed || version !== playVersion) return;
        setIsPlaying(true);
        fadeTo(targetVolume, 1250);
      } catch {
        if (disposed || version !== playVersion) return;
        wantsPlayback = false;
        setIsPlaying(false);
      }
    };
    toggleRef.current = () => { void toggle(); };

    return () => {
      disposed = true;
      toggleRef.current = null;
      cancelAnimationFrame(fadeFrame);
      audio.pause();
    };
  }, []);

  const button = <button
      type="button"
      className={`bgm-toggle${isPlaying ? ' is-playing' : ''}`}
      aria-label={isPlaying ? 'Turn background music off' : 'Turn background music on'}
      aria-pressed={isPlaying}
      onClick={() => {
        setShowHint(false);
        toggleRef.current?.();
      }}
    >
      <span className="bgm-toggle-note" aria-hidden="true">♪</span>
      {showHint && <span className="bgm-toggle-hint" aria-hidden="true">点这里播放音乐</span>}
    </button>;

  return <>
    <audio ref={audioRef} src="/audio/paper-moon.mp3" loop preload="none"/>
    {homeControlHost ? createPortal(button, homeControlHost) : button}
  </>;
}
