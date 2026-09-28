'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import './global-bgm-player.css';

const targetVolume = 0.15;
const preferenceKey = 'portfolioBgmEnabled';

export function GlobalBgmPlayer() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<(() => void) | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [homeControlHost, setHomeControlHost] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setHomeControlHost(pathname === '/' ? document.getElementById('home-music-control') : null);
  }, [pathname]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let disposed = false;
    let userDisabled = false;
    let playing = false;
    let fadeFrame = 0;
    let fallbackInstalled = false;
    let fallbackUsed = false;
    let playVersion = 0;

    const savePreference = (enabled: boolean) => {
      try { sessionStorage.setItem(preferenceKey, String(enabled)); } catch { /* Storage is optional. */ }
    };

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

    const removeFallback = () => {
      if (!fallbackInstalled) return;
      fallbackInstalled = false;
      for (const type of ['pointerdown', 'click', 'touchstart', 'keydown']) {
        document.removeEventListener(type, onFirstInteraction, true);
      }
    };

    const attemptPlay = (allowFallback: boolean) => {
      if (disposed || userDisabled || playing) return;
      const version = ++playVersion;
      audio.volume = 0;
      let result: Promise<void>;
      try {
        result = audio.play();
      } catch {
        if (version !== playVersion) return;
        if (allowFallback) installFallback();
        return;
      }
      void result.then(() => {
        if (disposed || userDisabled) {
          audio.pause();
          return;
        }
        if (version !== playVersion) return;
        playing = true;
        setIsPlaying(true);
        removeFallback();
        fadeTo(targetVolume, 1250);
      }).catch(() => {
        if (disposed || userDisabled || version !== playVersion) return;
        setIsPlaying(false);
        if (allowFallback) installFallback();
      });
    };

    function onFirstInteraction(event: Event) {
      if (buttonRef.current?.contains(event.target as Node)) return;
      if (event instanceof KeyboardEvent && (event.key === 'Tab' || event.key === 'Escape')) return;
      fallbackUsed = true;
      removeFallback();
      if (!userDisabled && !playing) attemptPlay(false);
    }

    function installFallback() {
      if (fallbackInstalled || fallbackUsed || userDisabled || disposed) return;
      fallbackInstalled = true;
      for (const type of ['pointerdown', 'click', 'touchstart', 'keydown']) {
        document.addEventListener(type, onFirstInteraction, true);
      }
    }

    toggleRef.current = () => {
      if (playing) {
        ++playVersion;
        userDisabled = true;
        playing = false;
        setIsPlaying(false);
        savePreference(false);
        removeFallback();
        fadeTo(0, 750, () => { if (userDisabled) audio.pause(); });
      } else {
        userDisabled = false;
        savePreference(true);
        removeFallback();
        attemptPlay(false);
      }
    };

    try { userDisabled = sessionStorage.getItem(preferenceKey) === 'false'; } catch { /* Default to an autoplay attempt. */ }
    if (!userDisabled) {
      installFallback();
      attemptPlay(true);
    }

    return () => {
      disposed = true;
      ++playVersion;
      toggleRef.current = null;
      removeFallback();
      cancelAnimationFrame(fadeFrame);
    };
  }, []);

  const button = <button
      ref={buttonRef}
      type="button"
      className={`bgm-toggle${isPlaying ? ' is-playing' : ''}`}
      aria-label={isPlaying ? 'Turn background music off' : 'Turn background music on'}
      aria-pressed={isPlaying}
      onClick={() => toggleRef.current?.()}
    >
      <span className="bgm-toggle-note" aria-hidden="true">♪</span>
      <span className="bgm-toggle-label" aria-hidden="true">Music {isPlaying ? 'On' : 'Off'}</span>
    </button>;

  return <>
    <audio ref={audioRef} src="/audio/paper-moon.mp3" loop preload="auto"/>
    {homeControlHost ? createPortal(button, homeControlHost) : button}
  </>;
}
